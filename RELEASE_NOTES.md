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
2. Existing published posts get slugs on next save; old `/blog` list links fall back to document id until then.
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
