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
    
    const emojis = ['✨', '⭐', '💫', '🌟', '💖', '📚', '🦋', '🌸']
    const newElements: FloatingElement[] = []
    
    for (let i = 0; i < 12; i++) {
      newElements.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 14 + Math.random() * 18,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
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
          className="absolute opacity-20 select-none"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            fontSize: `${el.size}px`,
            animation: `float ${el.duration}s ease-in-out infinite`,
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
