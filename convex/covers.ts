// Cover image storage utilities for Convex
import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Store a book cover image in Convex storage
 * This ensures covers never expire (unlike Google Books/Open Library URLs)
 */
export const storeCoverImage = action({
  args: {
    externalUrl: v.string(),
    bookTitle: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { externalUrl, bookTitle }) => {
    try {
      // Fetch the image from the external URL
      const response = await fetch(externalUrl);
      if (!response.ok) {
        console.log(`Failed to fetch cover for "${bookTitle}": ${response.status}`);
        return null;
      }

      // Get the image as a blob
      const blob = await response.blob();
      
      // Validate it's an image
      if (!blob.type.startsWith("image/")) {
        console.log(`Invalid image type for "${bookTitle}": ${blob.type}`);
        return null;
      }

      // Skip if image is too small (likely a placeholder)
      if (blob.size < 1000) {
        console.log(`Image too small for "${bookTitle}": ${blob.size} bytes`);
        return null;
      }

      // Store in Convex storage
      const storageId = await ctx.storage.store(blob);
      
      // Get the URL (this is a stable ID, the URL won't expire)
      const url = await ctx.storage.getUrl(storageId);
      
      console.log(`Stored cover for "${bookTitle}" in Convex storage: ${storageId}`);
      return url;
    } catch (error) {
      console.error(`Error storing cover for "${bookTitle}":`, error);
      return null;
    }
  },
});

/**
 * Delete a cover image from Convex storage (when book is deleted)
 */
export const deleteCoverImage = mutation({
  args: {
    coverUrl: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, { coverUrl }) => {
    if (!coverUrl) return false;
    
    try {
      // Extract storage ID from Convex storage URL
      // URLs look like: https://[deployment].convex.site/api/storage/[storageId]
      const match = coverUrl.match(/\/storage\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const storageId = match[1];
        await ctx.storage.delete(storageId);
        console.log(`Deleted cover image: ${storageId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting cover image:", error);
      return false;
    }
  },
});

/**
 * Check if a URL is a Convex storage URL
 */
export const isConvexStorageUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.includes("convex.site/api/storage") || url.includes("convex.cloud/api/storage");
};

/**
 * Migrate existing book cover to Convex storage
 * Can be called from admin panel or as a one-off script
 */
export const migrateCoverToStorage = action({
  args: {
    bookId: v.id("books"),
    externalUrl: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { bookId, externalUrl }) => {
    // Skip if already a Convex URL
    if (isConvexStorageUrl(externalUrl)) {
      return externalUrl;
    }

    // Store in Convex
    const book = await ctx.runQuery(api.books.getBookById, { bookId });
    if (!book) return null;

    const newUrl = await ctx.runAction(api.covers.storeCoverImage, {
      externalUrl,
      bookTitle: book.title,
    });

    if (newUrl) {
      // Update the book with the new URL
      await ctx.runMutation(api.books.updateBookCover, {
        bookId,
        coverUrl: newUrl,
      });
    }

    return newUrl;
  },
});
