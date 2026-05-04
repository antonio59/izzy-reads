# Changelog

All notable changes to this project will be documented in this file.
## [Unreleased]

### Bug Fixes

- Bring back Discover onboarding for Izzy, fix card descriptions
- Discover page 503 error - add OpenLibrary fallback
- Professional placeholder design for missing covers
- Detect blank placeholder covers via canvas pixel analysis
- Remove crossOrigin attribute and relax cover validation
- Detect Google Books placeholder images by aspect ratio
- About page fallback and wishlist cover images
- **ci**: Add initial loading state for Lighthouse CI
- **covers**: Add referrerPolicy=no-referrer for external book covers
- **ci**: Dynamic import for @sentry/vite-plugin to avoid minimatch/brace-expansion ESM issue
- **ci**: Correct minimatch patch for CJS brace-expansion compatibility
- **ci**: Patch minimatch@8.0.7 for brace-expansion CJS compatibility
- **ci**: Remove direct brace-expansion dependency to resolve ESM import conflict
- Show loading skeleton in PublicWishlist while data loads
- Escape quotes in social meta edge function HTML
- Add cache-busting headers to social meta edge function
- Poem slugs backfilled, social meta tags, avatar in writing
- Remaining legacy links, reduced-motion gaps and stray logs
- Address all outstanding PWA, lint, accessibility and bundle issues
- **security**: Resolve incomplete URL substring sanitization in migration.ts
- Replace all Google Books grey placeholder covers
- Remove platform-specific devDependencies for Netlify compatibility
- Add .npmrc with legacy-peer-deps for Netlify builds
- Add process type declaration to auth.config.ts
- Use DOMParser for HTML sanitization instead of regex (CodeQL #7)
- Correct import path and action/mutation mismatch
- Resolve CodeQL URL sanitization alerts and missing api.d.ts modules
- Correct useState type syntax error in CoverMigrationPanel
- Resolve circular type inference errors in covers and migration
- Harden book cover migration with retries, orphan protection, and audit log
- Remove unused imports causing lint errors
- Verify book covers before saving to database
- Footer position and wishlist book cover error handling
- Remove unused variables causing TypeScript errors
- Remove invalid character causing lint error in PublicPoetry.tsx
- Improve book cover error handling in FunBookshelfPublic
- Connect poems to Convex backend, use bun consistently
- Mark books as read when adding to bookshelf
- Add initialCheckDone state to prevent premature auth redirect
- Prevent premature redirect to login while auth state is loading
- Connect BookContext to Convex backend for data persistence
- Add Google Books and Giphy APIs to CSP, add Public Site link to navigation
- Add null safety checks to prevent dashboard crashes for new users
- Update branding to Izzy's Bookshelf in public pages
- Resolve lint error and rename to Izzy's Bookshelf
- Security and environment configuration updates
- Improve healthcheck with longer start period and explicit IP
- Remove unused Book import in ReviewAnalytics
- Use latest bun version and remove frozen-lockfile flag
- Correct bun lockfile name in Dockerfile and add new features
- Remove .npmrc file that was interfering with optional dependencies
- Move rollup to optionalDependencies (proper location)
- Update CI to skip optional dependencies with --no-optional flag
- Use .npmrc to handle optional platform dependencies in CI
- Resolve npm optional dependencies bug and CI compatibility
- Manually install optional rollup dependency
- Move platform-specific rollup dependency to optionalDependencies
- Remove CodeQL workflow file to use default setup
- Remove duplicate JavaScript from CodeQL matrix
- Add permissions to GitHub Actions workflows
- Remove unused useUser import
- Remove unused user variable in Navigation component
- Escape apostrophes in string literals
- Correct averageRating calculation syntax
- Update component syntax to avoid React.FC type errors
- Remove Amazon Wishlist tip from public wishlist view
- Update wishlist for UK retailers and add gift shipping note
- Add real book cover URLs to sample data
- Make app work without Supabase credentials configured
- Resolve TypeScript error in Supabase client
- Downgrade to Tailwind CSS v3 to resolve native binding issues
- Update to Tailwind CSS v4 PostCSS plugin
- Configure Tailwind CSS and add Supabase setup

### CI/CD

- Make SARIF upload non-blocking when Code Scanning is disabled
- Add OSV Scanner workflow for dependency vulnerability scanning
- Add automatic changelog workflow
- Add automatic changelog workflow
- Add automatic changelog workflow
- Bump actions/upload-artifact from 6 to 7 (#74)
- Bump actions/checkout from 5 to 6
- Bump peter-evans/create-pull-request from 7 to 8
- Bump actions/upload-artifact from 5 to 6
- Add comprehensive GitHub Actions workflows and automation

### Changes

- Merge pull request #135 from antonio59/dependabot/npm_and_yarn/globals-tw-17.6.0

chore(deps-dev): update globals requirement from ^17.5.0 to ^17.6.0
- Merge branch 'main' into dependabot/npm_and_yarn/globals-tw-17.6.0
- Merge pull request #133 from antonio59/dependabot/npm_and_yarn/typescript-eslint-tw-8.59.1

chore(deps-dev): update typescript-eslint requirement from ^8.59.0 to ^8.59.1
- Merge pull request #132 from antonio59/dependabot/npm_and_yarn/sentry/vite-plugin-tw-5.2.1

chore(deps-dev): update @sentry/vite-plugin requirement from ^5.2.0 to ^5.2.1
- Merge pull request #129 from antonio59/dependabot/npm_and_yarn/eslint-tw-10.3.0

chore(deps-dev): update eslint requirement from ^10.2.1 to ^10.3.0
- Merge pull request #128 from antonio59/dependabot/npm_and_yarn/lucide-react-tw-1.14.0

chore(deps): update lucide-react requirement from ^1.11.0 to ^1.14.0
- Merge pull request #127 from antonio59/dependabot/npm_and_yarn/sentry/react-tw-10.51.0

chore(deps): update @sentry/react requirement from ^10.50.0 to ^10.51.0
- Merge pull request #126 from antonio59/dependabot/npm_and_yarn/tailwind-0a4fd6b046

chore(deps-dev): update postcss requirement from ^8.5.12 to ^8.5.13 in the tailwind group
- Fix incomplete URL substring sanitization (CodeQL #30-31)
- Merge branch 'main' of https://github.com/antonio59/izzy-reads
- Merge branch 'main' of https://github.com/antonio59/izzy-reads
- Merge branch 'main' of https://github.com/antonio59/izzy-reads
- Merge branch 'main' of https://github.com/antonio59/izzy-reads
- Merge branch 'main' of https://github.com/antonio59/izzy-reads
- Merge branch 'main' of https://github.com/antonio59/izzy-reads
- Fix CodeQL #18 + CVEs (flatted, picomatch, uuid, brace-expansion)
- Redesign poem detail page and fix book suggestion cover fallbacks

- PoemDetail: compact layout with sticky top bar, quote glyphs, prev/next nav,
  copy poem button, read time, and horizontal more-poems scroll
- BookSuggestionsList: use BookCover component for graceful fallback on broken covers
- SuggestionFormModal: add placeholder-image detection in search results
- BookCover/FunBookshelfPublic/PublicWishlist: detect Google Books 1x1 placeholder
  images by checking naturalWidth/naturalHeight and show gradient fallback
- Merge pull request #84 from antonio59/dependabot/npm_and_yarn/esbuild/darwin-arm64-0.27.4

chore(deps-dev): bump @esbuild/darwin-arm64 from 0.27.2 to 0.27.4
- Merge pull request #81 from antonio59/dependabot/npm_and_yarn/rollup/rollup-darwin-arm64-tw-4.60.0

chore(deps-dev): update @rollup/rollup-darwin-arm64 requirement from ^4.55.1 to ^4.60.0
- Merge pull request #80 from antonio59/dependabot/npm_and_yarn/lightningcss-darwin-arm64-tw-1.32.0

chore(deps-dev): update lightningcss-darwin-arm64 requirement from ^1.30.2 to ^1.32.0
- Merge pull request #76 from antonio59/dependabot/npm_and_yarn/vite-e429c122fc

chore(deps-dev): bump the vite group with 2 updates
- Show encouraging message when 0 books read this month
- Prevent index.html caching to fix stale chunk errors after deploys
- Add destination selector when adding books - lets user choose Finished, Reading, or Wishlist
- Remove unused handleMoveToRead function
- Fix all ESLint warnings

- Ignore convex/_generated in ESLint config
- Add eslint-disable for react-refresh in files that export hooks/utilities
- Wrap stats object in useMemo in GamificationContext
- Extract complex dependency in FunBookshelf useMemo
- Add eslint-disable comments for intentional dependency omissions
- Fix lint errors: unused var and empty interface
- Add helpful page descriptions for Izzy on admin dashboard

- Create page: Added descriptions for Poems and Posts tabs
- Progress page: Added description explaining XP, badges, and goals
- MyBooks page already has tab descriptions from previous update

Each description explains what the page is for in kid-friendly language
- Update book tabs: Read -> Finished, add Reading tab, rename Want to Read -> Wishlist

- Three clear tabs: Finished (green), Reading (blue), Wishlist (pink)
- Added helpful descriptions for each tab explaining what it's for
- Reading tab shows books currently being read (isRead=false)
- Wishlist button now says 'Start Reading' instead of 'I Read It!'
- Reading card has 'Finished!' button to mark complete
- Better empty states with contextual messages
- Remove ownership checks - all authenticated users are family/parents

- Any logged-in user can edit/delete books, poems, blog posts, wishlist
- This is Izzy's personal site - parents/family help manage content
- Authentication still required for mutations
- Fix mobile hero text visibility and unify book data access

- Show hero description on mobile (removed hidden class)
- All content (books, poems, wishlist, blog) now fetched via getAll
- Added getAll query for blogPosts
- Added debug queries to identify books by user groups
- Added transferAllBooksToUser mutation for cleanup
- Parents/family login to manage, but all content is Izzy's
- Add mobile burger menu navigation

- Hide nav items on mobile, show burger menu icon
- Animated dropdown menu with all nav items
- Menu closes when item is clicked
- Logo now has room to display properly on mobile
- Fix avatar accessories positioning and outfit rendering

- Fixed bunny ears clipping (moved within viewBox bounds)
- Fixed flower and hair bow positioning
- Made outfit styles more distinct (t-shirt, hoodie, dress, sweater)
- Added expression field to Convex schema
- Updated all default avatar configs with expression field
- Expose Convex client globally for admin scripts
- Move genre tag to hover overlay with subtle styling
- Hide all like/reaction counts and add reset functions

- Remove poem likes display from Poetry page and Portfolio
- Remove book reaction count badges from bookshelf
- Add resetAllLikes mutation in poems.ts
- Add resetAllReactions mutation in reactions.ts
- Likes/reactions will be re-enabled when there's genuine engagement
- Improve UX: empty states, filter bar, genre tags, poetry intro

- Enhanced empty states with actionable messages:
  - Reviews: Link to bookshelf while waiting
  - Wishlist: Encourage book suggestions
  - Writing: Preview upcoming content types
- Filter bar now has clear labeled sections:
  - Search Books, Sort By, Filter by Genre
  - Visual grouping in a card container
- Added colorful genre tags to book cards (Fantasy, Humor, etc.)
- Added intro paragraph to Poetry page explaining what it's about
- Group reading stats into a unified card with header and dividers
- Add manual book entry, cover upload, and enhance hero CTAs

- Add manual book entry form when search fails or book not found
- Allow cover image upload for manually added books
- Add cover upload option when editing existing books (click cover to change)
- Enhance hero CTAs with larger buttons, icons, and clearer text:
  - 'Reviews' -> 'Read My Reviews' with star icon
  - 'About Me' -> 'Learn About Izzy' with user icon
- Remove unused accessory variable
- Enhance avatar editor with more options and fix accessories

- Add new accessories: round glasses, tiara, cat ears, bunny ears, heart glasses, freckles
- Fix all accessories to render as proper SVG (no more misplaced emojis)
- Add 4 new hair styles: pigtails, wavy, spiky, bob
- Add 6 facial expressions: happy, excited, cool, wink, surprised, thinking
- Add 6 new backgrounds: mint, coral, lavender, sky, peach, aurora
- Expressions change eyes, eyebrows and mouth appropriately
- Rename Blog to Writing in UI labels
- Fix KeyboardEvent type import
- Hide reactions widget and stat until there are actual reactions
- Fix tagging field and add more emojis including laughing category
- Add clickable level badge with progress tree modal

- New LevelModal component with visual level tree
- Shows current level, XP progress, and all 20 levels
- Displays how to earn XP (book completion, reviews, poems, etc.)
- Level badge in navigation now opens modal on click
- Move Quick Actions above Genre Mix in Dashboard sidebar
- Add scroll-triggered stagger animations

PageTransition.tsx:
- Add ScrollFadeIn, ScrollStaggerContainer, ScrollStaggerItem
- Add ScrollScaleIn for card animations
- All use useInView for scroll-triggered effects

MyBooks.tsx:
- Add AnimatedGrid component with scroll-triggered stagger
- Apply to both Read and Wishlist book grids
- Cards animate in with stagger when scrolled into view
- Extract Dashboard widgets to DashboardWidgets.tsx

New widgets:
- ReadingActivityChart, GenrePieChart, MostLovedBooks
- RecentBooks, QuickActions, WeeklyQuote
- generateMonthlyData/generateGenreData helpers

Dashboard.tsx: 700 -> ~270 lines (-61%)
- Add shared UI components and refactor large components

New components:
- Input, SearchInput, PasswordInput, Textarea, Select (ui/Input.tsx)
- BookSuggestionsList - shared suggestion management UI
- SuggestionFormModal - reusable book suggestion form

Barrel exports:
- src/contexts/index.ts - exports all context providers and hooks
- Updated src/components/ui/index.ts with new Input components

Component refactoring:
- PublicWishlist.tsx: 778 -> 373 lines (-52%)
- Wishlist.tsx: 402 -> 279 lines (-31%)
- MyBooks.tsx: 740 -> 612 lines (-17%)

All components now use shared BookSuggestionsList instead of
duplicating the suggestion card UI and logic.
- Upgrade to Tailwind CSS v4 and Vite v7

Major upgrades:
- Tailwind CSS 3.4 -> 4.1.18
- Vite 6.3 -> 7.3.0

Migration changes:
- Use @tailwindcss/vite plugin instead of PostCSS plugin
- Migrate CSS from @tailwind directives to @import 'tailwindcss'
- Move theme configuration to CSS using @theme directive
- Add @source directives to specify content scanning
- Remove tailwind.config.js (config now in CSS)
- Add native binary packages for lightningcss and oxide

Build: 2.81s (faster than before)
Tests: 30/30 passing
- Replace gray-* with stone-* for consistent color system

Standardize on stone color palette across all 47 component files:
- text-gray-* -> text-stone-*
- bg-gray-* -> bg-stone-*
- border-gray-* -> border-stone-*
- hover variants updated accordingly

Stone provides warmer neutral tones that complement the
primary/accent color palette better than cool grays.
- Add toast notifications for user feedback

Wire up useToastActions hook to key components:
- Wishlist.tsx: Add/decline/remove suggestions, move to bookshelf
- BookSearchModal.tsx: Search failures, no results found
- EditBookModal.tsx: Save success/failure

Provides clear visual feedback for all user actions.
- Add auth checks to Convex mutations, create shared BookSearchModal, update UI color system

Security:
- Add authentication and ownership verification to all Convex mutations
- Add admin role checks (isParent) for book suggestion management
- Remove userId from mutation args (now derived from auth context)

Refactoring:
- Create reusable BookSearchModal component with bookshelf/wishlist modes
- Refactor BookSearch.tsx and Wishlist.tsx to use shared modal
- Reduce Wishlist.tsx from 644 to 402 lines (-37%)

UI/Design System:
- Add iris/coral/sage color palette aliases in tailwind.config.js
- Update Button variants to primary/accent/success
- Add legacy variant support to Badge component
- Standardize color usage across Card, Progress, Modal, Tabs, Toast

Dependencies:
- Update to React 19.2.3, react-router-dom 7.11.0
- Fix esbuild version mismatch with package.json override
- Remove duplicate /blog route from App.tsx
- Remove export data feature
- Fix session persistence, improve gift from combobox UI
- Fix avatar display - remove conflicting container sizes
- Add giftFrom autocomplete, emoji picker for reviews, and filter by gift giver
- Fix avatar loading - load from localStorage immediately on init
- Update browser metadata from 'Magical Reading Corner' to 'Izzy's Bookshelf'
- Fix avatar display - properly sized on home page, show avatar on About page
- Make all public page heroes compact - inline icons with titles
- Add public blog page at /blog with navigation link
- Replace blog post modal with full-page editor for better UX
- Fix GIF picker popup positioning - use left alignment and allow overflow
- Trigger rebuild with Giphy API key
- Fix GifPicker to always show button, display message when not configured
- Add emoji picker and Giphy integration to blog post editor
- Add book review editing functionality

- Create EditBookModal with rating, date, and review textarea
- Add Edit/Review button to ReadBookCard in MyBooks
- Show 'Reviewed' indicator on books with reviews
- Enable edit from BookDetailModal
- Wire up updateBook to save changes to Convex
- Clean up dead code, add reaction stats query, implement social sharing

- Remove unused addReaction/addReviewReaction stubs from BookContext
- Add getAllBookReactionStats Convex query for Dashboard stats
- Update Dashboard and ReviewAnalytics to use Convex reaction data
- Create ShareButton component with Twitter, Facebook, Email, Copy options
- Add ShareBookButton and ShareReviewButton convenience components
- Update ReviewCard, FunBookshelfPublic, PublicReviews to use new sharing
- Remove debug console.log statements
- Restore wishlist.getAll query now that staging Convex is synced
- Remove wishlist.getAll query that doesn't exist on staging deployment
- Wire up reactions to Convex and fix public data fetching for wishlist covers

- Add useBookReactions and useReviewReactions hooks for Convex persistence
- Create ReactionButtons components with visitor ID tracking
- Update FunBookshelfPublic to use new reaction system
- Update ReviewCard and PublicReviews to use Convex reactions
- Add wishlist.getAll query for public pages
- Fix BookContext to fetch all data for unauthenticated visitors
- Add error boundary to About page to gracefully handle Convex errors
- Fix About page loading state with proper spinner while Convex initializes
- Add Profile Editor for About Me page customization

- Create aboutProfile table in Convex schema
- Create Convex API for profile CRUD operations
- Add ProfileEditor component with full editing UI
- Pre-populate with existing content as starting point
- Add /profile route for editing
- Add 'Edit About Me' link in Dashboard quick actions
- Create AboutPageWrapper to fetch profile from Convex with fallback
- Hero section customization (tagline, description)
- List editors for genres, authors, fun facts, goals, achievements
- Add quick links to Series Tracker and Export Data on My Books page
- Add reactions, series persistence, reading streak, and configurable goals

- Add Convex reactions table and API for book/review reactions
- Add Convex bookSeries table and API for tracking series progress
- Calculate reading streak (consecutive months with books read)
- Make yearly/monthly reading goals editable in Progress page
- Add yearlyBookGoal and monthlyBookGoal to userProfiles schema
- Rewrite SeriesTracker to use Convex for persistence
- Add book suggestions management to MyBooks page

- Add suggestions section in 'Want to Read' tab
- Show pending count badge when new suggestions arrive
- Approve button adds book to wishlist
- Decline and remove options for reviewed suggestions
- Collapsible section to show/hide all suggestions
- Add book management actions and improve navigation

- Add remove/move-to-wishlist buttons for read books in MyBooks
- Add Dashboard link in public nav for logged-in users
- Update Dashboard quick actions to use new routes (/books, /create)
- Add moveToWishlist function to BookContext
- Remove parent mode - Izzy can publish freely

- Remove ParentDashboard component and /parent route
- Simplify blog post status to draft/published (remove pending)
- Remove parentApproved field from blog posts
- Update Blog.tsx and Create.tsx to publish directly
- Simplify navigation (already done in previous session)
- Add simple manual migration script for Izzy's books

- Create easy-to-use migration script
- Includes all books with proper ISBNs and covers
- Ready for copy-paste into browser console
- This bypasses TypeScript issues in Convex files
- Add missing ISBNs and cover URLs for book covers

- Add ISBNs for: Geekhood, Wild Robot, Dork Diaries, Treehouse series, Marcus Rashford, Fairy Tales
- Add cover URLs using Open Library ISBN-based format
- This should fix missing book covers in frontend
- Prepare for proper staging project setup

- Update deployment scripts to use dedicated staging project
- Remove preview-deploy arguments
- Ready for new Convex staging project deploy key
- Fix staging to use persistent dev deployment instead of preview

- Staging will now use impressive-elk-411 (persistent)
- Preview deployments were changing URLs on every deploy
- This provides stable staging environment
- Force correct staging Convex URL in Dockerfile

- Set default staging URL to perfect-elk-539
- Fallback ensures correct connection if build args fail
- Update staging deployment script with correct Convex URL

- Fix staging Convex deployment URL to perfect-elk-539
- Ensure proper environment variable setup
- Fix seed database to create user and profile before seeding books
- Add seed database functionality for staging

- Create seed mutation to populate Izzy's books from frontend data
- Add prepare seed data script for testing
- Add debug logging to staging Dockerfile
- Add staging Dockerfile with environment-aware builds
- Add permissions to GitHub workflows for staging and production
- Update staging workflow to use proper GitHub secret
- Add production deployment configuration

- Create production deployment script with safety checks
- Add production environment template
- Set up GitHub workflow for production deployments
- Update package.json with production deploy script
- Clean up old staging deployment files
- Configure staging deployment with Convex preview deploy key
- Fix Convex deployment to use dev deployment with non-interactive flag
- Fix staging deployment to use existing Convex deployment
- Add staging deployment setup for Coolify

- Add staging deployment script and GitHub workflow
- Update CSP to allow WebSocket connections for Convex
- Add staging build and deploy scripts to package.json
- Configure environment variables for staging deployment
- Merge pull request #32 from antonio59/dependabot/github_actions/actions/checkout-6

ci: bump actions/checkout from 5 to 6
- Merge pull request #37 from antonio59/dependabot/npm_and_yarn/esbuild/darwin-arm64-0.27.1

chore(deps-dev): bump @esbuild/darwin-arm64 from 0.25.12 to 0.27.1
- Merge pull request #39 from antonio59/dependabot/npm_and_yarn/types/node-25.0.2

chore(deps): bump @types/node from 24.10.4 to 25.0.2
- Merge pull request #40 from antonio59/dependabot/github_actions/peter-evans/create-pull-request-8

ci: bump peter-evans/create-pull-request from 7 to 8
- Merge pull request #41 from antonio59/dependabot/github_actions/actions/upload-artifact-6

ci: bump actions/upload-artifact from 5 to 6
- Merge pull request #42 from antonio59/dependabot/npm_and_yarn/convex-tw-1.31.0

chore(deps): update convex requirement from ^1.30.0 to ^1.31.0
- Merge pull request #43 from antonio59/dependabot/npm_and_yarn/lucide-react-0.561.0

chore(deps): bump lucide-react from 0.555.0 to 0.561.0
- Merge pull request #45 from antonio59/dependabot/npm_and_yarn/typescript-eslint-tw-8.49.0

chore(deps-dev): update typescript-eslint requirement from ^8.48.1 to ^8.49.0
- Merge pull request #44 from antonio59/dependabot/npm_and_yarn/eslint-tw-9.39.2

chore(deps-dev): update eslint requirement from ^9.39.1 to ^9.39.2
- Update GitHub Actions to latest versions

- actions/checkout v4 -> v5
- actions/upload-artifact v4 -> v5
- peter-evans/create-pull-request v5 -> v7
- treosh/lighthouse-ci-action v10 -> v12

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>
- Update GitHub Actions workflows to use Bun instead of npm

- Update ci.yml to use oven-sh/setup-bun@v2
- Update dependency-updates.yml to use bun install/update
- Update security-scan.yml to use bun audit
- Add build:frontend script for CI builds without Convex deployment

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>
- Fix security vulnerabilities and rollup/esbuild native module issues

- Update all dependencies to latest compatible versions
- Add @rollup/rollup-darwin-arm64 and @esbuild/darwin-arm64 to devDependencies
- Fix high severity glob vulnerability (tailwindcss)
- Fix moderate js-yaml vulnerability (eslint)

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>
- Migrate from Supabase to Convex

- Replace Supabase with Convex for backend and database
- Add Convex schema and functions for books, poems, blog posts, wishlist, users, and reading challenges
- Update AuthContext to use Convex with localStorage-based auth
- Switch from npm to bun package manager
- Update README with new setup instructions
- Remove all Supabase-related files and dependencies
- Clean up .history folder

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>
- Update documentation to reflect magical design overhaul

Update replit.md to document the implementation of a new design theme, including a rainbow gradient title, playful fonts, animated elements, and accessibility improvements.

Replit-Commit-Author: Agent
Replit-Commit-Session-Id: eab79a91-6ab5-47a2-b8a8-1c4ca71638af
Replit-Commit-Checkpoint-Type: full_checkpoint
Replit-Commit-Event-Id: 7c023fb8-6496-4389-a4a4-9cba69d97029
Replit-Commit-Screenshot-Url: https://storage.googleapis.com/screenshot-production-us-central1/79b1956c-c1cd-4e2e-b05d-0ef160a3fa1a/eab79a91-6ab5-47a2-b8a8-1c4ca71638af/8hVLKSz
- Revamp the application's visual design with playful, magical aesthetics

Introduce a whimsical and magical redesign, incorporating custom fonts, vibrant gradients, playful animations, and decorative elements to create a more engaging and child-friendly user experience.

Replit-Commit-Author: Agent
Replit-Commit-Session-Id: eab79a91-6ab5-47a2-b8a8-1c4ca71638af
Replit-Commit-Checkpoint-Type: intermediate_checkpoint
Replit-Commit-Event-Id: 6749a5cb-a3e8-4473-976c-d1d9d0cf5200
Replit-Commit-Screenshot-Url: https://storage.googleapis.com/screenshot-production-us-central1/79b1956c-c1cd-4e2e-b05d-0ef160a3fa1a/eab79a91-6ab5-47a2-b8a8-1c4ca71638af/8hVLKSz
- Update application configuration and add project documentation

Update Vite configuration to enable external host access and set the development server port to 5000. Add a `replit.md` file detailing project overview, architecture, setup, and deployment notes.

Replit-Commit-Author: Agent
Replit-Commit-Session-Id: eab79a91-6ab5-47a2-b8a8-1c4ca71638af
Replit-Commit-Checkpoint-Type: full_checkpoint
Replit-Commit-Event-Id: 560dd8bd-0f41-49e0-ac0e-adf5e865a571
Replit-Commit-Screenshot-Url: https://storage.googleapis.com/screenshot-production-us-central1/79b1956c-c1cd-4e2e-b05d-0ef160a3fa1a/eab79a91-6ab5-47a2-b8a8-1c4ca71638af/8NYXr3I

### Chores

- **deps-dev**: Update typescript-eslint requirement
- **deps-dev**: Update @sentry/vite-plugin requirement
- **deps-dev**: Update eslint requirement from ^10.2.1 to ^10.3.0
- **deps**: Update lucide-react requirement from ^1.11.0 to ^1.14.0
- **deps**: Update @sentry/react requirement from ^10.50.0 to ^10.51.0
- **deps-dev**: Update postcss requirement in the tailwind group
- **deps-dev**: Update globals requirement from ^17.5.0 to ^17.6.0
- Remove dead code and update dependencies
- **deps-dev**: Bump the tailwind group across 1 directory with 2 updates (#113)
- Remove package-lock.json from git tracking
- **deps**: Bump resend from 6.10.0 to 6.12.0 (#108)
- **deps**: Bump react-router-dom in the react group (#103)
- Update dependencies (#102)
- Send suggestion emails from verified domain
- **deps**: Bump convex from 1.34.1 to 1.35.1 (#97)
- **deps-dev**: Bump @types/node from 25.5.2 to 25.6.0 (#99)
- Weekly dependency updates (#101)
- Clean up netlify.toml for single production site
- Fix npm vulnerabilities [skip ci]
- Upgrade all dependencies to latest versions
- **deps-dev**: Bump @esbuild/darwin-arm64 from 0.27.2 to 0.27.4
- **deps-dev**: Update @rollup/rollup-darwin-arm64 requirement
- **deps-dev**: Update lightningcss-darwin-arm64 requirement
- **deps-dev**: Bump the vite group with 2 updates
- Add git-cliff config for changelog generation
- Add git-cliff config for changelog generation
- Add git-cliff config for changelog generation
- Update dependencies (#56)
- **deps-dev**: Update @types/react requirement (#75)
- **deps-dev**: Update typescript-eslint requirement (#70)
- **deps-dev**: Bump globals from 16.5.0 to 17.0.0 (#64)
- **deps**: Bump @auth/core from 0.37.2 to 0.41.1 (#60)
- **deps-dev**: Update @types/node requirement from ^25.0.2 to ^25.0.6 (#72)
- **deps-dev**: Update @rollup/rollup-darwin-arm64 requirement (#71)
- **deps-dev**: Bump the vite group across 1 directory with 2 updates (#67)
- **deps-dev**: Update jsdom requirement from ^27.3.0 to ^27.4.0 (#63)
- Dependency updates and bug fixes
- Simplify netlify.toml for two-site setup
- Trigger rebuild
- **deps**: Update framer-motion requirement (#53)
- **deps**: Update recharts requirement from ^3.5.1 to ^3.6.0 (#54)
- **deps-dev**: Update @esbuild/darwin-arm64 requirement (#55)
- **deps-dev**: Bump @esbuild/darwin-arm64 from 0.25.12 to 0.27.1
- **deps**: Bump @types/node from 24.10.4 to 25.0.2
- **deps**: Update convex requirement from ^1.30.0 to ^1.31.0
- **deps**: Bump lucide-react from 0.555.0 to 0.561.0
- **deps-dev**: Update typescript-eslint requirement
- **deps-dev**: Update eslint requirement from ^9.39.1 to ^9.39.2
- Update all dependencies and fix security issues
- Rename project to Izzy Reads and fix rollup dependency

### Documentation

- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update changelog [skip ci]
- Update README and CHANGELOG for v1.1.0
- Add guide for closing Dependabot PRs
- Add final project summary
- Add setup completion guide
- Add comprehensive README.md
- Add comprehensive technical and user documentation
- Add Amazon Wishlist setup guide to user documentation
- Add technical and user documentation
- Add quick-start minimal SQL schema
- Add step-by-step Supabase setup guide
- Add complete Supabase database schema
- Add comprehensive public portfolio and authentication guide
- Add comprehensive setup guide for Supabase and keep-alive

### Features

- Personalize private pages for Izzy, remove generic onboarding
- Discover page UX overhaul - age filtering, onboarding, swipe fixes
- Redesign login page for Izzy only, remove signup
- Add adminPatchCover mutation for CLI cover updates
- Complete design system migration to shared UI primitives
- Genuine reactions, poem slugs, book club, discover modal, weekly summary email
- **ui/ux**: Accessibility, navigation and dashboard improvements
- **onboarding**: Add interactive first-time tour for new users
- Add migration to replace OpenLibrary covers with Google Books
- Email notifications, mark-as-bought on wishlist, share wishlist link
- Discover page with Tinder-style book swipe recommendations (#94)
- Add admin page with cover migration panel
- Bulk migration system for book covers
- Store book covers in Convex storage for permanence
- Improve book cover handling with error fallbacks
- Redesign poetry pages - dedicated poem detail view
- Update Wishlist to use Google Books API search instead of manual form
- Migrate from Coolify to Netlify (v1.2.0) [**BREAKING**]
- Add Netlify configuration for deployment
- Migrate deployment from Netlify to Coolify
- Add Book Recommendations section to portfolio
- Add Reading Stats component to public portfolio
- Integrate About Me tab into public portfolio
- Add About Me component and new feature types
- Add public wishlist with purchase links and social sharing
- Make public portfolio header compact like dashboard
- Completely redesign public portfolio for stunning visuals
- Enhance dashboard quick action buttons
- Add weekly rotating reading quotes system
- Simplify navigation to icon-only with tooltips on hover
- Add public portfolio and authentication system
- Add Open Library API integration, 3D bookshelf, and poem publishing

### Refactoring

- Simplify UX with 4 core navigation items [**BREAKING**]
- Rename project from isabella-reads to izzy-reads
- Move navigation to header and remove admin login
- Unify navigation with integrated count badges


