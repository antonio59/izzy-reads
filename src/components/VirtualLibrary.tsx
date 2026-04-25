import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, BookOpen, Trophy, Flame, Plus, Star } from 'lucide-react'
import { CircularLevel } from './LevelProgress'
import { AchievementChip } from './AchievementCard'
import { ACHIEVEMENTS } from '../lib/achievements'
import { Card, IconButton } from './ui'

interface LibraryBook {
  id: string
  title: string
  author: string
  coverUrl?: string
  pageCount?: number
  isRead: boolean
  dateRead?: string
  genre: string
  rating?: number
  notes?: string
}

interface VirtualLibraryProps {
  books: LibraryBook[]
  totalXP: number
  unlockedAchievements: string[]
  readingStreak: number
  onBookClick?: (bookId: string) => void
  onAddBook?: () => void
  className?: string
}

// Generate a pleasant color from book title for books without covers
function getBookColor(title: string): string {
  const colors = [
    'from-primary-400 to-primary-600',
    'from-primary-500 to-primary-700',
    'from-accent-400 to-accent-600',
    'from-accent-500 to-accent-700',
    'from-purple-400 to-purple-600',
    'from-violet-400 to-violet-600',
    'from-fuchsia-400 to-fuchsia-600',
    'from-pink-400 to-pink-600',
    'from-rose-400 to-rose-600',
    'from-indigo-400 to-indigo-600',
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Group books by genre for different shelves
function groupBooksByGenre(books: LibraryBook[]): Map<string, LibraryBook[]> {
  const grouped = new Map<string, LibraryBook[]>()
  books.forEach(book => {
    const genre = book.genre || 'Other'
    if (!grouped.has(genre)) {
      grouped.set(genre, [])
    }
    grouped.get(genre)!.push(book)
  })
  return grouped
}

// Star rating display component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-stone-300'
          }`}
        />
      ))}
    </div>
  )
}

export function VirtualLibrary({
  books,
  totalXP,
  unlockedAchievements,
  readingStreak,
  onBookClick,
  onAddBook,
  className = '',
}: VirtualLibraryProps) {
  const readBooks = books.filter(b => b.isRead)
  const currentlyReading = books.filter(b => !b.isRead).slice(0, 5)
  const booksByGenre = useMemo(() => groupBooksByGenre(readBooks), [readBooks])
  const genres = Array.from(booksByGenre.keys())
  const totalPages = readBooks.reduce((sum, b) => sum + (b.pageCount || 0), 0)

  const recentAchievements = ACHIEVEMENTS
    .filter(a => unlockedAchievements.includes(a.id))
    .slice(0, 3)

  return (
    <div className={`relative ${className}`}>
      {/* Library Container */}
      <Card variant="elevated" padding="none" className="relative shadow-soft-lg border border-stone-200">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-primary-600" />
            <span className="font-medium text-stone-800 text-sm">My Library</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mini stats */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
              <span>{readBooks.length} books</span>
              <span className="text-stone-300">•</span>
              <span>{totalPages.toLocaleString()} pages</span>
            </div>

            {/* Streak */}
            {readingStreak > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                <Flame className="w-3 h-3 text-amber-500" />
                <span className="font-bold text-amber-700 text-xs">{readingStreak}</span>
              </div>
            )}

            {/* Level */}
            <CircularLevel totalXP={totalXP} size="sm" />

            {/* Add Book */}
            <IconButton
              onClick={onAddBook}
              size="sm"
              variant="primary"
              className="bg-primary-600 hover:bg-primary-700"
              aria-label="Add New Book"
              icon={<Plus className="w-3.5 h-3.5" />}
            />
          </div>
        </div>

        {/* Bookshelves */}
        <div className="p-4 space-y-1 bg-gradient-to-b from-stone-50 to-stone-100">
          {/* Currently Reading Shelf */}
          {currentlyReading.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-stone-600 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                Currently Reading
              </p>
              <BookShelf
                books={currentlyReading}
                onBookClick={onBookClick}
              />
            </div>
          )}

          {/* Main Library Shelves - by genre */}
          {genres.length > 0 ? (
            <>
              {genres.slice(0, 4).map((genre) => (
                <div key={genre} className="mb-1">
                  <p className="text-xs font-medium text-stone-600 mb-2 capitalize">
                    {genre}
                  </p>
                  <BookShelf
                    books={booksByGenre.get(genre) || []}
                    onBookClick={onBookClick}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <Book className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="font-medium text-sm">No books yet</p>
              <p className="text-xs mt-1">Start your reading adventure!</p>
            </div>
          )}
        </div>

        {/* Achievements Row */}
        {recentAchievements.length > 0 && (
          <div className="px-4 py-2 border-t border-stone-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary-600">
                <Trophy className="w-3 h-3" />
                <span className="text-xs font-medium">Achievements</span>
              </div>
              <div className="flex items-center gap-1.5">
                {recentAchievements.map((achievement) => (
                  <AchievementChip
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={true}
                  />
                ))}
                {unlockedAchievements.length > 3 && (
                  <span className="text-xs text-stone-400">
                    +{unlockedAchievements.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// Bookshelf component with wooden shelf styling
interface BookShelfProps {
  books: LibraryBook[]
  onBookClick?: (bookId: string) => void
}

function BookShelf({ books, onBookClick }: BookShelfProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)

  return (
    <div className="relative">
      {/* Books container */}
      <div className="relative z-10 flex items-end gap-2 px-3 pb-2 min-h-[140px] overflow-x-auto scrollbar-hide">
        {books.map((book, index) => (
          <motion.button
            key={book.id}
            onClick={() => onBookClick?.(book.id)}
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
            className="flex-shrink-0 group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -12, transition: { duration: 0.2 } }}
          >
            {/* Hover tooltip with rating and excerpt */}
            <AnimatePresence>
              {hoveredBook === book.id && (book.rating || book.notes) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48"
                >
                  <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-3">
                    <p className="font-semibold text-stone-800 text-xs mb-1 line-clamp-1">
                      {book.title}
                    </p>
                    {book.rating && (
                      <div className="mb-1.5">
                        <StarRating rating={book.rating} />
                      </div>
                    )}
                    {book.notes && (
                      <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 italic">
                        "{book.notes}"
                      </p>
                    )}
                    {!book.notes && book.rating && (
                      <p className="text-primary-500 text-xs">
                        Click to see full review
                      </p>
                    )}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="border-8 border-transparent border-t-white" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Book */}
            <div
              className="relative rounded-md overflow-hidden shadow-md group-hover:shadow-lg transition-all"
              style={{
                width: book.coverUrl ? '80px' : '75px',
                height: book.coverUrl ? '120px' : '115px',
              }}
            >
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getBookColor(book.title)} flex flex-col items-center justify-center p-1.5`}>
                  <span className="text-white text-xs font-bold text-center leading-tight line-clamp-3">
                    {book.title}
                  </span>
                  <span className="text-white/70 text-xs mt-0.5 text-center line-clamp-1">
                    {book.author}
                  </span>
                </div>
              )}

              {/* Rating badge on book cover */}
              {book.rating && (
                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                  <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-stone-700">{book.rating}</span>
                </div>
              )}

              {/* Spine effect - left edge */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-r from-black/15 to-transparent" />

              {/* Light reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Book shadow on shelf */}
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[70%] h-1.5 bg-black/10 blur-sm rounded-full" />
          </motion.button>
        ))}
      </div>

      {/* Wooden shelf - warm brown tones */}
      <div className="relative h-4">
        {/* Shelf top surface */}
        <div className="absolute inset-x-0 top-0 h-2.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-t-sm shadow-inner" />
        {/* Shelf front face */}
        <div className="absolute inset-x-0 top-2.5 h-1.5 bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-sm" />
        {/* Shelf highlight */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-b from-amber-600/60 to-transparent rounded-t-sm" />
        {/* Left bracket */}
        <div className="absolute left-0 top-0 w-2 h-4 bg-gradient-to-r from-amber-950 to-amber-900 rounded-l-sm" />
        {/* Right bracket */}
        <div className="absolute right-0 top-0 w-2 h-4 bg-gradient-to-l from-amber-950 to-amber-900 rounded-r-sm" />
      </div>
    </div>
  )
}

export default VirtualLibrary
