declare const process: { env: Record<string, string | undefined> };

/**
 * Hosts whose images are allowed as cover URLs. Anything else is rejected at
 * write time so untrusted user input can never turn coverUrl into a tracking
 * pixel or external-content reference.
 */
const ALLOWED_COVER_HOSTS = [
  "covers.openlibrary.org",
  "books.google.com",
  "books.googleusercontent.com",
  "gph.is",
  "i.giphy.com",
  "media.giphy.com",
  "media0.giphy.com",
  "media1.giphy.com",
  "media2.giphy.com",
  "media3.giphy.com",
  "media4.giphy.com",
];

function isConvexStorageHost(hostname: string): boolean {
  return (
    hostname.endsWith(".convex.cloud") ||
    hostname === "convex.site" ||
    hostname.endsWith(".convex.site")
  );
}

/**
 * True when `url` is safe to store as a cover image reference:
 * inline data URLs (local uploads), relative paths, Convex storage, or
 * https URLs on the cover host allowlist.
 */
export function isAllowedCoverUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("data:image/") || trimmed.startsWith("/")) return true;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return isConvexStorageHost(host) || ALLOWED_COVER_HOSTS.includes(host);
  } catch {
    return false;
  }
}

/** Escape user-controlled text interpolated into an HTML email body. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Server-side pepper for book-club passcodes (Convex env var). */
export function passcodePepper(): string {
  return process.env.PASSCODE_PEPPER ?? "izzy-bookclub-default-pepper";
}

/**
 * Hash a book-club passcode before storage or lookup. Stored values are
 * SHA-256(pepper + ":" + passcode) – never plaintext – so a table read or
 * index dump does not reveal visitor passcodes.
 */
export async function hashPasscode(passcode: string): Promise<string> {
  const data = new TextEncoder().encode(`${passcodePepper()}:${passcode}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
