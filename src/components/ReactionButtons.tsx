import { motion } from "framer-motion";
import {
  useBookReactions,
  useReviewReactions,
  type BookReactionType,
  type ReviewReactionType,
} from "../hooks/useReactions";

// Book reaction config
const BOOK_REACTIONS: {
  key: BookReactionType;
  emoji: string;
  label: string;
  color: string;
  activeColor: string;
}[] = [
  {
    key: "love",
    emoji: "❤️",
    label: "Love it!",
    color: "bg-primary-100 hover:bg-primary-200 text-primary-600",
    activeColor: "bg-primary-500 text-white ring-2 ring-primary-300",
  },
  {
    key: "amazing",
    emoji: "🤩",
    label: "Amazing!",
    color: "bg-amber-100 hover:bg-amber-200 text-amber-600",
    activeColor: "bg-amber-500 text-white ring-2 ring-amber-300",
  },
  {
    key: "mustRead",
    emoji: "📚",
    label: "Must read!",
    color: "bg-accent-100 hover:bg-accent-200 text-accent-600",
    activeColor: "bg-accent-500 text-white ring-2 ring-accent-300",
  },
  {
    key: "soGood",
    emoji: "🔥",
    label: "So good!",
    color: "bg-orange-100 hover:bg-orange-200 text-orange-600",
    activeColor: "bg-orange-500 text-white ring-2 ring-orange-300",
  },
  {
    key: "notForMe",
    emoji: "😕",
    label: "Not for me",
    color: "bg-stone-100 hover:bg-stone-200 text-stone-600",
    activeColor: "bg-stone-500 text-white ring-2 ring-stone-300",
  },
];

// Review reaction config
const REVIEW_REACTIONS: {
  key: ReviewReactionType;
  emoji: string;
  label: string;
  color: string;
  activeColor: string;
}[] = [
  {
    key: "helpful",
    emoji: "👍",
    label: "Helpful",
    color: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    activeColor: "bg-blue-500 text-white ring-2 ring-blue-300",
  },
  {
    key: "greatReview",
    emoji: "⭐",
    label: "Great review!",
    color: "bg-amber-100 hover:bg-amber-200 text-amber-600",
    activeColor: "bg-amber-500 text-white ring-2 ring-amber-300",
  },
  {
    key: "agree",
    emoji: "🤝",
    label: "I agree",
    color: "bg-green-100 hover:bg-green-200 text-green-600",
    activeColor: "bg-green-500 text-white ring-2 ring-green-300",
  },
  {
    key: "funny",
    emoji: "😂",
    label: "Funny",
    color: "bg-pink-100 hover:bg-pink-200 text-pink-600",
    activeColor: "bg-pink-500 text-white ring-2 ring-pink-300",
  },
  {
    key: "insightful",
    emoji: "💡",
    label: "Insightful",
    color: "bg-purple-100 hover:bg-purple-200 text-purple-600",
    activeColor: "bg-purple-500 text-white ring-2 ring-purple-300",
  },
];

interface BookReactionButtonsProps {
  bookId: string;
  showLabel?: boolean;
  size?: "sm" | "md";
  maxVisible?: number;
  onReaction?: () => void;
}

export function BookReactionButtons({
  bookId,
  showLabel = true,
  size = "md",
  maxVisible = 5,
  onReaction,
}: BookReactionButtonsProps) {
  const { counts, visitorReaction, addReaction, isLoading } =
    useBookReactions(bookId);

  const handleReaction = async (key: BookReactionType) => {
    await addReaction(key);
    onReaction?.();
  };

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {BOOK_REACTIONS.slice(0, maxVisible).map((r) => (
          <div
            key={r.key}
            className="px-3 py-1.5 rounded-full bg-stone-100 animate-pulse h-8 w-16"
          />
        ))}
      </div>
    );
  }

  const sizeClasses = size === "sm" ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm";

  return (
    <div className="flex flex-wrap gap-2">
      {BOOK_REACTIONS.slice(0, maxVisible).map((r) => {
        const count = counts[r.key] || 0;
        const isActive = visitorReaction === r.key;

        return (
          <motion.button
            key={r.key}
            onClick={() => handleReaction(r.key)}
            className={`${sizeClasses} rounded-full font-medium transition-all ${
              isActive ? r.activeColor : r.color
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isActive ? `Remove ${r.label}` : r.label}
          >
            {r.emoji}
            {showLabel && <span className="ml-1">{r.label}</span>}
            {count > 0 && (
              <span
                className={`ml-1.5 ${isActive ? "bg-white/30" : "bg-white/50"} px-1.5 py-0.5 rounded-full text-xs`}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

interface ReviewReactionButtonsProps {
  bookId: string;
  showLabel?: boolean;
  size?: "sm" | "md";
  maxVisible?: number;
  showMoreButton?: boolean;
}

export function ReviewReactionButtons({
  bookId,
  showLabel = true,
  size = "md",
  maxVisible = 3,
  showMoreButton = true,
}: ReviewReactionButtonsProps) {
  const { counts, visitorReaction, totalReactions, addReaction, isLoading } =
    useReviewReactions(bookId);

  const handleReaction = async (key: ReviewReactionType) => {
    await addReaction(key);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {REVIEW_REACTIONS.slice(0, maxVisible).map((r) => (
          <div
            key={r.key}
            className="px-3 py-1.5 rounded-full bg-stone-100 animate-pulse h-8 w-16"
          />
        ))}
      </div>
    );
  }

  const sizeClasses = size === "sm" ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm";
  const visibleReactions = REVIEW_REACTIONS.slice(0, maxVisible);
  const hiddenCount = REVIEW_REACTIONS.length - maxVisible;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {visibleReactions.map((r) => {
          const count = counts[r.key] || 0;
          const isActive = visitorReaction === r.key;

          return (
            <motion.button
              key={r.key}
              onClick={() => handleReaction(r.key)}
              className={`${sizeClasses} rounded-full font-medium transition-all ${
                isActive ? r.activeColor : r.color
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isActive ? `Remove ${r.label}` : r.label}
            >
              {r.emoji}
              {showLabel && <span className="ml-1">{r.label}</span>}
              {count > 0 && (
                <span
                  className={`ml-1.5 ${isActive ? "bg-white/30" : "bg-white/50"} px-1.5 py-0.5 rounded-full text-xs`}
                >
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
        {showMoreButton && hiddenCount > 0 && (
          <span className="text-xs text-stone-400 self-center">
            +{hiddenCount} more
          </span>
        )}
      </div>
      {totalReactions > 0 && (
        <p className="text-xs text-stone-400">
          {totalReactions} reaction{totalReactions !== 1 ? "s" : ""} to this
          review
        </p>
      )}
    </div>
  );
}

// Compact version for displaying reaction counts only (no buttons)
interface ReactionCountBadgeProps {
  bookId: string;
}

export function BookReactionCountBadge({ bookId }: ReactionCountBadgeProps) {
  const { totalReactions, isLoading } = useBookReactions(bookId);

  if (isLoading || totalReactions === 0) return null;

  return (
    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
      <span className="text-xs">❤️</span>
      <span className="text-xs font-bold text-primary-600">
        {totalReactions}
      </span>
    </div>
  );
}
