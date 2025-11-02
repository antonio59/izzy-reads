import { useState } from 'react'
import { BookOpen, Feather, PenTool, Heart, Star, Calendar, User as UserIcon, LogIn } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import { Link } from 'react-router-dom'

const PublicPortfolio = () => {
  const { books, poems, blogPosts } = useBooks()
  const [activeTab, setActiveTab] = useState<'books' | 'poems' | 'blog'>('books')

  const readBooks = books.filter(book => book.isRead)
  const publishedPosts = blogPosts.filter(post => post.status === 'published')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/50">
                <span className="text-6xl">📚</span>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
              Izzy's Reading Corner
            </h1>
            <p className="text-2xl mb-8 text-white/90">
              Young Author • Book Lover • Poet
            </p>
            <div className="flex gap-4 justify-center text-lg">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                📖 {readBooks.length} Books Read
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                ✍️ {poems.length} Poems Written
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                📝 {publishedPosts.length} Blog Posts
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">✨</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
      </header>

      {/* Admin Login Button */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            <span className="font-semibold">Login</span>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'books'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            My Books
          </button>
          <button
            onClick={() => setActiveTab('poems')}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'poems'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-xl transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <Feather className="w-6 h-6" />
            My Poems
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-xl transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <PenTool className="w-6 h-6" />
            My Blog
          </button>
        </div>

        {/* Books Section */}
        {activeTab === 'books' && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              📚 Books I've Read
            </h2>
            {readBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {readBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all hover:shadow-2xl"
                  >
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-72 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-book-cover.svg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-72 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-purple-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      {book.rating && (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < book.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {book.notes && (
                        <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                          "{book.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl">No books to display yet!</p>
              </div>
            )}
          </div>
        )}

        {/* Poems Section */}
        {activeTab === 'poems' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              ✍️ My Poetry Collection
            </h2>
            {poems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poems.map((poem, index) => {
                  const gradients = [
                    'from-pink-100 to-purple-100',
                    'from-blue-100 to-cyan-100',
                    'from-yellow-100 to-orange-100',
                    'from-green-100 to-emerald-100',
                    'from-purple-100 to-pink-100',
                    'from-indigo-100 to-blue-100',
                  ]
                  return (
                    <div
                      key={poem.id}
                      className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105`}
                    >
                      <div className="bg-white/80 backdrop-blur rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-4xl">{poem.emoji || '✨'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(poem.dateCreated).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{poem.title}</h3>
                        <p className="text-gray-700 font-serif whitespace-pre-wrap leading-relaxed text-sm">
                          {poem.content}
                        </p>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                          <span className="text-sm text-gray-600">{poem.likes} likes</span>
                          {poem.template && (
                            <span className="ml-auto text-xs bg-white/50 px-2 py-1 rounded-full text-gray-600">
                              {poem.template}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Feather className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl">No poems to display yet!</p>
              </div>
            )}
          </div>
        )}

        {/* Blog Section */}
        {activeTab === 'blog' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              📝 My Reading Blog
            </h2>
            {publishedPosts.length > 0 ? (
              <div className="space-y-6">
                {publishedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {post.emoji && <span className="text-4xl">{post.emoji}</span>}
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.dateCreated).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            Izzy
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <PenTool className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl">No blog posts to display yet!</p>
              </div>
            )}
          </div>
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
