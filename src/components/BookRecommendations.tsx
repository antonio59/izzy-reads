import { Sparkles, Heart, ThumbsUp } from 'lucide-react'
import type { Book } from '../types'

interface BookRecommendationsProps {
  books: Book[]
}

const BookRecommendations = ({ books }: BookRecommendationsProps) => {
  // Filter to only highly-rated books (4+ stars) for recommendations
  const recommendedBooks = books.filter(book => book.isRead && book.rating && book.rating >= 4).slice(0, 6)

  if (recommendedBooks.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 rounded-3xl p-6 shadow-lg border-2 border-amber-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Izzy's Picks</h2>
            <p className="text-sm text-gray-600">Books I absolutely loved and recommend!</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recommendedBooks.map((book) => (
            <div
              key={book.id}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Recommended Badge */}
              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Heart className="w-3 h-3 fill-white" />
                {book.rating}★
              </div>

              {/* Book Cover */}
              <div className="relative overflow-hidden aspect-[2/3]">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                  className={`w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex flex-col items-center justify-center p-3 ${book.coverUrl ? 'hidden' : 'flex'}`}
                >
                  <ThumbsUp className="w-12 h-12 text-white mb-2 opacity-80" />
                  <p className="text-white text-center font-bold text-xs line-clamp-3 drop-shadow-md">
                    {book.title}
                  </p>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
                {book.notes && (
                  <p className="text-xs text-gray-500 italic line-clamp-2 mt-2 border-t border-gray-100 pt-2">
                    "{book.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookRecommendations
