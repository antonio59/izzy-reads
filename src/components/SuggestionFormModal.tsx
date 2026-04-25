import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  X,
  Send,
  Lightbulb,
  Check,
  Search,
  Loader2,
} from "lucide-react";

// Small cover component with error fallback for search results
function SearchResultCover({ src, title }: { src?: string; title: string }) {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError) {
    return (
      <div className="w-10 h-14 bg-gradient-to-br from-primary-400 to-accent-400 rounded flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-5 h-5 text-white" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth < 30 || img.naturalHeight < 30) {
          setHasError(true);
        }
      }}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
    />
  );
}
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  searchBooks,
  suggestGenre,
  type UnifiedBook,
} from "../services/bookApi";
import { Input, Textarea, Select } from "./ui/Input";

interface SuggestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
}

const GENRES = [
  "Fiction",
  "Fantasy",
  "Adventure",
  "Mystery",
  "Science Fiction",
  "Non-Fiction",
  "Realistic Fiction",
  "Historical Fiction",
];

export function SuggestionFormModal({
  isOpen,
  onClose,
  recipientName = "them",
}: SuggestionFormModalProps) {
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({
    title: "",
    author: "",
    coverUrl: "",
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

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleBookSearch(value);
    }, 300);
  };

  const handleSelectSearchResult = (book: UnifiedBook) => {
    setSuggestionForm({
      ...suggestionForm,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl || "",
      genre: suggestGenre(book),
    });
    setSearchQuery(book.title);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        coverUrl: suggestionForm.coverUrl || undefined,
        suggestedBy: suggestionForm.suggestedBy,
        reason: suggestionForm.reason || undefined,
        genre: suggestionForm.genre || undefined,
      });
      setSuggestionSubmitted(true);
      setSuggestionForm({
        title: "",
        author: "",
        coverUrl: "",
        suggestedBy: "",
        reason: "",
        genre: "Fiction",
      });
      setSearchQuery("");
      setTimeout(() => {
        setSuggestionSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset state after close animation
      setTimeout(() => {
        setSuggestionSubmitted(false);
        setSuggestionForm({
          title: "",
          author: "",
          coverUrl: "",
          suggestedBy: "",
          reason: "",
          genre: "Fiction",
        });
        setSearchQuery("");
        setSearchResults([]);
      }, 200);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
        >
          {suggestionSubmitted ? (
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
                Your book suggestion has been sent! They'll review it soon.
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
                        Help {recipientName} discover new reads!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Book Search Input */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Search for a Book *
                  </label>
                  <div className="relative">
                    <Input
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() =>
                        searchResults.length > 0 && setShowSearchResults(true)
                      }
                      placeholder="Start typing to search..."
                      disabled={isSubmitting}
                      icon={<Search className="w-4 h-4" />}
                      className="pr-10"
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
                        className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
                      >
                        {searchResults.map((book) => (
                          <button
                            key={book.id}
                            type="button"
                            onClick={() => handleSelectSearchResult(book)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-colors text-left border-b border-stone-100 last:border-b-0"
                          >
                            <SearchResultCover src={book.coverUrl} title={book.title} />
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

                  <p className="text-xs text-stone-400 mt-1">
                    Select a result or type the title manually below
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Book Title *
                  </label>
                  <Input
                    value={suggestionForm.title}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g., Percy Jackson"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Author *
                  </label>
                  <Input
                    value={suggestionForm.author}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        author: e.target.value,
                      })
                    }
                    placeholder="e.g., Rick Riordan"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <Input
                    value={suggestionForm.suggestedBy}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        suggestedBy: e.target.value,
                      })
                    }
                    placeholder="Your first name"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Genre
                  </label>
                  <Select
                    value={suggestionForm.genre}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        genre: e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                    options={GENRES.map((genre) => ({ value: genre, label: genre }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">
                    Why would {recipientName} love this book?
                  </label>
                  <Textarea
                    value={suggestionForm.reason}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        reason: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Tell them why this book is amazing!"
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
                      <Loader2 className="w-5 h-5 animate-spin" />
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
    </AnimatePresence>
  );
}

export default SuggestionFormModal;
