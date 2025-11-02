// Date utilities for Isabella Reads
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Unknown date'
  }
}

export const formatDateFriendly = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7)
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    } else {
      return formatDate(dateString)
    }
  } catch {
    return 'Some time ago'
  }
}

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0]
}

export const isToday = (dateString: string): boolean => {
  try {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  } catch {
    return false
  }
}

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex] || 'Unknown'
} 