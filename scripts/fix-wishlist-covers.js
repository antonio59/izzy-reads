#!/usr/bin/env node
/**
 * Fix wishlist covers by replacing Google Books placeholders with OpenLibrary covers.
 *
 * Usage:
 *   1. Make sure you're authenticated with Convex (run `npx convex login` if needed)
 *   2. Run: node scripts/fix-wishlist-covers.js
 *
 * The script will:
 *   - Fetch all wishlist items
 *   - Identify items with Google Books placeholder covers
 *   - Search OpenLibrary for real covers
 *   - Print exact npx commands to run the bulk update
 */

import { execSync } from "child_process";
import { writeFileSync } from "fs";

const CONVEX_URL = process.env.CONVEX_URL || null;

function convexRun(functionName, args) {
  const argsJson = args ? JSON.stringify(args).replace(/"/g, '\\"') : "";
  const cmd = `npx convex run ${functionName}${args ? ` --args '${argsJson}'` : ""}`;
  console.log(`Running: ${cmd}`);
  try {
    const result = execSync(cmd, {
      encoding: "utf-8",
      cwd: "/Users/antoniosmith/Projects/izzy-reads",
      env: { ...process.env, CONVEX_URL },
    });
    return JSON.parse(result);
  } catch (e) {
    console.error("Error running Convex function:", e.stderr || e.message);
    return null;
  }
}

async function searchOpenLibrary(title, author) {
  const query = encodeURIComponent(`${title} ${author || ""}`.trim());
  const url = `https://openlibrary.org/search.json?q=${query}&limit=5`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const docs = data.docs || [];
    // Find first doc with a cover
    const match = docs.find((d) => d.cover_i);
    if (match) {
      return {
        coverId: match.cover_i,
        coverUrl: `https://covers.openlibrary.org/b/id/${match.cover_i}-L.jpg`,
        title: match.title,
        author: match.author_name?.[0],
      };
    }
  } catch (e) {
    console.error(`  OpenLibrary search failed for "${title}":`, e.message);
  }
  return null;
}

async function checkCoverDimensions(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) return { ok: false, status: response.status };
    // HEAD doesn't give us dimensions, but we can check content-length
    const contentLength = response.headers.get("content-length");
    return { ok: true, size: contentLength };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function isGoogleBooksPlaceholder(url) {
  if (!url) return false;
  return url.includes("books.google.com") || url.includes("books.googleapis.com");
}

async function main() {
  console.log("=== Fetching wishlist items ===\n");
  const items = convexRun("wishlist.getAll");
  if (!items) {
    console.error("Failed to fetch wishlist items. Make sure you're logged in to Convex.");
    console.log("\nRun: npx convex login");
    process.exit(1);
  }

  console.log(`Found ${items.length} wishlist items\n`);

  const toFix = [];

  for (const item of items) {
    const url = item.coverUrl;
    console.log(`Checking: "${item.title}" by ${item.author}`);
    console.log(`  Current: ${url || "(none)"}`);

    if (!url) {
      console.log("  -> No cover URL, needs fixing\n");
      toFix.push(item);
      continue;
    }

    // Check if it's a known bad pattern
    const isGoogleBooks = isGoogleBooksPlaceholder(url);
    if (isGoogleBooks) {
      console.log("  -> Google Books URL, checking...");
      const check = await checkCoverDimensions(url);
      if (check.ok && check.size && parseInt(check.size) < 5000) {
        console.log(`  -> Very small file (${check.size} bytes), likely placeholder\n`);
        toFix.push(item);
        continue;
      }
      // Default to checking OpenLibrary for Google Books URLs
      console.log("  -> Will check OpenLibrary for alternative\n");
      toFix.push(item);
      continue;
    }

    console.log("  -> Looks OK\n");
  }

  if (toFix.length === 0) {
    console.log("No covers need fixing!");
    return;
  }

  console.log(`\n=== Searching OpenLibrary for ${toFix.length} items ===\n`);

  const updates = [];

  for (const item of toFix) {
    console.log(`Searching: "${item.title}" by ${item.author}`);
    const result = await searchOpenLibrary(item.title, item.author);
    if (result) {
      console.log(`  -> Found: ${result.coverUrl}`);
      updates.push({
        wishlistId: item._id,
        coverUrl: result.coverUrl,
      });
    } else {
      console.log(`  -> No cover found on OpenLibrary`);
    }
  }

  if (updates.length === 0) {
    console.log("\nNo OpenLibrary covers found. Nothing to update.");
    return;
  }

  console.log(`\n=== ${updates.length} covers ready to update ===\n`);

  // Write updates to a temp file for the npx command
  const updatesJson = JSON.stringify(updates);
  const tempFile = "/tmp/wishlist-cover-updates.json";
  writeFileSync(tempFile, updatesJson);

  console.log("Updates prepared. Run the following command to apply them:");
  console.log("\n");
  console.log("npx convex run wishlist.bulkUpdateCovers --args '" + updatesJson.replace(/'/g, "'\"") + "'");
  console.log("\n");
  console.log("Or if the command is too long, the updates are also saved to:");
  console.log(tempFile);
  console.log("\n");
}

main().catch(console.error);
