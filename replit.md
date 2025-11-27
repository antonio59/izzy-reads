# Izzy-Reads - Reading Tracker & Portfolio

## Overview
A beautiful reading tracker and public portfolio for young book lovers. Built with React, TypeScript, Vite, and Supabase.

**Purpose**: Track reading journey, write poetry, publish blog posts, and share love of books with the world.

**Current State**: Successfully imported to Replit and configured for deployment.

## Recent Changes
- **2025-11-27**: Complete magical design overhaul for young readers
  - Added playful Fredoka font (Google Fonts) for a fun, kid-friendly aesthetic
  - Created custom CSS animations: floating, bouncing, wiggle, sparkle, twinkle effects
  - Rainbow gradient title "Izzy's Magical Reading Corner" with star decorations
  - Redesigned navigation tabs with colorful gradients and emoji icons
  - Enhanced ReadingStats with colorful icon backgrounds and bouncy hover effects
  - Added FloatingDecorations component with animated stars, hearts, and books
  - Implemented prefers-reduced-motion accessibility support for all animations
  - Updated all components with playful emojis and magical color schemes
- **2025-11-27**: Imported from GitHub and configured for Replit environment
  - Updated Vite config to run on port 5000 with host 0.0.0.0
  - Configured workflow for automatic server startup
  - Ready for Supabase integration setup

## Project Architecture

### Frontend Stack
- **React 19.1** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.3** - Build tool and dev server (runs on port 5000)
- **Tailwind CSS 3.4** - Styling with glass-morphism effects
- **React Router 7.6** - Client-side routing
- **Lucide React** - Icon library

### Backend & Services
- **Supabase** - Authentication and PostgreSQL database
- **Open Library API** - Book cover images via ISBN lookup

### Key Features
1. **Public Portfolio** - 5 themed tabs (Books, Poems, Blog, Wishlist, About Me)
2. **Reading Stats** - Auto-calculated statistics with fun emoji icons and bouncy animations
3. **Book Recommendations** - Showcases 4+ star books with sparkle effects
4. **Privacy Controls** - Two-tier system with admin dashboard
5. **Magical Design** - Rainbow gradients, floating decorations, playful fonts, accessibility support

### Design Theme
- **Font**: Fredoka (playful, rounded, kid-friendly)
- **Colors**: Pink, purple, cyan gradients with rainbow accents
- **Animations**: Float, bounce, wiggle, sparkle, twinkle (with reduced-motion fallback)
- **Decorations**: Floating stars, hearts, butterflies, and book emojis
- **Accessibility**: Full prefers-reduced-motion support for all animations

## Project Structure
```
src/
├── components/          # React components
│   ├── PublicPortfolio.tsx    # Main public view
│   ├── Dashboard.tsx          # Admin dashboard
│   ├── Login.tsx/Signup.tsx   # Auth components
│   ├── EnhancedBookshelf.tsx  # Book management
│   └── ...
├── contexts/           # React context providers
│   ├── AuthContext.tsx       # Authentication state
│   ├── BookContext.tsx       # Book data provider
│   └── UserContext.tsx       # User data
├── lib/
│   └── supabase.ts           # Supabase client config
├── services/
│   └── openLibraryApi.ts     # External API integration
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/                    # Utility functions
```

## Environment Variables Required
To enable full functionality, set these environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

The app runs with mock data if Supabase is not configured, but authentication and data persistence require valid credentials.

## Database Schema
Database schema files are included:
- `supabase-schema.sql` - Full schema
- `quick-start-schema.sql` - Quick start version

Tables include: books, poems, blog_posts, wishlist_items, user profiles, etc.

## Development
- Dev server runs on port 5000 (configured for Replit)
- Hot module replacement enabled
- TypeScript strict mode
- ESLint configured

## Routes
**Public:**
- `/` - Public portfolio
- `/login` - Admin login (bookmarked, not publicly linked)
- `/signup` - User registration

**Protected (Admin):**
- `/dashboard` - Main admin dashboard
- `/bookshelf` - Book management
- `/wishlist` - Wishlist management
- `/poems` - Poetry management
- `/blog` - Blog post management
- `/parent` - Parent controls dashboard

## Deployment Notes
- Configured for Netlify (netlify.toml included)
- Can also deploy to Vercel, GitHub Pages, or Supabase Hosting
- Build command: `npm run build`
- Output directory: `dist`

## User Preferences
*To be updated as preferences are expressed*

## Documentation
- `README.md` - Project overview and quick start
- `TECHNICAL_DOCUMENTATION.md` - Detailed architecture
- `USER_GUIDE.md` - End-user instructions
- `SETUP_GUIDE.md` - Setup instructions
