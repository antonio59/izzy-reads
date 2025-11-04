# 📚 Izzy-Reads

A beautiful reading tracker and public portfolio for young book lovers. Track your reading journey, write poetry, publish blog posts, and share your love of books with the world!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)

---

## ✨ Features

### 📖 Public Portfolio
- **My Books** - Showcase books you've read with ratings and reviews
- **My Poems** - Share creative poetry with like and share features
- **My Blog** - Publish book reviews and reading thoughts
- **Wishlist** - Share books you want with purchase links to UK retailers
- **About Me** - Personalized profile with favorites, goals, and achievements

### 📊 Reading Stats
Auto-calculated statistics displayed beautifully:
- Total books and pages read
- Books this year and month
- Average rating
- Favorite genre
- Reading streak tracker

### ⭐ Book Recommendations
- "Izzy's Picks" - Automatically showcases your 4+ star books
- Beautiful cover displays
- Quote snippets from reviews
- Helps friends discover great reads

### 🎨 Beautiful Design
- 5 color-coded tabs with unique gradients
- Glass-morphism effects
- Responsive mobile design
- Hover animations throughout
- Professional, modern appearance

### 🔒 Privacy & Safety
- Two-tier system: Public portfolio + Private dashboard
- Admin login hidden from public view
- Control what's published
- No comment spam
- Parent-friendly features

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for auth and database)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/izzy-reads.git
cd izzy-reads
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
izzy-reads/
├── src/
│   ├── components/
│   │   ├── AboutMe.tsx              # About Me profile page
│   │   ├── ReadingStats.tsx         # Statistics dashboard
│   │   ├── BookRecommendations.tsx  # Featured book picks
│   │   ├── PublicPortfolio.tsx      # Main public view
│   │   ├── Dashboard.tsx            # Admin dashboard
│   │   ├── Navigation.tsx           # Header navigation
│   │   └── ...
│   ├── contexts/
│   │   ├── BookContext.tsx          # Book data provider
│   │   └── AuthContext.tsx          # Authentication
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── utils/
│       └── readingQuotes.ts         # Weekly rotating quotes
├── TECHNICAL_DOCUMENTATION.md       # Developer reference
├── USER_GUIDE.md                    # User instructions
└── README.md                        # This file
```

---

## 🎯 Usage

### Public Portfolio
Visit the root URL to see the public portfolio with 5 tabs:
- **Books** - View reading list with stats and recommendations
- **Poems** - Browse published poetry
- **Blog** - Read book reviews and posts
- **Wishlist** - See wishlist with retailer purchase links
- **About Me** - Learn about the reader

### Admin Dashboard
Access via `/login` (bookmark this - no public link):
1. Log in with credentials
2. Add books, write poems, create blog posts
3. Manage wishlist
4. Control what's published

### Managing Content
- **Add Books**: Include ISBN for automatic cover images from Open Library
- **Rate Books**: 4+ star books appear in recommendations
- **Write Reviews**: Quote snippets show in recommendations
- **Publish Control**: Toggle About Me visibility

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

### Backend
- **Supabase** - Authentication and database
- **Open Library API** - Book cover images

### Design
- Glass-morphism effects
- Gradient themes per section
- Responsive grid layouts
- Mobile-first approach

---

## 📚 Documentation

### For Developers
Read **TECHNICAL_DOCUMENTATION.md** for:
- Complete architecture overview
- Component structure and data flow
- API integration details
- Styling system
- Future feature guides
- Deployment instructions

### For Users
Read **USER_GUIDE.md** for:
- Getting started guide
- Feature explanations
- Tips and tricks
- FAQ
- Privacy and safety

---

## 🎨 Customization

### Colors
Edit gradient themes in component files:
- Books: Blue/Purple
- Poems: Pink/Orange
- Blog: Green/Teal
- Wishlist: Orange/Red
- About Me: Indigo/Purple

### About Me Content
Edit `aboutData` in `PublicPortfolio.tsx`:
```typescript
const aboutData = {
  isPublished: true,
  bio: "Your bio here...",
  favoriteGenres: ['Fantasy', 'Adventure'],
  favoriteAuthors: ['Author 1', 'Author 2'],
  // ... more fields
}
```

### Stats Display
Stats auto-calculate but can be customized in `PublicPortfolio.tsx`

---

## 🚧 Roadmap

### Coming Soon
- [ ] Series Tracker - Track progress through book series
- [ ] Book Tags & Filters - Browse by mood, genre, custom tags
- [ ] Reading Journey Timeline - Visual timeline of milestones
- [ ] Dashboard About Me Editor - Edit profile in admin
- [ ] Export Reading History - Download data as CSV/PDF
- [ ] Reading Challenges - Set and track custom goals

### Future Ideas
- [ ] Friend Recommendations - Suggest books to friends
- [ ] Book Club Features - Organize reading groups
- [ ] Reading Heatmap - Calendar view of reading activity
- [ ] Multiple Users - Family reading accounts
- [ ] Mobile App - Native iOS/Android app

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy Options
- **Vercel** - Automatic deployment from GitHub
- **Netlify** - Continuous deployment
- **GitHub Pages** - Static hosting
- **Supabase Hosting** - Integrated solution

### Environment Variables for Production
Set these in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

### Report Issues
- Check existing issues first
- Provide detailed description
- Include screenshots if applicable

### Suggest Features
- Explain the use case
- Describe expected behavior
- Consider child-safety implications

---

## 📄 License

MIT License - feel free to use this for your own reading tracker!

---

## 🙏 Acknowledgments

### Built With
- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Backend
- [Open Library](https://openlibrary.org/) - Book Data
- [Lucide](https://lucide.dev/) - Icons

### Inspiration
Built for young readers who love books and want to share their reading journey with the world! 📚✨

---

## 📞 Support

### Questions?
- Read `TECHNICAL_DOCUMENTATION.md` for technical details
- Read `USER_GUIDE.md` for usage instructions
- Check commit history for implementation details

### Issues?
- Refresh the page
- Check browser console for errors
- Verify environment variables are set
- Ensure Supabase is configured correctly

---

## 🌟 Show Your Support

If you enjoy this project:
- ⭐ Star this repository
- 📖 Share with other young readers
- 🐛 Report bugs you find
- 💡 Suggest new features

---

**Happy Reading! 📚✨**

*Built with ❤️ for book lovers everywhere*
