/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  Heart,
  X,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Loader2,
} from "lucide-react";
import SwipeCard from "./SwipeCard";

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
  const convex = useConvex();

  const [candidates, setCandidates] = useState<BookCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastSwipeAction, setLastSwipeAction] = useState<"liked" | "passed" | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookCandidate | null>(null);
  const [modalImageError, setModalImageError] = useState(false);
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
            result.title !== "Unknown Title"
          ) {
            newCandidates.push({
              googleBookId: result.googleBookId,
              title: result.title,
              author: result.author,
              coverUrl: result.coverUrl,
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

  // Initial fetch
  useEffect(() => {
    if (isReady && candidates.length === 0 && initialLoad) {
      fetchMore();
    }
  }, [isReady, candidates.length, initialLoad, fetchMore]);

  // Auto-fetch more when running low
  useEffect(() => {
    if (isReady && candidates.length < 3 && !loading && !initialLoad) {
      fetchMore();
    }
  }, [isReady, candidates.length, loading, initialLoad, fetchMore]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const book = candidates[0];
      if (!book) return;

      const action = direction === "right" ? "liked" : "passed";
      setLastSwipeAction(action);

      // Remove from stack immediately
      setCandidates((prev) => prev.slice(1));

      // Record in background
      await recordSwipe({
        googleBookId: book.googleBookId,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        genre: book.genre,
        pageCount: book.pageCount,
        description: book.description,
        action,
      });

      setTimeout(() => setLastSwipeAction(null), 1500);
    },
    [candidates, recordSwipe]
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Discover</h1>
            <p className="text-sm text-stone-500">
              Swipe to find your next read
            </p>
          </div>
        </div>

        {/* Stats bar */}
        {stats && (stats.liked > 0 || stats.passed > 0) && (
          <div className="flex items-center gap-4 mt-4 px-4 py-3 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-1.5 text-sm">
              <Heart className="w-4 h-4 text-green-500" />
              <span className="font-medium text-stone-700">{stats.liked}</span>
              <span className="text-stone-400">liked</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <X className="w-4 h-4 text-red-400" />
              <span className="font-medium text-stone-700">{stats.passed}</span>
              <span className="text-stone-400">passed</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <span className="font-medium text-stone-700">
                {stats.addedToWishlist}
              </span>
              <span className="text-stone-400">wishlisted</span>
            </div>
          </div>
        )}

        {/* Reading taste pills */}
        {profile && profile.topGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-stone-400 self-center">Based on:</span>
            {profile.topGenres.slice(0, 4).map((genre: string) => (
              <span
                key={genre}
                className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium"
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
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-sm font-medium ${
              lastSwipeAction === "liked"
                ? "bg-green-500 text-white"
                : "bg-stone-500 text-white"
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
      <div className="relative w-full" style={{ height: "520px" }}>
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
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-lg font-bold text-stone-700 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-stone-500 mb-6 max-w-xs">
              We've run out of recommendations for now. Refresh to discover more.
            </p>
            <button
              onClick={() => {
                queryIndexRef.current++;
                fetchMore();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Find more books
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {candidates.slice(0, 3).map((book, index) => (
              <SwipeCard
                key={book.googleBookId}
                book={book}
                onSwipe={handleSwipe}
                isTop={index === 0}
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
        <p className="text-center text-xs text-stone-400 mt-4">
          Swipe or use the buttons. Right = want it, Left = pass.
        </p>
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
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              {/* Cover */}
              <div className="relative h-64 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center p-6">
                {selectedBook.coverUrl && !modalImageError ? (
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="h-56 w-auto object-contain rounded shadow-2xl"
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
                  <button
                    onClick={() => {
                      setSelectedBook(null);
                      handleSwipe("left");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-semibold transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Pass
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBook(null);
                      handleSwipe("right");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-semibold transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Want it
                  </button>
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
