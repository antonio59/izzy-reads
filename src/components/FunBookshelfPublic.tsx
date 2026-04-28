import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "../types";
import { BookReactionButtons } from "./ReactionButtons";
import { ShareBookButton } from "./ShareButton";
import { Button, Card, SearchInput } from "./ui";
import { BookCoverImage, getBookGradient } from "./ui/BookCoverImage";

function ConfettiParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        top: (i * 17) % 100,
        left: (i * 23) % 100,
        rotate: (i * 18) % 360,
        emoji: ["⭐", "✨", "💖", "🎉", "🌟"][i % 5],
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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

interface FunBookshelfPublicProps {
  books: Book[];
  showFilters?: boolean;
}

// Genre styles with distinct colors for badges
const GENRE_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    emoji: string;
    badgeColor: string;
    textColor: string;
  }
> = {
  Fantasy: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    emoji: "🧙‍♂️",
    badgeColor: "#ddd6fe",
    textColor: "#7c3aed",
  },
  Adventure: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    emoji: "🗺️",
    badgeColor: "#fed7aa",
    textColor: "#ea580c",
  },
  Mystery: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    emoji: "🔍",
    badgeColor: "#e2e8f0",
    textColor: "#475569",
  },
  Fiction: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    emoji: "📖",
    badgeColor: "#dbeafe",
    textColor: "#2563eb",
  },
  "Science Fiction": {
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    emoji: "🚀",
    badgeColor: "#cffafe",
    textColor: "#0891b2",
  },
  "Non-Fiction": {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    emoji: "🎓",
    badgeColor: "#d1fae5",
    textColor: "#059669",
  },
  Humor: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    emoji: "😂",
    badgeColor: "#fef3c7",
    textColor: "#d97706",
  },
  "Graphic Novel": {
    bg: "bg-pink-100",
    text: "text-pink-600",
    emoji: "🎨",
    badgeColor: "#fce7f3",
    textColor: "#db2777",
  },
  Horror: {
    bg: "bg-red-100",
    text: "text-red-600",
    emoji: "👻",
    badgeColor: "#fee2e2",
    textColor: "#dc2626",
  },
  Romance: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    emoji: "💕",
    badgeColor: "#ffe4e6",
    textColor: "#e11d48",
  },
  default: {
    bg: "bg-accent-100",
    text: "text-accent-600",
    emoji: "📖",
    badgeColor: "#ccfbf1",
    textColor: "#0d9488",
  },
};

const FunBookshelfPublic: React.FC<FunBookshelfPublicProps> = ({
  books,
  showFilters = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "rating">("title");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const genres = useMemo(() => {
    const genreSet = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(genreSet).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    // Sort based on selected sort option
    if (sortBy === "rating") {
      return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    // Default: alphabetically by title
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [books, searchQuery, selectedGenre, sortBy]);

  const handleReactionConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  const getGenreStyle = (genre: string) =>
    GENRE_STYLES[genre] || GENRE_STYLES.default;

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <Card variant="outlined" padding="none" className="mb-10 shadow-sm border-cream-300 p-5">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-5">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-2">
              🔍 Search Books
            </label>
            <SearchInput
              placeholder="Type a book title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="bg-cream-50 border-cream-300 focus:bg-white"
            />
          </div>

          {/* Sort Options */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-2 text-center">
              📊 Sort By
            </label>
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => setSortBy("title")}
                size="sm"
                className={`${
                  sortBy === "title"
                    ? "bg-stone-800 text-white hover:bg-stone-800"
                    : "bg-cream-100 text-stone-500 hover:bg-stone-100"
                }`}
              >
                A-Z
              </Button>
              <Button
                onClick={() => setSortBy("rating")}
                size="sm"
                icon={<span>⭐</span>}
                iconPosition="left"
                className={`${
                  sortBy === "rating"
                    ? ""
                    : "bg-cream-100 text-stone-500 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                Highest Rated
              </Button>
            </div>
          </div>

          {/* Filter Pills */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-2 text-center">
              📚 Filter by Genre
            </label>
            <div
              className="flex flex-wrap justify-center gap-2"
              role="group"
              aria-label="Filter by genre"
            >
              <button
                onClick={() => setSelectedGenre(null)}
                aria-pressed={!selectedGenre}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  !selectedGenre
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-500 ring-offset-2"
                    : "bg-cream-100 text-stone-600 border-2 border-cream-300 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95"
                }`}
              >
                All Books
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() =>
                    setSelectedGenre(selectedGenre === genre ? null : genre)
                  }
                  aria-pressed={selectedGenre === genre}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    selectedGenre === genre
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-500 ring-offset-2"
                      : "bg-cream-100 text-stone-600 border-2 border-cream-300 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Books Grid - Clean covers with fun animations */}
      {filteredBooks.length > 0 ? (
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
          {filteredBooks.map((book) => {
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
                  <BookCoverImage book={book} className="w-full h-full" />

                  {/* Desktop hover overlay with title, genre, and rating */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Genre tag - only visible on hover */}
                    {book.genre && (
                      <span className="inline-block px-2 py-0.5 mb-1.5 rounded-full text-xs font-medium bg-white/20 text-white/90 backdrop-blur-sm">
                        {book.genre}
                      </span>
                    )}
                    {/* Star rating on hover */}
                    {book.rating && book.rating > 0 && (
                      <div className="flex items-center gap-0.5 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < book.rating! ? "text-amber-300" : "text-white/30"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-2 drop-shadow-lg">
                      {book.title}
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      {book.author}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <span className="text-5xl mb-3 block">🔍</span>
          <h3 className="text-lg font-bold text-stone-700 mb-1">
            No books found
          </h3>
          <p className="text-stone-500 text-sm mb-4">
            Try a different search or filter
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre(null);
            }}
            size="sm"
            className="rounded-full px-5 py-2.5"
          >
            Show All
          </Button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showConfetti && <ConfettiParticles />}

            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <Card
              variant="elevated"
              padding="none"
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
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
                    className="h-56 w-auto shadow-xl rounded-md"
                    onError={(e) => {
                      // If image fails, replace with gradient fallback
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'h-56 w-40 shadow-xl flex items-center justify-center text-white p-4 rounded';
                        const [c1, c2] = getBookGradient(selectedBook.title);
                        fallback.style.background = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
                        fallback.innerHTML = `<span class="text-xl font-bold text-center">${selectedBook.title}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div
                    className="h-56 w-40 shadow-xl flex items-center justify-center text-white p-4 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${getBookGradient(selectedBook.title)[0]} 0%, ${getBookGradient(selectedBook.title)[1]} 100%)`,
                    }}
                  >
                    <span className="text-xl font-bold text-center">
                      {selectedBook.title}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-cream-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-stone-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-stone-700 mb-1">
                  {selectedBook.title}
                </h2>
                <p className="text-stone-500 mb-4">By {selectedBook.author}</p>

                {selectedBook.rating && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xl text-star">
                          {i < selectedBook.rating! ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-stone-600">
                      {selectedBook.rating}/5
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBook.genre && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getGenreStyle(selectedBook.genre).bg} ${getGenreStyle(selectedBook.genre).text}`}
                    >
                      {getGenreStyle(selectedBook.genre).emoji}{" "}
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.pageCount && (
                    <span className="px-4 py-2 bg-cream-200 text-stone-600 rounded-full text-sm font-medium">
                      {selectedBook.pageCount} pages
                    </span>
                  )}
                </div>

                <div className="bg-cream-100 rounded-xl p-5 border border-cream-300 mb-6">
                  <h3 className="font-bold text-stone-700 mb-2 text-lg">
                    Izzy's Review
                  </h3>
                  {selectedBook.notes || selectedBook.review ? (
                    <p className="text-stone-600 leading-relaxed">
                      {selectedBook.notes || selectedBook.review}
                    </p>
                  ) : (
                    <p className="text-stone-400 italic">Review coming soon!</p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-center font-medium text-stone-600">
                    What do you think of this book?
                  </p>
                  <div className="flex justify-center">
                    <BookReactionButtons
                      bookId={selectedBook.id}
                      onReaction={handleReactionConfetti}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <ShareBookButton
                    book={selectedBook}
                    variant="button"
                    size="lg"
                    className="w-full justify-center py-3 bg-primary-500 hover:bg-primary-600 text-white"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FunBookshelfPublic;
