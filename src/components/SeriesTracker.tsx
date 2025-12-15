import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  Plus,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Check,
  Search,
  X,
  Trash2,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Progress } from "./ui/Progress";
import { FadeIn, StaggerContainer, StaggerItem } from "./PageTransition";
import type { Book, BookSeries } from "../types";

// Popular book series for suggestions
const POPULAR_SERIES = [
  { name: "Harry Potter", author: "J.K. Rowling", totalBooks: 7, emoji: "🧙‍♂️" },
  { name: "Percy Jackson", author: "Rick Riordan", totalBooks: 5, emoji: "⚡" },
  {
    name: "Diary of a Wimpy Kid",
    author: "Jeff Kinney",
    totalBooks: 18,
    emoji: "📓",
  },
  {
    name: "The Hunger Games",
    author: "Suzanne Collins",
    totalBooks: 4,
    emoji: "🏹",
  },
  {
    name: "Wings of Fire",
    author: "Tui T. Sutherland",
    totalBooks: 15,
    emoji: "🐉",
  },
  { name: "Dog Man", author: "Dav Pilkey", totalBooks: 12, emoji: "🐕" },
  {
    name: "The Land of Stories",
    author: "Chris Colfer",
    totalBooks: 6,
    emoji: "🏰",
  },
  {
    name: "Keeper of the Lost Cities",
    author: "Shannon Messenger",
    totalBooks: 9,
    emoji: "✨",
  },
];

interface SeriesWithBooks extends BookSeries {
  booksRead: Book[];
  progress: number;
}

const SeriesTracker: React.FC = () => {
  const { books } = useBooks();

  const [series, setSeries] = useState<BookSeries[]>([
    {
      id: "1",
      name: "Harry Potter",
      books: [
        { bookId: "1", orderInSeries: 1, isRead: true },
        { bookId: "2", orderInSeries: 2, isRead: false },
      ],
      completed: false,
    },
  ]);

  const [showAddSeries, setShowAddSeries] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSeries, setExpandedSeries] = useState<string[]>(["1"]);

  // Get series with book details
  const seriesWithBooks: SeriesWithBooks[] = useMemo(() => {
    return series.map((s) => {
      const booksRead = s.books
        .filter((sb) => sb.isRead)
        .map((sb) => books.find((b) => b.id === sb.bookId))
        .filter((b): b is Book => b !== undefined);

      const progress =
        s.books.length > 0
          ? Math.round(
              (s.books.filter((b) => b.isRead).length / s.books.length) * 100,
            )
          : 0;

      return {
        ...s,
        booksRead,
        progress,
      };
    });
  }, [series, books]);

  const handleAddSeries = (name: string) => {
    if (!name.trim()) return;

    const newSeries: BookSeries = {
      id: Date.now().toString(),
      name: name.trim(),
      books: [],
      completed: false,
    };

    setSeries((prev) => [...prev, newSeries]);
    setExpandedSeries((prev) => [...prev, newSeries.id]);
    setShowAddSeries(false);
    setNewSeriesName("");
  };

  const handleDeleteSeries = (id: string) => {
    setSeries((prev) => prev.filter((s) => s.id !== id));
    setExpandedSeries((prev) => prev.filter((sid) => sid !== id));
  };

  const toggleExpanded = (id: string) => {
    setExpandedSeries((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const filteredPopularSeries = POPULAR_SERIES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <FadeIn>
        <Card
          variant="gradient"
          padding="lg"
          className="relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Library className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900">
                    Series Tracker
                  </h1>
                  <p className="text-gray-600">
                    Track your progress through book series
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setShowAddSeries(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Add Series
            </motion.button>
          </div>

          {/* Decorations */}
          <motion.span
            className="absolute top-4 right-20 text-4xl opacity-20"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📚
          </motion.span>
        </Card>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-4">
          <Card padding="md" className="text-center">
            <p className="text-3xl font-display font-bold text-indigo-600">
              {series.length}
            </p>
            <p className="text-sm text-gray-500">Series Tracked</p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-3xl font-display font-bold text-purple-600">
              {series.filter((s) => s.completed).length}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-3xl font-display font-bold text-pink-600">
              {series.reduce(
                (sum, s) => sum + s.books.filter((b) => b.isRead).length,
                0,
              )}
            </p>
            <p className="text-sm text-gray-500">Books Read</p>
          </Card>
        </div>
      </FadeIn>

      {/* Series List */}
      <FadeIn delay={0.2}>
        <StaggerContainer className="space-y-4">
          {seriesWithBooks.length > 0 ? (
            seriesWithBooks.map((s) => (
              <StaggerItem key={s.id}>
                <Card
                  padding="none"
                  className={`overflow-hidden ${s.completed ? "ring-2 ring-green-400" : ""}`}
                >
                  {/* Series header */}
                  <button
                    onClick={() => toggleExpanded(s.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl">
                        {POPULAR_SERIES.find((ps) => ps.name === s.name)
                          ?.emoji || "📚"}
                      </div>
                      <div className="text-left">
                        <h3 className="font-display font-bold text-gray-900">
                          {s.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {s.books.filter((b) => b.isRead).length} of{" "}
                          {s.books.length} books read
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Progress indicator */}
                      <div className="hidden sm:flex items-center gap-3">
                        <div className="w-32">
                          <Progress
                            value={s.progress}
                            max={100}
                            color="primary"
                            size="sm"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12">
                          {s.progress}%
                        </span>
                      </div>

                      {s.completed && (
                        <Badge
                          variant="success"
                          icon={<Check className="w-3 h-3" />}
                        >
                          Complete
                        </Badge>
                      )}

                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedSeries.includes(s.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedSeries.includes(s.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-5 bg-gray-50">
                          {s.books.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {s.books.map((book, index) => {
                                const bookDetails = books.find(
                                  (b) => b.id === book.bookId,
                                );
                                return (
                                  <div
                                    key={book.bookId}
                                    className={`relative p-3 rounded-xl text-center transition-all ${
                                      book.isRead
                                        ? "bg-white shadow-sm"
                                        : "bg-gray-100 opacity-60"
                                    }`}
                                  >
                                    <span className="text-xs text-gray-400">
                                      Book {index + 1}
                                    </span>
                                    <div className="w-10 h-10 mx-auto my-2 rounded-lg bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
                                      <BookOpen
                                        className={`w-5 h-5 ${book.isRead ? "text-indigo-600" : "text-gray-400"}`}
                                      />
                                    </div>
                                    {book.isRead && (
                                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                      {bookDetails?.title ||
                                        `Book ${index + 1}`}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">
                                No books added yet
                              </p>
                              <p className="text-sm text-gray-400">
                                Add books from your bookshelf to track progress
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleDeleteSeries(s.id)}
                              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Series
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </StaggerItem>
            ))
          ) : (
            <Card padding="lg" className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-6xl block mb-4">📚</span>
              </motion.div>
              <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
                Start tracking your series!
              </h3>
              <p className="text-gray-500 mb-6">
                Keep track of which books you've read in your favorite series
              </p>
              <motion.button
                onClick={() => setShowAddSeries(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Your First Series
              </motion.button>
            </Card>
          )}
        </StaggerContainer>
      </FadeIn>

      {/* Add Series Modal */}
      <AnimatePresence>
        {showAddSeries && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddSeries(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Add a Series
                </h2>
                <button
                  onClick={() => setShowAddSeries(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Custom series input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value)}
                    placeholder="Enter series name..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <motion.button
                    onClick={() => handleAddSeries(newSeriesName)}
                    disabled={!newSeriesName.trim()}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-sm text-gray-500">
                    or pick a popular series
                  </span>
                </div>
              </div>

              {/* Search popular series */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search popular series..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Popular series list */}
              <div className="space-y-2 max-h-64 overflow-auto">
                {filteredPopularSeries.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleAddSeries(s.name)}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center gap-4 text-left"
                  >
                    <span className="text-3xl">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-500">
                        by {s.author} ({s.totalBooks} books)
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeriesTracker;
