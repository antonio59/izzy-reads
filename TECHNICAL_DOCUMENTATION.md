# Izzy-Reads Technical Documentation

## Overview
Izzy-Reads is a reading tracker and public portfolio for a 10-year-old book lover. It combines private reading tracking with a beautiful public showcase.

## Architecture

### Two-Tier Access System
1. **Public Portfolio** (`/`) - Shareable reading journey
2. **Private Dashboard** (`/dashboard`) - Requires authentication

### Key Technologies
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth + Database)
- **Book Data**: Open Library API

---

## Features Implemented

### 1. Navigation System
**Location**: `src/components/PublicPortfolio.tsx`

**Design**:
- Unified header with logo centered
- Navigation buttons with integrated count badges
- 5 tabs: Books, Poems, Blog, Wishlist, About Me
- Admin login removed from public view

**Count Badges**:
- Active tab: `bg-white/30` (semi-transparent white)
- Inactive tabs: Colored by theme (blue/purple/green/orange/indigo)

### 2. About Me Section
**Location**: `src/components/AboutMe.tsx`

**Sections**:
1. Profile Header - Gradient banner with photo/bio
2. Currently Reading - Blue card
3. Why I Love Reading - Pink card
4. Favorite Genres - Purple tags
5. Favorite Authors - Orange list
6. Fun Facts - Yellow/orange gradient grid
7. Reading Goals - Green checklist
8. Achievements - Blue/purple trophy cards

**Publish Toggle**:
- Only displays if `isPublished: true`
- Shows "Coming Soon" message when unpublished
- Controlled in dashboard (future feature)

**Data Structure**:
```typescript
interface AboutMe {
  isPublished: boolean
  profilePhoto?: string
  bio: string
  favoriteGenres: string[]
  favoriteAuthors: string[]
  whyIRead: string
  funFacts: string[]
  currentlyReading?: string
  readingGoals: string[]
  achievements: string[]
}
```

### 3. Reading Stats Dashboard
**Location**: `src/components/ReadingStats.tsx`

**Stats Displayed**:
1. Total Books - Auto-calculated from read books
2. Total Pages - Sum of all page counts
3. Books This Year - Filtered by date
4. Books This Month - Filtered by date
5. Average Rating - Calculated from ratings
6. Favorite Genre - Most common genre
7. Reading Streak - Days reading consecutively

**Design**:
- Gradient banner: `from-indigo-500 via-purple-500 to-pink-500`
- Glass-morphism cards with `backdrop-blur-md`
- Responsive grid: 2/3/4 columns
- Hover animations

**Auto-Calculation**:
```typescript
{
  totalBooks: readBooks.length,
  totalPages: readBooks.reduce((sum, book) => sum + (book.pageCount || 0), 0),
  averageRating: (() => {
    const ratedBooks = readBooks.filter(b => b.rating)
    if (ratedBooks.length === 0) return 0
    return ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
  })()
}
```

### 4. Book Recommendations
**Location**: `src/components/BookRecommendations.tsx`

**Features**:
- Auto-filters books with 4+ star ratings
- Shows top 6 recommendations
- "Izzy's Picks" branding
- Amber/yellow/orange gradient theme

**Display**:
- Book cover with hover zoom
- Heart badge with rating overlay
- Quote snippets from reviews
- Responsive grid layout

**Filtering Logic**:
```typescript
const recommendedBooks = books
  .filter(book => book.isRead && book.rating && book.rating >= 4)
  .slice(0, 6)
```

### 5. Social Features
**Locations**: Like/Share buttons in `PublicPortfolio.tsx`

**Poem Likes**:
- Heart icon that fills on hover
- Updates count in real-time
- Saves to Supabase

**Share Functionality**:
- Uses native Web Share API when available
- Clipboard fallback for unsupported browsers
- Generates shareable URLs with anchors
- Works for poems and blog posts

### 6. Wishlist with Purchase Links
**Location**: `PublicPortfolio.tsx` - Wishlist tab

**UK Retailers** (3):
1. Bookshop.org - Independent bookstore support
2. Amazon.co.uk - Wide availability
3. World of Books (UK) - Used books

**Link Generation**:
```typescript
const getPurchaseLinks = (book: Book) => {
  const searchQuery = encodeURIComponent(`${book.title} ${book.author}`)
  return {
    bookshop: `https://uk.bookshop.org/search?keywords=${searchQuery}`,
    amazon: book.isbn 
      ? `https://www.amazon.co.uk/dp/${book.isbn}`
      : `https://www.amazon.co.uk/s?k=${searchQuery}`,
    worldOfBooks: `https://www.worldofbooks.com/en-gb/search?q=${searchQuery}`
  }
}
```

---

## Open Library API Integration

### How It Works
Book covers are loaded dynamically using Open Library's Cover API:

**Cover URL Pattern**:
```
https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
```

**Sizes**:
- `-S.jpg` - Small (default)
- `-M.jpg` - Medium
- `-L.jpg` - Large

### Zero Maintenance Design
- No API key required
- No rate limits for cover images
- Cached by Open Library CDN
- Automatic fallbacks to gradient placeholders

### Sample Implementation
```typescript
const book = {
  isbn: '9780439708180',
  coverUrl: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg'
}
```

### Error Handling
```typescript
<img
  src={book.coverUrl}
  onError={(e) => {
    // Show fallback gradient on error
    e.currentTarget.style.display = 'none'
    // Show placeholder div
  }}
/>
```

---

## Component Structure

### Public Portfolio Layout
```
PublicPortfolio
├── Header
│   ├── Logo (centered)
│   └── Navigation (5 tabs with counts)
├── Main Content
│   ├── ReadingStats (shows on all tabs)
│   ├── BookRecommendations (shows on all tabs)
│   └── Tab Content
│       ├── Books Section
│       ├── Poems Section
│       ├── Blog Section
│       ├── Wishlist Section
│       └── About Me Section
└── Footer
```

### Component Dependencies
```
PublicPortfolio.tsx
├── AboutMe.tsx
├── ReadingStats.tsx
├── BookRecommendations.tsx
└── BookContext (data provider)
```

---

## Data Flow

### Book Context
**Location**: `src/contexts/BookContext.tsx`

**Provides**:
- `books` - All books (read + wishlist)
- `poems` - Published poems
- `blogPosts` - Blog posts (filtered by status)
- `wishlist` - Books on wishlist
- `updatePoem` - Like poem function

### Sample Book Data
```typescript
{
  id: '1',
  title: 'Harry Potter and the Philosopher\'s Stone',
  author: 'J.K. Rowling',
  coverUrl: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
  isbn: '9780439708180',
  genre: 'Fantasy',
  pageCount: 309,
  rating: 5,
  isRead: true,
  notes: 'Amazing magical adventure! Loved Hogwarts and all the characters.'
}
```

---

## Styling System

### Color Themes by Section
- **Books**: Blue (`blue-500` to `purple-500`)
- **Poems**: Pink/Orange (`pink-500` to `orange-500`)
- **Blog**: Green/Teal (`green-500` to `teal-500`)
- **Wishlist**: Orange/Red (`orange-500` to `red-500`)
- **About Me**: Indigo/Purple (`indigo-500` to `purple-500`)
- **Stats**: Indigo/Purple/Pink gradient
- **Recommendations**: Amber/Yellow/Orange

### Gradient Patterns
```css
/* Primary gradients */
from-purple-50 via-pink-50 to-blue-50  /* Background */
from-indigo-500 via-purple-500 to-pink-500  /* Stats */
from-amber-100 via-yellow-100 to-orange-100  /* Recommendations */
```

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## State Management

### Active Tab State
```typescript
const [activeTab, setActiveTab] = useState<
  'books' | 'poems' | 'blog' | 'wishlist' | 'about'
>('books')
```

### Like System
```typescript
const handleLikePoem = (poemId: string) => {
  const poem = poems.find(p => p.id === poemId)
  if (poem) {
    updatePoem({ ...poem, likes: poem.likes + 1 })
  }
}
```

### Share System
```typescript
const handleShare = async (type: 'poem' | 'post', item: any) => {
  const shareData = {
    title: item.title,
    text: type === 'poem' 
      ? item.content.substring(0, 100) 
      : item.content.substring(0, 200),
    url: `${window.location.origin}#${type}-${item.id}`
  }
  
  if (navigator.share) {
    await navigator.share(shareData)
  } else {
    // Clipboard fallback
    await navigator.clipboard.writeText(shareData.url)
  }
}
```

---

## Future Features Ready to Implement

### 1. Series Tracker
**Interface**: `BookSeries` (already created)

**Implementation**:
- Add series field to Book interface
- Group books by series
- Show progress bars
- "Next in series" suggestions

### 2. Book Tags & Filters
**Implementation**:
- Add tags field to Book interface
- Create filter component
- Custom tags: funny, scary, adventure, etc.
- Filter by mood/genre/age

### 3. Reading Journey Timeline
**Implementation**:
- Create Timeline component
- Track milestones (first book, 100th book, etc.)
- Visual timeline with dates
- Achievement celebrations

---

## Deployment Notes

### Environment Variables
Required for Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Build Command
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Admin Access
- Login route: `/login`
- No public link (bookmarked by Izzy)
- Protected routes via AuthContext

---

## Maintenance

### Adding New Books
1. Add to `BookContext` sample data
2. Include `coverUrl` from Open Library
3. Set `isRead: true` for completed books
4. Add rating (1-5) and notes

### Updating About Me
1. Edit `aboutData` in `PublicPortfolio.tsx`
2. Toggle `isPublished` to control visibility
3. Add/remove sections as needed

### Changing Stats
Stats auto-calculate but can be overridden:
- `booksThisYear` - Currently hardcoded
- `booksThisMonth` - Currently hardcoded
- `favoriteGenre` - Currently hardcoded
- `readingStreak` - Currently hardcoded

Replace with real calculations when date tracking is added.

---

## Performance Optimizations

### Image Loading
- Lazy loading via browser native
- Error fallbacks prevent broken images
- CDN-cached covers from Open Library

### Component Rendering
- Conditional rendering by tab
- Filtered arrays computed once
- Memoization opportunities for future

### Bundle Size
- Tree-shaking via Vite
- Code splitting by route (future)
- Optimized icon imports from Lucide

---

## Browser Compatibility

### Supported Features
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Web Share API with fallback
- CSS Grid and Flexbox
- Backdrop filters (with graceful degradation)

### Progressive Enhancement
- Share button: Native API → Clipboard → Manual copy
- Images: Cover URL → Fallback gradient
- Stats: Real data → Placeholder values

---

## Testing Checklist

### Navigation
- [ ] All 5 tabs load correctly
- [ ] Count badges update with data
- [ ] Active state highlights correctly
- [ ] Mobile responsive layout

### About Me
- [ ] Shows when published
- [ ] Hides when unpublished
- [ ] All sections display
- [ ] Responsive grid layouts

### Stats
- [ ] Calculations correct
- [ ] Numbers formatted properly
- [ ] Shows on all tabs
- [ ] Responsive design works

### Recommendations
- [ ] Only shows 4+ star books
- [ ] Covers load correctly
- [ ] Fallbacks work
- [ ] Grid responsive

### Wishlist
- [ ] All 3 retailer links work
- [ ] ISBN links preferred
- [ ] Search fallback works
- [ ] Opens in new tabs

---

## Contact & Support

For questions about this implementation:
- Check this documentation first
- Review component comments
- Check git commit messages for context

Built with ❤️ for Izzy's reading journey!
