import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Star, Trophy, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

// Genre definitions for bingo
const BINGO_GENRES = [
  { id: 'fantasy', name: 'Fantasy', icon: '🧙', color: 'iris' },
  { id: 'mystery', name: 'Mystery', icon: '🔍', color: 'coral' },
  { id: 'adventure', name: 'Adventure', icon: '🗺️', color: 'sage' },
  { id: 'scifi', name: 'Sci-Fi', icon: '🚀', color: 'iris' },
  { id: 'realistic', name: 'Realistic Fiction', icon: '🏠', color: 'coral' },
  { id: 'historical', name: 'Historical', icon: '🏛️', color: 'sage' },
  { id: 'humor', name: 'Humor', icon: '😂', color: 'iris' },
  { id: 'horror', name: 'Spooky', icon: '👻', color: 'coral' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: 'sage' },
  { id: 'animals', name: 'Animals', icon: '🐾', color: 'iris' },
  { id: 'graphic', name: 'Graphic Novel', icon: '💭', color: 'coral' },
  { id: 'poetry', name: 'Poetry', icon: '📝', color: 'sage' },
  { id: 'biography', name: 'Biography', icon: '👤', color: 'iris' },
  { id: 'nonfiction', name: 'Non-Fiction', icon: '📚', color: 'coral' },
  { id: 'fairy', name: 'Fairy Tales', icon: '🧚', color: 'sage' },
  { id: 'mythology', name: 'Mythology', icon: '⚡', color: 'iris' },
] as const

type BingoGenre = typeof BINGO_GENRES[number]

export interface BingoCell {
  genre: BingoGenre
  completed: boolean
  bookId?: string
  bookTitle?: string
  completedDate?: string
}

export interface BingoBoard {
  id: string
  size: 3 | 5
  cells: BingoCell[]
  startDate: string
  endDate?: string
  completedLines: number
  isFullBoard: boolean
}

interface GenreBingoProps {
  board: BingoBoard
  onCellClick?: (cellIndex: number) => void
  onAssignBook?: (cellIndex: number, bookId: string, bookTitle: string) => void
  className?: string
}

// Check for completed lines (rows, columns, diagonals)
function getCompletedLines(cells: BingoCell[], size: number): number[][] {
  const completedLines: number[][] = []

  // Check rows
  for (let row = 0; row < size; row++) {
    const rowIndices = Array.from({ length: size }, (_, col) => row * size + col)
    if (rowIndices.every(i => cells[i]?.completed)) {
      completedLines.push(rowIndices)
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    const colIndices = Array.from({ length: size }, (_, row) => row * size + col)
    if (colIndices.every(i => cells[i]?.completed)) {
      completedLines.push(colIndices)
    }
  }

  // Check diagonals
  const diagonal1 = Array.from({ length: size }, (_, i) => i * size + i)
  if (diagonal1.every(i => cells[i]?.completed)) {
    completedLines.push(diagonal1)
  }

  const diagonal2 = Array.from({ length: size }, (_, i) => i * size + (size - 1 - i))
  if (diagonal2.every(i => cells[i]?.completed)) {
    completedLines.push(diagonal2)
  }

  return completedLines
}

// Check if cell is part of a completed line
function isInCompletedLine(cellIndex: number, completedLines: number[][]): boolean {
  return completedLines.some(line => line.includes(cellIndex))
}

export function GenreBingo({ board, onCellClick, onAssignBook, className = '' }: GenreBingoProps) {
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [showCellModal, setShowCellModal] = useState(false)

  const completedLines = getCompletedLines(board.cells, board.size)
  const completedCount = board.cells.filter(c => c.completed).length
  const totalCells = board.size * board.size
  const progressPercent = Math.round((completedCount / totalCells) * 100)

  const handleCellClick = (index: number) => {
    setSelectedCell(index)
    setShowCellModal(true)
    onCellClick?.(index)
  }

  const selectedCellData = selectedCell !== null ? board.cells[selectedCell] : null

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Genre Bingo
            </CardTitle>
            <CardDescription>
              Read books from different genres to complete lines!
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {completedLines.length > 0 && (
              <Badge variant="coral" className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {completedLines.length} {completedLines.length === 1 ? 'Line' : 'Lines'}
              </Badge>
            )}
            {board.isFullBoard && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Badge variant="iris" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Full Board!
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-600">{completedCount} / {totalCells} genres</span>
            <span className="text-stone-500">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-iris-500 via-coral-400 to-sage-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Bingo Grid */}
        <div
          className={`grid gap-2 ${board.size === 3 ? 'grid-cols-3' : 'grid-cols-5'}`}
        >
          {board.cells.map((cell, index) => {
            const isCompleted = cell.completed
            const isInLine = isInCompletedLine(index, completedLines)

            return (
              <motion.button
                key={`${cell.genre.id}-${index}`}
                onClick={() => handleCellClick(index)}
                className={`
                  relative aspect-square rounded-xl p-2 flex flex-col items-center justify-center
                  transition-all duration-200 border-2
                  ${isCompleted
                    ? isInLine
                      ? 'bg-gradient-to-br from-iris-100 to-coral-100 border-iris-300 shadow-md'
                      : 'bg-sage-50 border-sage-300'
                    : 'bg-white border-stone-200 hover:border-iris-300 hover:bg-iris-50'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Completed checkmark */}
                <AnimatePresence>
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 bg-sage-500 text-white rounded-full p-0.5"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Line completion star */}
                <AnimatePresence>
                  {isInLine && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-1 -left-1"
                    >
                      <Star className="w-4 h-4 text-coral-500 fill-coral-500" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Genre icon */}
                <span className={`text-2xl ${board.size === 5 ? 'text-xl' : ''}`}>
                  {cell.genre.icon}
                </span>

                {/* Genre name */}
                <span className={`
                  text-xs font-medium text-center mt-1 leading-tight
                  ${isCompleted ? 'text-stone-700' : 'text-stone-500'}
                  ${board.size === 5 ? 'text-[10px]' : ''}
                `}>
                  {cell.genre.name}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-sage-50 border border-sage-300 rounded" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-iris-100 to-coral-100 border border-iris-300 rounded" />
            <span>In a line</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-coral-500 fill-coral-500" />
            <span>Bingo!</span>
          </div>
        </div>
      </CardContent>

      {/* Cell Detail Modal */}
      <Modal
        isOpen={showCellModal}
        onClose={() => setShowCellModal(false)}
        title={selectedCellData?.genre.name ?? 'Genre'}
        size="sm"
      >
        {selectedCellData && (
          <div className="text-center">
            <span className="text-5xl block mb-4">{selectedCellData.genre.icon}</span>

            {selectedCellData.completed ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sage-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Completed!</span>
                </div>
                {selectedCellData.bookTitle && (
                  <div className="bg-stone-50 rounded-xl p-4">
                    <p className="text-sm text-stone-500">Book read:</p>
                    <p className="font-semibold text-stone-900">{selectedCellData.bookTitle}</p>
                    {selectedCellData.completedDate && (
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(selectedCellData.completedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-stone-600">
                  Read a <span className="font-semibold">{selectedCellData.genre.name}</span> book to complete this cell!
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowCellModal(false)
                    // Trigger book assignment flow
                    if (selectedCell !== null) {
                      onAssignBook?.(selectedCell, '', '')
                    }
                  }}
                >
                  Mark as Read
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  )
}

// Mini bingo preview for dashboard
interface MiniBingoProps {
  board: BingoBoard
  onClick?: () => void
  className?: string
}

export function MiniBingo({ board, onClick, className = '' }: MiniBingoProps) {
  const completedLines = getCompletedLines(board.cells, board.size)

  return (
    <motion.button
      onClick={onClick}
      className={`
        bg-white rounded-xl p-3 shadow-soft hover:shadow-soft-md transition-shadow
        ${className}
      `}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-stone-700">Genre Bingo</span>
        {completedLines.length > 0 && (
          <Badge variant="coral" className="text-xs">
            {completedLines.length} lines
          </Badge>
        )}
      </div>

      <div className={`grid gap-0.5 ${board.size === 3 ? 'grid-cols-3' : 'grid-cols-5'}`}>
        {board.cells.map((cell, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded text-xs flex items-center justify-center
              ${cell.completed
                ? isInCompletedLine(index, completedLines)
                  ? 'bg-gradient-to-br from-iris-200 to-coral-200'
                  : 'bg-sage-100'
                : 'bg-stone-100'
              }
            `}
          >
            <span className="text-[10px]">{cell.genre.icon}</span>
          </div>
        ))}
      </div>
    </motion.button>
  )
}

// Create a new bingo board
export function createBingoBoard(size: 3 | 5 = 3): BingoBoard {
  const shuffledGenres = [...BINGO_GENRES].sort(() => Math.random() - 0.5)
  const cells: BingoCell[] = shuffledGenres.slice(0, size * size).map(genre => ({
    genre,
    completed: false,
  }))

  return {
    id: `bingo-${Date.now()}`,
    size,
    cells,
    startDate: new Date().toISOString(),
    completedLines: 0,
    isFullBoard: false,
  }
}

// Sample board for testing
export const SAMPLE_BINGO_BOARD: BingoBoard = {
  id: 'sample-board',
  size: 3,
  cells: [
    { genre: BINGO_GENRES[0], completed: true, bookTitle: 'Harry Potter', completedDate: '2024-11-15' },
    { genre: BINGO_GENRES[1], completed: true, bookTitle: 'Mysteries of the Library', completedDate: '2024-11-20' },
    { genre: BINGO_GENRES[2], completed: true, bookTitle: 'Island Adventures', completedDate: '2024-11-25' },
    { genre: BINGO_GENRES[3], completed: false },
    { genre: BINGO_GENRES[4], completed: true, bookTitle: 'The Best Day Ever', completedDate: '2024-11-28' },
    { genre: BINGO_GENRES[5], completed: false },
    { genre: BINGO_GENRES[6], completed: true, bookTitle: 'Diary of a Silly Kid', completedDate: '2024-12-01' },
    { genre: BINGO_GENRES[7], completed: false },
    { genre: BINGO_GENRES[8], completed: false },
  ],
  startDate: '2024-11-01',
  completedLines: 1,
  isFullBoard: false,
}

export default GenreBingo
