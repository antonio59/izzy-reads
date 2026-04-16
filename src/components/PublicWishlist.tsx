import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, BookOpen, Sparkles, X, Lightbulb, Share2, Check, ShoppingBag } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Book } from "../types";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { SuggestionFormModal } from "./SuggestionFormModal";

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

// Book Cover Component with error handling
function BookCoverImage({
  book,
  className = "",
}: {
  book: Book;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [color1, color2] = getBookGradient(book.title);

  const showFallback = !book.coverUrl || hasError;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!showFallback && (
        <>
          {/* Loading skeleton */}
          {!hasLoaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
              }}
            />
          )}
          <img
            src={book.coverUrl}
            alt={book.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              hasLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth < 30 || img.naturalHeight < 30) {
                setHasError(true);
              } else {
                setHasLoaded(true);
              }
            }}
            onError={() => setHasError(true)}
          />
        </>
      )}

      {showFallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
        </motion.div>
      )}
    </div>
  );
}

const PublicWishlist = () => {
  const { wishlist, isLoading } = useBooks();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [buyingBookId, setBuyingBookId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const markAsBought = useMutation(api.wishlist.markAsBought);

  const handleMarkAsBought = async (bookId: string) => {
    if (!buyerName.trim()) {
      setBuyError("Please enter your name");
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await markAsBought({ id: bookId as any, boughtBy: buyerName.trim() });
      setBuySuccess(true);
      setTimeout(() => {
        setBuyingBookId(null);
        setBuyerName("");
        setBuyError("");
        setBuySuccess(false);
      }, 2000);
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/my-wishlist`;
    const shareData = {
      title: "Izzy's Book Wishlist",
      text: "Check out Izzy's book wishlist! Know a great book? Suggest one!",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50 flex flex-col">
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
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white text-stone-600 font-bold rounded-full shadow-sm hover:shadow-md transition-all text-sm border border-stone-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {shareStatus === "copied" ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share Wishlist
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Grid - Book Covers */}
      <section className="py-12 px-4 flex-1">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid gap-4 sm:gap-5 md:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-xl bg-stone-200 animate-pulse"
                />
              ))}
            </div>
          ) : sortedWishlist.length > 0 ? (
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

                      {/* Bought overlay */}
                      {book.boughtBy ? (
                        <div className="absolute inset-0 bg-green-900/60 flex flex-col items-center justify-center">
                          <div className="bg-green-500 rounded-full p-2 mb-2 shadow-lg">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white text-xs font-bold drop-shadow">Bought!</span>
                          <span className="text-white/80 text-[10px] mt-0.5 drop-shadow">
                            by {book.boughtBy}
                          </span>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-4"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">🎁</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                My Wishlist is Empty!
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-4">
                I'm always looking for new books to read! Have a suggestion? Ask
                a grown-up to help you send me a book idea.
              </p>
              <div className="bg-cream-100 rounded-2xl p-4 max-w-sm mx-auto">
                <p className="text-sm text-stone-600">
                  <span className="text-lg mr-2">💡</span>
                  <span className="font-medium">Tip:</span> Check back soon -
                  I'll be adding books I'd love to read!
                </p>
              </div>
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
                <div className="h-56 w-40 shadow-2xl rounded-sm overflow-hidden">
                  <BookCoverImage book={selectedBook} className="w-full h-full" />
                </div>

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

                {/* Bought status / Buy button */}
                <div className="pt-4 border-t border-cream-200">
                  {selectedBook.boughtBy ? (
                    <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="bg-green-500 rounded-full p-2">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-green-700 font-semibold text-sm">Someone got this!</p>
                        <p className="text-green-600 text-xs">
                          Bought by {selectedBook.boughtBy}
                        </p>
                      </div>
                    </div>
                  ) : buyingBookId === selectedBook.id ? (
                    <div className="space-y-3">
                      {buySuccess ? (
                        <div className="flex items-center gap-2 justify-center bg-green-50 rounded-xl p-4">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 font-semibold">Thank you!</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-stone-500 text-center">
                            Enter your name so we know who's getting this book!
                          </p>
                          <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => { setBuyerName(e.target.value); setBuyError(""); }}
                            placeholder="Your name"
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                            autoFocus
                          />
                          {buyError && (
                            <p className="text-red-500 text-xs">{buyError}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMarkAsBought(selectedBook.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Confirm
                            </button>
                            <button
                              onClick={() => { setBuyingBookId(null); setBuyerName(""); setBuyError(""); }}
                              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => setBuyingBookId(selectedBook.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      I Bought This!
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggest a Book Modal */}
      <SuggestionFormModal
        isOpen={showSuggestionForm}
        onClose={() => setShowSuggestionForm(false)}
        recipientName="Izzy"
      />

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicWishlist;
