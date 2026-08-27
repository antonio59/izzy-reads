/**
 * Cover URL helpers — normalize resolution, ISBN covers, and invalid placeholders.
 */

const PLACEHOLDER_COVER = "/placeholder-book-cover.svg";

const INVALID_URL_PATTERNS = [
  "placeholder",
  "no-cover",
  "nocover",
  "missing",
  "blank",
  "1x1",
  "spacer",
];

/** Digits-only ISBN-10 or ISBN-13, or null if the string is not an ISBN. */
export function parseIsbn(query: string): string | null {
  const cleaned = query.replace(/[-\s]/g, "");
  if (/^\d{9}[\dXx]$/.test(cleaned)) {
    return cleaned.toUpperCase();
  }
  if (/^97[89]\d{10}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/** Open Library large cover by ISBN (works even when search docs lack cover_i). */
export function openLibraryIsbnCover(isbn: string): string {
  const clean = isbn.replace(/[-\s]/g, "");
  return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
}

/** Google Books front-cover URL at zoom 3 from a volume id. */
export function googleVolumeCoverUrl(volumeId: string): string {
  return `https://books.google.com/books/content?id=${encodeURIComponent(volumeId)}&printsec=frontcover&img=1&zoom=3&source=gbs_api`;
}

export function isLikelyInvalidCover(url: string | undefined | null): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (lower === PLACEHOLDER_COVER || lower.endsWith("placeholder-book-cover.png")) {
    return true;
  }
  // Avoid false positives on legitimate hosts that might contain "default"
  return INVALID_URL_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Upgrade a hotlinked cover to the highest practical resolution.
 * Leaves Convex storage, data URLs, and relative paths unchanged.
 */
export function upgradeCoverUrl(url: string | undefined | null): string {
  if (!url) return "";
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

  // Open Library: always prefer -L
  const olMatch = trimmed.match(
    /^(https?:\/\/covers\.openlibrary\.org\/b\/(?:id|isbn|olid)\/)([^/?#]+)-(?:S|M|L)(\.jpe?g)(\?.*)?$/i,
  );
  if (olMatch) {
    return `${olMatch[1].replace(/^http:/i, "https:")}${olMatch[2]}-L${olMatch[3]}${olMatch[4] ?? ""}`;
  }

  // Google Books / googleusercontent
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

/**
 * Pick the best cover URL from available sources.
 * Prefer upgraded Google/OL image links, then ISBN OL cover, then volume-id Google cover.
 */
export function resolveBestCoverUrl(options: {
  imageUrl?: string | null;
  isbn?: string | null;
  googleVolumeId?: string | null;
}): string {
  const upgraded = upgradeCoverUrl(options.imageUrl);
  if (upgraded && !isLikelyInvalidCover(upgraded)) {
    return upgraded;
  }
  if (options.isbn) {
    return openLibraryIsbnCover(options.isbn);
  }
  if (options.googleVolumeId) {
    return googleVolumeCoverUrl(options.googleVolumeId);
  }
  return "";
}

export { PLACEHOLDER_COVER };
