import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get wishlist item by ID
export const getById = query({
  args: { wishlistId: v.id("wishlist") },
  handler: async (ctx, { wishlistId }) => {
    return await ctx.db.get(wishlistId);
  },
});

// Update just the cover URL
export const updateCover = mutation({
  args: {
    wishlistId: v.id("wishlist"),
    coverUrl: v.string(),
  },
  handler: async (ctx, { wishlistId, coverUrl }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const item = await ctx.db.get(wishlistId);
    if (!item) {
      throw new Error("Wishlist item not found");
    }

    await ctx.db.patch(wishlistId, { coverUrl });
    return wishlistId;
  },
});

// Get wishlist for a specific user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get all wishlist items (for public pages - read only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("wishlist").collect();
  },
});

// Add to wishlist - requires authentication
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
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("wishlist", { ...args, userId });
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

// Clear bought status (requires auth - admin only)
export const clearBought = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      boughtBy: undefined,
      boughtAt: undefined,
    });
  },
});

// Remove from wishlist - requires authentication (any authenticated user can delete - they're family/parents)
export const remove = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

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
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const results = [];
    for (const update of updates) {
      const item = await ctx.db.get(update.wishlistId);
      if (!item) {
        results.push({ id: update.wishlistId, error: "Not found" });
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

// Admin cover update - no auth required (for CLI maintenance scripts)
export const adminPatchCover = mutation({
  args: {
    wishlistId: v.id("wishlist"),
    coverUrl: v.string(),
  },
  handler: async (ctx, { wishlistId, coverUrl }) => {
    const item = await ctx.db.get(wishlistId);
    if (!item) {
      throw new Error("Wishlist item not found");
    }
    await ctx.db.patch(wishlistId, { coverUrl });
    return { wishlistId, title: item.title, oldUrl: item.coverUrl, newUrl: coverUrl };
  },
});
