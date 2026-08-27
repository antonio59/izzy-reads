import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  X,
  Send,
  Gift,
  Check,
  Search,
  Loader2,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  searchBooks,
  suggestGenre,
  type UnifiedBook,
} from "../services/bookApi";
import { Input, Textarea, Select } from "./ui/Input";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { upgradeCoverUrl, PLACEHOLDER_COVER } from "../lib/coverUrl";

function SearchResultCover({ src, title }: { src?: string; title: string }) {
  const [hasError, setHasError] = useState(false);
  const coverSrc = src ? upgradeCoverUrl(src) : "";
  if (!coverSrc || hasError) {
    return (
      <div className="w-10 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-cream-300">
        <BookOpen className="w-5 h-5 text-primary-400" />
      </div>
    );
  }
  return (
    <img
      src={coverSrc}
      alt={title}
      loading="lazy"
      decoding="async"
      className="w-10 h-14 object-cover rounded-lg shadow-sm flex-shrink-0 ring-1 ring-cream-300"
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth < 40 || img.naturalHeight < 40) {
          setHasError(true);
        }
      }}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

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
  recipientName = "Izzy",
}: SuggestionFormModalProps) {
  const { prefersReducedMotion } = useMotionPreference();
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitSuggestion = useMutation(api.bookSuggestions.submit);

  const resetForm = () => {
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
    setShowSearchResults(false);
  };

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
    setSuggestionForm((prev) => ({ ...prev, title: value, coverUrl: "" }));

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleBookSearch(value);
    }, 300);
  };

  const handleSelectSearchResult = (book: UnifiedBook) => {
    setSuggestionForm((prev) => ({
      ...prev,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl ? upgradeCoverUrl(book.coverUrl) : "",
      genre: suggestGenre(book),
    }));
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
      resetForm();
      setTimeout(() => {
        setSuggestionSubmitted(false);
        onClose();
      }, 2800);
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setTimeout(() => {
        setSuggestionSubmitted(false);
        resetForm();
      }, 200);
    }
  };

  if (!isOpen) return null;

  const selectedCover = suggestionForm.coverUrl
    ? upgradeCoverUrl(suggestionForm.coverUrl)
    : "";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : undefined}
      >
        <button
          type="button"
          aria-label="Close suggest a book"
          className="absolute inset-0 bg-stone-900/45 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggest-book-title"
          className="relative w-full max-w-lg bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-cream-300 overflow-hidden max-h-[92vh] overflow-y-auto"
          initial={
            prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16, scale: 0.98 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", damping: 26, stiffness: 320 }
          }
        >
          {suggestionSubmitted ? (
            <div className="p-10 sm:p-12 text-center">
              <motion.div
                initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 280, damping: 18 }
                }
                className="w-16 h-16 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-8 h-8" strokeWidth={2.5} />
              </motion.div>
              <h3
                id="suggest-book-title"
                className="font-accent text-3xl font-semibold text-stone-900 mb-2"
              >
                Sent!
              </h3>
              <p className="text-stone-500 leading-relaxed max-w-sm mx-auto">
                Thanks — {recipientName} will see your suggestion on the
                wishlist soon.
              </p>
            </div>
          ) : (
            <>
              <div className="relative px-6 pt-6 pb-4 border-b border-cream-300">
                <div
                  className="absolute inset-0 opacity-70 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 20% 0%, rgba(217,70,168,0.10), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(13,148,136,0.10), transparent 50%)",
                  }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
                        Wishlist
                      </p>
                      <h3
                        id="suggest-book-title"
                        className="font-accent text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight"
                      >
                        Suggest a book
                      </h3>
                      <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                        Help {recipientName} find the next great read.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors"
                    disabled={isSubmitting}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {selectedCover && (
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-cream-300">
                    <img
                      src={selectedCover}
                      alt=""
                      className="w-14 h-20 object-cover rounded-lg shadow-md ring-1 ring-cream-300"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_COVER;
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-1">
                        Selected
                      </p>
                      <p className="font-display font-bold text-stone-900 truncate">
                        {suggestionForm.title}
                      </p>
                      <p className="text-sm text-stone-500 truncate">
                        {suggestionForm.author}
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <label className="block text-sm font-display font-bold text-stone-800 mb-1.5">
                    Find a book
                  </label>
                  <div className="relative">
                    <Input
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() =>
                        searchResults.length > 0 && setShowSearchResults(true)
                      }
                      placeholder="Search by title or author…"
                      disabled={isSubmitting}
                      icon={<Search className="w-4 h-4" />}
                      className="bg-white border-cream-300 pr-10"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 animate-spin" />
                    )}
                  </div>

                  <AnimatePresence>
                    {showSearchResults && searchResults.length > 0 && (
                      <motion.div
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: -6 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-cream-300 rounded-2xl shadow-lg max-h-64 overflow-y-auto"
                      >
                        {searchResults.map((book) => (
                          <button
                            key={book.id}
                            type="button"
                            onClick={() => handleSelectSearchResult(book)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-primary-50/80 transition-colors text-left border-b border-cream-200 last:border-b-0"
                          >
                            <SearchResultCover
                              src={book.coverUrl}
                              title={book.title}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-display font-bold text-stone-800 truncate">
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
                  <p className="text-xs text-stone-400 mt-1.5">
                    Pick a result, or fill in the details yourself below.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-display font-bold text-stone-800 mb-1.5">
                      Title <span className="text-primary-500">*</span>
                    </label>
                    <Input
                      value={suggestionForm.title}
                      onChange={(e) =>
                        setSuggestionForm({
                          ...suggestionForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. Percy Jackson"
                      required
                      disabled={isSubmitting}
                      className="bg-white border-cream-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-display font-bold text-stone-800 mb-1.5">
                      Author <span className="text-primary-500">*</span>
                    </label>
                    <Input
                      value={suggestionForm.author}
                      onChange={(e) =>
                        setSuggestionForm({
                          ...suggestionForm,
                          author: e.target.value,
                        })
                      }
                      placeholder="e.g. Rick Riordan"
                      required
                      disabled={isSubmitting}
                      className="bg-white border-cream-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-display font-bold text-stone-800 mb-1.5">
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
                      className="bg-white border-cream-300"
                      options={GENRES.map((genre) => ({
                        value: genre,
                        label: genre,
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-display font-bold text-stone-800 mb-1.5">
                    Your name <span className="text-primary-500">*</span>
                  </label>
                  <Input
                    value={suggestionForm.suggestedBy}
                    onChange={(e) =>
                      setSuggestionForm({
                        ...suggestionForm,
                        suggestedBy: e.target.value,
                      })
                    }
                    placeholder="First name is perfect"
                    required
                    disabled={isSubmitting}
                    className="bg-white border-cream-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-display font-bold text-stone-800 mb-1.5">
                    Why would {recipientName} love this?
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
                    placeholder="A short note is plenty — funny, exciting, cozy…"
                    disabled={isSubmitting}
                    className="bg-white border-cream-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-display font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send suggestion
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SuggestionFormModal;
