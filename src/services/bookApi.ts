// Unified Book API - Google Books primary, Open Library fallback
import {
  searchGoogleBooks,
  convertGoogleBookToDetails,
  suggestGenre as googleSuggestGenre,
  determineAgeRating as googleDetermineAgeRating,
  type GoogleBook,
  type BookDetails,
} from "./googleBooksApi";

import {
  searchBooks as searchOpenLibrary,
  convertToBookFormat as convertOpenLibraryBook,
  suggestGenre as openLibrarySuggestGenre,
  determineAgeRating as openLibraryDetermineAgeRating,
  type OpenLibraryBook,
} from "./openLibraryApi";

import { isLikelyInvalidCover, parseIsbn } from "../lib/coverUrl";

export type { BookDetails };

export interface UnifiedBook {
  id: string;
  source: "google" | "openlibrary";
  title: string;
  author: string;
  coverUrl: string;
  isbn?: string;
  pageCount?: number;
  publishYear?: number;
  publisher?: string;
  description?: string;
  subjects?: string[];
  _googleBook?: GoogleBook;
  _openLibraryBook?: OpenLibraryBook;
}

function hasUsableCover(book: UnifiedBook): boolean {
  return Boolean(book.coverUrl) && !isLikelyInvalidCover(book.coverUrl);
}

/** Prefer results that already have a real cover image. */
function preferCoveredResults(books: UnifiedBook[]): UnifiedBook[] {
  return [...books].sort((a, b) => {
    const aScore = hasUsableCover(a) ? 1 : 0;
    const bScore = hasUsableCover(b) ? 1 : 0;
    return bScore - aScore;
  });
}

/**
 * Search for books - tries Google Books first, falls back to Open Library.
 * ISBN queries hit `isbn:` on both providers for tighter matching.
 */
export async function searchBooks(
  query: string,
  limit: number = 12,
): Promise<UnifiedBook[]> {
  const isbn = parseIsbn(query);

  // Try Google Books first
  try {
    const googleResults = await searchGoogleBooks(query, limit);

    if (googleResults.length > 0) {
      const mapped = googleResults.map((book) => {
        const details = convertGoogleBookToDetails(book);
        return {
          id: book.id,
          source: "google" as const,
          title: details.title,
          author: details.author,
          coverUrl: details.coverUrl,
          isbn: details.isbn ?? isbn ?? undefined,
          pageCount: details.pageCount,
          publishYear: details.publishYear,
          publisher: details.publisher,
          description: details.description,
          subjects: details.subjects,
          _googleBook: book,
        };
      });
      return preferCoveredResults(mapped);
    }
  } catch (error) {
    console.warn("Google Books search failed, trying Open Library:", error);
  }

  // Fallback to Open Library
  try {
    const openLibraryResults = await searchOpenLibrary(query, limit);

    const mapped = openLibraryResults.map((book) => {
      const details = convertOpenLibraryBook(book);
      return {
        id: book.key,
        source: "openlibrary" as const,
        title: details.title,
        author: details.author,
        coverUrl: details.coverUrl,
        isbn: details.isbn ?? isbn ?? undefined,
        pageCount: details.pageCount,
        publishYear: details.publishYear,
        publisher: details.publisher,
        description: details.description,
        subjects: details.subjects,
        _openLibraryBook: book,
      };
    });
    return preferCoveredResults(mapped);
  } catch (error) {
    console.error("Both book APIs failed:", error);
    return [];
  }
}

/**
 * Suggest genre based on book data
 */
export function suggestGenre(book: UnifiedBook): string {
  if (book.source === "google" && book._googleBook) {
    return googleSuggestGenre(book._googleBook.volumeInfo.categories);
  }
  if (book.source === "openlibrary" && book._openLibraryBook) {
    return openLibrarySuggestGenre(book._openLibraryBook.subject);
  }
  return "Fiction";
}

/**
 * Determine age rating based on book data
 */
export function determineAgeRating(book: UnifiedBook): string {
  if (book.source === "google" && book._googleBook) {
    return googleDetermineAgeRating(book._googleBook.volumeInfo.categories);
  }
  if (book.source === "openlibrary" && book._openLibraryBook) {
    return openLibraryDetermineAgeRating(book._openLibraryBook.subject);
  }
  return "8+";
}
