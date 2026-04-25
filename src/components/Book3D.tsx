import { useState } from 'react'
import { motion } from 'framer-motion'

interface Book3DProps {
  title: string
  author: string
  coverUrl?: string
  spineColor?: string
  pageCount?: number
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Generate a pleasant color from book title
function getSpineColor(title: string): string {
  const colors = [
    'from-iris-400 to-iris-600',
    'from-coral-400 to-coral-600',
    'from-sage-400 to-sage-600',
    'from-amber-400 to-amber-600',
    'from-pink-400 to-pink-600',
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-teal-400 to-teal-600',
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function Book3D({
  title,
  author,
  coverUrl,
  spineColor,
  pageCount = 200,
  onClick,
  className = '',
  size = 'md',
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeConfig = {
    sm: { width: 80, height: 120, depth: 20, fontSize: 'text-xs', spineText: 'text-[6px]' },
    md: { width: 120, height: 180, depth: 30, fontSize: 'text-xs', spineText: 'text-xs' },
    lg: { width: 160, height: 240, depth: 40, fontSize: 'text-sm', spineText: 'text-xs' },
  }

  const config = sizeConfig[size]
  const bookDepth = Math.min(config.depth, Math.max(15, Math.floor(pageCount / 15)))
  const color = spineColor || getSpineColor(title)

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      style={{
        width: config.width,
        height: config.height,
        perspective: 1000,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isHovered ? -25 : 0,
          rotateX: isHovered ? 5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Front cover */}
        <div
          className="absolute inset-0 rounded-r-md shadow-lg overflow-hidden"
          style={{
            transform: `translateZ(${bookDepth / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${color} flex flex-col items-center justify-center p-3`}>
              <span className={`${config.fontSize} font-display font-bold text-white text-center leading-tight`}>
                {title}
              </span>
              <span className={`${config.spineText} text-white/70 mt-1 text-center`}>
                {author}
              </span>
            </div>
          )}
        </div>

        {/* Spine */}
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-b ${color} rounded-l-sm flex items-center justify-center`}
          style={{
            width: bookDepth,
            transform: `rotateY(-90deg) translateZ(${bookDepth / 2}px)`,
            transformOrigin: 'left center',
          }}
        >
          <span
            className={`${config.spineText} font-display font-bold text-white whitespace-nowrap`}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              maxHeight: config.height - 20,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </span>
        </div>

        {/* Pages (side) */}
        <div
          className="absolute top-[2px] bottom-[2px] bg-gradient-to-r from-gray-100 to-gray-50"
          style={{
            width: bookDepth - 4,
            right: 0,
            transform: `rotateY(90deg) translateZ(${config.width - bookDepth / 2}px)`,
            transformOrigin: 'right center',
          }}
        >
          {/* Page lines */}
          {Array.from({ length: Math.min(20, Math.floor(pageCount / 20)) }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-stone-200"
              style={{ top: `${(i + 1) * 5}%` }}
            />
          ))}
        </div>

        {/* Top pages */}
        <div
          className="absolute left-[2px] right-[2px] bg-gradient-to-b from-gray-50 to-gray-100"
          style={{
            height: bookDepth - 4,
            top: 0,
            transform: `rotateX(90deg) translateZ(${bookDepth / 2 - 2}px)`,
            transformOrigin: 'top center',
          }}
        />

        {/* Bottom pages */}
        <div
          className="absolute left-[2px] right-[2px] bg-gradient-to-t from-gray-50 to-gray-100"
          style={{
            height: bookDepth - 4,
            bottom: 0,
            transform: `rotateX(-90deg) translateZ(${config.height - bookDepth / 2}px)`,
            transformOrigin: 'bottom center',
          }}
        />

        {/* Back cover */}
        <div
          className={`absolute inset-0 rounded-l-md bg-gradient-to-br ${color} opacity-80`}
          style={{
            transform: `translateZ(-${bookDepth / 2}px)`,
          }}
        />

        {/* Hover glow effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-r-md pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              transform: `translateZ(${bookDepth / 2 + 1}px)`,
            }}
          />
        )}
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 rounded-full blur-md"
        animate={{
          scaleX: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.3 : 0.15,
          y: isHovered ? 8 : 0,
        }}
        style={{ transform: 'translateY(10px)' }}
      />
    </motion.div>
  )
}

// Bookshelf row of 3D books
interface BookshelfRowProps {
  books: Array<{
    id: string
    title: string
    author: string
    coverUrl?: string
    pageCount?: number
  }>
  onBookClick?: (bookId: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BookshelfRow({ books, onBookClick, size = 'md', className = '' }: BookshelfRowProps) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Book3D
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            pageCount={book.pageCount}
            onClick={() => onBookClick?.(book.id)}
            size={size}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Book opening animation component
interface BookOpenProps {
  title: string
  coverUrl?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function BookOpen({ title, coverUrl, isOpen, onClose, children }: BookOpenProps) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Open book */}
      <motion.div
        className="relative bg-amber-50 rounded-lg shadow-xl overflow-hidden"
        style={{
          width: 'min(90vw, 800px)',
          height: 'min(80vh, 600px)',
          perspective: 1500,
        }}
        initial={{ scale: 0.5, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.5, rotateY: 90 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Book spine shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/5 to-black/10 z-10" />

        {/* Left page (cover) */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 p-6 overflow-hidden">
          <div className="relative w-full h-full rounded-l-lg overflow-hidden shadow-inner">
            {coverUrl ? (
              <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-iris-400 to-iris-600 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-white text-center px-4">
                  {title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right page (content) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 p-6 overflow-auto bg-amber-50">
          <div className="prose prose-sm max-w-none">
            {children}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default Book3D
