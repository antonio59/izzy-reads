import React, { useState } from 'react'
import { BookOpen, Star, Plus, Edit, Trash2, Calendar, User } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import type { Book } from '../types'

const Bookshelf: React.FC = () => {
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string>('All')

  const genres = ['All', ...Array.from(new Set(books.map(book => book.genre)))]
  const filteredBooks = selectedGenre === 'All' 
    ? books.filter(book => book.isRead)
    : books.filter(book => book.isRead && book.genre === selectedGenre)

  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: 'Fiction',
    ageRating: '8+',
    pageCount: 0,
    rating: 0,
    notes: ''
  })

  const handleAddBook = () => {
    if (newBook.title && newBook.author) {
      const book: Book = {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre || 'Fiction',
        ageRating: newBook.ageRating || '8+',
        dateAdded: new Date().toISOString().split('T')[0],
        dateRead: new Date().toISOString().split('T')[0],
        rating: newBook.rating || 0,
        isRead: true,
        pageCount: newBook.pageCount || 0,
        notes: newBook.notes || ''
      }
      addBook(book)
      setNewBook({
        title: '',
        author: '',
        genre: 'Fiction',
        ageRating: '8+',
        pageCount: 0,
        rating: 0,
        notes: ''
      })
      setShowAddForm(false)
    }
  }

  const handleUpdateBook = () => {
    if (editingBook) {
      updateBook(editingBook.id, editingBook)
      setEditingBook(null)
    }
  }

  const StarRating = ({ rating, onRatingChange, readonly = false }: { 
    rating: number, 
    onRatingChange?: (rating: number) => void,
    readonly?: boolean 
  }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-600 flex items-center">
            <BookOpen className="h-8 w-8 mr-3" />
            My Bookshelf
          </h1>
          <p className="text-gray-600 mt-1">Your amazing reading collection! 📚</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedGenre === genre
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Book Cover */}
            <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center relative">
              <BookOpen className="h-16 w-16 text-white" />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => setEditingBook(book)}
                  className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Edit className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Book Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                {book.author}
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {book.genre}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {book.dateRead}
                </span>
              </div>

              <StarRating rating={book.rating || 0} readonly />

              {book.notes && (
                <p className="text-sm text-gray-600 mt-2 italic line-clamp-2">
                  "{book.notes}"
                </p>
              )}

              {book.pageCount && (
                <p className="text-xs text-gray-500 mt-2">
                  {book.pageCount} pages
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No books yet!</h3>
          <p className="text-gray-500 mb-4">Start building your amazing bookshelf!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Add Your First Book
          </button>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input
                  type="number"
                  value={newBook.pageCount}
                  onChange={(e) => setNewBook({ ...newBook, pageCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Number of pages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <StarRating 
                  rating={newBook.rating || 0} 
                  onRatingChange={(rating) => setNewBook({ ...newBook, rating })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newBook.notes}
                  onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="What did you think about this book?"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddBook}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Book
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

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Book</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <StarRating 
                  rating={editingBook.rating || 0} 
                  onRatingChange={(rating) => setEditingBook({ ...editingBook, rating })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingBook.notes}
                  onChange={(e) => setEditingBook({ ...editingBook, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateBook}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Update Book
              </button>
              <button
                onClick={() => setEditingBook(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookshelf 