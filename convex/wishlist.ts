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
