import { useState } from 'react'
import { Search, BookOpen, Plus, Loader2 } from 'lucide-react'
import { searchBooks, convertToBookFormat, getBookDescription, determineAgeRating, suggestGenre, type BookDetails, type OpenLibraryBook } from '../services/openLibraryApi'
import type { Book } from '../types'

interface BookSearchProps {
  onAddBook: (book: Book) => void
  onClose: () => void
}

const BookSearch: React.FC<BookSearchProps> = ({ onAddBook, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OpenLibraryBook[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const books = await searchBooks(query, 12)
      setResults(books)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSelectBook = async (book: OpenLibraryBook) => {
    const bookDetails = convertToBookFormat(book)
    
    // Try to get description if work key is available
    if (book.key) {
      const description = await getBookDescription(book.key.replace('/works/', ''))
      if (description) {
        bookDetails.description = description
      }
    }
    
    setSelectedBook(bookDetails)
  }

  const handleAddToBookshelf = () => {
    if (!selectedBook) return

    const newBook: Book = {
      id: crypto.randomUUID(),
      title: selectedBook.title,
      author: selectedBook.author,
      coverUrl: selectedBook.coverUrl,
      isbn: selectedBook.isbn,
      genre: suggestGenre(selectedBook.subjects),
      pageCount: selectedBook.pageCount,
      description: selectedBook.description,
      ageRating: determineAgeRating(selectedBook.subjects),
      dateAdded: new Date().toISOString().split('T')[0],
      isRead: false
    }

    onAddBook(newBook)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              Search for Books
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {selectedBook ? (
            // Book Details View
            <div className="space-y-6">
              <button
                onClick={() => setSelectedBook(null)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to results
              </button>

              <div className="flex gap-6">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-book-cover.png'
                  }}
                />

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedBook.title}</h3>
                    <p className="text-xl text-gray-600">by {selectedBook.author}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedBook.publishYear && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        📅 {selectedBook.publishYear}
                      </span>
                    )}
                    {selectedBook.pageCount && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        📄 {selectedBook.pageCount} pages
                      </span>
                    )}
                    {selectedBook.publisher && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        🏢 {selectedBook.publisher}
                      </span>
                    )}
                  </div>

                  {selectedBook.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedBook.description.slice(0, 300)}
                        {selectedBook.description.length > 300 && '...'}
                      </p>
                    </div>
                  )}

                  {selectedBook.subjects && selectedBook.subjects.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBook.subjects.slice(0, 5).map((subject, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddToBookshelf}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to My Bookshelf
                  </button>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            // Search Results Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((book, index) => {
                const bookDetails = convertToBookFormat(book)
                return (
                  <div
                    key={index}
                    onClick={() => handleSelectBook(book)}
                    className="cursor-pointer group"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all transform group-hover:scale-105">
                      <img
                        src={bookDetails.coverUrl}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-book-cover.png'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="text-white text-sm">
                          <p className="font-bold truncate">{book.title}</p>
                          <p className="text-xs truncate">{bookDetails.author}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {loading ? 'Searching...' : 'Search for books to add to your collection!'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try searching for your favorite book or author
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookSearch
