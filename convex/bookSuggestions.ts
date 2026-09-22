declare const process: { env: Record<string, string | undefined> };
import {
  query,
  mutation,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { isAdmin, requireAdmin } from "./authGuards";
import { isAllowedCoverUrl } from "./validation";
import { internal } from "./_generated/api";
import { fetchFromGoogleBooks } from "./discover";
import { askJev, type JevQuestion } from "./jev";

// Get all suggestions (for admin review) - admin only
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || !(await isAdmin(ctx, userId))) return null;
    return await ctx.db.query("bookSuggestions").order("desc").collect();
  },
});

// Get pending suggestions count (for admin badge) - admin only
export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || !(await isAdmin(ctx, userId))) return 0;
    const pending = await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return pending.length;
  },
});

// Cap on un-reviewed submissions – each pending row schedules an email,
// so this bounds the notification flood from an unauthenticated caller.
const MAX_PENDING_SUGGESTIONS = 100;

// Submit a new book suggestion (public - no auth required)
export const submit = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    suggestedBy: v.string(),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Basic validation
    if (args.title.trim().length < 1) {
      throw new Error("Book title is required");
    }
    if (args.author.trim().length < 1) {
      throw new Error("Author name is required");
    }
    if (args.suggestedBy.trim().length < 1) {
      throw new Error("Your name is required");
    }

    const pending = await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    if (pending.length >= MAX_PENDING_SUGGESTIONS) {
      throw new Error("Suggestion box is full – please try again later");
    }

    const suggestionId = await ctx.db.insert("bookSuggestions", {
      title: args.title.trim(),
      author: args.author.trim(),
      coverUrl:
        args.coverUrl && isAllowedCoverUrl(args.coverUrl)
          ? args.coverUrl
          : undefined,
      suggestedBy: args.suggestedBy.trim(),
      reason: args.reason?.trim() || undefined,
      genre: args.genre || undefined,
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "pending",
    });

    // Send email notification (fire-and-forget)
    try {
      const { internal } = await import("./_generated/api");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ctx.scheduler.runAfter(0, (internal as any).emails.sendSuggestionNotification, {
        title: args.title.trim(),
        author: args.author.trim(),
        suggestedBy: args.suggestedBy.trim(),
        reason: args.reason?.trim(),
        genre: args.genre,
      });
    } catch (e) {
      console.warn("Email notification scheduling failed:", e);
    }

    // Score the suggestion against Izzy's reading history (fire-and-forget)
    try {
      await ctx.scheduler.runAfter(
        0,
        internal.bookSuggestions.scoreSuggestion,
        { suggestionId },
      );
    } catch (e) {
      console.warn("Match scoring scheduling failed:", e);
    }

    return suggestionId;
  },
});

// Update suggestion status - requires admin authentication
export const updateStatus = mutation({
  args: {
    id: v.id("bookSuggestions"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Delete a suggestion - requires admin authentication
export const remove = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// Add approved suggestion to wishlist - requires admin authentication
export const addToWishlist = mutation({
  args: {
    suggestionId: v.id("bookSuggestions"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Add to wishlist using the authenticated user's ID
    await ctx.db.insert("wishlist", {
      userId,
      title: suggestion.title,
      author: suggestion.author,
      coverUrl:
        suggestion.coverUrl && isAllowedCoverUrl(suggestion.coverUrl)
          ? suggestion.coverUrl
          : undefined,
      genre: suggestion.genre || "Fiction",
      description: suggestion.reason
        ? `Suggested by ${suggestion.suggestedBy}: "${suggestion.reason}"`
        : `Suggested by ${suggestion.suggestedBy}`,
      ageRating: "8+",
      dateAdded: new Date().toISOString().split("T")[0],
    });

    // Mark suggestion as approved
    await ctx.db.patch(args.suggestionId, { status: "approved" });

    return { success: true };
  },
});

// ---------------------------------------------------------------------------
// Jev-powered matching: score each suggestion against Izzy's reading history
// ---------------------------------------------------------------------------

// Bounds for the state sent to Jev – enough history to judge taste without
// blowing the token budget on a large shelf.
const MAX_READ_BOOKS_IN_STATE = 60;
const MAX_SIMILAR_CANDIDATES = 12;
const MAX_SHELF_TITLES = 120;
const MAX_DESCRIPTION_CHARS = 1500;
const MAX_NOTE_CHARS = 200;

const THEME_OPTIONS = [
  "adventure",
  "animals",
  "family and friendship",
  "fantasy and magic",
  "humour",
  "mystery",
  "school life",
  "science and nature",
  "history",
  "sport",
  "real-life issues",
  "other",
];

const round2 = (n: number) => Math.round(n * 100) / 100;

const stripHtml = (s: string) =>
  s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// The suggestion plus the reading history Jev judges it against (internal only).
export const getForScoring = internalQuery({
  args: { suggestionId: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) return null;

    const books = await ctx.db.query("books").collect();
    const readBooks = books
      .filter((b) => b.isRead)
      .sort(
        (a, b) =>
          (b.rating ?? 0) - (a.rating ?? 0) || b._creationTime - a._creationTime,
      )
      .slice(0, MAX_READ_BOOKS_IN_STATE)
      .map((b) => ({
        title: b.title,
        author: b.author,
        genre: b.genre,
        rating: b.rating, // her rating out of 5
        notes: b.notes ? b.notes.slice(0, MAX_NOTE_CHARS) : undefined,
        tags: b.tags,
      }));

    const wishlist = await ctx.db.query("wishlist").collect();
    const shelfAndWishlistTitles = [
      ...books.map((b) => `${b.title} by ${b.author}`),
      ...wishlist.map((w) => `${w.title} by ${w.author}`),
    ].slice(0, MAX_SHELF_TITLES);

    // The reader is whoever owns the shelf (Izzy), not the parent/admin.
    const profiles = await ctx.db.query("userProfiles").collect();
    const ownerCounts = new Map<string, number>();
    for (const b of books) {
      ownerCounts.set(b.userId, (ownerCounts.get(b.userId) ?? 0) + 1);
    }
    const ownerId = [...ownerCounts.entries()].sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];
    const reader =
      profiles.find((p) => p.userId === ownerId) ??
      profiles.find((p) => !p.isParent);

    return {
      suggestion,
      readBooks,
      shelfAndWishlistTitles,
      readerName: reader?.name ?? "the reader",
      readerAge: reader?.age,
    };
  },
});

// Persist the match results on the suggestion (internal only).
export const recordMatch = internalMutation({
  args: {
    suggestionId: v.id("bookSuggestions"),
    description: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    matchConfidence: v.optional(v.number()),
    alreadyReadProbability: v.optional(v.number()),
    contentConcernProbability: v.optional(v.number()),
    similarTo: v.optional(v.string()),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { suggestionId, ...fields } = args;
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, val]) => val !== undefined),
    );
    if (Object.keys(patch).length === 0) return;
    await ctx.db.patch(suggestionId, {
      ...patch,
      matchedAt: new Date().toISOString(),
    });
  },
});

// Fetch a summary for the suggested book, then ask Jev how well it fits
// Izzy's shelf. Scheduled by submit; safe to retry (the patch is idempotent).
export const scoreSuggestion = internalAction({
  args: { suggestionId: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(
      internal.bookSuggestions.getForScoring,
      { suggestionId: args.suggestionId },
    );
    if (!data) return;

    const { suggestion, readBooks, shelfAndWishlistTitles, readerAge } = data;

    // Enrich the suggestion with the published summary from Google Books –
    // shown in the admin review and given to Jev as evidence.
    let description: string | undefined;
    const hits = await fetchFromGoogleBooks(
      `${suggestion.title} ${suggestion.author}`,
      0,
      process.env.GOOGLE_BOOKS_API_KEY,
    );
    const hit = hits.find(
      (h) => typeof h.description === "string" && h.description.trim(),
    );
    if (hit) {
      description = stripHtml(hit.description).slice(0, MAX_DESCRIPTION_CHARS);
    }

    const state = {
      reader: {
        name: data.readerName,
        age: readerAge ?? "unknown",
        // rating is her own score out of 5; notes are her own words
        books_read: readBooks,
        shelf_and_wishlist_titles: shelfAndWishlistTitles,
      },
      suggested_book: {
        title: suggestion.title,
        author: suggestion.author,
        genre: suggestion.genre,
        reason_for_suggestion: suggestion.reason,
        suggested_by: suggestion.suggestedBy,
        description,
      },
    };

    const questions: Record<string, JevQuestion> = {
      taste_match: {
        type: "score",
        instructions:
          "How well does `suggested_book` match the reading taste shown in " +
          "`reader.books_read`? Judge fit on genres, authors, series, themes, " +
          "and reading level – her books and ratings are the evidence, not " +
          "the suggester's claim.",
        criteria: [
          "No match – unrelated to anything she has read: different genres, themes, or age level",
          "Weak match – a small overlap with her reading history",
          "Decent match – shares a genre or theme she reads, but nothing distinctive",
          "Strong match – similar to books she has read and enjoyed",
          "Excellent match – very close to her favourite books, authors, or series",
        ],
      },
      already_read: {
        type: "noul",
        instructions:
          "`suggested_book` is a book the reader has already read, already " +
          "owns, or already has on her wishlist – including the same book " +
          "in a different edition.",
        criteria: {
          true: "It appears in `reader.books_read` or `reader.shelf_and_wishlist_titles`",
          false: "It is a different book from everything listed",
        },
      },
      content_concern: {
        type: "noul",
        instructions:
          "Based on its title, author, genre, and description, " +
          "`suggested_book` is likely too mature for a " +
          `${readerAge ? `${readerAge}-year-old` : "young"} reader – adult ` +
          "themes, explicit content, or written for an adult audience.",
      },
      theme: {
        type: "choice",
        instructions: "Which theme best describes `suggested_book`?",
        criteria: Object.fromEntries(THEME_OPTIONS.map((t) => [t, null])),
      },
    };

    // Which of her reads does it most resemble? Only ask when there are
    // candidates; prefer books she rated highly.
    const rated = readBooks.filter((b) => (b.rating ?? 0) >= 3);
    const similarCandidates = (rated.length >= 3 ? rated : readBooks).slice(
      0,
      MAX_SIMILAR_CANDIDATES,
    );
    if (similarCandidates.length > 0) {
      questions.similar_to = {
        type: "choice",
        instructions:
          "Which book in `reader.books_read` is `suggested_book` most " +
          "similar to? Choose `none` if it does not clearly resemble any " +
          "of them.",
        criteria: {
          none: "Does not clearly resemble any book she has read",
          ...Object.fromEntries(
            similarCandidates.map((b) => [`${b.title} by ${b.author}`, null]),
          ),
        },
      };
    }

    const answers = await askJev(state, questions);

    const tasteMatch = answers?.taste_match;
    const alreadyRead = answers?.already_read;
    const contentConcern = answers?.content_concern;
    const similarTo = answers?.similar_to;
    const theme = answers?.theme;

    await ctx.runMutation(internal.bookSuggestions.recordMatch, {
      suggestionId: args.suggestionId,
      description,
      matchScore:
        tasteMatch?.type === "score" ? round2(tasteMatch.score) : undefined,
      matchConfidence:
        tasteMatch?.type === "score"
          ? round2(tasteMatch.confidence)
          : undefined,
      alreadyReadProbability:
        alreadyRead?.type === "noul" ? round2(alreadyRead.noul) : undefined,
      contentConcernProbability:
        contentConcern?.type === "noul"
          ? round2(contentConcern.noul)
          : undefined,
      similarTo:
        similarTo?.type === "choice" && similarTo.choice !== "none"
          ? similarTo.choice
          : undefined,
      theme:
        theme?.type === "choice" && theme.choice !== "other"
          ? theme.choice
          : undefined,
    });
  },
});
