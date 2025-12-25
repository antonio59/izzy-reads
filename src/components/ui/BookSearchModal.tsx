import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Loader2, X, Plus, Heart } from "lucide-react";
import {
  searchBooks,
  suggestGenre,
  determineAgeRating,
  type UnifiedBook,
} from "../../services/bookApi";
import { useToastActions } from "./Toast";
import type { Book } from "../../types";

export type BookSearchMode = "bookshelf" | "wishlist";

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Omit<Book, "id">) => void | Promise<void>;
  mode: BookSearchMode;
  title?: string;
}

const modeConfig = {
  bookshelf: {
    title: "Add Book to Bookshelf",
    buttonText: "Add to My Bookshelf",
    buttonIcon: Plus,
    gradient: "from-primary-500 to-accent-500",
    buttonGradient:
      "from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600",
  },
  wishlist: {
    title: "Add Book to Wishlist",
    buttonText: "Add to Wishlist",
    buttonIcon: Heart,
    gradient: "from-accent-500 to-primary-500",
    buttonGradient:
      "from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600",
  },
};

export function BookSearchModal({
  isOpen,
  onClose,
  onAddBook,
  mode,
  title,
}: BookSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnifiedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<UnifiedBook | null>(null);
  const [adding, setAdding] = useState(false);
  const toast = useToastActions();

  const config = modeConfig[mode];
  const ButtonIcon = config.buttonIcon;

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const books = await searchBooks(query, 12);
      setResults(books);
      if (books.length === 0) {
        toast.info("No books found", "Try a different search term.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectBook = (book: UnifiedBook) => {
    setSelectedBook(book);
  };

  const handleAddBook = async () => {
    if (!selectedBook) return;

    setAdding(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const newBook: Omit<Book, "id"> = {
        title: selectedBook.title,
        author: selectedBook.author,
        coverUrl: selectedBook.coverUrl,
        isbn: selectedBook.isbn,
        genre: suggestGenre(selectedBook),
        pageCount: selectedBook.pageCount,
        description: selectedBook.description,
        ageRating: determineAgeRating(selectedBook),
        dateAdded: today,
        dateRead: mode === "bookshelf" ? today : undefined,
        isRead: mode === "bookshelf",
      };

      await onAddBook(newBook);
      handleClose();
    } catch (error) {
      console.error("Failed to add book:", error);
      // Don't show toast here - parent component should handle it
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelectedBook(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                {title || config.title}
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by title, author, or ISBN..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <AnimatePresence mode="wait">
              {selectedBook ? (
                // Book Details View
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button
                    onClick={handleBack}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    ← Back to results
                  </button>

                  <div className="flex gap-6">
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      className="w-48 h-72 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-book-cover.png";
                      }}
                    />

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold text-stone-800 mb-2">
                          {selectedBook.title}
                        </h3>
                        <p className="text-xl text-stone-600">
                          by {selectedBook.author}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {selectedBook.publishYear && (
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            📅 {selectedBook.publishYear}
                          </span>
                        )}
                        {selectedBook.pageCount && (
                          <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                            📄 {selectedBook.pageCount} pages
                          </span>
                        )}
                        {selectedBook.publisher && (
                          <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm font-medium">
                            🏢 {selectedBook.publisher}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs">
                          via{" "}
                          {selectedBook.source === "google"
                            ? "Google Books"
                            : "Open Library"}
                        </span>
                      </div>

                      {selectedBook.description && (
                        <div className="bg-cream-100 p-4 rounded-xl">
                          <h4 className="font-semibold text-stone-700 mb-2">
                            Description
                          </h4>
                          <p className="text-stone-600 text-sm leading-relaxed">
                            {selectedBook.description.slice(0, 300)}
                            {selectedBook.description.length > 300 && "..."}
                          </p>
                        </div>
                      )}

                      {selectedBook.subjects &&
                        selectedBook.subjects.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-stone-700 mb-2">
                              Subjects
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedBook.subjects
                                .slice(0, 5)
                                .map((subject, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-star-light text-amber-800 rounded-lg text-xs"
                                  >
                                    {subject}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddBook}
                        disabled={adding}
                        className={`w-full bg-gradient-to-r ${config.buttonGradient} text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                      >
                        {adding ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ButtonIcon className="w-5 h-5" />
                        )}
                        {adding ? "Adding..." : config.buttonText}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : results.length > 0 ? (
                // Search Results Grid
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {results.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectBook(book)}
                      className="cursor-pointer group"
                    >
                      <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all transform group-hover:scale-105">
                        <img
                          src={book.coverUrl || "/placeholder-book-cover.png"}
                          alt={book.title}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-book-cover.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div className="text-white text-sm">
                            <p className="font-bold truncate">{book.title}</p>
                            <p className="text-xs truncate opacity-90">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // Empty State
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500 text-lg">
                    {loading
                      ? "Searching..."
                      : "Search for books to add to your collection!"}
                  </p>
                  <p className="text-stone-400 text-sm mt-2">
                    Try searching for your favorite book or author
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default BookSearchModal;
