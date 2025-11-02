import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Book, BlogPost, ReadingChallenge, ReadingStats } from '../types'

interface BookContextType {
  books: Book[]
  wishlist: Book[]
  blogPosts: BlogPost[]
  readingChallenges: ReadingChallenge[]
  readingStats: ReadingStats
  addBook: (book: Book) => void
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  addToWishlist: (book: Book) => void
  removeFromWishlist: (id: string) => void
  moveToBookshelf: (id: string) => void
  addBlogPost: (post: BlogPost) => void
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void
  deleteBlogPost: (id: string) => void
  updateReadingStats: () => void
}

const BookContext = createContext<BookContextType | undefined>(undefined)

export const useBooks = () => {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider')
  }
  return context
}

interface BookProviderProps {
  children: ReactNode
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [wishlist, setWishlist] = useState<Book[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [readingChallenges, setReadingChallenges] = useState<ReadingChallenge[]>([])
  const [readingStats, setReadingStats] = useState<ReadingStats>({
    totalBooks: 0,
    totalPages: 0,
    favoriteGenre: '',
    readingStreak: 0,
    averageRating: 0,
    booksThisMonth: 0,
    booksThisYear: 0
  })

  // Initialize with sample data
  useEffect(() => {
    const sampleBooks: Book[] = [
      {
        id: '1',
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        ageRating: '8+',
        dateAdded: '2024-01-15',
        dateRead: '2024-01-20',
        rating: 5,
        isRead: true,
        pageCount: 309,
        notes: 'Amazing magical adventure!'
      },
      {
        id: '2',
        title: 'Wonder',
        author: 'R.J. Palacio',
        genre: 'Fiction',
        ageRating: '8+',
        dateAdded: '2024-02-01',
        dateRead: '2024-02-05',
        rating: 4,
        isRead: true,
        pageCount: 315,
        notes: 'Very touching story about kindness.'
      }
    ]

    const sampleWishlist: Book[] = [
      {
        id: '3',
        title: 'The Wild Robot',
        author: 'Peter Brown',
        genre: 'Adventure',
        ageRating: '8+',
        dateAdded: '2024-02-10',
        isRead: false,
        pageCount: 279
      }
    ]

    const sampleChallenges: ReadingChallenge[] = [
      {
        id: '1',
        title: 'Read 20 Books This Year',
        description: 'Challenge yourself to read 20 books before the year ends!',
        target: 20,
        current: 2,
        type: 'books',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        completed: false,
        badge: '📚'
      }
    ]

    setBooks(sampleBooks)
    setWishlist(sampleWishlist)
    setReadingChallenges(sampleChallenges)
    updateReadingStats()
  }, [])

  const addBook = (book: Book) => {
    setBooks(prev => [...prev, book])
    updateReadingStats()
  }

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ))
    updateReadingStats()
  }

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id))
    updateReadingStats()
  }

  const addToWishlist = (book: Book) => {
    setWishlist(prev => [...prev, book])
  }

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(book => book.id !== id))
  }

  const moveToBookshelf = (id: string) => {
    const book = wishlist.find(b => b.id === id)
    if (book) {
      removeFromWishlist(id)
      addBook({ ...book, isRead: true, dateRead: new Date().toISOString().split('T')[0] })
    }
  }

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [...prev, post])
  }

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ))
  }

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id))
  }

  const updateReadingStats = () => {
    const readBooks = books.filter(book => book.isRead)
    const totalPages = readBooks.reduce((sum, book) => sum + (book.pageCount || 0), 0)
    const genres = readBooks.map(book => book.genre)
    const favoriteGenre = genres.length > 0 ? 
      genres.reduce((a, b, i, arr) => 
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
      ) : ''
    
    const averageRating = readBooks.length > 0 ? 
      readBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / readBooks.length : 0

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    
    const booksThisYear = readBooks.filter(book => 
      book.dateRead && new Date(book.dateRead).getFullYear() === currentYear
    ).length

    const booksThisMonth = readBooks.filter(book => 
      book.dateRead && 
      new Date(book.dateRead).getFullYear() === currentYear &&
      new Date(book.dateRead).getMonth() === currentMonth
    ).length

    setReadingStats({
      totalBooks: readBooks.length,
      totalPages,
      favoriteGenre,
      readingStreak: 0, // TODO: Calculate actual streak
      averageRating,
      booksThisMonth,
      booksThisYear
    })
  }

  const value = {
    books,
    wishlist,
    blogPosts,
    readingChallenges,
    readingStats,
    addBook,
    updateBook,
    deleteBook,
    addToWishlist,
    removeFromWishlist,
    moveToBookshelf,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateReadingStats
  }

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  )
} 