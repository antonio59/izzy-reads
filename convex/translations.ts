declare const process: { env: Record<string, string | undefined> };

import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
  type QueryCtx,
} from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { requireAdmin, requireAdminAction } from "./authGuards";
import {
  MAX_TRANSLATION_LENGTH,
  buildTranslationMessages,
  parseTranslationResponse,
  sourceHash,
  type TranslationSource,
} from "./lib/translationText";

const contentTypeV = v.union(
  v.literal("poem"),
  v.literal("review"),
  v.literal("blogPost"),
);
const LANG = "it" as const;

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";
const DEEPSEEK_TIMEOUT_MS = 60_000;

type ContentType = "poem" | "review" | "blogPost";

/** Load the English source for a piece of content, or null if it's gone. */
async function loadSource(
  ctx: QueryCtx,
  contentType: ContentType,
  contentId: string,
): Promise<TranslationSource | null> {
  if (contentType === "poem") {
    const id = ctx.db.normalizeId("poems", contentId);
    const poem = id ? await ctx.db.get(id) : null;
    return poem ? { title: poem.title, body: poem.content } : null;
  }
  if (contentType === "review") {
    const id = ctx.db.normalizeId("books", contentId);
    const book = id ? await ctx.db.get(id) : null;
    if (!book?.notes) return null;
    return {
      body: book.notes,
      context: `Review of the book "${book.title}" by ${book.author}`,
    };
  }
  const id = ctx.db.normalizeId("blogPosts", contentId);
  const post = id ? await ctx.db.get(id) : null;
  return post ? { title: post.title, body: post.content } : null;
}

async function findTranslation(
  ctx: QueryCtx,
  contentType: ContentType,
  contentId: string,
) {
  return await ctx.db
    .query("translations")
    .withIndex("by_content", (q) =>
      q.eq("contentType", contentType).eq("contentId", contentId).eq("lang", LANG),
    )
    .first();
}

function checkLength(text: string | undefined, label: string) {
  if (text && text.length > MAX_TRANSLATION_LENGTH) {
    throw new ConvexError(`${label} is too long`);
  }
}

// ── Public ──────────────────────────────────────────────────────────────

/** Published Italian versions for one content type (visitors only see these). */
export const listPublished = query({
  args: { contentType: contentTypeV },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("translations")
      .withIndex("by_type_lang", (q) =>
        q.eq("contentType", args.contentType).eq("lang", LANG),
      )
      .collect();
    return rows
      .filter((r) => r.publishedBody)
      .map((r) => ({
        contentId: r.contentId,
        title: r.publishedTitle,
        body: r.publishedBody as string,
      }));
  },
});

// ── Admin: editing ──────────────────────────────────────────────────────

export const getForEditing = query({
  args: { contentType: contentTypeV, contentId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const [row, source] = await Promise.all([
      findTranslation(ctx, args.contentType, args.contentId),
      loadSource(ctx, args.contentType, args.contentId),
    ]);
    return {
      draftTitle: row?.draftTitle,
      draftBody: row?.draftBody ?? "",
      isPublished: Boolean(row?.publishedBody),
      hasUnpublishedChanges: Boolean(
        row &&
          (row.draftBody !== row.publishedBody ||
            (row.draftTitle ?? "") !== (row.publishedTitle ?? "")),
      ),
      englishChangedSincePublish: Boolean(
        row?.publishedSourceHash &&
          source &&
          row.publishedSourceHash !== sourceHash(source),
      ),
      suggestionsEnabled: Boolean(process.env.DEEPSEEK_API_KEY),
    };
  },
});

export const saveDraft = mutation({
  args: {
    contentType: contentTypeV,
    contentId: v.string(),
    title: v.optional(v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    checkLength(args.title, "Title");
    checkLength(args.body, "Translation");
    const existing = await findTranslation(ctx, args.contentType, args.contentId);
    const fields = {
      draftTitle: args.title?.trim() || undefined,
      draftBody: args.body,
      updatedAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("translations", {
        contentType: args.contentType,
        contentId: args.contentId,
        lang: LANG,
        ...fields,
      });
    }
  },
});

export const publish = mutation({
  args: { contentType: contentTypeV, contentId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await findTranslation(ctx, args.contentType, args.contentId);
    if (!row || row.draftBody.trim() === "") {
      throw new ConvexError("Write or suggest an Italian version first");
    }
    const source = await loadSource(ctx, args.contentType, args.contentId);
    if (!source) throw new ConvexError("The English version no longer exists");
    await ctx.db.patch(row._id, {
      publishedTitle: row.draftTitle,
      publishedBody: row.draftBody,
      publishedSourceHash: sourceHash(source),
      updatedAt: Date.now(),
    });
  },
});

export const unpublish = mutation({
  args: { contentType: contentTypeV, contentId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await findTranslation(ctx, args.contentType, args.contentId);
    if (!row) return;
    await ctx.db.patch(row._id, {
      publishedTitle: undefined,
      publishedBody: undefined,
      publishedSourceHash: undefined,
      updatedAt: Date.now(),
    });
  },
});

// ── Admin: DeepSeek suggestions ─────────────────────────────────────────

export const getSourceInternal = internalQuery({
  args: { contentType: contentTypeV, contentId: v.string() },
  handler: async (ctx, args) =>
    await loadSource(ctx, args.contentType, args.contentId),
});

export const saveSuggestionInternal = internalMutation({
  args: {
    contentType: contentTypeV,
    contentId: v.string(),
    title: v.optional(v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await findTranslation(ctx, args.contentType, args.contentId);
    const now = Date.now();
    // A suggestion only replaces the draft – the published copy is untouched
    const fields = {
      draftTitle: args.title,
      draftBody: args.body,
      suggestedAt: now,
      updatedAt: now,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("translations", {
        contentType: args.contentType,
        contentId: args.contentId,
        lang: LANG,
        ...fields,
      });
    }
  },
});

export const suggest = action({
  args: { contentType: contentTypeV, contentId: v.string() },
  handler: async (ctx, args) => {
    await requireAdminAction(ctx);

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new ConvexError(
        "Italian suggestions aren't set up yet – you can still type your own translation.",
      );
    }

    const source = await ctx.runQuery(internal.translations.getSourceInternal, args);
    if (!source) throw new ConvexError("Couldn't find the English version to translate");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEEPSEEK_TIMEOUT_MS);
    let content: string;
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: buildTranslationMessages(args.contentType, source),
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        console.error("DeepSeek error", res.status, await res.text());
        throw new ConvexError("The translator is busy right now – please try again in a minute.");
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      content = data.choices?.[0]?.message?.content ?? "";
    } catch (error) {
      if (error instanceof ConvexError) throw error;
      console.error("DeepSeek request failed", error);
      throw new ConvexError("Couldn't reach the translator – please try again.");
    } finally {
      clearTimeout(timeout);
    }

    let result;
    try {
      result = parseTranslationResponse(content);
    } catch (error) {
      console.error("Unusable DeepSeek reply", error, content.slice(0, 500));
      throw new ConvexError("The suggestion came back garbled – please try again.");
    }

    await ctx.runMutation(internal.translations.saveSuggestionInternal, {
      contentType: args.contentType,
      contentId: args.contentId,
      title: source.title ? result.title : undefined,
      body: result.body,
    });
  },
});
