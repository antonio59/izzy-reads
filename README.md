# 📚 Izzy's Bookshelf

A beautiful, magical reading tracker and public portfolio for young book lovers. Track your reading journey, write poetry, publish blog posts, and share your love of books with the world!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.3-38bdf8.svg)
![Convex](https://img.shields.io/badge/Convex-1.45-ff6b6b.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-deployed-F38020.svg)

---

## 🌐 Deployment

This is a private application deployed via Cloudflare Workers.

| Environment    | Branch |
| -------------- | ------ |
| **Production** | `main` |

---

## ✨ Features

### 📖 Public Portfolio (5 Themed Tabs)

- **My Books** - Showcase books with ratings, reviews, and beautiful covers
- **My Poems** - Share creative poetry with like and share features
- **My Blog** - Publish book reviews and reading thoughts
- **Wishlist** - Share books you want with purchase links to UK retailers
- **About Me** - Personalized profile with favorites, goals, and achievements

### 📊 Auto-Calculated Reading Stats

- Total books and pages read
- Books this year/month
- Average rating & favorite genre
- Reading streak tracker 🔥

### ⭐ Smart Recommendations

- "Izzy's Picks" - Automatically showcases 4+ star books
- Beautiful cover displays with quote snippets

### 📥 Goodreads Import

- Import an existing library from a Goodreads CSV export (My Bookshelf → Import)
- Shelves map to Finished / Reading / Wishlist; ratings, reviews, and ISBNs come along
- "View on Goodreads" links on every book

### 🎨 Magical Design

- Playful Fredoka font for a kid-friendly aesthetic
- Rainbow gradients and floating decorations
- Glass-morphism effects with smooth animations
- Fully responsive mobile design
- Accessibility support (prefers-reduced-motion)

### 🔒 Privacy & Security

- **Convex Auth** - Secure password-based authentication
- Two-tier system: Public portfolio + Private dashboard
- Admin login hidden from public view
- No comment spam or unwanted interactions
- Parent-friendly controls

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ and pnpm
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

```bash
# Clone the repository
git clone https://github.com/antonio59/izzy-reads.git
cd izzy-reads

# Install dependencies
pnpm install

# Set up Convex (creates .env.local automatically)
npx convex dev

# Run development server (in a new terminal)
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
izzy-reads/
├── src/
│   ├── components/           # React components
│   │   ├── PublicPortfolio.tsx    # Main public view (5 tabs)
│   │   ├── Dashboard.tsx          # Admin dashboard
│   │   ├── AboutMe.tsx            # Profile page
│   │   ├── ReadingStats.tsx       # Statistics display
│   │   ├── BookRecommendations.tsx # Featured books
│   │   ├── FloatingDecorations.tsx # Magical animations
│   │   └── ...
│   ├── contexts/             # React context providers
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── BookContext.tsx        # Book data provider
│   │   └── UserContext.tsx        # User preferences
│   ├── services/
│   │   └── openLibraryApi.ts      # Book cover API
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   └── utils/                # Helper functions
├── convex/                   # Convex backend functions
│   ├── schema.ts                  # Database schema
│   ├── books.ts                   # Book queries/mutations
│   ├── poems.ts                   # Poem operations
│   ├── blogPosts.ts               # Blog operations
│   └── ...
├── .github/
│   ├── workflows/            # CI/CD automation
│   └── SECURITY.md           # Security policy
├── wrangler.jsonc            # Cloudflare config (Pages + Workers static assets)
├── functions/_middleware.ts  # Pages Function: social-crawler OG/Twitter meta
├── workers/index.ts          # Workers entrypoint: crawler meta + static assets
├── pages/_redirects          # Pages-only SPA fallback (copied to dist by Pages build)
└── public/                   # Static assets (incl. _headers)
```

---

## 🛠️ Technology Stack

| Category       | Technology                              |
| -------------- | --------------------------------------- |
| **Frontend**   | React 19, TypeScript 6.0, Vite 8        |
| **Styling**    | Tailwind CSS 4.3, Custom animations     |
| **Backend**    | Convex (real-time database & functions) |
| **Book Data**  | Open Library API (free cover images)    |
| **Icons**      | Lucide React                            |
| **Routing**    | React Router 7                          |
| **Deployment** | Cloudflare Workers (static assets)      |

---

## 🎯 Usage

### Public Portfolio

Visit the root URL to see the public portfolio with 5 colorful tabs:

- 📚 **Books** - Reading list with stats and recommendations
- ✍️ **Poems** - Poetry with like/share buttons
- 📝 **Blog** - Book reviews and posts
- 🎁 **Wishlist** - Books to buy (with UK retailer links)
- 👤 **About Me** - Reader profile

### Admin Dashboard

Access via `/login` (bookmark this - no public link):

1. Log in with credentials
2. Add books, write poems, create blog posts
3. Manage wishlist and control published content

### Adding Books

- Include ISBN for automatic cover images from Open Library
- Rate books 1-5 stars (4+ stars appear in recommendations)
- Write reviews - quotes show in "Izzy's Picks"

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file (auto-created by `npx convex dev`):

```env
VITE_CONVEX_URL=your-convex-deployment-url
```

### Convex Deployments

| Environment | Convex URL                              |
| ----------- | --------------------------------------- |
| Production  | `https://loyal-vulture-39.convex.cloud` |
| Development | set automatically by `npx convex dev`   |

### Customization

**Color Themes** (in component files):

- Books: Blue/Purple gradient
- Poems: Pink/Orange gradient
- Blog: Green/Teal gradient
- Wishlist: Orange/Red gradient
- About Me: Indigo/Purple gradient

---

## 📦 Build & Deploy

### Local Development

```bash
pnpm run dev          # Start dev server + Convex
pnpm run dev:frontend # Frontend only
pnpm run dev:backend  # Convex only
```

### Production Build

```bash
pnpm run build
```

### Deployment with Cloudflare

The repo supports **both** Cloudflare hosting modes — pick whichever you connected in the dashboard:

- **Workers static assets** (recommended / new default): `workers/index.ts` runs before asset serving — it returns OG/Twitter meta HTML to social crawlers and passes everything else through to `dist/` with SPA fallback. Configured via `main` + `assets` in `wrangler.jsonc`.
- **Pages**: `functions/_middleware.ts` does the same job as a Pages Function; `pages/_redirects` provides the SPA fallback (copied into `dist` by the Pages build — see build command below).

Both share the crawler-meta logic in `src/edge/socialMeta.ts` and the security headers in `public/_headers`.

**Project settings:**

- Build command (Workers Builds): `pnpm install --frozen-lockfile && pnpm run build`
- Build command (Pages): `pnpm install --frozen-lockfile && pnpm run build && cp pages/_redirects dist/`
- Build output directory: `dist`
- Env vars: `PNPM_VERSION=11.1.1`, `NODE_VERSION=22`. `VITE_CONVEX_URL` is committed in `.env.production` — only override it in the dashboard if you intentionally want a different Convex deployment.

| Branch      | Environment | Auto-deploy |
| ----------- | ----------- | ----------- |
| `main`      | Production  | ✅          |
| PR branches | Preview     | ✅          |

**Convex deploys:** CI runs `convex deploy --yes` on every push to `main` (`.github/workflows/ci.yml` → `deploy-convex` job). Requires a `CONVEX_DEPLOY_KEY` repo secret — generate one in the Convex dashboard → Team Settings → Deploy Keys, then add it in GitHub → Settings → Secrets → Actions.

**To deploy manually:**

- Frontend (Workers): `pnpm run deploy:workers` (`wrangler deploy`)
- Backend (Convex): `pnpm run deploy:convex`
- Pages: `pnpm run deploy:cf` (`wrangler pages deploy dist`)
- Local previews: `pnpm run preview:workers` / `pnpm run preview:cf`

---

## 🔒 Security

### Automated Security Features

- **Dependabot** - Automated dependency updates
- **Security Scanning** - pnpm audit on CI
- **GitHub Actions** - Build verification on every push
- **Secure Randomness** - Uses `crypto.randomUUID()` for ID generation

### Security Best Practices

- ✅ Environment variables for all secrets
- ✅ No hardcoded API keys or passwords
- ✅ Input validation on all forms
- ✅ Protected routes with authentication
- ✅ Regular dependency updates
- ✅ Security headers via `public/_headers` (served by Cloudflare)

### Run Security Audit

```bash
pnpm run security-audit
```

---

## 🧪 Development

### Available Scripts

| Command                  | Description               |
| ------------------------ | ------------------------- |
| `pnpm run dev`            | Start dev server + Convex |
| `pnpm run dev:frontend`   | Frontend only             |
| `pnpm run dev:backend`    | Convex only               |
| `pnpm run build`          | Production build          |
| `pnpm run deploy:convex`  | Deploy Convex to prod     |
| `pnpm run lint`           | Run ESLint                |
| `pnpm run test`           | Run tests                 |
| `pnpm run security-audit` | Check vulnerabilities     |

### Code Quality

- TypeScript strict mode enabled
- ESLint configured with React rules
- Consistent code formatting

---

## 🚧 Roadmap

### Coming Soon

- [x] Series Tracker - Track progress through book series
- [x] Book Tags & Filters - Browse by mood, genre, custom tags
- [x] Reading Heatmap Calendar

### Future Ideas

- [ ] Friend Recommendations
- [ ] Book Club Features
- [ ] Reading Journey Timeline - Visual timeline of milestones
- [ ] Mobile App (PWA)

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

### Report Issues

- Check existing issues first
- Provide detailed description with screenshots

### Suggest Features

- Explain the use case
- Consider child-safety implications

---

## 📄 License

MIT License - feel free to use this for your own reading tracker!

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Convex](https://convex.dev/) - Backend
- [Open Library](https://openlibrary.org/) - Book Data
- [Lucide](https://lucide.dev/) - Icons
- [Cloudflare Workers](https://workers.cloudflare.com/) - Hosting

---

## 📞 Support

### Troubleshooting

**App won't start?**

1. Ensure Convex is running: `npx convex dev`
2. Check `.env.local` has correct `VITE_CONVEX_URL`
3. Clear browser cache and refresh

**Book covers not loading?**

- Verify the ISBN is correct
- Open Library may not have all covers
- Fallback gradient placeholders will display

**Build errors?**

```bash
# Clear and reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

**Happy Reading! 📚✨**

_Built with ❤️ for young book lovers everywhere_
