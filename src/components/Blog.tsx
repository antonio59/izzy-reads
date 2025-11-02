import React, { useState } from 'react'
import { PenTool, Plus, BookOpen, Clock, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { useBooks } from '../contexts/BookContext'
import type { BlogPost } from '../types'

const Blog: React.FC = () => {
  const { blogPosts, books, addBlogPost, updateBlogPost, deleteBlogPost } = useBooks()
  const [showNewPost, setShowNewPost] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('free')
  
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    bookId: '',
    tags: [],
    emoji: '📚'
  })

  const templates = {
    free: {
      title: 'Free Writing',
      prompts: ['Write about anything you want!']
    },
    review: {
      title: 'Book Review',
      prompts: [
        'What was your favorite part?',
        'Who was your favorite character and why?',
        'What did you learn from this book?',
        'Would you recommend this book to a friend?',
        'Rate this book from 1-5 stars!'
      ]
    },
    character: {
      title: 'Character Analysis',
      prompts: [
        'Who was the main character?',
        'What did they look like?',
        'What was their personality like?',
        'How did they change throughout the story?',
        'What would you say to this character if you met them?'
      ]
    },
    adventure: {
      title: 'My Reading Adventure',
      prompts: [
        'Where did this book take you?',
        'What was the most exciting part?',
        'If you could jump into the story, what would you do?',
        'What questions do you still have about the story?'
      ]
    }
  }

  const emojis = ['📚', '✨', '🌟', '💫', '🎭', '🏰', '🦄', '🐉', '🌈', '💖', '🎪', '🚀']

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post: BlogPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        bookId: newPost.bookId,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        status: 'pending',
        parentApproved: false,
        tags: newPost.tags || [],
        emoji: newPost.emoji || '📚'
      }
      addBlogPost(post)
      setNewPost({
        title: '',
        content: '',
        bookId: '',
        tags: [],
        emoji: '📚'
      })
      setShowNewPost(false)
    }
  }

  const handleUpdatePost = () => {
    if (editingPost) {
      updateBlogPost(editingPost.id, {
        ...editingPost,
        dateModified: new Date().toISOString(),
        status: 'pending',
        parentApproved: false
      })
      setEditingPost(null)
    }
  }

  const getStatusIcon = (status: string, parentApproved: boolean) => {
    if (status === 'published' && parentApproved) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (status === 'pending') {
      return <Clock className="h-5 w-5 text-yellow-500" />
    } else {
      return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string, parentApproved: boolean) => {
    if (status === 'published' && parentApproved) {
      return 'Published ✨'
    } else if (status === 'pending') {
      return 'Waiting for parent approval 👀'
    } else {
      return 'Draft 📝'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-600 flex items-center">
            <PenTool className="h-8 w-8 mr-3" />
            My Reading Blog
          </h1>
          <p className="text-gray-600 mt-1">Share your thoughts about the books you love! ✍️</p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-green-600">{blogPosts.length}</p>
            </div>
            <PenTool className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-blue-600">
                {blogPosts.filter(post => post.status === 'published' && post.parentApproved).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {blogPosts.filter(post => post.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">
                {blogPosts.filter(post => post.status === 'draft').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      {blogPosts.length > 0 ? (
        <div className="space-y-4">
          {blogPosts
            .sort((a, b) => new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime())
            .map((post) => {
              const relatedBook = post.bookId ? books.find(book => book.id === post.bookId) : null
              return (
                <div key={post.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{post.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                        {relatedBook && (
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <BookOpen className="h-4 w-4 mr-1" />
                            About: {relatedBook.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(post.status, post.parentApproved)}
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-gray-700 line-clamp-3">{post.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{getStatusText(post.status, post.parentApproved)}</span>
                    <span>
                      {post.dateModified !== post.dateCreated ? 'Updated' : 'Created'}: {' '}
                      {new Date(post.dateModified).toLocaleDateString()}
                    </span>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      ) : (
        <div className="text-center py-12">
          <PenTool className="h-24 w-24 text-green-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No blog posts yet!</h3>
          <p className="text-gray-500 mb-4">Start writing about your reading adventures!</p>
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Write Your First Post
          </button>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Write a New Post</h2>
            
            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose a template:</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`p-3 text-left rounded-lg border transition-colors ${
                      selectedTemplate === key
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{template.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Emoji Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pick an emoji:</label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewPost({ ...newPost, emoji })}
                      className={`text-2xl p-2 rounded-lg transition-colors ${
                        newPost.emoji === emoji ? 'bg-green-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Give your post a fun title!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About a book? (optional)</label>
                <select
                  value={newPost.bookId}
                  onChange={(e) => setNewPost({ ...newPost, bookId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Not about a specific book</option>
                  {books.filter(book => book.isRead).map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your thoughts:</label>
                {selectedTemplate !== 'free' && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Writing prompts to help you:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {templates[selectedTemplate as keyof typeof templates].prompts.map((prompt, index) => (
                        <li key={index}>• {prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={8}
                  placeholder="Write your thoughts here! Remember to be kind and thoughtful."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreatePost}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Save Post
              </button>
              <button
                onClick={() => setShowNewPost(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={8}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdatePost}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Update Post
              </button>
              <button
                onClick={() => setEditingPost(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Writing Tips */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3">✍️ Writing Tips for Young Authors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📝 Be Descriptive</h4>
            <p className="text-sm opacity-90">Use words that help others picture what you're thinking!</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💭 Share Your Feelings</h4>
            <p className="text-sm opacity-90">Tell us how the book made you feel - happy, excited, curious?</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">❓ Ask Questions</h4>
            <p className="text-sm opacity-90">What would you ask the characters or the author?</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🌟 Be Kind</h4>
            <p className="text-sm opacity-90">Always write with kindness and respect for others!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog 