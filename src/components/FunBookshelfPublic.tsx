import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Star } from "lucide-react";
import type { Book } from "../types";
import { BookReactionButtons } from "./ReactionButtons";
import { ShareBookButton } from "./ShareButton";
import { Button, SearchInput } from "./ui";
import { BookCoverImage } from "./ui/BookCoverImage";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";

function ConfettiParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        top: (i * 17) % 100,
        left: (i * 23) % 100,
        rotate: (i * 18) % 360,
        emoji: ["⭐", "✨", "💖", "🌟"][i % 4],
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ top: "50%", left: "50%", scale: 0 }}
          animate={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            scale: [0, 1, 0],
            rotate: p.rotate,
          }}
          transition={{ duration: 1 }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const starClass = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${
            i < rating ? "text-star fill-star" : "text-stone-200"
          }`}
        />
      ))}
    </div>
  );
}

function getReviewText(book: Book): string | undefined {
  const text = book.notes || book.review;
  return text?.trim() || undefined;
}

interface FunBookshelfPublicProps {
  books: Book[];
  showFilters?: boolean;
}

const FunBookshelfPublic: React.FC<FunBookshelfPublicProps> = ({
  books,
  showFilters = true,
}) => {
  const { prefersReducedMotion } = useMotionPreference();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "rating">("title");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const genres = useMemo(() => {
    const genreSet = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(genreSet).sort();
  }, [books]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    books.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      const matchesTag =
        !selectedTag || book.tags?.includes(selectedTag);
      return matchesSearch && matchesGenre && matchesTag;
    });

    if (sortBy === "rating") {
      return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [books, searchQuery, selectedGenre, selectedTag, sortBy]);

  const closeModal = useCallback(() => setSelectedBook(null), []);

  useEffect(() => {
    if (!selectedBook) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedBook, closeModal]);

  const handleReactionConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  const reviewText = selectedBook ? getReviewText(selectedBook) : undefined;
  const hasFullReview = Boolean(reviewText);

  return (
    <div>
      {showFilters && (
        <div className="mb-8 sm:mb-10 space-y-4">
          <div className="max-w-md">
            <SearchInput
              placeholder="Search by title or author…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="bg-white border-cream-300 focus:bg-white"
              aria-label="Search books"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-1">
              Sort
            </span>
            <button
              type="button"
              onClick={() => setSortBy("title")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                sortBy === "title"
                  ? "bg-stone-800 text-white"
                  : "bg-cream-200 text-stone-600 hover:bg-cream-300"
              }`}
            >
              A–Z
            </button>
            <button
              type="button"
              onClick={() => setSortBy("rating")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                sortBy === "rating"
                  ? "bg-stone-800 text-white"
                  : "bg-cream-200 text-stone-600 hover:bg-cream-300"
              }`}
            >
              Highest rated
            </button>
          </div>

          {genres.length > 0 && (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by genre"
            >
              <button
                type="button"
                onClick={() => setSelectedGenre(null)}
                aria-pressed={!selectedGenre}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !selectedGenre
                    ? "bg-primary-600 text-white"
                    : "bg-white text-stone-600 border border-cream-300 hover:border-primary-300 hover:text-primary-700"
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  type="button"
                  key={genre}
                  onClick={() =>
                    setSelectedGenre(selectedGenre === genre ? null : genre)
                  }
                  aria-pressed={selectedGenre === genre}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? "bg-primary-600 text-white"
                      : "bg-white text-stone-600 border border-cream-300 hover:border-primary-300 hover:text-primary-700"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {allTags.length > 0 && (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by mood tag"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 self-center mr-1">
                Mood
              </span>
              {allTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                  aria-pressed={selectedTag === tag}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-accent-600 text-white"
                      : "bg-accent-50 text-accent-700 border border-accent-100 hover:border-accent-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filteredBooks.length > 0 ? (
        <motion.div
          className="grid gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))",
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: prefersReducedMotion
                ? { duration: 0 }
                : { staggerChildren: 0.04, delayChildren: 0.05 },
            },
          }}
        >
          {filteredBooks.map((book) => {
            const hasReview = Boolean(getReviewText(book));
            return (
              <motion.button
                key={book.id}
                type="button"
                className="group text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
                variants={{
                  hidden: prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 320, damping: 26 },
                  },
                }}
                onClick={() => setSelectedBook(book)}
                aria-label={`${book.title} by ${book.author}${hasReview ? ", has a review" : ""}`}
              >
                <motion.div
                  className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 group-focus-visible:ring-primary-400 transition-shadow"
                  whileHover={
                    prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }
                  }
                  whileTap={
                    prefersReducedMotion ? undefined : { scale: 0.98 }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <BookCoverImage book={book} className="w-full h-full" />
                  {hasReview && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-primary-600 text-white shadow-sm">
                      Review
                    </span>
                  )}
                </motion.div>

                <div className="mt-3 px-0.5">
                  {book.rating && book.rating > 0 && (
                    <div className="mb-1.5">
                      <StarRating rating={book.rating} />
                    </div>
                  )}
                  <p className="font-display font-bold text-sm text-stone-800 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                    {book.title}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-display font-bold text-stone-700 mb-1">
            No books found
          </h3>
          <p className="text-stone-500 text-sm mb-4">
            Try a different search or filter
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre(null);
              setSelectedTag(null);
            }}
            size="sm"
          >
            Show all
          </Button>
        </div>
      )}

      {/* Book peek → full review */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-peek-title"
          >
            {showConfetti && <ConfettiParticles />}

            <motion.button
              type="button"
              className="absolute inset-0 bg-stone-900/45 backdrop-blur-[2px]"
              aria-label="Close"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 40, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: 24, scale: 0.98 }
              }
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/95 hover:bg-cream-100 rounded-full flex items-center justify-center shadow-md border border-cream-200 transition-colors"
                aria-label="Close book details"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>

              <div className="flex flex-col sm:flex-row">
                {/* Cover column */}
                <div className="sm:w-[42%] flex-shrink-0 bg-gradient-to-b from-primary-50/80 via-cream-100 to-accent-50/40 p-6 sm:p-8 flex items-center justify-center">
                  <div className="w-36 sm:w-44 aspect-[2/3] rounded-lg overflow-hidden shadow-xl ring-1 ring-black/5">
                    <BookCoverImage
                      book={selectedBook}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 p-6 sm:p-8 sm:pt-10">
                  {selectedBook.genre && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-2">
                      {selectedBook.genre}
                      {selectedBook.pageCount
                        ? ` · ${selectedBook.pageCount} pages`
                        : ""}
                    </p>
                  )}

                  <h2
                    id="book-peek-title"
                    className="text-2xl font-display font-bold text-stone-900 leading-tight mb-1"
                  >
                    {selectedBook.title}
                  </h2>
                  <p className="text-stone-500 mb-4">
                    by {selectedBook.author}
                  </p>

                  {selectedBook.rating && selectedBook.rating > 0 && (
                    <div className="flex items-center gap-2 mb-5">
                      <StarRating rating={selectedBook.rating} size="md" />
                      <span className="text-sm font-semibold text-stone-600">
                        {selectedBook.rating}/5
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-display font-bold text-stone-800 mb-2">
                      Izzy&apos;s take
                    </h3>
                    {reviewText ? (
                      <>
                        <p className="text-stone-600 leading-relaxed whitespace-pre-line line-clamp-5">
                          {reviewText}
                        </p>
                        {reviewText.length > 180 && (
                          <Link
                            to={`/reviews/${selectedBook.id}`}
                            onClick={closeModal}
                            className="inline-flex items-center gap-1.5 mt-3 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
                          >
                            Read full review
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </>
                    ) : (
                      <p className="text-stone-400 italic">
                        Review coming soon — check back later!
                      </p>
                    )}
                  </div>

                  {hasFullReview && (
                    <Link
                      to={`/reviews/${selectedBook.id}`}
                      onClick={closeModal}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 mb-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
                    >
                      Open full review
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <div className="pt-5 border-t border-cream-200 space-y-4">
                    <div>
                      <p className="text-center text-sm font-medium text-stone-500 mb-2">
                        Like this book?
                      </p>
                      <div className="flex justify-center">
                        <BookReactionButtons
                          bookId={selectedBook.id}
                          onReaction={handleReactionConfetti}
                        />
                      </div>
                    </div>
                    <ShareBookButton
                      book={selectedBook}
                      variant="button"
                      size="md"
                      className="w-full justify-center py-2.5 bg-cream-100 hover:bg-cream-200 text-stone-700 border border-cream-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FunBookshelfPublic;
