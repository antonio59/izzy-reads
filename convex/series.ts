import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all series for a user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookSeries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Create a new series
export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    bookIds: v.optional(v.array(v.id("books"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookSeries", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      bookIds: args.bookIds || [],
      completed: false,
      createdAt: new Date().toISOString(),
    });
  },
});

// Update a series
export const update = mutation({
  args: {
    id: v.id("bookSeries"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    bookIds: v.optional(v.array(v.id("books"))),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Add a book to a series
export const addBook = mutation({
  args: {
    seriesId: v.id("bookSeries"),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const series = await ctx.db.get(args.seriesId);
    if (!series) throw new Error("Series not found");

    // Don't add duplicates
    if (series.bookIds.includes(args.bookId)) {
      return;
    }

    await ctx.db.patch(args.seriesId, {
      bookIds: [...series.bookIds, args.bookId],
    });
  },
});

// Remove a book from a series
export const removeBook = mutation({
  args: {
    seriesId: v.id("bookSeries"),
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const series = await ctx.db.get(args.seriesId);
    if (!series) throw new Error("Series not found");

    await ctx.db.patch(args.seriesId, {
      bookIds: series.bookIds.filter((id) => id !== args.bookId),
    });
  },
});

// Reorder books in a series
export const reorderBooks = mutation({
  args: {
    seriesId: v.id("bookSeries"),
    bookIds: v.array(v.id("books")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.seriesId, {
      bookIds: args.bookIds,
    });
  },
});

// Delete a series
export const remove = mutation({
  args: { id: v.id("bookSeries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/** After marking a book read, sync completion for every series that includes it */
export const syncCompletionForBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.bookId);
    if (!book) return;

    const seriesList = await ctx.db
      .query("bookSeries")
      .withIndex("by_user", (q) => q.eq("userId", book.userId))
      .collect();

    for (const series of seriesList) {
      if (!series.bookIds.includes(args.bookId)) continue;

      const books = await Promise.all(
        series.bookIds.map((id) => ctx.db.get(id)),
      );
      const allRead =
        series.bookIds.length > 0 && books.every((b) => b?.isRead);

      if (allRead !== series.completed) {
        await ctx.db.patch(series._id, { completed: allRead });
      }
    }
  },
});
