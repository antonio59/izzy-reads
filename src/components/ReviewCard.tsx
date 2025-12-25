import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Share2, BookOpen, Calendar, MessageCircle } from "lucide-react";
import type { Book } from "../types";
import { ReviewReactionButtons } from "./ReactionButtons";

interface ReviewCardProps {
  book: Book;
  featured?: boolean;
}

export function ReviewCard({ book, featured = false }: ReviewCardProps) {
  const [imageError, setImageError] = useState(false);

  const reviewText = book.notes || book.review;
  if (!reviewText) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/reviews/${book.id}`;
    const shareText = `Check out Izzy's review of "${book.title}" by ${book.author}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Izzy's Review: ${book.title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <motion.article
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        featured ? "ring-2 ring-primary-300" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Book Cover */}
        <div className="md:w-48 flex-shrink-0">
          <Link
            to={`/reviews/${book.id}`}
            className="block relative aspect-[2/3] md:aspect-auto md:h-full"
          >
            {book.coverUrl && !imageError ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white/80" />
              </div>
            )}
            {featured && (
              <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </div>
            )}
          </Link>
        </div>

        {/* Review Content */}
        <div className="flex-1 p-5 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <Link
                to={`/reviews/${book.id}`}
                className="text-xl font-display font-bold text-stone-800 hover:text-primary-600 transition-colors line-clamp-1"
              >
                {book.title}
              </Link>
              <p className="text-stone-500 text-sm">by {book.author}</p>
            </div>

            {/* Rating */}
            {book.rating && book.rating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < book.rating!
                        ? "text-amber-400 fill-amber-400"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-stone-400 mb-4">
            {book.genre && (
              <span className="bg-accent-100 text-accent-600 px-2 py-1 rounded-full font-medium">
                {book.genre}
              </span>
            )}
            {book.dateRead && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(book.dateRead).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <p className="text-stone-600 leading-relaxed line-clamp-3">
              "{reviewText}"
            </p>
            {reviewText.length > 200 && (
              <Link
                to={`/reviews/${book.id}`}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2 inline-block"
              >
                Read full review →
              </Link>
            )}
          </div>

          {/* Actions & Reactions */}
          <div className="border-t border-stone-100 pt-4">
            <div className="flex items-center justify-between gap-4">
              {/* Reaction buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-stone-400 mr-1">
                  <MessageCircle className="w-3 h-3 inline mr-1" />
                  React:
                </span>
                <ReviewReactionButtons
                  bookId={book.id}
                  showLabel={false}
                  size="sm"
                  maxVisible={3}
                  showMoreButton={true}
                />
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ReviewCard;
