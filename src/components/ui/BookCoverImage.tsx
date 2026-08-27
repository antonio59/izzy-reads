import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { Book } from "../../types";
import {
  isLikelyInvalidCover,
  upgradeCoverUrl,
} from "../../lib/coverUrl";

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

export type BookCoverSize = "thumb" | "card" | "hero";

interface BookCoverImageProps {
  book: Book;
  className?: string;
  /** Visual role — affects object-fit and decoding priority */
  size?: BookCoverSize;
  /** Prefer full cover visible (Discover / detail) vs cropped grid tiles */
  fit?: "cover" | "contain";
  priority?: boolean;
}

export function BookCoverImage({
  book,
  className = "",
  size = "card",
  fit = "cover",
  priority = false,
}: BookCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [color1, color2] = getBookGradient(book.title);

  const coverSrc = useMemo(
    () => upgradeCoverUrl(book.coverUrl),
    [book.coverUrl],
  );

  const showFallback =
    !coverSrc || hasError || isLikelyInvalidCover(coverSrc);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const { naturalWidth, naturalHeight } = img;

      if (!naturalWidth || !naturalHeight) {
        setHasLoaded(true);
        return;
      }

      // Reject tiny broken icons / 1×1 tracking pixels
      if (naturalWidth < 40 || naturalHeight < 40) {
        setHasError(true);
        return;
      }

      const aspectRatio = naturalWidth / naturalHeight;
      if (aspectRatio > 5 || aspectRatio < 0.2) {
        setHasError(true);
        return;
      }

      setHasLoaded(true);
    },
    [],
  );

  const objectFit = fit === "contain" ? "object-contain" : "object-cover";
  const loading = priority || size === "hero" ? "eager" : "lazy";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!showFallback && (
        <>
          {!hasLoaded && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
              }}
            />
          )}
          <img
            src={coverSrc}
            alt={book.title}
            loading={loading}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full ${objectFit} transition-opacity duration-300 ${
              hasLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleLoad}
            onError={() => setHasError(true)}
          />
        </>
      )}

      {showFallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full flex flex-col items-center justify-center p-5 text-center"
          style={{
            background: `linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)`,
            border: "1px solid #d6d3d1",
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <BookOpen
              className="w-10 h-10 text-stone-400 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-sm font-semibold text-stone-700 leading-snug line-clamp-3 max-w-full">
              {book.title}
            </p>
            {book.author && (
              <p className="text-xs text-stone-500 mt-1.5 line-clamp-1 max-w-full">
                {book.author}
              </p>
            )}
          </div>
          <div className="w-full pt-3 mt-2 border-t border-stone-300/60">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
              No cover available
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export { getBookGradient };
