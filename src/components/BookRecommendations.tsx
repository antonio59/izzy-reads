import { Sparkles, Heart } from 'lucide-react'
import type { Book } from '../types'

interface BookRecommendationsProps {
  books: Book[]
}

const BookRecommendations = ({ books }: BookRecommendationsProps) => {
  const recommendedBooks = books.filter(book => book.isRead && book.rating && book.rating >= 4).slice(0, 6)

  if (recommendedBooks.length === 0) {
    return null
  }

  return (
    <div className="mb-10 relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 rounded-[2rem] blur-lg opacity-40"></div>
      
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-[2rem] p-8 shadow-xl border-4 border-amber-200/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="absolute top-3 right-6 text-3xl animate-bounce">⭐</div>
        <div className="absolute bottom-3 left-6 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💖</div>

        <div className="relative flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-full flex items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-white animate-star-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-fun bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent flex items-center gap-2">
              Izzy's Picks
              <span className="text-2xl animate-wiggle">🌟</span>
            </h2>
            <p className="text-amber-700 font-medium">Books I absolutely LOVED! You should read these!</p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {recommendedBooks.map((book, index) => (
            <div
              key={book.id}
              className="group relative"
              style={{ animation: `slide-up 0.5s ease-out ${index * 0.1}s both` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
              
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:-rotate-2 border-3 border-transparent group-hover:border-pink-300">
                <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 animate-pulse">
                  <Heart className="w-4 h-4 fill-white" />
                  {book.rating}
                </div>

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
                    className={`w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 flex flex-col items-center justify-center p-3 ${book.coverUrl ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-6xl mb-2 animate-bounce">📖</span>
                    <p className="text-white text-center font-bold text-sm line-clamp-3 drop-shadow-lg">
                      {book.title}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-b from-white to-amber-50/50">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-pink-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1 font-medium">{book.author}</p>
                  {book.notes && (
                    <p className="text-xs text-amber-700 italic line-clamp-2 mt-2 border-t border-amber-100 pt-2 bg-amber-50 -mx-4 px-4 -mb-4 pb-4 rounded-b-2xl">
                      "{book.notes}"
                    </p>
                  )}
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-4xl animate-pop">💖</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookRecommendations
