import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const writingReactionTypes = v.union(
  v.literal("love"),
  v.literal("greatRead"),
  v.literal("inspiring"),
  v.literal("funny"),
  v.literal("agree"),
);

// Get all reactions for a blog post (aggregated counts)
export const getWritingReactions = query({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("writingReactions")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const counts = {
      love: 0,
      greatRead: 0,
      inspiring: 0,
      funny: 0,
      agree: 0,
    };

    for (const r of reactions) {
      if (r.reactionType in counts) {
        counts[r.reactionType as keyof typeof counts]++;
      }
    }

    return counts;
  },
});

// Check if a visitor has already reacted to a post
export const getVisitorReaction = query({
  args: {
    postId: v.id("blogPosts"),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const reaction = await ctx.db
      .query("writingReactions")
      .withIndex("by_post_visitor", (q) =>
        q.eq("postId", args.postId).eq("visitorId", args.visitorId),
      )
      .first();

    return reaction ? reaction.reactionType : null;
  },
});

// Add or update a reaction (one reaction per visitor per post)
export const addReaction = mutation({
  args: {
    postId: v.id("blogPosts"),
    visitorId: v.string(),
    reactionType: writingReactionTypes,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("writingReactions")
      .withIndex("by_post_visitor", (q) =>
        q.eq("postId", args.postId).eq("visitorId", args.visitorId),
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

    await ctx.db.insert("writingReactions", {
      postId: args.postId,
      visitorId: args.visitorId,
      reactionType: args.reactionType,
      createdAt: new Date().toISOString(),
    });

    return { action: "added" };
  },
});

// Get total reaction stats for all writing (for summary emails)
export const getAllWritingReactionStats = query({
  args: {},
  handler: async (ctx) => {
    const allReactions = await ctx.db.query("writingReactions").collect();

    const postReactions: Record<string, number> = {};
    let totalReactions = 0;

    for (const r of allReactions) {
      const postId = r.postId as string;
      postReactions[postId] = (postReactions[postId] || 0) + 1;
      totalReactions++;
    }

    const topPosts = Object.entries(postReactions)
      .map(([postId, count]) => ({ postId, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalReactions,
      topPosts,
      reactionsByPost: postReactions,
    };
  },
});
