import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Book,
  PenTool,
  MessageSquare,
  Gift,
  ArrowRight,
  Sparkles,
  BookOpen,
  Star,
  User,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import FunBookshelfPublic from "./FunBookshelfPublic";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { Card } from "./ui/Card";
import { WritingReactionButtons } from "./ReactionButtons";
import { Badge } from "./ui/Badge";
import { BookCoverImage } from "./ui/BookCoverImage";

type TabId = "reviews" | "poems" | "blog" | "wishlist";

const PublicPortfolio = () => {
  const { books, poems, blogPosts, wishlist, isLoading } = useBooks();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabId>("reviews");

  // Default avatar config
  const defaultAvatar: AvatarConfig = {
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

  const userAvatar = user?.avatar || defaultAvatar;

  const readBooks = books.filter((book) => book.isRead);
  const publishedPosts = blogPosts.filter(
    (post) => post.status === "published",
  );

  // Get featured picks (top rated books)
  const featuredBooks = [...readBooks]
    .filter((b) => b.rating && b.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  // Get latest poems
  const latestPoems = [...poems]
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <PublicNav />
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-12 space-y-8">
          {/* Hero skeleton */}
          <Card variant="elevated" padding="none" className="p-5 md:p-6 border border-cream-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-48 bg-stone-100 rounded animate-pulse" />
              </div>
            </div>
          </Card>
          {/* Stats skeleton */}
          <Card variant="elevated" padding="none" className="border border-cream-300 p-5 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 mx-auto animate-pulse" />
                  <div className="h-6 w-12 bg-stone-100 rounded mx-auto animate-pulse" />
                  <div className="h-3 w-16 bg-stone-100 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </Card>
          {/* Sections skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-40 bg-stone-100 rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-xl bg-stone-100 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Navigation */}
      <PublicNav />

      {/* Hero Section with Avatar */}
      <section className="relative overflow-hidden bg-cream-100 pt-6 pb-6 md:pt-8 md:pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <Card
            variant="elevated"
            padding="none"
            className="p-5 md:p-6 border border-cream-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar - properly sized */}
              <div className="flex-shrink-0 shadow-lg ring-2 ring-primary-100 rounded-full overflow-hidden">
                <AvatarPreview config={userAvatar} size="md" />
              </div>

              {/* Hero Content */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-stone-800">
                  Hi, I'm Izzy! 👋
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5 line-clamp-2">
                  Welcome to my bookshelf - reviews, poems & bookish adventures
                </p>
              </div>

              {/* Action Buttons - Enhanced CTAs (desktop only) */}
              <div className="flex-shrink-0 hidden lg:flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab("reviews");
                    setTimeout(() => {
                      document
                        .getElementById("reviews-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <Star className="w-5 h-5" />
                  Read My Reviews
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-700 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all border border-stone-200"
                >
                  <User className="w-5 h-5" />
                  Learn About Izzy
                </motion.a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Reading Stats Card */}
      <section className="py-6 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4">
          <Card
            variant="elevated"
            padding="none"
            className="border border-cream-300 p-5 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cream-200">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display font-bold text-stone-700">
                Reading Stats
              </h3>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Books Read */}
              <div className="text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Book className="w-5 h-5 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-stone-800">
                  {readBooks.length}
                </p>
                <p className="text-xs text-stone-500 font-medium">Books Read</p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-cream-300" />
                {/* Pages Read */}
                <div className="text-center">
                  <div className="w-10 h-10 bg-star-light rounded-xl flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-5 h-5 text-star" />
                  </div>
                  <p className="text-2xl font-bold text-stone-800">
                    {readBooks
                      .reduce((sum, b) => sum + (b.pageCount || 0), 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-500 font-medium">
                    Pages Read
                  </p>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-cream-300" />
              </div>

              {/* Total Reviews */}
              <div className="text-center">
                <Link to="/reviews" className="block group">
                  <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-accent-200 transition-colors">
                    <Star className="w-5 h-5 text-accent-500" />
                  </div>
                  <p className="text-2xl font-bold text-stone-800 group-hover:text-accent-600 transition-colors">
                    {books.filter((b) => b.isRead && (b.notes || b.review)).length}
                  </p>
                  <p className="text-xs text-stone-500 font-medium">
                    Reviews
                  </p>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        {/* Izzy's Picks - Special Section */}
        {featuredBooks.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-star-light rounded-xl flex items-center justify-center shadow-md border border-star/20">
                  <span className="text-3xl">⭐</span>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800">
                    Izzy's Picks
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {Math.min(3, featuredBooks.length)} of my absolute
                    favourites
                  </p>
                </div>
              </div>
            </div>

            <FunBookshelfPublic
              books={featuredBooks.slice(0, 3)}
              showFilters={false}
            />
          </section>
        )}

        {/* Featured Poem */}
        {latestPoems.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center shadow-sm">
                  <PenTool className="w-7 h-7 text-accent-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-800">
                    Latest Poem
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Writing from my heart
                  </p>
                </div>
              </div>
              <Link
                to="/poetry"
                className="flex items-center gap-2 text-primary-500 font-semibold text-sm hover:text-primary-600 transition-colors"
              >
                See all poems <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <Card variant="default" padding="lg" className="border border-cream-300 shadow-sm">
              <div className="max-w-lg mx-auto text-center">
                <h3 className="text-xl font-bold text-stone-700 mb-4">
                  {latestPoems[0].title}
                </h3>
                <p className="text-stone-500 whitespace-pre-line leading-relaxed italic">
                  {latestPoems[0].content.length > 200
                    ? latestPoems[0].content.slice(0, 200) + "..."
                    : latestPoems[0].content}
                </p>
                {latestPoems[0].emoji && (
                  <span className="inline-block text-3xl mt-4">
                    {latestPoems[0].emoji}
                  </span>
                )}
                <Link
                  to={`/poetry/${latestPoems[0].slug || latestPoems[0].id}`}
                  className="block mt-4 text-primary-500 font-medium hover:text-primary-600"
                >
                  Read full poem →
                </Link>
              </div>
            </Card>
          </section>
        )}

        {/* Tab Content */}
        <div id="tab-content" className="scroll-mt-20" />
        {activeTab === "reviews" && (
          <section id="reviews-section" className="mb-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen className="w-7 h-7 text-primary-500" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800">
                  Books I've Read
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {readBooks.length} books · Tap a cover to see more!
                </p>
              </div>
            </div>

            {readBooks.length > 0 ? (
              <FunBookshelfPublic books={readBooks} />
            ) : (
              <EmptyState
                icon="📚"
                title="Reviews Coming Soon!"
                message="Izzy is reading some amazing books and can't wait to share her thoughts!"
              />
            )}
          </section>
        )}

        {activeTab === "poems" && poems.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center shadow-sm">
                  <PenTool className="w-7 h-7 text-accent-500" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800">
                    My Poetry
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {poems.length} {poems.length === 1 ? "poem" : "poems"}{" "}
                    written from my heart
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {latestPoems.map((poem, index) => (
                <Card
                  key={poem.id}
                  variant="elevated"
                  padding="none"
                  className="hover:shadow-lg transition-all border border-cream-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-5">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl">{poem.emoji || "✨"}</span>
                      <span className="text-sm text-white/80 bg-white/20 px-3 py-1 rounded-full">
                        {new Date(poem.dateCreated).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mt-3">
                      {poem.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-stone-600 whitespace-pre-wrap leading-relaxed text-lg font-serif italic">
                      {poem.content}
                    </p>
                    <div className="flex items-center gap-4 mt-5 pt-5 border-t border-cream-200">
                      {poem.template && (
                        <Badge variant="accent" size="md">
                          {poem.template}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeTab === "blog" && publishedPosts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center shadow-sm">
                <MessageSquare className="w-7 h-7 text-accent-500" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800">
                  My Writing
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Thoughts about reading and life
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {publishedPosts.map((post, index) => (
                <Card
                  key={post.id}
                  variant="elevated"
                  padding="lg"
                  className="hover:shadow-lg transition-all border border-cream-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-5 mb-5">
                    {post.emoji && (
                      <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-3xl">{post.emoji}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-display font-bold text-stone-700">
                        {post.title}
                      </h3>
                      <p className="text-stone-500">
                        {new Date(post.dateCreated).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-500 leading-relaxed text-lg">
                    {post.content}
                  </p>
                  <div className="mt-6 pt-6 border-t border-cream-200">
                    <WritingReactionButtons postId={post.id} />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeTab === "wishlist" && wishlist.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center shadow-sm">
                <Gift className="w-7 h-7 text-primary-500" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800">
                  My Wishlist
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {wishlist.length} books I'd love to read next!
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {wishlist.map((book, index) => (
                <Card
                  key={book.id}
                  variant="default"
                  padding="sm"
                  className="shadow-sm hover:shadow-md transition-all border border-cream-300 flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-2xl">🎁</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-stone-700">
                      {book.title}{" "}
                      <span className="font-normal text-stone-500">
                        – {book.author}
                      </span>
                    </p>
                    {book.notes && (
                      <p className="text-sm text-stone-500 mt-1">
                        I want to read this because: {book.notes}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Poem Slider Section */}
      {poems.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-violet-50 via-white to-rose-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                  <PenTool className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-800">
                    My Poetry
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Words from my heart
                  </p>
                </div>
              </div>
              <Link
                to="/poetry"
                className="flex items-center gap-2 text-primary-500 font-semibold text-sm hover:text-primary-600 transition-colors"
              >
                See all poems <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Horizontal Scrolling Poems */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
                {[...poems]
                  .sort(
                    (a, b) =>
                      new Date(b.dateCreated).getTime() -
                      new Date(a.dateCreated).getTime(),
                  )
                  .slice(0, 6)
                  .map((poem, index) => (
                    <motion.div
                      key={poem.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex-shrink-0 w-72 snap-start"
                    >
                      <Link
                        to={`/poetry/${poem.slug || poem.id}`}
                        className="block group"
                      >
                        <Card
                          variant="elevated"
                          padding="none"
                          className="hover:shadow-xl transition-all duration-300 border border-stone-100 hover:-translate-y-1"
                        >
                        {/* Poem Header */}
                        <div
                          className={`h-28 bg-gradient-to-br ${
                            [
                              "from-violet-100 via-purple-50 to-fuchsia-100",
                              "from-sky-100 via-cyan-50 to-teal-100",
                              "from-amber-100 via-yellow-50 to-orange-100",
                              "from-emerald-100 via-green-50 to-teal-100",
                              "from-rose-100 via-pink-50 to-fuchsia-100",
                              "from-indigo-100 via-blue-50 to-violet-100",
                            ][index % 6]
                          } flex items-center justify-center relative`}
                        >
                          <motion.span
                            className="text-5xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {poem.emoji || "✨"}
                          </motion.span>
                          {poem.template && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-stone-600">
                              {poem.template}
                            </span>
                          )}
                        </div>

                        {/* Poem Content */}
                        <div className="p-4">
                          <h3 className="font-display font-bold text-stone-800 mb-2 group-hover:text-violet-600 transition-colors line-clamp-1">
                            {poem.title}
                          </h3>
                          <p className="text-stone-500 font-serif italic text-sm line-clamp-3 leading-relaxed">
                            {poem.content}
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                            <span className="text-xs text-stone-500">
                              {new Date(poem.dateCreated).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </div>
                        </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
              {/* Scroll hint gradient */}
              <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-violet-50/80 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      {/* Wishlist Preview Section */}
      {wishlist.length > 0 && (
        <section className="py-16 bg-cream-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Gift className="w-7 h-7 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-800">
                    My Wishlist
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Books I can't wait to read!
                  </p>
                </div>
              </div>
              <Link
                to="/my-wishlist"
                className="flex items-center gap-2 text-primary-500 font-semibold text-sm hover:text-primary-600 transition-colors"
              >
                See all {wishlist.length} books{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Wishlist Book Covers Grid */}
            <div
              className="grid gap-4 sm:gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              }}
            >
              {wishlist.slice(0, 6).map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to="/my-wishlist" className="block group">
                      <motion.div
                        className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md ring-1 ring-cream-300 group-hover:ring-primary-400 transition-all duration-300"
                        whileHover={{
                          y: -8,
                          scale: 1.02,
                          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <BookCoverImage
                          book={book}
                          className="w-full h-full"
                          fallbackEmoji="🎁"
                        />

                        {/* Wishlist badge */}
                        <div className="absolute top-2 left-2 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                          <Gift className="w-3.5 h-3.5 text-white" />
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-white text-xs font-semibold leading-tight line-clamp-2 drop-shadow-lg">
                            {book.title}
                          </p>
                          <p className="text-white/70 text-xs mt-1">
                            {book.author}
                          </p>
                        </div>

                        {/* Sparkle on hover */}
                        <div className="absolute top-2 right-2 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          ✨
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
              ))}
            </div>

            {wishlist.length > 6 && (
              <div className="text-center mt-8">
                <Link
                  to="/my-wishlist"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-500 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all border border-cream-300 hover:border-primary-200"
                >
                  <Sparkles className="w-4 h-4" />
                  See {wishlist.length - 6} more books I want to read
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <PublicFooter />

      {/* Add wave animation keyframes */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
      `}</style>
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
    <Card variant="default" padding="none" className="text-center py-20 border border-cream-300">
      <div className="w-24 h-24 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
        <span className="text-5xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-display font-bold text-stone-700 mb-2">
        {title}
      </h3>
      <p className="text-stone-500 text-lg">{message}</p>
    </Card>
  );
}

export default PublicPortfolio;
