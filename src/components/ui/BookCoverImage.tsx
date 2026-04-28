import { useState } from "react";
import { motion } from "framer-motion";
import type { Book } from "../../types";

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

interface BookCoverImageProps {
  book: Book;
  className?: string;
  fallbackEmoji?: string;
}

export function BookCoverImage({
  book,
  className = "",
  fallbackEmoji = "📖",
}: BookCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [color1, color2] = getBookGradient(book.title);

  const showFallback = !book.coverUrl || hasError;

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
            {fallbackEmoji}
          </motion.span>
          <span className="text-sm font-bold text-center leading-tight line-clamp-3">
            {book.title}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export { getBookGradient };
