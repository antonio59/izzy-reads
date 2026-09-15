import { query, mutation, internalQuery, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

const poemReactionTypes = v.union(
  v.literal("love"),
  v.literal("beautiful"),
  v.literal("inspiring"),
  v.literal("funny"),
  v.literal("relatable"),
);

// Get all reactions for a poem (aggregated counts)
export const getPoemReactions = query({
  args: { poemId: v.id("poems") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("poemReactions")
      .withIndex("by_poem", (q) => q.eq("poemId", args.poemId))
      .collect();

    const counts = {
      love: 0,
      beautiful: 0,
      inspiring: 0,
      funny: 0,
      relatable: 0,
    };

    for (const r of reactions) {
      if (r.reactionType in counts) {
        counts[r.reactionType as keyof typeof counts]++;
      }
    }

    return counts;
  },
});

// Check if a visitor has already reacted to a poem
export const getVisitorReaction = query({
  args: {
    poemId: v.id("poems"),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const reaction = await ctx.db
      .query("poemReactions")
      .withIndex("by_poem_visitor", (q) =>
        q.eq("poemId", args.poemId).eq("visitorId", args.visitorId),
      )
      .first();

    return reaction ? reaction.reactionType : null;
  },
});

const VISITOR_ID_RE = /^visitor_[A-Za-z0-9_-]{16,64}$/;

// Add or update a reaction (one reaction per visitor per poem)
export const addReaction = mutation({
  args: {
    poemId: v.id("poems"),
    visitorId: v.string(),
    reactionType: poemReactionTypes,
  },
  handler: async (ctx, args) => {
    if (!VISITOR_ID_RE.test(args.visitorId)) {
      throw new Error("Invalid visitor id");
    }
    const existing = await ctx.db
      .query("poemReactions")
      .withIndex("by_poem_visitor", (q) =>
        q.eq("poemId", args.poemId).eq("visitorId", args.visitorId),
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

    await ctx.db.insert("poemReactions", {
      poemId: args.poemId,
      visitorId: args.visitorId,
      reactionType: args.reactionType,
      createdAt: new Date().toISOString(),
    });

    return { action: "added" };
  },
});

// Get total reaction stats for all poems (for summary emails) - requires auth
export const getAllPoemReactionStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await computePoemReactionStats(ctx);
  },
});

// Internal twin for scheduled emails (no auth context available)
export const getAllPoemReactionStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => await computePoemReactionStats(ctx),
});

async function computePoemReactionStats(ctx: QueryCtx) {
  const allReactions = await ctx.db.query("poemReactions").collect();

    const poemReactions: Record<string, number> = {};
    let totalReactions = 0;

    for (const r of allReactions) {
      const poemId = r.poemId as string;
      poemReactions[poemId] = (poemReactions[poemId] || 0) + 1;
      totalReactions++;
    }

    const topPoems = Object.entries(poemReactions)
      .map(([poemId, count]) => ({ poemId, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalReactions,
      topPoems,
      reactionsByPoem: poemReactions,
    };
}
