import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  BookOpen,
  Sparkles,
  X,
  Send,
  Lightbulb,
  Check,
  Search,
  Loader2,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  searchBooks,
  suggestGenre,
  type UnifiedBook,
} from "../services/bookApi";
import type { Book } from "../types";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";

function getBookGradient(title: string): [string, string] {
  const colors: [string, string][] = [
    ["#FF6B6B", "#EE5A5A"],
    ["#4ECDC4", "#3DBDB5"],
    ["#45B7D1", "#34A6C0"],
    ["#96CEB4", "#85BDA3"],
    ["#DDA0DD", "#CC8FCC"],
    ["#98D8C8", "#87C7B7"],
    ["#BB8FCE", "#AA7EBD"],
    ["#85C1E9", "#74B0D8"],
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const PublicWishlist = () => {
  const { wishlist } = useBooks();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({
    title: "",
    author: "",
    suggestedBy: "",
    reason: "",
    genre: "Fiction",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Book search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitSuggestion = useMutation(api.bookSuggestions.submit);

  // Search for books with debounce
  const handleBookSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const results = await searchBooks(query, 6);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSuggestionForm({ ...suggestionForm, title: value });

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleBookSearch(value);
    }, 300);
  };

  const handleSelectSearchResult = (book: UnifiedBook) => {
    setSuggestionForm({
      ...suggestionForm,
      title: book.title,
      author: book.author,
      genre: suggestGenre(book),
    });
    setSearchQuery(book.title);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !suggestionForm.title ||
      !suggestionForm.author ||
      !suggestionForm.suggestedBy
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSuggestion({
        title: suggestionForm.title,
        author: suggestionForm.author,
        suggestedBy: suggestionForm.suggestedBy,
        reason: suggestionForm.reason || undefined,
        genre: suggestionForm.genre || undefined,
      });
      setSuggestionSubmitted(true);
      setSuggestionForm({
        title: "",
        author: "",
        suggestedBy: "",
        reason: "",
        genre: "Fiction",
      });
      // Reset after 3 seconds
      setTimeout(() => {
        setSuggestionSubmitted(false);
        setShowSuggestionForm(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort alphabetically by title
  const sortedWishlist = [...wishlist].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const totalPages = wishlist.reduce(
    (sum, book) => sum + (book.pageCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50">
      {/* Navigation */}
      <PublicNav />

      {/* Compact Hero Section */}
      <section className="py-8 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-primary-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-stone-800">
                  My Reading Wishlist
                </h1>
                <p className="text-sm text-stone-500">
                  Books I can't wait to read!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-2xl font-bold text-primary-600">
                  {wishlist.length}
                </span>
                <span className="text-sm text-stone-500">books</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <BookOpen className="w-4 h-4 text-accent-600" />
                <span className="text-lg font-bold text-accent-600">
                  {totalPages.toLocaleString()}
                </span>
                <span className="text-sm text-stone-500">pages</span>
              </div>
              <motion.button
                onClick={() => setShowSuggestionForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-primary-500 text-white font-bold rounded-full shadow-sm hover:shadow-md transition-all text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lightbulb className="w-4 h-4" />
                Suggest a Book
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Grid - Book Covers */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {sortedWishlist.length > 0 ? (
            <motion.div
              className="grid gap-4 sm:gap-5 md:gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {sortedWishlist.map((book) => {
                const [color1, color2] = getBookGradient(book.title);
                return (
                  <motion.div
                    key={book.id}
                    className="cursor-pointer group"
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.9 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        },
                      },
                    }}
                    onClick={() => setSelectedBook(book)}
                  >
                    <motion.div
                      className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 transition-all duration-300"
                      whileHover={{
                        y: -10,
                        scale: 1.03,
                        rotateY: 5,
                        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {book.coverUrl ? (
                        <motion.img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center p-4 text-white"
                          style={{
                            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
                          }}
                        >
                          <motion.span
                            className="text-4xl mb-3"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                          >
                            🎁
                          </motion.span>
                          <span className="text-sm font-bold text-center leading-tight line-clamp-3">
                            {book.title}
                          </span>
                        </div>
                      )}

                      {/* Wishlist badge */}
                      <div className="absolute top-2 left-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                        <Gift className="w-4 h-4 text-white" />
                      </div>

                      {/* Desktop hover overlay with title */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-white text-xs font-semibold leading-tight line-clamp-2 drop-shadow-lg">
                          {book.title}
                        </p>
                        <p className="text-white/70 text-[10px] mt-1">
                          {book.author}
                        </p>
                      </div>

                      {/* Sparkle effect on hover */}
                      <div className="absolute top-2 right-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        ✨
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <Gift className="w-16 h-16 text-primary-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                Wishlist Coming Soon!
              </h3>
              <p className="text-stone-500 max-w-md mx-auto">
                I'm always discovering new books to add to my reading list.
                Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {/* Cover */}
              <div className="relative h-72 bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center p-6">
                {selectedBook.coverUrl ? (
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="h-56 w-auto shadow-2xl rounded-sm object-cover"
                  />
                ) : (
                  <div
                    className="h-56 w-40 shadow-2xl flex items-center justify-center text-white p-4 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${getBookGradient(selectedBook.title)[0]} 0%, ${getBookGradient(selectedBook.title)[1]} 100%)`,
                    }}
                  >
                    <span className="text-xl font-bold text-center">
                      {selectedBook.title}
                    </span>
                  </div>
                )}

                {/* Wishlist badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-semibold">On My Wishlist</span>
                </div>

                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-cream-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-stone-700 mb-1">
                  {selectedBook.title}
                </h2>
                <p className="text-stone-500 mb-4">By {selectedBook.author}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBook.genre && (
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-accent-100 text-accent-600">
                      {selectedBook.genre === "Fantasy"
                        ? "🧙"
                        : selectedBook.genre === "Adventure"
                          ? "🗺️"
                          : selectedBook.genre === "Mystery"
                            ? "🔍"
                            : selectedBook.genre === "Fiction"
                              ? "📖"
                              : selectedBook.genre === "Non-Fiction"
                                ? "📚"
                                : selectedBook.genre === "Science Fiction"
                                  ? "🚀"
                                  : "✨"}{" "}
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.pageCount && selectedBook.pageCount > 0 && (
                    <span className="px-4 py-2 bg-cream-200 text-stone-600 rounded-full text-sm font-medium flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {selectedBook.pageCount} pages
                    </span>
                  )}
                  {selectedBook.ageRating && (
                    <span className="px-4 py-2 bg-cream-200 text-stone-600 rounded-full text-sm font-medium">
                      {selectedBook.ageRating}
                    </span>
                  )}
                </div>

                {/* Why I want to read this */}
                {(selectedBook.notes || selectedBook.description) && (
                  <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 mb-6">
                    <h3 className="font-bold text-stone-700 mb-2 text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary-500" />
                      Why I Want to Read This
                    </h3>
                    <p className="text-stone-600 leading-relaxed italic">
                      "{selectedBook.notes || selectedBook.description}"
                    </p>
                  </div>
                )}

                {!selectedBook.notes && !selectedBook.description && (
                  <div className="bg-cream-100 rounded-xl p-5 border border-cream-300 mb-6">
                    <p className="text-stone-500 italic text-center">
                      This book looks amazing and I can't wait to read it!
                    </p>
                  </div>
                )}

                <div className="text-center pt-4 border-t border-cream-200">
                  <p className="text-stone-400 text-sm">
                    Know someone who has this book? Let them know I'd love to
                    borrow it!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggest a Book Modal */}
      <AnimatePresence>
        {showSuggestionForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !isSubmitting && setShowSuggestionForm(false)}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {suggestionSubmitted ? (
                // Success state
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-stone-600">
                    Your book suggestion has been sent to Izzy! She'll review it
                    soon.
                  </p>
                  <motion.div
                    className="mt-4 text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    📚✨
                  </motion.div>
                </div>
              ) : (
                // Form state
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-accent-500 to-primary-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Suggest a Book</h3>
                          <p className="text-white/80 text-sm">
                            Help Izzy discover new reads!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSuggestionForm(false)}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSuggestionSubmit}
                    className="p-6 space-y-4"
                  >
                    {/* Book Search Input */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        Search for a Book *
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          onFocus={() =>
                            searchResults.length > 0 &&
                            setShowSearchResults(true)
                          }
                          className="w-full pl-10 pr-10 py-2.5 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                          placeholder="Start typing to search..."
                          disabled={isSubmitting}
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 animate-spin" />
                        )}
                      </div>

                      {/* Search Results Dropdown */}
                      <AnimatePresence>
                        {showSearchResults && searchResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-cream-300 rounded-xl shadow-lg max-h-64 overflow-y-auto"
                          >
                            {searchResults.map((book) => (
                              <button
                                key={book.id}
                                type="button"
                                onClick={() => handleSelectSearchResult(book)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-colors text-left border-b border-cream-100 last:border-b-0"
                              >
                                {book.coverUrl ? (
                                  <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-14 bg-gradient-to-br from-primary-400 to-accent-400 rounded flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-stone-800 truncate">
                                    {book.title}
                                  </p>
                                  <p className="text-sm text-stone-500 truncate">
                                    {book.author}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Or type manually hint */}
                      <p className="text-xs text-stone-400 mt-1">
                        Select a result or type the title manually below
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        Book Title *
                      </label>
                      <input
                        type="text"
                        value={suggestionForm.title}
                        onChange={(e) =>
                          setSuggestionForm({
                            ...suggestionForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        placeholder="e.g., Percy Jackson"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        Author *
                      </label>
                      <input
                        type="text"
                        value={suggestionForm.author}
                        onChange={(e) =>
                          setSuggestionForm({
                            ...suggestionForm,
                            author: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        placeholder="e.g., Rick Riordan"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={suggestionForm.suggestedBy}
                        onChange={(e) =>
                          setSuggestionForm({
                            ...suggestionForm,
                            suggestedBy: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        placeholder="Your first name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        Genre
                      </label>
                      <select
                        value={suggestionForm.genre}
                        onChange={(e) =>
                          setSuggestionForm({
                            ...suggestionForm,
                            genre: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all bg-white"
                        disabled={isSubmitting}
                      >
                        <option value="Fiction">Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Realistic Fiction">
                          Realistic Fiction
                        </option>
                        <option value="Historical Fiction">
                          Historical Fiction
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1">
                        Why would Izzy love this book?
                      </label>
                      <textarea
                        value={suggestionForm.reason}
                        onChange={(e) =>
                          setSuggestionForm({
                            ...suggestionForm,
                            reason: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
                        rows={3}
                        placeholder="Tell Izzy why this book is amazing!"
                        disabled={isSubmitting}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-accent-500 to-primary-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      disabled={
                        isSubmitting ||
                        !suggestionForm.title ||
                        !suggestionForm.author ||
                        !suggestionForm.suggestedBy
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Suggestion
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicWishlist;
