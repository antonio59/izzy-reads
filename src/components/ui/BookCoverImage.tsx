import { useState, useCallback } from "react";
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

  return false;
}

/**
 * Check if a loaded image is a "blank" placeholder by sampling pixel brightness.
 * This runs asynchronously on a separate image with crossOrigin to avoid
 * tainting issues. If CORS blocks the check, we conservatively return false
 * (assume valid) so we never falsely reject covers.
 */
function checkIsBlankPlaceholder(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const testImg = new Image();
    testImg.crossOrigin = "anonymous";

    testImg.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(false);
          return;
        }

        // Sample a 20x20 grid from the center of the image
        const sampleW = 20;
        const sampleH = 20;
        const sx = Math.max(0, Math.floor((testImg.naturalWidth - sampleW) / 2));
        const sy = Math.max(0, Math.floor((testImg.naturalHeight - sampleH) / 2));
        const sw = Math.min(sampleW, testImg.naturalWidth);
        const sh = Math.min(sampleH, testImg.naturalHeight);

        canvas.width = sw;
        canvas.height = sh;
        ctx.drawImage(testImg, sx, sy, sw, sh, 0, 0, sw, sh);

        const imageData = ctx.getImageData(0, 0, sw, sh);
        const pixels = imageData.data;

        let lightPixelCount = 0;
        let totalSampled = 0;

        // Sample every 4th pixel for performance
        for (let i = 0; i < pixels.length; i += 16) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = (r + g + b) / 3;

          // Count pixels that are very light (>235/255 = ~92% white)
          if (brightness > 235) {
            lightPixelCount++;
          }
          totalSampled++;
        }

        // If >85% of sampled pixels are very light, it's likely a blank placeholder
        const isBlank = totalSampled > 0 && lightPixelCount / totalSampled > 0.85;
        resolve(isBlank);
      } catch {
        // Canvas tainted or other error - conservatively assume valid
        resolve(false);
      }
    };

    testImg.onerror = () => {
      // CORS or load error on test image - conservatively assume valid
      resolve(false);
    };

    // Add cache-buster to avoid cached CORS issues
    testImg.src = url + (url.includes("?") ? "&" : "?") + "_cb=1";
  });
}

export function BookCoverImage({
  book,
  className = "",
  fallbackEmoji = "📖",
}: BookCoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isBlankPlaceholder, setIsBlankPlaceholder] = useState(false);
  const [color1, color2] = getBookGradient(book.title);

  const showFallback = !book.coverUrl || hasError || isLikelyInvalidCover(book.coverUrl) || isBlankPlaceholder;

  const handleLoad = useCallback(
    async (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const { naturalWidth, naturalHeight } = img;

      // Defensive: if dimensions aren't available yet, assume it's valid
      if (!naturalWidth || !naturalHeight) {
        setHasLoaded(true);
        return;
      }

      // Only reject genuinely tiny images (1x1, broken icons)
      if (naturalWidth < 10 || naturalHeight < 10) {
        setHasError(true);
        return;
      }

      // Only reject extremely wide banners
      const aspectRatio = naturalWidth / naturalHeight;
      if (aspectRatio > 5) {
        setHasError(true);
        return;
      }

      setHasLoaded(true);

      // Secondary async check: detect blank placeholder images
      // (e.g., Google Books "image not available" white placeholder)
      // This runs in parallel and won't block rendering
      if (book.coverUrl) {
        try {
          const isBlank = await checkIsBlankPlaceholder(book.coverUrl);
          if (isBlank) {
            setIsBlankPlaceholder(true);
          }
        } catch {
          // Ignore errors - conservatively keep the image
        }
      }
    },
    [book.coverUrl],
  );

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
            onLoad={handleLoad}
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
