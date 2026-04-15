// Bulk migration script to move book covers from external URLs to Convex storage
// Run this once to migrate all existing books

import { query, mutation, action, internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

// Duplicate here to avoid import issues with Convex runtime
const isConvexStorageUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname === "convex.site" ||
      hostname.endsWith(".convex.site") ||
      hostname === "convex.cloud" ||
      hostname.endsWith(".convex.cloud")
    );
  } catch {
    return false;
  }
};

const isOpenLibraryUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname;
    return hostname === "openlibrary.org" || hostname.endsWith(".openlibrary.org");
  } catch {
    return false;
  }
};

/**
 * Fetch a URL with exponential backoff retry.
 * Retries on network errors and 429/5xx responses; fails fast on other 4xx.
 */
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      // Fail fast on permanent client errors (except 429 rate-limit)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
      } else {
        return response;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError ?? new Error("Max retries exceeded");
}

/**
 * Persist an audit log entry for a migration attempt.
 */
export const logMigrationResult = mutation({
  args: {
    entityType: v.union(v.literal("book"), v.literal("wishlist")),
    entityId: v.string(),
    title: v.string(),
    success: v.boolean(),
    oldUrl: v.string(),
    newUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("migrationLogs", {
      ...args,
      migratedAt: new Date().toISOString(),
    });
  },
});

/**
 * Query all migration log entries, optionally filtered to failures only.
 */
export const getMigrationLogs = query({
  args: {
    failedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, { failedOnly }) => {
    if (failedOnly) {
      return ctx.db
        .query("migrationLogs")
        .withIndex("by_success", (q) => q.eq("success", false))
        .collect();
    }
    return ctx.db.query("migrationLogs").collect();
  },
});

/**
 * Migrate a single book's cover to Convex storage.
 * - Retries transient failures with exponential backoff
 * - Validates content-type header before downloading the body
 * - Cleans up orphaned storage if the DB update fails
 * - Writes a persistent audit log entry on every outcome
 */
export const migrateSingleBookCover = action({
  args: {
    bookId: v.id("books"),
    externalUrl: v.string(),
    bookTitle: v.string(),
    maxRetries: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    newUrl: v.optional(v.string()),
    error: v.optional(v.string()),
    alreadyMigrated: v.optional(v.boolean()),
  }),
  handler: async (ctx, { bookId, externalUrl, bookTitle, maxRetries = 3 }) => {
    if (isConvexStorageUrl(externalUrl)) {
      return { success: true, newUrl: externalUrl, alreadyMigrated: true };
    }

    let storageId: Id<"_storage"> | undefined;

    const logFailure = async (error: string) => {
      await ctx.runMutation(api.migration.logMigrationResult, {
        entityType: "book",
        entityId: bookId,
        title: bookTitle,
        success: false,
        oldUrl: externalUrl,
        error,
      });
    };

    try {
      const response = await fetchWithRetry(externalUrl, maxRetries);

      if (!response.ok) {
        const err = `HTTP ${response.status} after retries`;
        await logFailure(err);
        return { success: false, error: err };
      }

      // Validate content-type from response header before downloading the full body
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) {
        const err = `Not an image (content-type: ${contentType || "unknown"})`;
        await logFailure(err);
        return { success: false, error: err };
      }

      const blob = await response.blob();

      // 2 KB threshold — Open Library placeholder images are typically ~807 bytes
      if (blob.size < 2000) {
        const err = `Image too small (${blob.size} bytes) — likely a placeholder`;
        await logFailure(err);
        return { success: false, error: err };
      }

      storageId = await ctx.storage.store(blob);
      const newUrl = await ctx.storage.getUrl(storageId);

      if (!newUrl) {
        await ctx.storage.delete(storageId);
        const err = "Failed to get storage URL after storing";
        await logFailure(err);
        return { success: false, error: err };
      }

      // Update DB — if this fails, delete the orphaned storage object to avoid leaks
      try {
        await ctx.runMutation(api.books.updateBookCover, { bookId, coverUrl: newUrl });
      } catch (mutErr) {
        await ctx.storage.delete(storageId);
        const err = `DB update failed: ${mutErr instanceof Error ? mutErr.message : "Unknown"}`;
        await logFailure(err);
        return { success: false, error: err };
      }

      await ctx.runMutation(api.migration.logMigrationResult, {
        entityType: "book",
        entityId: bookId,
        title: bookTitle,
        success: true,
        oldUrl: externalUrl,
        newUrl,
      });

      console.log(`✅ Migrated book: "${bookTitle}"`);
      return { success: true, newUrl };
    } catch (error) {
      const err = error instanceof Error ? error.message : "Unknown error";

      // Clean up any orphaned storage file created before the error
      if (storageId) {
        try {
          await ctx.storage.delete(storageId);
        } catch { /* cleanup failure is non-critical */ }
      }

      await logFailure(err);
      return { success: false, error: err };
    }
  },
});

/**
 * Migrate a single wishlist item's cover to Convex storage.
 * Same guarantees as migrateSingleBookCover.
 */
export const migrateSingleWishlistCover = action({
  args: {
    wishlistId: v.id("wishlist"),
    externalUrl: v.string(),
    bookTitle: v.string(),
    maxRetries: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    newUrl: v.optional(v.string()),
    error: v.optional(v.string()),
    alreadyMigrated: v.optional(v.boolean()),
  }),
  handler: async (ctx, { wishlistId, externalUrl, bookTitle, maxRetries = 3 }) => {
    if (isConvexStorageUrl(externalUrl)) {
      return { success: true, newUrl: externalUrl, alreadyMigrated: true };
    }

    let storageId: Id<"_storage"> | undefined;

    const logFailure = async (error: string) => {
      await ctx.runMutation(api.migration.logMigrationResult, {
        entityType: "wishlist",
        entityId: wishlistId,
        title: bookTitle,
        success: false,
        oldUrl: externalUrl,
        error,
      });
    };

    try {
      const response = await fetchWithRetry(externalUrl, maxRetries);

      if (!response.ok) {
        const err = `HTTP ${response.status} after retries`;
        await logFailure(err);
        return { success: false, error: err };
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) {
        const err = `Not an image (content-type: ${contentType || "unknown"})`;
        await logFailure(err);
        return { success: false, error: err };
      }

      const blob = await response.blob();

      if (blob.size < 2000) {
        const err = `Image too small (${blob.size} bytes) — likely a placeholder`;
        await logFailure(err);
        return { success: false, error: err };
      }

      storageId = await ctx.storage.store(blob);
      const newUrl = await ctx.storage.getUrl(storageId);

      if (!newUrl) {
        await ctx.storage.delete(storageId);
        const err = "Failed to get storage URL after storing";
        await logFailure(err);
        return { success: false, error: err };
      }

      try {
        await ctx.runMutation(api.wishlist.updateCover, { wishlistId, coverUrl: newUrl });
      } catch (mutErr) {
        await ctx.storage.delete(storageId);
        const err = `DB update failed: ${mutErr instanceof Error ? mutErr.message : "Unknown"}`;
        await logFailure(err);
        return { success: false, error: err };
      }

      await ctx.runMutation(api.migration.logMigrationResult, {
        entityType: "wishlist",
        entityId: wishlistId,
        title: bookTitle,
        success: true,
        oldUrl: externalUrl,
        newUrl,
      });

      console.log(`✅ Migrated wishlist: "${bookTitle}"`);
      return { success: true, newUrl };
    } catch (error) {
      const err = error instanceof Error ? error.message : "Unknown error";

      if (storageId) {
        try {
          await ctx.storage.delete(storageId);
        } catch { /* cleanup failure is non-critical */ }
      }

      await logFailure(err);
      return { success: false, error: err };
    }
  },
});

/**
 * Get migration status — current counts of covers by URL type.
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

    return { books: bookStats, wishlist: wishlistStats };
  },
});

/**
 * Bulk migrate all book covers to Convex storage.
 *
 * Supports offset-based pagination so you can process all books across
 * multiple calls without hitting action time limits.
 *
 * Example — migrate everything 10 at a time:
 *   let result = await ctx.runAction(api.migration.bulkMigrateBookCovers, { batchSize: 10 });
 *   while (result.hasMore) {
 *     result = await ctx.runAction(api.migration.bulkMigrateBookCovers, {
 *       batchSize: 10,
 *       offset: result.nextOffset,
 *     });
 *   }
 */
export const bulkMigrateBookCovers = action({
  args: {
    batchSize: v.optional(v.number()),
    offset: v.optional(v.number()),
    dryRun: v.optional(v.boolean()),
    maxRetries: v.optional(v.number()),
  },
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    skipped: v.number(),
    totalPending: v.number(),
    hasMore: v.boolean(),
    nextOffset: v.optional(v.number()),
    results: v.array(
      v.object({
        bookId: v.string(),
        title: v.string(),
        success: v.boolean(),
        oldUrl: v.optional(v.string()),
        newUrl: v.optional(v.string()),
        error: v.optional(v.string()),
      }),
    ),
  }),
  handler: async (ctx, { batchSize = 10, offset = 0, dryRun = false, maxRetries = 3 }) => {
    const books = (await ctx.runQuery(api.books.getAll)) as Doc<"books">[];

    const booksToMigrate = books.filter(
      (book: Doc<"books">) => book.coverUrl && !isConvexStorageUrl(book.coverUrl),
    );

    const totalPending = booksToMigrate.length;
    const batch = booksToMigrate.slice(offset, offset + batchSize);
    const hasMore = offset + batchSize < totalPending;
    const nextOffset = hasMore ? offset + batchSize : undefined;

    const results: Array<{
      bookId: string;
      title: string;
      success: boolean;
      oldUrl?: string;
      newUrl?: string;
      error?: string;
    }> = [];

    let processed = 0;
    let successful = 0;
    let failed = 0;
    let skipped = 0;

    console.log(
      `Processing books ${offset + 1}–${offset + batch.length} of ${totalPending} pending`,
    );

    for (const book of batch) {
      processed++;

      if (dryRun) {
        results.push({
          bookId: book._id,
          title: book.title,
          success: true,
          oldUrl: book.coverUrl,
          error: `DRY RUN — would migrate from: ${book.coverUrl}`,
        });
        continue;
      }

      try {
        const result = await ctx.runAction(api.migration.migrateSingleBookCover, {
          bookId: book._id,
          externalUrl: book.coverUrl!,
          bookTitle: book.title,
          maxRetries,
        });

        if (result.success) {
          if (result.alreadyMigrated) {
            skipped++;
          } else {
            successful++;
          }
        } else {
          failed++;
        }

        results.push({
          bookId: book._id,
          title: book.title,
          success: result.success,
          oldUrl: book.coverUrl,
          newUrl: result.newUrl,
          error: result.error,
        });
      } catch (error) {
        failed++;
        results.push({
          bookId: book._id,
          title: book.title,
          success: false,
          oldUrl: book.coverUrl,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // 300ms between requests to respect Open Library rate limits
      if (processed < batch.length) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return { processed, successful, failed, skipped, totalPending, hasMore, nextOffset, results };
  },
});

/**
 * Bulk migrate all wishlist covers to Convex storage.
 * Same pagination and retry semantics as bulkMigrateBookCovers.
 */
export const bulkMigrateWishlistCovers = action({
  args: {
    batchSize: v.optional(v.number()),
    offset: v.optional(v.number()),
    dryRun: v.optional(v.boolean()),
    maxRetries: v.optional(v.number()),
  },
  returns: v.object({
    processed: v.number(),
    successful: v.number(),
    failed: v.number(),
    skipped: v.number(),
    totalPending: v.number(),
    hasMore: v.boolean(),
    nextOffset: v.optional(v.number()),
    results: v.array(
      v.object({
        wishlistId: v.string(),
        title: v.string(),
        success: v.boolean(),
        oldUrl: v.optional(v.string()),
        newUrl: v.optional(v.string()),
        error: v.optional(v.string()),
      }),
    ),
  }),
  handler: async (ctx, { batchSize = 10, offset = 0, dryRun = false, maxRetries = 3 }) => {
    const wishlist = (await ctx.runQuery(api.wishlist.getAll)) as Doc<"wishlist">[];

    const itemsToMigrate = wishlist.filter(
      (item: Doc<"wishlist">) => item.coverUrl && !isConvexStorageUrl(item.coverUrl),
    );

    const totalPending = itemsToMigrate.length;
    const batch = itemsToMigrate.slice(offset, offset + batchSize);
    const hasMore = offset + batchSize < totalPending;
    const nextOffset = hasMore ? offset + batchSize : undefined;

    const results: Array<{
      wishlistId: string;
      title: string;
      success: boolean;
      oldUrl?: string;
      newUrl?: string;
      error?: string;
    }> = [];

    let processed = 0;
    let successful = 0;
    let failed = 0;
    let skipped = 0;

    console.log(
      `Processing wishlist ${offset + 1}–${offset + batch.length} of ${totalPending} pending`,
    );

    for (const item of batch) {
      processed++;

      if (dryRun) {
        results.push({
          wishlistId: item._id,
          title: item.title,
          success: true,
          oldUrl: item.coverUrl,
          error: `DRY RUN — would migrate from: ${item.coverUrl}`,
        });
        continue;
      }

      try {
        const result = await ctx.runAction(api.migration.migrateSingleWishlistCover, {
          wishlistId: item._id,
          externalUrl: item.coverUrl!,
          bookTitle: item.title,
          maxRetries,
        });

        if (result.success) {
          if (result.alreadyMigrated) {
            skipped++;
          } else {
            successful++;
          }
        } else {
          failed++;
        }

        results.push({
          wishlistId: item._id,
          title: item.title,
          success: result.success,
          oldUrl: item.coverUrl,
          newUrl: result.newUrl,
          error: result.error,
        });
      } catch (error) {
        failed++;
        results.push({
          wishlistId: item._id,
          title: item.title,
          success: false,
          oldUrl: item.coverUrl,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      if (processed < batch.length) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return { processed, successful, failed, skipped, totalPending, hasMore, nextOffset, results };
  },
});

// --- Replace Open Library covers with Google Books high-res covers ---

/**
 * Internal mutation to update a book's coverUrl directly (no auth required).
 */
export const patchBookCover = internalMutation({
  args: { bookId: v.id("books"), coverUrl: v.string() },
  handler: async (ctx, { bookId, coverUrl }) => {
    await ctx.db.patch(bookId, { coverUrl });
  },
});

/**
 * Internal mutation to update a wishlist item's coverUrl directly.
 */
export const patchWishlistCover = internalMutation({
  args: { wishlistId: v.id("wishlist"), coverUrl: v.string() },
  handler: async (ctx, { wishlistId, coverUrl }) => {
    await ctx.db.patch(wishlistId, { coverUrl });
  },
});

/**
 * Replace Open Library placeholder covers with Google Books high-res covers.
 *
 * Open Library returns valid JPEG images even when no cover exists - the image
 * visually shows "image not available" text. This migration searches Google Books
 * by title+author for each affected book and replaces the URL with a zoom=3
 * high-res cover.
 *
 * Run via: npx convex run --prod migration:upgradeOpenLibraryCovers
 */
export const upgradeOpenLibraryCovers = internalAction({
  args: {},
  handler: async (ctx) => {
    const books = await ctx.runQuery(api.books.getAll);
    const results: Array<{ title: string; status: string; oldUrl?: string; newUrl?: string }> = [];

    for (const book of books) {
      if (!isOpenLibraryUrl(book.coverUrl)) {
        continue;
      }

      try {
        const q = encodeURIComponent(`${book.title} ${book.author}`);
        const resp = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`
        );
        if (!resp.ok) {
          results.push({ title: book.title, status: `Google API error: ${resp.status}` });
          continue;
        }

        const data = await resp.json();
        const item = data.items?.[0];
        const thumbnail = item?.volumeInfo?.imageLinks?.thumbnail;

        if (!thumbnail) {
          results.push({ title: book.title, status: "No Google Books cover found", oldUrl: book.coverUrl });
          continue;
        }

        const url = new URL(thumbnail.replace("http://", "https://"));
        url.searchParams.set("zoom", "3");
        url.searchParams.delete("edge");
        const newCoverUrl = url.toString();

        await ctx.runMutation(internal.migration.patchBookCover, {
          bookId: book._id,
          coverUrl: newCoverUrl,
        });

        results.push({
          title: book.title,
          status: "upgraded",
          oldUrl: book.coverUrl,
          newUrl: newCoverUrl,
        });

        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        results.push({
          title: book.title,
          status: `Error: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }

    // Also do wishlist items
    const wishlistItems = await ctx.runQuery(api.wishlist.getAll);
    for (const wItem of wishlistItems) {
      if (!isOpenLibraryUrl(wItem.coverUrl)) {
        continue;
      }

      try {
        const q = encodeURIComponent(`${wItem.title} ${wItem.author}`);
        const resp = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`
        );
        if (!resp.ok) {
          results.push({ title: wItem.title, status: `Google API error: ${resp.status}` });
          continue;
        }

        const data = await resp.json();
        const volItem = data.items?.[0];
        const thumbnail = volItem?.volumeInfo?.imageLinks?.thumbnail;

        if (!thumbnail) {
          results.push({ title: wItem.title, status: "No Google Books cover (wishlist)", oldUrl: wItem.coverUrl });
          continue;
        }

        const url = new URL(thumbnail.replace("http://", "https://"));
        url.searchParams.set("zoom", "3");
        url.searchParams.delete("edge");
        const newCoverUrl = url.toString();

        await ctx.runMutation(internal.migration.patchWishlistCover, {
          wishlistId: wItem._id,
          coverUrl: newCoverUrl,
        });

        results.push({
          title: wItem.title,
          status: "upgraded (wishlist)",
          oldUrl: wItem.coverUrl,
          newUrl: newCoverUrl,
        });

        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        results.push({
          title: wItem.title,
          status: `Error: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }

    return results;
  },
});

/**
 * Internal mutation to clear a book's coverUrl (triggers gradient fallback).
 */
export const clearBookCover = internalMutation({
  args: { bookId: v.id("books") },
  handler: async (ctx, { bookId }) => {
    await ctx.db.patch(bookId, { coverUrl: undefined });
  },
});
