import React, { useState } from "react";
import { Heart, Plus, BookOpen, Star, Trash2, ArrowRight } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { useToastActions } from "./ui/Toast";
import { BookSearchModal } from "./ui/BookSearchModal";
import { BookSuggestionsList } from "./BookSuggestionsList";
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
      "text-stone-300",
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
            className={`h-4 w-4 ${level <= priority ? colors[level] + " fill-current" : "text-stone-300"}`}
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
          <p className="text-stone-600 mt-1">Books you can't wait to read!</p>
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
              <p className="text-sm font-medium text-stone-600">
                Books to Read
              </p>
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
              <p className="text-sm font-medium text-stone-600">Total Pages</p>
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
              <p className="text-sm font-medium text-stone-600">Genres</p>
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
                <h3 className="font-bold text-stone-800 text-lg mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-stone-600 text-sm mb-2">{book.author}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-accent-100 text-accent-800 px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                  {book.pageCount && (
                    <span className="text-xs text-stone-500">
                      {book.pageCount} pages
                    </span>
                  )}
                </div>

                {book.description && (
                  <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                    {book.description}
                  </p>
                )}

                {/* Priority Level */}
                <div className="mb-3">
                  <p className="text-xs text-stone-500 mb-1">
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
          <h3 className="text-xl font-semibold text-stone-600 mb-2">
            Your wishlist is empty!
          </h3>
          <p className="text-stone-500 mb-4">
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
      <BookSuggestionsList
        suggestions={suggestions}
        pendingCount={pendingCount}
        isExpanded={showSuggestions}
        onToggle={() => setShowSuggestions(!showSuggestions)}
        onApprove={handleApproveSuggestion}
        onDecline={handleDeclineSuggestion}
        onDelete={handleDeleteSuggestion}
      />
    </div>
  );
};

export default Wishlist;
