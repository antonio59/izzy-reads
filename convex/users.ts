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

// Get user profile by user ID
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get current user's profile
export const getCurrentProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
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

    // Check if profile already exists
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

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
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

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(args).filter(([, value]) => value !== undefined),
    );

    await ctx.db.patch(profile._id, filteredUpdates);
  },
});

// Mark onboarding as seen
export const setOnboardingSeen = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, { hasSeenOnboarding: true });
  },
});

// Legacy compatibility - get user by email (from auth users table)
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Query the auth users table
    const users = await ctx.db.query("users").collect();
    return users.find((u) => u.email === args.email) || null;
  },
});

// Legacy compatibility - get user by ID
export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Legacy create (now redirects to createProfile)
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
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
      throw new Error("Not authenticated - please sign up first");
    }

    const { email: _email, ...profileArgs } = args;

    // Check if profile already exists
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("userProfiles", {
      userId,
      ...profileArgs,
    });
  },
});

// Legacy update
export const update = mutation({
  args: {
    id: v.id("userProfiles"),
    name: v.optional(v.string()),
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

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});
