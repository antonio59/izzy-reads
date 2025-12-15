import { motion } from 'framer-motion'

interface ProgressProps {
  value: number // 0-100
  max?: number
  color?: 'primary' | 'accent' | 'sage' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const colorStyles = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  sage: 'bg-sage-500',
  gradient: 'bg-gradient-to-r from-primary-500 via-accent-400 to-sage-500',
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function Progress({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-gray-600">{value.toLocaleString()}</span>
          <span className="text-sm text-gray-400">{max.toLocaleString()}</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          className={`h-full rounded-full ${colorStyles[color]}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Circular Progress component
interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'accent' | 'sage'
  showValue?: boolean
  label?: string
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  label,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'text-primary-500',
    accent: 'text-accent-500',
    sage: 'text-sage-500',
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <motion.circle
          className={colorClasses[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold font-display ${colorClasses[color]}`}>
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500 mt-0.5">{label}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Reading Challenge Progress
interface ChallengeProgressProps {
  title: string
  current: number
  target: number
  icon?: string
  color?: 'primary' | 'accent' | 'sage'
  dueDate?: string
  className?: string
}

export function ChallengeProgress({
  title,
  current,
  target,
  icon = '📚',
  color = 'primary',
  dueDate,
  className = '',
}: ChallengeProgressProps) {
  const percentage = Math.round((current / target) * 100)
  const isComplete = current >= target

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-soft ${className}`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-gray-900 truncate">
              {title}
            </h4>
            {isComplete && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-lg"
              >
                🎉
              </motion.span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">
                {current} / {target}
              </span>
              <span className={`font-medium ${isComplete ? 'text-sage-600' : 'text-gray-500'}`}>
                {percentage}%
              </span>
            </div>
            <Progress value={current} max={target} color={color} size="md" />
          </div>

          {dueDate && !isComplete && (
            <p className="text-xs text-gray-400 mt-2">
              Due: {dueDate}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// XP Progress Bar
interface XPProgressProps {
  currentXP: number
  levelXP: number
  nextLevelXP: number
  level: number
  className?: string
}

export function XPProgress({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  className = '',
}: XPProgressProps) {
  const xpInLevel = currentXP - levelXP
  const xpNeeded = nextLevelXP - levelXP

  return (
    <div className={`bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="font-display font-bold text-gray-900">Level {level}</span>
        </div>
        <span className="text-sm text-gray-500">
          {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </span>
      </div>
      <Progress value={xpInLevel} max={xpNeeded} color="gradient" size="lg" />
      <p className="text-xs text-gray-500 mt-2 text-center">
        {(xpNeeded - xpInLevel).toLocaleString()} XP to Level {level + 1}
      </p>
    </div>
  )
}

export default Progress
