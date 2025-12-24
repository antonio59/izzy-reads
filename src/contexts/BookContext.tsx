import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  Book,
  BlogPost,
  ReadingChallenge,
  ReadingStats,
  Poem,
  BookReactions,
  ReviewReactions,
} from "../types";

interface BookContextType {
  books: Book[];
  wishlist: Book[];
  blogPosts: BlogPost[];
  poems: Poem[];
  readingChallenges: ReadingChallenge[];
  readingStats: ReadingStats;
  addBook: (book: Book) => void;
  bulkAddBooks: (books: Omit<Book, "id">[]) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (id: string) => void;
  moveToBookshelf: (id: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addPoem: (poem: Poem) => void;
  updatePoem: (id: string, updates: Partial<Poem>) => void;
  deletePoem: (id: string) => void;
  updateReadingStats: () => void;
  addReaction: (bookId: string, reactionType: keyof BookReactions) => void;
  addReviewReaction: (
    bookId: string,
    reactionType: keyof ReviewReactions,
  ) => void;
  getBookReactionCount: (book: Book) => number;
  getMostLovedBooks: () => Book[];
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [readingChallenges, setReadingChallenges] = useState<
    ReadingChallenge[]
  >([]);
  const [readingStats, setReadingStats] = useState<ReadingStats>({
    totalBooks: 0,
    totalPages: 0,
    favoriteGenre: "",
    readingStreak: 0,
    averageRating: 0,
    booksThisMonth: 0,
    booksThisYear: 0,
  });

  // Load data from Convex backend (removed sample data for clean environments)
  useEffect(() => {
    // No hardcoded data - load from Convex instead
    // Each environment will have its own clean database
  }, [books, setBooks, wishlist, setWishlist, blogPosts, setBlogPosts, poems, setPoems, readingChallenges, setReadingChallenges, readingStats, setReadingStats]);

  const addBook = (book: Book) => {
    setBooks((prev) => [...prev, book]);
    updateReadingStats();
  };

  // Bulk add books - useful for seeding data
  const bulkAddBooks = (newBooks: Omit<Book, "id">[]) => {
    const booksWithIds = newBooks.map((book, index) => ({
      ...book,
      id: `bulk-${Date.now()}-${index}`,
    }));
    setBooks((prev) => [...prev, ...booksWithIds]);
    updateReadingStats();
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updates } : book)),
    );
    updateReadingStats();
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
    updateReadingStats();
  };

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => [...prev, book]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((book) => book.id !== id));
  };

  const moveToBookshelf = (id: string) => {
    const book = wishlist.find((b) => b.id === id);
    if (book) {
      removeFromWishlist(id);
      addBook({
        ...book,
        isRead: true,
        dateRead: new Date().toISOString().split("T")[0],
      });
    }
  };

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [...prev, post]);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updates } : post)),
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const addPoem = (poem: Poem) => {
    setPoems((prev) => [...prev, poem]);
  };

  const updatePoem = (id: string, updates: Partial<Poem>) => {
    setPoems((prev) =>
      prev.map((poem) => (poem.id === id ? { ...poem, ...updates } : poem)),
    );
  };

  const deletePoem = (id: string) => {
    setPoems((prev) => prev.filter((poem) => poem.id !== id));
  };

  // Add a reaction to a book (about the book itself)
  const addReaction = (bookId: string, reactionType: keyof BookReactions) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId) {
          const currentReactions: BookReactions = book.reactions || {
            love: 0,
            amazing: 0,
            mustRead: 0,
            soGood: 0,
            notForMe: 0,
          };
          return {
            ...book,
            reactions: {
              ...currentReactions,
              [reactionType]: currentReactions[reactionType] + 1,
            },
          };
        }
        return book;
      }),
    );
  };

  // Add a reaction to a review (about Izzy's review quality)
  const addReviewReaction = (
    bookId: string,
    reactionType: keyof ReviewReactions,
  ) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId) {
          const currentReactions: ReviewReactions = book.reviewReactions || {
            helpful: 0,
            greatReview: 0,
            agree: 0,
            funny: 0,
            insightful: 0,
          };
          return {
            ...book,
            reviewReactions: {
              ...currentReactions,
              [reactionType]: currentReactions[reactionType] + 1,
            },
          };
        }
        return book;
      }),
    );
  };

  // Get total reaction count for a book
  const getBookReactionCount = (book: Book): number => {
    if (!book.reactions) return 0;
    return (
      book.reactions.love +
      book.reactions.amazing +
      book.reactions.mustRead +
      book.reactions.soGood
    );
  };

  // Get books sorted by most reactions
  const getMostLovedBooks = (): Book[] => {
    return [...books]
      .filter((book) => book.isRead && getBookReactionCount(book) > 0)
      .sort((a, b) => getBookReactionCount(b) - getBookReactionCount(a));
  };

  // Calculate reading streak based on consecutive weeks with reading activity
  const calculateReadingStreak = (readBooks: Book[]): number => {
    if (readBooks.length === 0) return 0;

    // Get books with valid read dates, sorted by date descending
    const booksWithDates = readBooks
      .filter((book) => book.dateRead)
      .sort(
        (a, b) =>
          new Date(b.dateRead!).getTime() - new Date(a.dateRead!).getTime(),
      );

    if (booksWithDates.length === 0) return 0;

    // Get the week number for a date (ISO week)
    const getWeekNumber = (date: Date): string => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
      );
      return `${d.getFullYear()}-W${weekNum}`;
    };

    // Create a set of weeks with reading activity
    const activeWeeks = new Set<string>();
    booksWithDates.forEach((book) => {
      const date = new Date(book.dateRead!);
      activeWeeks.add(getWeekNumber(date));
    });

    // Count consecutive weeks from current week backwards
    const today = new Date();
    let currentWeek = getWeekNumber(today);
    let streak = 0;

    // Check if there's activity in the current week
    if (!activeWeeks.has(currentWeek)) {
      // Check last week instead (grace period)
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      currentWeek = getWeekNumber(lastWeek);
      if (!activeWeeks.has(currentWeek)) {
        return 0; // No recent activity
      }
    }

    // Count consecutive weeks
    while (activeWeeks.has(currentWeek)) {
      streak++;
      // Move to previous week
      const [year, week] = currentWeek.split("-W").map(Number);
      let prevWeek = week - 1;
      let prevYear = year;
      if (prevWeek < 1) {
        prevYear--;
        prevWeek = 52; // Approximate, but good enough for streak counting
      }
      currentWeek = `${prevYear}-W${prevWeek}`;
    }

    return streak;
  };

  const updateReadingStats = () => {
    const readBooks = books.filter((book) => book.isRead);
    const totalPages = readBooks.reduce(
      (sum, book) => sum + (book.pageCount || 0),
      0,
    );
    const genres = readBooks.map((book) => book.genre);
    const favoriteGenre =
      genres.length > 0
        ? genres.reduce((a, b, _i, arr) =>
            arr.filter((v) => v === a).length >=
            arr.filter((v) => v === b).length
              ? a
              : b,
          )
        : "";

    const averageRating =
      readBooks.length > 0
        ? readBooks.reduce((sum, book) => sum + (book.rating || 0), 0) /
          readBooks.length
        : 0;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const booksThisYear = readBooks.filter(
      (book) =>
        book.dateRead && new Date(book.dateRead).getFullYear() === currentYear,
    ).length;

    const booksThisMonth = readBooks.filter(
      (book) =>
        book.dateRead &&
        new Date(book.dateRead).getFullYear() === currentYear &&
        new Date(book.dateRead).getMonth() === currentMonth,
    ).length;

    // Calculate reading streak
    const readingStreak = calculateReadingStreak(readBooks);

    setReadingStats({
      totalBooks: readBooks.length,
      totalPages,
      favoriteGenre,
      readingStreak,
      averageRating,
      booksThisMonth,
      booksThisYear,
    });
  };

  const value = {
    books,
    wishlist,
    blogPosts,
    poems,
    readingChallenges,
    readingStats,
    addBook,
    bulkAddBooks,
    updateBook,
    deleteBook,
    addToWishlist,
    removeFromWishlist,
    moveToBookshelf,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addPoem,
    updatePoem,
    deletePoem,
    updateReadingStats,
    addReaction,
    addReviewReaction,
    getBookReactionCount,
    getMostLovedBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
