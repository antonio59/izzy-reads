import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  BookOpen,
  Calendar,
  Save,
  Sparkles,
  Gift,
} from "lucide-react";
import type { Book } from "../types";

interface EditBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookId: string, updates: Partial<Book>) => Promise<void>;
}

// Generate month options
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Generate year options (last 10 years)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);

export function EditBookModal({
  book,
  isOpen,
  onClose,
  onSave,
}: EditBookModalProps) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [giftFrom, setGiftFrom] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Reset form when book changes
  useEffect(() => {
    if (book) {
      setRating(book.rating || 0);
      setNotes(book.notes || "");
      setGiftFrom(book.giftFrom || "");

      // Parse existing date (could be YYYY-MM-DD or YYYY-MM format)
      if (book.dateRead) {
        const parts = book.dateRead.split("-");
        setYear(parts[0] || String(currentYear));
        setMonth(parts[1] || "");
      } else {
        // Default to current month/year
        const now = new Date();
        setYear(String(now.getFullYear()));
        setMonth(String(now.getMonth() + 1).padStart(2, "0"));
      }
    }
  }, [book]);

  // Combine month and year into dateRead format
  const dateRead = useMemo(() => {
    if (month && year) {
      return `${year}-${month}`;
    }
    return "";
  }, [month, year]);

  if (!book) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(book.id, {
        rating,
        notes,
        dateRead,
        giftFrom: giftFrom || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayRating = hoverRating || rating;

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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with Book Info */}
            <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                {/* Book Cover */}
                <div className="w-20 h-28 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-white/20">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white/70" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold mb-1 line-clamp-2">
                    {book.title}
                  </h2>
                  <p className="text-white/80 text-sm mb-2">by {book.author}</p>
                  {book.genre && (
                    <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs">
                      {book.genre}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  <Star className="w-4 h-4 inline mr-2 text-amber-500" />
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= displayRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-lg font-bold text-stone-700 ml-2">
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>

              {/* Month/Year Read */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-primary-500" />
                  When did you finish this book?
                </label>
                <div className="flex gap-3">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select month</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-32 px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gift From */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  <Gift className="w-4 h-4 inline mr-2 text-pink-500" />
                  Gift from (optional)
                </label>
                <p className="text-xs text-stone-500 mb-2">
                  Did someone special give you this book? Remember them here!
                </p>
                <input
                  type="text"
                  value={giftFrom}
                  onChange={(e) => setGiftFrom(e.target.value)}
                  placeholder="e.g., Grandma, Uncle Joe, Mom..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Review/Notes */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  <Sparkles className="w-4 h-4 inline mr-2 text-accent-500" />
                  Your Review
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Share your thoughts about this book! What did you love? What
                  would you tell a friend about it?
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your review here... What did you think of the story? Who was your favorite character? Would you recommend it?"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  rows={6}
                />
                <p className="text-xs text-stone-400 mt-2 text-right">
                  {notes.length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditBookModal;
