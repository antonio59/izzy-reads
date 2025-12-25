import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  BookOpen,
  Calendar,
  Hash,
  Quote,
  Heart,
  Sparkles,
  Share2,
  Edit3,
  Trash2,
} from "lucide-react";
import type { Book } from "../types";

// Generate gradient from title
function getBookGradient(title: string): string {
  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-rose-500 via-pink-500 to-purple-500",
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

// Get genre emoji
function getGenreEmoji(genre: string): string {
  const emojis: Record<string, string> = {
    fantasy: "🧙‍♂️",
    "science fiction": "🚀",
    mystery: "🔍",
    romance: "💕",
    horror: "👻",
    adventure: "🗺️",
    historical: "🏰",
    humor: "😂",
    default: "📖",
  };
  return emojis[genre.toLowerCase()] || emojis.default;
}

interface BookDetailModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  showActions?: boolean;
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  showActions = false,
}: BookDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  const [showFullNotes, setShowFullNotes] = useState(false);

  // Early return if no book - prevents accessing properties of null
  if (!book) {
    return null;
  }

  const gradient = getBookGradient(book.title);
  const genreEmoji = getGenreEmoji(book.genre);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with Cover */}
            <div className="relative h-64 overflow-hidden">
              {/* Background */}
              {book.coverUrl && !imageError ? (
                <>
                  <img
                    src={book.coverUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
                    onError={() => setImageError(true)}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30`}
                  />
                </>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Decorative Elements */}
              <motion.div
                className="absolute top-6 left-6 text-4xl opacity-20"
                animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {genreEmoji}
              </motion.div>
              <motion.div
                className="absolute top-6 right-16 text-2xl opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Book Cover & Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
                {/* Cover */}
                <motion.div
                  className="relative w-28 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ring-4 ring-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {book.coverUrl && !imageError ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                      <BookOpen className="w-10 h-10 text-white/80" />
                    </div>
                  )}
                </motion.div>

                {/* Title & Author */}
                <motion.div
                  className="flex-1 pb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white drop-shadow-lg line-clamp-2">
                    {book.title}
                  </h2>
                  <p className="text-white/90 text-lg mt-1">{book.author}</p>
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              {/* Rating */}
              {book.rating && book.rating > 0 && (
                <motion.div
                  className="flex items-center gap-2 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            i < book.rating!
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-amber-600">
                    {book.rating}/5
                  </span>
                </motion.div>
              )}

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {book.genre && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
                    <span>{genreEmoji}</span>
                    {book.genre}
                  </span>
                )}
                {book.pageCount && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
                    <Hash className="w-4 h-4" />
                    {book.pageCount} pages
                  </span>
                )}
                {book.dateRead && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-600 rounded-full">
                    <Calendar className="w-4 h-4" />
                    Read{" "}
                    {new Date(book.dateRead).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                {book.isRead && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-600 rounded-full">
                    <Heart className="w-4 h-4 fill-current" />
                    Finished
                  </span>
                )}
              </motion.div>

              {/* Description */}
              {book.description && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    About This Book
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </motion.div>
              )}

              {/* Notes/Review */}
              {book.notes && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Quote className="w-4 h-4" />
                    My Thoughts
                  </h3>
                  <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                    <Sparkles className="absolute top-3 right-3 w-5 h-5 text-purple-300" />
                    <p
                      className={`text-gray-700 italic leading-relaxed ${!showFullNotes && book.notes.length > 300 ? "line-clamp-4" : ""}`}
                    >
                      "{book.notes}"
                    </p>
                    {book.notes.length > 300 && (
                      <button
                        onClick={() => setShowFullNotes(!showFullNotes)}
                        className="mt-2 text-purple-600 hover:text-purple-800 font-medium text-sm"
                      >
                        {showFullNotes ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                className="flex flex-wrap gap-3 pt-4 border-t border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: book.title,
                      text: `Check out "${book.title}" by ${book.author}!`,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                {showActions && onEdit && (
                  <button
                    onClick={() => onEdit(book)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}

                {showActions && onDelete && (
                  <button
                    onClick={() => onDelete(book)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BookDetailModal;
