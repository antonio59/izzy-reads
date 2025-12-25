import React, { useState } from "react";
import {
  Heart,
  Plus,
  BookOpen,
  Star,
  Trash2,
  ArrowRight,
  Lightbulb,
  Check,
  X,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { useToastActions } from "./ui/Toast";
import { BookSearchModal } from "./ui/BookSearchModal";
import type { Book } from "../types";
import type { Id } from "../../convex/_generated/dataModel";

const Wishlist: React.FC = () => {
  const { wishlist, addToWishlist, removeFromWishlist, moveToBookshelf } =
    useBooks();
  const { convexUserId } = useAuth();
  const toast = useToastActions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch suggestions
  const suggestions = useQuery(api.bookSuggestions.getAll);
  const pendingCount = useQuery(api.bookSuggestions.getPendingCount);
  const addSuggestionToWishlist = useMutation(
    api.bookSuggestions.addToWishlist,
  );
  const updateSuggestionStatus = useMutation(api.bookSuggestions.updateStatus);
  const removeSuggestion = useMutation(api.bookSuggestions.remove);

  const handleApproveSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    if (!convexUserId) return;
    try {
      await addSuggestionToWishlist({ suggestionId });
      toast.success("Added to wishlist!", "The suggested book has been added.");
    } catch (error) {
      console.error("Failed to approve suggestion:", error);
      toast.error("Failed to add suggestion", "Please try again.");
    }
  };

  const handleDeclineSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    try {
      await updateSuggestionStatus({ id: suggestionId, status: "declined" });
      toast.info("Suggestion declined");
    } catch (error) {
      console.error("Failed to decline suggestion:", error);
      toast.error("Failed to decline", "Please try again.");
    }
  };

  const handleDeleteSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    try {
      await removeSuggestion({ id: suggestionId });
      toast.success("Suggestion removed");
    } catch (error) {
      console.error("Failed to delete suggestion:", error);
      toast.error("Failed to remove", "Please try again.");
    }
  };

  const handleAddToWishlist = async (book: Omit<Book, "id">) => {
    try {
      await addToWishlist(book);
      toast.success("Added to wishlist!", `"${book.title}" is on your list.`);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Failed to add book", "Please try again.");
      throw error; // Re-throw so BookSearchModal knows it failed
    }
  };

  const handleMoveToBookshelf = async (bookId: string) => {
    const book = wishlist.find((b) => b.id === bookId);
    try {
      await moveToBookshelf(bookId);
      toast.success(
        "Moved to bookshelf!",
        book ? `"${book.title}" is now on your bookshelf.` : undefined,
      );
    } catch (error) {
      console.error("Failed to move to bookshelf:", error);
      toast.error("Failed to move book", "Please try again.");
    }
  };

  const PriorityHeart = ({ priority }: { priority: number }) => {
    const colors = [
      "text-gray-300",
      "text-accent-300",
      "text-accent-400",
      "text-accent-500",
      "text-accent-600",
      "text-red-500",
    ];

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <Heart
            key={level}
            className={`h-4 w-4 ${level <= priority ? colors[level] + " fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent-600 flex items-center">
            <Heart className="h-8 w-8 mr-3 fill-current" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">Books you can't wait to read!</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Wishlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-accent-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books to Read</p>
              <p className="text-2xl font-bold text-accent-600">
                {wishlist.length}
              </p>
            </div>
            <Heart className="h-8 w-8 text-accent-500 fill-current" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-primary-600">
                {wishlist.reduce((sum, book) => sum + (book.pageCount || 0), 0)}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-sage-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Genres</p>
              <p className="text-2xl font-bold text-sage-600">
                {new Set(wishlist.map((book) => book.genre)).size}
              </p>
            </div>
            <Star className="h-8 w-8 text-sage-500" />
          </div>
        </div>
      </div>

      {/* Wishlist Books */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Book Cover */}
              <div className="h-40 bg-gradient-to-br from-accent-400 via-primary-400 to-sage-400 flex items-center justify-center relative">
                <BookOpen className="h-12 w-12 text-white" />
                <button
                  onClick={() => removeFromWishlist(book.id)}
                  className="absolute top-2 right-2 p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  aria-label={`Remove ${book.title} from wishlist`}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{book.author}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-accent-100 text-accent-800 px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                  {book.pageCount && (
                    <span className="text-xs text-gray-500">
                      {book.pageCount} pages
                    </span>
                  )}
                </div>

                {book.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {book.description}
                  </p>
                )}

                {/* Priority Level */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">
                    How much do you want to read this?
                  </p>
                  <PriorityHeart priority={3} />
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleMoveToBookshelf(book.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <span>I Read This!</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-accent-300 mx-auto mb-4 fill-current" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Your wishlist is empty!
          </h3>
          <p className="text-gray-500 mb-4">
            Add some books you'd love to read!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors duration-200"
          >
            Add Your First Book
          </button>
        </div>
      )}

      {/* Add Book Modal - Search Based */}
      <BookSearchModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddBook={handleAddToWishlist}
        mode="wishlist"
      />

      {/* Reader Suggestions Section */}
      <div className="bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Lightbulb className="h-6 w-6 mr-2" />
            Reader Suggestions
            {(pendingCount ?? 0) > 0 && (
              <span className="ml-2 bg-white text-accent-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
                {pendingCount} new
              </span>
            )}
          </h3>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showSuggestions ? "Hide" : "View All"}
          </button>
        </div>

        <p className="text-white/90 text-sm mb-4">
          Readers can suggest books they think you'd love! Review their
          suggestions here.
        </p>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {suggestions && suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion._id}
                    className={`bg-white rounded-xl p-4 text-gray-800 ${
                      suggestion.status === "approved"
                        ? "border-2 border-green-400"
                        : suggestion.status === "declined"
                          ? "border-2 border-gray-300 opacity-60"
                          : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    layout
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">
                          {suggestion.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          by {suggestion.author}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          {suggestion.genre && (
                            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                              {suggestion.genre}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Suggested by {suggestion.suggestedBy}
                          </span>
                        </div>

                        {suggestion.reason && (
                          <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                            <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 italic">
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
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {suggestion.status === "approved"
                            ? "✓ Added"
                            : "Declined"}
                        </span>
                      )}
                    </div>

                    {/* Action buttons for pending suggestions */}
                    {suggestion.status === "pending" && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() =>
                            handleApproveSuggestion(suggestion._id)
                          }
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Add to Wishlist
                        </button>
                        <button
                          onClick={() =>
                            handleDeclineSuggestion(suggestion._id)
                          }
                          className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Delete button for non-pending */}
                    {suggestion.status !== "pending" && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleDeleteSuggestion(suggestion._id)}
                          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Remove suggestion
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="bg-white/10 rounded-xl p-6 text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-white/80">No suggestions yet!</p>
                  <p className="text-sm text-white/60 mt-1">
                    Share your wishlist page so readers can suggest books for
                    you.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
