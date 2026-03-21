// Bulk migration script to move book covers from external URLs to Convex storage
// Run this once to migrate all existing books

import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Duplicate here to avoid import issues with Convex runtime
const isConvexStorageUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.includes("convex.site/api/storage") || url.includes("convex.cloud/api/storage");
};

interface MigrationResult {
  bookId: string;
  title: string;
  success: boolean;
  oldUrl: string;
  newUrl?: string;
  error?: string;
}

/**
 * Migrate a single book's cover to Convex storage
 * Called internally by the bulk migration
 */
export const migrateSingleBookCover = action({
  args: {
    bookId: v.id("books"),
    externalUrl: v.string(),
    bookTitle: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    newUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, { bookId, externalUrl, bookTitle }) => {
    // Skip if already a Convex URL
    if (isConvexStorageUrl(externalUrl)) {
      return { success: true, newUrl: externalUrl };
    }

    try {
      // Fetch the image from external URL
      const response = await fetch(externalUrl);
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}`,
        };
      }

      const blob = await response.blob();

      // Validate it's an image and not too small
      if (!blob.type.startsWith("image/")) {
        return { success: false, error: "Not an image" };
      }
      if (blob.size < 1000) {
        return { success: false, error: "Image too small (likely placeholder)" };
      }

      // Store in Convex
      const storageId = await ctx.storage.store(blob);
      const newUrl = await ctx.storage.getUrl(storageId);

      if (!newUrl) {
        return { success: false, error: "Failed to get storage URL" };
      }

      // Update the book record
      await ctx.runMutation(api.books.updateBookCover, {
        bookId,
        coverUrl: newUrl,
      });

      console.log(`✅ Migrated: "${bookTitle}"`);
      return { success: true, newUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },
});

/**
 * Migrate a single wishlist item's cover to Convex storage
 */
export const migrateSingleWishlistCover = action({
  args: {
    wishlistId: v.id("wishlist"),
    externalUrl: v.string(),
    bookTitle: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    newUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, { wishlistId, externalUrl, bookTitle }) => {
    // Skip if already a Convex URL
    if (isConvexStorageUrl(externalUrl)) {
      return { success: true, newUrl: externalUrl };
    }

    try {
      // Fetch the image from external URL
      const response = await fetch(externalUrl);
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}`,
        };
      }

      const blob = await response.blob();

      // Validate it's an image and not too small
      if (!blob.type.startsWith("image/")) {
        return { success: false, error: "Not an image" };
      }
      if (blob.size < 1000) {
        return { success: false, error: "Image too small (likely placeholder)" };
      }

      // Store in Convex
      const storageId = await ctx.storage.store(blob);
      const newUrl = await ctx.storage.getUrl(storageId);

      if (!newUrl) {
        return { success: false, error: "Failed to get storage URL" };
      }

      // Update the wishlist item record
      await ctx.runMutation(api.wishlist.updateCover, {
        wishlistId,
        coverUrl: newUrl,
      });

      console.log(`✅ Migrated wishlist: "${bookTitle}"`);
      return { success: true, newUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },
});

/**
 * Get migration status - counts of books with external vs Convex URLs
 */
export const getMigrationStatus = query({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.db.query("books").collect();
    const wishlist = await ctx.db.query("wishlist").collect();

    const bookStats = {
      total: books.length,
      withCover: 0,
      withExternalUrl: 0,
      withConvexUrl: 0,
      withoutCover: 0,
    };

    const wishlistStats = {
      total: wishlist.length,
      withCover: 0,
      withExternalUrl: 0,
      withConvexUrl: 0,
      withoutCover: 0,
    };

    for (const book of books) {
      if (book.coverUrl) {
        bookStats.withCover++;
        if (isConvexStorageUrl(book.coverUrl)) {
          bookStats.withConvexUrl++;
        } else {
          bookStats.withExternalUrl++;
        }
      } else {
        bookStats.withoutCover++;
      }
    }

    for (const item of wishlist) {
      if (item.coverUrl) {
        wishlistStats.withCover++;
        if (isConvexStorageUrl(item.coverUrl)) {
          wishlistStats.withConvexUrl++;
        } else {
          wishlistStats.withExternalUrl++;
        }
      } else {
        wishlistStats.withoutCover++;
      }
    }

    return {
      books: bookStats,
      wishlist: wishlistStats,
    };
  },
});

/**
 * Bulk migrate all book covers to Convex storage
 * Processes in batches to avoid timeouts
 */
export const bulkMigrateBookCovers = action({
  args: {
    batchSize: v.optional(v.number()), // Number of books to process per batch (default: 5)
    dryRun: v.optional(v.boolean()), // If true, don't actually migrate (just report)
  },
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    alreadyMigrated: v.number(),
    results: v.array(
      v.object({
        bookId: v.string(),
        title: v.string(),
        success: v.boolean(),
        error: v.optional(v.string()),
      }),
    ),
  }),
  handler: async (ctx, { batchSize = 5, dryRun = false }) => {
    const books = await ctx.runQuery(api.books.getAll);
    const results: Array<{
      bookId: string;
      title: string;
      success: boolean;
      error?: string;
    }> = [];

    let processed = 0;
    let successful = 0;
    let failed = 0;
    let alreadyMigrated = 0;

    // Filter to books with external URLs that need migration
    const booksToMigrate = books.filter(
      (book) => book.coverUrl && !isConvexStorageUrl(book.coverUrl),
    );

    console.log(`Found ${booksToMigrate.length} books to migrate`);

    // Process in batches
    for (let i = 0; i < Math.min(booksToMigrate.length, batchSize); i++) {
      const book = booksToMigrate[i];
      processed++;

      if (dryRun) {
        results.push({
          bookId: book._id,
          title: book.title,
          success: true,
          error: "DRY RUN - Would migrate",
        });
        continue;
      }

      try {
        const result = await ctx.runAction(api.migration.migrateSingleBookCover, {
          bookId: book._id,
          externalUrl: book.coverUrl!,
          bookTitle: book.title,
        });

        if (result.success) {
          successful++;
          if (result.newUrl === book.coverUrl) {
            alreadyMigrated++;
          }
        } else {
          failed++;
        }

        results.push({
          bookId: book._id,
          title: book.title,
          success: result.success,
          error: result.error,
        });
      } catch (error) {
        failed++;
        results.push({
          bookId: book._id,
          title: book.title,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return {
      processed,
      successful,
      failed,
      alreadyMigrated,
      results,
    };
  },
});

/**
 * Bulk migrate all wishlist covers to Convex storage
 */
export const bulkMigrateWishlistCovers = action({
  args: {
    batchSize: v.optional(v.number()),
    dryRun: v.optional(v.boolean()),
  },
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    alreadyMigrated: v.number(),
    results: v.array(
      v.object({
        wishlistId: v.string(),
        title: v.string(),
        success: v.boolean(),
        error: v.optional(v.string()),
      }),
    ),
  }),
  handler: async (ctx, { batchSize = 5, dryRun = false }) => {
    const wishlist = await ctx.runQuery(api.wishlist.getAll);
    const results: Array<{
      wishlistId: string;
      title: string;
      success: boolean;
      error?: string;
    }> = [];

    let processed = 0;
    let successful = 0;
    let failed = 0;
    let alreadyMigrated = 0;

    const itemsToMigrate = wishlist.filter(
      (item) => item.coverUrl && !isConvexStorageUrl(item.coverUrl),
    );

    console.log(`Found ${itemsToMigrate.length} wishlist items to migrate`);

    for (let i = 0; i < Math.min(itemsToMigrate.length, batchSize); i++) {
      const item = itemsToMigrate[i];
      processed++;

      if (dryRun) {
        results.push({
          wishlistId: item._id,
          title: item.title,
          success: true,
          error: "DRY RUN - Would migrate",
        });
        continue;
      }

      try {
        const result = await ctx.runAction(api.migration.migrateSingleWishlistCover, {
          wishlistId: item._id,
          externalUrl: item.coverUrl!,
          bookTitle: item.title,
        });

        if (result.success) {
          successful++;
          if (result.newUrl === item.coverUrl) {
            alreadyMigrated++;
          }
        } else {
          failed++;
        }

        results.push({
          wishlistId: item._id,
          title: item.title,
          success: result.success,
          error: result.error,
        });
      } catch (error) {
        failed++;
        results.push({
          wishlistId: item._id,
          title: item.title,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return {
      processed,
      successful,
      failed,
      alreadyMigrated,
      results,
    };
  },
});
