import { Book, BookOpen, Calendar, Star, Flame, Award } from 'lucide-react'

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
      icon: Book,
      value: stats.totalBooks,
      label: 'Books',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: BookOpen,
      value: stats.totalPages.toLocaleString(),
      label: 'Pages',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Calendar,
      value: stats.booksThisYear,
      label: 'This Year',
      color: 'text-sage-600',
      bgColor: 'bg-sage-50',
    },
    {
      icon: Star,
      value: stats.averageRating.toFixed(1),
      label: 'Avg Rating',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Award,
      value: stats.favoriteGenre,
      label: 'Top Genre',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      isText: true,
    },
    {
      icon: Flame,
      value: stats.readingStreak,
      label: 'Streak',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-3 text-center hover:scale-105 transition-transform border border-stone-100`}
          >
            <Icon className={`w-4 h-4 ${card.color} mx-auto mb-1`} />
            <div className={`text-lg font-bold ${card.color} ${card.isText ? 'text-xs' : ''}`}>
              {card.value}
            </div>
            <div className="text-[10px] text-stone-500 font-medium">
              {card.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ReadingStats
