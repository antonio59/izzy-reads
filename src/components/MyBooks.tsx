import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  BookOpen,
  Heart,
  Plus,
  Search,
  Trash2,
  ArrowRight,
  MessageCircle,
  X,
  Library,
  Edit3,
  Gift,
  BookMarked,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import BookSearch from "./BookSearch";
import type { BookDestination } from "./ui/BookSearchModal";
import { BookDetailModal } from "./BookDetailModal";
import { EditBookModal } from "./EditBookModal";
import { BookSuggestionsList } from "./BookSuggestionsList";
import { FinishRitual } from "./FinishRitual";
import type { Book } from "../types";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";

type TabType = "read" | "reading" | "wishlist";

const MyBooks: React.FC = () => {
  const {
    books,
    wishlist,
    addBook,
    updateBook,
    addToWishlist,
    removeFromWishlist,
    moveToBookshelf,
    moveToWishlist,
    deleteBook,
  } = useBooks();
  const { convexUserId } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("read");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [finishedBook, setFinishedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [giftFromFilter, setGiftFromFilter] = useState<string>("");
  const [showGiftFilter, setShowGiftFilter] = useState(false);

  // Book suggestions
  const suggestions = useQuery(api.bookSuggestions.getAll);
  const pendingCount = useQuery(api.bookSuggestions.getPendingCount);
  const approveSuggestion = useMutation(api.bookSuggestions.addToWishlist);
  const updateSuggestionStatus = useMutation(api.bookSuggestions.updateStatus);
  const removeSuggestion = useMutation(api.bookSuggestions.remove);
  const syncSeriesCompletion = useMutation(api.series.syncCompletionForBook);

  const readBooks = books.filter((book) => book.isRead);
  const readingBooks = books.filter((book) => !book.isRead);

  // Get unique gift givers for filter
  const giftGivers = useMemo(() => {
    const givers = new Set<string>();
    readBooks.forEach((book) => {
      if (book.giftFrom && book.giftFrom.trim()) {
        givers.add(book.giftFrom.trim());
      }
    });
    return Array.from(givers).sort();
  }, [readBooks]);

  // Filter books based on search and gift giver
  const filteredReadBooks = readBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGiftFilter =
      !giftFromFilter || book.giftFrom === giftFromFilter;
    return matchesSearch && matchesGiftFilter;
  });

  const filteredReadingBooks = readingBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredWishlist = wishlist.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddBook = async (book: Book, destination: BookDestination) => {
    if (destination === "wishlist") {
      await addToWishlist(book);
      setShowSearch(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const isRead = destination === "read";
    const bookWithStatus = {
      ...book,
      isRead,
      dateRead: isRead ? book.dateRead || today : book.dateRead,
    };
    const newId = await addBook(bookWithStatus);
    setShowSearch(false);

    if (isRead) {
      setFinishedBook({
        ...bookWithStatus,
        id: newId,
        isRead: true,
      });
      setActiveTab("read");
    }
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    await removeFromWishlist(bookId);
  };

  const handleMoveToWishlist = async (bookId: string) => {
    await moveToWishlist(bookId);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm("Are you sure you want to remove this book?")) {
      await deleteBook(bookId);
    }
  };

  // Suggestion handlers
  const handleApproveSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    if (!convexUserId) return;
    await approveSuggestion({ suggestionId });
  };

  const handleDeclineSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    await updateSuggestionStatus({ id: suggestionId, status: "declined" });
  };

  const handleDeleteSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    await removeSuggestion({ id: suggestionId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              My Books
            </h1>
            <p className="text-white/90 mt-1">
              {readBooks.length} finished · {readingBooks.length} reading ·{" "}
              {wishlist.length} on wishlist
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-5 h-5" />}
              iconPosition="left"
              onClick={() => setShowSearch(true)}
            >
              Add Book
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-white/20">
          <Link
            to="/series"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <Library className="w-4 h-4" />
            Series Tracker
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-stone-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("read")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "read"
              ? "bg-white text-green-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">Finished</span> ({readBooks.length}
          )
        </button>
        <button
          onClick={() => setActiveTab("reading")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "reading"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span className="hidden sm:inline">Reading</span> (
          {readingBooks.length})
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "wishlist"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">Wishlist</span> ({wishlist.length})
        </button>
      </div>

      {/* Tab Description */}
      <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl p-4 border border-stone-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {activeTab === "read" && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            {activeTab === "reading" && (
              <BookMarked className="w-5 h-5 text-blue-500" />
            )}
            {activeTab === "wishlist" && (
              <Heart className="w-5 h-5 text-primary-500" />
            )}
          </div>
          <div>
            {activeTab === "read" && (
              <>
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  Books I've Finished{" "}
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-sm text-stone-600 mt-0.5">
                  These are all the books you've finished reading! You can write
                  reviews, give star ratings, and share your thoughts about each
                  one.
                </p>
              </>
            )}
            {activeTab === "reading" && (
              <>
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  Currently Reading{" "}
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </h3>
                <p className="text-sm text-stone-600 mt-0.5">
                  Books you're reading right now! When you finish one, click "I
                  Finished!" to move it to your finished books and write a
                  review.
                </p>
              </>
            )}
            {activeTab === "wishlist" && (
              <>
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  My Wishlist <Gift className="w-4 h-4 text-primary-500" />
                </h3>
                <p className="text-sm text-stone-600 mt-0.5">
                  Books you want to read someday! Add books here that look
                  interesting. When you start reading one, click "Start Reading"
                  to move it to your reading list.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search your books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Gift Giver Filter - only show on Read tab when there are gift givers */}
        {activeTab === "read" && giftGivers.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowGiftFilter(!showGiftFilter)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                giftFromFilter
                  ? "bg-primary-100 text-primary-700 border border-primary-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
              }`}
            >
              <Gift className="w-4 h-4" />
              {giftFromFilter || "Gift from..."}
              {giftFromFilter && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGiftFromFilter("");
                  }}
                  className="ml-1 p-0.5 hover:bg-primary-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>

            <AnimatePresence>
              {showGiftFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden"
                >
                  <div className="p-2 border-b border-stone-100 bg-stone-50">
                    <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      Filter by gift giver
                    </p>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setGiftFromFilter("");
                        setShowGiftFilter(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        !giftFromFilter
                          ? "bg-primary-50 text-primary-700"
                          : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      All books
                    </button>
                    {giftGivers.map((giver) => (
                      <button
                        key={giver}
                        onClick={() => {
                          setGiftFromFilter(giver);
                          setShowGiftFilter(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                          giftFromFilter === giver
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-stone-50 text-stone-700"
                        }`}
                      >
                        <Gift className="w-4 h-4 text-primary-400" />
                        {giver}
                        <span className="ml-auto text-xs text-stone-400">
                          {readBooks.filter((b) => b.giftFrom === giver).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Active filter indicator */}
      {giftFromFilter && (
        <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-lg w-fit">
          <Gift className="w-4 h-4" />
          Showing books from{" "}
          <span className="font-semibold">{giftFromFilter}</span>
          <button
            onClick={() => setGiftFromFilter("")}
            className="ml-2 text-primary-500 hover:text-primary-700"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Book Grid */}
      {activeTab === "read" &&
        (filteredReadBooks.length > 0 ? (
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredReadBooks.map((book) => (
              <ReadBookCard
                key={book.id}
                book={book}
                onMoveToWishlist={() => handleMoveToWishlist(book.id)}
                onRemove={() => handleDeleteBook(book.id)}
                onEdit={() => setEditingBook(book)}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </AnimatedGrid>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="No finished books yet"
            description="When you finish reading a book, it will appear here! You can write reviews and give star ratings."
            actionLabel="Add a Finished Book"
            onAction={() => setShowSearch(true)}
          />
        ))}

      {activeTab === "reading" &&
        (filteredReadingBooks.length > 0 ? (
          <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredReadingBooks.map((book) => (
              <ReadingBookCard
                key={book.id}
                book={book}
                onMarkFinished={async () => {
                  const today = new Date().toISOString().slice(0, 10);
                  await updateBook(book.id, {
                    isRead: true,
                    dateRead: today,
                  });
                  try {
                    await syncSeriesCompletion({
                      bookId: book.id as Id<"books">,
                    });
                  } catch {
                    // Series sync is best-effort
                  }
                  setFinishedBook({ ...book, isRead: true, dateRead: today });
                  setActiveTab("read");
                }}
                onRemove={() => handleDeleteBook(book.id)}
                onEdit={() => setEditingBook(book)}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </AnimatedGrid>
        ) : (
          <EmptyState
            icon={BookMarked}
            title="Not reading anything right now"
            description="Add a book you're currently reading, or pick one from your wishlist to start!"
            actionLabel="Add a Book I'm Reading"
            onAction={() => setShowSearch(true)}
          />
        ))}

      {activeTab === "wishlist" && (
        <>
          {/* Book Suggestions Section */}
          {suggestions && suggestions.length > 0 && (
            <div className="mb-6">
              <BookSuggestionsList
                suggestions={suggestions}
                pendingCount={pendingCount}
                isExpanded={showSuggestions}
                onToggle={() => setShowSuggestions(!showSuggestions)}
                onApprove={handleApproveSuggestion}
                onDecline={handleDeclineSuggestion}
                onDelete={handleDeleteSuggestion}
                variant="compact"
              />
            </div>
          )}

          {/* Wishlist Books */}
          {filteredWishlist.length > 0 ? (
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredWishlist.map((book) => (
                <WishlistCard
                  key={book.id}
                  book={book}
                  onStartReading={async () => {
                    await moveToBookshelf(book.id);
                    // The book will be added with isRead: false by default
                  }}
                  onRemove={() => handleRemoveFromWishlist(book.id)}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </AnimatedGrid>
          ) : (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Add books you want to read someday! Ask family and friends for recommendations too."
              actionLabel="Find Books to Add"
              onAction={() => setShowSearch(true)}
            />
          )}
        </>
      )}

      {/* Book Search Modal */}
      {showSearch && (
        <BookSearch
          onAddBook={handleAddBook}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={(book) => {
            setSelectedBook(null);
            setEditingBook(book);
          }}
          showActions={true}
        />
      )}

      {/* Edit Book Modal */}
      <EditBookModal
        key={editingBook?.id || "new"}
        book={editingBook}
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        onSave={async (bookId, updates) => {
          await updateBook(bookId, updates);
          setEditingBook(null);
        }}
      />

      <FinishRitual
        book={finishedBook}
        onClose={() => setFinishedBook(null)}
        onWriteReview={(book) => {
          setFinishedBook(null);
          setEditingBook(book);
        }}
      />
    </div>
  );
};

// Stagger container for grid animations
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

// Animated Grid component
const AnimatedGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

// Read Book Card Component
interface ReadBookCardProps {
  book: Book;
  onMoveToWishlist: () => void;
  onRemove: () => void;
  onEdit: () => void;
  onClick: () => void;
}

const ReadBookCard: React.FC<ReadBookCardProps> = ({
  book,
  onMoveToWishlist,
  onRemove,
  onEdit,
  onClick,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden group cursor-pointer hover:shadow-lg"
      variants={staggerItem}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-gradient-to-br from-primary-100 to-accent-100 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary-300" />
          </div>
        )}
        {/* Rating badge */}
        {book.rating && book.rating > 0 && (
          <Badge variant="warning" size="sm" className="absolute top-2 right-2">
            {book.rating} ★
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-stone-900 text-sm line-clamp-1">
          {book.title}
        </h3>
        <p className="text-stone-500 text-xs line-clamp-1">{book.author}</p>

        {/* Review indicator */}
        {book.notes && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <MessageCircle className="w-3 h-3" />
            <span>Reviewed</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 !text-xs"
            icon={<Edit3 className="w-3 h-3" />}
            iconPosition="left"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title={book.notes ? "Edit Review" : "Write Review"}
          >
            {book.notes ? "Edit" : "Review"}
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveToWishlist();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            title="Move to Want to Read"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Reading Book Card Component (Currently Reading)
interface ReadingBookCardProps {
  book: Book;
  onMarkFinished: () => void;
  onRemove: () => void;
  onEdit: () => void;
  onClick: () => void;
}

const ReadingBookCard: React.FC<ReadingBookCardProps> = ({
  book,
  onMarkFinished,
  onRemove,
  onEdit,
  onClick,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden group cursor-pointer hover:shadow-lg"
      variants={staggerItem}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-gradient-to-br from-accent-100 to-accent-200 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookMarked className="w-12 h-12 text-blue-300" />
          </div>
        )}
        {/* Currently reading badge */}
        <Badge
          variant="primary"
          size="sm"
          icon={<BookOpen className="w-3 h-3" />}
          className="absolute top-2 left-2"
        >
          Reading
        </Badge>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-stone-900 text-sm line-clamp-1">
          {book.title}
        </h3>
        <p className="text-stone-500 text-xs line-clamp-1">{book.author}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 !text-xs"
            icon={<CheckCircle2 className="w-3 h-3" />}
            iconPosition="left"
            onClick={(e) => {
              e.stopPropagation();
              onMarkFinished();
            }}
          >
            Finished!
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Wishlist Card Component
interface WishlistCardProps {
  book: Book;
  onStartReading: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  book,
  onStartReading,
  onRemove,
  onClick,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden group cursor-pointer hover:shadow-lg"
      variants={staggerItem}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-gradient-to-br from-primary-100 to-accent-100 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-primary-300" />
          </div>
        )}
        {/* Wishlist badge */}
        <Badge
          variant="error"
          size="sm"
          icon={<Heart className="w-3 h-3" />}
          className="absolute top-2 left-2"
        >
          Want
        </Badge>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-stone-900 text-sm line-clamp-1">
          {book.title}
        </h3>
        <p className="text-stone-500 text-xs line-clamp-1">{book.author}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 !text-xs"
            icon={<BookOpen className="w-3 h-3" />}
            iconPosition="left"
            onClick={(e) => {
              e.stopPropagation();
              onStartReading();
            }}
          >
            Start Reading
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove from wishlist"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-stone-400" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 mb-6">{description}</p>
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
};

export default MyBooks;
