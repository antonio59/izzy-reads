import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get a book by ID
export const getBookById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, { bookId }) => {
    return await ctx.db.get(bookId);
  },
});

// Update just the cover URL
export const updateBookCover = mutation({
  args: {
    bookId: v.id("books"),
    coverUrl: v.string(),
  },
  handler: async (ctx, { bookId, coverUrl }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    await ctx.db.patch(bookId, { coverUrl });
    return bookId;
  },
});

// Get books for the authenticated user
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return books;
  },
});

// Get all books (for public pages - read only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("books").collect();
  },
});

// Add a book - requires authentication and uses authenticated user's ID
export const add = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.string(),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.string(),
    dateAdded: v.string(),
    dateRead: v.optional(v.string()),
    rating: v.optional(v.number()),
    isRead: v.boolean(),
    notes: v.optional(v.string()),
    giftFrom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("books", { ...args, userId });
  },
});

// Update a book - requires authentication (any authenticated user can edit - they're family/parents)
export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.optional(v.string()),
    dateRead: v.optional(v.string()),
    rating: v.optional(v.number()),
    isRead: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    giftFrom: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(args.id);
    if (!book) {
      throw new Error("Book not found");
    }

    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Remove a book - requires authentication (any authenticated user can delete - they're family/parents)
export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const book = await ctx.db.get(args.id);
    if (!book) {
      throw new Error("Book not found");
    }

    await ctx.db.delete(args.id);
  },
});

// Get books grouped by userId (for debugging/cleanup)
export const getBooksByUserGroups = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    const groups: Record<string, { count: number; titles: string[] }> = {};

    for (const book of books) {
      const key = book.userId;
      if (!groups[key]) {
        groups[key] = { count: 0, titles: [] };
      }
      groups[key].count++;
      groups[key].titles.push(book.title);
    }

    return groups;
  },
});

// Transfer all books to a specific user (for cleanup)
export const transferAllBooksToUser = mutation({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const books = await ctx.db.query("books").collect();
    let transferred = 0;

    for (const book of books) {
      if (book.userId !== args.targetUserId) {
        await ctx.db.patch(book._id, { userId: args.targetUserId });
        transferred++;
      }
    }

    return { transferred, total: books.length };
  },
});

// Bulk add books - requires authentication
export const bulkAdd = mutation({
  args: {
    books: v.array(
      v.object({
        title: v.string(),
        author: v.string(),
        coverUrl: v.optional(v.string()),
        isbn: v.optional(v.string()),
        genre: v.string(),
        pageCount: v.optional(v.number()),
        description: v.optional(v.string()),
        ageRating: v.string(),
        dateAdded: v.string(),
        dateRead: v.optional(v.string()),
        rating: v.optional(v.number()),
        isRead: v.boolean(),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const insertedIds = [];
    for (const book of args.books) {
      const id = await ctx.db.insert("books", {
        userId,
        ...book,
      });
      insertedIds.push(id);
    }
    return insertedIds;
  },
});
