import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Library,
  Search as SearchIcon,
  Grid,
  Layers,
  LayoutGrid,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import BookSearch from "./BookSearch";
import FunBookshelf from "./FunBookshelf";
import BookshelfFilters from "./BookshelfFilters";
import { EmptyBooks, EmptySearch } from "./ui/EmptyState";
import { BookGrid } from "./BookGrid";
import { BookDetailModal } from "./BookDetailModal";
import type { Book } from "../types";

const EnhancedBookshelf: React.FC = () => {
  const { books, addBook } = useBooks();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<"shelf" | "grid" | "cards">("cards");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    "title" | "author" | "dateRead" | "rating" | "dateAdded"
  >("dateRead");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const readBooks = books.filter((book) => book.isRead);

  // Get available genres from books
  const availableGenres = useMemo(() => {
    const genres = new Set(readBooks.map((b) => b.genre).filter(Boolean));
    return Array.from(genres).sort();
  }, [readBooks]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...readBooks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query),
      );
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((book) => selectedGenres.includes(book.genre));
    }

    // Rating filter
    if (selectedRating !== null) {
      result = result.filter((book) => (book.rating || 0) >= selectedRating);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
        case "dateRead":
          comparison =
            new Date(a.dateRead || 0).getTime() -
            new Date(b.dateRead || 0).getTime();
          break;
        case "dateAdded":
          comparison =
            new Date(a.dateAdded || 0).getTime() -
            new Date(b.dateAdded || 0).getTime();
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [
    readBooks,
    searchQuery,
    selectedGenres,
    selectedRating,
    sortBy,
    sortOrder,
  ]);

  const handleAddBook = (book: Book) => {
    addBook(book);
    setShowSearch(false);
  };

  const hasActiveFilters =
    searchQuery || selectedGenres.length > 0 || selectedRating !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-3 mb-2">
              <Library className="w-8 md:w-10 h-8 md:h-10" />
              My Magical Bookshelf
            </h1>
            <p className="text-white/90 text-lg">
              {readBooks.length === 0
                ? "Start your reading adventure!"
                : `You've read ${readBooks.length} amazing ${readBooks.length === 1 ? "book" : "books"}! 📚✨`}
            </p>
          </div>
          <motion.button
            onClick={() => setShowSearch(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SearchIcon className="w-5 h-5" />
            Find Books
          </motion.button>
        </div>

        {/* Decorative elements */}
        <motion.span
          className="absolute top-4 right-32 text-4xl opacity-20"
          animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          📚
        </motion.span>
        <motion.span
          className="absolute bottom-4 right-16 text-3xl opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨
        </motion.span>
      </motion.div>

      {/* Search and Filters */}
      {readBooks.length > 0 && (
        <BookshelfFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          availableGenres={availableGenres}
        />
      )}

      {/* View Toggle */}
      <div className="flex justify-center gap-1 p-1.5 bg-white rounded-2xl w-fit mx-auto shadow-lg border border-gray-100">
        <button
          onClick={() => setViewMode("cards")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
            viewMode === "cards"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Cards
        </button>
        <button
          onClick={() => setViewMode("shelf")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
            viewMode === "shelf"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          Shelf
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
            viewMode === "grid"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Grid className="w-4 h-4" />
          Covers
        </button>
      </div>

      {/* Results count */}
      {hasActiveFilters && filteredBooks.length !== readBooks.length && (
        <p className="text-center text-gray-500 text-sm">
          Showing {filteredBooks.length} of {readBooks.length} books
        </p>
      )}

      {/* Books Display */}
      {readBooks.length === 0 ? (
        <EmptyBooks onAction={() => setShowSearch(true)} />
      ) : filteredBooks.length === 0 && hasActiveFilters ? (
        <EmptySearch query={searchQuery || "your filters"} />
      ) : viewMode === "shelf" ? (
        <FunBookshelf books={filteredBooks} onSelectBook={setSelectedBook} />
      ) : viewMode === "cards" ? (
        <BookGrid
          books={filteredBooks}
          onBookClick={setSelectedBook}
          size="lg"
          columns={5}
        />
      ) : (
        <BookGrid
          books={filteredBooks}
          onBookClick={setSelectedBook}
          size="md"
          columns={6}
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
      <BookDetailModal
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        showActions={false}
      />
    </div>
  );
};

export default EnhancedBookshelf;
