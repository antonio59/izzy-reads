import { useEffect, useState } from 'react'

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
  const [elements, setElements] = useState<FloatingElement[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setElements([])
      return
    }

    // Reduced to just 4 subtle book-related emojis
    const emojis = ['📚', '✨', '⭐', '📖']
    const newElements: FloatingElement[] = []

    // Only 4 elements for subtle decoration
    for (let i = 0; i < 4; i++) {
      newElements.push({
        id: i,
        emoji: emojis[i],
        // Position in corners to avoid content interference
        left: i < 2 ? 5 + Math.random() * 10 : 85 + Math.random() * 10,
        top: i % 2 === 0 ? 10 + Math.random() * 20 : 70 + Math.random() * 20,
        size: 16 + Math.random() * 8, // Smaller size range
        delay: i * 2, // Staggered delays
        duration: 8 + Math.random() * 4, // Slower, more subtle movement
      })
    }
    setElements(newElements)
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
