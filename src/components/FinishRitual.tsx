import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PenTool, PartyPopper, X } from "lucide-react";
import type { Book } from "../types";
import { BookCoverImage } from "./ui/BookCoverImage";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { ShareBookButton } from "./ShareButton";

interface FinishRitualProps {
  book: Book | null;
  onClose: () => void;
  onWriteReview?: (book: Book) => void;
}

/**
 * Celebration when Izzy finishes a book — shareable moment + path to write a review.
 */
export function FinishRitual({
  book,
  onClose,
  onWriteReview,
}: FinishRitualProps) {
  const { prefersReducedMotion } = useMotionPreference();
  const open = Boolean(book);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: 8 + ((i * 7) % 84),
        delay: (i % 6) * 0.08,
        emoji: ["⭐", "✨", "📚", "💖"][i % 4],
      })),
    [],
  );

  return (
    <AnimatePresence>
      {open && book && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="finish-ritual-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={onClose}
          />

          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {sparkles.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl top-[40%]"
                  style={{ left: `${s.left}%` }}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, -120],
                    scale: [0.5, 1.1, 0.8],
                  }}
                  transition={{ duration: 1.4, delay: s.delay }}
                >
                  {s.emoji}
                </motion.span>
              ))}
            </div>
          )}

          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={
              prefersReducedMotion ? false : { opacity: 0, scale: 0.92, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center"
              aria-label="Close celebration"
            >
              <X className="w-4 h-4 text-stone-600" />
            </button>

            <div className="bg-gradient-to-b from-primary-50 via-cream-100 to-white px-6 pt-8 pb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wide mb-4">
                <PartyPopper className="w-3.5 h-3.5" />
                Finished!
              </div>
              <div className="mx-auto w-28 aspect-[2/3] rounded-lg overflow-hidden shadow-xl ring-1 ring-black/5 mb-4">
                <BookCoverImage book={book} className="w-full h-full" />
              </div>
              <h2
                id="finish-ritual-title"
                className="font-accent text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight"
              >
                You finished it!
              </h2>
              <p className="text-stone-500 mt-2 text-sm sm:text-base">
                <span className="font-display font-bold text-stone-800">
                  {book.title}
                </span>{" "}
                is on your shelf now.
              </p>
            </div>

            <div className="px-6 pb-7 pt-2 space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (book && onWriteReview) onWriteReview(book);
                  else onClose();
                }}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
              >
                <PenTool className="w-4 h-4" />
                Write your review
              </button>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 text-primary-700 font-semibold text-sm hover:bg-primary-50 rounded-xl transition-colors"
              >
                See it on my bookshelf
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="pt-1 flex justify-center">
                <ShareBookButton book={book} size="md" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FinishRitual;
