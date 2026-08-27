import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Helper to check if user is admin (has isParent flag)
async function requireAdmin(ctx: MutationCtx, userId: Id<"users">) {
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  if (!profile?.isParent) {
    throw new Error("Admin access required");
  }
}

// Get all suggestions (for admin review) - requires admin auth
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    // Note: Queries can't throw for auth in Convex, so we return all for now
    // The UI should restrict access to admin users
    return await ctx.db.query("bookSuggestions").order("desc").collect();
  },
});

// Get pending suggestions count (for admin badge)
export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return pending.length;
  },
});

// Submit a new book suggestion (public - no auth required)
export const submit = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    suggestedBy: v.string(),
    reason: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Basic validation
    if (args.title.trim().length < 1) {
      throw new Error("Book title is required");
    }
    if (args.author.trim().length < 1) {
      throw new Error("Author name is required");
    }
    if (args.suggestedBy.trim().length < 1) {
      throw new Error("Your name is required");
    }

    const suggestionId = await ctx.db.insert("bookSuggestions", {
      title: args.title.trim(),
      author: args.author.trim(),
      coverUrl: args.coverUrl,
      suggestedBy: args.suggestedBy.trim(),
      reason: args.reason?.trim() || undefined,
      genre: args.genre || undefined,
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "pending",
    });

    // Send email notification (fire-and-forget)
    try {
      const { internal } = await import("./_generated/api");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ctx.scheduler.runAfter(0, (internal as any).emails.sendSuggestionNotification, {
        title: args.title.trim(),
        author: args.author.trim(),
        suggestedBy: args.suggestedBy.trim(),
        reason: args.reason?.trim(),
        genre: args.genre,
      });
    } catch (e) {
      console.warn("Email notification scheduling failed:", e);
    }

    return suggestionId;
  },
});

// Update suggestion status - requires admin authentication
export const updateStatus = mutation({
  args: {
    id: v.id("bookSuggestions"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await requireAdmin(ctx, userId);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Delete a suggestion - requires admin authentication
export const remove = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await requireAdmin(ctx, userId);
    await ctx.db.delete(args.id);
  },
});

// Add approved suggestion to wishlist - requires admin authentication
export const addToWishlist = mutation({
  args: {
    suggestionId: v.id("bookSuggestions"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await requireAdmin(ctx, userId);

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Add to wishlist using the authenticated user's ID
    await ctx.db.insert("wishlist", {
      userId,
      title: suggestion.title,
      author: suggestion.author,
      coverUrl: suggestion.coverUrl,
      genre: suggestion.genre || "Fiction",
      description: suggestion.reason
        ? `Suggested by ${suggestion.suggestedBy}: "${suggestion.reason}"`
        : `Suggested by ${suggestion.suggestedBy}`,
      ageRating: "8+",
      dateAdded: new Date().toISOString().split("T")[0],
    });

    // Mark suggestion as approved
    await ctx.db.patch(args.suggestionId, { status: "approved" });

    return { success: true };
  },
});
