import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

// Generate a beautiful gradient from book title
function getBookGradient(title: string): string {
  const gradients = [
    "from-primary-500 via-primary-600 to-accent-500",
    "from-accent-400 via-accent-500 to-accent-700",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-primary-400 via-primary-500 to-accent-400",
    "from-accent-500 via-accent-600 to-primary-500",
    "from-teal-500 via-emerald-500 to-green-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-primary-500 via-primary-600 to-primary-700",
    "from-accent-500 via-primary-500 to-primary-600",
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

// Get a decorative emoji based on genre
function getGenreEmoji(genre: string): string {
  const genreEmojis: Record<string, string> = {
    fantasy: "🧙‍♂️",
    "science fiction": "🚀",
    mystery: "🔍",
    romance: "💕",
    horror: "👻",
    adventure: "🗺️",
    historical: "🏰",
    biography: "📜",
    "non-fiction": "🎓",
    humor: "😂",
    poetry: "🌸",
    thriller: "🔪",
    drama: "🎭",
    "graphic novel": "📚",
    default: "📖",
  };
  return genreEmojis[genre.toLowerCase()] || genreEmojis.default;
}

interface BookCoverProps {
  title: string;
  author?: string;
  coverUrl?: string | null;
  genre?: string;
  className?: string;
  aspectRatio?: "2/3" | "3/4" | "1/1";
  showTitle?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Reliable Book Cover Component
 * 
 * Features:
 * - Verifies Open Library covers actually exist before showing
 * - Shows beautiful gradient fallback if cover fails or is missing
 * - Smooth loading transitions
 * - Optional title overlay on fallback
 */
export function BookCover({
  title,
  author,
  coverUrl,
  genre = "Fiction",
  className = "",
  aspectRatio = "2/3",
  showTitle = true,
  onLoad,
  onError,
}: BookCoverProps) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    coverUrl ? "loading" : "error",
  );

  const gradient = getBookGradient(title);
  const genreEmoji = getGenreEmoji(genre);

  const aspectClasses = {
    "2/3": "aspect-[2/3]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
  };

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // Google Books sometimes returns a 1x1 placeholder or "no cover" image with HTTP 200
    if (img.naturalWidth < 30 || img.naturalHeight < 30) {
      setImageState("error");
      onError?.();
      return;
    }
    setImageState("loaded");
    onLoad?.();
  }, [onLoad, onError]);

  const handleError = useCallback(() => {
    setImageState("error");
    onError?.();
  }, [onError]);

  // If no cover URL or image failed to load, show fallback
  const showFallback = !coverUrl || imageState === "error";

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md ${aspectClasses[aspectRatio]} ${className}`}
    >
      {/* Actual Cover Image */}
      {!showFallback && coverUrl && (
        <>
          {/* Loading Skeleton */}
          {imageState === "loading" && (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          )}

          {/* Actual Image */}
          <img
            src={coverUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageState === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </>
      )}

      {/* Gradient Fallback */}
      {showFallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4`}
        >
          <motion.span
            className="text-5xl mb-3"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {genreEmoji}
          </motion.span>

          {showTitle && (
            <>
              <span className="text-white font-bold text-center text-sm line-clamp-3 drop-shadow-lg mb-1">
                {title}
              </span>
              {author && (
                <span className="text-white/80 text-xs text-center line-clamp-1"
                >
                  {author}
                </span>
              )}
            </>
          )}

          {!showTitle && (
            <BookOpen className="w-8 h-8 text-white/60" />
          )}
        </motion.div>
      )}
    </div>
  );
}

export default BookCover;
