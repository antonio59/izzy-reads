import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get the about profile (public - for displaying on public pages)
export const get = query({
  args: {},
  handler: async (ctx) => {
    // Get the first about profile (there should only be one for Izzy)
    const profile = await ctx.db.query("aboutProfile").first();
    return profile;
  },
});

// Get about profile by user ID
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aboutProfile")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Create or update about profile
export const upsert = mutation({
  args: {
    userId: v.id("users"),
    isPublished: v.boolean(),
    bio: v.string(),
    favoriteGenres: v.array(v.string()),
    favoriteAuthors: v.array(v.string()),
    whyIRead: v.string(),
    funFacts: v.array(v.string()),
    currentlyReading: v.optional(v.string()),
    readingGoals: v.array(v.string()),
    achievements: v.array(v.string()),
    heroTagline: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aboutProfile")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const data = {
      ...args,
      updatedAt: new Date().toISOString(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("aboutProfile", data);
    }
  },
});

// Update just the published status
export const setPublished = mutation({
  args: {
    userId: v.id("users"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aboutProfile")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isPublished: args.isPublished,
        updatedAt: new Date().toISOString(),
      });
    }
  },
});

// Update currently reading
export const updateCurrentlyReading = mutation({
  args: {
    userId: v.id("users"),
    currentlyReading: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aboutProfile")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        currentlyReading: args.currentlyReading,
        updatedAt: new Date().toISOString(),
      });
    }
  },
});
