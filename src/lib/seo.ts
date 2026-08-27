/**
 * Site-wide SEO / social copy for Izzy's Bookshelf.
 * Keep descriptions benefit-led: who Izzy is + what visitors can do.
 */

export const SITE_NAME = "Izzy's Bookshelf";
export const SITE_URL = "https://izzysbookshelf.com";
/** Landscape share card — WhatsApp/Facebook prefer ~1200×630 JPEG under ~300KB */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT =
  "Izzy's Bookshelf — a young reader with her owl friend, books, reviews, poems, and wishlist";
export const THEME_COLOR = "#d946a8";

export const SITE_TAGLINE =
  "A young reader's shelf — books she's finished, reviews she wrote, poems & stories, and a wishlist for what's next.";

export const SITE_DESCRIPTION =
  "Explore Izzy's Bookshelf: every book she finishes, honest reviews, original poems and writing, plus a wishlist where friends can suggest the next great read.";

export const pageMeta = {
  home: {
    title: `${SITE_NAME} | Books, Reviews, Poems & Writing`,
    description: SITE_DESCRIPTION,
  },
  reviews: {
    title: `Book Reviews | ${SITE_NAME}`,
    description:
      "Honest book reviews from Izzy — what she loved, what surprised her, and which stories she'd recommend. Browse by genre, mood, or search.",
  },
  poetry: {
    title: `Poems | ${SITE_NAME}`,
    description:
      "Original poems by Izzy — short pieces from the heart, shared from her bookshelf for anyone who loves words as much as stories.",
  },
  writing: {
    title: `Writing | ${SITE_NAME}`,
    description:
      "Longer stories and thoughts from Izzy's reading life — adventures on the page, reflections, and writing she's proud to share.",
  },
  wishlist: {
    title: `Wishlist | ${SITE_NAME}`,
    description:
      "Books Izzy can't wait to read. Browse her wishlist, then suggest a title you think she'd love — family and friends welcome.",
  },
  about: {
    title: `About Izzy | ${SITE_NAME}`,
    description:
      "Meet Izzy — a young book lover building her shelf one story at a time. Learn what she reads, why she writes, and how to follow along.",
  },
  bookClub: {
    title: `Book Club | ${SITE_NAME}`,
    description:
      "Read along with Izzy's book club picks — join the conversation on the latest shared read from her bookshelf.",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
