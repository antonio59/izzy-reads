import { useState } from 'react'
import { BookOpen, Library, Search as SearchIcon } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import BookSearch from './BookSearch'
import FunBookshelf from './FunBookshelf'
import type { Book } from '../types'

const EnhancedBookshelf: React.FC = () => {
  const { books, addBook } = useBooks()
  const [showSearch, setShowSearch] = useState(false)
  const [, setSelectedBook] = useState<Book | null>(null)
  const [viewMode, setViewMode] = useState<'shelf' | 'grid'>('shelf')

  const readBooks = books.filter(book => book.isRead)

  const handleAddBook = (book: Book) => {
    addBook(book)
    setShowSearch(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
              <Library className="w-10 h-10" />
              My Magical Bookshelf
            </h1>
            <p className="text-white/90 text-lg">
              {readBooks.length === 0 
                ? "Start your reading adventure!"
                : `You've read ${readBooks.length} amazing ${readBooks.length === 1 ? 'book' : 'books'}! 📚✨`}
            </p>
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg transform hover:scale-105"
          >
            <SearchIcon className="w-5 h-5" />
            Find Books
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2 p-2 bg-white rounded-full w-fit mx-auto shadow-md">
        <button
          onClick={() => setViewMode('shelf')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            viewMode === 'shelf'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📚 Bookshelf View
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            viewMode === 'grid'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📖 Cover View
        </button>
      </div>

      {/* Fun Bookshelf or Grid View */}
      {viewMode === 'shelf' ? (
        <FunBookshelf books={readBooks} onSelectBook={setSelectedBook} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {readBooks.length > 0 ? (
            readBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all transform group-hover:scale-105">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-72 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-book-cover.png'
                      }}
                    />
                  ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-purple-500" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-bold text-sm line-clamp-2">{book.title}</p>
                    <p className="text-white/80 text-xs line-clamp-1">{book.author}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No books yet!</p>
              <p className="text-gray-400 text-sm mt-2">Click "Find Books" to start adding books to your shelf</p>
            </div>
          )}
        </div>
      )}

      {/* Book Search Modal */}
      {showSearch && (
        <BookSearch 
          onAddBook={handleAddBook} 
          onClose={() => setShowSearch(false)} 
        />
      )}
    </div>
  )
}

export default EnhancedBookshelf
