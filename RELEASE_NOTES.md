# Release Notes - v1.4.0

**Release Date:** September 13, 2026

## What's New

### Goodreads integration

- **Import from Goodreads**: new Import button on My Bookshelf accepts the Goodreads "Export Library" CSV. Finished, currently-reading, and to-read shelves are mapped to Finished / Reading / Wishlist, ratings and reviews come along, and books already on the shelf are skipped automatically.
- **Goodreads links**: every book detail now has a "Goodreads" button that opens the book's page (ISBN search when available).

### Security hardening

- All `series` mutations and the series list query now require sign-in (previously callable anonymously).
- Admin-gated the cover migration API (`migration.*`), seed/cleanup mutations (`seed.*`), suggestions lists, book club admin list, and reaction-stat queries.
- Weekly summary email now uses internal-only stats queries.

### UX fixes

- Desktop nav now reaches **Profile** and **Admin** (previously mobile-menu only).
- `/wishlist` redirects to the Wishlist tab instead of the default Finished tab.
- Public-site link relabeled to "Public Site" (no longer duplicates "My Bookshelf").

### Hosting: Netlify → Cloudflare

- `netlify.toml` replaced by `public/_redirects` (SPA fallback) and `public/_headers` (security + cache headers).
- Social-crawler OG meta moved from a Netlify edge function into shared logic (`src/edge/socialMeta.ts`), wired for **both** hosting modes:
  - **Workers static assets** (new default): `workers/index.ts` runs before asset serving (`run_worker_first`), returns meta HTML to crawlers, serves the SPA otherwise.
  - **Pages**: `functions/_middleware.ts` does the same as a Pages Function.
- `wrangler.jsonc` configures both modes; `pnpm run deploy:workers` / `deploy:cf` for manual deploys, `preview:workers` / `preview:cf` for local testing.

### Cleanup

- Removed unused `react-is` dependency, dead `react.svg` asset, the unused `readingChallenges` table, and nine one-off seed/migration scripts superseded by `convex/seed.ts` and the Goodreads importer.

---

## Live Sites

- **Production:** [izzysbookshelf.com](https://izzysbookshelf.com)
- **Staging:** [izzysbookshelf.antoniosmith.xyz](https://izzysbookshelf.antoniosmith.xyz)

---

## Deploy notes

1. **Create the Cloudflare project** (dashboard → Workers & Pages → Create → Connect to Git). Either mode works:
   - Build command: `pnpm install --frozen-lockfile && pnpm run build`
   - Output directory: `dist` (Pages); Workers picks it up from `assets.directory`
   - Env vars: `VITE_CONVEX_URL` (production + preview), plus `PNPM_VERSION=11.1.1` and `NODE_VERSION=22` to match local.
2. Deploy Convex with the frontend: `convex/schema.ts` drops the unused `readingChallenges` table and adds `wishlist.bulkAdd`; function signatures for `series.getByUser` / `series.create` changed.
3. Re-point `izzysbookshelf.com` DNS to Pages (custom domain), then retire the Netlify site.
4. No new env vars needed — Goodreads import runs entirely client-side; covers come from Open Library by ISBN.

```bash
pnpm install
pnpm run dev
```

---

## Missing / worth considering next

- **Currently-reading progress** (page X of Y, % complete) — the Reading tab has no progress tracking.
- **Reading streaks on the dashboard** — streak is computed but not surfaced as a daily habit loop.
- **Reading challenges/goals UI** — goals exist in profile settings but there's no dedicated challenge tracker.
- **Export/backup** — Goodreads import exists; a matching "export my library" CSV/JSON would complete the loop.
- **Undo for deletes** — deletes use `confirm()`; a toast-with-undo would be friendlier.
- **Search on the public bookshelf** — visitors can't search/filter the public shelf.
- **Book club discussion** — comments were removed; if book club gets traction a moderated comment thread may be worth revisiting.

---

# Release Notes - v1.3.0

**Release Date:** August 27, 2026

## What's New

### Public site redesign

Home, About, Poetry, Writing, Wishlist, and Reviews now share one brand-forward look: cream backgrounds, berry/teal accents, Fredoka display type, cover-led shelves, and fewer card chrome.

Writing posts use shareable URLs (`/blog/:slug`) instead of a modal — same pattern as poems and reviews.

### Reading experience

- **Finish ritual** when marking a book finished *and* when adding a book already as Read
- **Mood tags** when adding or editing books, with public shelf filters
- **Reading heatmap** on Activity / Insights
- **Series tracker**: reorder books and explicitly mark a series complete (plus auto-sync when all books are read)

### Admin polish

Dashboard and editor surfaces moved off purple→pink leftovers onto the berry/teal system (editors, Progress, covers, emails, Create).

### Security & deps

- Patched undici, nanoid, postcss, `@auth/core`, and react-router advisories
- Dependabot aligned with pnpm `minimumReleaseAge` (cooldown + excludes)
- Allowed MIT-0 licenses (e.g. `postal-mime` via Resend)

---

## Live Sites

- **Production:** [izzysbookshelf.com](https://izzysbookshelf.com)
- **Staging:** [izzysbookshelf.antoniosmith.xyz](https://izzysbookshelf.antoniosmith.xyz)

---

## Deploy notes

1. Deploy Convex schema changes (`books.tags`, `blogPosts.slug`) before or with the frontend.
2. Run once after deploy (as a parent/admin session): `npx convex run blogPosts:backfillSlugs` so existing writing posts get shareable slugs.
3. No local env changes required beyond existing Convex / Giphy keys.

```bash
pnpm install
pnpm run dev
```

---

## Cleanup in this release

Removed unused Signup / OnboardingTour / Skeleton UI, bare `emoji-mart` dependency, broken deploy script entries, and dead parent-mode context API.

Also pruned unused Convex write/helpers, retired the Admin cover-migration panel (CLI `convex/migration.ts` kept), consolidated on `BookCoverImage`, and removed unauthenticated `wishlist.adminPatchCover`.

---

## Previous Release (v1.2.0)

Migrated hosting from Coolify to Netlify. See git history / older section below for detail.

---

## Full Changelog

See [CHANGELOG.md](./CHANGELOG.md) for commit-level history.
