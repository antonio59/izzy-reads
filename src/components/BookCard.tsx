import { useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, Heart, Sparkles, Calendar, Hash } from "lucide-react";
import type { Book } from "../types";

// Generate a beautiful gradient from book title
function getBookGradient(title: string): string {
  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-rose-500 via-pink-500 to-purple-500",
    "from-blue-500 via-indigo-500 to-violet-500",
    "from-teal-500 via-emerald-500 to-green-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-pink-500 via-rose-500 to-red-500",
    "from-indigo-500 via-purple-500 to-pink-500",
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

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  variant?: "default" | "compact" | "featured" | "minimal";
  showRating?: boolean;
  showGenre?: boolean;
  showPages?: boolean;
  className?: string;
}

export function BookCard({
  book,
  onClick,
  variant = "default",
  showRating = true,
  showGenre = true,
  showPages = false,
  className = "",
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const gradient = getBookGradient(book.title);
  const genreEmoji = getGenreEmoji(book.genre);

  if (variant === "compact") {
    return (
      <motion.div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative cursor-pointer group ${className}`}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Book Cover */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
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
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-3`}
            >
              <span className="text-4xl mb-2">{genreEmoji}</span>
              <span className="text-white font-bold text-center text-sm line-clamp-3 drop-shadow-lg">
                {book.title}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Rating Badge */}
          {showRating && book.rating && book.rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">
                {book.rating}
              </span>
            </div>
          )}

          {/* Quick Info on Hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          >
            <p className="text-white font-bold text-sm line-clamp-2 drop-shadow-lg">
              {book.title}
            </p>
            <p className="text-white/80 text-xs mt-1">{book.author}</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative cursor-pointer ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
          {/* Decorative Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}
          />

          <div className="relative p-6 flex gap-6">
            {/* Cover */}
            <div className="relative w-32 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
              {book.coverUrl && !imageError ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-2`}
                >
                  <span className="text-3xl mb-1">{genreEmoji}</span>
                  <BookOpen className="w-8 h-8 text-white/80" />
                </div>
              )}

              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.6 }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-xl text-stone-900 line-clamp-2">
                    {book.title}
                  </h3>
                  {book.rating && book.rating > 0 && (
                    <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full flex-shrink-0">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-amber-700 font-bold text-sm">
                        {book.rating}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-stone-600 mt-1">{book.author}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {showGenre && book.genre && (
                    <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      <span>{genreEmoji}</span>
                      {book.genre}
                    </span>
                  )}
                  {showPages && book.pageCount && (
                    <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                      <Hash className="w-3 h-3" />
                      {book.pageCount} pages
                    </span>
                  )}
                  {book.dateRead && (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {new Date(book.dateRead).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Notes Preview */}
              {book.notes && (
                <p className="text-stone-500 text-sm italic line-clamp-2 mt-3">
                  "{book.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Hover Glow */}
          <motion.div
            className={`absolute inset-0 rounded-3xl ring-4 ring-offset-2 pointer-events-none ${gradient.includes("violet") ? "ring-violet-400/50" : gradient.includes("cyan") ? "ring-cyan-400/50" : gradient.includes("emerald") ? "ring-emerald-400/50" : gradient.includes("amber") ? "ring-amber-400/50" : "ring-purple-400/50"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />
        </div>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        onClick={onClick}
        className={`flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors ${className}`}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Small Cover */}
        <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
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
              <BookOpen className="w-5 h-5 text-white/80" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-900 truncate">{book.title}</p>
          <p className="text-sm text-stone-500 truncate">{book.author}</p>
        </div>

        {/* Rating */}
        {showRating && book.rating && book.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-stone-700">
              {book.rating}
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  // Default variant - Beautiful 3D-ish card
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer ${className}`}
      whileHover={{ y: -12 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative group">
        {/* Card Shadow */}
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Main Card */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
          {/* Cover Section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            {book.coverUrl && !imageError ? (
              <>
                {!imageLoaded && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                )}
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"} ${isHovered ? "scale-105" : "scale-100"}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </>
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6`}
              >
                <motion.span
                  className="text-6xl mb-4"
                  animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {genreEmoji}
                </motion.span>
                <span className="text-white font-display font-bold text-center text-lg line-clamp-3 drop-shadow-lg">
                  {book.title}
                </span>
                <span className="text-white/80 text-sm mt-2 text-center">
                  {book.author}
                </span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating Elements */}
            {isHovered && (
              <>
                <motion.div
                  className="absolute top-3 left-3"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Sparkles className="w-5 h-5 text-white drop-shadow-lg" />
                </motion.div>
                {book.isRead && (
                  <motion.div
                    className="absolute top-3 left-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Heart className="w-5 h-5 text-pink-400 fill-pink-400 drop-shadow-lg" />
                  </motion.div>
                )}
              </>
            )}

            {/* Rating Badge */}
            {showRating && book.rating && book.rating > 0 && (
              <motion.div
                className="absolute top-3 right-3"
                animate={{ scale: isHovered ? 1.1 : 1 }}
              >
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold text-sm">
                    {book.rating}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <motion.div
                animate={{ y: isHovered ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-display font-bold text-white text-lg line-clamp-2 drop-shadow-lg">
                  {book.title}
                </h3>
                <p className="text-white/90 text-sm mt-1">{book.author}</p>
              </motion.div>
            </div>
          </div>

          {/* Info Bar */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between gap-2">
              {/* Genre Tag */}
              {showGenre && book.genre && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                  <span>{genreEmoji}</span>
                  {book.genre}
                </span>
              )}

              {/* Page Count or Date */}
              {showPages && book.pageCount ? (
                <span className="text-xs text-stone-500 font-medium">
                  {book.pageCount} pages
                </span>
              ) : book.dateRead ? (
                <span className="text-xs text-stone-500">
                  {new Date(book.dateRead).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ) : null}
            </div>

            {/* Star Rating Display */}
            {showRating && book.rating && book.rating > 0 && (
              <div className="flex items-center gap-0.5 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < book.rating! ? "text-amber-400 fill-amber-400" : "text-stone-200"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3D Edge Effect */}
        <div className="absolute top-2 bottom-6 right-0 w-1 bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 rounded-r-full transform translate-x-full opacity-50" />
        <div className="absolute top-4 bottom-8 right-0 w-0.5 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400 rounded-r-full transform translate-x-[calc(100%+2px)] opacity-30" />
      </div>
    </motion.div>
  );
}

export default BookCard;
