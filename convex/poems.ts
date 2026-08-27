import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import type { Id } from "./_generated/dataModel";

// Get all poems (for public pages - read only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("poems").collect();
  },
});

// Get a poem by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const poem = await ctx.db
      .query("poems")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (poem) return poem;
    // Fallback: try to find by ID for backward compatibility
    try {
      return await ctx.db.get(args.slug as Id<"poems">);
    } catch {
      return null;
    }
  },
});

function createSlug(title: string, existingSlugs: string[]): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
  let slug = base;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

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
    const allPoems = await ctx.db.query("poems").collect();
    const existingSlugs = allPoems.map((p) => p.slug).filter(Boolean) as string[];
    const slug = createSlug(args.title, existingSlugs);
    return await ctx.db.insert("poems", { ...args, userId, slug });
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
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const poem = await ctx.db.get(args.id);
    if (!poem) {
      throw new Error("Poem not found");
    }

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("poems") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const poem = await ctx.db.get(args.id);
    if (!poem) {
      throw new Error("Poem not found");
    }

    await ctx.db.delete(args.id);
  },
});
