import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  Filter,
  BookOpen,
  Calendar,
  ArrowLeft,
  Sparkles,
  X,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { ReviewCard } from "./ReviewCard";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { ReviewReactionButtons } from "./ReactionButtons";
import { ShareReviewButton } from "./ShareButton";
import type { Book } from "../types";

type SortOption = "recent" | "rating";
type FilterGenre = string | "all";

export function PublicReviews() {
  const { bookId } = useParams<{ bookId?: string }>();
  const { books } = useBooks();
  const { user } = useUser();
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterGenre, setFilterGenre] = useState<FilterGenre>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Default avatar
  const defaultAvatar: AvatarConfig = {
    skinTone: "fair",
    hairStyle: "long",
    hairColor: "brown",
    eyeColor: "brown",
    accessory: "none",
    background: "pink",
    outfit: "tshirt",
    outfitColor: "purple",
  };
  const userAvatar = user?.avatar || defaultAvatar;

  // Get books with reviews
  const booksWithReviews = useMemo(() => {
    return books.filter((book) => book.isRead && (book.notes || book.review));
  }, [books]);

  // Get unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(
      booksWithReviews.map((b) => b.genre).filter(Boolean),
    );
    return Array.from(genreSet).sort();
  }, [booksWithReviews]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let result = [...booksWithReviews];

    // Filter by genre
    if (filterGenre !== "all") {
      result = result.filter((book) => book.genre === filterGenre);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => {
          const dateA = a.dateRead ? new Date(a.dateRead).getTime() : 0;
          const dateB = b.dateRead ? new Date(b.dateRead).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  }, [booksWithReviews, filterGenre, sortBy]);

  // If viewing a specific review
  const selectedBook = bookId ? books.find((b) => b.id === bookId) : null;

  // Single review view
  if (selectedBook) {
    return <SingleReviewView book={selectedBook} userAvatar={userAvatar} />;
  }

  // Reviews list view
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Navigation */}
      <PublicNav />

      {/* Compact Hero Section */}
      <section className="py-8 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-primary-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-stone-800">
                  Izzy's Book Reviews
                </h1>
                <p className="text-sm text-stone-500">
                  Honest thoughts about every book I've read
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-2xl font-bold text-primary-600">
                  {booksWithReviews.length}
                </span>
                <span className="text-sm text-stone-500">reviews</span>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-2xl font-bold text-amber-500">
                  {(
                    booksWithReviews.reduce(
                      (sum, b) => sum + (b.rating || 0),
                      0,
                    ) / booksWithReviews.filter((b) => b.rating).length || 0
                  ).toFixed(1)}
                </span>
                <span className="text-sm text-stone-500">avg</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Sort */}
      <div className="bg-white border-b border-cream-200 sticky top-[57px] z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showFilters || filterGenre !== "all"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
                {filterGenre !== "all" && (
                  <span className="bg-primary-500 text-white text-xs px-1.5 rounded-full">
                    1
                  </span>
                )}
              </button>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                  {filterGenre !== "all" && (
                    <button
                      onClick={() => setFilterGenre("all")}
                      className="p-1 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500 hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ReviewCard book={book} featured={index === 0} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-4"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">📝</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-700 mb-3">
                Reviews Coming Soon!
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-6">
                I'm working on writing my first book reviews. Check out my
                favourite books on the homepage while you wait!
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <BookOpen className="w-5 h-5" />
                See My Bookshelf
              </a>
            </motion.div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

// Single Review View Component
function SingleReviewView({
  book,
  userAvatar,
}: {
  book: Book;
  userAvatar: AvatarConfig;
}) {
  const [imageError, setImageError] = useState(false);
  const reviewText = book.notes || book.review;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-300 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/reviews"
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">All Reviews</span>
            </Link>
            <ShareReviewButton
              book={book}
              size="md"
              className="bg-primary-500 hover:bg-primary-600 text-white"
            />
          </div>
        </div>
      </nav>

      {/* Review Content */}
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >
            {/* Book Header */}
            <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Book Cover */}
                <div className="w-32 h-48 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 ring-4 ring-white/20">
                  {book.coverUrl && !imageError ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/80" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                    {book.title}
                  </h1>
                  <p className="text-white/90 text-lg mb-4">by {book.author}</p>

                  {/* Rating */}
                  {book.rating && book.rating > 0 && (
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < book.rating!
                                ? "text-amber-300 fill-amber-300"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xl font-bold">{book.rating}/5</span>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 justify-center md:justify-start text-white/80 text-sm">
                    {book.genre && (
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {book.genre}
                      </span>
                    )}
                    {book.dateRead && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Read{" "}
                        {new Date(book.dateRead).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Body */}
            <div className="p-8">
              {/* Author Attribution */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-100">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <AvatarPreview config={userAvatar} size="md" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Izzy's Review</p>
                  <p className="text-sm text-stone-500">
                    Young book enthusiast
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-stone-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {reviewText}
                </p>
              </div>

              {/* Reactions Section */}
              <div className="bg-stone-50 rounded-2xl p-6">
                <h3 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  What do you think of this review?
                </h3>

                <ReviewReactionButtons
                  bookId={book.id}
                  maxVisible={5}
                  showMoreButton={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              See all of Izzy's reviews
            </Link>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}

export default PublicReviews;
