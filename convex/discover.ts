/* eslint-disable @typescript-eslint/no-explicit-any */
declare const process: { env: Record<string, string | undefined> };
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get user's reading profile for recommendations
export const getReadingProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const books = await ctx.db.query("books").collect();
    const readBooks = books.filter((b) => b.isRead);

    // Count genre frequency
    const genreCounts: Record<string, number> = {};
    for (const book of readBooks) {
      const genre = book.genre || "Other";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      // Highly rated count double
      if ((book.rating ?? 0) >= 4) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    }

    // Get top authors
    const authorCounts: Record<string, number> = {};
    for (const book of readBooks) {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    }

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    const topAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([author]) => author);

    // Get highly rated book titles for "similar to" searches
    const highlyRated = readBooks
      .filter((b) => (b.rating ?? 0) >= 4)
      .slice(0, 5)
      .map((b) => b.title);

    return {
      totalRead: readBooks.length,
      topGenres,
      topAuthors,
      highlyRated,
    };
  },
});

// Get all swiped book IDs for the user
export const getSwipedIds = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const swipes = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return swipes.map((s) => s.googleBookId);
  },
});

// Get existing book keys (to exclude from recommendations)
export const getExistingBookKeys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const books = await ctx.db.query("books").collect();
    const wishlistItems = await ctx.db.query("wishlist").collect();

    const keys = [
      ...books.map((b) => `${b.title.toLowerCase().trim()}::${b.author.toLowerCase().trim()}`),
      ...wishlistItems.map((w) => `${w.title.toLowerCase().trim()}::${w.author.toLowerCase().trim()}`),
    ];

    return keys;
  },
});

// Keywords that indicate content is NOT appropriate for readers under 13
const ADULT_CONTENT_KEYWORDS = [
  "erotica", "adult fiction", "mature", "sexual", "explicit",
  "graphic novels - adult", "adult content", "nsfw", "pornographic",
  "erotic romance", "adult only", "18+", "xxx", "adult themes",
];

function isAgeAppropriateBackend(categories: string[], title: string): boolean {
  const allText = [...categories, title].join(" ").toLowerCase();
  return !ADULT_CONTENT_KEYWORDS.some((kw) => allText.includes(kw.toLowerCase()));
}

async function fetchFromGoogleBooks(query: string, startIndex: number, apiKey?: string): Promise<any[]> {
  try {
    const keyParam = apiKey ? `&key=${apiKey}` : "";
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&startIndex=${startIndex}&orderBy=relevance&langRestrict=en${keyParam}`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) {
      console.error(`Google Books API returned ${res.status}: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (data.error) {
      console.error("Google Books API error:", data.error);
      return [];
    }

    return (data.items ?? [])
      .map((item: Record<string, any>) => {
        const imageLinks = item.volumeInfo?.imageLinks ?? {};
        const rawCoverUrl = (
          imageLinks.extraLarge ??
          imageLinks.large ??
          imageLinks.medium ??
          imageLinks.thumbnail ??
          imageLinks.smallThumbnail ??
          ""
        ).replace("http://", "https://");

        let coverUrl = rawCoverUrl;
        try {
          if (rawCoverUrl) {
            const u = new URL(rawCoverUrl);
            if (
              u.hostname.includes("books.google") ||
              u.hostname.includes("googleusercontent.com")
            ) {
              u.searchParams.delete("edge");
              u.searchParams.set("zoom", "3");
              coverUrl = u.toString();
            }
          } else if (item.id) {
            // Search results often omit large imageLinks — build a zoom-3 cover from volume id
            coverUrl = `https://books.google.com/books/content?id=${encodeURIComponent(item.id)}&printsec=frontcover&img=1&zoom=3&source=gbs_api`;
          }
        } catch {
          /* leave as-is */
        }

        const identifiers = (item.volumeInfo?.industryIdentifiers ?? []) as Array<{
          type: string;
          identifier: string;
        }>;
        const isbn =
          identifiers.find((id) => id.type === "ISBN_13")?.identifier ||
          identifiers.find((id) => id.type === "ISBN_10")?.identifier;
        if (!coverUrl && isbn) {
          coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
        }

        return {
          googleBookId: item.id as string,
          title: (item.volumeInfo?.title as string) || "Unknown Title",
          author:
            ((item.volumeInfo?.authors as string[]) ?? []).join(", ") ||
            "Unknown Author",
          coverUrl,
          pageCount: (item.volumeInfo?.pageCount as number) ?? 0,
          description: (item.volumeInfo?.description as string) ?? "",
          categories: (item.volumeInfo?.categories as string[]) ?? [],
        };
      })
      .filter((book: any) =>
        isAgeAppropriateBackend(book.categories ?? [], book.title),
      );
  } catch (err) {
    console.error("Google Books fetch failed:", err);
    return [];
  }
}

async function fetchFromOpenLibrary(query: string, limit: number): Promise<any[]> {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) {
      console.error(`OpenLibrary API returned ${res.status}: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const docs = (data.docs ?? []) as any[];

    return docs
      .map((doc) => {
        const isbn = (doc.isbn ?? [])[0] as string | undefined;
        const coverUrl = doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : isbn
            ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
            : "";
        if (!coverUrl) return null;
        return {
          googleBookId: `ol_${doc.cover_i ?? isbn}`,
          title: doc.title || "Unknown Title",
          author: (doc.author_name ?? []).join(", ") || "Unknown Author",
          coverUrl,
          pageCount: doc.number_of_pages_median ?? 0,
          description: doc.first_sentence?.[0] ?? "",
          categories: doc.subject?.slice(0, 3) ?? [],
        };
      })
      .filter(Boolean)
      .filter((book: any) =>
        isAgeAppropriateBackend(book.categories ?? [], book.title),
      );
  } catch (err) {
    console.error("OpenLibrary fetch failed:", err);
    return [];
  }
}

// Fetch recommendation candidates from Google Books (with OpenLibrary fallback)
export const fetchRecommendations = action({
  args: {
    searchQuery: v.string(),
    startIndex: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const startIndex = args.startIndex ?? 0;

    // Try Google Books first
    let results = await fetchFromGoogleBooks(args.searchQuery, startIndex, apiKey);

    // Fallback to OpenLibrary if Google Books returns nothing (rate limited / no key)
    if (results.length === 0) {
      results = await fetchFromOpenLibrary(args.searchQuery, 20);
    }

    return results;
  },
});

// Record a swipe decision
export const recordSwipe = mutation({
  args: {
    googleBookId: v.string(),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    action: v.union(v.literal("liked"), v.literal("passed")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already swiped
    const existing = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user_googleBookId", (q) =>
        q.eq("userId", userId).eq("googleBookId", args.googleBookId)
      )
      .first();

    if (existing) return existing._id;

    const swipeId = await ctx.db.insert("bookSwipes", {
      userId,
      googleBookId: args.googleBookId,
      title: args.title,
      author: args.author,
      coverUrl: args.coverUrl,
      genre: args.genre,
      pageCount: args.pageCount,
      description: args.description,
      action: args.action,
      addedToWishlist: false,
      createdAt: Date.now(),
    });

    // If liked, auto-add to wishlist
    if (args.action === "liked") {
      // Check if already exists in books or wishlist
      const allBooks = await ctx.db.query("books").collect();
      const allWishlist = await ctx.db.query("wishlist").collect();

      const normalizedTitle = args.title.toLowerCase().trim();
      const normalizedAuthor = args.author.toLowerCase().trim();

      const existsInBooks = allBooks.some(
        (b) =>
          b.title.toLowerCase().trim() === normalizedTitle &&
          b.author.toLowerCase().trim() === normalizedAuthor
      );
      const existsInWishlist = allWishlist.some(
        (w) =>
          w.title.toLowerCase().trim() === normalizedTitle &&
          w.author.toLowerCase().trim() === normalizedAuthor
      );

      if (!existsInBooks && !existsInWishlist) {
        const today = new Date().toISOString().split("T")[0];
        await ctx.db.insert("wishlist", {
          userId,
          title: args.title,
          author: args.author,
          coverUrl: args.coverUrl,
          genre: args.genre || "Other",
          pageCount: args.pageCount,
          description: args.description,
          ageRating: "Everyone",
          dateAdded: today,
        });

        await ctx.db.patch(swipeId, { addedToWishlist: true });
      }
    }

    return swipeId;
  },
});

// Get swipe stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return { liked: 0, passed: 0, addedToWishlist: 0 };

    const swipes = await ctx.db
      .query("bookSwipes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return {
      liked: swipes.filter((s) => s.action === "liked").length,
      passed: swipes.filter((s) => s.action === "passed").length,
      addedToWishlist: swipes.filter((s) => s.addedToWishlist).length,
    };
  },
});
