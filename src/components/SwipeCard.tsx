import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { BookOpen, Heart, X, ChevronDown, ChevronUp } from "lucide-react";

interface BookCandidate {
  googleBookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
}

interface SwipeCardProps {
  book: BookCandidate;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  onClick?: () => void;
  exitDirection?: "left" | "right" | null;
}

const SWIPE_THRESHOLD = 120;

function SwipeCard({ book, onSwipe, isTop, onClick, exitDirection }: SwipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  };

  // Strip HTML tags from description using DOMParser for safe sanitization
  const cleanDescription = book.description
    ? (() => {
        const doc = new DOMParser().parseFromString(book.description, "text/html");
        return doc.body.textContent || "";
      })()
    : "";

  // Exit animation direction: pass goes left, like goes right
  const exitX = exitDirection === "left" ? -300 : 300;

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0"}`}
      style={isTop ? { x, rotate } : undefined}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{
        x: exitX,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Cover Image */}
        <div
          className="relative flex-shrink-0 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center cursor-pointer"
          style={{ height: expanded ? "35%" : "55%" }}
          onClick={() => onClick?.()}
        >
          {book.coverUrl && !imageError ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-auto max-w-[80%] object-contain drop-shadow-xl rounded-md"
              draggable={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-32 h-48 rounded-lg bg-white/60 flex flex-col items-center justify-center p-4 text-center">
              <BookOpen className="w-12 h-12 text-stone-400 mb-2" />
              <span className="text-xs font-semibold text-stone-500 line-clamp-2">
                {book.title}
              </span>
            </div>
          )}

          {/* Tap hint */}
          {isTop && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium">
              Tap for details
            </div>
          )}

          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-lg border-2 border-white shadow-lg -rotate-12"
                style={{ opacity: likeOpacity }}
              >
                WANT IT
              </motion.div>
              <motion.div
                className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-red-400 text-white font-bold text-lg border-2 border-white shadow-lg rotate-12"
                style={{ opacity: passOpacity }}
              >
                PASS
              </motion.div>
            </>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 p-5 flex flex-col min-h-0">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-stone-800 leading-tight line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-stone-500 mt-1">by {book.author}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {book.genre && book.genre !== "Other" && (
              <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                {book.genre}
              </span>
            )}
            {book.pageCount && book.pageCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                {book.pageCount} pages
              </span>
            )}
          </div>

          {/* Description - always visible preview */}
          {cleanDescription && (
            <div className={`mt-3 overflow-y-auto ${expanded ? "flex-1" : "max-h-20"}`}>
              <p className={`text-sm text-stone-600 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
                {cleanDescription}
              </p>
            </div>
          )}

          {/* Expand/collapse toggle */}
          {cleanDescription && cleanDescription.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="mt-2 self-start flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Read more
                </>
              )}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        {isTop && (
          <div className="flex items-center justify-center gap-6 p-4 border-t border-stone-100">
            <button
              onClick={() => onSwipe("left")}
              className="w-14 h-14 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6 text-red-400" />
            </button>
            <button
              onClick={() => onSwipe("right")}
              className="w-14 h-14 rounded-full bg-green-50 hover:bg-green-100 border-2 border-green-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Heart className="w-6 h-6 text-green-500" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default SwipeCard;
