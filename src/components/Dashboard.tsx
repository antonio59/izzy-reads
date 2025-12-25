import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Heart,
  PenTool,
  Feather,
  ChevronRight,
  Sparkles,
  Calendar,
  Star,
  User,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { getWeeklyQuote } from "../utils/readingQuotes";
import { Card, StatCard } from "./ui/Card";
import { Badge, StreakBadge } from "./ui/Badge";
import { ChallengeProgress } from "./ui/Progress";
import { StaggerContainer, StaggerItem, FadeIn } from "./PageTransition";
import { BookGrid } from "./BookGrid";
import { BookDetailModal } from "./BookDetailModal";
import AvatarCreator, {
  AvatarPreview,
  type AvatarConfig,
} from "./AvatarCreator";
import { ReviewAnalytics } from "./ReviewAnalytics";
import type { Book } from "../types";

const Dashboard: React.FC = () => {
  const {
    books,
    wishlist,
    readingChallenges,
    readingStats,
    getMostLovedBooks,
    getBookReactionCount,
  } = useBooks();
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

  // Get most loved books for the dashboard
  const mostLovedBooks = getMostLovedBooks().slice(0, 3);

  // Calculate total reactions across all books
  const totalReactions = books.reduce(
    (sum, book) => sum + getBookReactionCount(book),
    0,
  );

  const currentChallenge = readingChallenges[0];

  // Generate chart data
  const monthlyReadingData = generateMonthlyData(books);
  const genreData = generateGenreData(books);

  const COLORS = [
    "#8b5cf6",
    "#f97f5e",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
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
                  <span className="text-sm font-medium text-gray-600">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name || "Reader"}!
                </h1>
                <p className="text-gray-600 max-w-md">
                  Ready for another reading adventure? You've read{" "}
                  <span className="font-semibold text-primary-600">
                    {readingStats.booksThisMonth} books
                  </span>{" "}
                  this month. Keep it up!
                </p>
              </div>
            </div>
            <StreakBadge days={readingStats.readingStreak} />
          </div>
        </Card>
      </FadeIn>

      {/* Stats Grid - Bento Layout */}
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
        <StaggerItem>
          <StatCard
            label="Reader Reactions"
            value={totalReactions}
            icon={<span className="text-xl">❤️</span>}
            color="accent"
          />
        </StaggerItem>
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
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-lg">
                    Reading Activity
                  </h3>
                  <p className="text-sm text-gray-500">Books read per month</p>
                </div>
                <Badge
                  variant="primary"
                  icon={<Calendar className="w-3 h-3" />}
                >
                  This Year
                </Badge>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyReadingData}>
                    <defs>
                      <linearGradient
                        id="colorBooks"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="books"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBooks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </FadeIn>

          {/* Recent Books */}
          <FadeIn delay={0.3}>
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-gray-900 text-lg">
                  Recent Reads
                </h3>
                <Link
                  to="/bookshelf"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentBooks.length > 0 ? (
                <BookGrid
                  books={recentBooks}
                  onBookClick={setSelectedBook}
                  size="md"
                  columns={4}
                />
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-gray-500 font-medium">
                    No books read yet!
                  </p>
                  <p className="text-sm text-gray-400">
                    Start your reading journey today
                  </p>
                  <Link
                    to="/bookshelf"
                    className="inline-block mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                  >
                    Add Your First Book
                  </Link>
                </div>
              )}
            </Card>
          </FadeIn>

          {/* Most Loved Books - Reader Reactions */}
          {mostLovedBooks.length > 0 && (
            <FadeIn delay={0.35}>
              <Card
                padding="lg"
                className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">❤️</span>
                    <h3 className="font-display font-bold text-gray-900 text-lg">
                      Most Loved by Readers
                    </h3>
                  </div>
                  <Badge variant="primary">{totalReactions} reactions</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  These books are getting the most love from visitors!
                </p>
                <div className="space-y-3">
                  {mostLovedBooks.map((book, index) => (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 font-bold rounded-full">
                        {index + 1}
                      </div>
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-gradient-to-br from-primary-400 to-accent-400 rounded flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {book.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {book.author}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-pink-100 px-2 py-1 rounded-full">
                        <span className="text-sm">❤️</span>
                        <span className="text-sm font-bold text-pink-600">
                          {getBookReactionCount(book)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Genre Distribution */}
          <FadeIn delay={0.2}>
            <Card padding="lg">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-4">
                Genre Mix
              </h3>
              {genreData.length > 0 ? (
                <>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genreData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {genreData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {genreData.slice(0, 4).map((genre, index) => (
                      <Badge key={genre.name} variant="gray">
                        <span
                          className="w-2 h-2 rounded-full mr-1"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    Read more books to see your genre mix!
                  </p>
                </div>
              )}
            </Card>
          </FadeIn>

          {/* Quick Actions */}
          <FadeIn delay={0.3}>
            <Card padding="lg">
              <h3 className="font-display font-bold text-gray-900 text-lg mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <QuickActionLink
                  to="/bookshelf"
                  icon={<BookOpen className="w-5 h-5" />}
                  label="Add a Book"
                  color="primary"
                />
                <QuickActionLink
                  to="/poems"
                  icon={<Feather className="w-5 h-5" />}
                  label="Write a Poem"
                  color="accent"
                />
                <QuickActionLink
                  to="/blog"
                  icon={<PenTool className="w-5 h-5" />}
                  label="Write a Post"
                  color="sage"
                />
                <QuickActionLink
                  to="/wishlist"
                  icon={<Heart className="w-5 h-5" />}
                  label="Update Wishlist"
                  color="primary"
                />
                <QuickActionButton
                  onClick={() => setShowAvatarCreator(true)}
                  icon={<User className="w-5 h-5" />}
                  label="Edit My Avatar"
                  color="accent"
                />
              </div>
            </Card>
          </FadeIn>

          {/* Weekly Quote */}
          <FadeIn delay={0.4}>
            <Card
              variant="default"
              padding="lg"
              className="bg-gradient-to-br from-primary-500 to-accent-500 text-white"
            >
              <div className="text-center">
                <span className="text-3xl mb-3 block">
                  {getWeeklyQuote().emoji}
                </span>
                <p className="text-white/90 italic mb-3">
                  "{getWeeklyQuote().text}"
                </p>
                <p className="text-sm text-white/70">
                  — {getWeeklyQuote().author}
                </p>
              </div>
            </Card>
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
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Analytics & Insights
              </h2>
              <p className="text-gray-500">
                See how readers engage with your books and reviews
              </p>
            </div>
          </div>
          <ReviewAnalytics />
        </div>
      </FadeIn>

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

// Quick Action Link component
function QuickActionLink({
  to,
  icon,
  label,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: "primary" | "accent" | "sage";
}) {
  const colorStyles = {
    primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
    accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
    sage: "bg-sage-50 text-sage-600 group-hover:bg-sage-100",
  };

  return (
    <Link
      to={to}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <div className={`p-2 rounded-lg transition-colors ${colorStyles[color]}`}>
        {icon}
      </div>
      <span className="font-medium text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

// Quick Action Button component (for non-link actions)
function QuickActionButton({
  onClick,
  icon,
  label,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: "primary" | "accent" | "sage";
}) {
  const colorStyles = {
    primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
    accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
    sage: "bg-sage-50 text-sage-600 group-hover:bg-sage-100",
  };

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors w-full text-left"
    >
      <div className={`p-2 rounded-lg transition-colors ${colorStyles[color]}`}>
        {icon}
      </div>
      <span className="font-medium text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

// Helper function to generate monthly reading data
function generateMonthlyData(books: Book[]) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map((month, index) => {
    const booksInMonth = books.filter((book) => {
      if (!book.dateRead || !book.isRead) return false;
      const date = new Date(book.dateRead);
      return date.getFullYear() === currentYear && date.getMonth() === index;
    }).length;

    return { month, books: booksInMonth };
  });
}

// Helper function to generate genre distribution data
function generateGenreData(books: Book[]) {
  const readBooks = books.filter((book) => book.isRead && book.genre);
  const genreCounts: Record<string, number> = {};

  readBooks.forEach((book) => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });

  return Object.entries(genreCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export default Dashboard;
