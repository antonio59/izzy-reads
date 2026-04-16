import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get active book club (public)
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const club = await ctx.db
      .query("bookClubs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();
    return club || null;
  },
});

// Get all book clubs for admin
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookClubs").order("desc").collect();
  },
});

// Get a specific book club with comments
export const getById = query({
  args: { id: v.id("bookClubs") },
  handler: async (ctx, args) => {
    const club = await ctx.db.get(args.id);
    if (!club) return null;

    const comments = await ctx.db
      .query("bookClubComments")
      .withIndex("by_club", (q) => q.eq("clubId", args.id))
      .order("desc")
      .collect();

    const reactions = await ctx.db
      .query("bookClubReactions")
      .withIndex("by_club", (q) => q.eq("clubId", args.id))
      .collect();

    const reactionCounts = {
      excited: 0,
      reading: 0,
      finished: 0,
      love: 0,
    };

    for (const r of reactions) {
      if (r.reactionType in reactionCounts) {
        reactionCounts[r.reactionType as keyof typeof reactionCounts]++;
      }
    }

    return {
      club,
      comments,
      reactionCounts,
      totalReactions: reactions.length,
    };
  },
});

// Create a new book club - admin only
export const create = mutation({
  args: {
    bookId: v.optional(v.id("books")),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Deactivate any currently active clubs
    const activeClubs = await ctx.db
      .query("bookClubs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    for (const club of activeClubs) {
      await ctx.db.patch(club._id, { isActive: false });
    }

    return await ctx.db.insert("bookClubs", {
      ...args,
      userId,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

// Update a book club - admin only
export const update = mutation({
  args: {
    id: v.id("bookClubs"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    endDate: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    // If activating this club, deactivate others
    if (filteredUpdates.isActive === true) {
      const activeClubs = await ctx.db
        .query("bookClubs")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();

      for (const club of activeClubs) {
        if (club._id !== id) {
          await ctx.db.patch(club._id, { isActive: false });
        }
      }
    }

    await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete a book club - admin only
export const remove = mutation({
  args: { id: v.id("bookClubs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Delete associated comments and reactions
    const comments = await ctx.db
      .query("bookClubComments")
      .withIndex("by_club", (q) => q.eq("clubId", args.id))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const reactions = await ctx.db
      .query("bookClubReactions")
      .withIndex("by_club", (q) => q.eq("clubId", args.id))
      .collect();

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Add a comment to a book club (public)
export const addComment = mutation({
  args: {
    clubId: v.id("bookClubs"),
    visitorName: v.string(),
    passcode: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.visitorName.trim().length < 1) {
      throw new Error("Name is required");
    }
    if (!/^\d{6}$/.test(args.passcode)) {
      throw new Error("Passcode must be exactly 6 digits");
    }
    if (args.content.trim().length < 1) {
      throw new Error("Comment cannot be empty");
    }

    return await ctx.db.insert("bookClubComments", {
      clubId: args.clubId,
      visitorName: args.visitorName.trim(),
      passcode: args.passcode,
      content: args.content.trim(),
      createdAt: new Date().toISOString(),
    });
  },
});

// Add a reaction to a book club (public)
export const addReaction = mutation({
  args: {
    clubId: v.id("bookClubs"),
    visitorName: v.string(),
    passcode: v.string(),
    reactionType: v.union(
      v.literal("excited"),
      v.literal("reading"),
      v.literal("finished"),
      v.literal("love"),
    ),
  },
  handler: async (ctx, args) => {
    if (args.visitorName.trim().length < 1) {
      throw new Error("Name is required");
    }
    if (!/^\d{6}$/.test(args.passcode)) {
      throw new Error("Passcode must be exactly 6 digits");
    }

    const existing = await ctx.db
      .query("bookClubReactions")
      .withIndex("by_club_visitor", (q) =>
        q
          .eq("clubId", args.clubId)
          .eq("visitorName", args.visitorName.trim())
          .eq("passcode", args.passcode),
      )
      .first();

    if (existing) {
      if (existing.reactionType === args.reactionType) {
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      }
      await ctx.db.patch(existing._id, {
        reactionType: args.reactionType,
      });
      return { action: "updated" };
    }

    await ctx.db.insert("bookClubReactions", {
      clubId: args.clubId,
      visitorName: args.visitorName.trim(),
      passcode: args.passcode,
      reactionType: args.reactionType,
      createdAt: new Date().toISOString(),
    });

    return { action: "added" };
  },
});

// Get visitor's reaction for a club
export const getVisitorReaction = query({
  args: {
    clubId: v.id("bookClubs"),
    visitorName: v.string(),
    passcode: v.string(),
  },
  handler: async (ctx, args) => {
    const reaction = await ctx.db
      .query("bookClubReactions")
      .withIndex("by_club_visitor", (q) =>
        q
          .eq("clubId", args.clubId)
          .eq("visitorName", args.visitorName)
          .eq("passcode", args.passcode),
      )
      .first();

    return reaction ? reaction.reactionType : null;
  },
});
