import { motion } from "framer-motion";
import {
  useBookReactions,
  useReviewReactions,
  usePoemReactions,
  useWritingReactions,
  type BookReactionType,
  type ReviewReactionType,
  type PoemReactionType,
  type WritingReactionType,
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
    color: "bg-primary-100 hover:bg-primary-200 text-primary-600",
    activeColor: "bg-primary-500 text-white ring-2 ring-primary-300",
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

// Poem reaction config
const POEM_REACTIONS: {
  key: PoemReactionType;
  emoji: string;
  label: string;
  color: string;
  activeColor: string;
}[] = [
  {
    key: "love",
    emoji: "❤️",
    label: "Love",
    color: "bg-rose-100 hover:bg-rose-200 text-rose-600",
    activeColor: "bg-rose-500 text-white ring-2 ring-rose-300",
  },
  {
    key: "beautiful",
    emoji: "🌸",
    label: "Beautiful",
    color: "bg-pink-100 hover:bg-pink-200 text-pink-600",
    activeColor: "bg-pink-500 text-white ring-2 ring-pink-300",
  },
  {
    key: "inspiring",
    emoji: "✨",
    label: "Inspiring",
    color: "bg-amber-100 hover:bg-amber-200 text-amber-600",
    activeColor: "bg-amber-500 text-white ring-2 ring-amber-300",
  },
  {
    key: "funny",
    emoji: "😂",
    label: "Funny",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-600",
    activeColor: "bg-yellow-500 text-white ring-2 ring-yellow-300",
  },
  {
    key: "relatable",
    emoji: "🤝",
    label: "Relatable",
    color: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    activeColor: "bg-blue-500 text-white ring-2 ring-blue-300",
  },
];

// Writing reaction config
const WRITING_REACTIONS: {
  key: WritingReactionType;
  emoji: string;
  label: string;
  color: string;
  activeColor: string;
}[] = [
  {
    key: "love",
    emoji: "❤️",
    label: "Love",
    color: "bg-rose-100 hover:bg-rose-200 text-rose-600",
    activeColor: "bg-rose-500 text-white ring-2 ring-rose-300",
  },
  {
    key: "greatRead",
    emoji: "📖",
    label: "Great read",
    color: "bg-accent-100 hover:bg-accent-200 text-accent-600",
    activeColor: "bg-accent-500 text-white ring-2 ring-accent-300",
  },
  {
    key: "inspiring",
    emoji: "✨",
    label: "Inspiring",
    color: "bg-amber-100 hover:bg-amber-200 text-amber-600",
    activeColor: "bg-amber-500 text-white ring-2 ring-amber-300",
  },
  {
    key: "funny",
    emoji: "😂",
    label: "Funny",
    color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-600",
    activeColor: "bg-yellow-500 text-white ring-2 ring-yellow-300",
  },
  {
    key: "agree",
    emoji: "💯",
    label: "Agree",
    color: "bg-green-100 hover:bg-green-200 text-green-600",
    activeColor: "bg-green-500 text-white ring-2 ring-green-300",
  },
];

interface PoemReactionButtonsProps {
  poemId: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function PoemReactionButtons({
  poemId,
  showLabel = true,
  size = "md",
}: PoemReactionButtonsProps) {
  const { counts, visitorReaction, addReaction, isLoading } =
    usePoemReactions(poemId);

  const handleReaction = async (key: PoemReactionType) => {
    await addReaction(key);
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {POEM_REACTIONS.map((r) => (
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
      {POEM_REACTIONS.map((r) => {
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

interface WritingReactionButtonsProps {
  postId: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function WritingReactionButtons({
  postId,
  showLabel = true,
  size = "md",
}: WritingReactionButtonsProps) {
  const { counts, visitorReaction, addReaction, isLoading } =
    useWritingReactions(postId);

  const handleReaction = async (key: WritingReactionType) => {
    await addReaction(key);
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {WRITING_REACTIONS.map((r) => (
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
      {WRITING_REACTIONS.map((r) => {
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


