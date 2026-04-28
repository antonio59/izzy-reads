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

function isLikelyInvalidCover(url: string | undefined): boolean {
  if (!url) return true;
  const lowerUrl = url.toLowerCase();
  
  // Common patterns for placeholder/invalid cover URLs
  const invalidPatterns = [
    'placeholder',
    'no-cover',
    'nocover',
    'default',
    'missing',
    'blank',
    '1x1',
    'spacer',
  ];
  if (invalidPatterns.some(pattern => lowerUrl.includes(pattern))) {
    return true;
  }
  
  // Open Library returns placeholder images for missing covers
  // These URLs still contain cover IDs but return a generic image
  // We can't detect these by URL alone, they need image analysis
  
  return false;
}

export function BookCoverImage({
  book,
  className = "",
  fallbackEmoji = "📖",
}: BookCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [color1, color2] = getBookGradient(book.title);

  // Check if URL looks like a placeholder or invalid cover
  const showFallback = !book.coverUrl || hasError || isLikelyInvalidCover(book.coverUrl);

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
            crossOrigin="anonymous"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              hasLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={(e) => {
              const img = e.currentTarget;
              const { naturalWidth, naturalHeight } = img;
              
              // Check for tiny images
              if (naturalWidth < 50 || naturalHeight < 50) {
                setHasError(true);
                return;
              }
              
              // Check for 1-pixel dimension (common placeholder)
              if (naturalWidth === 1 || naturalHeight === 1) {
                setHasError(true);
                return;
              }
              
              // Check for Google Books placeholder: very wide and short (e.g., 575x92)
              // Real book covers have aspect ratio between 0.5 and 1.0 (height > width)
              const aspectRatio = naturalWidth / naturalHeight;
              if (aspectRatio > 2) {
                // Image is more than 2x wider than tall - likely a placeholder banner
                setHasError(true);
                return;
              }
              
              setHasLoaded(true);
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
