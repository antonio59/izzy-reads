import React, { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "./AuthContext";
import type {
  Book,
  BlogPost,
  ReadingChallenge,
  ReadingStats,
  Poem,
} from "../types";
import type { Id, Doc } from "../../convex/_generated/dataModel";

interface BookContextType {
  books: Book[];
  wishlist: Book[];
  blogPosts: BlogPost[];
  poems: Poem[];
  readingChallenges: ReadingChallenge[];
  readingStats: ReadingStats;
  isLoading: boolean;
  addBook: (book: Omit<Book, "id">) => Promise<void>;
  bulkAddBooks: (books: Omit<Book, "id">[]) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addToWishlist: (book: Omit<Book, "id">) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  moveToBookshelf: (id: string) => Promise<void>;
  moveToWishlist: (id: string) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, "id">) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addPoem: (poem: Omit<Poem, "id">) => Promise<void>;
  updatePoem: (id: string, updates: Partial<Poem>) => Promise<void>;
  deletePoem: (id: string) => Promise<void>;
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

// Calculate reading streak (consecutive months with at least 1 book read, going back from current month)
function calculateReadingStreak(readBooks: Book[]): number {
  if (readBooks.length === 0) return 0;

  // Get books with valid dateRead, sorted by date descending
  const booksWithDates = readBooks
    .filter((book) => book.dateRead)
    .sort(
      (a, b) =>
        new Date(b.dateRead!).getTime() - new Date(a.dateRead!).getTime(),
    );

  if (booksWithDates.length === 0) return 0;

  // Create a set of "YYYY-MM" strings for months with books read
  const monthsWithBooks = new Set<string>();
  for (const book of booksWithDates) {
    const date = new Date(book.dateRead!);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthsWithBooks.add(monthKey);
  }

  // Start from current month and count consecutive months
  let streak = 0;
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1; // 1-indexed

  // Check if current month has a book - if not, start from previous month
  const currentMonthKey = `${year}-${String(month).padStart(2, "0")}`;
  if (!monthsWithBooks.has(currentMonthKey)) {
    // Check if last month has a book to start the streak
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }

  // Count consecutive months going backwards
  while (true) {
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    if (monthsWithBooks.has(monthKey)) {
      streak++;
      month--;
      if (month === 0) {
        month = 12;
        year--;
      }
    } else {
      break;
    }
    // Safety limit - don't go back more than 5 years
    if (streak > 60) break;
  }

  return streak;
}

// Helper to convert Convex doc to Book type
function convexBookToBook(doc: Doc<"books">): Book {
  return {
    id: doc._id,
    title: doc.title,
    author: doc.author,
    coverUrl: doc.coverUrl,
    isbn: doc.isbn,
    genre: doc.genre,
    pageCount: doc.pageCount,
    description: doc.description,
    ageRating: doc.ageRating,
    dateAdded: doc.dateAdded,
    dateRead: doc.dateRead,
    rating: doc.rating,
    isRead: doc.isRead,
    notes: doc.notes,
    giftFrom: doc.giftFrom,
  };
}

function convexWishlistToBook(doc: Doc<"wishlist">): Book {
  return {
    id: doc._id,
    title: doc.title,
    author: doc.author,
    coverUrl: doc.coverUrl,
    isbn: doc.isbn,
    genre: doc.genre,
    pageCount: doc.pageCount,
    description: doc.description,
    ageRating: doc.ageRating,
    dateAdded: doc.dateAdded,
    isRead: false,
    boughtBy: doc.boughtBy,
    boughtAt: doc.boughtAt,
  };
}

function convexPoemToPoem(doc: Doc<"poems">): Poem {
  return {
    id: doc._id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    emoji: doc.emoji,
    dateCreated: doc.dateCreated,
    likes: doc.likes,
    template: doc.template,
  };
}

function convexBlogPostToBlogPost(doc: Doc<"blogPosts">): BlogPost {
  return {
    id: doc._id,
    title: doc.title,
    content: doc.content,
    bookId: doc.bookId as string | undefined,
    dateCreated: doc.dateCreated,
    dateModified: doc.dateModified,
    status: doc.status as "draft" | "published",
    tags: doc.tags,
    emoji: doc.emoji,
  };
}

function convexChallengeToChallenge(
  doc: Doc<"readingChallenges">,
): ReadingChallenge {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    target: doc.target,
    current: doc.current,
    type: doc.type,
    startDate: doc.startDate,
    endDate: doc.endDate,
    completed: doc.completed,
    badge: doc.badge,
  };
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const { convexUserId } = useAuth();

  // This is Izzy's personal site - ALL data belongs to her regardless of who's logged in
  // Parents/family log in to help manage the site, but all content is Izzy's
  const booksData = useQuery(api.books.getAll);
  const wishlistData = useQuery(api.wishlist.getAll);
  const poemsData = useQuery(api.poems.getAll);

  // Blog posts - get all for the site
  const blogPostsData = useQuery(api.blogPosts.getAll);

  // Reading challenges - these are user-specific goals
  const challengesData = useQuery(
    api.readingChallenges.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );

  // Convex mutations
  const addBookMutation = useMutation(api.books.add);
  const bulkAddBooksMutation = useMutation(api.books.bulkAdd);
  const updateBookMutation = useMutation(api.books.update);
  const removeBookMutation = useMutation(api.books.remove);

  const addWishlistMutation = useMutation(api.wishlist.add);
  const removeWishlistMutation = useMutation(api.wishlist.remove);

  const addPoemMutation = useMutation(api.poems.add);
  const updatePoemMutation = useMutation(api.poems.update);
  const removePoemMutation = useMutation(api.poems.remove);

  const addBlogPostMutation = useMutation(api.blogPosts.add);
  const updateBlogPostMutation = useMutation(api.blogPosts.update);
  const removeBlogPostMutation = useMutation(api.blogPosts.remove);

  // Convert Convex data to our types
  const books = useMemo(() => {
    return (booksData || []).map(convexBookToBook);
  }, [booksData]);

  const wishlist = useMemo(() => {
    return (wishlistData || []).map(convexWishlistToBook);
  }, [wishlistData]);

  const poems = useMemo(() => {
    return (poemsData || []).map(convexPoemToPoem);
  }, [poemsData]);

  const blogPosts = useMemo(() => {
    return (blogPostsData || []).map(convexBlogPostToBlogPost);
  }, [blogPostsData]);

  const readingChallenges = useMemo(() => {
    return (challengesData || []).map(convexChallengeToChallenge);
  }, [challengesData]);

  const isLoading = booksData === undefined || wishlistData === undefined;

  // Calculate reading stats
  const readingStats = useMemo((): ReadingStats => {
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

    // Calculate reading streak (consecutive months with at least 1 book read)
    const readingStreak = calculateReadingStreak(readBooks);

    return {
      totalBooks: readBooks.length,
      totalPages,
      favoriteGenre,
      readingStreak,
      averageRating,
      booksThisMonth,
      booksThisYear,
    };
  }, [books]);

  // Book operations
  const addBook = async (book: Omit<Book, "id">) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await addBookMutation({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      isbn: book.isbn,
      genre: book.genre,
      pageCount: book.pageCount,
      description: book.description,
      ageRating: book.ageRating || "8+",
      dateAdded: book.dateAdded || new Date().toISOString().split("T")[0],
      dateRead: book.dateRead,
      rating: book.rating,
      isRead: book.isRead,
      notes: book.notes,
      giftFrom: book.giftFrom,
    });
  };

  const bulkAddBooks = async (newBooks: Omit<Book, "id">[]) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await bulkAddBooksMutation({
      books: newBooks.map((book) => ({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        isbn: book.isbn,
        genre: book.genre,
        pageCount: book.pageCount,
        description: book.description,
        ageRating: book.ageRating || "8+",
        dateAdded: book.dateAdded || new Date().toISOString().split("T")[0],
        dateRead: book.dateRead,
        rating: book.rating,
        isRead: book.isRead,
        notes: book.notes,
      })),
    });
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { id: _id, ...rest } = updates;
    await updateBookMutation({
      id: id as Id<"books">,
      title: rest.title,
      author: rest.author,
      coverUrl: rest.coverUrl,
      isbn: rest.isbn,
      genre: rest.genre,
      pageCount: rest.pageCount,
      description: rest.description,
      ageRating: rest.ageRating,
      dateRead: rest.dateRead,
      rating: rest.rating,
      isRead: rest.isRead,
      notes: rest.notes,
    });
  };

  const deleteBook = async (id: string) => {
    await removeBookMutation({ id: id as Id<"books"> });
  };

  // Wishlist operations
  const addToWishlist = async (book: Omit<Book, "id">) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await addWishlistMutation({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      isbn: book.isbn,
      genre: book.genre,
      pageCount: book.pageCount,
      description: book.description,
      ageRating: book.ageRating || "8+",
      dateAdded: book.dateAdded || new Date().toISOString().split("T")[0],
    });
  };

  const removeFromWishlist = async (id: string) => {
    await removeWishlistMutation({ id: id as Id<"wishlist"> });
  };

  const moveToBookshelf = async (id: string) => {
    const book = wishlist.find((b) => b.id === id);
    if (book) {
      await removeFromWishlist(id);
      await addBook({
        ...book,
        isRead: true,
        dateRead: new Date().toISOString().split("T")[0],
      });
    }
  };

  const moveToWishlist = async (id: string) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      await deleteBook(id);
      await addToWishlist({
        ...book,
        isRead: false,
        dateRead: undefined,
        rating: undefined,
        notes: undefined,
      });
    }
  };

  // Blog post operations
  const addBlogPost = async (post: Omit<BlogPost, "id">) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await addBlogPostMutation({
      title: post.title,
      content: post.content,
      bookId: post.bookId as Id<"books"> | undefined,
      dateCreated: post.dateCreated,
      dateModified: post.dateModified,
      status: post.status,
      tags: post.tags,
      emoji: post.emoji,
    });
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    const { id: _id, ...rest } = updates;
    await updateBlogPostMutation({
      id: id as Id<"blogPosts">,
      title: rest.title,
      content: rest.content,
      bookId: rest.bookId as Id<"books"> | undefined,
      dateModified: rest.dateModified || new Date().toISOString(),
      status: rest.status,
      tags: rest.tags,
      emoji: rest.emoji,
    });
  };

  const deleteBlogPost = async (id: string) => {
    await removeBlogPostMutation({ id: id as Id<"blogPosts"> });
  };

  // Poem operations
  const addPoem = async (poem: Omit<Poem, "id">) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await addPoemMutation({
      title: poem.title,
      content: poem.content,
      emoji: poem.emoji,
      dateCreated: poem.dateCreated,
      likes: poem.likes || 0,
      template: poem.template,
    });
  };

  const updatePoem = async (id: string, updates: Partial<Poem>) => {
    const { id: _id, ...rest } = updates;
    await updatePoemMutation({
      id: id as Id<"poems">,
      title: rest.title,
      content: rest.content,
      emoji: rest.emoji,
      likes: rest.likes,
      template: rest.template,
    });
  };

  const deletePoem = async (id: string) => {
    await removePoemMutation({ id: id as Id<"poems"> });
  };

  const value = {
    books,
    wishlist,
    blogPosts,
    poems,
    readingChallenges,
    readingStats,
    isLoading,
    addBook,
    bulkAddBooks,
    updateBook,
    deleteBook,
    addToWishlist,
    removeFromWishlist,
    moveToBookshelf,
    moveToWishlist,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addPoem,
    updatePoem,
    deletePoem,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
