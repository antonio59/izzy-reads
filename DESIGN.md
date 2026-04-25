---
version: alpha
name: Izzy Reads
description: A magical, cozy reading nook design system for young book lovers. Playful yet accessible, warm yet vibrant.
colors:
  primary: "#d946a8"
  primary-hover: "#be3590"
  primary-active: "#9d2d77"
  primary-light: "#fce7f3"
  primary-lighter: "#fdf2f8"
  secondary: "#0d9488"
  secondary-hover: "#0a7a70"
  secondary-light: "#ccfbf1"
  tertiary: "#f59e0b"
  tertiary-light: "#fef3c7"
  neutral: "#fbf8f3"
  neutral-light: "#ffffff"
  neutral-muted: "#f5f1ea"
  text-primary: "#1a1614"
  text-secondary: "#454039"
  text-body: "#736d65"
  text-muted: "#a39e96"
  border: "#e8e4df"
  border-hover: "#d4cfc8"
  success: "#22c55e"
  success-light: "#dcfce7"
  error: "#ef4444"
  error-light: "#fee2e2"
  on-primary: "#ffffff"
  on-secondary: "#ffffff"
  on-tertiary: "#1a1614"
  on-neutral: "#1a1614"

typography:
  h1:
    fontFamily: Nunito
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.02em
  h2:
    fontFamily: Nunito
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.25
  h3:
    fontFamily: Nunito
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.375
  display:
    fontFamily: Fredoka
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.2
  display-xl:
    fontFamily: Nunito
    fontSize: 3.75rem
    fontWeight: 700
    lineHeight: 1.1
  display-2xl:
    fontFamily: Nunito
    fontSize: 4.5rem
    fontWeight: 700
    lineHeight: 1.0
  poetry:
    fontFamily: "Georgia, Cambria, serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0.01em
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  2xl: 1.5rem
  3xl: 2rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.primary-active}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.primary-lighter}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "12px 24px"
  button-ghost-hover:
    backgroundColor: "{colors.primary-lighter}"
  button-accent:
    backgroundColor: "{colors.secondary-hover}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "12px 24px"
  button-accent-hover:
    backgroundColor: "{colors.secondary}"
  button-danger:
    backgroundColor: "#b91c1c"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "12px 24px"
  button-danger-hover:
    backgroundColor: "#991b1b"
    textColor: "{colors.on-primary}"
  button-success:
    backgroundColor: "#15803d"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "12px 24px"
  button-success-hover:
    backgroundColor: "#166534"
    textColor: "{colors.on-primary}"
  progress-bar:
    backgroundColor: "{colors.neutral-muted}"
    rounded: "{rounded.full}"
  progress-bar-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
  toast:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
  toast-success:
    backgroundColor: "{colors.success-light}"
    textColor: "#15803d"
  toast-error:
    backgroundColor: "{colors.error-light}"
    textColor: "#b91c1c"
  rating-star:
    backgroundColor: "transparent"
    textColor: "{colors.tertiary}"
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-neutral}"
  divider:
    backgroundColor: "{colors.border}"
  divider-hover:
    backgroundColor: "{colors.border-hover}"
  badge-tertiary:
    backgroundColor: "{colors.tertiary-light}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.full}"
    typography: "{typography.body-sm}"
    padding: "4px 10px"
  paragraph:
    textColor: "{colors.text-body}"
    typography: "{typography.body}"
  caption:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
  status-success:
    backgroundColor: "#15803d"
    textColor: "{colors.on-primary}"
  status-error:
    backgroundColor: "#b91c1c"
    textColor: "{colors.on-primary}"
  dot-success:
    backgroundColor: "#15803d"
    rounded: "{rounded.full}"
    size: "8px"
  dot-error:
    backgroundColor: "{colors.error}"
    rounded: "{rounded.full}"
    size: "8px"
  chart-success:
    backgroundColor: "{colors.success}"
  card-default:
    backgroundColor: "{colors.neutral-light}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  card-elevated:
    backgroundColor: "{colors.neutral-light}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  card-interactive:
    backgroundColor: "{colors.neutral-light}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  card-outlined:
    backgroundColor: "{colors.neutral-light}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  card-gradient:
    backgroundColor: "linear-gradient(135deg, {colors.primary-lighter}, {colors.secondary-light})"
    rounded: "{rounded.2xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    typography: "{typography.body}"
    padding: "10px 16px"
  input-focus:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.text-primary}"
  badge-primary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary-active}"
    rounded: "{rounded.full}"
    typography: "{typography.body-sm}"
    padding: "4px 10px"
  badge-accent:
    backgroundColor: "{colors.secondary-light}"
    textColor: "{colors.secondary-hover}"
    rounded: "{rounded.full}"
    typography: "{typography.body-sm}"
    padding: "4px 10px"
  badge-stone:
    backgroundColor: "{colors.neutral-muted}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    typography: "{typography.body-sm}"
    padding: "4px 10px"
  modal:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  stat-card:
    backgroundColor: "{colors.neutral-light}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

## Overview

Izzy Reads is a magical, cozy reading tracker and public portfolio for young book lovers. The design system balances **playful warmth** with **calm readability** — like stepping into a favorite reading nook.

The visual identity is built on three principles:

1. **Cozy & Inviting** — Warm cream backgrounds, rounded shapes, and soft shadows create a safe, comfortable space.
2. **Playfully Magical** — The Fredoka accent font, berry-to-teal gradients, and subtle floating animations add whimsy without overwhelming.
3. **Accessible & Clear** — All color combinations meet WCAG AA standards. Nunito headings and Inter body text ensure excellent readability for young readers.

## Colors

The palette is rooted in a 5-color system with clear roles:

- **Primary (Berry #d946a8)** — CTAs, active states, key links, primary buttons. Vibrant but not harsh. Hover at `#be3590`, active at `#9d2d77`.
- **Secondary (Teal #0d9488)** — Badges, chips, genre tags, secondary actions. Calming and bookish. Hover at `#0a7a70`.
- **Tertiary (Star Gold #f59e0b)** — **Reserved exclusively for ratings and favorites.** Keeping gold special ensures star ratings feel meaningful.
- **Neutral (Warm Cream #fbf8f3)** — Main page background. Softer and more inviting than pure white.
- **Text (Warm Stone #1a1614 to #736d65)** — Headings at `#1a1614` (AAA on cream), body text at `#736d65` (AA on cream), muted text at `#a39e96`.

### Extended Magical Palette

For gradients, decorative borders, gamification, and section backgrounds, the app uses an extended "magical" palette. These are **never used for text or UI controls** — only for backgrounds, borders, and decorative elements:

| Name | Hex | Usage |
|------|-----|-------|
| Magic Purple | `#c084fc` | Scrollbar gradients, focus rings, decorative borders |
| Magic Pink | `#ff6b9d` | Rainbow gradients, fun section accents |
| Magic Blue | `#60a5fa` | Rainbow gradients, sky/water themed sections |
| Magic Green | `#34d399` | Rainbow gradients, nature themed sections |
| Magic Amber | `#fbbf24` | Rainbow gradients, sun/gold themed sections |
| Magic Rose | `#f43f5e` | Achievement rare items, dramatic accents |
| Magic Violet | `#8b5cf6` | Book cover placeholders, genre colors |
| Magic Indigo | `#6366f1` | Book cover placeholders, genre colors |

### Backgrounds

- **Page:** `#fbf8f3` — Warm cream, the main canvas.
- **Surface:** `#ffffff` — White cards on cream.
- **Elevated:** `#ffffff` — Modals, dropdowns, popovers.
- **Muted:** `#f5f1ea` — Subtle sections, alternate rows, stat card icon backgrounds.

### Semantic Colors

- **Success:** `#22c55e` — Positive feedback, achievements, level-ups.
- **Error:** `#ef4444` — Form validation, destructive actions, warnings.

## Typography

Three font families create a clear hierarchy:

- **Nunito** (display) — Headlines, card titles, button text, stat values. Bold, friendly, rounded letterforms.
- **Inter** (body) — Paragraphs, descriptions, labels, inputs. Highly legible at all sizes.
- **Fredoka** (accent) — Special display moments, fun headings. Playful and kid-friendly.
- **System Serif** (poetry) — Georgia/Cambria for poem body text. Adds elegance and literary feel.

### Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `h1` | 3rem | 700 | Page titles |
| `h2` | 1.875rem | 700 | Section headers |
| `h3` | 1.5rem | 700 | Card titles |
| `display` | 2.25rem | 600 | Hero moments, fun headings |
| `display-xl` | 3.75rem | 700 | Large decorative numbers, empty states |
| `display-2xl` | 4.5rem | 700 | Maximum impact moments (404, achievement unlocks) |
| `body` | 1rem | 400 | Paragraphs, general text |
| `body-sm` | 0.875rem | 400 | Captions, metadata, secondary info |
| `label` | 0.875rem | 500 | Buttons, form labels, badges |
| `poetry` | 1.125rem | 400 | Poem body text, with slight positive tracking |

## Layout

### Spacing Scale

The spacing scale uses a 4px base unit:

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |

### Container Widths

- Small: 640px
- Medium: 768px
- Large: 1024px
- Extra Large: 1280px
- App root max-width: 1400px

### Responsive

- Mobile-first with Tailwind breakpoints.
- Container padding reduces to 1rem on screens below 768px.
- Cards stack vertically on small screens.

## Elevation & Depth

Shadows are subtle and modern — never heavy or dramatic:

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle dividers |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Default cards |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` | Elevated cards |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` | Hover lift, modals |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` | Toasts, dropdowns |
| `shadow-2xl` | `0 25px 50px -12px rgba(0,0,0,0.25)` | Dramatic elevation, featured modals |

Colored shadows for interactive elements:

- **Primary shadow:** `0 4px 14px rgba(168, 85, 247, 0.2)` — Primary button hover glow.
- **Accent shadow:** `0 4px 14px rgba(244, 63, 94, 0.2)` — Accent button hover glow.

## Shapes

Border radius is consistently rounded and friendly:

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 6px | Small elements, inline badges |
| `md` | 8px | Buttons, inputs, small cards |
| `lg` | 12px | Medium cards, panels |
| `xl` | 16px | Large cards |
| `2xl` | 24px | Main cards, modals, stat cards |
| `3xl` | 32px | Decorative fun cards, hero containers |
| `full` | 9999px | Pills, avatars, badges |

Cards default to `rounded-2xl` (24px) for a soft, inviting feel.

## Components

### Buttons

Buttons use the `label` typography (Inter, 0.875rem, medium weight) with `rounded-md` (8px).

- **Primary:** Berry background, white text, primary shadow on hover. `y: -1, scale: 1.01` micro-interaction via Framer Motion.
- **Secondary:** White background, berry text, berry-200 border. Fills to berry-50 on hover.
- **Ghost:** Transparent background, berry text. Fills to berry-50 on hover.
- **Accent:** Teal background, white text. For secondary CTAs and genre tags.
- **Danger:** Dark red background (`#b91c1c`), white text. For destructive actions.
- **Success:** Green background, white text. For positive confirmations and achievement actions.

All buttons have `disabled:opacity-50` and `disabled:cursor-not-allowed`.

### Cards

Cards use `rounded-2xl` (24px) with white backgrounds:

- **Default:** Soft shadow, white background.
- **Elevated:** Medium shadow for emphasis.
- **Interactive:** Soft shadow that grows to large on hover with `y: -4, scale: 1.01` lift.
- **Outlined:** White with stone-200 border, no shadow.
- **Gradient:** Subtle berry-to-teal gradient background for featured content.

Card anatomy includes `CardHeader`, `CardTitle` (Nunito bold), `CardDescription` (Inter, stone-500), `CardContent`, and `CardFooter` (border-t, stone-100, mt-4, pt-4).

### Inputs

Inputs are `rounded-lg` (12px) with a 1px `stone-200` border. Focus state:

- Border color shifts to `primary-400`.
- Box shadow: `0 0 0 3px rgba(168, 85, 247, 0.1)` (subtle primary ring).
- `outline: none` on focus-visible.

### Badges

Badges are pill-shaped (`rounded-full`) with small padding and `body-sm` typography:

- **Primary:** Berry-100 background, berry-700 text.
- **Accent:** Teal-100 background, teal-700 text.
- **Stone:** Stone-100 background, stone-700 text.

### Modals

Modals appear centered with a dark overlay (`bg-black/40 backdrop-blur-sm`). The modal panel is white, `rounded-2xl`, with a spring animation (`stiffness: 300, damping: 30`). Includes close button (top-right, stone-400 → stone-600 on hover) and optional title/description header.

### Stat Cards

Specialized cards for dashboard statistics. Layout: label (Inter, stone-500), value (Nunito, 3xl, colored), optional trend indicator, and icon in a rounded icon container. Colors map to primary, accent, success, stone, or sage backgrounds.

## Do's and Don'ts

### Do

- Use **cream (`#fbf8f3`) as the page background** and white for cards on top of it.
- Reserve **gold (`#f59e0b`) exclusively for star ratings and favorites** — it keeps the color meaningful.
- Use **Nunito for all headings and button text** to maintain the friendly personality.
- Use **Inter for body text, descriptions, and form inputs** for maximum readability.
- Apply `rounded-2xl` to cards and `rounded-md` to buttons for consistency.
- Use `prefers-reduced-motion` to disable animations for users who need it.
- Ensure all text meets WCAG AA contrast against its background.
- Use the primary berry for main CTAs and teal for secondary actions.
- Apply subtle shadows (`shadow-soft`) to cards — avoid heavy, dark shadows.

### Don't

- Don't use gold for anything other than ratings/favorites.
- Don't use pure black (`#000000`) — the warm stone (`#1a1614`) is the darkest text color.
- Don't use sharp corners (below 6px radius) for primary UI elements.
- Don't place berry text on cream without checking contrast — berry-600+ is required.
- Don't animate elements without respecting `prefers-reduced-motion`.
- Don't use heavy drop shadows or dark overlays that break the cozy mood.
- Don't mix more than three font families in a single view.
- Don't use gradient backgrounds for primary content cards — reserve them for special featured sections.

## Implementation Status

### Shared UI Primitives

The following shared components are available in `src/components/ui/`:

| Component | File | Exports |
|-----------|------|---------|
| Button | `Button.tsx` | `Button`, `IconButton` — variants: primary, secondary, ghost, accent, success, danger. Sizes: sm, md, lg. Framer Motion hover/tap interactions. |
| Card | `Card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `StatCard` — variants: default, elevated, interactive, outlined, gradient. Padding: none, sm, md, lg. |
| Input | `Input.tsx` | `Input`, `Textarea`, `Select`, `SearchInput`, `PasswordInput` — variants: default, outlined, ghost. Sizes: sm, md, lg. Icon support, clearable search. |
| Modal | `Modal.tsx` | `Modal`, `ModalFooter`, `ConfirmModal` — sizes: sm, md, lg, xl, full. Spring animation, overlay click to close. |
| Badge | `Badge.tsx` | `Badge` — variants: primary, accent, stone, success, danger. |
| Progress | `Progress.tsx` | `Progress`, `ProgressBar` — linear and circular. |
| Tabs | `Tabs.tsx` | `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel` — underline and pill styles. |
| Toast | `Toast.tsx` | `Toast`, `ToastProvider` — auto-dismiss, positioning. |
| EmptyState | `EmptyState.tsx` | `EmptyState` — icon, title, description, action. |
| Skeleton | `Skeleton.tsx` | `Skeleton`, `BookCardSkeleton`, `DashboardStatsSkeleton`, `ChartSkeleton`, `BlogPostSkeleton`, `TableSkeleton` |

### Migration Coverage (Completed)

**73 files migrated** across 8 rounds. Key areas:

- **All form inputs** — Login, Signup, Onboarding, SeriesTracker, ReadingGoals, GifPicker, BookshelfFilters, PublicWishlist, FunBookshelfPublic, PublicPoetry, BookSearchModal
- **All modals** — SeriesTracker, ReadingGoals, Progress, Blog, Bookshelf, LevelModal, SuggestionFormModal, etc.
- **High-traffic page buttons** — PublicPortfolio, Blog, Bookshelf, MyBooks, Discover, Dashboard, BookSuggestionsList, EnhancedBookshelf, Wishlist, AvatarCreator
- **Card containers** — BookGrid, Create, ReviewCard, PublicPortfolio, Dashboard, ReadingHeatmap, Progress, PublicBookClub, AboutMe, Login, Signup, Skeleton, BlogPostEditor, BookshelfFilters, CoverMigrationPanel
- **Typography system** — Nunito (display/headings), Inter (body), Fredoka (accent). `font-fun` → `font-display`, `font-sans` → `font-body`, headings use `font-bold`
- **Spacing/shape** — `rounded-[2rem]` → `rounded-4xl`, `shadow-2xl` → `shadow-xl`, `rounded-sm` → `rounded-md`

### Intentionally Preserved Patterns

The following patterns remain as inline styles because shared primitives do not map well:

| Pattern | Examples | Reason |
|---------|----------|--------|
| Icon-only buttons | Modal close X, search clear, year nav arrows | Custom sizes/positions; no matching `IconButton` variant |
| Toggle/segmented controls | Dashboard tabs, bookshelf view modes, genre filters | Complex active/inactive gradient styling |
| Color swatches | AvatarCreator skin/hair/outfit colors | Visual selection UI, not semantic action buttons |
| Gradient buttons | Publish, Send Suggestion, Create Goal | No matching gradient variant in shared Button |
| motion.button with physics | 3D book spines, cover migration | Custom hover/tap/scale animations via Framer Motion |
| Translucent containers | `bg-white/50-95` with backdrop blur | Not opaque white; Card assumes solid backgrounds |
| Hidden file inputs | Cover upload, image upload | Programmatically triggered, no visible UI |
| Heavily customized editor | BlogPostEditor title/content | Borderless, resize-none, text-3xl — fighting base styles |
| Range sliders | Progress page rating sliders | Specialized input type with no shared mapping |
| Complex list-item buttons | Search results, series items | Row-level interactive items with custom styling |
| Poetry components | `font-serif` for verse text | Documented as `poetry` typography token |
| Rainbow/magic gradients | Extended Magical Palette | Decorative, not semantic UI |

### Build Verification

- `npx tsc -b --noEmit` — passes with zero errors
- `npx @google/design.md lint DESIGN.md` — passes with zero errors, zero warnings
- `npx vite build` — passes (production bundle)
- Don't use magic palette colors for text or interactive controls — they are decorative-only.
