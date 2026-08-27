import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PenTool, Gift, ArrowRight, BookOpen } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import FunBookshelfPublic from "./FunBookshelfPublic";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { BookCoverImage } from "./ui/BookCoverImage";
import { PageMeta } from "./PageMeta";
import { CurrentlyReadingStrip } from "./CurrentlyReadingStrip";
import { pageMeta } from "../lib/seo";
import type { Book } from "../types";
import { isLikelyInvalidCover } from "../lib/coverUrl";

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

function scrollToShelf() {
  document
    .getElementById("bookshelf")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Full-bleed overlapping cover shelf for the hero */
function HeroCoverShelf({
  books,
  reducedMotion,
}: {
  books: Book[];
  reducedMotion: boolean;
}) {
  if (books.length === 0) {
    return (
      <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/80 via-cream-200 to-accent-100/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-primary-300" aria-hidden />
        </div>
      </div>
    );
  }

  const display = books.slice(0, 7);
  const mid = (display.length - 1) / 2;

  return (
    <div
      className="relative h-52 sm:h-72 md:h-80 lg:h-[22rem] w-full overflow-hidden"
      aria-hidden={false}
      role="img"
      aria-label="A shelf of Izzy's favourite book covers"
    >
      {/* Atmospheric wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 via-cream-100 to-accent-50/30" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(217,70,168,0.12), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(13,148,136,0.14), transparent 45%)",
        }}
      />

      {/* Shelf shadow line */}
      <div className="absolute bottom-6 left-0 right-0 h-3 bg-gradient-to-b from-stone-900/10 to-transparent blur-sm" />

      <div className="absolute inset-0 flex items-end justify-center px-2 sm:px-6 pb-8">
        <div className="flex items-end justify-center -space-x-6 sm:-space-x-8 md:-space-x-10">
          {display.map((book, i) => {
            const offset = i - mid;
            const rotate = offset * 4;
            const y = Math.abs(offset) * 8;
            const z = 20 - Math.abs(offset);

            return (
              <motion.div
                key={book.id}
                className="relative w-[4.5rem] sm:w-24 md:w-28 lg:w-32 aspect-[2/3] rounded-md overflow-hidden shadow-xl ring-1 ring-white/60"
                style={{ zIndex: z }}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 48, rotate: rotate * 1.4 }
                }
                animate={{
                  opacity: 1,
                  y,
                  rotate,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 220,
                        damping: 22,
                        delay: 0.15 + i * 0.06,
                      }
                }
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: y - 14, scale: 1.06, rotate: 0, zIndex: 40 }
                }
              >
                <BookCoverImage book={book} className="w-full h-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PublicPortfolio = () => {
  const { books, poems, wishlist, isLoading } = useBooks();
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();

  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  const readBooks = useMemo(
    () => books.filter((book) => book.isRead),
    [books],
  );

  const booksWithCovers = useMemo(
    () => readBooks.filter((b) => !isLikelyInvalidCover(b.coverUrl)),
    [readBooks],
  );

  const featuredBooks = useMemo(
    () =>
      [...booksWithCovers]
        .filter((b) => b.rating && b.rating >= 4)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6),
    [booksWithCovers],
  );

  const heroCovers = useMemo(() => {
    // Prefer rated covers; never put blank placeholders in the hero fan
    const picks = featuredBooks.length > 0 ? featuredBooks : booksWithCovers;
    return picks.slice(0, 7);
  }, [featuredBooks, booksWithCovers]);

  const latestPoem = useMemo(() => {
    if (poems.length === 0) return null;
    return [...poems].sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    )[0];
  }, [poems]);

  const reviewCount = useMemo(
    () => books.filter((b) => b.isRead && (b.notes || b.review)).length,
    [books],
  );

  const pagesRead = useMemo(
    () => readBooks.reduce((sum, b) => sum + (b.pageCount || 0), 0),
    [readBooks],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <PublicNav />
        <div className="pt-10 pb-8 px-4 text-center space-y-4">
          <div className="h-10 w-64 bg-stone-100 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-80 max-w-full bg-stone-100 rounded mx-auto animate-pulse" />
          <div className="h-11 w-40 bg-stone-100 rounded-xl mx-auto animate-pulse" />
        </div>
        <div className="h-64 sm:h-80 bg-cream-200/60 animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 pt-12 space-y-6">
          <div className="h-8 w-40 bg-stone-100 rounded animate-pulse" />
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-xl bg-stone-100 animate-pulse"
              />
            ))}
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <PageMeta
        title={pageMeta.home.title}
        description={pageMeta.home.description}
        path="/"
      />
      <PublicNav />

      {/* ── Hero: one composition — brand, voice, CTA, cover shelf ── */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 sm:pt-14 md:pt-16 pb-6 text-center">
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full overflow-hidden ring-2 ring-primary-100 shadow-md">
                <AvatarPreview config={userAvatar} size="sm" />
              </div>
              <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide">
                Hi, I&apos;m Izzy
              </p>
            </div>

            <h1 className="font-accent text-4xl sm:text-5xl md:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.05]">
              Izzy&apos;s Bookshelf
            </h1>

            <p className="text-base sm:text-lg text-stone-500 max-w-md leading-relaxed">
              Every book I finish lives here — plus reviews, poems, and writing I&apos;m proud of.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <motion.button
                type="button"
                onClick={scrollToShelf}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
              >
                Browse my shelf
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-3 text-stone-600 hover:text-primary-700 font-display font-semibold text-sm transition-colors"
              >
                About me
              </Link>
            </div>
          </motion.div>
        </div>

        <HeroCoverShelf books={heroCovers} reducedMotion={prefersReducedMotion} />
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        <CurrentlyReadingStrip books={books} className="mt-10 sm:mt-12 mb-2" />

        {/* Izzy's Picks */}
        {featuredBooks.length > 0 && (
          <section className="pt-14 sm:pt-20 mb-16 sm:mb-20">
            <header className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-800">
                Izzy&apos;s Picks
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                My absolute favourites right now
              </p>
            </header>
            <FunBookshelfPublic
              books={featuredBooks.slice(0, 3)}
              showFilters={false}
            />
          </section>
        )}

        {/* Bookshelf */}
        <section id="bookshelf" className="mb-16 sm:mb-20 scroll-mt-24">
          <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-800">
                On my shelf
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {readBooks.length} books logged · Tap a cover to peek inside
              </p>
            </div>
            <Link
              to="/reviews"
              className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors"
            >
              Reviews <ArrowRight className="w-4 h-4" />
            </Link>
          </header>

          {readBooks.length > 0 ? (
            <FunBookshelfPublic books={readBooks} />
          ) : (
            <EmptyState
              icon="📚"
              title="Shelf coming soon"
              message="Izzy is reading amazing books and can't wait to share them!"
            />
          )}
        </section>

        {/* Quiet stats — below the fold, not a dashboard card */}
        {readBooks.length > 0 && (
          <section
            className="mb-16 sm:mb-20 py-8 border-y border-cream-300"
            aria-label="Reading stats"
          >
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 sm:gap-x-16 text-center">
              <div>
                <p className="font-display text-3xl font-bold text-stone-800 tabular-nums">
                  {readBooks.length}
                </p>
                <p className="text-xs uppercase tracking-wider text-stone-400 mt-1 font-medium">
                  Books read
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-stone-800 tabular-nums">
                  {pagesRead.toLocaleString()}
                </p>
                <p className="text-xs uppercase tracking-wider text-stone-400 mt-1 font-medium">
                  Pages
                </p>
              </div>
              <Link to="/reviews" className="group">
                <p className="font-display text-3xl font-bold text-stone-800 tabular-nums group-hover:text-primary-600 transition-colors">
                  {reviewCount}
                </p>
                <p className="text-xs uppercase tracking-wider text-stone-400 mt-1 font-medium">
                  Reviews
                </p>
              </Link>
            </div>
          </section>
        )}

        {/* Latest poem */}
        {latestPoem && (
          <section className="mb-16 sm:mb-20">
            <header className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-800">
                  Latest Poem
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Writing from my heart
                </p>
              </div>
              <Link
                to="/poetry"
                className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors shrink-0"
              >
                All poems <ArrowRight className="w-4 h-4" />
              </Link>
            </header>

            <Link
              to={`/poetry/${latestPoem.slug || latestPoem.id}`}
              className="block group max-w-2xl mx-auto text-center"
            >
              <div className="flex justify-center mb-4 text-accent-500">
                <PenTool className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-800 group-hover:text-primary-600 transition-colors mb-4">
                {latestPoem.title}
              </h3>
              <p className="text-stone-500 whitespace-pre-line leading-relaxed font-serif italic text-lg">
                {latestPoem.content.length > 220
                  ? `${latestPoem.content.slice(0, 220)}…`
                  : latestPoem.content}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-6 text-primary-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                Read full poem <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </section>
        )}

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <section className="mb-8">
            <header className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-800">
                  Wishlist
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Books I can&apos;t wait to read
                </p>
              </div>
              <Link
                to="/my-wishlist"
                className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors shrink-0"
              >
                See all {wishlist.length}{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </header>

            <div
              className="grid gap-4 sm:gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              }}
            >
              {wishlist.slice(0, 6).map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 16 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { delay: index * 0.04 }
                  }
                >
                  <Link to="/my-wishlist" className="block group">
                    <motion.div
                      className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 transition-all"
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : { y: -6, scale: 1.02 }
                      }
                      whileTap={
                        prefersReducedMotion ? undefined : { scale: 0.98 }
                      }
                    >
                      <BookCoverImage book={book} className="w-full h-full" />
                      <div className="absolute top-2 left-2 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                        <Gift className="w-3.5 h-3.5 text-white" aria-hidden />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                          {book.title}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: string;
  title: string;
  message: string;
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4" aria-hidden>
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-stone-700 mb-2">
        {title}
      </h3>
      <p className="text-stone-500 max-w-md mx-auto">{message}</p>
    </div>
  );
}

export default PublicPortfolio;
