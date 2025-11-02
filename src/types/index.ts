export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  isbn?: string
  genre: string
  pageCount?: number
  description?: string
  ageRating: string
  dateAdded: string
  dateRead?: string
  rating?: number
  isRead: boolean
  notes?: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  bookId?: string
  dateCreated: string
  dateModified: string
  status: 'draft' | 'pending' | 'published'
  parentApproved: boolean
  tags: string[]
  emoji?: string
}

export interface User {
  id: string
  name: string
  age: number
  isParent: boolean
  parentId?: string
  settings: UserSettings
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'colorful'
  readingGoal: number
  notifications: boolean
  parentalControls: ParentalControls
}

export interface ParentalControls {
  requireApproval: boolean
  contentFilter: boolean
  timeLimit?: number
  allowedGenres: string[]
}

export interface ReadingChallenge {
  id: string
  title: string
  description: string
  target: number
  current: number
  type: 'books' | 'pages' | 'genres'
  startDate: string
  endDate: string
  completed: boolean
  badge?: string
}

export interface ReadingStats {
  totalBooks: number
  totalPages: number
  favoriteGenre: string
  readingStreak: number
  averageRating: number
  booksThisMonth: number
  booksThisYear: number
}

export interface Poem {
  id: string
  title: string
  content: string
  emoji?: string
  dateCreated: string
  likes: number
  template?: string
} 