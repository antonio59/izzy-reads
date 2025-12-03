import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.string(),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.string(),
    dateAdded: v.string(),
    dateRead: v.optional(v.string()),
    rating: v.optional(v.number()),
    isRead: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("books", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.optional(v.string()),
    dateRead: v.optional(v.string()),
    rating: v.optional(v.number()),
    isRead: v.optional(v.boolean()),
    notes: v.optional(v.string()),
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
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
