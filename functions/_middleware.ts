// Cloudflare Pages Function — social crawler meta tags.
// Thin wrapper over the shared handler in src/edge/socialMeta.ts;
// crawlers on meta-able paths get OG/Twitter HTML, everyone else
// falls through to static asset / SPA serving.

import { socialMetaResponse } from "../src/edge/socialMeta";

interface PagesEventContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest(context: PagesEventContext): Promise<Response> {
  return socialMetaResponse(context.request) ?? context.next();
}
