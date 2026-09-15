import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { isAdmin, requireAdmin } from "./authGuards";
import { isAllowedCoverUrl } from "./validation";

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

// Cap on un-reviewed submissions — each pending row schedules an email,
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
      throw new Error("Suggestion box is full — please try again later");
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
