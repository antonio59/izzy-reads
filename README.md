# 📚 Izzy Reads

A beautiful, magical reading tracker and public portfolio for young book lovers. Track your reading journey, write poetry, publish blog posts, and share your love of books with the world!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)
![Convex](https://img.shields.io/badge/Convex-1.30-ff6b6b.svg)

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
- Node.js 18+ or Bun
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/izzy-reads.git
cd izzy-reads

# Install dependencies
bun install

# Set up Convex (creates .env.local automatically)
bunx convex dev

# Run development server (in a new terminal)
bun run dev
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
└── public/                   # Static assets
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript 5.8, Vite 6 |
| **Styling** | Tailwind CSS 3.4, Custom animations |
| **Backend** | Convex (real-time database & functions) |
| **Book Data** | Open Library API (free cover images) |
| **Icons** | Lucide React |
| **Routing** | React Router 7 |

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

Create a `.env.local` file (auto-created by `bunx convex dev`):

```env
VITE_CONVEX_URL=your-convex-deployment-url
```

### Customization

**Color Themes** (in component files):
- Books: Blue/Purple gradient
- Poems: Pink/Orange gradient
- Blog: Green/Teal gradient
- Wishlist: Orange/Red gradient
- About Me: Indigo/Purple gradient

**About Me Content** - Edit `aboutData` in `PublicPortfolio.tsx`

---

## 📦 Build & Deploy

### Production Build
```bash
bun run build
```

### Preview Build
```bash
bun run preview
```

### Deploy to Convex
```bash
bunx convex deploy
```

### Deployment with Coolify

This project is configured for deployment with Coolify using Docker.

**Prerequisites:**
- Coolify instance running (e.g., https://coolify.antoniosmith.xyz)
- GitHub repository connected to Coolify

**Setup Steps:**
1. Create a new project in Coolify
2. Select "Public Repository" and enter: `https://github.com/antonio59/izzy-reads`
3. Choose "Dockerfile" as the build pack
4. Set environment variable:
   - `VITE_CONVEX_URL` = `https://impressive-elk-411.convex.cloud`
5. Configure domain (optional) or use Coolify's generated domain
6. Enable automatic deployments on push to `main` branch
7. Click "Deploy"

**Manual Docker Build:**
```bash
# Build the Docker image
docker build --build-arg VITE_CONVEX_URL=https://impressive-elk-411.convex.cloud -t izzy-reads .

# Run locally
docker run -p 8080:80 izzy-reads
```

**Alternative Hosting Options:**
- **Vercel** - Automatic deployment from GitHub
- **Netlify** - Configuration available in git history
- **GitHub Pages** - Static hosting

---

## 🔒 Security

### Automated Security Features
- **Dependabot** - Automated dependency updates
- **Security Scanning** - npm audit on CI
- **GitHub Actions** - Build verification on every push

### Security Best Practices
- ✅ Environment variables for all secrets
- ✅ No hardcoded API keys or passwords
- ✅ Input validation on all forms
- ✅ Protected routes with authentication
- ✅ Regular dependency updates

### Run Security Audit
```bash
bun run security-audit
```

---

## 🧪 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server + Convex |
| `bun run dev:frontend` | Frontend only |
| `bun run dev:backend` | Convex only |
| `bun run build` | Production build |
| `bun run lint` | Run ESLint |
| `bun run security-audit` | Check vulnerabilities |

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
- [ ] Export Reading History - Download data as CSV/PDF

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

---

## 📞 Support

### Troubleshooting

**App won't start?**
1. Ensure Convex is running: `bunx convex dev`
2. Check `.env.local` has correct `VITE_CONVEX_URL`
3. Clear browser cache and refresh

**Book covers not loading?**
- Verify the ISBN is correct
- Open Library may not have all covers
- Fallback gradient placeholders will display

**Build errors?**
```bash
# Clear and reinstall dependencies
rm -rf node_modules bun.lock
bun install
```

---

**Happy Reading! 📚✨**

*Built with ❤️ for young book lovers everywhere*
