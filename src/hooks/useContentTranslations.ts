import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";

export type TranslatableType = "poem" | "review" | "blogPost";

export interface PublishedTranslation {
  contentId: string;
  title?: string;
  body: string;
}

/**
 * Izzy's approved Italian versions for one content type, keyed by content id.
 * Empty when the site is in English, or when nothing is published yet –
 * callers then simply show the English.
 */
export function usePublishedTranslations(
  contentType: TranslatableType,
): ReadonlyMap<string, PublishedTranslation> {
  const { i18n } = useTranslation();
  const isItalian = i18n.resolvedLanguage?.startsWith("it") ?? false;
  const rows = useQuery(
    api.translations.listPublished,
    isItalian ? { contentType } : "skip",
  );
  return useMemo(
    () => new Map((rows ?? []).map((row) => [row.contentId, row])),
    [rows],
  );
}

/** Pick the Italian title/body when there is one, else the English. */
export function pickTranslated<T extends { title?: string; body: string }>(
  english: T,
  italian: PublishedTranslation | undefined,
): T & { isTranslated: boolean } {
  if (!italian) return { ...english, isTranslated: false };
  return {
    ...english,
    title: italian.title ?? english.title,
    body: italian.body,
    isTranslated: true,
  };
}
