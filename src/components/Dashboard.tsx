import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Heart,
  PenTool,
  Feather,
  Sparkles,
  Star,
  User,
  BarChart3,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import OnboardingTour from "./OnboardingTour";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { getWeeklyQuote } from "../utils/readingQuotes";
import { Card, StatCard } from "./ui/Card";
import { StreakBadge } from "./ui/Badge";
import { ChallengeProgress } from "./ui/Progress";
import { StaggerContainer, StaggerItem, FadeIn } from "./PageTransition";
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
import type { Book } from "../types";

const Dashboard: React.FC = () => {
  const { books, wishlist, readingChallenges, readingStats } = useBooks();
  const reactionStats = useQuery(api.reactions.getAllBookReactionStats);
  const { user, updateUserProfile } = useUser();
  const userProfile = useQuery(api.users.getCurrentProfile);
  const setOnboardingSeen = useMutation(api.users.setOnboardingSeen);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Show onboarding on first visit (sync during render to avoid effect setState)
  const shouldShowOnboarding =
    userProfile !== undefined &&
    userProfile !== null &&
    userProfile.hasSeenOnboarding !== true &&
    !showTour;

  if (shouldShowOnboarding && !showTour) {
    setShowTour(true);
  }

  const handleTourComplete = useCallback(async () => {
    setShowTour(false);
    await setOnboardingSeen();
  }, [setOnboardingSeen]);

  const handleTourSkip = useCallback(async () => {
    setShowTour(false);
    await setOnboardingSeen();
  }, [setOnboardingSeen]);

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
  const quickActions = [
    {
      to: "/books",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Add a Book",
      color: "primary" as const,
    },
    {
      to: "/create",
      icon: <Feather className="w-5 h-5" />,
      label: "Write a Poem",
      color: "accent" as const,
    },
    {
      to: "/create",
      icon: <PenTool className="w-5 h-5" />,
      label: "Write a Post",
      color: "sage" as const,
    },
    {
      to: "/books",
      icon: <Heart className="w-5 h-5" />,
      label: "Update Wishlist",
      color: "primary" as const,
    },
    {
      onClick: () => setShowAvatarCreator(true),
      icon: <User className="w-5 h-5" />,
      label: "Edit My Avatar",
      color: "accent" as const,
    },
    {
      to: "/profile",
      icon: <User className="w-5 h-5" />,
      label: "Edit About Me",
      color: "sage" as const,
    },
  ];

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
            <div className="flex items-center gap-4">
              {/* Avatar */}
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
                  Welcome back, {user?.name || "Reader"}!
                </h1>
                <p className="text-stone-600 max-w-md">
                  {readingStats.booksThisMonth === 0 ? (
                    <>
                      Ready to start a new reading adventure this month? Pick up
                      a book and let the magic begin!
                    </>
                  ) : (
                    <>
                      Amazing! You've read{" "}
                      <span className="font-semibold text-primary-600">
                        {readingStats.booksThisMonth}{" "}
                        {readingStats.booksThisMonth === 1 ? "book" : "books"}
                      </span>{" "}
                      this month. Keep it up!
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTour(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                title="Take the tour again"
              >
                <Sparkles className="w-4 h-4" />
                Tour
              </button>
              <StreakBadge days={readingStats.readingStreak} />
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
        {totalReactions > 0 && (
          <StaggerItem>
            <StatCard
              label="Reader Reactions"
              value={totalReactions}
              icon={<span className="text-xl">❤️</span>}
              color="accent"
            />
          </StaggerItem>
        )}
      </StaggerContainer>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reading Challenge */}
          {currentChallenge && (
            <FadeIn delay={0.1}>
              <ChallengeProgress
                title={currentChallenge.title}
                current={currentChallenge.current}
                target={currentChallenge.target}
                icon={currentChallenge.badge}
                color="accent"
                dueDate={currentChallenge.endDate}
              />
            </FadeIn>
          )}

          {/* Reading Activity Chart */}
          <FadeIn delay={0.2}>
            <ReadingActivityChart data={monthlyReadingData} />
          </FadeIn>

          {/* Recent Books */}
          <FadeIn delay={0.3}>
            <RecentBooks
              books={recentBooks}
              onBookClick={setSelectedBook}
              BookGridComponent={BookGrid}
            />
          </FadeIn>

          {/* Most Loved Books - only show when there are reactions */}
          {totalReactions > 0 && (
            <FadeIn delay={0.35}>
              <MostLovedBooks
                books={mostLovedBooks}
                totalReactions={totalReactions}
              />
            </FadeIn>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <FadeIn delay={0.2}>
            <QuickActions actions={quickActions} />
          </FadeIn>

          {/* Genre Distribution */}
          <FadeIn delay={0.3}>
            <GenrePieChart data={genreData} />
          </FadeIn>

          {/* Weekly Quote */}
          <FadeIn delay={0.4}>
            <WeeklyQuote quote={getWeeklyQuote()} />
          </FadeIn>
        </div>
      </div>

      {/* Analytics Section */}
      <FadeIn delay={0.5}>
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-stone-900">
                Analytics & Insights
              </h2>
              <p className="text-stone-500">
                See how readers engage with your books and reviews
              </p>
            </div>
          </div>
          <ReviewAnalytics />
        </div>
      </FadeIn>

      {/* Onboarding Tour */}
      {showTour && (
        <OnboardingTour
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          showActions={false}
        />
      )}

      {/* Avatar Creator Modal */}
      <AnimatePresence>
        {showAvatarCreator && (
          <AvatarCreator
            initialConfig={userAvatar}
            onSave={handleSaveAvatar}
            onClose={() => setShowAvatarCreator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
