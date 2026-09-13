// Cloudflare Workers entrypoint — static assets + social crawler meta.
// Runs before asset serving (assets.run_worker_first in wrangler.jsonc);
// crawlers on meta-able paths get OG/Twitter HTML, everything else is
// served from dist/ with single-page-application fallback.

import { socialMetaResponse } from "../src/edge/socialMeta";

interface Env {
  STATIC_ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return socialMetaResponse(request) ?? env.STATIC_ASSETS.fetch(request);
  },
};
