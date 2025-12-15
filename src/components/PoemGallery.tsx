import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Feather, Heart, Sparkles, Plus, Edit, Trash2 } from 'lucide-react'
import PoetryEditor from './PoetryEditor'
import type { Poem } from '../types'

interface PoemGalleryProps {
  poems: Poem[]
  onAddPoem: (poem: Poem) => void
  onEditPoem: (id: string, poem: Partial<Poem>) => void
  onDeletePoem: (id: string) => void
}

const BACKGROUND_PATTERNS = [
  'bg-gradient-to-br from-accent-100 to-primary-100',
  'bg-gradient-to-br from-blue-100 to-cyan-100',
  'bg-gradient-to-br from-amber-100 to-orange-100',
  'bg-gradient-to-br from-green-100 to-emerald-100',
  'bg-gradient-to-br from-primary-100 to-accent-100',
  'bg-gradient-to-br from-indigo-100 to-blue-100',
]

const PoemGallery: React.FC<PoemGalleryProps> = ({ poems, onAddPoem, onEditPoem, onDeletePoem }) => {
  const [showEditor, setShowEditor] = useState(false)
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null)
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)

  const handleStartNew = () => {
    setEditingPoem(null)
    setShowEditor(true)
  }

  const handleEdit = (poem: Poem) => {
    setEditingPoem(poem)
    setShowEditor(true)
  }

  const handleSavePoem = (poemData: Omit<Poem, 'id' | 'dateCreated' | 'likes'>) => {
    if (editingPoem) {
      onEditPoem(editingPoem.id, poemData)
    } else {
      const newPoem: Poem = {
        id: crypto.randomUUID(),
        ...poemData,
        dateCreated: new Date().toISOString(),
        likes: 0,
      }
      onAddPoem(newPoem)
    }
    setShowEditor(false)
    setEditingPoem(null)
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
      <div className="bg-gradient-to-r from-primary-500 via-accent-500 to-amber-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-soft-lg">
        <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-4xl font-display font-bold flex items-center gap-3 mb-3">
              <Feather className="w-10 h-10" />
              My Poetry Corner
            </h2>
            <p className="text-white/90 text-lg">Express yourself through the magic of words! ✨</p>
          </div>
          <button
            onClick={handleStartNew}
            className="bg-white text-primary-600 px-6 py-3 rounded-2xl font-bold hover:bg-primary-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create Poem
          </button>
        </div>
      </div>

      {/* Poetry Editor */}
      <AnimatePresence>
        {showEditor && (
          <PoetryEditor
            poem={editingPoem}
            onSave={handleSavePoem}
            onClose={() => {
              setShowEditor(false)
              setEditingPoem(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Poems Grid */}
      {poems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem, index) => (
            <div
              key={poem.id}
              onClick={() => setSelectedPoem(poem)}
              className="bg-white rounded-3xl shadow-soft hover:shadow-soft-lg transition-all cursor-pointer group border border-gray-100 overflow-hidden"
            >
              {/* Card Header (or Image) */}
              <div className={`
                h-48 relative overflow-hidden flex items-center justify-center
                ${poem.imageUrl ? 'bg-gray-100' : BACKGROUND_PATTERNS[index % BACKGROUND_PATTERNS.length]}
              `}>
                {poem.imageUrl ? (
                  <img src={poem.imageUrl} alt={poem.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                    {poem.emoji || '✨'}
                  </span>
                )}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(poem)
                    }}
                    className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white text-primary-600 shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeletePoem(poem.id)
                    }}
                    className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white text-red-500 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{poem.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 font-serif italic">
                  {poem.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                    {new Date(poem.dateCreated).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(poem.id)
                    }}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-accent-500 transition-colors group/like"
                  >
                    <Heart className={`w-4 h-4 ${poem.likes > 0 ? 'fill-accent-500 text-accent-500' : 'group-hover/like:text-accent-500'}`} />
                    <span className="text-sm font-medium">{poem.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-primary-100">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Feather className="w-10 h-10 text-primary-400" />
          </div>
          <p className="text-gray-900 text-xl font-bold mb-2">No poems created yet</p>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start your collection by writing a new poem or uploading a picture of your handwritten work!</p>
          <button
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700"
          >
            Create your first poem <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Poem Detail Modal */}
      {selectedPoem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPoem(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Visual Side */}
            <div className={`
              md:w-1/2 min-h-[300px] md:min-h-full relative flex items-center justify-center
              ${selectedPoem.imageUrl ? 'bg-black' : BACKGROUND_PATTERNS[poems.indexOf(selectedPoem) % BACKGROUND_PATTERNS.length]}
            `}>
              {selectedPoem.imageUrl ? (
                <img src={selectedPoem.imageUrl} alt={selectedPoem.title} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-9xl filter drop-shadow-xl animate-float">{selectedPoem.emoji || '✨'}</span>
              )}
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">{selectedPoem.title}</h3>
                  <p className="text-gray-500 font-medium">
                    {new Date(selectedPoem.dateCreated).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPoem(null)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>

              <div className="flex-1">
                <p className="text-gray-800 font-serif text-xl leading-loose whitespace-pre-wrap">
                  {selectedPoem.content}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                    I
                  </div>
                  <span className="font-bold text-gray-900">Izzy</span>
                </div>
                <button
                  onClick={() => handleLike(selectedPoem.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors font-bold"
                >
                  <Heart className={`w-5 h-5 ${selectedPoem.likes > 0 ? 'fill-current' : ''}`} />
                  {selectedPoem.likes} Likes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PoemGallery
