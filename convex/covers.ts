// Cover image storage utilities for Convex
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { auth } from "./auth";

/** Mirror of src/lib/coverUrl.upgradeCoverUrl — keep in sync for Convex runtime. */
function upgradeCoverUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/") ||
    trimmed.includes(".convex.cloud") ||
    trimmed.includes(".convex.site")
  ) {
    return trimmed;
  }

  const olMatch = trimmed.match(
    /^(https?:\/\/covers\.openlibrary\.org\/b\/(?:id|isbn|olid)\/)([^/?#]+)-(?:S|M|L)(\.jpe?g)(\?.*)?$/i,
  );
  if (olMatch) {
    return `${olMatch[1].replace(/^http:/i, "https:")}${olMatch[2]}-L${olMatch[3]}${olMatch[4] ?? ""}`;
  }

  try {
    const parsed = new URL(trimmed.replace(/^http:/i, "https:"));
    const host = parsed.hostname;
    if (
      host.includes("books.google") ||
      host.includes("googleusercontent.com")
    ) {
      parsed.searchParams.delete("edge");
      const zoom = parsed.searchParams.get("zoom");
      if (!zoom || Number(zoom) < 3) {
        parsed.searchParams.set("zoom", "3");
      }
      return parsed.toString();
    }
  } catch {
    // fall through
  }

  return trimmed
    .replace(/^http:/i, "https:")
    .replace(/([?&])edge=curl&?/g, "$1")
    .replace(/([?&])zoom=[12]\b/g, "$1zoom=3")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}

function isConvexStorageUrl(url?: string): boolean {
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
}

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
      const fetchUrl = upgradeCoverUrl(externalUrl) || externalUrl;
      const response = await fetch(fetchUrl, {
        headers: { Accept: "image/*,*/*" },
        redirect: "follow",
      });
      if (!response.ok) {
        console.log(
          `Failed to fetch cover for "${bookTitle}": ${response.status}`,
        );
        return null;
      }

      const blob = await response.blob();

      if (
        !blob.type.startsWith("image/") &&
        blob.type !== "application/octet-stream"
      ) {
        console.log(`Invalid image type for "${bookTitle}": ${blob.type}`);
        return null;
      }

      // Open Library "image not available" stubs are ~807 bytes; real covers are larger
      if (blob.size < 2000) {
        console.log(`Image too small for "${bookTitle}": ${blob.size} bytes`);
        return null;
      }

      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);

      console.log(
        `Stored cover for "${bookTitle}" in Convex storage: ${storageId}`,
      );
      return url;
    } catch (error) {
      console.error(`Error storing cover for "${bookTitle}":`, error);
      return null;
    }
  },
});

/**
 * Parent-only: sharpen external covers (zoom/-L) and re-host into Convex storage.
 * Process in small batches from the Admin UI until hasMore is false.
 */
export const refreshLibraryCovers = action({
  args: {
    target: v.union(v.literal("books"), v.literal("wishlist")),
    batchSize: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  returns: v.object({
    processed: v.number(),
    upgraded: v.number(),
    stored: v.number(),
    failed: v.number(),
    skipped: v.number(),
    totalPending: v.number(),
    hasMore: v.boolean(),
    nextOffset: v.optional(v.number()),
    results: v.array(
      v.object({
        title: v.string(),
        status: v.string(),
      }),
    ),
  }),
  handler: async (ctx, { target, batchSize = 8, offset = 0 }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const isAdmin = await ctx.runQuery(api.users.isCurrentUserAdmin, {});
    if (!isAdmin) throw new Error("Admin access required");

    const items =
      target === "wishlist"
        ? await ctx.runQuery(api.wishlist.getAll, {})
        : await ctx.runQuery(api.books.getAll, {});

    const pending = items.filter(
      (item: { coverUrl?: string }) =>
        Boolean(item.coverUrl) && !isConvexStorageUrl(item.coverUrl),
    );

    const totalPending = pending.length;
    const batch = pending.slice(offset, offset + batchSize);
    const hasMore = offset + batchSize < totalPending;
    const nextOffset = hasMore ? offset + batchSize : undefined;

    let processed = 0;
    let upgraded = 0;
    let stored = 0;
    let failed = 0;
    let skipped = 0;
    const results: Array<{ title: string; status: string }> = [];

    for (const item of batch) {
      processed += 1;
      const title = item.title as string;
      const oldUrl = item.coverUrl as string;
      const sharpened = upgradeCoverUrl(oldUrl) || oldUrl;

      try {
        const permanentUrl = await ctx.runAction(api.covers.storeCoverImage, {
          externalUrl: sharpened,
          bookTitle: title,
        });

        const newUrl = permanentUrl || sharpened;
        if (newUrl === oldUrl) {
          skipped += 1;
          results.push({ title, status: "unchanged" });
          continue;
        }

        if (target === "wishlist") {
          await ctx.runMutation(api.wishlist.updateCover, {
            wishlistId: item._id,
            coverUrl: newUrl,
          });
        } else {
          await ctx.runMutation(api.books.updateBookCover, {
            bookId: item._id,
            coverUrl: newUrl,
          });
        }

        if (permanentUrl) {
          stored += 1;
          results.push({ title, status: "stored" });
        } else {
          upgraded += 1;
          results.push({ title, status: "url-upgraded" });
        }
      } catch (err) {
        failed += 1;
        results.push({
          title,
          status: `error: ${err instanceof Error ? err.message : String(err)}`,
        });
      }

      await new Promise((r) => setTimeout(r, 150));
    }

    return {
      processed,
      upgraded,
      stored,
      failed,
      skipped,
      totalPending,
      hasMore,
      nextOffset,
      results,
    };
  },
});
