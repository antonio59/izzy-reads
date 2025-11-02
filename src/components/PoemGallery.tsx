import { useState } from 'react'
import { Feather, Heart, Sparkles, Plus, Edit, Trash2 } from 'lucide-react'

export interface Poem {
  id: string
  title: string
  content: string
  emoji?: string
  dateCreated: string
  likes: number
  template?: string
}

interface PoemGalleryProps {
  poems: Poem[]
  onAddPoem: (poem: Poem) => void
  onEditPoem: (id: string, poem: Partial<Poem>) => void
  onDeletePoem: (id: string) => void
}

const POEM_TEMPLATES = [
  {
    name: 'Haiku',
    description: '5-7-5 syllable pattern',
    emoji: '🌸',
    template: '_____ (5 syllables)\n_______ (7 syllables)\n_____ (5 syllables)'
  },
  {
    name: 'Acrostic',
    description: 'First letter of each line spells a word',
    emoji: '🔤',
    template: 'Choose a word and make each line start with those letters!'
  },
  {
    name: 'Free Verse',
    description: 'No rules, just your creativity!',
    emoji: '✨',
    template: 'Write whatever comes to your heart...'
  },
  {
    name: 'Rhyming Couplets',
    description: 'Two lines that rhyme',
    emoji: '🎵',
    template: 'Line 1 (rhymes with line 2)\nLine 2 (rhymes with line 1)'
  }
]

const BACKGROUND_PATTERNS = [
  'bg-gradient-to-br from-pink-100 to-purple-100',
  'bg-gradient-to-br from-blue-100 to-cyan-100',
  'bg-gradient-to-br from-yellow-100 to-orange-100',
  'bg-gradient-to-br from-green-100 to-emerald-100',
  'bg-gradient-to-br from-purple-100 to-pink-100',
  'bg-gradient-to-br from-indigo-100 to-blue-100',
]

const PoemGallery: React.FC<PoemGalleryProps> = ({ poems, onAddPoem, onEditPoem, onDeletePoem }) => {
  const [showEditor, setShowEditor] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null)
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)
  
  // Editor state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('✨')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const EMOJIS = ['✨', '🌟', '💫', '🌸', '🌺', '🌻', '🌹', '🦋', '🐝', '🌈', '☀️', '🌙', '⭐', '💖', '💕']

  const handleStartNew = () => {
    setEditingPoem(null)
    setTitle('')
    setContent('')
    setEmoji('✨')
    setSelectedTemplate('')
    setShowTemplates(true)
  }

  const handleSelectTemplate = (template: typeof POEM_TEMPLATES[0]) => {
    setSelectedTemplate(template.name)
    setEmoji(template.emoji)
    setContent(template.template)
    setShowTemplates(false)
    setShowEditor(true)
  }

  const handleSavePoem = () => {
    if (!title.trim() || !content.trim()) return

    if (editingPoem) {
      onEditPoem(editingPoem.id, { title, content, emoji })
    } else {
      const newPoem: Poem = {
        id: crypto.randomUUID(),
        title,
        content,
        emoji,
        dateCreated: new Date().toISOString(),
        likes: 0,
        template: selectedTemplate
      }
      onAddPoem(newPoem)
    }

    setShowEditor(false)
    setTitle('')
    setContent('')
    setEmoji('✨')
    setSelectedTemplate('')
  }

  const handleEdit = (poem: Poem) => {
    setEditingPoem(poem)
    setTitle(poem.title)
    setContent(poem.content)
    setEmoji(poem.emoji || '✨')
    setSelectedTemplate(poem.template || '')
    setShowEditor(true)
  }

  const handleLike = (poemId: string) => {
    const poem = poems.find(p => p.id === poemId)
    if (poem) {
      onEditPoem(poemId, { likes: poem.likes + 1 })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <Feather className="w-8 h-8" />
              My Poetry Corner
            </h2>
            <p className="text-white/90">Express yourself through the magic of words! ✨</p>
          </div>
          <button
            onClick={handleStartNew}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Poem
          </button>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose a Poetry Style</h3>
            <div className="grid grid-cols-2 gap-4">
              {POEM_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleSelectTemplate(template)}
                  className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all text-left border-2 border-transparent hover:border-purple-300"
                >
                  <div className="text-4xl mb-2">{template.emoji}</div>
                  <h4 className="font-bold text-lg text-gray-800">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Poem Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingPoem ? 'Edit Your Poem' : 'Write Your Poem'}
            </h3>

            {/* Emoji Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose an emoji:
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      emoji === e ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poem Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your poem a title..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Poem:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Let your creativity flow..."
                rows={10}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-serif"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSavePoem}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingPoem ? 'Save Changes' : 'Publish Poem'}
              </button>
              <button
                onClick={() => setShowEditor(false)}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Poems Grid */}
      {poems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem, index) => (
            <div
              key={poem.id}
              onClick={() => setSelectedPoem(poem)}
              className={`${BACKGROUND_PATTERNS[index % BACKGROUND_PATTERNS.length]} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-4xl">{poem.emoji || '✨'}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(poem)
                    }}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeletePoem(poem.id)
                    }}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">{poem.title}</h3>
              
              <div className="bg-white/50 rounded-lg p-4 mb-3">
                <p className="text-gray-700 font-serif text-sm whitespace-pre-wrap line-clamp-4">
                  {poem.content}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{new Date(poem.dateCreated).toLocaleDateString()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike(poem.id)
                  }}
                  className="flex items-center gap-1 hover:text-pink-500 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                  <span>{poem.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-12 text-center">
          <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No poems yet!</p>
          <p className="text-gray-400 text-sm">Start writing your first poem to share your creativity!</p>
        </div>
      )}

      {/* Poem Detail Modal */}
      {selectedPoem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPoem(null)}
        >
          <div
            className={`${BACKGROUND_PATTERNS[poems.indexOf(selectedPoem) % BACKGROUND_PATTERNS.length]} rounded-2xl shadow-2xl max-w-2xl w-full p-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/80 backdrop-blur rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-6xl">{selectedPoem.emoji || '✨'}</span>
                <button
                  onClick={() => setSelectedPoem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-4">{selectedPoem.title}</h3>
              
              <div className="bg-white rounded-lg p-6 mb-4">
                <p className="text-gray-700 font-serif text-lg whitespace-pre-wrap leading-relaxed">
                  {selectedPoem.content}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Written on {new Date(selectedPoem.dateCreated).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
                  <span className="text-lg font-bold text-gray-700">{selectedPoem.likes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PoemGallery
