import { motion } from 'framer-motion'
import { Lock, Check, Star } from 'lucide-react'
import type { Achievement, AchievementRarity } from '../lib/achievements'
import { Badge } from './ui/Badge'

interface AchievementCardProps {
  achievement: Achievement
  unlocked: boolean
  progress?: number // 0-100
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const rarityGradients: Record<AchievementRarity, string> = {
  common: 'from-gray-100 to-gray-200',
  rare: 'from-blue-100 to-iris-100',
  epic: 'from-iris-100 to-coral-100',
  legendary: 'from-amber-100 via-coral-100 to-iris-100',
}

const rarityBorders: Record<AchievementRarity, string> = {
  common: 'border-stone-300',
  rare: 'border-blue-300',
  epic: 'border-iris-400',
  legendary: 'border-amber-400',
}

const rarityGlow: Record<AchievementRarity, string> = {
  common: '',
  rare: 'shadow-blue-200/50',
  epic: 'shadow-iris-300/50',
  legendary: 'shadow-amber-300/50',
}

export function AchievementCard({
  achievement,
  unlocked,
  progress = 0,
  onClick,
  size = 'md',
  className = '',
}: AchievementCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-full text-left rounded-xl border-2 overflow-hidden
        transition-all duration-300
        ${sizeClasses[size]}
        ${unlocked
          ? `bg-gradient-to-br ${rarityGradients[achievement.rarity]} ${rarityBorders[achievement.rarity]} shadow-lg ${rarityGlow[achievement.rarity]}`
          : 'bg-stone-50 border-stone-200 opacity-70'
        }
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'}
        ${className}
      `}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute inset-0 bg-stone-100/50 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-stone-200 rounded-full p-2">
            <Lock className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          ${iconSizes[size]}
          ${unlocked ? '' : 'grayscale opacity-50'}
        `}>
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`
              font-display font-semibold truncate
              ${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'}
              ${unlocked ? 'text-stone-900' : 'text-stone-500'}
            `}>
              {achievement.name}
            </h4>
            {unlocked && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check className="w-4 h-4 text-sage-500" />
              </motion.div>
            )}
          </div>

          <p className={`
            text-stone-500 mt-0.5
            ${size === 'lg' ? 'text-sm' : 'text-xs'}
            ${!unlocked ? 'blur-[2px]' : ''}
          `}>
            {unlocked || !achievement.secret ? achievement.description : '???'}
          </p>

          {/* Progress bar for locked achievements */}
          {!unlocked && progress > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-iris-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {/* XP reward badge */}
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={unlocked ? 'iris' : 'default'}
              className="text-xs"
            >
              +{achievement.xpReward} XP
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {achievement.rarity}
            </Badge>
          </div>
        </div>
      </div>

      {/* Legendary shimmer effect */}
      {unlocked && achievement.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}
    </motion.button>
  )
}

// Compact achievement display for lists
interface AchievementChipProps {
  achievement: Achievement
  unlocked: boolean
  onClick?: () => void
  className?: string
}

export function AchievementChip({ achievement, unlocked, onClick, className = '' }: AchievementChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        border transition-all
        ${unlocked
          ? `bg-gradient-to-r ${rarityGradients[achievement.rarity]} ${rarityBorders[achievement.rarity]}`
          : 'bg-stone-100 border-stone-200 opacity-60'
        }
        ${onClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        ${className}
      `}
      whileHover={onClick ? { y: -1 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <span className={unlocked ? '' : 'grayscale'}>
        {achievement.icon}
      </span>
      <span className={`text-xs font-medium ${unlocked ? 'text-stone-700' : 'text-stone-400'}`}>
        {achievement.name}
      </span>
      {!unlocked && <Lock className="w-3 h-3 text-stone-400" />}
    </motion.button>
  )
}

// Achievement showcase for profile
interface AchievementShowcaseProps {
  achievements: Achievement[]
  unlockedIds: string[]
  maxDisplay?: number
  onViewAll?: () => void
  className?: string
}

export function AchievementShowcase({
  achievements,
  unlockedIds,
  maxDisplay = 6,
  onViewAll,
  className = '',
}: AchievementShowcaseProps) {
  const unlockedAchievements = achievements.filter(a => unlockedIds.includes(a.id))
  const displayAchievements = unlockedAchievements.slice(0, maxDisplay)
  const remaining = unlockedAchievements.length - maxDisplay

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-stone-900 flex items-center gap-2">
          <Star className="w-4 h-4 text-coral-500" />
          Achievements
          <span className="text-sm font-normal text-stone-500">
            ({unlockedAchievements.length}/{achievements.length})
          </span>
        </h3>
        {onViewAll && unlockedAchievements.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-sm text-iris-600 hover:text-iris-700 font-medium"
          >
            View all
          </button>
        )}
      </div>

      {displayAchievements.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {displayAchievements.map(achievement => (
            <AchievementChip
              key={achievement.id}
              achievement={achievement}
              unlocked={true}
            />
          ))}
          {remaining > 0 && (
            <button
              onClick={onViewAll}
              className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200 transition-colors"
            >
              +{remaining} more
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          No achievements yet. Start reading to earn badges!
        </p>
      )}
    </div>
  )
}

export default AchievementCard
