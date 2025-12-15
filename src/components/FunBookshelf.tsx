import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Calendar, BookOpen, X } from 'lucide-react'
import type { Book } from '../types'

interface FunBookshelfProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

// Color palette for book spines
const SPINE_COLORS = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-yellow-500 to-yellow-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
  'from-orange-500 to-orange-600',
  'from-cyan-500 to-cyan-600',
]

const FunBookshelf: React.FC<FunBookshelfProps> = ({ books, onSelectBook }) => {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isBookOpen, setIsBookOpen] = useState(false)

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsBookOpen(true)
    onSelectBook(book)
  }

  const closeBook = () => {
    setIsBookOpen(false)
    setTimeout(() => setSelectedBook(null), 500)
  }

  const getSpineColor = (index: number) => {
    return SPINE_COLORS[index % SPINE_COLORS.length]
  }

  // Memoize book heights so they don't change on re-render
  const bookHeights = useMemo(() => {
    return books.reduce((acc, book) => {
      acc[book.id] = 220 + Math.random() * 40
      return acc
    }, {} as Record<string, number>)
  }, [books.map(b => b.id).join(',')])

  // Group books by shelf (6 books per shelf)
  const shelves = []
  const booksPerShelf = 6
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf))
  }

  if (books.length === 0) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Your bookshelf is empty!</p>
        <p className="text-gray-400 text-sm mt-2">Add books to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Bookshelf Character */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 flex items-center gap-4">
        <div className="text-6xl">🐛</div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Your Reading Bookworm!</h3>
          <p className="text-gray-600">
            You've read <span className="font-bold text-purple-600">{books.filter(b => b.isRead).length}</span> books!
            Keep reading to help your bookworm grow! 🌟
          </p>
        </div>
      </div>

      {/* Bookshelves */}
      {shelves.map((shelf, shelfIndex) => (
        <div key={shelfIndex} className="relative">
          {/* Shelf Background */}
          <div className="bg-gradient-to-b from-amber-800 to-amber-900 h-8 rounded-lg shadow-lg mb-2"></div>
          
          {/* Books Container */}
          <div className="flex items-end justify-start gap-1 mb-4 px-4">
            {shelf.map((book, bookIndex) => {
              const isHovered = hoveredBook === book.id
              const height = bookHeights[book.id] || 240
              
              return (
                <motion.div
                  key={book.id}
                  className="relative cursor-pointer"
                  style={{
                    height: `${height}px`,
                    width: '60px',
                    zIndex: isHovered ? 10 : 1,
                  }}
                  animate={{
                    y: isHovered ? -15 : 0,
                    scale: isHovered ? 1.08 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onMouseEnter={() => setHoveredBook(book.id)}
                  onMouseLeave={() => setHoveredBook(null)}
                  onClick={() => handleBookClick(book)}
                >
                  {/* Book Spine */}
                  <div
                    className={`h-full w-full bg-gradient-to-br ${getSpineColor(shelfIndex * booksPerShelf + bookIndex)} rounded-t-md shadow-lg relative overflow-hidden`}
                  >
                    {/* Book Title (Vertical) */}
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <p
                        className="text-white text-xs font-bold transform -rotate-90 whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ maxWidth: `${height - 40}px` }}
                      >
                        {book.title}
                      </p>
                    </div>

                    {/* Author (Bottom) */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <p className="text-white text-[8px] opacity-80 px-1 truncate">
                        {book.author}
                      </p>
                    </div>

                    {/* Read Badge */}
                    {book.isRead && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-yellow-400 rounded-full p-1">
                          <Star className="w-3 h-3 text-yellow-800 fill-yellow-800" />
                        </div>
                      </div>
                    )}

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
                  </div>

                  {/* Enhanced Hover Card with Rating */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-20"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-white text-gray-800 px-4 py-3 rounded-xl shadow-2xl min-w-[180px] border border-gray-100">
                          <p className="font-bold text-sm truncate mb-1">{book.title}</p>
                          <p className="text-gray-500 text-xs mb-2">{book.author}</p>
                          
                          {/* Rating Stars - Prominent */}
                          {book.rating && (
                            <div className="flex items-center gap-1 bg-amber-50 rounded-lg px-2 py-1.5 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < book.rating! ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-xs font-semibold text-amber-700 ml-1">
                                {book.rating}/5
                              </span>
                            </div>
                          )}
                          
                          {/* Click hint */}
                          <p className="text-[10px] text-primary-600 font-medium text-center">
                            Click to read review
                          </p>
                        </div>
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white mx-auto -mt-[1px]"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Shelf Front */}
          <div className="bg-gradient-to-b from-amber-700 to-amber-800 h-4 rounded-b-lg shadow-md"></div>
        </div>
      ))}

      {/* Book Opening Animation Modal */}
      <AnimatePresence>
        {selectedBook && isBookOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeBook}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Book Container */}
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.3, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.3, rotateY: 180 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.8 }}
              style={{ perspective: 2000 }}
            >
              {/* Open Book */}
              <div className="relative bg-amber-50 rounded-lg shadow-2xl overflow-hidden flex" style={{ minHeight: '500px' }}>
                {/* Book Spine Shadow */}
                <div className="absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2 bg-gradient-to-r from-black/20 via-black/10 to-black/20 z-10" />
                
                {/* Left Page - Cover */}
                <motion.div 
                  className="w-1/2 relative overflow-hidden"
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ transformOrigin: 'right center' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50">
                    {selectedBook.coverUrl ? (
                      <img
                        src={selectedBook.coverUrl}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getSpineColor(0)} flex flex-col items-center justify-center p-8`}>
                        <BookOpen className="w-24 h-24 text-white/80 mb-4" />
                        <h3 className="text-2xl font-bold text-white text-center">{selectedBook.title}</h3>
                        <p className="text-white/80 mt-2">{selectedBook.author}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Page curl effect */}
                  <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/10 to-transparent" />
                </motion.div>

                {/* Right Page - Review Content */}
                <motion.div 
                  className="w-1/2 bg-amber-50 p-8 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)',
                    backgroundPosition: '0 20px'
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={closeBook}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all z-20"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Book Title */}
                  <h2 className="text-3xl font-display font-bold text-gray-800 mb-2 pr-10">
                    {selectedBook.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-4">by {selectedBook.author}</p>

                  {/* Rating - Large and prominent */}
                  {selectedBook.rating && (
                    <div className="flex items-center gap-2 mb-6 bg-amber-100 rounded-xl p-3 w-fit">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < selectedBook.rating! ? 'fill-amber-500 text-amber-500' : 'text-amber-200'
                          }`}
                        />
                      ))}
                      <span className="font-bold text-amber-700 text-lg ml-2">
                        {selectedBook.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {selectedBook.genre}
                    </span>
                    {selectedBook.pageCount && (
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {selectedBook.pageCount} pages
                      </span>
                    )}
                    {selectedBook.dateRead && (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(selectedBook.dateRead).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-b-2 border-amber-200 mb-6" />

                  {/* Review Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">💭</span> Izzy's Review
                    </h3>
                    {selectedBook.notes ? (
                      <p className="text-gray-700 leading-relaxed text-lg font-serif whitespace-pre-wrap">
                        {selectedBook.notes}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No review written yet. This book was amazing though!
                      </p>
                    )}
                  </div>

                  {/* Decorative footer */}
                  <div className="mt-8 pt-6 border-t border-amber-200 text-center">
                    <span className="text-4xl">📚</span>
                    <p className="text-sm text-gray-500 mt-2">From Izzy's Reading Collection</p>
                  </div>
                </motion.div>
              </div>

              {/* Book shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/30 blur-xl rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FunBookshelf
