import React, { useState } from 'react'
import { Heart, Plus, BookOpen, Star, Trash2, ArrowRight } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import type { Book } from '../types'

const Wishlist: React.FC = () => {
  const { wishlist, addToWishlist, removeFromWishlist, moveToBookshelf } = useBooks()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: 'Fiction',
    ageRating: '8+',
    pageCount: 0,
    description: ''
  })

  const handleAddToWishlist = () => {
    if (newBook.title && newBook.author) {
      const book: Book = {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre || 'Fiction',
        ageRating: newBook.ageRating || '8+',
        dateAdded: new Date().toISOString().split('T')[0],
        isRead: false,
        pageCount: newBook.pageCount || 0,
        description: newBook.description || ''
      }
      addToWishlist(book)
      setNewBook({
        title: '',
        author: '',
        genre: 'Fiction',
        ageRating: '8+',
        pageCount: 0,
        description: ''
      })
      setShowAddForm(false)
    }
  }

  const handleMoveToBookshelf = (bookId: string) => {
    moveToBookshelf(bookId)
  }

  const PriorityHeart = ({ priority }: { priority: number }) => {
    const colors = [
      'text-gray-300',
      'text-pink-300',
      'text-pink-400',
      'text-pink-500',
      'text-pink-600',
      'text-red-500'
    ]
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <Heart
            key={level}
            className={`h-4 w-4 ${level <= priority ? colors[level] + ' fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pink-600 flex items-center">
            <Heart className="h-8 w-8 mr-3 fill-current" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">Books you can't wait to read! 💖</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Wishlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books to Read</p>
              <p className="text-2xl font-bold text-pink-600">{wishlist.length}</p>
            </div>
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-purple-600">
                {wishlist.reduce((sum, book) => sum + (book.pageCount || 0), 0)}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Genres</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(wishlist.map(book => book.genre)).size}
              </p>
            </div>
            <Star className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Wishlist Books */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Book Cover */}
              <div className="h-40 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center relative">
                <BookOpen className="h-12 w-12 text-white" />
                <button
                  onClick={() => removeFromWishlist(book.id)}
                  className="absolute top-2 right-2 p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                  {book.pageCount && (
                    <span className="text-xs text-gray-500">
                      {book.pageCount} pages
                    </span>
                  )}
                </div>

                {book.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {book.description}
                  </p>
                )}

                {/* Priority Level */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">How much do you want to read this?</p>
                  <PriorityHeart priority={3} />
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleMoveToBookshelf(book.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <span>I Read This!</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-pink-300 mx-auto mb-4 fill-current" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty!</h3>
          <p className="text-gray-500 mb-4">Add some books you'd love to read!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors duration-200"
          >
            Add Your First Book
          </button>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add to Wishlist</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages (if you know)</label>
                <input
                  type="number"
                  value={newBook.pageCount}
                  onChange={(e) => setNewBook({ ...newBook, pageCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Number of pages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to read this?</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                  placeholder="What makes this book interesting to you?"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddToWishlist}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
              >
                Add to Wishlist
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reading Suggestions */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3 flex items-center">
          <Star className="h-6 w-6 mr-2 fill-current" />
          Book Suggestions for You!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📚 "Matilda" by Roald Dahl</h4>
            <p className="text-sm opacity-90">A brilliant girl with magical powers and a love for reading!</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🦄 "The Last Unicorn" by Peter S. Beagle</h4>
            <p className="text-sm opacity-90">A magical adventure about the world's last unicorn!</p>
          </div>
        </div>
        <p className="text-sm mt-4 opacity-90">
          💡 Ask your parents to help you find these books at the library or bookstore!
        </p>
      </div>
    </div>
  )
}

export default Wishlist 