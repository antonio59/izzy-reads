import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Plus,
  Search,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import BookSearch from "./BookSearch";
import { BookDetailModal } from "./BookDetailModal";
import type { Book } from "../types";

type TabType = "read" | "want-to-read";

const MyBooks: React.FC = () => {
  const {
    books,
    wishlist,
    addBook,
    addToWishlist,
    removeFromWishlist,
    moveToBookshelf,
    moveToWishlist,
    deleteBook,
  } = useBooks();
  const [activeTab, setActiveTab] = useState<TabType>("read");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const readBooks = books.filter((book) => book.isRead);

  // Filter books based on search
  const filteredReadBooks = readBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredWishlist = wishlist.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddBook = async (book: Book) => {
    if (activeTab === "read") {
      await addBook(book);
    } else {
      await addToWishlist(book);
    }
    setShowSearch(false);
  };

  const handleMoveToRead = async (bookId: string) => {
    await moveToBookshelf(bookId);
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    await removeFromWishlist(bookId);
  };

  const handleMoveToWishlist = async (bookId: string) => {
    await moveToWishlist(bookId);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm("Are you sure you want to remove this book?")) {
      await deleteBook(bookId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              My Books
            </h1>
            <p className="text-white/90 mt-1">
              {readBooks.length} books read · {wishlist.length} on your list
            </p>
          </div>
          <motion.button
            onClick={() => setShowSearch(true)}
            className="bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Add Book
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("read")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "read"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Read ({readBooks.length})
        </button>
        <button
          onClick={() => setActiveTab("want-to-read")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "want-to-read"
              ? "bg-white text-pink-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Heart className="w-4 h-4" />
          Want to Read ({wishlist.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search your books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Book Grid */}
      {activeTab === "read" ? (
        filteredReadBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredReadBooks.map((book) => (
              <ReadBookCard
                key={book.id}
                book={book}
                onMoveToWishlist={() => handleMoveToWishlist(book.id)}
                onRemove={() => handleDeleteBook(book.id)}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No books yet"
            description="Start adding books you've read!"
            actionLabel="Add Your First Book"
            onAction={() => setShowSearch(true)}
          />
        )
      ) : filteredWishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredWishlist.map((book) => (
            <WishlistCard
              key={book.id}
              book={book}
              onMarkRead={() => handleMoveToRead(book.id)}
              onRemove={() => handleRemoveFromWishlist(book.id)}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your reading list is empty"
          description="Add books you want to read next!"
          actionLabel="Find Books"
          onAction={() => setShowSearch(true)}
        />
      )}

      {/* Book Search Modal */}
      {showSearch && (
        <BookSearch
          onAddBook={handleAddBook}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          showActions={false}
        />
      )}
    </div>
  );
};

// Read Book Card Component
interface ReadBookCardProps {
  book: Book;
  onMoveToWishlist: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const ReadBookCard: React.FC<ReadBookCardProps> = ({
  book,
  onMoveToWishlist,
  onRemove,
  onClick,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg"
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-indigo-100 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-purple-300" />
          </div>
        )}
        {/* Rating badge */}
        {book.rating && book.rating > 0 && (
          <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span>{book.rating}</span>
            <span>★</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-1">{book.author}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveToWishlist();
            }}
            className="flex-1 text-xs bg-pink-100 text-pink-600 py-1.5 rounded-lg font-medium hover:bg-pink-200 transition-colors flex items-center justify-center gap-1"
            title="Move to Want to Read"
          >
            <ArrowRight className="w-3 h-3" />
            To List
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Wishlist Card Component
interface WishlistCardProps {
  book: Book;
  onMarkRead: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  book,
  onMarkRead,
  onRemove,
  onClick,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg"
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-gradient-to-br from-pink-100 to-purple-100 relative">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-pink-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-1">{book.author}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead();
            }}
            className="flex-1 text-xs bg-green-500 text-white py-1.5 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            I Read It!
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="px-2 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-700 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default MyBooks;
