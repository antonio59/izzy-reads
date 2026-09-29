import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  BookOpen,
  X,
  Share2,
  Check,
  ShoppingBag,
  Copy,
  Link2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBooks } from "../contexts/BookContext";
import { genreLabel } from "../i18n/format";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Book } from "../types";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { SuggestionFormModal } from "./SuggestionFormModal";
import { Input } from "./ui/Input";
import { BookCoverImage } from "./ui/BookCoverImage";
import { PageMeta } from "./PageMeta";
import { absoluteUrl, pageMeta } from "../lib/seo";

const PublicWishlist = () => {
  const { wishlist, isLoading } = useBooks();
  const { prefersReducedMotion } = useMotionPreference();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [buyingBookId, setBuyingBookId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [showSharePanel, setShowSharePanel] = useState(false);
  const markAsBought = useMutation(api.wishlist.markAsBought);
  const { t, i18n } = useTranslation();

  const wishlistUrl = absoluteUrl("/my-wishlist");

  const copyWishlistLink = async () => {
    try {
      await navigator.clipboard.writeText(wishlistUrl);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = wishlistUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setShareStatus("copied");
    setTimeout(() => setShareStatus("idle"), 2200);
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      setShowSharePanel(true);
      return;
    }
    try {
      await navigator.share({
        title: pageMeta.wishlist.title,
        text: pageMeta.wishlist.description,
        url: wishlistUrl,
      });
    } catch {
      // Cancelled or unsupported – open copy panel instead
      setShowSharePanel(true);
    }
  };

  const handleMarkAsBought = async (bookId: string) => {
    if (!buyerName.trim()) {
      setBuyError(t("wishlist.enterNameError"));
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await markAsBought({ id: bookId as any, boughtBy: buyerName.trim() });
      setBuySuccess(true);
      setTimeout(() => {
        setBuyingBookId(null);
        setBuyerName("");
        setBuyError("");
        setBuySuccess(false);
      }, 2000);
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : t("common.somethingWrong"));
    }
  };

  const sortedWishlist = [...wishlist].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const totalPages = wishlist.reduce(
    (sum, book) => sum + (book.pageCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <PageMeta
        title={pageMeta.wishlist.title}
        description={pageMeta.wishlist.description}
        path="/my-wishlist"
      />

      <PublicNav />

      {/* Hero – matches home/reviews language */}
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
              {t("wishlist.eyebrow")}
            </p>
            <h1 className="font-accent text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.05] mb-3">
              {t("nav.wishlist")}
            </h1>
            <p className="text-base text-stone-500 max-w-md mx-auto leading-relaxed">
              {t("wishlist.intro")}
            </p>

            {wishlist.length > 0 && (
              <p className="mt-5 text-sm text-stone-500">
                <span className="font-display font-bold text-stone-700 tabular-nums">
                  {wishlist.length}
                </span>{" "}
                {t("wishlist.booksLabel", { count: wishlist.length })}
                {totalPages > 0 && (
                  <>
                    {" · "}
                    <span className="font-display font-bold text-stone-700 tabular-nums">
                      {totalPages.toLocaleString(i18n.language)}
                    </span>{" "}
                    {t("wishlist.pagesLabel", { count: totalPages })}
                  </>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-5">
              <motion.button
                type="button"
                onClick={() => setShowSuggestionForm(true)}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
              >
                <Gift className="w-4 h-4" />
                {t("wishlist.suggestBook")}
              </motion.button>
              <button
                type="button"
                onClick={() => setShowSharePanel((open) => !open)}
                className="inline-flex items-center gap-2 px-5 py-3 text-stone-600 hover:text-primary-700 font-display font-semibold text-sm transition-colors"
                aria-expanded={showSharePanel}
              >
                <Share2 className="w-4 h-4" />
                {t("wishlist.share")}
              </button>
            </div>

            <AnimatePresence>
              {showSharePanel && (
                <motion.div
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
                  }
                  className="mt-5 mx-auto max-w-md text-left rounded-2xl border border-cream-300 bg-white/90 backdrop-blur-sm p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    {t("wishlist.link")}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={wishlistUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm text-stone-700 font-mono truncate"
                      aria-label={t("wishlist.linkLabel")}
                    />
                    <button
                      type="button"
                      onClick={copyWishlistLink}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-display font-bold transition-colors shrink-0"
                    >
                      {shareStatus === "copied" ? (
                        <>
                          <Check className="w-4 h-4" />
                          {t("common.copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t("common.copy")}
                        </>
                      )}
                    </button>
                  </div>
                  {"share" in navigator && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-cream-300 text-stone-600 hover:text-primary-700 hover:border-primary-200 text-sm font-display font-semibold transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      {t("wishlist.shareDevice")}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Wishlist grid */}
      <section className="py-10 sm:py-12 px-4 flex-1">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div
              className="grid gap-5 sm:gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] rounded-xl bg-stone-200 animate-pulse" />
                  <div className="mt-3 h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
                  <div className="mt-1.5 h-3 w-1/2 bg-stone-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : sortedWishlist.length > 0 ? (
            <motion.div
              className="grid gap-5 sm:gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: prefersReducedMotion
                    ? { duration: 0 }
                    : { staggerChildren: 0.04, delayChildren: 0.05 },
                },
              }}
            >
              {sortedWishlist.map((book) => (
                <motion.button
                  key={book.id}
                  type="button"
                  className="group text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl"
                  variants={{
                    hidden: prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 320, damping: 26 },
                    },
                  }}
                  onClick={() => setSelectedBook(book)}
                  aria-label={book.boughtBy ? t("wishlist.bookBought", { title: book.title, author: book.author }) : t("shelf.book", { title: book.title, author: book.author })}
                >
                  <motion.div
                    className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 group-focus-visible:ring-primary-400 transition-shadow"
                    whileHover={
                      prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.98 }
                    }
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <BookCoverImage book={book} className="w-full h-full" />

                    {book.boughtBy ? (
                      <div className="absolute inset-0 bg-green-900/55 flex flex-col items-center justify-center px-2">
                        <div className="bg-green-500 rounded-full p-1.5 mb-1.5 shadow">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white text-xs font-bold">
                          {t("wishlist.bought")}
                        </span>
                        <span className="text-white/80 text-xs mt-0.5 text-center line-clamp-1">
                          {t("wishlist.byBuyer", { name: book.boughtBy })}
                        </span>
                      </div>
                    ) : (
                      <span className="absolute top-2 left-2 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
                        <Gift className="w-3.5 h-3.5 text-white" aria-hidden />
                      </span>
                    )}
                  </motion.div>

                  <div className="mt-3 px-0.5">
                    <p className="font-display font-bold text-sm text-stone-800 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {book.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }
              className="text-center py-16 px-4"
            >
              <Gift className="w-12 h-12 text-primary-300 mx-auto mb-4" aria-hidden />
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                {t("wishlist.emptyTitle")}
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
                {t("wishlist.emptyText")}
              </p>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
                {t("wishlist.emptyTip")}
              </p>
              <button
                type="button"
                onClick={() => setShowSuggestionForm(true)}
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
              >
                <Gift className="w-4 h-4" />
                {t("wishlist.suggestBook")}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Book detail modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : undefined}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={
                prefersReducedMotion ? false : { scale: 0.95, y: 24 }
              }
              animate={{ scale: 1, y: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 0 } : { scale: 0.95, y: 24 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 28 }
              }
              role="dialog"
              aria-modal="true"
              aria-labelledby="wishlist-book-title"
            >
              <div className="relative h-64 sm:h-72 bg-cream-100 flex items-center justify-center p-6">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 40% 0%, rgba(217,70,168,0.08), transparent 55%), radial-gradient(ellipse at 70% 100%, rgba(13,148,136,0.08), transparent 50%)",
                  }}
                />
                <div className="relative h-52 w-36 shadow-xl rounded-md overflow-hidden ring-1 ring-cream-300">
                  <BookCoverImage
                    book={selectedBook}
                    className="w-full h-full"
                  />
                </div>

                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-primary-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                  <Gift className="w-3.5 h-3.5" aria-hidden />
                  {t("wishlist.onWishlist")}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-cream-100 rounded-full flex items-center justify-center shadow-md transition-colors"
                  aria-label={t("common.close")}
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              <div className="p-6">
                <h2
                  id="wishlist-book-title"
                  className="text-2xl font-display font-bold text-stone-800 mb-1"
                >
                  {selectedBook.title}
                </h2>
                <p className="text-stone-500 mb-4">{t("common.byAuthor", { author: selectedBook.author })}</p>

                <div className="flex flex-wrap gap-2 mb-6 text-sm text-stone-500">
                  {selectedBook.genre && (
                    <span className="px-3 py-1 rounded-full bg-accent-50 text-accent-700 font-medium">
                      {genreLabel(t, selectedBook.genre)}
                    </span>
                  )}
                  {selectedBook.pageCount != null &&
                    selectedBook.pageCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cream-200 text-stone-600 font-medium">
                        <BookOpen className="w-3.5 h-3.5" aria-hidden />
                        {t("shelf.pages", { count: selectedBook.pageCount })}
                      </span>
                    )}
                  {selectedBook.ageRating && (
                    <span className="px-3 py-1 rounded-full bg-cream-200 text-stone-600 font-medium">
                      {selectedBook.ageRating}
                    </span>
                  )}
                </div>

                {(selectedBook.notes || selectedBook.description) && (
                  <div className="mb-6">
                    <h3 className="font-display font-bold text-stone-800 mb-2 text-sm">
                      {t("wishlist.whyRead")}
                    </h3>
                    <p className="text-stone-600 leading-relaxed italic font-serif">
                      &ldquo;
                      {selectedBook.notes || selectedBook.description}
                      &rdquo;
                    </p>
                  </div>
                )}

                {!selectedBook.notes && !selectedBook.description && (
                  <p className="text-stone-500 italic text-center mb-6 text-sm">
                    {t("wishlist.looksAmazing")}
                  </p>
                )}

                <div className="pt-4 border-t border-cream-200">
                  {selectedBook.boughtBy ? (
                    <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="bg-green-500 rounded-full p-2">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-green-700 font-semibold text-sm">
                          {t("wishlist.someoneGotIt")}
                        </p>
                        <p className="text-green-600 text-xs">
                          {t("wishlist.boughtBy", { name: selectedBook.boughtBy })}
                        </p>
                      </div>
                    </div>
                  ) : buyingBookId === selectedBook.id ? (
                    <div className="space-y-3">
                      {buySuccess ? (
                        <div className="flex items-center gap-2 justify-center bg-green-50 rounded-xl p-4">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 font-semibold">
                            {t("wishlist.thankYou")}
                          </span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-stone-500 text-center">
                            {t("wishlist.enterNamePrompt")}
                          </p>
                          <Input
                            type="text"
                            value={buyerName}
                            onChange={(e) => {
                              setBuyerName(e.target.value);
                              setBuyError("");
                            }}
                            placeholder={t("wishlist.yourName")}
                            size="sm"
                            className="rounded-lg"
                            autoFocus
                          />
                          {buyError && (
                            <p className="text-red-500 text-xs">{buyError}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleMarkAsBought(selectedBook.id)
                              }
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
                            >
                              <Check className="w-4 h-4" />
                              {t("common.confirm")}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBuyingBookId(null);
                                setBuyerName("");
                                setBuyError("");
                              }}
                              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors text-sm"
                            >
                              {t("common.cancel")}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setBuyingBookId(selectedBook.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-display font-bold rounded-xl shadow-md shadow-primary-600/20 transition-colors text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {t("wishlist.iBoughtThis")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuggestionFormModal
        isOpen={showSuggestionForm}
        onClose={() => setShowSuggestionForm(false)}
        recipientName="Izzy"
      />

      <PublicFooter />
    </div>
  );
};

export default PublicWishlist;
