import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BookOpen,
  Search,
  X,
  Heart,
  Share2,
  BookMarked,
  Sparkles,
  Filter,
} from "lucide-react";
import type { Book } from "../types";

interface BookshelfWithFiltersProps {
  books: Book[];
  title?: string;
}

const BookshelfWithFilters: React.FC<BookshelfWithFiltersProps> = ({
  books,
  title,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [likedBooks, setLikedBooks] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Get unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(genreSet).sort();
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  // Group books into shelves
  const booksPerShelf = 5;
  const shelves: Book[][] = [];
  for (let i = 0; i < filteredBooks.length; i += booksPerShelf) {
    shelves.push(filteredBooks.slice(i, i + booksPerShelf));
  }

  const handleLike = (bookId: string) => {
    setLikedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  const handleShare = async (book: Book) => {
    const shareData = {
      title: `${book.title} - Izzy's Review`,
      text: `Check out Izzy's review of "${book.title}" by ${book.author}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share was cancelled by user - no action needed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Filters */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          {/* Search */}
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 block">
              Genres
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  !selectedGenre
                    ? "bg-violet-100 text-violet-700"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  All Books
                  <span className="ml-auto text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                    {books.length}
                  </span>
                </span>
              </button>
              {genres.map((genre) => {
                const count = books.filter((b) => b.genre === genre).length;
                return (
                  <button
                    key={genre}
                    onClick={() =>
                      setSelectedGenre(genre === selectedGenre ? null : genre)
                    }
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedGenre === genre
                        ? "bg-violet-100 text-violet-700"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookMarked className="w-4 h-4" />
                      {genre}
                      <span className="ml-auto text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-100">
            <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">
              Collection Stats
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Total Books</span>
                <span className="font-bold text-stone-900">{books.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Total Pages</span>
                <span className="font-bold text-stone-900">
                  {books
                    .reduce((sum, b) => sum + (b.pageCount || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Avg Rating</span>
                <span className="font-bold text-stone-900">
                  {(
                    books.reduce((sum, b) => sum + (b.rating || 0), 0) /
                    books.length
                  ).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden fixed bottom-6 left-6 z-40 bg-violet-600 text-white p-4 rounded-full shadow-lg"
      >
        <Filter className="w-5 h-5" />
      </button>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 shadow-xl"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              {/* Genres */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedGenre(null);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${!selectedGenre ? "bg-violet-100 text-violet-700" : ""}`}
                >
                  All Books
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSelectedGenre(genre);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedGenre === genre ? "bg-violet-100 text-violet-700" : ""}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Bookshelf */}
      <div className="flex-1 min-w-0">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
            )}
            <p className="text-stone-500 text-sm mt-1">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
              {selectedGenre && ` in ${selectedGenre}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden relative">
            <button className="p-2 bg-stone-100 rounded-lg">
              <Search className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Bookshelves */}
        {filteredBooks.length > 0 ? (
          <div className="space-y-2">
            {shelves.map((shelf, shelfIndex) => (
              <div key={shelfIndex} className="relative">
                {/* Books */}
                <div className="flex items-end gap-4 px-2 pb-0 min-h-[200px]">
                  {shelf.map((book, bookIndex) => (
                    <motion.div
                      key={book.id}
                      className="relative cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: (shelfIndex * booksPerShelf + bookIndex) * 0.03,
                      }}
                      onClick={() => setSelectedBook(book)}
                    >
                      <motion.div
                        className="relative w-[85px] md:w-[100px] h-[130px] md:h-[155px] rounded-sm overflow-hidden shadow-md group-hover:shadow-xl transition-all"
                        whileHover={{ y: -10, scale: 1.03 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        {/* Cover */}
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex flex-col items-center justify-center p-2 text-white"
                            style={{
                              background: `linear-gradient(135deg, ${getBookColor(book.title, 0)} 0%, ${getBookColor(book.title, 1)} 100%)`,
                            }}
                          >
                            <span className="text-[10px] font-bold text-center leading-tight line-clamp-3">
                              {book.title}
                            </span>
                          </div>
                        )}

                        {/* Spine */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/20" />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                            View
                          </span>
                        </div>
                      </motion.div>

                      {/* Like indicator */}
                      {likedBooks.has(book.id) && (
                        <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}

                      {/* Rating badge */}
                      {book.rating && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {book.rating}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Shelf */}
                <div className="relative h-4">
                  <div
                    className="absolute inset-x-0 top-0 h-2.5 rounded-sm"
                    style={{
                      background:
                        "linear-gradient(180deg, #D4A574 0%, #C4956A 50%, #B8875A 100%)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                  <div
                    className="absolute inset-x-0 top-2.5 h-1.5 rounded-b-sm"
                    style={{
                      background:
                        "linear-gradient(180deg, #A67B5B 0%, #8B6914 100%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-600 mb-2">
              No books found
            </h3>
            <p className="text-stone-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header with Cover */}
              <div className="relative h-64 bg-gradient-to-br from-violet-500 to-fuchsia-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  {selectedBook.coverUrl ? (
                    <img
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      className="h-52 w-auto rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div
                      className="h-52 w-36 rounded-lg shadow-2xl flex items-center justify-center text-white p-4"
                      style={{
                        background: `linear-gradient(135deg, ${getBookColor(selectedBook.title, 0)} 0%, ${getBookColor(selectedBook.title, 1)} 100%)`,
                      }}
                    >
                      <span className="text-lg font-bold text-center">
                        {selectedBook.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Social Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <motion.button
                    onClick={() => handleLike(selectedBook.id)}
                    className={`p-3 rounded-full shadow-lg transition-colors ${
                      likedBooks.has(selectedBook.id)
                        ? "bg-rose-500 text-white"
                        : "bg-white text-rose-500 hover:bg-rose-50"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedBooks.has(selectedBook.id) ? "fill-current" : ""}`}
                    />
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare(selectedBook)}
                    className="p-3 bg-white text-violet-600 rounded-full shadow-lg hover:bg-violet-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Title & Author */}
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1">
                  {selectedBook.title}
                </h2>
                <p className="text-stone-500 text-lg mb-4">
                  by {selectedBook.author}
                </p>

                {/* Rating */}
                {selectedBook.rating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < selectedBook.rating!
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-amber-600">
                      {selectedBook.rating}/5
                    </span>
                  </div>
                )}

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBook.genre && (
                    <span className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.pageCount && (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {selectedBook.pageCount} pages
                    </span>
                  )}
                  {selectedBook.dateRead && (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Read{" "}
                      {new Date(selectedBook.dateRead).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Review */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💭</span>
                    <span>Izzy's Review</span>
                  </h3>
                  {selectedBook.notes || selectedBook.review ? (
                    <p className="text-stone-700 leading-relaxed text-lg">
                      {selectedBook.notes || selectedBook.review}
                    </p>
                  ) : (
                    <p className="text-stone-400 italic">
                      Review coming soon! Stay tuned...
                    </p>
                  )}
                </div>

                {/* Social Footer */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                      I
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">Izzy</p>
                      <p className="text-xs text-stone-500">Book Reviewer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(selectedBook.id)}
                      className="flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${likedBooks.has(selectedBook.id) ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                      <span className="text-sm font-medium">
                        {likedBooks.has(selectedBook.id) ? "Liked!" : "Like"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleShare(selectedBook)}
                      className="flex items-center gap-2 text-stone-500 hover:text-violet-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getBookColor(title: string, index: number): string {
  const colors = [
    ["#E74C3C", "#C0392B"],
    ["#3498DB", "#2980B9"],
    ["#2ECC71", "#27AE60"],
    ["#9B59B6", "#8E44AD"],
    ["#F39C12", "#D68910"],
    ["#1ABC9C", "#16A085"],
    ["#E91E63", "#C2185B"],
    ["#673AB7", "#512DA8"],
    ["#00BCD4", "#0097A7"],
    ["#FF5722", "#E64A19"],
  ];
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length][index];
}

export default BookshelfWithFilters;
