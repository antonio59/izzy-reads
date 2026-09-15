import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { requireAdmin } from "./authGuards";
import { isAllowedCoverUrl } from "./validation";

// Update just the cover URL - admin only
export const updateCover = mutation({
  args: {
    wishlistId: v.id("wishlist"),
    coverUrl: v.string(),
  },
  handler: async (ctx, { wishlistId, coverUrl }) => {
    await requireAdmin(ctx);
    if (!isAllowedCoverUrl(coverUrl)) {
      throw new Error("Cover URL host is not allowed");
    }

    const item = await ctx.db.get(wishlistId);
    if (!item) {
      throw new Error("Wishlist item not found");
    }

    await ctx.db.patch(wishlistId, { coverUrl });
    return wishlistId;
  },
});

// Get all wishlist items (for public pages - read only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("wishlist").collect();
    const userId = await auth.getUserId(ctx);
    if (userId) return items;
    // Anonymous callers get the public projection — internal bookkeeping
    // fields stay server-side.
    return items.map(({ userId: _u, ...rest }) => ({ ...rest, boughtAt: undefined }));
  },
});

// Add to wishlist - admin only (rows are publicly visible)
export const add = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.string(),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.string(),
    dateAdded: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    if (args.coverUrl && !isAllowedCoverUrl(args.coverUrl)) {
      throw new Error("Cover URL host is not allowed");
    }
    return await ctx.db.insert("wishlist", { ...args, userId });
  },
});

// Bulk add to wishlist - admin only (used by Goodreads import)
export const bulkAdd = mutation({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        author: v.string(),
        coverUrl: v.optional(v.string()),
        isbn: v.optional(v.string()),
        genre: v.string(),
        pageCount: v.optional(v.number()),
        description: v.optional(v.string()),
        ageRating: v.string(),
        dateAdded: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const insertedIds = [];
    for (let item of args.items) {
      if (item.coverUrl && !isAllowedCoverUrl(item.coverUrl)) {
        item = { ...item, coverUrl: undefined };
      }
      const id = await ctx.db.insert("wishlist", { userId, ...item });
      insertedIds.push(id);
    }
    return insertedIds;
  },
});

// Mark a wishlist item as bought (public - no auth required)
export const markAsBought = mutation({
  args: {
    id: v.id("wishlist"),
    boughtBy: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.boughtBy.trim();
    if (name.length < 1) {
      throw new Error("Please enter your name");
    }

    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Wishlist item not found");
    if (item.boughtBy) {
      throw new Error("This book has already been marked as bought!");
    }

    await ctx.db.patch(args.id, {
      boughtBy: name,
      boughtAt: Date.now(),
    });
  },
});

// Undo a bought mark - admin only (recovery from accidental/abusive marks)
export const unmarkBought = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Wishlist item not found");
    await ctx.db.patch(args.id, {
      boughtBy: undefined,
      boughtAt: undefined,
    });
  },
});

// Remove from wishlist - admin only
export const remove = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Wishlist item not found");
    }

    await ctx.db.delete(args.id);
  },
});

// Bulk update cover URLs - admin only
export const bulkUpdateCovers = mutation({
  args: {
    updates: v.array(
      v.object({
        wishlistId: v.id("wishlist"),
        coverUrl: v.string(),
      }),
    ),
  },
  handler: async (ctx, { updates }) => {
    await requireAdmin(ctx);

    const results = [];
    for (const update of updates) {
      const item = await ctx.db.get(update.wishlistId);
      if (!item) {
        results.push({ id: update.wishlistId, error: "Not found" });
        continue;
      }

      if (!isAllowedCoverUrl(update.coverUrl)) {
        results.push({
          id: update.wishlistId,
          title: item.title,
          error: "Cover URL host is not allowed",
        });
        continue;
      }

      await ctx.db.patch(update.wishlistId, { coverUrl: update.coverUrl });
      results.push({
        id: update.wishlistId,
        title: item.title,
        oldUrl: item.coverUrl,
        newUrl: update.coverUrl,
      });
    }
    return results;
  },
});
