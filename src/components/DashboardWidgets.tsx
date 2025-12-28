/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Calendar } from "lucide-react";
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
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

import type { Book } from "../types";

// Chart colors
const CHART_COLORS = [
  "#8b5cf6",
  "#f97f5e",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
];

// ============================================
// Reading Activity Chart
// ============================================

interface ReadingActivityChartProps {
  data: { month: string; books: number }[];
}

export function ReadingActivityChart({ data }: ReadingActivityChartProps) {
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-stone-900 text-lg">
            Reading Activity
          </h3>
          <p className="text-sm text-stone-500">Books read per month</p>
        </div>
        <Badge variant="primary" icon={<Calendar className="w-3 h-3" />}>
          This Year
        </Badge>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBooks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
  );
}

// ============================================
// Genre Pie Chart
// ============================================

interface GenrePieChartProps {
  data: { name: string; value: number }[];
}

export function GenrePieChart({ data }: GenrePieChartProps) {
  if (data.length === 0) {
    return (
      <Card padding="lg">
        <h3 className="font-display font-bold text-stone-900 text-lg mb-4">
          Genre Mix
        </h3>
        <div className="text-center py-8">
          <p className="text-stone-400 text-sm">
            Read more books to see your genre mix!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="font-display font-bold text-stone-900 text-lg mb-4">
        Genre Mix
      </h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
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
        {data.slice(0, 4).map((genre, index) => (
          <Badge key={genre.name} variant="gray">
            <span
              className="w-2 h-2 rounded-full mr-1"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            {genre.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

// ============================================
// Most Loved Books Widget
// ============================================

interface MostLovedBooksProps {
  books: (Book & { reactionCount: number })[];
  totalReactions: number;
}

export function MostLovedBooks({ books, totalReactions }: MostLovedBooksProps) {
  if (books.length === 0) return null;

  return (
    <Card
      padding="lg"
      className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <h3 className="font-display font-bold text-stone-900 text-lg">
            Most Loved by Readers
          </h3>
        </div>
        <Badge variant="primary">{totalReactions} reactions</Badge>
      </div>
      <p className="text-sm text-stone-600 mb-4">
        These books are getting the most love from visitors!
      </p>
      <div className="space-y-3">
        {books.map((book, index) => (
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
              <p className="font-medium text-stone-900 truncate">
                {book.title}
              </p>
              <p className="text-sm text-stone-500 truncate">{book.author}</p>
            </div>
            <div className="flex items-center gap-1 bg-pink-100 px-2 py-1 rounded-full">
              <span className="text-sm">❤️</span>
              <span className="text-sm font-bold text-pink-600">
                {book.reactionCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================
// Recent Books Widget
// ============================================

interface RecentBooksProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  BookGridComponent: React.ComponentType<{
    books: Book[];
    onBookClick: (book: Book) => void;
    size?: "sm" | "md" | "lg";
    columns?: 2 | 3 | 4 | 5 | 6;
  }>;
}

export function RecentBooks({
  books,
  onBookClick,
  BookGridComponent,
}: RecentBooksProps) {
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-stone-900 text-lg">
          Recent Reads
        </h3>
        <Link
          to="/books"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {books.length > 0 ? (
        <BookGridComponent
          books={books}
          onBookClick={onBookClick}
          size="md"
          columns={4}
        />
      ) : (
        <div className="text-center py-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          </motion.div>
          <p className="text-stone-500 font-medium">No books read yet!</p>
          <p className="text-sm text-stone-400">
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
  );
}

// ============================================
// Quick Actions Widget
// ============================================

interface QuickAction {
  to?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  color: "primary" | "accent" | "sage";
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const colorStyles = {
    primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
    accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
    sage: "bg-sage-50 text-sage-600 group-hover:bg-sage-100",
  };

  return (
    <Card padding="lg">
      <h3 className="font-display font-bold text-stone-900 text-lg mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const content = (
            <>
              <div
                className={`p-2 rounded-lg transition-colors ${colorStyles[action.color]}`}
              >
                {action.icon}
              </div>
              <span className="font-medium text-stone-700 group-hover:text-stone-900">
                {action.label}
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </>
          );

          if (action.to) {
            return (
              <Link
                key={index}
                to={action.to}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={index}
              onClick={action.onClick}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors w-full text-left"
            >
              {content}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ============================================
// Weekly Quote Widget
// ============================================

interface WeeklyQuoteProps {
  quote: {
    text: string;
    author: string;
    emoji: string;
  };
}

export function WeeklyQuote({ quote }: WeeklyQuoteProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className="bg-gradient-to-br from-primary-500 to-accent-500 text-white"
    >
      <div className="text-center">
        <span className="text-3xl mb-3 block">{quote.emoji}</span>
        <p className="text-white/90 italic mb-3">"{quote.text}"</p>
        <p className="text-sm text-white/70">— {quote.author}</p>
      </div>
    </Card>
  );
}

// ============================================
// Helper Functions
// ============================================

export function generateMonthlyData(books: Book[]) {
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

export function generateGenreData(books: Book[]) {
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
