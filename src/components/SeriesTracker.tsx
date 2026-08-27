import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Check,
  Search,
  X,
  Trash2,
  Trophy,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Modal } from "./ui/Modal";
import { Progress } from "./ui/Progress";
import { Input } from "./ui/Input";
import { FadeIn, StaggerContainer, StaggerItem } from "./PageTransition";
import type { Book } from "../types";
import type { Id, Doc } from "../../convex/_generated/dataModel";

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

interface SeriesWithBooks {
  id: Id<"bookSeries">;
  name: string;
  description?: string;
  bookIds: Id<"books">[];
  completed: boolean;
  books: Book[];
  booksRead: number;
  progress: number;
}

const SeriesTracker: React.FC = () => {
  const { books } = useBooks();
  const { convexUserId } = useAuth();

  // Convex queries and mutations
  const seriesData = useQuery(
    api.series.getByUser,
    convexUserId ? { userId: convexUserId } : "skip",
  );
  const createSeries = useMutation(api.series.create);
  const deleteSeries = useMutation(api.series.remove);
  const addBookToSeries = useMutation(api.series.addBook);
  const removeBookFromSeries = useMutation(api.series.removeBook);
  const reorderSeriesBooks = useMutation(api.series.reorderBooks);
  const updateSeries = useMutation(api.series.update);

  const [showAddSeries, setShowAddSeries] = useState(false);
  const [showAddBook, setShowAddBook] = useState<Id<"bookSeries"> | null>(null);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);

  // Convert Convex series to SeriesWithBooks
  const seriesWithBooks: SeriesWithBooks[] = useMemo(() => {
    if (!seriesData) return [];

    return seriesData.map((s: Doc<"bookSeries">) => {
      const seriesBooks = s.bookIds
        .map((bookId) => books.find((b) => b.id === bookId))
        .filter((b): b is Book => b !== undefined);

      const booksRead = seriesBooks.filter((b) => b.isRead).length;
      const progress =
        seriesBooks.length > 0
          ? Math.round((booksRead / seriesBooks.length) * 100)
          : 0;

      return {
        id: s._id,
        name: s.name,
        description: s.description,
        bookIds: s.bookIds,
        completed: s.completed,
        books: seriesBooks,
        booksRead,
        progress,
      };
    });
  }, [seriesData, books]);

  const handleAddSeries = async (name: string) => {
    if (!name.trim() || !convexUserId) return;

    await createSeries({
      userId: convexUserId,
      name: name.trim(),
    });

    setShowAddSeries(false);
    setNewSeriesName("");
  };

  const handleDeleteSeries = async (id: Id<"bookSeries">) => {
    if (confirm("Are you sure you want to delete this series?")) {
      await deleteSeries({ id });
      setExpandedSeries((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const handleAddBookToSeries = async (
    seriesId: Id<"bookSeries">,
    bookId: string,
  ) => {
    await addBookToSeries({
      seriesId,
      bookId: bookId as Id<"books">,
    });
    setShowAddBook(null);
    setBookSearchQuery("");
  };

  const handleRemoveBookFromSeries = async (
    seriesId: Id<"bookSeries">,
    bookId: string,
  ) => {
    await removeBookFromSeries({
      seriesId,
      bookId: bookId as Id<"books">,
    });
  };

  const handleReorderBook = async (
    seriesId: Id<"bookSeries">,
    bookId: string,
    direction: "up" | "down",
  ) => {
    const series = seriesWithBooks.find((s) => s.id === seriesId);
    if (!series) return;

    const ids = [...series.bookIds];
    const index = ids.findIndex((id) => id === bookId);
    if (index < 0) return;

    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= ids.length) return;

    [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
    await reorderSeriesBooks({ seriesId, bookIds: ids });
  };

  const handleToggleComplete = async (
    seriesId: Id<"bookSeries">,
    completed: boolean,
  ) => {
    await updateSeries({ id: seriesId, completed: !completed });
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

  // Get books not already in a series for adding
  const getAvailableBooks = (seriesId: Id<"bookSeries">) => {
    const series = seriesWithBooks.find((s) => s.id === seriesId);
    if (!series) return books;

    return books.filter(
      (book) =>
        !series.bookIds.includes(book.id as Id<"books">) &&
        (book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())),
    );
  };

  const isLoading = convexUserId && seriesData === undefined;

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
                  <Library className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-stone-900">
                    Series Tracker
                  </h1>
                  <p className="text-stone-600">
                    Track your progress through book series
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setShowAddSeries(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg"
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
            <p className="text-3xl font-display font-bold text-primary-600">
              {seriesWithBooks.length}
            </p>
            <p className="text-sm text-stone-500">Series Tracked</p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-3xl font-display font-bold text-primary-600">
              {seriesWithBooks.filter((s) => s.completed).length}
            </p>
            <p className="text-sm text-stone-500">Completed</p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-3xl font-display font-bold text-accent-600">
              {seriesWithBooks.reduce((sum, s) => sum + s.booksRead, 0)}
            </p>
            <p className="text-sm text-stone-500">Books Read</p>
          </Card>
        </div>
      </FadeIn>

      {/* Series List */}
      <FadeIn delay={0.2}>
        {isLoading ? (
          <Card padding="lg" className="text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-200 rounded-full mb-4" />
              <div className="h-4 bg-stone-200 rounded w-32 mb-2" />
              <div className="h-3 bg-stone-200 rounded w-48" />
            </div>
          </Card>
        ) : (
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
                      className="w-full p-5 flex items-center justify-between hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-2xl">
                          {POPULAR_SERIES.find((ps) => ps.name === s.name)
                            ?.emoji || "📚"}
                        </div>
                        <div className="text-left">
                          <h3 className="font-display font-bold text-stone-900">
                            {s.name}
                          </h3>
                          <p className="text-sm text-stone-500">
                            {s.booksRead} of {s.books.length} books read
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
                          <span className="text-sm font-medium text-stone-600 w-12">
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
                          className={`w-5 h-5 text-stone-400 transition-transform ${
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
                          className="border-t border-stone-100"
                        >
                          <div className="p-5 bg-stone-50">
                            {s.books.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {s.books.map((book, index) => (
                                  <div
                                    key={book.id}
                                    className={`relative p-3 rounded-xl text-center transition-all group ${
                                      book.isRead
                                        ? "bg-white shadow-sm"
                                        : "bg-stone-100 opacity-60"
                                    }`}
                                  >
                                    <div className="absolute top-1 left-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() =>
                                          handleReorderBook(
                                            s.id,
                                            book.id,
                                            "up",
                                          )
                                        }
                                        className="p-1 bg-white text-stone-500 rounded-full shadow-sm hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:pointer-events-none"
                                        title="Move up"
                                      >
                                        <ChevronUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={index === s.books.length - 1}
                                        onClick={() =>
                                          handleReorderBook(
                                            s.id,
                                            book.id,
                                            "down",
                                          )
                                        }
                                        className="p-1 bg-white text-stone-500 rounded-full shadow-sm hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:pointer-events-none"
                                        title="Move down"
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleRemoveBookFromSeries(
                                          s.id,
                                          book.id,
                                        )
                                      }
                                      className="absolute top-1 right-1 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                                      title="Remove from series"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs text-stone-400">
                                      Book {index + 1}
                                    </span>
                                    {book.coverUrl ? (
                                      <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-16 h-24 mx-auto my-2 rounded-lg object-cover shadow-sm"
                                      />
                                    ) : (
                                      <div className="w-16 h-24 mx-auto my-2 rounded-lg bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                                        <BookOpen
                                          className={`w-6 h-6 ${book.isRead ? "text-primary-600" : "text-stone-400"}`}
                                        />
                                      </div>
                                    )}
                                    {book.isRead && (
                                      <div className="absolute top-8 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                    <p className="text-xs font-medium text-stone-700 truncate">
                                      {book.title}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                <p className="text-stone-500">
                                  No books added yet
                                </p>
                                <p className="text-sm text-stone-400">
                                  Add books from your bookshelf to track
                                  progress
                                </p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap justify-between gap-2 mt-4 pt-4 border-t border-stone-200">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => setShowAddBook(s.id)}
                                  className="flex items-center gap-1 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Book
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleComplete(s.id, s.completed)
                                  }
                                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                                    s.completed
                                      ? "text-stone-600 hover:bg-stone-100"
                                      : "text-accent-700 hover:bg-accent-50"
                                  }`}
                                >
                                  <Trophy className="w-4 h-4" />
                                  {s.completed
                                    ? "Mark incomplete"
                                    : "Mark series complete"}
                                </button>
                              </div>
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
                <h3 className="text-xl font-display font-bold text-stone-800 mb-2">
                  Start tracking your series!
                </h3>
                <p className="text-stone-500 mb-6">
                  Keep track of which books you've read in your favorite series
                </p>
                <motion.button
                  onClick={() => setShowAddSeries(true)}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Your First Series
                </motion.button>
              </Card>
            )}
          </StaggerContainer>
        )}
      </FadeIn>

      {/* Add Series Modal */}
      <Modal
        isOpen={showAddSeries}
        onClose={() => setShowAddSeries(false)}
        size="md"
        title="Add a Series"
      >
        {/* Custom series input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Series Name
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={newSeriesName}
                      onChange={(e) => setNewSeriesName(e.target.value)}
                      placeholder="Enter series name..."
                    />
                  </div>
                  <motion.button
                    onClick={() => handleAddSeries(newSeriesName)}
                    disabled={!newSeriesName.trim()}
                    className="px-4 py-3 bg-primary-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-sm text-stone-500">
                    or pick a popular series
                  </span>
                </div>
              </div>

              {/* Search popular series */}
              <div className="mb-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search popular series..."
                  icon={<Search className="w-5 h-5" />}
                  iconPosition="left"
                />
              </div>

        {/* Popular series list */}
        <div className="space-y-2 max-h-64 overflow-auto">
          {filteredPopularSeries.map((s) => (
            <button
              key={s.name}
              onClick={() => handleAddSeries(s.name)}
              className="w-full p-4 rounded-xl border border-stone-200 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center gap-4 text-left"
            >
              <span className="text-3xl">{s.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-stone-900">{s.name}</p>
                <p className="text-sm text-stone-500">
                  by {s.author} ({s.totalBooks} books)
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
          ))}
        </div>
      </Modal>

      {/* Add Book to Series Modal */}
      <Modal
        isOpen={!!showAddBook}
        onClose={() => {
          setShowAddBook(null);
          setBookSearchQuery("");
        }}
        size="md"
        title="Add Book to Series"
      >
        {/* Search books */}
              <div className="mb-4">
                <Input
                  type="text"
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  placeholder="Search your books..."
                  icon={<Search className="w-5 h-5" />}
                  iconPosition="left"
                />
              </div>

        {/* Book list */}
        <div className="space-y-2 max-h-96 overflow-auto">
          {getAvailableBooks(showAddBook!).length > 0 ? (
            getAvailableBooks(showAddBook!).map((book) => (
              <button
                key={book.id}
                onClick={() =>
                  handleAddBookToSeries(showAddBook!, book.id)
                }
                className="w-full p-3 rounded-xl border border-stone-200 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center gap-3 text-left"
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-10 h-14 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-14 rounded bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 truncate">
                    {book.title}
                  </p>
                  <p className="text-sm text-stone-500 truncate">
                    {book.author}
                  </p>
                </div>
                {book.isRead && (
                  <Badge variant="success" size="sm">
                    Read
                  </Badge>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No books available</p>
              <p className="text-sm text-stone-400">
                Add books to your bookshelf first
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SeriesTracker;
