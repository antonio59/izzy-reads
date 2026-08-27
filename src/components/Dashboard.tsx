import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Heart,
  Feather,
  Sparkles,
  Star,
  User,
  BarChart3,
  Activity,
  Library,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { getWeeklyQuote } from "../utils/readingQuotes";
import { Card, StatCard } from "./ui/Card";
import { StreakBadge } from "./ui/Badge";
import { ChallengeProgress } from "./ui/Progress";
import { StaggerContainer, StaggerItem } from "./PageTransition";
import { BookGrid } from "./BookGrid";
import { BookDetailModal } from "./BookDetailModal";
import AvatarCreator, {
  AvatarPreview,
  type AvatarConfig,
} from "./AvatarCreator";
import { ReviewAnalytics } from "./ReviewAnalytics";
import {
  ReadingActivityChart,
  GenrePieChart,
  MostLovedBooks,
  RecentBooks,
  QuickActions,
  WeeklyQuote,
  generateMonthlyData,
  generateGenreData,
} from "./DashboardWidgets";
import { ReadingHeatmap } from "./ReadingHeatmap";
import type { Book } from "../types";
import { ReducedMotionAnimatePresence } from "../contexts/MotionPreferenceContext";

const Dashboard: React.FC = () => {
  const { books, wishlist, readingChallenges, readingStats } = useBooks();
  const reactionStats = useQuery(api.reactions.getAllBookReactionStats);
  const { user, updateUserProfile } = useUser();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  // Get avatar from user profile or use default
  const userAvatar: AvatarConfig = user?.avatar || {
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

  const handleSaveAvatar = async (config: AvatarConfig) => {
    await updateUserProfile({ avatar: config });
    setShowAvatarCreator(false);
  };

  const recentBooks = books
    .filter((book) => book.isRead)
    .sort(
      (a, b) =>
        new Date(b.dateRead || "").getTime() -
        new Date(a.dateRead || "").getTime(),
    )
    .slice(0, 4);

  // Get most loved books from reaction stats
  const mostLovedBooks = useMemo(() => {
    if (!reactionStats?.topBooks) return [];
    return reactionStats.topBooks
      .slice(0, 3)
      .map(({ bookId, count }) => {
        const book = books.find((b) => b.id === bookId);
        return book ? { ...book, reactionCount: count } : null;
      })
      .filter((b): b is Book & { reactionCount: number } => b !== null);
  }, [reactionStats, books]);

  const totalReactions = reactionStats?.totalReactions ?? 0;
  const currentChallenge = readingChallenges[0];

  // Generate chart data
  const monthlyReadingData = generateMonthlyData(books);
  const genreData = generateGenreData(books);

  // Quick actions configuration
  // Kid path first — add, write, discover, series
  const quickActions = [
    {
      to: "/books",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Add or finish a book",
      color: "primary" as const,
    },
    {
      to: "/create",
      icon: <Feather className="w-5 h-5" />,
      label: "Write a poem or post",
      color: "accent" as const,
    },
    {
      to: "/discover",
      icon: <Sparkles className="w-5 h-5" />,
      label: "Discover next reads",
      color: "sage" as const,
    },
    {
      to: "/series",
      icon: <Library className="w-5 h-5" />,
      label: "Track a series",
      color: "primary" as const,
    },
  ];

  const [activeTab, setActiveTab] = useState<"activity" | "insights">(
    "activity",
  );

  const unfinishedCount = books.filter((b) => !b.isRead).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          variant="gradient"
          padding="lg"
          className="relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAvatarCreator(true)}
                className="relative group flex-shrink-0"
              >
                <AvatarPreview config={userAvatar} size="lg" />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Edit</span>
                </div>
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent-500" />
                  <span className="text-sm font-medium text-stone-600">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-900 mb-2">
                  Hi, {user?.name || "Reader"}!
                </h1>
                <p className="text-stone-600 max-w-md">
                  {unfinishedCount > 0 ? (
                    <>
                      You have{" "}
                      <span className="font-semibold text-primary-600">
                        {unfinishedCount} book
                        {unfinishedCount === 1 ? "" : "s"}
                      </span>{" "}
                      in progress — finish one and celebrate!
                    </>
                  ) : readingStats.booksThisMonth === 0 ? (
                    <>Ready for a new adventure? Add a book and start reading.</>
                  ) : (
                    <>
                      You&apos;ve finished{" "}
                      <span className="font-semibold text-primary-600">
                        {readingStats.booksThisMonth}{" "}
                        {readingStats.booksThisMonth === 1 ? "book" : "books"}
                      </span>{" "}
                      this month. Keep going!
                    </>
                  )}
                </p>
                {unfinishedCount > 0 && (
                  <Link
                    to="/books"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary-700 hover:text-primary-800"
                  >
                    Go to My Books →
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StreakBadge days={readingStats.readingStreak} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Kid path — primary actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card padding="lg" className="border border-cream-300">
          <h2 className="font-display font-bold text-stone-900 text-lg mb-1">
            What do you want to do?
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            Log a book, write something, or find your next read.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to!}
                className="flex items-center gap-3 p-4 rounded-xl bg-cream-100 hover:bg-primary-50 border border-cream-300 hover:border-primary-200 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white text-primary-600 shadow-sm group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <span className="font-display font-bold text-sm text-stone-800">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Compact stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <StatCard
            label="Books Read"
            value={readingStats.totalBooks}
            icon={<BookOpen className="w-6 h-6" />}
            color="primary"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Pages Read"
            value={readingStats.totalPages.toLocaleString()}
            icon={<TrendingUp className="w-6 h-6" />}
            color="accent"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Wishlist"
            value={wishlist.length}
            icon={<Heart className="w-6 h-6" />}
            color="sage"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            label="Avg Rating"
            value={
              readingStats.averageRating > 0
                ? readingStats.averageRating.toFixed(1)
                : "—"
            }
            icon={<Star className="w-6 h-6" />}
            color="primary"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card
            variant="default"
            padding="none"
            className="p-1.5 shadow-sm border border-stone-100 flex gap-1"
          >
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "activity"
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Activity className="w-4 h-4" />
              Activity
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "insights"
                  ? "bg-accent-50 text-accent-700 shadow-sm"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Insights
            </button>
          </Card>

          {activeTab === "activity" ? (
            <div className="space-y-6">
              {currentChallenge && (
                <ChallengeProgress
                  title={currentChallenge.title}
                  current={currentChallenge.current}
                  target={currentChallenge.target}
                  icon={currentChallenge.badge}
                  color="accent"
                  dueDate={currentChallenge.endDate}
                />
              )}

              <Card padding="lg" className="border border-cream-300">
                <ReadingHeatmap books={books} />
              </Card>

              <RecentBooks
                books={recentBooks}
                onBookClick={setSelectedBook}
                BookGridComponent={BookGrid}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <ReadingActivityChart data={monthlyReadingData} />

              {totalReactions > 0 && (
                <MostLovedBooks
                  books={mostLovedBooks}
                  totalReactions={totalReactions}
                />
              )}

              <div>
                <h2 className="text-xl font-display font-bold text-stone-900 mb-1">
                  Reviews &amp; engagement
                </h2>
                <p className="text-stone-500 text-sm mb-4">
                  How readers react to your books
                </p>
                <ReviewAnalytics />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <QuickActions
            actions={[
              {
                to: "/profile",
                icon: <User className="w-5 h-5" />,
                label: "Edit About Me",
                color: "sage" as const,
              },
              {
                onClick: () => setShowAvatarCreator(true),
                icon: <User className="w-5 h-5" />,
                label: "Edit My Avatar",
                color: "accent" as const,
              },
              {
                to: "/progress",
                icon: <Star className="w-5 h-5" />,
                label: "Reading goals",
                color: "primary" as const,
              },
            ]}
          />

          <GenrePieChart data={genreData} />
          <WeeklyQuote quote={getWeeklyQuote()} />
        </div>
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          showActions={false}
        />
      )}

      <ReducedMotionAnimatePresence>
        {showAvatarCreator && (
          <AvatarCreator
            initialConfig={userAvatar}
            onSave={handleSaveAvatar}
            onClose={() => setShowAvatarCreator(false)}
          />
        )}
      </ReducedMotionAnimatePresence>
    </div>
  );
};

export default Dashboard;
