import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

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

// Create or update about profile - requires authentication
export const upsert = mutation({
  args: {
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
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("aboutProfile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const data = {
      ...args,
      userId,
      updatedAt: new Date().toISOString(),
    };

    if (existing) {
      // Verify ownership
      if (existing.userId !== userId) {
        throw new Error("Not authorized to update this profile");
      }
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("aboutProfile", data);
    }
  },
});
