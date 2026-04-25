import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, BookOpen } from 'lucide-react'
import type { Book } from '../types'
import { Card } from './ui'

interface PublicBookshelfProps {
  books: Book[]
  title?: string
  onBookClick?: (book: Book) => void
}

const PublicBookshelf: React.FC<PublicBookshelfProps> = ({ books }) => {
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null)

  // Group books into shelves (6 books per shelf)
  const booksPerShelf = 6
  const shelves: Book[][] = []
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf))
  }

  if (books.length === 0) {
    return (
      <div className="bg-stone-100 rounded-2xl p-12 text-center">
        <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-500">No books yet!</p>
      </div>
    )
  }

  return (
    <div className="space-y-0 relative">
      {shelves.map((shelf, shelfIndex) => (
        <div key={shelfIndex} className="relative">
          {/* Books on shelf */}
          <div className="flex items-end justify-start gap-4 px-4 pb-0 min-h-[220px]">
            {shelf.map((book, bookIndex) => (
              <motion.div
                key={book.id}
                className="relative cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (shelfIndex * booksPerShelf + bookIndex) * 0.05 }}
                onMouseEnter={() => setHoveredBook(book)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                {/* Book */}
                <motion.div 
                  className="relative w-[90px] md:w-[110px] h-[140px] md:h-[170px] rounded-md overflow-hidden shadow-lg transition-shadow"
                  whileHover={{ y: -12, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Book Cover */}
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback cover */}
                  <div 
                    className={`absolute inset-0 flex flex-col items-center justify-center p-3 text-white ${book.coverUrl ? 'hidden' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${getBookColor(book.title, 0)} 0%, ${getBookColor(book.title, 1)} 100%)`
                    }}
                  >
                    <span className="text-xs font-bold text-center leading-tight line-clamp-3">
                      {book.title}
                    </span>
                    <span className="text-xs opacity-80 mt-1 text-center line-clamp-1">
                      {book.author}
                    </span>
                  </div>

                  {/* Book spine edge */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/20" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/10 pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Wooden Shelf */}
          <div className="relative h-5">
            <div 
              className="absolute inset-x-0 top-0 h-3 rounded-md"
              style={{
                background: 'linear-gradient(180deg, #D4A574 0%, #C4956A 50%, #B8875A 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            />
            <div 
              className="absolute inset-x-0 top-3 h-2 rounded-b-sm"
              style={{
                background: 'linear-gradient(180deg, #A67B5B 0%, #8B6914 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </div>
      ))}

      {/* Hover Review Card */}
      <AnimatePresence>
        {hoveredBook && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card variant="elevated" padding="none" className="w-[420px] max-w-[90vw] shadow-xl border border-stone-200">
              {/* Header with cover */}
              <div className="flex">
                {/* Book Cover */}
                <div className="w-32 h-44 flex-shrink-0 bg-stone-100">
                  {hoveredBook.coverUrl ? (
                    <img
                      src={hoveredBook.coverUrl}
                      alt={hoveredBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white p-2"
                      style={{
                        background: `linear-gradient(135deg, ${getBookColor(hoveredBook.title, 0)} 0%, ${getBookColor(hoveredBook.title, 1)} 100%)`
                      }}
                    >
                      <span className="text-sm font-bold text-center">{hoveredBook.title}</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-lg text-stone-900 leading-tight mb-1">
                    {hoveredBook.title}
                  </h3>
                  <p className="text-stone-500 text-sm mb-3">by {hoveredBook.author}</p>

                  {/* Rating */}
                  {hoveredBook.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < hoveredBook.rating! ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-bold text-amber-600 ml-1">
                        {hoveredBook.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {hoveredBook.genre && (
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-medium">
                        {hoveredBook.genre}
                      </span>
                    )}
                    {hoveredBook.pageCount && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {hoveredBook.pageCount} pages
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Section */}
              {(hoveredBook.notes || hoveredBook.review) && (
                <div className="px-4 pb-4">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-1.5">
                      <span className="text-base">💭</span> Izzy's Review
                    </p>
                    <p className="text-stone-700 text-sm leading-relaxed">
                      {hoveredBook.notes || hoveredBook.review}
                    </p>
                  </div>
                </div>
              )}

              {/* No review message */}
              {!hoveredBook.notes && !hoveredBook.review && (
                <div className="px-4 pb-4">
                  <div className="bg-stone-50 rounded-xl p-4 text-center">
                    <p className="text-stone-400 text-sm italic">Review coming soon!</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Generate book colors based on title
function getBookColor(title: string, index: number): string {
  const colors = [
    ['#E74C3C', '#C0392B'], // Red
    ['#3498DB', '#2980B9'], // Blue
    ['#2ECC71', '#27AE60'], // Green
    ['#9B59B6', '#8E44AD'], // Purple
    ['#F39C12', '#D68910'], // Orange
    ['#1ABC9C', '#16A085'], // Teal
    ['#E91E63', '#C2185B'], // Pink
    ['#673AB7', '#512DA8'], // Deep Purple
    ['#00BCD4', '#0097A7'], // Cyan
    ['#FF5722', '#E64A19'], // Deep Orange
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorPair = colors[hash % colors.length]
  return colorPair[index]
}

export default PublicBookshelf
