import type { Context } from "@netlify/edge-functions";

// List of known social crawler user agents
const CRAWLER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "whatsapp",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "TelegramBot",
  "SkypeUriPreview",
  "Pinterestbot",
  "redditbot",
  "Applebot",
  "Googlebot",
  "bingbot",
];

const SITE_NAME = "Izzy's Bookshelf";
const OG_IMAGE_PATH = "/og-image.jpg";
const OG_IMAGE_WIDTH = "1200";
const OG_IMAGE_HEIGHT = "630";
const OG_IMAGE_ALT =
  "Izzy's Bookshelf — a young reader with her owl friend, books, reviews, poems, and wishlist";

function isCrawler(request: Request): boolean {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  return CRAWLER_AGENTS.some((agent) =>
    userAgent.includes(agent.toLowerCase()),
  );
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMetaHtml(params: {
  title: string;
  description: string;
  url: string;
  image: string;
  type?: "website" | "article";
}): string {
  const title = escapeHtml(params.title);
  const description = escapeHtml(params.description);
  const url = escapeHtml(params.url);
  const image = escapeHtml(params.image);
  const type = params.type ?? "article";
  const alt = escapeHtml(OG_IMAGE_ALT);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />
  <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:alt" content="${alt}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="${alt}" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <p>${title}</p>
</body>
</html>`;
}

function htmlResponse(html: string): Response {
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export default async (request: Request, _context: Context) => {
  if (!isCrawler(request)) {
    return;
  }

  const url = new URL(request.url);
  const origin = url.origin;
  const ogImage = `${origin}${OG_IMAGE_PATH}`;
  const canonical = `${origin}${url.pathname === "/" ? "/" : url.pathname}`;

  // Homepage
  if (url.pathname === "/" || url.pathname === "") {
    return htmlResponse(
      buildMetaHtml({
        title: `${SITE_NAME} | Books, Reviews, Poems & Writing`,
        description:
          "Explore Izzy's Bookshelf: every book she finishes, honest reviews, original poems and writing, plus a wishlist where friends can suggest the next great read.",
        url: canonical,
        image: ogImage,
        type: "website",
      }),
    );
  }

  // Poetry pages
  const poemMatch = url.pathname.match(/^\/poetry\/(.+)$/);
  if (poemMatch) {
    const slug = poemMatch[1];
    const title = `${slugToTitle(slug)} | Izzy's Poetry`;
    const description = `Read "${slugToTitle(slug)}" — a poem by Izzy on ${SITE_NAME}.`;
    return htmlResponse(
      buildMetaHtml({
        title,
        description,
        url: canonical,
        image: ogImage,
      }),
    );
  }

  // Review pages
  const reviewMatch = url.pathname.match(/^\/reviews\/(.+)$/);
  if (reviewMatch) {
    return htmlResponse(
      buildMetaHtml({
        title: `Izzy's Book Review | ${SITE_NAME}`,
        description: `Read Izzy's review of this book on ${SITE_NAME}.`,
        url: canonical,
        image: ogImage,
      }),
    );
  }

  // Blog/writing pages
  if (url.pathname === "/blog") {
    return htmlResponse(
      buildMetaHtml({
        title: `Writing | ${SITE_NAME}`,
        description:
          "Longer stories and thoughts from Izzy's reading life — adventures on the page, reflections, and writing she's proud to share.",
        url: canonical,
        image: ogImage,
        type: "website",
      }),
    );
  }

  // Reviews list
  if (url.pathname === "/reviews") {
    return htmlResponse(
      buildMetaHtml({
        title: `Book Reviews | ${SITE_NAME}`,
        description:
          "Honest book reviews from Izzy — what she loved, what surprised her, and which stories she'd recommend.",
        url: canonical,
        image: ogImage,
        type: "website",
      }),
    );
  }

  return;
};
