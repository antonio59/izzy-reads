# 📚 Izzy's Bookshelf

A beautiful, magical reading tracker and public portfolio for young book lovers. Track your reading journey, write poetry, publish blog posts, and share your love of books with the world!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)
![Convex](https://img.shields.io/badge/Convex-1.31-ff6b6b.svg)
![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7.svg)

---

## 🌐 Live Sites

| Environment    | URL                                                                        | Branch       |
| -------------- | -------------------------------------------------------------------------- | ------------ |
| **Production** | [izzysbookshelf.com](https://izzysbookshelf.com)                           | `production` |
| **Staging**    | [izzysbookshelf.antoniosmith.xyz](https://izzysbookshelf.antoniosmith.xyz) | `main`       |

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

- Node.js 18+ or pnpm
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
├── netlify.toml              # Netlify deployment config
└── public/                   # Static assets
```

---

## 🛠️ Technology Stack

| Category       | Technology                              |
| -------------- | --------------------------------------- |
| **Frontend**   | React 19, TypeScript 5.9, Vite 6        |
| **Styling**    | Tailwind CSS 3.4, Custom animations     |
| **Backend**    | Convex (real-time database & functions) |
| **Book Data**  | Open Library API (free cover images)    |
| **Icons**      | Lucide React                            |
| **Routing**    | React Router 7                          |
| **Deployment** | Netlify                                 |

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
| Staging     | `https://aware-gecko-889.convex.cloud`  |

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

### Staging Build

```bash
pnpm run build:staging
```

### Deployment with Netlify

This project uses Netlify with automatic branch deploys:

| Branch       | Environment | Convex           | Auto-deploy |
| ------------ | ----------- | ---------------- | ----------- |
| `production` | Production  | loyal-vulture-39 | ✅          |
| `main`       | Staging     | aware-gecko-889  | ✅          |
| PR branches  | Preview     | aware-gecko-889  | ✅          |

**Configuration is in `netlify.toml`** - no manual setup required.

**To deploy:**

1. Push to `main` → Staging deploys automatically
2. Merge to `production` → Production deploys automatically

**Custom Domains:**

- Production: `izzysbookshelf.com`
- Staging: `izzysbookshelf.antoniosmith.xyz` (branch subdomain)

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
- ✅ Security headers via Netlify

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
| `pnpm run build:staging`  | Staging build             |
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

- [ ] Series Tracker - Track progress through book series
- [ ] Book Tags & Filters - Browse by mood, genre, custom tags
- [ ] Reading Journey Timeline - Visual timeline of milestones

### Future Ideas

- [ ] Friend Recommendations
- [ ] Book Club Features
- [ ] Reading Heatmap Calendar
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
- [Netlify](https://netlify.com/) - Hosting

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
