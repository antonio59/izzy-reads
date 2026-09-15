import { query, mutation, internalQuery, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Reaction types
const reactionTypes = v.union(
  v.literal("love"),
  v.literal("amazing"),
  v.literal("mustRead"),
  v.literal("soGood"),
  v.literal("notForMe"),
  v.literal("helpful"),
  v.literal("greatReview"),
  v.literal("agree"),
  v.literal("funny"),
  v.literal("insightful"),
);

// Get all reactions for a book (aggregated counts)
export const getBookReactions = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("bookReactions")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .filter((q) => q.eq(q.field("isReviewReaction"), false))
      .collect();

    // Aggregate counts
    const counts = {
      love: 0,
      amazing: 0,
      mustRead: 0,
      soGood: 0,
      notForMe: 0,
    };

    for (const r of reactions) {
      if (r.reactionType in counts) {
        counts[r.reactionType as keyof typeof counts]++;
      }
    }

    return counts;
  },
});

// Get all review reactions for a book (aggregated counts)
export const getReviewReactions = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("bookReactions")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .filter((q) => q.eq(q.field("isReviewReaction"), true))
      .collect();

    // Aggregate counts
    const counts = {
      helpful: 0,
      greatReview: 0,
      agree: 0,
      funny: 0,
      insightful: 0,
    };

    for (const r of reactions) {
      if (r.reactionType in counts) {
        counts[r.reactionType as keyof typeof counts]++;
      }
    }

    return counts;
  },
});

// Check if a visitor has already reacted to a book
export const getVisitorReaction = query({
  args: {
    bookId: v.id("books"),
    visitorId: v.string(),
    isReviewReaction: v.boolean(),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("bookReactions")
      .withIndex("by_book_visitor", (q) =>
        q.eq("bookId", args.bookId).eq("visitorId", args.visitorId),
      )
      .filter((q) => q.eq(q.field("isReviewReaction"), args.isReviewReaction))
      .collect();

    return reactions.length > 0 ? reactions[0].reactionType : null;
  },
});

// Visitor IDs are self-asserted but must be well-formed and high-entropy.
const VISITOR_ID_RE = /^visitor_[A-Za-z0-9_-]{16,64}$/;

// Add or update a reaction (one reaction per visitor per book/review)
export const addReaction = mutation({
  args: {
    bookId: v.id("books"),
    visitorId: v.string(),
    reactionType: reactionTypes,
    isReviewReaction: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!VISITOR_ID_RE.test(args.visitorId)) {
      throw new Error("Invalid visitor id");
    }

    // Check for existing reaction from this visitor
    const existing = await ctx.db
      .query("bookReactions")
      .withIndex("by_book_visitor", (q) =>
        q.eq("bookId", args.bookId).eq("visitorId", args.visitorId),
      )
      .filter((q) => q.eq(q.field("isReviewReaction"), args.isReviewReaction))
      .first();

    if (existing) {
      // If same reaction, remove it (toggle off)
      if (existing.reactionType === args.reactionType) {
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      }
      // If different reaction, update it
      await ctx.db.patch(existing._id, {
        reactionType: args.reactionType,
      });
      return { action: "updated" };
    }

    // Add new reaction
    await ctx.db.insert("bookReactions", {
      bookId: args.bookId,
      visitorId: args.visitorId,
      reactionType: args.reactionType,
      isReviewReaction: args.isReviewReaction,
      createdAt: new Date().toISOString(),
    });

    return { action: "added" };
  },
});

// Get reaction stats for all books (for Dashboard) - requires auth
export const getAllBookReactionStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await computeBookReactionStats(ctx);
  },
});

// Internal twin for scheduled emails (no auth context available)
export const getAllBookReactionStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => await computeBookReactionStats(ctx),
});

// Get reaction stats for all reviews (for summary emails) - requires auth
export const getAllReviewReactionStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await computeReviewReactionStats(ctx);
  },
});

// Internal twin for scheduled emails (no auth context available)
export const getAllReviewReactionStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => await computeReviewReactionStats(ctx),
});

async function computeBookReactionStats(ctx: QueryCtx) {
  // Get all book reactions (not review reactions)
  const allReactions = await ctx.db
    .query("bookReactions")
    .filter((q) => q.eq(q.field("isReviewReaction"), false))
    .collect();

  // Aggregate by book
  const bookReactions: Record<string, number> = {};
  let totalReactions = 0;

  for (const r of allReactions) {
    const bookId = r.bookId as string;
    bookReactions[bookId] = (bookReactions[bookId] || 0) + 1;
    totalReactions++;
  }

  // Convert to array sorted by count
  const topBooks = Object.entries(bookReactions)
    .map(([bookId, count]) => ({ bookId, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalReactions,
    topBooks,
    reactionsByBook: bookReactions,
  };
}

async function computeReviewReactionStats(ctx: QueryCtx) {
  const allReactions = await ctx.db
    .query("bookReactions")
    .filter((q) => q.eq(q.field("isReviewReaction"), true))
    .collect();

  const reviewReactions: Record<string, number> = {};
  let totalReactions = 0;

  for (const r of allReactions) {
    const bookId = r.bookId as string;
    reviewReactions[bookId] = (reviewReactions[bookId] || 0) + 1;
    totalReactions++;
  }

  const topReviews = Object.entries(reviewReactions)
    .map(([bookId, count]) => ({ bookId, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalReactions,
    topReviews,
    reactionsByReview: reviewReactions,
  };
}
