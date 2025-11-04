import { useState } from 'react'
import { BookOpen, Feather, PenTool, Heart, Star, Calendar, User as UserIcon, Share2, ExternalLink, Gift, User } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import AboutMe from './AboutMe'
import ReadingStats from './ReadingStats'
import BookRecommendations from './BookRecommendations'

const PublicPortfolio = () => {
  const { books, poems, blogPosts, wishlist, updatePoem } = useBooks()
  const [activeTab, setActiveTab] = useState<'books' | 'poems' | 'blog' | 'wishlist' | 'about'>('books')

  const readBooks = books.filter(book => book.isRead)
  const publishedPosts = blogPosts.filter(post => post.status === 'published')
  
  // Sample About Me data - this would come from BookContext in full implementation
  const aboutData = {
    isPublished: true,
    bio: "Hi! I'm Izzy, and I absolutely LOVE reading! Books take me on amazing adventures to magical worlds, help me meet incredible characters, and teach me new things every day. Reading is my superpower!",
    favoriteGenres: ['Fantasy', 'Adventure', 'Mystery', 'Realistic Fiction'],
    favoriteAuthors: ['J.K. Rowling', 'R.J. Palacio', 'Roald Dahl', 'Rick Riordan'],
    whyIRead: "I read because every book is a new adventure! Reading helps me imagine amazing worlds, understand different people, and learn about things I've never experienced. Plus, it's really fun!",
    funFacts: [
      'I can finish a 300-page book in one weekend!',
      'My favorite reading spot is curled up on the couch with my dog',
      'I've read the entire Harry Potter series 3 times',
      'I love recommending books to my friends'
    ],
    currentlyReading: 'Percy Jackson & The Lightning Thief by Rick Riordan',
    readingGoals: [
      'Read 50 books this year',
      'Try a new genre every month',
      'Start a book club with my friends',
      'Write reviews for every book I read'
    ],
    achievements: [
      'Read 100 books',
      'Finished a series in one week',
      'Poetry Contest Winner',
      'Book Club Leader',
      '500 Pages in One Day'
    ]
  }
  
  // Handle poem likes
  const handleLikePoem = (poemId: string) => {
    const poem = poems.find(p => p.id === poemId)
    if (poem) {
      updatePoem(poemId, { likes: (poem.likes || 0) + 1 })
    }
  }

  // Generate purchase links for a book
  const getPurchaseLinks = (book: { isbn?: string; title: string; author: string }) => {
    const searchQuery = encodeURIComponent(`${book.title} ${book.author}`)
    const isbn = book.isbn || ''
    
    return {
      bookshop: `https://bookshop.org/search?keywords=${searchQuery}`,
      amazon: isbn 
        ? `https://www.amazon.co.uk/dp/${isbn}` 
        : `https://www.amazon.co.uk/s?k=${searchQuery}`,
      worldOfBooks: `https://www.worldofbooks.com/en-gb/search?term=${searchQuery}`,
    }
  }

  // Share functionality
  const handleShare = async (type: 'poem' | 'blog', title: string, id: string) => {
    const url = `${window.location.origin}/#${type}-${id}`
    const text = type === 'poem' 
      ? `Check out this poem by Izzy: "${title}"`
      : `Read Izzy's blog post: "${title}"`
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Izzy's Reading Corner
              </h1>
              <p className="text-xs text-gray-500">Young Author & Book Lover</p>
            </div>
          </div>

          {/* Navigation with Counts */}
          <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveTab('books')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'books'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>My Books</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'books' 
                ? 'bg-white/30 text-white' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {readBooks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('poems')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'poems'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <Feather className="w-5 h-5" />
            <span>My Poems</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'poems' 
                ? 'bg-white/30 text-white' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              {poems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span>My Blog</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'blog' 
                ? 'bg-white/30 text-white' 
                : 'bg-green-100 text-green-700'
            }`}>
              {publishedPosts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'wishlist'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>Wishlist</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'wishlist' 
                ? 'bg-white/30 text-white' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {wishlist.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
            }`}
          >
            <User className="w-5 h-5" />
            <span>About Me</span>
          </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Reading Stats - Show on all tabs */}
        <ReadingStats stats={{
          totalBooks: readBooks.length,
          totalPages: readBooks.reduce((sum, book) => sum + (book.pageCount || 0), 0),
          booksThisYear: 2,
          booksThisMonth: 1,
          averageRating: (() => {
            const ratedBooks = readBooks.filter(b => b.rating)
            if (ratedBooks.length === 0) return 0
            return ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
          })(),
          favoriteGenre: 'Fantasy',
          readingStreak: 12
        }} />

        {/* Izzy's Recommendations - Show only highly-rated books */}
        <BookRecommendations books={books} />

        {/* Books Section */}
        {activeTab === 'books' && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <span className="text-5xl">📚</span>
              Books I've Read
            </h2>
            {readBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {readBooks.map((book) => (
                  <div
                    key={book.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer"
                  >
                    {/* Book Cover */}
                    <div className="relative overflow-hidden aspect-[2/3]">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // If image fails to load, show beautiful fallback
                            const target = e.currentTarget
                            target.style.display = 'none'
                            if (target.nextElementSibling) {
                              (target.nextElementSibling as HTMLElement).style.display = 'flex'
                            }
                          }}
                        />
                      ) : null}
                      {/* Fallback if no cover URL or image fails */}
                      <div 
                        className={`w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex flex-col items-center justify-center p-4 ${book.coverUrl ? 'hidden' : 'flex'}`}
                      >
                        <BookOpen className="w-16 h-16 text-white mb-3 opacity-80" />
                        <p className="text-white text-center font-bold text-sm line-clamp-3 drop-shadow-md">
                          {book.title}
                        </p>
                      </div>
                      {/* Rating overlay */}
                      {book.rating && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          {book.rating}/5
                        </div>
                      )}
                    </div>
                    
                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm leading-tight group-hover:text-purple-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">{book.author}</p>
                      
                      {/* Star rating */}
                      {book.rating && (
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < book.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Book notes/review */}
                      {book.notes && (
                        <p className="text-xs text-gray-600 mt-2 italic line-clamp-3 border-t border-gray-100 pt-2">
                          "{book.notes}"
                        </p>
                      )}
                      
                      {/* Genre badge */}
                      {book.genre && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {book.genre}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-16 h-16 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Books Yet!</h3>
                <p className="text-gray-500 text-lg">Check back soon for book reviews! 📚</p>
              </div>
            )}
          </div>
        )}

        {/* Poems Section */}
        {activeTab === 'poems' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <span className="text-5xl">✍️</span>
              My Poetry Collection
            </h2>
            {poems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {poems.map((poem, index) => {
                  const gradients = [
                    'from-pink-400 to-purple-500',
                    'from-blue-400 to-cyan-500',
                    'from-yellow-400 to-orange-500',
                    'from-green-400 to-emerald-500',
                    'from-purple-400 to-pink-500',
                    'from-indigo-400 to-blue-500',
                  ]
                  return (
                    <div
                      key={poem.id}
                      className="group relative"
                    >
                      {/* Gradient border effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity`}></div>
                      
                      {/* Card content */}
                      <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 duration-300 overflow-hidden">
                        {/* Gradient header */}
                        <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-6 text-white`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-5xl drop-shadow-lg">{poem.emoji || '✨'}</span>
                            <span className="text-xs bg-white/30 backdrop-blur px-3 py-1 rounded-full">
                              {new Date(poem.dateCreated).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold drop-shadow-md">{poem.title}</h3>
                        </div>
                        
                        {/* Poem content */}
                        <div className="p-6">
                          <p className="text-gray-700 font-serif whitespace-pre-wrap leading-relaxed text-base min-h-[120px]">
                            {poem.content}
                          </p>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleLikePoem(poem.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors group"
                              >
                                <Heart className="w-4 h-4 text-pink-500 group-hover:fill-pink-500 transition-all" />
                                <span className="text-sm font-medium text-pink-700">{poem.likes} likes</span>
                              </button>
                              <button
                                onClick={() => handleShare('poem', poem.title, poem.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                              >
                                <Share2 className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Share</span>
                              </button>
                            </div>
                            {poem.template && (
                              <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                                {poem.template}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Feather className="w-16 h-16 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Poems Yet!</h3>
                <p className="text-gray-500 text-lg">Check back soon for beautiful poetry! ✍️</p>
              </div>
            )}
          </div>
        )}

        {/* Blog Section */}
        {activeTab === 'blog' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <span className="text-5xl">📝</span>
              My Reading Blog
            </h2>
            {publishedPosts.length > 0 ? (
              <div className="space-y-8">
                {publishedPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-l-8 border-gradient-to-b from-green-400 to-teal-500"
                    style={{
                      borderLeftColor: index % 3 === 0 ? '#10b981' : index % 3 === 1 ? '#06b6d4' : '#8b5cf6'
                    }}
                  >
                    {/* Header with emoji and title */}
                    <div className="flex items-start gap-5 mb-6">
                      {post.emoji && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <span className="text-4xl">{post.emoji}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.dateCreated).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                            <UserIcon className="w-4 h-4" />
                            By Izzy
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                        {post.content}
                      </p>
                    </div>
                    
                    {/* Tags and Share */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-100">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium hover:from-purple-200 hover:to-pink-200 transition-all"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Share Button */}
                        <button
                          onClick={() => handleShare('blog', post.title, post.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Share</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                <div className="bg-gradient-to-br from-green-100 to-teal-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PenTool className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Blog Posts Yet!</h3>
                <p className="text-gray-500 text-lg">Check back soon for book reviews and reading adventures! 📝</p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Section */}
        {activeTab === 'wishlist' && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-3">
              <span className="text-5xl">🎁</span>
              Books I Want to Read
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Help support my reading journey! These are books I'd love to read. Click any link below to find and purchase. 📚
            </p>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((book) => {
                  const links = getPurchaseLinks(book)
                  return (
                    <div
                      key={book.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Book Cover */}
                      <div className="relative overflow-hidden aspect-[2/3]">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget
                              target.style.display = 'none'
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex'
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex flex-col items-center justify-center p-4 ${book.coverUrl ? 'hidden' : 'flex'}`}
                        >
                          <Gift className="w-16 h-16 text-white mb-3 opacity-80" />
                          <p className="text-white text-center font-bold text-sm line-clamp-3 drop-shadow-md">
                            {book.title}
                          </p>
                        </div>
                      </div>
                      
                      {/* Book Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-1">{book.author}</p>
                        
                        {/* Purchase Links */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Buy from:</p>
                          
                          <a
                            href={links.bookshop}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all group"
                          >
                            <span className="text-sm font-medium text-blue-700">Bookshop.org</span>
                            <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </a>
                          
                          <a
                            href={links.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 rounded-lg transition-all group"
                          >
                            <span className="text-sm font-medium text-orange-700">Amazon</span>
                            <ExternalLink className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                          </a>
                          
                          <a
                            href={links.worldOfBooks}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all group"
                          >
                            <span className="text-sm font-medium text-green-700">World of Books (UK)</span>
                            <ExternalLink className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                        
                        {/* Genre badge */}
                        {book.genre && (
                          <div className="mt-3">
                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              {book.genre}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-16 h-16 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Wishlist is Empty!</h3>
                <p className="text-gray-500 text-lg">Check back soon for books Izzy wants to read! 📚</p>
              </div>
            )}
          </div>
        )}

        {/* About Me Section */}
        {activeTab === 'about' && (
          <AboutMe aboutData={aboutData} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">✨ Keep Reading, Keep Dreaming ✨</p>
          <p className="text-white/80 text-sm">© 2025 Izzy's Reading Corner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicPortfolio
