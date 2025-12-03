import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("poems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("poems").collect();
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    emoji: v.optional(v.string()),
    dateCreated: v.string(),
    likes: v.number(),
    template: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("poems", args);
  },
});

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
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("poems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const like = mutation({
  args: { id: v.id("poems") },
  handler: async (ctx, args) => {
    const poem = await ctx.db.get(args.id);
    if (poem) {
      await ctx.db.patch(args.id, { likes: poem.likes + 1 });
    }
  },
});
