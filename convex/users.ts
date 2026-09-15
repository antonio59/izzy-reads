import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { isAdmin } from "./authGuards";

// Get the current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

/** The caller's own profile row, or null when none exists yet. */
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

/** True when the signed-in user can use Admin. */
export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;
    return await isAdmin(ctx, userId);
  },
});

// Create user profile (called after signup)
export const createProfile = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("colorful")),
    ),
    readingGoal: v.optional(v.number()),
    notifications: v.optional(v.boolean()),
    requireApproval: v.optional(v.boolean()),
    contentFilter: v.optional(v.boolean()),
    timeLimit: v.optional(v.number()),
    allowedGenres: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return existing._id;
    }

    // isParent/parentId are never accepted from the client – admin status
    // is granted via ADMIN_EMAILS or by editing the row in the dashboard.
    return await ctx.db.insert("userProfiles", {
      userId,
      ...args,
      isParent: false,
    });
  },
});
