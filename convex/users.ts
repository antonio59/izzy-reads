import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

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

/** True when the signed-in user can use Admin (matches AdminPage email gate) */
export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;
    const user = await ctx.db.get(userId);
    const email = (user?.email ?? "").toLowerCase();
    if (email.includes("admin") || email.includes("parent")) return true;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return Boolean(profile?.isParent);
  },
});

// Create user profile (called after signup)
export const createProfile = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    isParent: v.boolean(),
    parentId: v.optional(v.id("users")),
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

    return await ctx.db.insert("userProfiles", {
      userId,
      ...args,
    });
  },
});
