import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Loader2,
  X,
  Plus,
  Heart,
  Upload,
  PenLine,
  CheckCircle2,
  BookMarked,
} from "lucide-react";
import {
  searchBooks,
  suggestGenre,
  determineAgeRating,
  type UnifiedBook,
} from "../../services/bookApi";
import { useToastActions } from "./Toast";
import type { Book } from "../../types";
import { preloadImage } from "../../utils/coverHelpers";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type BookDestination = "read" | "reading" | "wishlist";

const GENRES = [
  "Fiction",
  "Fantasy",
  "Adventure",
  "Mystery",
  "Humor",
  "Graphic Novel",
  "Non-Fiction",
  "Science Fiction",
  "Romance",
  "Horror",
  "Historical Fiction",
  "Biography",
  "Poetry",
  "Other",
];

export type BookSearchMode = "bookshelf" | "wishlist";

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (
    book: Omit<Book, "id">,
    destination: BookDestination,
  ) => void | Promise<void>;
  mode?: BookSearchMode; // Optional now, we use destination selector
  title?: string;
}

const destinationConfig = {
  read: {
    label: "Finished",
    description: "I've read this book",
    icon: CheckCircle2,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    ringColor: "ring-green-500",
    bgLight: "bg-green-50",
    textColor: "text-green-700",
  },
  reading: {
    label: "Reading",
    description: "I'm reading this now",
    icon: BookMarked,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    ringColor: "ring-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
  },
  wishlist: {
    label: "Wishlist",
    description: "I want to read this",
    icon: Heart,
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-600",
    ringColor: "ring-pink-500",
    bgLight: "bg-pink-50",
    textColor: "text-pink-700",
  },
};

export function BookSearchModal({
  isOpen,
  onClose,
  onAddBook,
  title,
}: BookSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnifiedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<UnifiedBook | null>(null);
  const [adding, setAdding] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<BookDestination>("read");
  const [manualBook, setManualBook] = useState({
    title: "",
    author: "",
    coverUrl: "",
    genre: "Fiction",
    pageCount: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToastActions();

  // Convex mutation for storing cover images permanently
  const storeCoverImage = useMutation(api.covers.storeCoverImage);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large", "Please use an image under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setManualBook({ ...manualBook, coverUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const books = await searchBooks(query, 12);
      setResults(books);
      if (books.length === 0) {
        toast.info(
          "No books found",
          "Try a different search term or add manually.",
        );
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualBook = async () => {
    if (!manualBook.title.trim() || !manualBook.author.trim()) {
      toast.error("Missing info", "Please enter at least a title and author.");
      return;
    }

    setAdding(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const isRead = selectedDestination === "read";
      const isReading = selectedDestination === "reading";

      const newBook: Omit<Book, "id"> = {
        title: manualBook.title.trim(),
        author: manualBook.author.trim(),
        coverUrl: manualBook.coverUrl || undefined,
        genre: manualBook.genre,
        pageCount: manualBook.pageCount
          ? parseInt(manualBook.pageCount)
          : undefined,
        description: manualBook.description || undefined,
        ageRating: "8+",
        dateAdded: today,
        dateRead: isRead ? today : undefined,
        isRead: isRead || isReading ? isRead : false, // For wishlist, doesn't matter as it goes to separate table
      };

      await onAddBook(newBook, selectedDestination);
      handleClose();
      const destLabel = destinationConfig[selectedDestination].label;
      toast.success(
        "Book added!",
        `"${manualBook.title}" added to ${destLabel}.`,
      );
    } catch (error) {
      console.error("Failed to add book:", error);
      toast.error("Failed to add book", "Please try again.");
    } finally {
      setAdding(false);
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
      // Store cover in Convex storage for permanence
      let permanentCoverUrl: string | null = null;
      if (selectedBook.coverUrl) {
        permanentCoverUrl = await storeCoverImage({
          externalUrl: selectedBook.coverUrl,
          bookTitle: selectedBook.title,
        });
      }

      const today = new Date().toISOString().split("T")[0];
      const isRead = selectedDestination === "read";
      const isReading = selectedDestination === "reading";

      const newBook: Omit<Book, "id"> = {
        title: selectedBook.title,
        author: selectedBook.author,
        coverUrl: permanentCoverUrl || undefined,
        isbn: selectedBook.isbn,
        genre: suggestGenre(selectedBook),
        pageCount: selectedBook.pageCount,
        description: selectedBook.description,
        ageRating: determineAgeRating(selectedBook),
        dateAdded: today,
        dateRead: isRead ? today : undefined,
        isRead: isRead || isReading ? isRead : false,
      };

      await onAddBook(newBook, selectedDestination);
      handleClose();
      const destLabel = destinationConfig[selectedDestination].label;
      toast.success(
        "Book added!",
        `"${selectedBook.title}" added to ${destLabel}.`,
      );
    } catch (error) {
      console.error("Failed to add book:", error);
      toast.error("Failed to add book", "Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelectedBook(null);
    setShowManualEntry(false);
    setHasSearched(false);
    setSelectedDestination("read");
    setManualBook({
      title: "",
      author: "",
      coverUrl: "",
      genre: "Fiction",
      pageCount: "",
      description: "",
    });
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
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                {title || "Add a Book"}
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
              {showManualEntry ? (
                // Manual Entry Form
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setShowManualEntry(false)}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    ← Back to search
                  </button>

                  <div className="flex gap-6">
                    {/* Cover Upload */}
                    <div className="flex-shrink-0">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-48 h-72 rounded-xl border-2 border-dashed border-stone-300 hover:border-primary-400 transition-colors cursor-pointer flex flex-col items-center justify-center bg-stone-50 hover:bg-primary-50 overflow-hidden"
                      >
                        {manualBook.coverUrl ? (
                          <img
                            src={manualBook.coverUrl}
                            alt="Book cover"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-stone-400 mb-2" />
                            <p className="text-sm text-stone-500 text-center px-4">
                              Click to upload cover image
                            </p>
                            <p className="text-xs text-stone-400 mt-1">
                              (Optional)
                            </p>
                          </>
                        )}
                      </div>
                      {manualBook.coverUrl && (
                        <button
                          onClick={() =>
                            setManualBook({ ...manualBook, coverUrl: "" })
                          }
                          className="mt-2 text-xs text-red-500 hover:text-red-600 w-full text-center"
                        >
                          Remove cover
                        </button>
                      )}
                    </div>

                    {/* Book Details Form */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1">
                          Book Title *
                        </label>
                        <input
                          type="text"
                          value={manualBook.title}
                          onChange={(e) =>
                            setManualBook({
                              ...manualBook,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter book title..."
                          className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1">
                          Author *
                        </label>
                        <input
                          type="text"
                          value={manualBook.author}
                          onChange={(e) =>
                            setManualBook({
                              ...manualBook,
                              author: e.target.value,
                            })
                          }
                          placeholder="Enter author name..."
                          className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-1">
                            Genre
                          </label>
                          <select
                            value={manualBook.genre}
                            onChange={(e) =>
                              setManualBook({
                                ...manualBook,
                                genre: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            {GENRES.map((genre) => (
                              <option key={genre} value={genre}>
                                {genre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-1">
                            Pages
                          </label>
                          <input
                            type="number"
                            value={manualBook.pageCount}
                            onChange={(e) =>
                              setManualBook({
                                ...manualBook,
                                pageCount: e.target.value,
                              })
                            }
                            placeholder="Optional"
                            className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-1">
                          Description (optional)
                        </label>
                        <textarea
                          value={manualBook.description}
                          onChange={(e) =>
                            setManualBook({
                              ...manualBook,
                              description: e.target.value,
                            })
                          }
                          placeholder="What's this book about?"
                          rows={3}
                          className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Destination Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Add to:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(
                            Object.keys(destinationConfig) as BookDestination[]
                          ).map((dest) => {
                            const config = destinationConfig[dest];
                            const Icon = config.icon;
                            const isSelected = selectedDestination === dest;
                            return (
                              <button
                                key={dest}
                                type="button"
                                onClick={() => setSelectedDestination(dest)}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                                  isSelected
                                    ? `${config.bgLight} ${config.textColor} border-current ring-2 ${config.ringColor}`
                                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                                }`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${isSelected ? "" : "text-stone-400"}`}
                                />
                                <span className="text-sm font-medium">
                                  {config.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddManualBook}
                        disabled={
                          adding ||
                          !manualBook.title.trim() ||
                          !manualBook.author.trim()
                        }
                        className={`w-full ${destinationConfig[selectedDestination].color} ${destinationConfig[selectedDestination].hoverColor} text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                      >
                        {adding ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        {adding
                          ? "Adding..."
                          : `Add to ${destinationConfig[selectedDestination].label}`}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : selectedBook ? (
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

                      {/* Destination Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Add to:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(
                            Object.keys(destinationConfig) as BookDestination[]
                          ).map((dest) => {
                            const destConfig = destinationConfig[dest];
                            const Icon = destConfig.icon;
                            const isSelected = selectedDestination === dest;
                            return (
                              <button
                                key={dest}
                                type="button"
                                onClick={() => setSelectedDestination(dest)}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                                  isSelected
                                    ? `${destConfig.bgLight} ${destConfig.textColor} border-current ring-2 ${destConfig.ringColor}`
                                    : "border-stone-200 hover:border-stone-300 text-stone-600"
                                }`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${isSelected ? "" : "text-stone-400"}`}
                                />
                                <span className="text-sm font-medium">
                                  {destConfig.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddBook}
                        disabled={adding}
                        className={`w-full ${destinationConfig[selectedDestination].color} ${destinationConfig[selectedDestination].hoverColor} text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                      >
                        {adding ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                        {adding
                          ? "Adding..."
                          : `Add to ${destinationConfig[selectedDestination].label}`}
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
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                              e.currentTarget.src =
                                "/placeholder-book-cover.png";
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
                  </div>
                  {/* Manual entry option */}
                  <div className="text-center pt-4 border-t border-stone-200">
                    <p className="text-sm text-stone-500 mb-2">
                      Can't find your book?
                    </p>
                    <button
                      onClick={() => setShowManualEntry(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-sm transition-colors"
                    >
                      <PenLine className="w-4 h-4" />
                      Add it manually
                    </button>
                  </div>
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
                      : hasSearched
                        ? "No books found"
                        : "Search for books to add to your collection!"}
                  </p>
                  <p className="text-stone-400 text-sm mt-2">
                    {hasSearched
                      ? "Try a different search term or add it manually"
                      : "Try searching for your favorite book or author"}
                  </p>
                  {hasSearched && (
                    <button
                      onClick={() => setShowManualEntry(true)}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold text-sm shadow-md hover:from-primary-600 hover:to-accent-600 transition-all"
                    >
                      <PenLine className="w-4 h-4" />
                      Add book manually
                    </button>
                  )}
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
