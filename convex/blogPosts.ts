import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get blog posts for a specific user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get all published blog posts (for public pages - read only)
export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

// Get all blog posts (for authenticated users managing the site)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogPosts").collect();
  },
});

// Add a blog post - requires authentication
export const add = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    bookId: v.optional(v.id("books")),
    dateCreated: v.string(),
    dateModified: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.array(v.string()),
    emoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("blogPosts", { ...args, userId });
  },
});

// Update a blog post - requires authentication (any authenticated user can edit - they're family/parents)
export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    bookId: v.optional(v.id("books")),
    dateModified: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    tags: v.optional(v.array(v.string())),
    emoji: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Remove a blog post - requires authentication (any authenticated user can delete - they're family/parents)
export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    await ctx.db.delete(args.id);
  },
});
