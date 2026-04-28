// Google Books API service for fetching book metadata and covers
// API Documentation: https://developers.google.com/books/docs/v1/using

export interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    pageCount?: number
    categories?: string[]
    imageLinks?: {
      smallThumbnail?: string
      thumbnail?: string
      small?: string
      medium?: string
      large?: string
      extraLarge?: string
    }
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
    averageRating?: number
    ratingsCount?: number
  }
}

export interface GoogleBooksResponse {
  totalItems: number
  items?: GoogleBook[]
}

export interface BookDetails {
  title: string
  author: string
  coverUrl: string
  isbn?: string
  pageCount?: number
  publishYear?: number
  publisher?: string
  description?: string
  subjects?: string[]
  rating?: number
}

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

/**
 * Get high-quality cover URL from Google Books
 * Tries to get the best available resolution
 */
function getBestCoverUrl(imageLinks?: GoogleBook['volumeInfo']['imageLinks']): string {
  if (!imageLinks) return ''
  
  // Try to get the highest quality image available
  // Google Books returns HTTP URLs, we convert to HTTPS
  const url = imageLinks.extraLarge 
    || imageLinks.large 
    || imageLinks.medium 
    || imageLinks.small 
    || imageLinks.thumbnail 
    || imageLinks.smallThumbnail
    || ''
  
  // Convert to HTTPS and remove edge=curl parameter for cleaner images
  return url
    .replace('http://', 'https://')
    .replace('&edge=curl', '')
    .replace('zoom=1', 'zoom=2') // Request higher resolution
}

/**
 * Search for books using Google Books API
 */
export async function searchGoogleBooks(query: string, limit: number = 12): Promise<GoogleBook[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${limit}&printType=books`
    )
    
    if (!response.ok) {
      throw new Error('Failed to search Google Books')
    }
    
    const data: GoogleBooksResponse = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error searching Google Books:', error)
    return []
  }
}

/**
 * Convert Google Book to our BookDetails format
 */
export function convertGoogleBookToDetails(book: GoogleBook): BookDetails {
  const { volumeInfo } = book
  
  // Extract ISBN (prefer ISBN-13)
  const isbn = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
    || volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier
  
  // Extract year from publishedDate (can be "2023", "2023-05", or "2023-05-15")
  const publishYear = volumeInfo.publishedDate 
    ? parseInt(volumeInfo.publishedDate.split('-')[0], 10) 
    : undefined

  return {
    title: volumeInfo.title,
    author: volumeInfo.authors?.join(', ') || 'Unknown Author',
    coverUrl: getBestCoverUrl(volumeInfo.imageLinks),
    isbn,
    pageCount: volumeInfo.pageCount,
    publishYear,
    publisher: volumeInfo.publisher,
    description: volumeInfo.description,
    subjects: volumeInfo.categories,
    rating: volumeInfo.averageRating
  }
}

/**
 * Determine appropriate age rating based on categories
 */
export function determineAgeRating(categories?: string[]): string {
  if (!categories || categories.length === 0) return '8+'
  
  const categoriesLower = categories.map(c => c.toLowerCase()).join(' ')
  
  if (categoriesLower.includes('young adult') || categoriesLower.includes('teen')) {
    return '12+'
  } else if (categoriesLower.includes('juvenile') || categoriesLower.includes('children')) {
    return '8+'
  } else if (categoriesLower.includes('picture book') || categoriesLower.includes('early reader')) {
    return '5+'
  }
  
  return '8+'
}

/**
 * Suggest genre based on categories
 */
export function suggestGenre(categories?: string[]): string {
  if (!categories || categories.length === 0) return 'Fiction'
  
  const categoriesLower = categories.map(c => c.toLowerCase()).join(' ')
  
  if (categoriesLower.includes('fantasy')) {
    return 'Fantasy'
  } else if (categoriesLower.includes('mystery') || categoriesLower.includes('detective')) {
    return 'Mystery'
  } else if (categoriesLower.includes('science fiction') || categoriesLower.includes('sci-fi')) {
    return 'Science Fiction'
  } else if (categoriesLower.includes('adventure')) {
    return 'Adventure'
  } else if (categoriesLower.includes('historical')) {
    return 'Historical Fiction'
  } else if (categoriesLower.includes('biography') || categoriesLower.includes('autobiography')) {
    return 'Biography'
  } else if (categoriesLower.includes('poetry') || categoriesLower.includes('poems')) {
    return 'Poetry'
  } else if (categoriesLower.includes('nonfiction') || categoriesLower.includes('non-fiction')) {
    return 'Non-Fiction'
  }
  
  return 'Fiction'
}
