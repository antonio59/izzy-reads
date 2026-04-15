import { useEffect, useMemo, useState } from 'react'

interface FloatingElement {
  id: number
  emoji: string
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

// Simplified: Only 4 subtle elements at low opacity
const FloatingDecorations = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  // Listen for prefers-reduced-motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const elements = useMemo<FloatingElement[]>(() => {
    if (prefersReducedMotion) return []

    const emojis = ['📚', '✨', '⭐', '📖']
    // Use a seeded random based on emoji index to avoid Math.random in render warnings
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      emoji: emojis[i],
      left: i < 2 ? 5 + (i * 3.3 + 2) : 85 + (i * 2.5 + 1),
      top: i % 2 === 0 ? 10 + (i * 6.5 + 3) : 70 + (i * 4.2 + 2),
      size: 16 + (i * 2.5 + 2),
      delay: i * 2,
      duration: 8 + (i * 1.3 + 1.5),
    }))
  }, [prefersReducedMotion])

  if (prefersReducedMotion || elements.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute opacity-[0.08] select-none" // Much lower opacity
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            fontSize: `${el.size}px`,
            animation: `subtle-float ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  )
}

export default FloatingDecorations
