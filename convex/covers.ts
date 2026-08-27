// Cover image storage utilities for Convex
import { v } from "convex/values";
import { action } from "./_generated/server";

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
      const response = await fetch(externalUrl);
      if (!response.ok) {
        console.log(`Failed to fetch cover for "${bookTitle}": ${response.status}`);
        return null;
      }

      const blob = await response.blob();

      if (!blob.type.startsWith("image/")) {
        console.log(`Invalid image type for "${bookTitle}": ${blob.type}`);
        return null;
      }

      if (blob.size < 1000) {
        console.log(`Image too small for "${bookTitle}": ${blob.size} bytes`);
        return null;
      }

      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);

      console.log(`Stored cover for "${bookTitle}" in Convex storage: ${storageId}`);
      return url;
    } catch (error) {
      console.error(`Error storing cover for "${bookTitle}":`, error);
      return null;
    }
  },
});
