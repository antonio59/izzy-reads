import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    bookId: v.optional(v.id("books")),
    dateCreated: v.string(),
    dateModified: v.string(),
    status: v.union(v.literal("draft"), v.literal("pending"), v.literal("published")),
    parentApproved: v.boolean(),
    tags: v.array(v.string()),
    emoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    bookId: v.optional(v.id("books")),
    dateModified: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("pending"), v.literal("published"))),
    parentApproved: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    emoji: v.optional(v.string()),
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
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
