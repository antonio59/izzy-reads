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

  // Initialize with sample data
  useEffect(() => {
    // Generate recent dates for sample data
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const threeWeeksAgo = new Date(today);
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Izzy's actual book collection with cover images from Open Library
    // Covers use Open Library's ISBN-based URLs: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
    const sampleBooks: Book[] = [
      // Diary of a Wimpy Kid Series - Jeff Kinney
      {
        id: "1",
        title: "Diary of a Wimpy Kid",
        author: "Jeff Kinney",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 217,
        isbn: "9780141324906",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324906-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
        rating: 4,
        notes: "Greg is so funny! I love his drawings.",
        reactions: {
          love: 12,
          amazing: 8,
          mustRead: 5,
          soGood: 3,
          notForMe: 0,
        },
      },
      {
        id: "2",
        title: "Diary of a Wimpy Kid: Rodrick Rules",
        author: "Jeff Kinney",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 224,
        isbn: "9780141324913",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324913-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
      },
      {
        id: "3",
        title: "Diary of a Wimpy Kid: The Last Straw",
        author: "Jeff Kinney",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 224,
        isbn: "9780141324920",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780141324920-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
      },
      {
        id: "4",
        title: "Diary of a Wimpy Kid: Dog Days",
        author: "Jeff Kinney",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 224,
        isbn: "9780141331973",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780141331973-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
      },
      // Tom Gates Series - Liz Pichon
      {
        id: "5",
        title: "Tom Gates: DogZombies Rule (For Now)",
        author: "Liz Pichon",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 400,
        isbn: "9781407143231",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781407143231-L.jpg",
        isRead: true,
        dateAdded: formatDate(twoWeeksAgo),
      },
      {
        id: "6",
        title: "Tom Gates: Top of the Class (Nearly)",
        author: "Liz Pichon",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 400,
        isbn: "9781407148328",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781407148328-L.jpg",
        isRead: true,
        dateAdded: formatDate(twoWeeksAgo),
      },
      // Other Fiction
      {
        id: "7",
        title: "Bunny vs Monkey",
        author: "Jamie Smart",
        genre: "Fiction",
        ageRating: "7-10",
        pageCount: 208,
        isbn: "9781788451420",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781788451420-L.jpg",
        isRead: true,
        dateAdded: formatDate(twoWeeksAgo),
      },
      {
        id: "8",
        title: "Dork Diaries",
        author: "Rachel Renee Russell",
        genre: "Fiction",
        ageRating: "9-12",
        pageCount: 282,
        isbn: "9781847387127",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781847387127-L.jpg",
        isRead: true,
        dateAdded: formatDate(twoWeeksAgo),
        rating: 5,
        notes: "So funny! I love Nikki and her diary entries.",
        reactions: {
          love: 15,
          amazing: 10,
          mustRead: 8,
          soGood: 6,
          notForMe: 0,
        },
      },
      // David Walliams Books
      {
        id: "9",
        title: "The World's Worst Teachers",
        author: "David Walliams",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 448,
        isbn: "9780008305796",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780008305796-L.jpg",
        isRead: true,
        dateAdded: formatDate(oneWeekAgo),
        rating: 4,
      },
      {
        id: "10",
        title: "Billionaire Boy",
        author: "David Walliams",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 277,
        isbn: "9780007371082",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780007371082-L.jpg",
        isRead: true,
        dateAdded: formatDate(oneWeekAgo),
        rating: 5,
        notes: "David Walliams is hilarious! This book made me laugh so much.",
        reactions: {
          love: 20,
          amazing: 15,
          mustRead: 12,
          soGood: 10,
          notForMe: 0,
        },
      },
      {
        id: "11",
        title: "Gangsta Granny",
        author: "David Walliams",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 295,
        isbn: "9780007371464",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780007371464-L.jpg",
        isRead: true,
        dateAdded: formatDate(oneWeekAgo),
        rating: 5,
      },
      {
        id: "12",
        title: "The Boy in the Dress",
        author: "David Walliams",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 227,
        isbn: "9780007279043",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780007279043-L.jpg",
        isRead: true,
        dateAdded: formatDate(oneWeekAgo),
      },
      {
        id: "13",
        title: "Ratburger",
        author: "David Walliams",
        genre: "Fiction",
        ageRating: "8-12",
        pageCount: 304,
        isbn: "9780007453535",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780007453535-L.jpg",
        isRead: true,
        dateAdded: formatDate(oneWeekAgo),
      },
      // Non-Fiction
      {
        id: "14",
        title: "You Are a Champion",
        author: "Marcus Rashford",
        genre: "Non-Fiction",
        ageRating: "8-12",
        pageCount: 192,
        isbn: "9781529068177",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781529068177-L.jpg",
        isRead: true,
        dateAdded: formatDate(today),
        rating: 5,
        notes: "Such an inspiring book! Marcus Rashford is a great role model.",
        reactions: {
          love: 25,
          amazing: 18,
          mustRead: 20,
          soGood: 15,
          notForMe: 0,
        },
      },
      // Treehouse Series - Andy Griffiths
      {
        id: "15",
        title: "The 13-Storey Treehouse",
        author: "Andy Griffiths",
        genre: "Fiction",
        ageRating: "7-10",
        pageCount: 240,
        isbn: "9781447279785",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781447279785-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
        rating: 5,
        reactions: { love: 8, amazing: 5, mustRead: 3, soGood: 4, notForMe: 0 },
      },
      {
        id: "16",
        title: "The 26-Storey Treehouse",
        author: "Andy Griffiths",
        genre: "Fiction",
        ageRating: "7-10",
        pageCount: 288,
        isbn: "9781447279808",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781447279808-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
      },
      {
        id: "17",
        title: "The 39-Storey Treehouse",
        author: "Andy Griffiths",
        genre: "Fiction",
        ageRating: "7-10",
        pageCount: 384,
        isbn: "9781447281580",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781447281580-L.jpg",
        isRead: true,
        dateAdded: formatDate(twoWeeksAgo),
      },
      {
        id: "18",
        title: "The 78-Storey Treehouse",
        author: "Andy Griffiths",
        genre: "Fiction",
        ageRating: "7-10",
        pageCount: 384,
        isbn: "9781509833771",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781509833771-L.jpg",
        isRead: true,
        dateAdded: formatDate(twoWeeksAgo),
      },
      // Other
      {
        id: "19",
        title: "Geekhood: Close Encounters of the Girl Kind",
        author: "Andy Robb",
        genre: "Fiction",
        ageRating: "10-14",
        pageCount: 320,
        isbn: "9781847153562",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781847153562-L.jpg",
        isRead: true,
        dateAdded: formatDate(oneWeekAgo),
      },
      {
        id: "20",
        title: "Fairy Tales",
        author: "Hans Christian Andersen",
        genre: "Fantasy",
        ageRating: "All Ages",
        pageCount: 200,
        isbn: "9780141329017",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780141329017-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
      },
      {
        id: "21",
        title: "Italian-English Visual Dictionary",
        author: "DK Publishing",
        genre: "Non-Fiction",
        ageRating: "All Ages",
        pageCount: 360,
        isbn: "9780241317556",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780241317556-L.jpg",
        isRead: true,
        dateAdded: formatDate(threeWeeksAgo),
      },
    ]

      // Sort alphabetically by title as default
      .sort((a, b) => a.title.localeCompare(b.title));

    const sampleWishlist: Book[] = [
      {
        id: "3",
        title: "The Wild Robot",
        author: "Peter Brown",
        genre: "Adventure",
        ageRating: "8+",
        dateAdded: "2024-02-10",
        isRead: false,
        pageCount: 279,
      },
    ];

    const currentYear = new Date().getFullYear();
    const sampleChallenges: ReadingChallenge[] = [
      {
        id: "1",
        title: "Read 20 Books This Year",
        description:
          "Challenge yourself to read 20 books before the year ends!",
        target: 20,
        current: 3,
        type: "books",
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        completed: false,
        badge: "📚",
      },
    ];

    setBooks(sampleBooks);
    setWishlist(sampleWishlist);
    setReadingChallenges(sampleChallenges);
    updateReadingStats();
  }, []);

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
