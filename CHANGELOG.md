# Changelog

All notable changes to Izzy's Bookshelf will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-24

### Changed

- **Rebranded from "Izzy Reads" to "Izzy's Bookshelf"** across all components
  - Updated manifest.json, index.html, service worker
  - Updated Login, Signup, Onboarding, Navigation components
  - Updated ExportData filenames and branding
  - Updated storage keys for theme and gamification contexts
- **Updated staging domain** to `izzysbookshelf.antoniosmith.xyz`
- **Updated production domain** to `izzysbookshelf.com`
- **Updated Convex staging URL** to `https://aware-gecko-889.convex.cloud`
- Upgraded GitHub Actions to latest versions:
  - `actions/checkout` v4 → v6
  - `oven-sh/setup-bun` v1 → v2

### Security

- **Fixed insecure randomness vulnerability** - Replaced `Math.random()` with `crypto.randomUUID()` in Toast component for secure ID generation
- Updated dependencies to latest secure versions:
  - `convex` 1.31.0 → 1.31.2
  - `typescript` 5.8.3 → 5.9.3
  - `@eslint/js` 9.39.1 → 9.39.2
  - `framer-motion` 12.23.25 → 12.23.26
  - `recharts` 3.5.1 → 3.6.0

### Infrastructure

- **Added staging/production separation** with dedicated Coolify projects
- Configured Coolify webhook deployments for automated CI/CD
- Updated deployment workflows to use webhook triggers
- Separated Convex deployments for staging and production environments

### Fixed

- Fixed parsing error in migrate-izzy-books.js (unterminated template literal)
- Fixed TypeScript error in ReviewAnalytics.tsx with recharts Formatter type

## [1.0.2] - 2025-12-15

### Changed

- Migrated deployment from Netlify to Coolify for self-hosted infrastructure
- Added Dockerfile for containerised production deployment
- Added nginx configuration for SPA routing and security headers
- Added .dockerignore for optimised Docker builds
- Updated README.md with Coolify deployment instructions
- Archived netlify.toml configuration (moved to git history)

### Fixed

- Fixed Dockerfile to use correct lockfile name (`bun.lock` instead of `bun.lockb`)
- Fixed .dockerignore to not exclude the lockfile needed for builds

### Infrastructure

- Docker-based deployment using multi-stage builds (Bun + nginx)
- nginx serves static files with gzip compression
- Security headers maintained from Netlify configuration
- Health check endpoint added at /health
- Automatic deployments via GitHub integration with Coolify

## [1.0.1] - 2025-12-15

### Added

- **Review Analytics Dashboard** - New analytics section in admin dashboard showing:
  - Total book reactions and review reactions
  - Most popular reviews ranked by reader engagement
  - Genre performance with average ratings chart
  - Book reactions breakdown (Love, Amazing, Must Read, So Good, Not For Me)
  - Review reactions breakdown (Helpful, Great Review, Agree, Funny, Insightful)
  - Average engagement per review metric
- `ReviewAnalytics` component with compact and full display modes

### Fixed

- Fixed wishlist link in public navigation pointing to protected route `/wishlist` instead of public route `/my-wishlist`
- Consolidated navigation across all public pages to use shared `PublicNav` component for consistency
- All public pages (Home, Reviews, Poetry, Wishlist, About) now have identical header and footer navigation

### Changed

- `PublicPortfolio.tsx` now uses `PublicNav` component instead of custom inline navigation
- `PublicPoetry.tsx` now uses `PublicNav` component instead of custom inline navigation
- `PublicReviews.tsx` now uses `PublicNav` component instead of custom inline navigation
- `PublicWishlist.tsx` now uses `PublicNav` component instead of custom inline navigation
- Dashboard now includes Analytics & Insights section at the bottom

## [1.0.0] - 2025-12-15

### Added

- Initial release of Izzy's Bookshelf
- Public portfolio with 5 themed tabs (Books, Poetry, Blog, Wishlist, About)
- Private dashboard for managing content
- Convex Auth for secure authentication
- Book tracking with ratings, reviews, and reading status
- Poetry editor with publish/unpublish capability
- Blog post creation and management
- Wishlist with UK retailer links
- Auto-calculated reading statistics
- Reading streak tracking
- Gamification system with XP and achievements
- Level progression system (20 levels)
- Reader reactions (love, amazing, must read, so good)
- Book search via Open Library API
- Book cover fetching from Open Library
- Series tracker for book series progress
- Reading goals and challenges
- Data export (JSON, CSV, PDF)
- Dark mode support
- PWA support for installable app
- Accessibility features (skip to content, screen reader support)
- Responsive design for mobile and desktop
- Error boundary with kid-friendly error messages
- 404 page with helpful navigation

### Security

- Content Security Policy headers
- XSS protection headers
- Secure authentication with Convex Auth
- Protected routes for admin content
- Input validation on all forms

### Performance

- Code splitting and lazy loading
- Vendor chunk optimization
- Image optimization with placeholder fallbacks
- Service worker for offline capability
