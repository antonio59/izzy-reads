import React, { useState } from 'react'
import { Shield, Eye, CheckCircle, XCircle, Settings, BarChart3, BookOpen, PenTool, Clock, AlertTriangle } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import { useUser } from '../contexts/UserContext'
import type { UserSettings } from '../types'

const ParentDashboard: React.FC = () => {
  const { books, blogPosts, readingStats, updateBlogPost } = useBooks()
  const { user, updateUserSettings } = useUser()
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'settings'>('overview')

  const pendingPosts = blogPosts.filter(post => post.status === 'pending')
  const recentActivity = [
    ...books.slice(-5).map(book => ({
      type: 'book',
      title: `Added "${book.title}" to bookshelf`,
      date: book.dateAdded,
      icon: BookOpen
    })),
    ...blogPosts.slice(-3).map(post => ({
      type: 'post',
      title: `Wrote blog post: "${post.title}"`,
      date: post.dateCreated,
      icon: PenTool
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

  const handleApprovePost = (postId: string) => {
    updateBlogPost(postId, {
      status: 'published',
      parentApproved: true
    })
  }

  const handleRejectPost = (postId: string) => {
    updateBlogPost(postId, {
      status: 'draft',
      parentApproved: false
    })
  }

  const handleSettingsUpdate = (newSettings: Partial<UserSettings>) => {
    updateUserSettings(newSettings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            Parent Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage {user?.name}'s reading journey</p>
        </div>
        
        {pendingPosts.length > 0 && (
          <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{pendingPosts.length} posts need approval</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'posts', label: 'Content Review', icon: Eye },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'posts' | 'settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Books Read</p>
                  <p className="text-3xl font-bold text-blue-600">{readingStats.totalBooks}</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                  <p className="text-3xl font-bold text-green-600">{blogPosts.length}</p>
                </div>
                <PenTool className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingPosts.length}</p>
                </div>
                <Clock className="h-12 w-12 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {readingStats.averageRating.toFixed(1)}
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'book' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.type === 'book' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reading Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">This Month</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Books Read</span>
                    <span className="font-medium">{readingStats.booksThisMonth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pages Read</span>
                    <span className="font-medium">{readingStats.totalPages}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Favorite Genre</h3>
                <p className="text-lg font-medium text-purple-600">{readingStats.favoriteGenre || 'Not enough data'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Review Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Posts Pending Approval</h2>
            
            {pendingPosts.length > 0 ? (
              <div className="space-y-4">
                {pendingPosts.map((post) => {
                  const relatedBook = post.bookId ? books.find(book => book.id === post.bookId) : null
                  return (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 flex items-center">
                            <span className="mr-2">{post.emoji}</span>
                            {post.title}
                          </h3>
                          {relatedBook && (
                            <p className="text-sm text-gray-600 mt-1">
                              About: {relatedBook.title} by {relatedBook.author}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(post.dateCreated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprovePost(post.id)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectPost(post.id)}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Send Back for Revision</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">All caught up!</h3>
                <p className="text-gray-500">No posts waiting for approval.</p>
              </div>
            )}
          </div>

          {/* All Posts History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Blog Posts</h2>
            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{post.emoji}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{post.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(post.dateCreated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.status === 'published' && post.parentApproved ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Published
                      </span>
                    ) : post.status === 'pending' ? (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Parental Controls</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Require Approval for Blog Posts</h3>
                  <p className="text-sm text-gray-600">All blog posts must be approved before publishing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user?.settings.parentalControls?.requireApproval}
                    onChange={(e) => handleSettingsUpdate({
                      parentalControls: {
                        requireApproval: true,
                        contentFilter: true,
                        allowedGenres: ['Fiction', 'Fantasy', 'Adventure', 'Mystery', 'Science Fiction'],
                        ...user?.settings.parentalControls,
                        requireApproval: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Content Filter</h3>
                  <p className="text-sm text-gray-600">Filter age-inappropriate content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user?.settings.parentalControls?.contentFilter}
                    onChange={(e) => handleSettingsUpdate({
                      parentalControls: {
                        requireApproval: true,
                        contentFilter: true,
                        allowedGenres: ['Fiction', 'Fantasy', 'Adventure', 'Mystery', 'Science Fiction'],
                        ...user?.settings.parentalControls,
                        contentFilter: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Reading Goal</h3>
                <p className="text-sm text-gray-600 mb-3">Set a monthly reading target</p>
                <input
                  type="number"
                  value={user?.settings.readingGoal}
                  onChange={(e) => handleSettingsUpdate({
                    readingGoal: parseInt(e.target.value) || 0
                  })}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
                <span className="ml-2 text-sm text-gray-600">books per month</span>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Allowed Genres</h3>
                <p className="text-sm text-gray-600 mb-3">Select which genres are appropriate</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Fiction', 'Fantasy', 'Adventure', 'Mystery', 'Science Fiction', 'Non-Fiction'].map((genre) => (
                    <label key={genre} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={user?.settings.parentalControls?.allowedGenres.includes(genre)}
                        onChange={(e) => {
                          const currentGenres = user?.settings.parentalControls?.allowedGenres || []
                          const newGenres = e.target.checked
                            ? [...currentGenres, genre]
                            : currentGenres.filter(g => g !== genre)
                          handleSettingsUpdate({
                            parentalControls: {
                              requireApproval: true,
                              contentFilter: true,
                              allowedGenres: ['Fiction', 'Fantasy', 'Adventure', 'Mystery', 'Science Fiction'],
                              ...user?.settings.parentalControls,
                              allowedGenres: newGenres
                            }
                          })
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Safety Information */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🛡️ Safety Features</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• All data is stored locally on your device</li>
              <li>• No external communication or social features</li>
              <li>• Content is private by default</li>
              <li>• Age-appropriate book recommendations only</li>
              <li>• Automatic inappropriate content detection</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParentDashboard 