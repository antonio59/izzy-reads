import { useState } from 'react'
import { Share2, ExternalLink } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import AboutMe from './AboutMe'
import ReadingStats from './ReadingStats'
import BookRecommendations from './BookRecommendations'
import FloatingDecorations from './FloatingDecorations'

const PublicPortfolio = () => {
  const { books, poems, blogPosts, wishlist, updatePoem } = useBooks()
  const [activeTab, setActiveTab] = useState<'books' | 'poems' | 'blog' | 'wishlist' | 'about'>('books')

  const readBooks = books.filter(book => book.isRead)
  const publishedPosts = blogPosts.filter(post => post.status === 'published')
  
  const aboutData = {
    isPublished: true,
    bio: "Hi! I'm Izzy, and I absolutely LOVE reading! Books take me on amazing adventures to magical worlds, help me meet incredible characters, and teach me new things every day. Reading is my superpower!",
    favoriteGenres: ['Fantasy', 'Adventure', 'Mystery', 'Realistic Fiction'],
    favoriteAuthors: ['J.K. Rowling', 'R.J. Palacio', 'Roald Dahl', 'Rick Riordan'],
    whyIRead: "I read because every book is a new adventure! Reading helps me imagine amazing worlds, understand different people, and learn about things I've never experienced. Plus, it's really fun!",
    funFacts: [
      'I can finish a 300-page book in one weekend!',
      'My favorite reading spot is curled up on the couch with my dog',
      "I've read the entire Harry Potter series 3 times",
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
  
  const handleLikePoem = (poemId: string) => {
    const poem = poems.find(p => p.id === poemId)
    if (poem) {
      updatePoem(poemId, { likes: (poem.likes || 0) + 1 })
    }
  }

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

  const handleShare = async (type: 'poem' | 'blog', title: string, id: string) => {
    const url = `${window.location.origin}/#${type}-${id}`
    const text = type === 'poem' 
      ? `Check out this poem by Izzy: "${title}"`
      : `Read Izzy's blog post: "${title}"`
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
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

  const tabs = [
    { id: 'books' as const, label: 'My Books', emoji: '📚', count: readBooks.length, gradient: 'from-blue-400 via-purple-500 to-pink-500', bg: 'bg-blue-100', text: 'text-blue-700' },
    { id: 'poems' as const, label: 'My Poems', emoji: '✨', count: poems.length, gradient: 'from-pink-400 via-rose-500 to-orange-500', bg: 'bg-pink-100', text: 'text-pink-700' },
    { id: 'blog' as const, label: 'My Blog', emoji: '📝', count: publishedPosts.length, gradient: 'from-emerald-400 via-teal-500 to-cyan-500', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { id: 'wishlist' as const, label: 'Wishlist', emoji: '🎁', count: wishlist.length, gradient: 'from-amber-400 via-orange-500 to-red-500', bg: 'bg-amber-100', text: 'text-amber-700' },
    { id: 'about' as const, label: 'About Me', emoji: '💜', count: null, gradient: 'from-violet-400 via-purple-500 to-fuchsia-500', bg: 'bg-violet-100', text: 'text-violet-700' },
  ]

  return (
    <div className="min-h-screen relative font-fun bg-gradient-to-br from-fuchsia-100 via-pink-50 to-cyan-100">
      <FloatingDecorations />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b-4 border-pink-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-md opacity-60 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <span className="text-3xl animate-bounce">📚</span>
              </div>
              <div className="absolute -top-1 -right-1 text-xl animate-star-spin">✨</div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold magical-text font-fun tracking-wide">
                Izzy's Magical Reading Corner
              </h1>
              <p className="text-purple-600 font-medium flex items-center justify-center gap-2 mt-1">
                <span className="animate-wiggle">🌟</span>
                Young Author & Book Lover
                <span className="animate-wiggle" style={{ animationDelay: '0.5s' }}>🌟</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl transform scale-110 -rotate-1`
                    : 'bg-white/90 text-gray-700 hover:bg-white shadow-md hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-pink-200'
                }`}
              >
                {activeTab === tab.id && (
                  <>
                    <span className="absolute -top-2 -left-2 text-lg animate-bounce">✨</span>
                    <span className="absolute -bottom-2 -right-2 text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>💫</span>
                  </>
                )}
                <span className={`text-xl ${activeTab === tab.id ? 'animate-wiggle' : ''}`}>{tab.emoji}</span>
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`ml-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id 
                      ? 'bg-white/30 text-white' 
                      : `${tab.bg} ${tab.text}`
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 relative z-10">
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

        <BookRecommendations books={books} />

        {activeTab === 'books' && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center flex items-center justify-center gap-4 font-fun">
              <span className="text-5xl animate-bounce">📚</span>
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Books I've Read
              </span>
              <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>📖</span>
            </h2>
            {readBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {readBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="group relative"
                    style={{ animation: `slide-up 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-3xl opacity-0 group-hover:opacity-70 blur transition-all duration-300"></div>
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-rotate-2 border-4 border-transparent hover:border-pink-200">
                      <div className="relative overflow-hidden aspect-[2/3]">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                          className={`w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex flex-col items-center justify-center p-4 ${book.coverUrl ? 'hidden' : 'flex'}`}
                        >
                          <span className="text-6xl mb-3 animate-bounce">📖</span>
                          <p className="text-white text-center font-bold text-sm line-clamp-3 drop-shadow-lg">
                            {book.title}
                          </p>
                        </div>
                        {book.rating && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 animate-pulse">
                            <span>⭐</span>
                            {book.rating}/5
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 bg-gradient-to-b from-white to-pink-50/50">
                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm leading-tight group-hover:text-purple-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1 font-medium">{book.author}</p>
                        
                        {book.rating && (
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < book.rating! ? '' : 'grayscale opacity-30'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {book.notes && (
                          <p className="text-xs text-purple-600 mt-2 italic line-clamp-3 border-t border-pink-100 pt-2 bg-pink-50 -mx-4 px-4 -mb-4 pb-4 rounded-b-2xl">
                            "{book.notes}"
                          </p>
                        )}
                        
                        {book.genre && (
                          <div className="mt-2">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-bold">
                              {book.genre}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-5xl animate-pop">💖</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border-4 border-pink-200">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-6xl">📚</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 font-fun">No Books Yet!</h3>
                <p className="text-gray-600 text-lg">Check back soon for book reviews! ✨📚✨</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'poems' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center flex items-center justify-center gap-4 font-fun">
              <span className="text-5xl animate-wiggle">✍️</span>
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                My Poetry Collection
              </span>
              <span className="text-5xl animate-wiggle" style={{ animationDelay: '0.3s' }}>🦋</span>
            </h2>
            {poems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {poems.map((poem, index) => {
                  const gradients = [
                    'from-pink-400 via-rose-500 to-red-500',
                    'from-blue-400 via-indigo-500 to-purple-500',
                    'from-amber-400 via-orange-500 to-red-500',
                    'from-emerald-400 via-teal-500 to-cyan-500',
                    'from-purple-400 via-fuchsia-500 to-pink-500',
                    'from-cyan-400 via-blue-500 to-indigo-500',
                  ]
                  return (
                    <div
                      key={poem.id}
                      className="group relative"
                      style={{ animation: `slide-up 0.5s ease-out ${index * 0.1}s both` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-[2rem] blur-md opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                      
                      <div className="relative bg-white/95 backdrop-blur rounded-[2rem] shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:-rotate-1 duration-300 overflow-hidden border-4 border-white">
                        <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-6 text-white relative overflow-hidden`}>
                          <div className="absolute top-2 right-2 text-2xl animate-star-spin opacity-50">✨</div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-5xl drop-shadow-lg animate-float">{poem.emoji || '🦋'}</span>
                            <span className="text-xs bg-white/30 backdrop-blur px-4 py-1.5 rounded-full font-bold">
                              {new Date(poem.dateCreated).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold drop-shadow-lg font-fun">{poem.title}</h3>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-b from-white to-pink-50/30">
                          <p className="text-gray-700 font-comic whitespace-pre-wrap leading-relaxed text-base min-h-[120px]">
                            {poem.content}
                          </p>
                          
                          <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-pink-100">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleLikePoem(poem.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 rounded-full transition-all group/btn hover:scale-110"
                              >
                                <span className="text-xl group-hover/btn:animate-heart-beat">💖</span>
                                <span className="text-sm font-bold text-pink-700">{poem.likes}</span>
                              </button>
                              <button
                                onClick={() => handleShare('poem', poem.title, poem.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-full transition-all hover:scale-110"
                              >
                                <Share2 className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-bold text-blue-700">Share</span>
                              </button>
                            </div>
                            {poem.template && (
                              <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full font-bold">
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
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border-4 border-pink-200">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-200 via-purple-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-6xl">✍️</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-3 font-fun">No Poems Yet!</h3>
                <p className="text-gray-600 text-lg">Check back soon for beautiful poetry! 🦋✨🌸</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center flex items-center justify-center gap-4 font-fun">
              <span className="text-5xl animate-bounce">📝</span>
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                My Reading Blog
              </span>
              <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>💭</span>
            </h2>
            {publishedPosts.length > 0 ? (
              <div className="space-y-8">
                {publishedPosts.map((post, index) => {
                  const colors = ['from-emerald-400 to-teal-500', 'from-blue-400 to-indigo-500', 'from-purple-400 to-pink-500']
                  return (
                    <article
                      key={post.id}
                      className="group relative"
                      style={{ animation: `slide-up 0.5s ease-out ${index * 0.1}s both` }}
                    >
                      <div className={`absolute -inset-1 bg-gradient-to-r ${colors[index % colors.length]} rounded-[2rem] blur-md opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                      
                      <div className="relative bg-white/95 backdrop-blur rounded-[2rem] shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-4 border-white overflow-hidden">
                        <div className="absolute top-4 right-4 text-3xl animate-float opacity-50">✨</div>
                        
                        <div className="flex items-start gap-5 mb-6">
                          {post.emoji && (
                            <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${colors[index % colors.length]} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                              <span className="text-4xl">{post.emoji}</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors font-fun">
                              {post.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full font-bold text-gray-700">
                                <span>📅</span>
                                {new Date(post.dateCreated).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-full font-bold">
                                <span>✍️</span>
                                By Izzy
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="prose prose-lg max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg font-comic">
                            {post.content}
                          </p>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t-2 border-teal-100">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 text-purple-700 rounded-full text-sm font-bold hover:from-purple-200 hover:via-pink-200 hover:to-rose-200 transition-all hover:scale-105"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <button
                              onClick={() => handleShare('blog', post.title, post.id)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-full transition-all hover:scale-110"
                            >
                              <Share2 className="w-5 h-5 text-blue-600" />
                              <span className="font-bold text-blue-700">Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border-4 border-teal-200">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-6xl">📝</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 font-fun">No Blog Posts Yet!</h3>
                <p className="text-gray-600 text-lg">Check back soon for reading thoughts! 💭✨📖</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center flex items-center justify-center gap-4 font-fun">
              <span className="text-5xl animate-wiggle">🎁</span>
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Books I'd Love to Read!
              </span>
              <span className="text-5xl animate-wiggle" style={{ animationDelay: '0.3s' }}>📚</span>
            </h2>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((book, index) => {
                  const links = getPurchaseLinks(book)
                  return (
                    <div
                      key={book.id}
                      className="group relative"
                      style={{ animation: `slide-up 0.5s ease-out ${index * 0.1}s both` }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-3xl opacity-30 group-hover:opacity-70 blur transition-opacity"></div>
                      
                      <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-rotate-1 border-4 border-white">
                        <div className="relative overflow-hidden h-52">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                            className={`w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex flex-col items-center justify-center p-4 ${book.coverUrl ? 'hidden' : 'flex'}`}
                          >
                            <span className="text-6xl mb-3 animate-bounce">🎁</span>
                            <p className="text-white text-center font-bold text-lg drop-shadow-lg line-clamp-2">
                              {book.title}
                            </p>
                          </div>
                          
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                            <span>🌟</span> Want to Read!
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-b from-white to-amber-50/50">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors font-fun">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 mb-3 font-medium">{book.author}</p>
                          
                          {book.notes && (
                            <p className="text-orange-600 text-sm italic mb-4 bg-orange-50 p-3 rounded-xl">
                              💭 "{book.notes}"
                            </p>
                          )}

                          <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-700 mb-2">🛒 Buy it for me:</p>
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={links.amazon}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-800 rounded-full text-sm font-bold transition-all hover:scale-105"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Amazon
                              </a>
                              <a
                                href={links.bookshop}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 text-emerald-800 rounded-full text-sm font-bold transition-all hover:scale-105"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Bookshop
                              </a>
                              <a
                                href={links.worldOfBooks}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-800 rounded-full text-sm font-bold transition-all hover:scale-105"
                              >
                                <ExternalLink className="w-4 h-4" />
                                World of Books
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border-4 border-orange-200">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-200 via-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-6xl">🎁</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 font-fun">Wishlist Empty!</h3>
                <p className="text-gray-600 text-lg">Check back soon for book wishes! 🎁✨📚</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <AboutMe aboutData={aboutData} />
        )}
      </div>

      <footer className="relative z-10 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-t-4 border-pink-200/50 py-8 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium flex items-center justify-center gap-2 text-lg">
            <span className="animate-wiggle">📚</span>
            Made with 
            <span className="animate-heart-beat text-xl">💖</span>
            by Izzy
            <span className="animate-wiggle" style={{ animationDelay: '0.3s' }}>✨</span>
          </p>
          <p className="text-purple-500 mt-2 font-fun">Keep reading, keep dreaming!</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicPortfolio
