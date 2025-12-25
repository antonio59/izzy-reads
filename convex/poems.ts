import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get poems for a specific user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("poems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get all poems (for public pages - read only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("poems").collect();
  },
});

// Add a poem - requires authentication
export const add = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    emoji: v.optional(v.string()),
    dateCreated: v.string(),
    likes: v.number(),
    template: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("poems", { ...args, userId });
  },
});

// Update a poem - requires authentication and ownership verification
export const update = mutation({
  args: {
    id: v.id("poems"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    emoji: v.optional(v.string()),
    likes: v.optional(v.number()),
    template: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const poem = await ctx.db.get(args.id);
    if (!poem) {
      throw new Error("Poem not found");
    }
    if (poem.userId !== userId) {
      throw new Error("Not authorized to update this poem");
    }

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Remove a poem - requires authentication and ownership verification
export const remove = mutation({
  args: { id: v.id("poems") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const poem = await ctx.db.get(args.id);
    if (!poem) {
      throw new Error("Poem not found");
    }
    if (poem.userId !== userId) {
      throw new Error("Not authorized to delete this poem");
    }

    await ctx.db.delete(args.id);
  },
});

// Like a poem - public action (no auth required)
export const like = mutation({
  args: { id: v.id("poems") },
  handler: async (ctx, args) => {
    const poem = await ctx.db.get(args.id);
    if (poem) {
      await ctx.db.patch(args.id, { likes: poem.likes + 1 });
    }
  },
});
