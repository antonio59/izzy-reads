import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Check, X, MessageCircle } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

interface BookSuggestion {
  _id: Id<"bookSuggestions">;
  title: string;
  author: string;
  genre?: string;
  suggestedBy: string;
  reason?: string;
  status: "pending" | "approved" | "declined";
}

interface BookSuggestionsListProps {
  suggestions: BookSuggestion[] | undefined;
  pendingCount: number | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: (id: Id<"bookSuggestions">) => void;
  onDecline: (id: Id<"bookSuggestions">) => void;
  onDelete: (id: Id<"bookSuggestions">) => void;
  variant?: "default" | "compact";
}

export function BookSuggestionsList({
  suggestions,
  pendingCount,
  isExpanded,
  onToggle,
  onApprove,
  onDecline,
  onDelete,
  variant = "default",
}: BookSuggestionsListProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl shadow-lg ${isCompact ? "p-4" : "p-6"} text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`${isCompact ? "text-lg" : "text-xl"} font-bold flex items-center`}
        >
          <Lightbulb className={`${isCompact ? "h-5 w-5" : "h-6 w-6"} mr-2`} />
          Reader Suggestions
          {(pendingCount ?? 0) > 0 && (
            <span className="ml-2 bg-white text-accent-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {pendingCount} new
            </span>
          )}
        </h3>
        <button
          onClick={onToggle}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {isExpanded ? "Hide" : "View All"}
        </button>
      </div>

      <p className="text-white/90 text-sm mb-4">
        Readers can suggest books they think you'd love! Review their
        suggestions here.
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion._id}
                  suggestion={suggestion}
                  onApprove={onApprove}
                  onDecline={onDecline}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-white/80">No suggestions yet!</p>
                <p className="text-sm text-white/60 mt-1">
                  Share your wishlist page so readers can suggest books for you.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: BookSuggestion;
  onApprove: (id: Id<"bookSuggestions">) => void;
  onDecline: (id: Id<"bookSuggestions">) => void;
  onDelete: (id: Id<"bookSuggestions">) => void;
}

function SuggestionCard({
  suggestion,
  onApprove,
  onDecline,
  onDelete,
}: SuggestionCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl p-4 text-stone-800 ${
        suggestion.status === "approved"
          ? "border-2 border-green-400"
          : suggestion.status === "declined"
            ? "border-2 border-stone-300 opacity-60"
            : ""
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-bold text-lg">{suggestion.title}</h4>
          <p className="text-stone-600 text-sm">by {suggestion.author}</p>

          <div className="flex items-center gap-2 mt-2">
            {suggestion.genre && (
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                {suggestion.genre}
              </span>
            )}
            <span className="text-xs text-stone-400">
              Suggested by {suggestion.suggestedBy}
            </span>
          </div>

          {suggestion.reason && (
            <div className="mt-3 flex items-start gap-2 bg-stone-50 rounded-lg p-3">
              <MessageCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-stone-600 italic">
                "{suggestion.reason}"
              </p>
            </div>
          )}
        </div>

        {/* Status badge */}
        {suggestion.status !== "pending" && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              suggestion.status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {suggestion.status === "approved" ? "✓ Added" : "Declined"}
          </span>
        )}
      </div>

      {/* Action buttons for pending suggestions */}
      {suggestion.status === "pending" && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100">
          <button
            onClick={() => onApprove(suggestion._id)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            <Check className="w-4 h-4" />
            Add to Wishlist
          </button>
          <button
            onClick={() => onDecline(suggestion._id)}
            className="flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      )}

      {/* Delete button for non-pending */}
      {suggestion.status !== "pending" && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <button
            onClick={() => onDelete(suggestion._id)}
            className="text-sm text-stone-400 hover:text-red-500 transition-colors"
          >
            Remove suggestion
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default BookSuggestionsList;
