import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Target, Star, TrendingUp, Heart, PenTool } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import { useUser } from '../contexts/UserContext'
import { getWeeklyQuote } from '../utils/readingQuotes'

const Dashboard: React.FC = () => {
  const { books, wishlist, readingChallenges, readingStats } = useBooks()
  const { user } = useUser()

  const recentBooks = books
    .filter(book => book.isRead)
    .sort((a, b) => new Date(b.dateRead || '').getTime() - new Date(a.dateRead || '').getTime())
    .slice(0, 3)

  const currentChallenge = readingChallenges[0]
  const progressPercentage = currentChallenge ? (currentChallenge.current / currentChallenge.target) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">
          Welcome back, {user?.name}! 📚
        </h1>
        <p className="text-lg text-gray-600">
          Ready for another reading adventure?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books Read</p>
              <p className="text-3xl font-bold text-purple-600">{readingStats.totalBooks}</p>
            </div>
            <BookOpen className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pages Read</p>
              <p className="text-3xl font-bold text-blue-600">{readingStats.totalPages}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wishlist</p>
              <p className="text-3xl font-bold text-pink-600">{wishlist.length}</p>
            </div>
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-green-600">
                {readingStats.averageRating.toFixed(1)}
              </p>
            </div>
            <Star className="h-12 w-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Reading Challenge */}
      {currentChallenge && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Target className="h-6 w-6 mr-2 text-orange-500" />
              Current Challenge
            </h2>
            <span className="text-2xl">{currentChallenge.badge}</span>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{currentChallenge.title}</h3>
            <p className="text-gray-600">{currentChallenge.description}</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{currentChallenge.current} / {currentChallenge.target} books</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {progressPercentage >= 100 ? (
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-bold">🎉 Challenge Complete! Amazing job! 🎉</p>
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              Keep going! You're doing great! 💪
            </p>
          )}
        </div>
      )}

      {/* Recent Books & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Reads</h2>
            <Link 
              to="/bookshelf"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              View All →
            </Link>
          </div>

          {recentBooks.length > 0 ? (
            <div className="space-y-3">
              {recentBooks.map((book) => (
                <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (book.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No books read yet!</p>
              <p className="text-gray-400 text-sm">Start your reading journey today!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link
              to="/bookshelf"
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Add a Book</h3>
                <p className="text-sm text-blue-600">Log a book you've read</p>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-pink-800">Update Wishlist</h3>
                <p className="text-sm text-pink-600">Add books you want to read</p>
              </div>
            </Link>

            <Link
              to="/blog"
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Write a Review</h3>
                <p className="text-sm text-green-600">Share your thoughts about a book</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Weekly Reading Quote */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">{getWeeklyQuote().emoji} Weekly Reading Quote</h3>
        <p className="text-lg italic">
          "{getWeeklyQuote().text}"
        </p>
        <p className="text-sm mt-2 opacity-90">- {getWeeklyQuote().author}</p>
        <p className="text-xs mt-2 opacity-75">✨ Updates every Sunday</p>
      </div>
    </div>
  )
}

export default Dashboard 