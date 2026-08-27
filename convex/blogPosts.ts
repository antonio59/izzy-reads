import { query, mutation, type QueryCtx, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import type { Id } from "./_generated/dataModel";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "post"
  );
}

async function uniqueSlug(
  ctx: QueryCtx | MutationCtx,
  base: string,
  excludeId?: Id<"blogPosts">,
): Promise<string> {
  let candidate = base || "post";
  let n = 0;
  for (;;) {
    const existing = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .first();
    if (!existing || (excludeId && existing._id === excludeId)) {
      return candidate;
    }
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export const getBySlugOrId = query({
  args: { slugOrId: v.string() },
  handler: async (ctx, args) => {
    const bySlug = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slugOrId))
      .first();
    if (bySlug && bySlug.status === "published") return bySlug;

    const byId = await ctx.db.get(args.slugOrId as Id<"blogPosts">);
    if (byId && byId.status === "published") return byId;
    return null;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogPosts").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    bookId: v.optional(v.id("books")),
    dateCreated: v.string(),
    dateModified: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.array(v.string()),
    emoji: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const slug = args.slug
      ? await uniqueSlug(ctx, slugify(args.slug))
      : await uniqueSlug(ctx, slugify(args.title));
    const { slug: _ignored, ...rest } = args;
    return await ctx.db.insert("blogPosts", { ...rest, slug, userId });
  },
});

export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    bookId: v.optional(v.id("books")),
    dateModified: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    tags: v.optional(v.array(v.string())),
    emoji: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    if (updates.slug) {
      filteredUpdates.slug = await uniqueSlug(ctx, slugify(updates.slug), id);
    } else if (updates.title) {
      filteredUpdates.slug = await uniqueSlug(ctx, slugify(updates.title), id);
    } else if (!post.slug) {
      filteredUpdates.slug = await uniqueSlug(ctx, slugify(post.title), id);
    }

    await ctx.db.patch(id, filteredUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    await ctx.db.delete(args.id);
  },
});

/** One-shot: assign slugs to any posts missing them (parent/admin only) */
export const backfillSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!profile?.isParent) {
      throw new Error("Admin access required");
    }

    const all = await ctx.db.query("blogPosts").collect();
    let updated = 0;
    for (const post of all) {
      if (!post.slug) {
        const slug = await uniqueSlug(ctx, slugify(post.title), post._id);
        await ctx.db.patch(post._id, { slug });
        updated += 1;
      }
    }
    return { updated, total: all.length };
  },
});
