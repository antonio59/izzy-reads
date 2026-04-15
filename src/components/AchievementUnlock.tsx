import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotionPreference } from '../contexts/MotionPreferenceContext'
import type { Achievement, AchievementRarity } from '../lib/achievements'
import { Badge } from './ui/Badge'

interface AchievementUnlockProps {
  achievement: Achievement | null
  onClose: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

const rarityColors: Record<AchievementRarity, string> = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-iris-500',
  epic: 'from-iris-400 to-coral-500',
  legendary: 'from-amber-400 via-coral-500 to-iris-500',
}

const rarityGlow: Record<AchievementRarity, string> = {
  common: 'shadow-gray-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-iris-400/50',
  legendary: 'shadow-amber-400/50',
}

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const { randomX, randomRotate } = useMemo(() => {
    const seed = Math.round(delay * 1000)
    return {
      randomX: (seed * 37 % 200) - 100,
      randomRotate: (seed * 53 % 360),
    }
  }, [delay])

  return (
    <motion.div
      className={`absolute w-2 h-2 ${color} rounded-sm`}
      initial={{
        opacity: 1,
        scale: 0,
        x: 0,
        y: 0,
        rotate: 0,
      }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
        x: randomX,
        y: [0, -100, 100],
        rotate: randomRotate,
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: 'easeOut',
      }}
    />
  )
}

// Starburst effect
function Starburst({ color }: { color: string }) {
  const rays = Array.from({ length: 12 })

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {rays.map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-16 ${color} origin-bottom rounded-full`}
          style={{ transform: `rotate(${i * 30}deg)` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      ))}
    </motion.div>
  )
}

export function AchievementUnlock({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
}: AchievementUnlockProps) {
  const { prefersReducedMotion } = useMotionPreference()
  const [isVisible, setIsVisible] = useState(false)

  // Trigger visibility during render when a new achievement appears
  if (achievement && !isVisible) {
    setIsVisible(true)
  }

  useEffect(() => {
    if (!achievement || !autoClose || !isVisible) return
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500) // Wait for exit animation
    }, autoCloseDelay)

    return () => clearTimeout(timer)
  }, [achievement, autoClose, autoCloseDelay, onClose, isVisible])

  const confettiColors = [
    'bg-iris-400',
    'bg-coral-400',
    'bg-sage-400',
    'bg-amber-400',
    'bg-pink-400',
  ]

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, prefersReducedMotion ? 0 : 500)
            }}
          />

          {/* Achievement card */}
          <motion.div
            className="relative z-10"
            initial={prefersReducedMotion ? undefined : { scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={prefersReducedMotion ? undefined : { scale: 0, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Starburst behind */}
            {!prefersReducedMotion && (
              <Starburst color={`bg-gradient-to-t ${rarityColors[achievement.rarity]}`} />
            )}

            {/* Confetti */}
            {!prefersReducedMotion && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <ConfettiParticle
                    key={i}
                    delay={0.3 + i * 0.05}
                    color={confettiColors[i % confettiColors.length]}
                  />
                ))}
              </div>
            )}

            {/* Card */}
            <div
              className={`
                relative bg-white rounded-3xl p-8 shadow-2xl ${rarityGlow[achievement.rarity]}
                min-w-[300px] max-w-[400px] text-center overflow-hidden
              `}
            >
              {/* Gradient header */}
              <div
                className={`
                  absolute top-0 left-0 right-0 h-24
                  bg-gradient-to-br ${rarityColors[achievement.rarity]}
                `}
              />

              {/* Unlock text */}
              <div className="relative z-10 -mt-2 mb-2">
                <span className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  Achievement Unlocked!
                </span>
              </div>

              {/* Icon */}
              <div className="relative z-10 text-6xl mb-4">
                {prefersReducedMotion ? (
                  achievement.icon
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {achievement.icon}
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-display font-bold text-stone-900 mb-2">
                {achievement.name}
              </h2>

              {/* Description */}
              <p className="text-stone-600 mb-4">
                {achievement.description}
              </p>

              {/* Badges */}
              <div className="flex items-center justify-center gap-2">
                <Badge variant="iris" className="text-sm">
                  +{achievement.xpReward} XP
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  {achievement.rarity}
                </Badge>
              </div>

              {/* Close hint */}
              <p className="text-xs text-stone-400 mt-6">
                Tap anywhere to continue
              </p>

              {/* Shimmer effect for legendary */}
              {!prefersReducedMotion && achievement.rarity === 'legendary' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 1 }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Level up animation
interface LevelUpProps {
  newLevel: number
  title: string
  icon: string
  onClose: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function LevelUp({
  newLevel,
  title,
  icon,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
}: LevelUpProps) {
  const { prefersReducedMotion } = useMotionPreference()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, prefersReducedMotion ? 0 : 500)
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose, prefersReducedMotion])

  const confettiColors = [
    'bg-iris-400',
    'bg-coral-400',
    'bg-sage-400',
    'bg-amber-400',
    'bg-pink-400',
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, prefersReducedMotion ? 0 : 500)
            }}
          />

          <motion.div
            className="relative z-10"
            initial={prefersReducedMotion ? undefined : { scale: 0 }}
            animate={{ scale: 1 }}
            exit={prefersReducedMotion ? undefined : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Confetti */}
            {!prefersReducedMotion && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <ConfettiParticle
                    key={i}
                    delay={0.2 + i * 0.04}
                    color={confettiColors[i % confettiColors.length]}
                  />
                ))}
              </div>
            )}

            {/* Card */}
            <div className="relative bg-gradient-to-br from-iris-500 to-coral-500 rounded-3xl p-8 shadow-2xl text-white text-center overflow-hidden">
              {/* Level up text */}
              <div className="mb-4">
                <span className="text-lg font-bold uppercase tracking-wider text-white/90">
                  Level Up!
                </span>
              </div>

              {/* Level number */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-4">
                {prefersReducedMotion ? (
                  <span className="text-5xl">{icon}</span>
                ) : (
                  <motion.span
                    className="text-5xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {icon}
                    </motion.span>
                  </motion.span>
                )}
              </div>

              {/* Level info */}
              <div>
                <div className="text-5xl font-display font-bold mb-2">
                  {newLevel}
                </div>
                <div className="text-lg font-medium text-white/90">
                  {title}
                </div>
              </div>

              {/* Close hint */}
              <p className="text-xs text-white/60 mt-6">
                Tap anywhere to continue
              </p>

              {/* Shimmer */}
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 1 }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AchievementUnlock
