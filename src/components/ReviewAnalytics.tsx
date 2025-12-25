import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  MessageSquare,
  ThumbsUp,
  Star,
  Lightbulb,
  Smile,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBooks } from "../contexts/BookContext";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import type { ReviewReactions, BookReactions } from "../types";

// Reaction display config
const BOOK_REACTIONS = [
  { key: "love" as const, emoji: "❤️", label: "Love it!", color: "#ef4444" },
  { key: "amazing" as const, emoji: "🤩", label: "Amazing!", color: "#f59e0b" },
  {
    key: "mustRead" as const,
    emoji: "📚",
    label: "Must read!",
    color: "#8b5cf6",
  },
  { key: "soGood" as const, emoji: "🔥", label: "So good!", color: "#f97316" },
  {
    key: "notForMe" as const,
    emoji: "😕",
    label: "Not for me",
    color: "#6b7280",
  },
];

const REVIEW_REACTIONS = [
  {
    key: "helpful" as const,
    emoji: "👍",
    label: "Helpful",
    color: "#3b82f6",
    icon: ThumbsUp,
  },
  {
    key: "greatReview" as const,
    emoji: "⭐",
    label: "Great review!",
    color: "#f59e0b",
    icon: Star,
  },
  {
    key: "agree" as const,
    emoji: "🤝",
    label: "I agree",
    color: "#22c55e",
    icon: Users,
  },
  {
    key: "funny" as const,
    emoji: "😂",
    label: "Funny",
    color: "#ec4899",
    icon: Smile,
  },
  {
    key: "insightful" as const,
    emoji: "💡",
    label: "Insightful",
    color: "#8b5cf6",
    icon: Lightbulb,
  },
];

interface ReviewAnalyticsProps {
  compact?: boolean;
}

export function ReviewAnalytics({ compact = false }: ReviewAnalyticsProps) {
  const { books } = useBooks();

  // Get reaction stats from Convex
  const reactionStats = useQuery(api.reactions.getAllBookReactionStats);

  // Get books with reviews
  const booksWithReviews = useMemo(() => {
    return books.filter((book) => book.isRead && (book.notes || book.review));
  }, [books]);

  // Total book reactions from Convex
  const totalBookReactions = reactionStats?.totalReactions ?? 0;

  // Calculate total review reactions (TODO: add similar query for review reactions)
  const totalReviewReactions = useMemo(() => {
    return books.reduce((sum, book) => {
      if (!book.reviewReactions) return sum;
      return (
        sum + Object.values(book.reviewReactions).reduce((a, b) => a + b, 0)
      );
    }, 0);
  }, [books]);

  // Get reaction breakdown for books
  const bookReactionBreakdown = useMemo(() => {
    const breakdown: Record<keyof BookReactions, number> = {
      love: 0,
      amazing: 0,
      mustRead: 0,
      soGood: 0,
      notForMe: 0,
    };

    books.forEach((book) => {
      if (book.reactions) {
        Object.entries(book.reactions).forEach(([key, value]) => {
          breakdown[key as keyof BookReactions] += value;
        });
      }
    });

    return BOOK_REACTIONS.map((r) => ({
      ...r,
      count: breakdown[r.key],
    })).sort((a, b) => b.count - a.count);
  }, [books]);

  // Get reaction breakdown for reviews
  const reviewReactionBreakdown = useMemo(() => {
    const breakdown: Record<keyof ReviewReactions, number> = {
      helpful: 0,
      greatReview: 0,
      agree: 0,
      funny: 0,
      insightful: 0,
    };

    books.forEach((book) => {
      if (book.reviewReactions) {
        Object.entries(book.reviewReactions).forEach(([key, value]) => {
          breakdown[key as keyof ReviewReactions] += value;
        });
      }
    });

    return REVIEW_REACTIONS.map((r) => ({
      ...r,
      count: breakdown[r.key],
    })).sort((a, b) => b.count - a.count);
  }, [books]);

  // Get most popular reviews (by review reactions)
  const mostPopularReviews = useMemo(() => {
    return [...booksWithReviews]
      .map((book) => ({
        ...book,
        totalReviewReactions: book.reviewReactions
          ? Object.values(book.reviewReactions).reduce((a, b) => a + b, 0)
          : 0,
      }))
      .sort((a, b) => b.totalReviewReactions - a.totalReviewReactions)
      .slice(0, 5);
  }, [booksWithReviews]);

  // Get genre performance (avg rating per genre)
  const genrePerformance = useMemo(() => {
    const genreStats: Record<
      string,
      { total: number; count: number; reactions: number }
    > = {};

    const reactionsByBook = reactionStats?.reactionsByBook ?? {};

    books.forEach((book) => {
      if (book.isRead && book.genre) {
        if (!genreStats[book.genre]) {
          genreStats[book.genre] = { total: 0, count: 0, reactions: 0 };
        }
        if (book.rating) {
          genreStats[book.genre].total += book.rating;
          genreStats[book.genre].count += 1;
        }
        genreStats[book.genre].reactions += reactionsByBook[book.id] ?? 0;
      }
    });

    return Object.entries(genreStats)
      .map(([genre, stats]) => ({
        genre,
        avgRating: stats.count > 0 ? stats.total / stats.count : 0,
        bookCount: stats.count,
        reactions: stats.reactions,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 6);
  }, [books, reactionStats]);

  // Chart data for genre ratings
  const genreChartData = genrePerformance.map((g) => ({
    name: g.genre.length > 10 ? g.genre.slice(0, 10) + "..." : g.genre,
    rating: Number(g.avgRating.toFixed(1)),
    books: g.bookCount,
  }));

  const CHART_COLORS = [
    "#8b5cf6",
    "#f97f5e",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
  ];

  if (compact) {
    return (
      <Card
        padding="lg"
        className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900">
              Review Analytics
            </h3>
            <p className="text-sm text-gray-500">
              How readers engage with your content
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">
              {totalBookReactions}
            </p>
            <p className="text-xs text-gray-500">Book Reactions</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">
              {totalReviewReactions}
            </p>
            <p className="text-xs text-gray-500">Review Reactions</p>
          </div>
        </div>

        {mostPopularReviews.length > 0 && mostPopularReviews[0] && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Top Review
            </p>
            <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">
                  {mostPopularReviews[0].title}
                </p>
                <p className="text-xs text-gray-500">
                  {mostPopularReviews[0].totalReviewReactions} reactions
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
            <div className="p-4 text-center">
              <span className="text-3xl mb-2 block">❤️</span>
              <p className="text-3xl font-bold text-pink-600">
                {totalBookReactions}
              </p>
              <p className="text-sm text-gray-600">Book Reactions</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
            <div className="p-4 text-center">
              <span className="text-3xl mb-2 block">💬</span>
              <p className="text-3xl font-bold text-purple-600">
                {totalReviewReactions}
              </p>
              <p className="text-sm text-gray-600">Review Reactions</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
            <div className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-amber-600">
                {booksWithReviews.length}
              </p>
              <p className="text-sm text-gray-600">Reviews Written</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-emerald-600">
                {booksWithReviews.length > 0
                  ? (
                      (totalBookReactions + totalReviewReactions) /
                      booksWithReviews.length
                    ).toFixed(1)
                  : "0"}
              </p>
              <p className="text-sm text-gray-600">Avg Engagement</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Popular Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">
                  Most Popular Reviews
                </h3>
                <p className="text-sm text-gray-500">
                  Based on reader reactions
                </p>
              </div>
            </div>

            {mostPopularReviews.length > 0 ? (
              <div className="space-y-3">
                {mostPopularReviews.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0
                          ? "bg-amber-100 text-amber-700"
                          : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
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
                    <Badge variant="primary">
                      {book.totalReviewReactions} reactions
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reviews with reactions yet</p>
                <p className="text-sm text-gray-400">
                  Share your reviews to get reader feedback!
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Genre Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">
                  Genre Ratings
                </h3>
                <p className="text-sm text-gray-500">Average rating by genre</p>
              </div>
            </div>

            {genreChartData.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreChartData} layout="vertical">
                    <XAxis
                      type="number"
                      domain={[0, 5]}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [
                        `${value ?? 0} stars`,
                        "Avg Rating",
                      ]}
                    />
                    <Bar dataKey="rating" radius={[0, 4, 4, 0]}>
                      {genreChartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Rate more books to see genre stats
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Reaction Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Book Reactions Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">❤️</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">
                  Book Reactions
                </h3>
                <p className="text-sm text-gray-500">
                  How readers feel about your books
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {bookReactionBreakdown.map((reaction) => {
                const percentage =
                  totalBookReactions > 0
                    ? Math.round((reaction.count / totalBookReactions) * 100)
                    : 0;
                return (
                  <div key={reaction.key} className="flex items-center gap-3">
                    <span className="text-xl w-8">{reaction.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {reaction.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {reaction.count}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: reaction.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Review Reactions Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">
                  Review Reactions
                </h3>
                <p className="text-sm text-gray-500">
                  How readers feel about your reviews
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reviewReactionBreakdown.map((reaction) => {
                const percentage =
                  totalReviewReactions > 0
                    ? Math.round((reaction.count / totalReviewReactions) * 100)
                    : 0;
                return (
                  <div key={reaction.key} className="flex items-center gap-3">
                    <span className="text-xl w-8">{reaction.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {reaction.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {reaction.count}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: reaction.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ReviewAnalytics;
