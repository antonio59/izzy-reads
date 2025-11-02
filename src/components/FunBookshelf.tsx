import { useState } from 'react'
import { Star, Calendar, BookOpen } from 'lucide-react'
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

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    onSelectBook(book)
  }

  const getSpineColor = (index: number) => {
    return SPINE_COLORS[index % SPINE_COLORS.length]
  }

  const getBookHeight = () => {
    return 220 + Math.random() * 40 // Random heights between 220-260px
  }

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
              const height = getBookHeight()
              
              return (
                <div
                  key={book.id}
                  className="relative cursor-pointer transition-all duration-300 ease-out"
                  style={{
                    height: `${height}px`,
                    width: '60px',
                    transform: isHovered ? 'translateY(-10px) scale(1.05)' : 'translateY(0)',
                    zIndex: isHovered ? 10 : 1,
                  }}
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

                  {/* Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap max-w-xs">
                        <p className="font-bold truncate">{book.title}</p>
                        <p className="text-gray-300 text-[10px]">{book.author}</p>
                        {book.rating && (
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2 h-2 ${
                                  i < book.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 mx-auto"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Shelf Front */}
          <div className="bg-gradient-to-b from-amber-700 to-amber-800 h-4 rounded-b-lg shadow-md"></div>
        </div>
      ))}

      {/* Book Details Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-6">
              {selectedBook.coverUrl ? (
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-40 h-60 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-40 h-60 bg-gray-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedBook.title}</h3>
                <p className="text-lg text-gray-600 mb-4">by {selectedBook.author}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Genre:</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {selectedBook.genre}
                    </span>
                  </div>

                  {selectedBook.pageCount && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Pages:</span>
                      <span>{selectedBook.pageCount}</span>
                    </div>
                  )}

                  {selectedBook.dateRead && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">Finished:</span>
                      <span>{new Date(selectedBook.dateRead).toLocaleDateString()}</span>
                    </div>
                  )}

                  {selectedBook.rating && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Rating:</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < selectedBook.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBook.notes && (
                    <div className="bg-yellow-50 p-3 rounded-lg mt-4">
                      <p className="font-semibold text-sm mb-1">My Notes:</p>
                      <p className="text-sm text-gray-700">{selectedBook.notes}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="mt-6 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FunBookshelf
