import type { TFunction } from "i18next";

/** Intl locale for the active UI language. */
export function localeFor(language: string | undefined): string {
  return language?.startsWith("it") ? "it-IT" : "en-US";
}

/** Format a stored date string for the active language ("" if invalid). */
export function formatDate(
  value: string | number | Date,
  language: string | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(localeFor(language), options);
}

const POEM_TEMPLATE_KEYS = {
  haiku: "poems.templates.haiku",
  acrostic: "poems.templates.acrostic",
  "free verse": "poems.templates.freeVerse",
  rhyming: "poems.templates.rhyming",
  "shape poem": "poems.templates.shapePoem",
  upload: "poems.templates.upload",
} as const;

/** Translated poem style label, falling back to the stored name. */
export function poemTemplateLabel(t: TFunction, template: string): string {
  const key =
    POEM_TEMPLATE_KEYS[template.trim().toLowerCase() as keyof typeof POEM_TEMPLATE_KEYS];
  return key ? t(key) : template;
}

const GENRE_KEYS = {
  fiction: "genres.fiction",
  fantasy: "genres.fantasy",
  adventure: "genres.adventure",
  mystery: "genres.mystery",
  humor: "genres.humor",
  humour: "genres.humor",
  "graphic novel": "genres.graphicNovel",
  "non-fiction": "genres.nonFiction",
  "science fiction": "genres.scienceFiction",
  romance: "genres.romance",
  horror: "genres.horror",
  "historical fiction": "genres.historicalFiction",
  "realistic fiction": "genres.realisticFiction",
  biography: "genres.biography",
  poetry: "genres.poetry",
  other: "genres.other",
} as const;

/** Translated genre name, falling back to the stored name. */
export function genreLabel(t: TFunction, genre: string): string {
  const key = GENRE_KEYS[genre.trim().toLowerCase() as keyof typeof GENRE_KEYS];
  return key ? t(key) : genre;
}
