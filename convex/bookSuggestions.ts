import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all suggestions (for admin review)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
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

// Get suggestions by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookSuggestions")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Submit a new book suggestion (public - no auth required)
export const submit = mutation({
  args: {
    title: v.string(),
    author: v.string(),
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

    return await ctx.db.insert("bookSuggestions", {
      title: args.title.trim(),
      author: args.author.trim(),
      suggestedBy: args.suggestedBy.trim(),
      reason: args.reason?.trim() || undefined,
      genre: args.genre || undefined,
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "pending",
    });
  },
});

// Update suggestion status (admin only - should add auth check in production)
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
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Delete a suggestion
export const remove = mutation({
  args: { id: v.id("bookSuggestions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Add approved suggestion to wishlist
export const addToWishlist = mutation({
  args: {
    suggestionId: v.id("bookSuggestions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // Add to wishlist
    await ctx.db.insert("wishlist", {
      userId: args.userId,
      title: suggestion.title,
      author: suggestion.author,
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
