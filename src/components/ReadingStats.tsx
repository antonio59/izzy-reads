import { BookOpen, TrendingUp, Star, Calendar, Award, Zap } from 'lucide-react'

interface ReadingStatsProps {
  stats: {
    totalBooks: number
    totalPages: number
    booksThisYear: number
    booksThisMonth: number
    averageRating: number
    favoriteGenre: string
    readingStreak: number
  }
}

const ReadingStats: React.FC<ReadingStatsProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <TrendingUp className="w-8 h-8" />
        Reading Stats
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Books */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalBooks}</div>
            <div className="text-sm opacity-90">Total Books</div>
          </div>
        </div>

        {/* Total Pages */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all">
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.totalPages.toLocaleString()}</div>
            <div className="text-sm opacity-90">Pages Read</div>
          </div>
        </div>

        {/* This Year */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all">
          <div className="flex flex-col items-center text-center">
            <Calendar className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.booksThisYear}</div>
            <div className="text-sm opacity-90">This Year</div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all">
          <div className="flex flex-col items-center text-center">
            <Zap className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.booksThisMonth}</div>
            <div className="text-sm opacity-90">This Month</div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all">
          <div className="flex flex-col items-center text-center">
            <Star className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold mb-1">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm opacity-90">Avg Rating</div>
          </div>
        </div>

        {/* Favorite Genre */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all">
          <div className="flex flex-col items-center text-center">
            <Award className="w-8 h-8 mb-2" />
            <div className="text-xl font-bold mb-1">{stats.favoriteGenre}</div>
            <div className="text-sm opacity-90">Fav Genre</div>
          </div>
        </div>

        {/* Reading Streak */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 hover:bg-white/30 transition-all col-span-2 md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl mb-2">🔥</span>
            <div className="text-3xl font-bold mb-1">{stats.readingStreak}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadingStats
