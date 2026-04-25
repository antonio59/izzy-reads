import React, { useState } from 'react'
import { BookOpen, Star, Plus, Edit, Trash2, Calendar, User } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import type { Book } from '../types'
import { Modal, ModalFooter } from './ui/Modal'
import { Input, Textarea, Select } from './ui/Input'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
}

const StarRating = ({ rating, onRatingChange, readonly = false }: StarRatingProps) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-5 w-5 cursor-pointer transition-colors ${star <= rating ? 'text-amber-400 fill-current' : 'text-stone-300'
          }`}
        onClick={() => !readonly && onRatingChange && onRatingChange(star)}
      />
    ))}
  </div>
)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-600 flex items-center">
            <BookOpen className="h-8 w-8 mr-3" />
            My Bookshelf
          </h1>
          <p className="text-stone-600 mt-1">Your amazing reading collection! 📚</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
          onClick={() => setShowAddForm(true)}
        >
          Add Book
        </Button>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedGenre === genre
                ? 'bg-primary-600 text-white'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} variant="elevated" padding="none" className="hover:shadow-xl transition-shadow duration-300">
            {/* Book Cover */}
            <div className="h-48 bg-gradient-to-br from-primary-400 via-accent-400 to-primary-300 flex items-center justify-center relative">
              <BookOpen className="h-16 w-16 text-white" />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => setEditingBook(book)}
                  className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  aria-label={`Edit ${book.title}`}
                >
                  <Edit className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  aria-label={`Delete ${book.title}`}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Book Info */}
            <div className="p-4">
              <h3 className="font-bold text-stone-800 text-lg mb-1 line-clamp-2">{book.title}</h3>
              <p className="text-stone-600 text-sm mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                {book.author}
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                  {book.genre}
                </span>
                <span className="text-xs text-stone-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {book.dateRead}
                </span>
              </div>

              <StarRating rating={book.rating || 0} readonly />

              {book.notes && (
                <p className="text-sm text-stone-600 mt-2 italic line-clamp-2">
                  "{book.notes}"
                </p>
              )}

              {book.pageCount && (
                <p className="text-xs text-stone-500 mt-2">
                  {book.pageCount} pages
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-24 w-24 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-600 mb-2">No books yet!</h3>
          <p className="text-stone-500 mb-4">Start building your amazing bookshelf!</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowAddForm(true)}
          >
            Add Your First Book
          </Button>
        </div>
      )}

      {/* Add Book Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New Book" size="sm">
        <div className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            placeholder="Enter book title"
          />

          <Input
            label="Author"
            type="text"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            placeholder="Enter author name"
          />

          <Select
            label="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            options={[
              { value: 'Fiction', label: 'Fiction' },
              { value: 'Fantasy', label: 'Fantasy' },
              { value: 'Adventure', label: 'Adventure' },
              { value: 'Mystery', label: 'Mystery' },
              { value: 'Science Fiction', label: 'Science Fiction' },
              { value: 'Non-Fiction', label: 'Non-Fiction' },
            ]}
          />

          <Input
            label="Pages"
            type="number"
            value={newBook.pageCount}
            onChange={(e) => setNewBook({ ...newBook, pageCount: parseInt(e.target.value) || 0 })}
            placeholder="Number of pages"
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
            <StarRating
              rating={newBook.rating || 0}
              onRatingChange={(rating) => setNewBook({ ...newBook, rating })}
            />
          </div>

          <Textarea
            label="Notes"
            value={newBook.notes}
            onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
            rows={3}
            placeholder="What did you think about this book?"
          />
        </div>

        <ModalFooter>
          <Button variant="primary" onClick={handleAddBook}>Add Book</Button>
          <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Book Modal */}
      <Modal isOpen={!!editingBook} onClose={() => setEditingBook(null)} title="Edit Book" size="sm">
        <div className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={editingBook?.title || ''}
            onChange={(e) => setEditingBook(editingBook ? { ...editingBook, title: e.target.value } : null)}
          />

          <Input
            label="Author"
            type="text"
            value={editingBook?.author || ''}
            onChange={(e) => setEditingBook(editingBook ? { ...editingBook, author: e.target.value } : null)}
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
            <StarRating
              rating={editingBook?.rating || 0}
              onRatingChange={(rating) => setEditingBook(editingBook ? { ...editingBook, rating } : null)}
            />
          </div>

          <Textarea
            label="Notes"
            value={editingBook?.notes || ''}
            onChange={(e) => setEditingBook(editingBook ? { ...editingBook, notes: e.target.value } : null)}
            rows={3}
          />
        </div>

        <ModalFooter>
          <Button variant="primary" onClick={handleUpdateBook}>Update Book</Button>
          <Button variant="secondary" onClick={() => setEditingBook(null)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Bookshelf
