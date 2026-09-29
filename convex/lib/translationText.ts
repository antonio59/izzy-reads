// Pure helpers for Italian translation suggestions – no Convex imports so
// they can be unit tested directly.

export type TranslatableType = "poem" | "review" | "blogPost";

export interface TranslationSource {
  title?: string;
  body: string;
  /** Extra context for the translator, e.g. the book a review is about */
  context?: string;
}

export interface TranslationResult {
  title?: string;
  body: string;
}

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export const MAX_TRANSLATION_LENGTH = 20000;

const KIND_LABEL: Record<TranslatableType, string> = {
  poem: "a poem",
  review: "a book review",
  blogPost: "a short piece of writing",
};

/** Small, stable FNV-1a hash – used to spot when the English changes. */
export function hashText(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function sourceHash(source: TranslationSource): string {
  return hashText(`${source.title ?? ""}\u0000${source.body}`);
}

export function buildTranslationMessages(
  type: TranslatableType,
  source: TranslationSource,
): ChatMessage[] {
  const poemRules =
    type === "poem"
      ? "Keep exactly the same line breaks and blank lines between verses. Keep the rhythm light; only rhyme where it comes naturally – never change the meaning to force a rhyme."
      : "Keep the same paragraph breaks.";

  const system = [
    `You translate ${KIND_LABEL[type]} written by Izzy, a young girl, from English into Italian for her Italian family to read.`,
    "Keep her voice: simple, warm, natural Italian a child would write. Do not make it sound grown-up or formal.",
    "Translate faithfully. Do not add, remove or explain anything. Keep emoji, links and markdown images such as ![GIF](...) exactly as they are.",
    "Book titles and author names stay exactly as written.",
    poemRules,
    'Reply with JSON only, in the form {"title": "...", "body": "..."}. Use "title": null when no title is given.',
  ].join("\n");

  const user = JSON.stringify({
    ...(source.context ? { context: source.context } : {}),
    title: source.title ?? null,
    body: source.body,
  });

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

/** Parse the model reply, tolerating ```json fences. Throws on bad output. */
export function parseTranslationResponse(raw: string): TranslationResult {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Translation reply was not valid JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Translation reply was not an object");
  }
  const { title, body } = parsed as Record<string, unknown>;
  if (typeof body !== "string" || body.trim() === "") {
    throw new Error("Translation reply had no body");
  }
  if (body.length > MAX_TRANSLATION_LENGTH) {
    throw new Error("Translation reply was too long");
  }

  return {
    body: body.trim(),
    ...(typeof title === "string" && title.trim() !== ""
      ? { title: title.trim() }
      : {}),
  };
}
