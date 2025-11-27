
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

const ReadingStats = ({ stats }: ReadingStatsProps) => {
  const statCards = [
    {
      icon: <span className="text-4xl">📚</span>,
      value: stats.totalBooks,
      label: 'Total Books',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-100',
      delay: '0s'
    },
    {
      icon: <span className="text-4xl">📖</span>,
      value: stats.totalPages.toLocaleString(),
      label: 'Pages Read',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-100',
      delay: '0.1s'
    },
    {
      icon: <span className="text-4xl">🗓️</span>,
      value: stats.booksThisYear,
      label: 'This Year',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-100',
      delay: '0.2s'
    },
    {
      icon: <span className="text-4xl">⚡</span>,
      value: stats.booksThisMonth,
      label: 'This Month',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-100',
      delay: '0.3s'
    },
    {
      icon: <span className="text-4xl">⭐</span>,
      value: stats.averageRating.toFixed(1),
      label: 'Avg Rating',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      delay: '0.4s'
    },
    {
      icon: <span className="text-4xl">🏆</span>,
      value: stats.favoriteGenre,
      label: 'Fav Genre',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-100',
      delay: '0.5s'
    },
    {
      icon: <span className="text-4xl animate-pulse">🔥</span>,
      value: stats.readingStreak,
      label: 'Day Streak',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-100',
      delay: '0.6s',
      special: true
    },
  ]

  return (
    <div className="relative mb-10">
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-[2rem] blur-lg opacity-50 animate-pulse"></div>
      
      <div className="relative bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="absolute top-4 left-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute top-8 right-8 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>💫</div>
        <div className="absolute bottom-4 right-4 text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</div>

        <h2 className="relative text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3 text-white drop-shadow-lg">
          <span className="text-4xl animate-wiggle">📊</span>
          <span className="font-fun">Reading Stats</span>
          <span className="text-4xl animate-wiggle" style={{ animationDelay: '0.5s' }}>🎯</span>
        </h2>
        
        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`group relative bg-white/95 backdrop-blur-md rounded-2xl p-5 border-4 border-white/50 hover:border-white transition-all duration-300 hover:scale-110 hover:-rotate-2 cursor-pointer shadow-lg hover:shadow-2xl ${card.special ? 'col-span-2 md:col-span-1 animate-pulse-glow' : ''}`}
              style={{ 
                animationDelay: card.delay,
                animation: `slide-up 0.5s ease-out ${card.delay} both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
              
              <div className="relative flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${card.bgColor} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner`}>
                  {card.icon}
                </div>
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
                  {card.value}
                </div>
                <div className="text-gray-600 font-medium text-sm tracking-wide">
                  {card.label}
                </div>
              </div>

              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReadingStats
