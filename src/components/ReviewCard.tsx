import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Star } from "lucide-react";
import type { Book } from "../types";
import { BookCoverImage } from "./ui/BookCoverImage";
import { ReviewReactionButtons } from "./ReactionButtons";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";

interface ReviewCardProps {
  book: Book;
  featured?: boolean;
  index?: number;
}

export function ReviewCard({ book, featured = false, index = 0 }: ReviewCardProps) {
  const { prefersReducedMotion } = useMotionPreference();
  const reviewText = book.notes || book.review;
  if (!reviewText) return null;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { delay: Math.min(index * 0.04, 0.24) }
      }
      className={`group relative flex gap-4 sm:gap-6 ${
        featured ? "pb-2" : ""
      }`}
    >
      {/* Cover */}
      <Link
        to={`/reviews/${book.id}`}
        className="flex-shrink-0 w-24 sm:w-28 md:w-32"
        aria-label={`Read review of ${book.title}`}
      >
        <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 transition-all group-hover:-translate-y-1">
          <BookCoverImage book={book} className="w-full h-full" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
          {book.genre && (
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              {book.genre}
            </span>
          )}
          {book.dateRead && (
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Calendar className="w-3 h-3" aria-hidden />
              {new Date(book.dateRead).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {featured && (
            <span className="text-xs font-bold text-primary-600">Latest</span>
          )}
        </div>

        <Link
          to={`/reviews/${book.id}`}
          className="block"
        >
          <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900 group-hover:text-primary-700 transition-colors leading-snug line-clamp-2">
            {book.title}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">by {book.author}</p>
        </Link>

        {book.rating && book.rating > 0 && (
          <div
            className="flex items-center gap-1 mt-2"
            aria-label={`${book.rating} out of 5 stars`}
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < book.rating!
                    ? "text-star fill-star"
                    : "text-stone-200"
                }`}
              />
            ))}
          </div>
        )}

        <blockquote className="mt-3 text-stone-600 leading-relaxed line-clamp-3 text-sm sm:text-base">
          “{reviewText}”
        </blockquote>

        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/reviews/${book.id}`}
            className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors group/link"
          >
            Read full review
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>

          <div className="flex items-center gap-2">
            <ReviewReactionButtons
              bookId={book.id}
              showLabel={false}
              size="sm"
              maxVisible={3}
              showMoreButton={true}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ReviewCard;
