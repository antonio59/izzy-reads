// Local storage utilities for Isabella Reads
export const STORAGE_KEYS = {
  BOOKS: 'isabella_reads_books',
  WISHLIST: 'isabella_reads_wishlist',
  BLOG_POSTS: 'isabella_reads_blog_posts',
  USER_SETTINGS: 'isabella_reads_user_settings',
  READING_CHALLENGES: 'isabella_reads_reading_challenges'
} as const

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
} 