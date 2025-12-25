import { motion } from 'framer-motion'
import { Sparkles, ChevronUp } from 'lucide-react'
import { getLevelProgress, formatXP } from '../lib/leveling'
import type { Level } from '../lib/leveling'
import { Card } from './ui/Card'

interface LevelProgressProps {
  totalXP: number
  className?: string
  variant?: 'default' | 'compact' | 'detailed'
}

export function LevelProgress({ totalXP, className = '', variant = 'default' }: LevelProgressProps) {
  const progress = getLevelProgress(totalXP)
  const { level, xpInLevel, xpForNextLevel, progressPercent, nextLevel } = progress

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{level.icon}</span>
          <span className="font-display font-bold text-stone-900">Lvl {level.level}</span>
        </div>
        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-iris-500 to-coral-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-stone-500">{formatXP(totalXP)} XP</span>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card variant="gradient" className={className}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="text-4xl"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {level.icon}
              </motion.div>
              <div>
                <p className="text-sm text-stone-500">Level {level.level}</p>
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {level.title}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold text-iris-600">
                {formatXP(totalXP)}
              </p>
              <p className="text-sm text-stone-500">Total XP</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-iris-500 via-coral-400 to-sage-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            {/* Progress markers */}
            <div className="absolute top-0 left-0 right-0 h-4 flex items-center">
              {[25, 50, 75].map(marker => (
                <div
                  key={marker}
                  className="absolute w-0.5 h-2 bg-white/50"
                  style={{ left: `${marker}%` }}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-stone-500">
              {formatXP(xpInLevel)} / {formatXP(xpForNextLevel)} XP
            </span>
            <span className="text-iris-600 font-medium">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Next level info */}
          {nextLevel && (
            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-500">
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm">Next: {nextLevel.title}</span>
                  <span>{nextLevel.icon}</span>
                </div>
                <span className="text-sm text-stone-600">
                  {formatXP(xpForNextLevel - xpInLevel)} XP to go
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-r from-iris-50 to-coral-50 rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.icon}</span>
          <div>
            <span className="font-display font-bold text-stone-900">
              Level {level.level}
            </span>
            <span className="text-sm text-stone-500 ml-2">{level.title}</span>
          </div>
        </div>
        <span className="text-sm text-stone-500">
          {formatXP(xpInLevel)} / {formatXP(xpForNextLevel)} XP
        </span>
      </div>

      <div className="h-3 bg-white/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-iris-500 via-coral-400 to-sage-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {nextLevel && (
        <p className="text-xs text-stone-500 mt-2 text-center">
          {formatXP(xpForNextLevel - xpInLevel)} XP to {nextLevel.title} {nextLevel.icon}
        </p>
      )}
    </div>
  )
}

// Circular level display for profile headers
interface CircularLevelProps {
  totalXP: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CircularLevel({ totalXP, size = 'md', className = '' }: CircularLevelProps) {
  const progress = getLevelProgress(totalXP)
  const { level, progressPercent } = progress

  const sizes = {
    sm: { container: 64, stroke: 4, icon: 'text-xl', level: 'text-xs' },
    md: { container: 96, stroke: 6, icon: 'text-3xl', level: 'text-sm' },
    lg: { container: 128, stroke: 8, icon: 'text-4xl', level: 'text-base' },
  }

  const s = sizes[size]
  const radius = (s.container - s.stroke) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={s.container}
        height={s.container}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          className="text-stone-100"
          strokeWidth={s.stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={s.container / 2}
          cy={s.container / 2}
        />
        {/* Progress circle */}
        <motion.circle
          className="text-iris-500"
          strokeWidth={s.stroke}
          strokeLinecap="round"
          stroke="url(#levelGradient)"
          fill="transparent"
          r={radius}
          cx={s.container / 2}
          cy={s.container / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f97f5e" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={s.icon}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {level.icon}
        </motion.span>
        <span className={`font-display font-bold text-stone-700 ${s.level}`}>
          Lvl {level.level}
        </span>
      </div>
    </div>
  )
}

// XP earned notification
interface XPGainProps {
  amount: number
  reason?: string
  onComplete?: () => void
}

export function XPGain({ amount, reason, onComplete }: XPGainProps) {
  return (
    <motion.div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 1500)
      }}
    >
      <div className="bg-gradient-to-r from-iris-500 to-coral-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span className="font-bold">+{amount} XP</span>
        {reason && (
          <>
            <span className="text-white/60">|</span>
            <span className="text-sm text-white/90">{reason}</span>
          </>
        )}
      </div>
    </motion.div>
  )
}

// Level milestones display
interface LevelMilestonesProps {
  levels: Level[]
  currentLevel: number
  className?: string
}

export function LevelMilestones({ levels, currentLevel, className = '' }: LevelMilestonesProps) {
  return (
    <div className={className}>
      <h3 className="font-display font-semibold text-stone-900 mb-4">Level Journey</h3>
      <div className="space-y-3">
        {levels.map((level) => {
          const isComplete = currentLevel >= level.level
          const isCurrent = currentLevel === level.level

          return (
            <motion.div
              key={level.level}
              className={`
                flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                ${isComplete
                  ? isCurrent
                    ? 'bg-iris-50 border-iris-300'
                    : 'bg-stone-50 border-stone-200'
                  : 'bg-white border-stone-100 opacity-60'
                }
              `}
              initial={false}
              animate={isCurrent ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className={`text-2xl ${!isComplete ? 'grayscale' : ''}`}>
                {level.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isComplete ? 'text-stone-900' : 'text-stone-400'}`}>
                    Level {level.level}
                  </span>
                  {isCurrent && (
                    <span className="text-xs bg-iris-100 text-iris-600 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <span className={`text-sm ${isComplete ? 'text-stone-600' : 'text-stone-400'}`}>
                  {level.title}
                </span>
              </div>
              <span className="text-xs text-stone-400">
                {formatXP(level.minXP)} XP
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default LevelProgress
