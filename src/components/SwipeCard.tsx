import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { BookOpen, Heart, X, ChevronDown, ChevronUp } from "lucide-react";
import { upgradeCoverUrl } from "../lib/coverUrl";

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
  stackIndex?: number;
}

const SWIPE_THRESHOLD = 120;

function SwipeCard({
  book,
  onSwipe,
  isTop,
  onClick,
  exitDirection,
  stackIndex = 0,
}: SwipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [0, 80, 140], [0, 0.6, 1]);
  const passOpacity = useTransform(x, [-140, -80, 0], [1, 0.6, 0]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  };

  const cleanDescription = book.description
    ? (() => {
        const doc = new DOMParser().parseFromString(
          book.description,
          "text/html",
        );
        return doc.body.textContent || "";
      })()
    : "";

  const exitX = exitDirection === "left" ? -320 : 320;
  const stackOffset = stackIndex * 10;
  const stackScale = 1 - stackIndex * 0.04;

  return (
    <motion.div
      className={`absolute inset-x-0 ${isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0 pointer-events-none"}`}
      style={
        isTop
          ? { x, rotate, top: 0, bottom: 0 }
          : { top: stackOffset, bottom: -stackOffset, scale: stackScale }
      }
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{
        scale: isTop ? 1 : stackScale,
        opacity: isTop ? 1 : 0.85 - stackIndex * 0.12,
        y: stackOffset,
      }}
      animate={{
        scale: isTop ? 1 : stackScale,
        opacity: isTop ? 1 : 0.85 - stackIndex * 0.12,
        y: stackOffset,
      }}
      exit={{
        x: exitX,
        opacity: 0,
        transition: { duration: 0.28, ease: "easeIn" },
      }}
    >
      <div className="w-full h-full bg-white rounded-3xl shadow-xl shadow-stone-900/8 ring-1 ring-cream-300 overflow-hidden flex flex-col">
        {/* Cover */}
        <div
          className="relative flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{
            height: expanded ? "28%" : "44%",
            background:
              "linear-gradient(165deg, #fdf2f8 0%, #fff7eb 45%, #ccfbf1 100%)",
          }}
          onClick={() => onClick?.()}
        >
          {book.coverUrl && !imageError ? (
            <img
              src={upgradeCoverUrl(book.coverUrl)}
              alt={book.title}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-[92%] w-auto max-w-[72%] object-contain drop-shadow-2xl rounded-sm"
              draggable={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-28 h-40 rounded-lg bg-white/80 ring-1 ring-cream-300 flex flex-col items-center justify-center p-3 text-center shadow-md">
              <BookOpen className="w-10 h-10 text-primary-300 mb-2" />
              <span className="text-xs font-display font-bold text-stone-600 line-clamp-3">
                {book.title}
              </span>
            </div>
          )}

          {isTop && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-stone-600 text-[11px] font-medium ring-1 ring-cream-300 shadow-sm">
              Tap cover for full details
            </div>
          )}

          {isTop && (
            <>
              <motion.div
                className="absolute top-5 right-5 px-3.5 py-1.5 rounded-xl bg-accent-600 text-white font-display font-bold text-sm border-2 border-white shadow-lg -rotate-6 tracking-wide"
                style={{ opacity: likeOpacity }}
              >
                WANT IT
              </motion.div>
              <motion.div
                className="absolute top-5 left-5 px-3.5 py-1.5 rounded-xl bg-stone-500 text-white font-display font-bold text-sm border-2 border-white shadow-lg rotate-6 tracking-wide"
                style={{ opacity: passOpacity }}
              >
                PASS
              </motion.div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 px-5 pt-4 pb-3 flex flex-col min-h-0 border-t border-cream-200">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold text-stone-900 leading-snug line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-stone-500 mt-1">by {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {book.genre && book.genre !== "Other" && (
              <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold ring-1 ring-primary-100">
                {book.genre}
              </span>
            )}
            {book.pageCount && book.pageCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-cream-100 text-stone-600 text-xs font-medium ring-1 ring-cream-300">
                {book.pageCount} pages
              </span>
            )}
          </div>

          <div
            className={`mt-3 overflow-y-auto ${expanded ? "flex-1" : "max-h-24"}`}
          >
            <p
              className={`text-sm text-stone-600 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
            >
              {cleanDescription ||
                "No blurb yet — tap the cover to peek, or add it to your wishlist if the title catches your eye."}
            </p>
          </div>

          {cleanDescription && cleanDescription.length > 120 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="mt-2 self-start inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Read more
                </>
              )}
            </button>
          )}
        </div>

        {isTop && (
          <div className="flex items-center justify-center gap-8 px-5 py-4 bg-cream-50/80 border-t border-cream-200">
            <button
              type="button"
              onClick={() => onSwipe("left")}
              aria-label="Pass on this book"
              className="w-14 h-14 rounded-full bg-white hover:bg-stone-50 ring-2 ring-stone-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <X className="w-6 h-6 text-stone-500" />
            </button>
            <button
              type="button"
              onClick={() => onSwipe("right")}
              aria-label="Add to wishlist"
              className="w-16 h-16 rounded-full bg-primary-600 hover:bg-primary-700 ring-4 ring-primary-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary-600/25"
            >
              <Heart className="w-7 h-7 text-white fill-white/20" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default SwipeCard;
