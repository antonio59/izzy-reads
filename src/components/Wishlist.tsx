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
import type { Book } from "../types";
import type { Id } from "../../convex/_generated/dataModel";

const Wishlist: React.FC = () => {
  const { wishlist, addToWishlist, removeFromWishlist, moveToBookshelf } =
    useBooks();
  const { convexUserId } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    genre: "Fiction",
    ageRating: "8+",
    pageCount: 0,
    description: "",
  });

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
      await addSuggestionToWishlist({ suggestionId, userId: convexUserId });
    } catch (error) {
      console.error("Failed to approve suggestion:", error);
    }
  };

  const handleDeclineSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    try {
      await updateSuggestionStatus({ id: suggestionId, status: "declined" });
    } catch (error) {
      console.error("Failed to decline suggestion:", error);
    }
  };

  const handleDeleteSuggestion = async (
    suggestionId: Id<"bookSuggestions">,
  ) => {
    try {
      await removeSuggestion({ id: suggestionId });
    } catch (error) {
      console.error("Failed to delete suggestion:", error);
    }
  };

  const handleAddToWishlist = () => {
    if (newBook.title && newBook.author) {
      const book: Book = {
        id: Date.now().toString(),
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre || "Fiction",
        ageRating: newBook.ageRating || "8+",
        dateAdded: new Date().toISOString().split("T")[0],
        isRead: false,
        pageCount: newBook.pageCount || 0,
        description: newBook.description || "",
      };
      addToWishlist(book);
      setNewBook({
        title: "",
        author: "",
        genre: "Fiction",
        ageRating: "8+",
        pageCount: 0,
        description: "",
      });
      setShowAddForm(false);
    }
  };

  const handleMoveToBookshelf = (bookId: string) => {
    moveToBookshelf(bookId);
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
          onClick={() => setShowAddForm(true)}
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
            onClick={() => setShowAddForm(true)}
            className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors duration-200"
          >
            Add Your First Book
          </button>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Add to Wishlist
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={newBook.genre}
                  onChange={(e) =>
                    setNewBook({ ...newBook, genre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pages (if you know)
                </label>
                <input
                  type="number"
                  value={newBook.pageCount}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      pageCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Number of pages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to read this?
                </label>
                <textarea
                  value={newBook.description}
                  onChange={(e) =>
                    setNewBook({ ...newBook, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  rows={3}
                  placeholder="What makes this book interesting to you?"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddToWishlist}
                className="flex-1 bg-accent-600 text-white py-2 rounded-lg hover:bg-accent-700 transition-colors duration-200"
              >
                Add to Wishlist
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
