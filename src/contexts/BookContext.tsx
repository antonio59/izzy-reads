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
  BookReactions,
  ReviewReactions,
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
  addBlogPost: (post: Omit<BlogPost, "id">) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addPoem: (poem: Omit<Poem, "id">) => Promise<void>;
  updatePoem: (id: string, updates: Partial<Poem>) => Promise<void>;
  deletePoem: (id: string) => Promise<void>;
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
  };
}

function convexPoemToPoem(doc: Doc<"poems">): Poem {
  return {
    id: doc._id,
    title: doc.title,
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

  // Convex queries - only run when we have a user ID
  const booksData = useQuery(
    api.books.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );
  const wishlistData = useQuery(
    api.wishlist.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );
  const poemsData = useQuery(
    api.poems.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );
  const blogPostsData = useQuery(
    api.blogPosts.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );
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

    return {
      totalBooks: readBooks.length,
      totalPages,
      favoriteGenre,
      readingStreak: 0, // TODO: Calculate properly
      averageRating,
      booksThisMonth,
      booksThisYear,
    };
  }, [books]);

  // Book operations
  const addBook = async (book: Omit<Book, "id">) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await addBookMutation({
      userId: convexUserId,
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
    });
  };

  const bulkAddBooks = async (newBooks: Omit<Book, "id">[]) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await bulkAddBooksMutation({
      userId: convexUserId,
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
      userId: convexUserId,
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

  // Blog post operations
  const addBlogPost = async (post: Omit<BlogPost, "id">) => {
    if (!convexUserId) throw new Error("Not authenticated");
    await addBlogPostMutation({
      userId: convexUserId,
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
      userId: convexUserId,
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

  // Reaction operations (local for now - TODO: add to Convex)
  const addReaction = (bookId: string, reactionType: keyof BookReactions) => {
    console.log("TODO: Implement reactions in Convex", bookId, reactionType);
  };

  const addReviewReaction = (
    bookId: string,
    reactionType: keyof ReviewReactions,
  ) => {
    console.log(
      "TODO: Implement review reactions in Convex",
      bookId,
      reactionType,
    );
  };

  const getBookReactionCount = (book: Book): number => {
    if (!book.reactions) return 0;
    return (
      book.reactions.love +
      book.reactions.amazing +
      book.reactions.mustRead +
      book.reactions.soGood
    );
  };

  const getMostLovedBooks = (): Book[] => {
    return [...books]
      .filter((book) => book.isRead && getBookReactionCount(book) > 0)
      .sort((a, b) => getBookReactionCount(b) - getBookReactionCount(a));
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
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addPoem,
    updatePoem,
    deletePoem,
    addReaction,
    addReviewReaction,
    getBookReactionCount,
    getMostLovedBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
