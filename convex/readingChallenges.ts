import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("readingChallenges")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    target: v.number(),
    current: v.number(),
    type: v.union(v.literal("books"), v.literal("pages"), v.literal("genres")),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    completed: v.boolean(),
    badge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("readingChallenges", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("readingChallenges"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    target: v.optional(v.number()),
    current: v.optional(v.number()),
    endDate: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    badge: v.optional(v.string()),
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
  args: { id: v.id("readingChallenges") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
