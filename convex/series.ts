import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { isAdmin, requireUser } from "./authGuards";
import type { Doc } from "./_generated/dataModel";

async function requireOwnedSeries(
  ctx: Parameters<typeof requireUser>[0],
  seriesId: Doc<"bookSeries">["_id"],
  userId: Doc<"bookSeries">["userId"],
): Promise<Doc<"bookSeries">> {
  const series = await ctx.db.get(seriesId);
  if (!series) throw new Error("Series not found");
  if (series.userId !== userId) throw new Error("Not your series");
  return series;
}

// Get all series for the signed-in user
export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return await ctx.db
      .query("bookSeries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Create a new series for the signed-in user
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    bookIds: v.optional(v.array(v.id("books"))),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    return await ctx.db.insert("bookSeries", {
      userId,
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
    const userId = await requireUser(ctx);
    await requireOwnedSeries(ctx, args.id, userId);
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
    const userId = await requireUser(ctx);
    const series = await requireOwnedSeries(ctx, args.seriesId, userId);

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
    const userId = await requireUser(ctx);
    const series = await requireOwnedSeries(ctx, args.seriesId, userId);

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
    const userId = await requireUser(ctx);
    await requireOwnedSeries(ctx, args.seriesId, userId);
    await ctx.db.patch(args.seriesId, {
      bookIds: args.bookIds,
    });
  },
});

// Delete a series
export const remove = mutation({
  args: { id: v.id("bookSeries") },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    await requireOwnedSeries(ctx, args.id, userId);
    await ctx.db.delete(args.id);
  },
});

/** After marking a book read, sync completion for every series that includes it */
export const syncCompletionForBook = mutation({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const book = await ctx.db.get(args.bookId);
    if (!book) return;
    // Only the book's owner (or an admin managing shared content) may
    // trigger a sync on the owner's series.
    if (book.userId !== userId && !(await isAdmin(ctx, userId))) return;

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
