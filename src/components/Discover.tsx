/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useConvex, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  Heart,
  X,
  RefreshCw,
  BookOpen,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Info,
  Gift,
} from "lucide-react";
import SwipeCard from "./SwipeCard";
import { Button } from "./ui/Button";
import { upgradeCoverUrl } from "../lib/coverUrl";

// Genre mapping from Google Books categories
const CATEGORY_MAP: Record<string, string> = {
  fantasy: "Fantasy",
  "science fiction": "Sci-Fi",
  "sci-fi": "Sci-Fi",
  romance: "Romance",
  mystery: "Mystery",
  horror: "Horror",
  action: "Action",
  adventure: "Adventure",
  comedy: "Comedy",
  humor: "Comedy",
  drama: "Drama",
  manga: "Manga",
  thriller: "Mystery",
  suspense: "Mystery",
  "young adult": "Young Adult",
  contemporary: "Contemporary",
  historical: "Historical",
  "graphic novel": "Graphic Novel",
};

function mapCategoryToGenre(categories: string[]): string {
  for (const cat of categories) {
    const lower = cat.toLowerCase().trim();
    if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
    for (const [key, genre] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(key)) return genre;
    }
  }
  return "Other";
}

// Keywords that indicate content is NOT appropriate for a 12-year-old
const INAPPROPRIATE_KEYWORDS = [
  "erotica", "adult fiction", "mature", "sexual", "explicit",
  "graphic novels - adult", "adult content", "nsfw", "pornographic",
  "erotic romance", "adult only", "18+", "xxx",
];

function isAgeAppropriate(categories: string[], title: string): boolean {
  const allText = [...categories, title].join(" ").toLowerCase();
  return !INAPPROPRIATE_KEYWORDS.some((kw) => allText.includes(kw));
}

interface BookCandidate {
  googleBookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  description?: string;
}

function buildSearchQueries(
  topGenres: string[],
  topAuthors: string[],
  highlyRated: string[]
): string[] {
  const queries: string[] = [];

  // Genre-based searches
  for (const genre of topGenres.slice(0, 3)) {
    queries.push(`subject:${genre.toLowerCase()} fiction`);
  }

  // "Similar to" searches based on highly rated books
  for (const title of highlyRated.slice(0, 2)) {
    queries.push(`"similar to" "${title}"`);
  }

  // Author-based for diversity
  for (const author of topAuthors.slice(0, 1)) {
    queries.push(`inauthor:"${author}"`);
  }

  // General discovery queries
  queries.push("best children's books 2025");
  queries.push("award winning middle grade fiction");
  queries.push("best young adult books");

  return queries;
}

function Discover() {
  const profile = useQuery(api.discover.getReadingProfile);
  const swipedIds = useQuery(api.discover.getSwipedIds);
  const existingKeys = useQuery(api.discover.getExistingBookKeys);
  const stats = useQuery(api.discover.getStats);
  const recordSwipe = useMutation(api.discover.recordSwipe);
  const storeCoverImage = useAction(api.covers.storeCoverImage);
  const convex = useConvex();

  const [candidates, setCandidates] = useState<BookCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastSwipeAction, setLastSwipeAction] = useState<"liked" | "passed" | null>(null);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<"left" | "right" | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookCandidate | null>(null);
  const [modalImageError, setModalImageError] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const queryIndexRef = useRef(0);
  const searchQueriesRef = useRef<string[]>([]);

  const isReady = profile !== undefined && swipedIds !== undefined && existingKeys !== undefined;

  // Build search queries once profile is loaded
  useEffect(() => {
    if (profile && searchQueriesRef.current.length === 0) {
      searchQueriesRef.current = buildSearchQueries(
        profile.topGenres,
        profile.topAuthors,
        profile.highlyRated
      );
    }
  }, [profile]);

  const fetchMore = useCallback(async () => {
    if (!isReady || loading) return;

    setLoading(true);
    try {
      const queries = searchQueriesRef.current;
      if (queries.length === 0) return;

      const swipedSet = new Set(swipedIds);
      const existingSet = new Set(existingKeys);
      const newCandidates: BookCandidate[] = [];

      let attempts = 0;
      while (newCandidates.length < 10 && attempts < 4) {
        const queryIdx = queryIndexRef.current % queries.length;
        const searchQuery = queries[queryIdx];
        queryIndexRef.current++;
        attempts++;

        const results = await convex.action((api as any).discover.fetchRecommendations, {
          searchQuery,
          startIndex: Math.floor(Math.random() * 20),
        });

        for (const result of results) {
          const bookKey = `${result.title.toLowerCase().trim()}::${result.author.toLowerCase().trim()}`;
          if (
            !swipedSet.has(result.googleBookId) &&
            !existingSet.has(bookKey) &&
            !candidates.some((c) => c.googleBookId === result.googleBookId) &&
            !newCandidates.some((c) => c.googleBookId === result.googleBookId) &&
            result.title !== "Unknown Title" &&
            isAgeAppropriate(result.categories ?? [], result.title)
          ) {
            newCandidates.push({
              googleBookId: result.googleBookId,
              title: result.title,
              author: result.author,
              coverUrl: result.coverUrl
                ? upgradeCoverUrl(result.coverUrl)
                : undefined,
              genre: mapCategoryToGenre(result.categories),
              pageCount: result.pageCount,
              description: result.description,
            });
          }
        }
      }

      setCandidates((prev) => [...prev, ...newCandidates]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [isReady, loading, swipedIds, existingKeys, candidates, convex]);

  const fetchMoreRef = useRef(fetchMore);
  useEffect(() => {
    fetchMoreRef.current = fetchMore;
  }, [fetchMore]);

  // Initial fetch
  useEffect(() => {
    if (isReady && candidates.length === 0 && initialLoad) {
      fetchMoreRef.current();
    }
  }, [isReady, candidates.length, initialLoad]);

  // Auto-fetch more when running low
  useEffect(() => {
    if (isReady && candidates.length < 3 && !loading && !initialLoad) {
      fetchMoreRef.current();
    }
  }, [isReady, candidates.length, loading, initialLoad]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const book = candidates[0];
      if (!book) return;

      const action = direction === "right" ? "liked" : "passed";
      setLastSwipeDirection(direction);
      setLastSwipeAction(action);

      // Remove from stack immediately
      setCandidates((prev) => prev.slice(1));

      // UI feedback timer must not wait on cover hosting
      setTimeout(() => {
        setLastSwipeAction(null);
        setLastSwipeDirection(null);
      }, 1500);

      // Record in background — re-host liked covers so wishlist stays sharp & permanent
      let coverUrl = book.coverUrl || undefined;
      if (action === "liked" && coverUrl) {
        try {
          const stored = await storeCoverImage({
            externalUrl: coverUrl,
            bookTitle: book.title,
          });
          if (stored) coverUrl = stored;
        } catch {
          // keep upgraded hotlink
        }
      }

      await recordSwipe({
        googleBookId: book.googleBookId,
        title: book.title,
        author: book.author,
        coverUrl,
        genre: book.genre,
        pageCount: book.pageCount,
        description: book.description,
        action,
      });
    },
    [candidates, recordSwipe, storeCoverImage]
  );

  // Not enough reading history
  if (profile && profile.totalRead < 3) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">
          Read more to unlock Discover!
        </h2>
        <p className="text-stone-500">
          Mark at least 3 books as read so we can learn your taste and recommend
          books you'll love.
        </p>
        <p className="text-sm text-stone-400 mt-2">
          You've read {profile.totalRead} book{profile.totalRead !== 1 ? "s" : ""} so far.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowOnboarding(false)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
            >
              {/* Header */}
              <div className="bg-primary-600 px-6 py-6 text-center">
                <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ring-white/20">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  How Discover works
                </h2>
                <p className="text-white/85 text-sm mt-1">
                  Find your next read, Izzy
                </p>
              </div>

              {/* Steps */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Swipe Right = Want It!</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Books you like are saved to your wishlist automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Swipe Left = Pass</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Not interested? Swipe left and we won't show it again
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Tap for Details</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tap a book cover to read the full description before deciding
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">Safe for You</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      We only show books that are appropriate for readers your age
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  onClick={() => setShowOnboarding(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  Got it!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-primary-600 shadow-md shadow-primary-600/20 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Discover
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              Swipe right to save books to your wishlist
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            className="w-9 h-9 rounded-full bg-white ring-1 ring-cream-300 hover:ring-primary-300 flex items-center justify-center transition-colors flex-shrink-0"
            title="How Discover works"
          >
            <Info className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        {/* Stats bar */}
        {stats && (stats.liked > 0 || stats.passed > 0) && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-xl bg-white ring-1 ring-cream-300 px-3 py-2.5 text-center">
              <p className="font-display text-lg font-bold text-stone-800 tabular-nums">
                {stats.liked}
              </p>
              <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-primary-500" /> liked
              </p>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-cream-300 px-3 py-2.5 text-center">
              <p className="font-display text-lg font-bold text-stone-800 tabular-nums">
                {stats.passed}
              </p>
              <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
                <X className="w-3 h-3 text-stone-400" /> passed
              </p>
            </div>
            <div className="rounded-xl bg-white ring-1 ring-cream-300 px-3 py-2.5 text-center">
              <p className="font-display text-lg font-bold text-accent-700 tabular-nums">
                {stats.addedToWishlist}
              </p>
              <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
                <Gift className="w-3 h-3 text-accent-600" /> wishlist
              </p>
            </div>
          </div>
        )}

        {/* Reading taste pills */}
        {profile && profile.topGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-stone-400 self-center">Your taste:</span>
            {profile.topGenres.slice(0, 4).map((genre: string) => (
              <span
                key={genre}
                className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold ring-1 ring-primary-100"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Swipe toast */}
      <AnimatePresence>
        {lastSwipeAction && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-sm font-semibold ring-1 ${
              lastSwipeAction === "liked"
                ? "bg-primary-600 text-white ring-primary-500"
                : "bg-white text-stone-600 ring-cream-300"
            }`}
          >
            {lastSwipeAction === "liked" ? (
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" /> Added to wishlist!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <X className="w-4 h-4" /> Passed
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack */}
      <div className="relative w-full" style={{ height: "540px" }}>
        {loading && candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
            <p className="text-stone-500 font-medium">
              Finding books for you...
            </p>
            <p className="text-sm text-stone-400 mt-1">
              Analysing your reading taste
            </p>
          </div>
        ) : candidates.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-bold text-stone-700 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-stone-500 mb-6 max-w-xs">
              We've run out of recommendations for now. Refresh to discover more.
            </p>
            <Button
              onClick={() => {
                queryIndexRef.current++;
                fetchMore();
              }}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Find more books
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {candidates.slice(0, 3).map((book, index) => (
              <SwipeCard
                key={book.googleBookId}
                book={book}
                onSwipe={handleSwipe}
                isTop={index === 0}
                stackIndex={index}
                exitDirection={index === 0 ? lastSwipeDirection : null}
                onClick={() => {
                  setModalImageError(false);
                  setSelectedBook(book);
                }}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Hint */}
      {candidates.length > 0 && (
        <div className="text-center mt-4 space-y-1">
          <p className="text-xs text-stone-400 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Pass
            </span>
            <span className="text-stone-300">|</span>
            <span className="flex items-center gap-1">
              Want it <ArrowRight className="w-3 h-3" />
            </span>
          </p>
          <p className="text-[10px] text-stone-400">
            Books you like go straight to your wishlist
          </p>
        </div>
      )}

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
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {/* Cover */}
              <div className="relative h-64 flex items-center justify-center p-6"
                style={{
                  background:
                    "linear-gradient(165deg, #fdf2f8 0%, #fff7eb 45%, #ccfbf1 100%)",
                }}
              >
                {selectedBook.coverUrl && !modalImageError ? (
                  <img
                    src={upgradeCoverUrl(selectedBook.coverUrl)}
                    alt={selectedBook.title}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-56 w-auto object-contain rounded shadow-xl"
                    onError={() => setModalImageError(true)}
                  />
                ) : (
                  <div className="h-56 w-40 bg-white/60 rounded flex flex-col items-center justify-center p-4 text-center">
                    <BookOpen className="w-12 h-12 text-stone-400 mb-2" />
                    <span className="text-sm font-semibold text-stone-500 line-clamp-3">
                      {selectedBook.title}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-cream-100 rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-stone-800 mb-1">{selectedBook.title}</h2>
                <p className="text-stone-500 mb-4">by {selectedBook.author}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedBook.genre && selectedBook.genre !== "Other" && (
                    <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                      {selectedBook.genre}
                    </span>
                  )}
                  {selectedBook.pageCount && selectedBook.pageCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                      {selectedBook.pageCount} pages
                    </span>
                  )}
                </div>

                {selectedBook.description && (
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {(() => {
                        const doc = new DOMParser().parseFromString(selectedBook.description, "text/html");
                        return doc.body.textContent || "";
                      })()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setSelectedBook(null);
                      handleSwipe("left");
                    }}
                    icon={<X className="w-4 h-4" />}
                  >
                    Pass
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setSelectedBook(null);
                      handleSwipe("right");
                    }}
                    icon={<Heart className="w-4 h-4" />}
                  >
                    Want it
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Discover;
