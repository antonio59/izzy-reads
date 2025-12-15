import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "fun" | "minimal";
  className?: string;
}

// Fun animated illustrations for empty states
const FunIllustration = ({
  type,
}: {
  type: "books" | "poems" | "blog" | "wishlist" | "achievements" | "default";
}) => {
  const illustrations = {
    books: (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-7xl">📚</span>
        </motion.div>
        <motion.span
          className="absolute top-0 right-0 text-2xl"
          animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute bottom-2 left-2 text-xl"
          animate={{ rotate: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌟
        </motion.span>
      </div>
    ),
    poems: (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-7xl">✍️</span>
        </motion.div>
        <motion.span
          className="absolute top-0 left-1/4 text-2xl"
          animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          💭
        </motion.span>
        <motion.span
          className="absolute bottom-0 right-1/4 text-xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        >
          🌸
        </motion.span>
      </div>
    ),
    blog: (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-7xl">📝</span>
        </motion.div>
        <motion.span
          className="absolute top-2 right-2 text-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          💡
        </motion.span>
        <motion.span
          className="absolute bottom-4 left-4 text-lg"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🎨
        </motion.span>
      </div>
    ),
    wishlist: (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-7xl">💝</span>
        </motion.div>
        <motion.span
          className="absolute top-0 right-4 text-2xl"
          animate={{ y: [0, -8, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⭐
        </motion.span>
        <motion.span
          className="absolute bottom-2 left-6 text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          📖
        </motion.span>
      </div>
    ),
    achievements: (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-7xl">🏆</span>
        </motion.div>
        <motion.span
          className="absolute top-0 left-1/3 text-xl"
          animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute top-2 right-1/4 text-lg"
          animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        >
          ⭐
        </motion.span>
        <motion.span
          className="absolute bottom-4 right-6 text-lg"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        >
          🌟
        </motion.span>
      </div>
    ),
    default: (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-7xl">🎯</span>
        </motion.div>
      </div>
    ),
  };

  return illustrations[type] || illustrations.default;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className = "",
}: EmptyStateProps) {
  const baseStyles = "text-center py-12 px-6 rounded-3xl";

  const variantStyles = {
    default: "bg-gradient-to-br from-gray-50 to-gray-100",
    fun: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50",
    minimal: "bg-transparent",
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-6xl mb-4 inline-block"
        animate={variant === "fun" ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>

      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>

      {action && (
        <motion.button
          onClick={action.onClick}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

// Pre-configured empty states for common scenarios
export function EmptyBooks({ onAction }: { onAction?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <FunIllustration type="books" />
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        Your bookshelf is waiting!
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Start your reading adventure by adding your first book. Every great
        journey begins with a single page!
      </p>
      {onAction && (
        <motion.button
          onClick={onAction}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Find Your First Book
        </motion.button>
      )}
    </div>
  );
}

export function EmptyPoems({ onAction }: { onAction?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <FunIllustration type="poems" />
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        Your poetry corner awaits!
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Let your imagination run wild! Write your thoughts, feelings, or just
        something silly. There are no wrong poems!
      </p>
      {onAction && (
        <motion.button
          onClick={onAction}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Write Your First Poem
        </motion.button>
      )}
    </div>
  );
}

export function EmptyBlog({ onAction }: { onAction?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <FunIllustration type="blog" />
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        Share your stories!
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Tell the world about your favorite books, share reviews, or write about
        your reading adventures!
      </p>
      {onAction && (
        <motion.button
          onClick={onAction}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Write Your First Post
        </motion.button>
      )}
    </div>
  );
}

export function EmptyWishlist({ onAction }: { onAction?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <FunIllustration type="wishlist" />
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        Dream big, read bigger!
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Add books you're dreaming about to your wishlist. Maybe someone special
        will surprise you!
      </p>
      {onAction && (
        <motion.button
          onClick={onAction}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Wishlist
        </motion.button>
      )}
    </div>
  );
}

export function EmptyAchievements() {
  return (
    <div className="text-center py-12 px-6">
      <FunIllustration type="achievements" />
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        Your trophy case is empty... for now!
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Start reading, writing, and exploring to unlock amazing achievements.
        Every reader is a champion!
      </p>
    </div>
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <motion.div
      className="text-center py-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-7xl mb-4"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🔍
      </motion.div>
      <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
        No results for "{query}"
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Try different keywords or check your spelling. The perfect book is out
        there waiting!
      </p>
    </motion.div>
  );
}

export default EmptyState;
