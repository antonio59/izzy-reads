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
  Search,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import {
  searchBooks,
  suggestGenre,
  determineAgeRating,
  type UnifiedBook,
} from "../services/bookApi";
import type { Book } from "../types";
import type { Id } from "../../convex/_generated/dataModel";

const Wishlist: React.FC = () => {
  const { wishlist, addToWishlist, removeFromWishlist, moveToBookshelf } =
    useBooks();
  const { convexUserId } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<UnifiedBook | null>(null);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchBooks(searchQuery, 12);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddToWishlist = () => {
    if (!selectedBook) return;

    const book: Book = {
      id: crypto.randomUUID(),
      title: selectedBook.title,
      author: selectedBook.author,
      coverUrl: selectedBook.coverUrl,
      isbn: selectedBook.isbn,
      genre: suggestGenre(selectedBook),
      pageCount: selectedBook.pageCount,
      description: selectedBook.description,
      ageRating: determineAgeRating(selectedBook),
      dateAdded: new Date().toISOString().split("T")[0],
      isRead: false,
    };

    addToWishlist(book);
    setSelectedBook(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowAddForm(false);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedBook(null);
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

      {/* Add Book Modal - Search Based */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header with Search */}
            <div className="bg-gradient-to-r from-accent-500 to-primary-500 p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="w-8 h-8" />
                  Add to Wishlist
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-300"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-white text-accent-600 px-6 py-3 rounded-lg font-semibold hover:bg-accent-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div
              className="p-6 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              {selectedBook ? (
                // Book Details View
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="text-accent-600 hover:text-accent-700 font-medium"
                  >
                    ← Back to results
                  </button>

                  <div className="flex gap-6">
                    {selectedBook.coverUrl ? (
                      <img
                        src={selectedBook.coverUrl}
                        alt={selectedBook.title}
                        className="w-48 h-72 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-48 h-72 bg-gradient-to-br from-accent-400 to-primary-400 rounded-lg shadow-lg flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white" />
                      </div>
                    )}

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                          {selectedBook.title}
                        </h3>
                        <p className="text-xl text-gray-600">
                          by {selectedBook.author}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {selectedBook.publishYear && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            📅 {selectedBook.publishYear}
                          </span>
                        )}
                        {selectedBook.pageCount && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            📄 {selectedBook.pageCount} pages
                          </span>
                        )}
                        {selectedBook.publisher && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            🏢 {selectedBook.publisher}
                          </span>
                        )}
                      </div>

                      {selectedBook.description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Description:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {selectedBook.description.slice(0, 300)}
                            {selectedBook.description.length > 300 && "..."}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleAddToWishlist}
                        className="w-full bg-gradient-to-r from-accent-500 to-primary-500 text-white py-3 rounded-lg font-bold hover:from-accent-600 hover:to-primary-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Heart className="w-5 h-5" />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                // Search Results Grid
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="cursor-pointer group"
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all transform group-hover:scale-105">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-64 bg-gradient-to-br from-accent-400 to-primary-400 flex items-center justify-center ${book.coverUrl ? "hidden" : ""}`}
                        >
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div className="text-white text-sm">
                            <p className="font-bold truncate">{book.title}</p>
                            <p className="text-xs truncate">{book.author}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {isSearching
                      ? "Searching..."
                      : "Search for books to add to your wishlist!"}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try searching for your favorite book or author
                  </p>
                </div>
              )}
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
