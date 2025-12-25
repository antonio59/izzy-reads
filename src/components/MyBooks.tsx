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
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import BookSearch from "./BookSearch";
import { BookDetailModal } from "./BookDetailModal";
import { EditBookModal } from "./EditBookModal";
import { BookSuggestionsList } from "./BookSuggestionsList";
import type { Book } from "../types";
import type { Id } from "../../convex/_generated/dataModel";

type TabType = "read" | "want-to-read";

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

  const readBooks = books.filter((book) => book.isRead);

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

  const filteredWishlist = wishlist.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddBook = async (book: Book) => {
    if (activeTab === "read") {
      await addBook(book);
    } else {
      await addToWishlist(book);
    }
    setShowSearch(false);
  };

  const handleMoveToRead = async (bookId: string) => {
    await moveToBookshelf(bookId);
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
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              My Books
            </h1>
            <p className="text-white/90 mt-1">
              {readBooks.length} books read · {wishlist.length} on your list
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowSearch(true)}
              className="bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Book
            </motion.button>
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
      <div className="flex gap-2 bg-stone-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("read")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "read"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Read ({readBooks.length})
        </button>
        <button
          onClick={() => setActiveTab("want-to-read")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "want-to-read"
              ? "bg-white text-pink-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Heart className="w-4 h-4" />
          Want to Read ({wishlist.length})
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search your books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Gift Giver Filter - only show on Read tab when there are gift givers */}
        {activeTab === "read" && giftGivers.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowGiftFilter(!showGiftFilter)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                giftFromFilter
                  ? "bg-pink-100 text-pink-700 border border-pink-200"
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
                  className="ml-1 p-0.5 hover:bg-pink-200 rounded-full"
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
                          ? "bg-pink-50 text-pink-700"
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
                            ? "bg-pink-50 text-pink-700"
                            : "hover:bg-stone-50 text-stone-700"
                        }`}
                      >
                        <Gift className="w-4 h-4 text-pink-400" />
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
        <div className="flex items-center gap-2 text-sm text-pink-600 bg-pink-50 px-4 py-2 rounded-lg w-fit">
          <Gift className="w-4 h-4" />
          Showing books from{" "}
          <span className="font-semibold">{giftFromFilter}</span>
          <button
            onClick={() => setGiftFromFilter("")}
            className="ml-2 text-pink-500 hover:text-pink-700"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Book Grid */}
      {activeTab === "read" ? (
        filteredReadBooks.length > 0 ? (
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
            icon={BookOpen}
            title="No books yet"
            description="Start adding books you've read!"
            actionLabel="Add Your First Book"
            onAction={() => setShowSearch(true)}
          />
        )
      ) : (
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
                  onMarkRead={() => handleMoveToRead(book.id)}
                  onRemove={() => handleRemoveFromWishlist(book.id)}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </AnimatedGrid>
          ) : (
            <EmptyState
              icon={Heart}
              title="Your reading list is empty"
              description="Add books you want to read next!"
              actionLabel="Find Books"
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
        book={editingBook}
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        onSave={async (bookId, updates) => {
          await updateBook(bookId, updates);
          setEditingBook(null);
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
      <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-indigo-100 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-purple-300" />
          </div>
        )}
        {/* Rating badge */}
        {book.rating && book.rating > 0 && (
          <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span>{book.rating}</span>
            <span>★</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-stone-900 text-sm line-clamp-1">
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 text-xs bg-purple-100 text-purple-600 py-1.5 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
            title={book.notes ? "Edit Review" : "Write Review"}
          >
            <Edit3 className="w-3 h-3" />
            {book.notes ? "Edit" : "Review"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveToWishlist();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
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

// Wishlist Card Component
interface WishlistCardProps {
  book: Book;
  onMarkRead: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  book,
  onMarkRead,
  onRemove,
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
      <div className="aspect-[2/3] bg-gradient-to-br from-pink-100 to-purple-100 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-pink-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-stone-900 text-sm line-clamp-1">
          {book.title}
        </h3>
        <p className="text-stone-500 text-xs line-clamp-1">{book.author}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead();
            }}
            className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            I Read It!
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            ×
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
      <h3 className="text-xl font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-700 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default MyBooks;
