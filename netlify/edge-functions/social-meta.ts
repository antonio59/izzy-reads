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

function isCrawler(request: Request): boolean {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  return CRAWLER_AGENTS.some((agent) => userAgent.includes(agent.toLowerCase()));
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
}): string {
  const title = escapeHtml(params.title);
  const description = escapeHtml(params.description);
  const url = escapeHtml(params.url);
  const image = escapeHtml(params.image);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <p>Redirecting to ${title}...</p>
  <script>window.location.href="${url}"</script>
</body>
</html>`;
}

export default async (request: Request, context: Context) => {
  if (!isCrawler(request)) {
    return;
  }

  const url = new URL(request.url);
  const origin = url.origin;
  const ogImage = `${origin}/og-image.png`;

  // Poetry pages
  const poemMatch = url.pathname.match(/^\/poetry\/(.+)$/);
  if (poemMatch) {
    const slug = poemMatch[1];
    const title = `${slugToTitle(slug)} | Izzy's Poetry Corner`;
    const description = `Read "${slugToTitle(slug)}" - a poem by Izzy on Izzy's Bookshelf.`;
    return new Response(
      buildMetaHtml({ title, description, url: request.url, image: ogImage }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }

  // Review pages
  const reviewMatch = url.pathname.match(/^\/reviews\/(.+)$/);
  if (reviewMatch) {
    const bookId = reviewMatch[1];
    const title = `Izzy's Book Review | Izzy's Bookshelf`;
    const description = `Read Izzy's review of this book on Izzy's Bookshelf.`;
    return new Response(
      buildMetaHtml({ title, description, url: request.url, image: ogImage }),
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // Blog/writing pages
  if (url.pathname === "/blog") {
    const title = `Izzy's Writing | Izzy's Bookshelf`;
    const description = `Thoughts, reading adventures, and stories from Izzy's reading journey.`;
    return new Response(
      buildMetaHtml({ title, description, url: request.url, image: ogImage }),
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // Reviews list
  if (url.pathname === "/reviews") {
    const title = `Izzy's Book Reviews | Izzy's Bookshelf`;
    const description = `Honest book reviews from a young reader. Discover what Izzy thinks about fantasy, adventure, mystery and more!`;
    return new Response(
      buildMetaHtml({ title, description, url: request.url, image: ogImage }),
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  return;
};
