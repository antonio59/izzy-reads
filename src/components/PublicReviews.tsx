import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ArrowLeft,
  ArrowRight,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { ReviewCard } from "./ReviewCard";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { ReviewReactionButtons } from "./ReactionButtons";
import { ShareReviewButton } from "./ShareButton";
import { BookCoverImage } from "./ui/BookCoverImage";
import type { Book } from "../types";

type SortOption = "recent" | "rating";
type FilterGenre = string | "all";

const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "fair",
  hairStyle: "long",
  hairColor: "brown",
  eyeColor: "brown",
  accessory: "none",
  background: "pink",
  outfit: "tshirt",
  outfitColor: "purple",
  expression: "happy",
};

function PublicReviews() {
  const { bookId } = useParams<{ bookId?: string }>();
  const { books } = useBooks();
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterGenre, setFilterGenre] = useState<FilterGenre>("all");

  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  const booksWithReviews = useMemo(() => {
    return books.filter((book) => book.isRead && (book.notes || book.review));
  }, [books]);

  const genres = useMemo(() => {
    const genreSet = new Set(
      booksWithReviews.map((b) => b.genre).filter(Boolean),
    );
    return Array.from(genreSet).sort();
  }, [booksWithReviews]);

  const filteredReviews = useMemo(() => {
    let result = [...booksWithReviews];

    if (filterGenre !== "all") {
      result = result.filter((book) => book.genre === filterGenre);
    }

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

  const selectedBook = bookId ? books.find((b) => b.id === bookId) : null;

  if (selectedBook) {
    return <SingleReviewView book={selectedBook} userAvatar={userAvatar} />;
  }

  const pageUrl = `${window.location.origin}/reviews`;
  const avgRating =
    booksWithReviews.filter((b) => b.rating).length > 0
      ? booksWithReviews.reduce((sum, b) => sum + (b.rating || 0), 0) /
        booksWithReviews.filter((b) => b.rating).length
      : 0;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>Izzy&apos;s Book Reviews | Izzy&apos;s Bookshelf</title>
        <meta
          name="description"
          content="Honest book reviews from a young reader. Discover what Izzy thinks about fantasy, adventure, mystery and more!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Izzy's Book Reviews" />
        <meta
          property="og:description"
          content="Honest book reviews from a young reader. Discover what Izzy thinks about fantasy, adventure, mystery and more!"
        />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:image"
          content={`${window.location.origin}/og-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Izzy's Book Reviews" />
        <meta
          name="twitter:description"
          content="Honest book reviews from a young reader. Discover what Izzy thinks about fantasy, adventure, mystery and more!"
        />
      </Helmet>

      <PublicNav />

      {/* Hero — matches home/about language */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 0%, rgba(217,70,168,0.10), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(13,148,136,0.10), transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 sm:pt-14 pb-8 text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide mb-3">
              Honest thoughts
            </p>
            <h1 className="font-accent text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.05] mb-3">
              Book Reviews
            </h1>
            <p className="text-base text-stone-500 max-w-md mx-auto leading-relaxed">
              What I really thought about the books I&apos;ve read.
            </p>
            {booksWithReviews.length > 0 && (
              <p className="mt-5 text-sm text-stone-400">
                <span className="font-display font-bold text-stone-700 tabular-nums">
                  {booksWithReviews.length}
                </span>{" "}
                reviews
                {avgRating > 0 && (
                  <>
                    {" · "}
                    <span className="inline-flex items-center gap-1 align-middle">
                      <Star className="w-3.5 h-3.5 text-star fill-star" />
                      <span className="font-display font-bold text-stone-700 tabular-nums">
                        {avgRating.toFixed(1)}
                      </span>{" "}
                      avg
                    </span>
                  </>
                )}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters — quiet, not a sticky dashboard bar */}
      {booksWithReviews.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 w-full pb-2">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => setFilterGenre("all")}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterGenre === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-stone-600 border border-cream-300 hover:border-primary-300"
              }`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                type="button"
                key={genre}
                onClick={() =>
                  setFilterGenre(filterGenre === genre ? "all" : genre)
                }
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterGenre === genre
                    ? "bg-primary-600 text-white"
                    : "bg-white text-stone-600 border border-cream-300 hover:border-primary-300"
                }`}
              >
                {genre}
              </button>
            ))}
            <div className="w-px h-6 bg-cream-300 mx-1 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-sm text-stone-600 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              aria-label="Sort reviews"
            >
              <option value="recent">Most recent</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>
      )}

      <main className="flex-1 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {filteredReviews.length > 0 ? (
            <div className="space-y-10 sm:space-y-12 divide-y divide-cream-300">
              {filteredReviews.map((book, index) => (
                <div key={book.id} className={index === 0 ? "" : "pt-10 sm:pt-12"}>
                  <ReviewCard
                    book={book}
                    featured={index === 0 && sortBy === "recent"}
                    index={index}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <BookOpen className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-stone-700 mb-3">
                {filterGenre !== "all"
                  ? "No reviews in this genre"
                  : "Reviews coming soon"}
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-6">
                {filterGenre !== "all"
                  ? "Try another genre, or browse the full shelf."
                  : "I'm writing my first reviews — peek at my bookshelf while you wait!"}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md transition-colors"
              >
                Browse my shelf
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function SingleReviewView({
  book,
  userAvatar,
}: {
  book: Book;
  userAvatar: AvatarConfig;
}) {
  const { prefersReducedMotion } = useMotionPreference();
  const { books } = useBooks();
  const reviewText = book.notes || book.review;
  const reviewUrl = `${window.location.origin}/reviews/${book.id}`;

  const moreReviews = useMemo(() => {
    return books
      .filter(
        (b) =>
          b.id !== book.id && b.isRead && (b.notes || b.review),
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, [books, book.id]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>{`Izzy's Review: ${book.title} | Izzy's Bookshelf`}</title>
        <meta
          name="description"
          content={`Read Izzy's review of "${book.title}" by ${book.author}.`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`Izzy's Review: ${book.title}`} />
        <meta
          property="og:description"
          content={`Read Izzy's review of "${book.title}" by ${book.author}.`}
        />
        <meta property="og:url" content={reviewUrl} />
        <meta
          property="og:image"
          content={
            book.coverUrl || `${window.location.origin}/og-image.png`
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Izzy's Review: ${book.title}`} />
        <meta
          name="twitter:description"
          content={`Read Izzy's review of "${book.title}" by ${book.author}.`}
        />
      </Helmet>

      <PublicNav />

      <div className="max-w-3xl mx-auto px-4 pt-6 w-full">
        <Link
          to="/reviews"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-primary-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          All reviews
        </Link>
      </div>

      <main className="flex-1 py-8 sm:py-10">
        <article className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Book header — open layout, no purple gradient card */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start mb-10">
              <div className="w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-xl ring-1 ring-cream-300 flex-shrink-0">
                <BookCoverImage book={book} className="w-full h-full" />
              </div>

              <div className="text-center sm:text-left flex-1 pt-1">
                {book.genre && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-2">
                    {book.genre}
                  </p>
                )}
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 leading-tight mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-stone-500 mb-4">by {book.author}</p>

                {book.rating && book.rating > 0 && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < book.rating!
                              ? "text-star fill-star"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-display font-bold text-stone-700">
                      {book.rating}/5
                    </span>
                  </div>
                )}

                {book.dateRead && (
                  <p className="flex items-center gap-1.5 text-sm text-stone-400 justify-center sm:justify-start">
                    <Calendar className="w-4 h-4" aria-hidden />
                    Read{" "}
                    {new Date(book.dateRead).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}

                <div className="mt-5 flex justify-center sm:justify-start">
                  <ShareReviewButton
                    book={book}
                    size="md"
                    className="bg-cream-200 hover:bg-cream-300 text-stone-700 border border-cream-300"
                  />
                </div>
              </div>
            </div>

            {/* Attribution + body */}
            <div className="border-t border-cream-300 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full overflow-hidden ring-2 ring-primary-100">
                  <AvatarPreview config={userAvatar} size="sm" />
                </div>
                <div>
                  <p className="font-display font-bold text-stone-800">
                    Izzy&apos;s review
                  </p>
                  <p className="text-sm text-stone-500">Young book enthusiast</p>
                </div>
              </div>

              {reviewText ? (
                <div className="prose prose-lg max-w-none mb-10">
                  <p className="text-stone-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {reviewText}
                  </p>
                </div>
              ) : (
                <p className="text-stone-400 italic mb-10">
                  Review coming soon!
                </p>
              )}

              <div className="py-6 border-y border-cream-300 mb-10">
                <p className="text-sm font-medium text-stone-500 mb-3 text-center sm:text-left">
                  What do you think of this review?
                </p>
                <ReviewReactionButtons
                  bookId={book.id}
                  maxVisible={5}
                  showMoreButton={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Continue reading */}
          {moreReviews.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-display font-bold text-stone-800 mb-6">
                More reviews
              </h2>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {moreReviews.map((b) => (
                  <Link
                    key={b.id}
                    to={`/reviews/${b.id}`}
                    className="group block"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 transition-all group-hover:-translate-y-1 mb-2">
                      <BookCoverImage book={b} className="w-full h-full" />
                    </div>
                    <p className="font-display font-bold text-sm text-stone-800 line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {b.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="text-center pt-4">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              See all reviews
            </Link>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}

export default PublicReviews;
