import { useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, Heart } from "lucide-react";
import type { Book } from "../types";

// Generate a beautiful gradient from book title
function getBookGradient(title: string): string {
  const gradients = [
    "from-violet-400 to-purple-600",
    "from-blue-400 to-indigo-600",
    "from-emerald-400 to-teal-600",
    "from-orange-400 to-red-500",
    "from-pink-400 to-rose-600",
    "from-cyan-400 to-blue-600",
    "from-amber-400 to-orange-600",
    "from-fuchsia-400 to-pink-600",
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

interface BookGridItemProps {
  book: Book;
  onClick?: () => void;
  index?: number;
  size?: "sm" | "md" | "lg";
}

export function BookGridItem({
  book,
  onClick,
  index = 0,
  size = "md",
}: BookGridItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const gradient = getBookGradient(book.title);

  const sizeClasses = {
    sm: "w-24",
    md: "w-32",
    lg: "w-40",
  };

  const heightClasses = {
    sm: "h-36",
    md: "h-48",
    lg: "h-60",
  };

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Book Cover */}
      <motion.div
        className={`relative ${sizeClasses[size]} ${heightClasses[size]} rounded-lg overflow-hidden`}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          boxShadow: isHovered
            ? "0 20px 40px rgba(0,0,0,0.3), 0 0 0 2px rgba(139, 92, 246, 0.3)"
            : "0 4px 12px rgba(0,0,0,0.15), 4px 4px 0 rgba(0,0,0,0.1)",
        }}
      >
        {/* Cover Image or Gradient Fallback */}
        {book.coverUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse`}
              />
            )}
            <img
              src={book.coverUrl}
              alt={book.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-3`}
          >
            <BookOpen className="w-8 h-8 text-white/80 mb-2" />
            <span className="text-white font-bold text-xs text-center line-clamp-3 drop-shadow">
              {book.title}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        {book.rating && book.rating > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-bold">{book.rating}</span>
          </div>
        )}

        {/* Favorite Heart */}
        {book.isRead && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500 drop-shadow-lg" />
          </motion.div>
        )}

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{
            x: isHovered ? "100%" : "-100%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Book Edge (3D effect) */}
        <div className="absolute top-1 bottom-1 right-0 w-1 bg-gradient-to-r from-black/20 to-black/5 rounded-r" />
      </motion.div>

      {/* Book Info Below */}
      <motion.div
        className="mt-3 text-center max-w-full px-1"
        animate={{ y: isHovered ? -2 : 0 }}
      >
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
          {book.title}
        </h4>
        <p className="text-gray-500 text-xs mt-1 truncate">{book.author}</p>
      </motion.div>
    </motion.div>
  );
}

interface BookGridProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
  size?: "sm" | "md" | "lg";
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function BookGrid({
  books,
  onBookClick,
  size = "md",
  columns = 4,
  className = "",
}: BookGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  };

  return (
    <div
      className={`grid ${gridCols[columns]} gap-6 justify-items-center ${className}`}
    >
      {books.map((book, index) => (
        <BookGridItem
          key={book.id}
          book={book}
          onClick={() => onBookClick?.(book)}
          index={index}
          size={size}
        />
      ))}
    </div>
  );
}

// Featured book display - larger, horizontal layout
interface FeaturedBookProps {
  book: Book;
  onClick?: () => void;
}

export function FeaturedBook({ book, onClick }: FeaturedBookProps) {
  const [imageError, setImageError] = useState(false);
  const gradient = getBookGradient(book.title);

  return (
    <motion.div
      className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden">
        {book.coverUrl && !imageError ? (
          <img
            src={book.coverUrl}
            alt=""
            className="w-full h-full object-cover scale-150 blur-3xl opacity-30"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} opacity-20`}
          />
        )}
      </div>

      <div className="relative flex gap-6 p-6">
        {/* Cover */}
        <div className="relative w-32 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl">
          {book.coverUrl && !imageError ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <BookOpen className="w-10 h-10 text-white/80" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-display font-bold text-2xl text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-600 mt-1">{book.author}</p>

          {/* Rating */}
          {book.rating && book.rating > 0 && (
            <div className="flex items-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < book.rating!
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600 font-medium">
                {book.rating}/5
              </span>
            </div>
          )}

          {/* Genre & Pages */}
          <div className="flex flex-wrap gap-2 mt-3">
            {book.genre && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {book.genre}
              </span>
            )}
            {book.pageCount && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {book.pageCount} pages
              </span>
            )}
          </div>

          {/* Notes Preview */}
          {book.notes && (
            <p className="text-gray-500 text-sm italic mt-3 line-clamp-2">
              "{book.notes}"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default BookGrid;
