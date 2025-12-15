import { motion } from 'framer-motion'

export type BadgeVariant = 'primary' | 'accent' | 'iris' | 'coral' | 'sage' | 'gray' | 'success' | 'warning' | 'error' | 'outline' | 'default'
export type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
  className?: string
  animated?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  accent: 'bg-accent-100 text-accent-700 border-accent-200',
  iris: 'bg-primary-100 text-primary-700 border-primary-200', // Keep for compat mapping
  coral: 'bg-accent-100 text-accent-700 border-accent-200', // Keep for compat mapping
  sage: 'bg-sage-100 text-sage-700 border-sage-200',
  gray: 'bg-stone-100 text-stone-700 border-stone-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  outline: 'bg-transparent text-stone-600 border-stone-300',
  default: 'bg-stone-100 text-stone-600 border-stone-200',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className = '',
  animated = false,
}: BadgeProps) {
  const Component = animated ? motion.span : 'span'
  const animationProps = animated
    ? {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      transition: { duration: 0.2 },
    }
    : {}

  return (
    <Component
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...animationProps}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Component>
  )
}

// Achievement Badge - specialized for gamification
interface AchievementBadgeProps {
  icon: string // emoji
  name: string
  description?: string
  unlocked?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const rarityStyles = {
  common: 'from-gray-200 to-gray-300',
  rare: 'from-primary-300 to-primary-400',
  epic: 'from-accent-300 to-accent-400',
  legendary: 'from-amber-300 to-amber-400',
}

const rarityShadows = {
  common: '',
  rare: 'shadow-primary',
  epic: 'shadow-accent',
  legendary: 'shadow-[0_4px_14px_rgba(251,191,36,0.3)]',
}

export function AchievementBadge({
  icon,
  name,
  description,
  unlocked = true,
  rarity = 'common',
  size = 'md',
  className = '',
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          bg-gradient-to-br ${rarityStyles[rarity]}
          ${rarityShadows[rarity]}
          ${!unlocked ? 'grayscale opacity-50' : ''}
          transition-all duration-300
        `}
      >
        <span className={!unlocked ? 'opacity-50' : ''}>{icon}</span>
      </div>
      <div className="text-center">
        <p className={`font-medium text-sm ${!unlocked ? 'text-gray-400' : 'text-gray-900'}`}>
          {name}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

// Level Badge - for displaying user level
interface LevelBadgeProps {
  level: number
  title: string
  xp: number
  xpToNext: number
  className?: string
}

export function LevelBadge({
  level,
  title,
  xp,
  xpToNext,
  className = '',
}: LevelBadgeProps) {
  const progress = Math.round((xp / xpToNext) * 100)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <svg className="w-14 h-14 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="24"
            cx="28"
            cy="28"
          />
          <motion.circle
            className="text-primary-500"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="24"
            cx="28"
            cy="28"
            initial={{ strokeDasharray: '0 150.8' }}
            animate={{ strokeDasharray: `${progress * 1.508} 150.8` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-primary-600">
          {level}
        </span>
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">
          {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
        </p>
      </div>
    </div>
  )
}

// Streak Badge - for reading streaks
interface StreakBadgeProps {
  days: number
  className?: string
}

export function StreakBadge({ days, className = '' }: StreakBadgeProps) {
  const isActive = days > 0
  const isMilestone = days >= 7 || days >= 30 || days >= 100

  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-xl
        ${isActive ? 'bg-gradient-to-r from-accent-100 to-amber-100' : 'bg-gray-100'}
        ${className}
      `}
      animate={isMilestone ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: isMilestone ? Infinity : 0, duration: 2 }}
    >
      <span className="text-2xl">{isActive ? '🔥' : '❄️'}</span>
      <div>
        <p className={`font-bold ${isActive ? 'text-accent-600' : 'text-gray-500'}`}>
          {days} day{days !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-gray-500">Reading streak</p>
      </div>
    </motion.div>
  )
}

export default Badge
