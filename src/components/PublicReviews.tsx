import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ArrowLeft,
  ArrowRight,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBooks } from "../contexts/BookContext";
import { usePublishedTranslations } from "../hooks/useContentTranslations";
import { formatDate, genreLabel } from "../i18n/format";
import { OriginalLanguageToggle } from "./ui/OriginalLanguageToggle";
import { useUser } from "../contexts/UserContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { ReviewCard } from "./ReviewCard";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { ReviewReactionButtons } from "./ReactionButtons";
import { ShareReviewButton } from "./ShareButton";
import { BookCoverImage } from "./ui/BookCoverImage";
import { SearchInput } from "./ui/Input";
import { PageMeta } from "./PageMeta";
import { CurrentlyReadingStrip } from "./CurrentlyReadingStrip";
import { pageMeta } from "../lib/seo";
import type { Book } from "../types";

type SortOption = "recent" | "rating";
type FilterGenre = string | "all";
/** Minimum star rating filter; null = any */
type MinRating = 3 | 4 | 5 | null;

const RATING_OPTIONS: { value: MinRating; label: string }[] = [
  { value: null, label: "any" },
  { value: 5, label: "5★" },
  { value: 4, label: "4★+" },
  { value: 3, label: "3★+" },
];

const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "fair",
  hairStyle: "long",
  hairColor: "brown",
  eyeColor: "brown",
  accessory: "none",
  background: "pink",
  outfit: "tshirt",
  outfitColor: "pink",
  expression: "happy",
};

function parseMinRating(raw: string | null): MinRating {
  if (raw === "5" || raw === "4" || raw === "3") return Number(raw) as 3 | 4 | 5;
  return null;
}

function parseSort(raw: string | null): SortOption {
  return raw === "rating" ? "rating" : "recent";
}

function PublicReviews() {
  const { bookId } = useParams<{ bookId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { books } = useBooks();
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();
  const { t } = useTranslation();
  const reviewTranslations = usePublishedTranslations("review");

  const [sortBy, setSortBy] = useState<SortOption>(() =>
    parseSort(searchParams.get("sort")),
  );
  const [filterGenre, setFilterGenre] = useState<FilterGenre>(
    () => searchParams.get("genre") || "all",
  );
  const [filterTag, setFilterTag] = useState<string | null>(
    () => searchParams.get("tag"),
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || "",
  );
  const [minRating, setMinRating] = useState<MinRating>(() =>
    parseMinRating(searchParams.get("rating")),
  );

  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  // Keep filters shareable via ?q=&genre=&tag=&rating=&sort=
  useEffect(() => {
    if (bookId) return;
    const next = new URLSearchParams();
    const q = searchQuery.trim();
    if (q) next.set("q", q);
    if (filterGenre !== "all") next.set("genre", filterGenre);
    if (filterTag) next.set("tag", filterTag);
    if (minRating) next.set("rating", String(minRating));
    if (sortBy !== "recent") next.set("sort", sortBy);
    setSearchParams(
      (prev) => (prev.toString() === next.toString() ? prev : next),
      { replace: true },
    );
  }, [
    bookId,
    searchQuery,
    filterGenre,
    filterTag,
    minRating,
    sortBy,
    setSearchParams,
  ]);

  const booksWithReviews = useMemo(() => {
    return books.filter((book) => book.isRead && (book.notes || book.review));
  }, [books]);

  const genres = useMemo(() => {
    const genreSet = new Set(
      booksWithReviews.map((b) => b.genre).filter(Boolean),
    );
    return Array.from(genreSet).sort();
  }, [booksWithReviews]);

  const moodTags = useMemo(() => {
    const tagSet = new Set<string>();
    booksWithReviews.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [booksWithReviews]);

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = booksWithReviews.filter((book) => {
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.notes || book.review || "").toLowerCase().includes(q) ||
        book.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesGenre = filterGenre === "all" || book.genre === filterGenre;
      const matchesTag = !filterTag || book.tags?.includes(filterTag);
      const matchesRating =
        !minRating || (book.rating != null && book.rating >= minRating);
      return matchesSearch && matchesGenre && matchesTag && matchesRating;
    });

    switch (sortBy) {
      case "recent":
        result = [...result].sort((a, b) => {
          const dateA = a.dateRead ? new Date(a.dateRead).getTime() : 0;
          const dateB = b.dateRead ? new Date(b.dateRead).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  }, [
    booksWithReviews,
    filterGenre,
    filterTag,
    minRating,
    sortBy,
    searchQuery,
  ]);

  const selectedBook = bookId ? books.find((b) => b.id === bookId) : null;
  const hasActiveFilters =
    filterGenre !== "all" ||
    Boolean(filterTag) ||
    Boolean(minRating) ||
    searchQuery.trim().length > 0;

  const clearFilters = useCallback(() => {
    setFilterGenre("all");
    setFilterTag(null);
    setMinRating(null);
    setSearchQuery("");
  }, []);

  if (selectedBook) {
    return (
      <SingleReviewView
        key={selectedBook.id}
        book={selectedBook}
        userAvatar={userAvatar}
      />
    );
  }

  const avgRating =
    booksWithReviews.filter((b) => b.rating).length > 0
      ? booksWithReviews.reduce((sum, b) => sum + (b.rating || 0), 0) /
        booksWithReviews.filter((b) => b.rating).length
      : 0;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <PageMeta
        title={pageMeta.reviews.title}
        description={pageMeta.reviews.description}
        path="/reviews"
      />

      <PublicNav />

      {/* Hero – matches home/about language */}
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
              {t("reviews.eyebrow")}
            </p>
            <h1 className="font-accent text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.05] mb-3">
              {t("reviews.title")}
            </h1>
            <p className="text-base text-stone-500 max-w-md mx-auto leading-relaxed">
              {t("reviews.intro")}
            </p>
            {booksWithReviews.length > 0 && (
              <p className="mt-5 text-sm text-stone-500">
                <span className="font-display font-bold text-stone-700 tabular-nums">
                  {booksWithReviews.length}
                </span>{" "}
                {t("reviews.countLabel", { count: booksWithReviews.length })}
                {avgRating > 0 && (
                  <>
                    {" · "}
                    <span className="inline-flex items-center gap-1 align-middle">
                      <Star className="w-3.5 h-3.5 text-star fill-star" />
                      <span className="font-display font-bold text-stone-700 tabular-nums">
                        {avgRating.toFixed(1)}
                      </span>{" "}
                      {t("reviews.avg")}
                    </span>
                  </>
                )}
                {" · "}
                <Link
                  to="/#bookshelf"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t("reviews.fullShelf")}
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 w-full pb-2 space-y-4">
        <CurrentlyReadingStrip books={books} />

        {/* Search + filters */}
        {booksWithReviews.length > 0 && (
          <>
            <div className="max-w-md mx-auto sm:mx-0">
              <SearchInput
                placeholder={t("reviews.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                className="bg-white border-cream-300 focus:bg-white"
                aria-label={t("reviews.searchLabel")}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setFilterGenre("all")}
                aria-pressed={filterGenre === "all"}
                className={`inline-flex items-center min-h-11 sm:min-h-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterGenre === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-white text-stone-600 border border-cream-300 hover:border-primary-300"
                }`}
              >
                {t("common.all")}
              </button>
              {genres.map((genre) => (
                <button
                  type="button"
                  key={genre}
                  onClick={() =>
                    setFilterGenre(filterGenre === genre ? "all" : genre)
                  }
                  aria-pressed={filterGenre === genre}
                  className={`inline-flex items-center min-h-11 sm:min-h-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterGenre === genre
                      ? "bg-primary-600 text-white"
                      : "bg-white text-stone-600 border border-cream-300 hover:border-primary-300"
                  }`}
                >
                  {genreLabel(t, genre)}
                </button>
              ))}
              <div className="w-px h-6 bg-cream-300 mx-1 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-sm text-stone-600 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                aria-label={t("reviews.sortLabel")}
              >
                <option value="recent">{t("reviews.sortRecent")}</option>
                <option value="rating">{t("reviews.sortRating")}</option>
              </select>
            </div>

            <div
              className="flex flex-wrap items-center gap-2 justify-center sm:justify-start"
              aria-label={t("reviews.filterStars")}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mr-1">
                {t("reviews.stars")}
              </span>
              {RATING_OPTIONS.map(({ value, label }) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setMinRating(value)}
                  aria-pressed={minRating === value}
                  className={`inline-flex items-center min-h-11 sm:min-h-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    minRating === value
                      ? "bg-star/20 text-amber-800 border border-amber-300"
                      : "bg-white text-stone-600 border border-cream-300 hover:border-amber-300"
                  }`}
                >
                  {label === "any" ? t("reviews.anyStars") : label}
                </button>
              ))}
            </div>

            {moodTags.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 justify-center sm:justify-start"
                aria-label={t("reviews.filterMood")}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 mr-1">
                  {t("reviews.mood")}
                </span>
                {moodTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                    aria-pressed={filterTag === tag}
                    className={`inline-flex items-center min-h-11 sm:min-h-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filterTag === tag
                        ? "bg-accent-600 text-white"
                        : "bg-white text-stone-600 border border-cream-300 hover:border-accent-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {hasActiveFilters && (
              <p className="text-sm text-stone-500 text-center sm:text-left">
                {t("reviews.showing", { shown: filteredReviews.length, total: booksWithReviews.length })}
                {" · "}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t("reviews.clearFilters")}
                </button>
              </p>
            )}
          </>
        )}
      </div>

      <main className="flex-1 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {filteredReviews.length > 0 ? (
            <div className="space-y-10 sm:space-y-12 divide-y divide-cream-300">
              {filteredReviews.map((book, index) => (
                <div key={book.id} className={index === 0 ? "" : "pt-10 sm:pt-12"}>
                  <ReviewCard
                    book={book}
                    featured={
                      index === 0 && sortBy === "recent" && !hasActiveFilters
                    }
                    index={index}
                    italianReview={reviewTranslations.get(book.id)?.body}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <BookOpen className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-stone-700 mb-3">
                {hasActiveFilters
                  ? t("reviews.noMatchTitle")
                  : t("reviews.comingSoonTitle")}
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-6">
                {hasActiveFilters
                  ? t("reviews.noMatchText")
                  : t("reviews.comingSoonText")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cream-300 bg-white text-stone-700 font-display font-semibold text-sm hover:bg-cream-50 transition-colors"
                  >
                    {t("reviews.clearFilters")}
                  </button>
                )}
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md transition-colors"
                >
                  {t("home.browseShelf")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
  const { t, i18n } = useTranslation();
  const reviewTranslations = usePublishedTranslations("review");
  const italianReview = reviewTranslations.get(book.id)?.body;
  const [showOriginal, setShowOriginal] = useState(false);
  const englishReview = book.notes || book.review;
  const reviewText =
    italianReview && !showOriginal ? italianReview : englishReview;

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
      <PageMeta
        title={`Izzy's Review: ${book.title} | Izzy's Bookshelf`}
        description={`Read Izzy's honest review of "${book.title}" by ${book.author} on Izzy's Bookshelf.`}
        path={`/reviews/${book.id}`}
        image={book.coverUrl}
        type="article"
      />

      <PublicNav />

      <div className="max-w-3xl mx-auto px-4 pt-6 w-full">
        <Link
          to="/reviews"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-primary-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("reviews.allReviews")}
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
            {/* Book header – open layout, no purple gradient card */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start mb-10">
              <div className="w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-xl ring-1 ring-cream-300 flex-shrink-0">
                <BookCoverImage book={book} className="w-full h-full" />
              </div>

              <div className="text-center sm:text-left flex-1 pt-1">
                {book.genre && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-2">
                    {genreLabel(t, book.genre)}
                  </p>
                )}
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 leading-tight mb-2">
                  {book.title}
                </h1>
                <p className="text-lg text-stone-500 mb-4">{t("common.byAuthor", { author: book.author })}</p>

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
                  <p className="flex items-center gap-1.5 text-sm text-stone-500 justify-center sm:justify-start">
                    <Calendar className="w-4 h-4" aria-hidden />
                    {t("reviews.readOn", {
                      date: formatDate(book.dateRead, i18n.language, {
                        month: "long",
                        year: "numeric",
                      }),
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
                    {t("reviews.izzysReview")}
                  </p>
                  <p className="text-sm text-stone-500">{t("reviews.authorTagline")}</p>
                </div>
              </div>

              {reviewText ? (
                <div className="prose prose-lg max-w-none mb-10">
                  <p className="text-stone-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {reviewText}
                  </p>
                  {italianReview && (
                    <OriginalLanguageToggle
                      className="mt-4 not-prose"
                      showingOriginal={showOriginal}
                      onToggle={() => setShowOriginal((v) => !v)}
                    />
                  )}
                </div>
              ) : (
                <p className="text-stone-500 italic mb-10">
                  {t("reviews.reviewComingSoon")}
                </p>
              )}

              <div className="py-6 border-y border-cream-300 mb-10">
                <p className="text-sm font-medium text-stone-500 mb-3 text-center sm:text-left">
                  {t("reviews.reactPrompt")}
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
                {t("reviews.moreReviews")}
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
              {t("reviews.seeAll")}
            </Link>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}

export default PublicReviews;
