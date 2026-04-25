import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Flame } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { Card } from "./ui/Card";

interface DayData {
  date: string;
  count: number;
  books: string[];
}

const MONTHS = [
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
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Get color intensity based on reading count
function getColor(count: number, maxCount: number): string {
  if (count === 0) return "bg-stone-100";
  const intensity = Math.min(count / Math.max(maxCount, 1), 1);

  if (intensity <= 0.25) return "bg-purple-200";
  if (intensity <= 0.5) return "bg-purple-400";
  if (intensity <= 0.75) return "bg-purple-500";
  return "bg-purple-600";
}

interface BookWithDate {
  isRead: boolean;
  dateRead?: string;
  title: string;
}

// Generate calendar data for a year
function generateCalendarData(
  year: number,
  books: BookWithDate[],
): DayData[][] {
  const weeks: DayData[][] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  // Adjust to start from the first Sunday
  const firstDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - firstDay);

  let currentWeek: DayData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate || currentWeek.length > 0) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const isInYear = currentDate.getFullYear() === year;

    // Find books read on this date
    const booksOnDay = books.filter(
      (book) => book.isRead && book.dateRead === dateStr,
    );

    currentWeek.push({
      date: dateStr,
      count: isInYear ? booksOnDay.length : 0,
      books: booksOnDay.map((b) => b.title),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);

    // Stop after we've completed the year
    if (currentDate.getFullYear() > year && currentWeek.length === 0) break;
  }

  return weeks;
}

interface ReadingHeatmapProps {
  className?: string;
}

const ReadingHeatmap: React.FC<ReadingHeatmapProps> = ({ className = "" }) => {
  const { books } = useBooks();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const calendarData = useMemo(() => {
    return generateCalendarData(selectedYear, books);
  }, [selectedYear, books]);

  const maxCount = useMemo(() => {
    return Math.max(...calendarData.flat().map((d) => d.count), 1);
  }, [calendarData]);

  const totalBooks = useMemo(() => {
    return calendarData.flat().reduce((sum, d) => sum + d.count, 0);
  }, [calendarData]);

  const streakDays = useMemo(() => {
    // Calculate longest reading streak
    const sortedDates = calendarData
      .flat()
      .filter((d) => d.count > 0)
      .map((d) => d.date)
      .sort();

    if (sortedDates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }, [calendarData]);

  const handleMouseEnter = (day: DayData, e: React.MouseEvent) => {
    setHoveredDay(day);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Calculate month positions for labels
  const monthPositions = useMemo(() => {
    const positions: { month: string; position: number }[] = [];
    let weekIndex = 0;

    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(selectedYear, month, 1);
      const dayOfYear = Math.floor(
        (firstDayOfMonth.getTime() - new Date(selectedYear, 0, 1).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const adjustedWeek = Math.floor(
        (dayOfYear + new Date(selectedYear, 0, 1).getDay()) / 7,
      );

      if (adjustedWeek !== weekIndex || month === 0) {
        positions.push({ month: MONTHS[month], position: adjustedWeek });
        weekIndex = adjustedWeek;
      }
    }

    return positions;
  }, [selectedYear]);

  return (
    <Card
      variant="default"
      padding="md"
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-stone-900 text-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Reading Activity
          </h3>
          <p className="text-sm text-stone-500">
            {totalBooks} books read in {selectedYear}
          </p>
        </div>

        {/* Year navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5 text-stone-600" />
          </button>
          <span className="font-bold text-stone-800 min-w-[4rem] text-center">
            {selectedYear}
          </span>
          <button
            onClick={() => setSelectedYear((y) => Math.min(y + 1, currentYear))}
            disabled={selectedYear >= currentYear}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next year"
          >
            <ChevronRight className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Total Books</p>
            <p className="font-bold text-stone-800">{totalBooks}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-stone-500">Best Streak</p>
            <p className="font-bold text-stone-800">{streakDays} days</p>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[720px]">
          {/* Month labels */}
          <div className="flex mb-2 ml-10">
            {monthPositions.map((mp, i) => (
              <div
                key={i}
                className="text-xs text-stone-500"
                style={{
                  position: "relative",
                  left: `${mp.position * 14}px`,
                  marginRight:
                    i < monthPositions.length - 1
                      ? `${(monthPositions[i + 1].position - mp.position - 1) * 14}px`
                      : 0,
                }}
              >
                {mp.month}
              </div>
            ))}
          </div>

          {/* Grid with day labels */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 text-xs text-stone-400">
              {DAYS.map((day, i) => (
                <div key={day} className="h-[12px] flex items-center">
                  {i % 2 === 1 ? day.slice(0, 1) : ""}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-[3px]">
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={day.date}
                      className={`w-[12px] h-[12px] rounded-md cursor-pointer transition-all ${getColor(day.count, maxCount)}`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                      whileHover={{ scale: 1.3 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-stone-500">Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-md bg-stone-100" />
          <div className="w-3 h-3 rounded-md bg-purple-200" />
          <div className="w-3 h-3 rounded-md bg-purple-400" />
          <div className="w-3 h-3 rounded-md bg-purple-500" />
          <div className="w-3 h-3 rounded-md bg-purple-600" />
        </div>
        <span className="text-xs text-stone-500">More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          className="fixed z-50 bg-stone-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 40,
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-medium">
            {new Date(hoveredDay.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-stone-300">
            {hoveredDay.count === 0
              ? "No books read"
              : `${hoveredDay.count} book${hoveredDay.count > 1 ? "s" : ""} read`}
          </p>
          {hoveredDay.books.length > 0 && (
            <p className="text-xs text-stone-400 mt-1 max-w-[200px] truncate">
              {hoveredDay.books.join(", ")}
            </p>
          )}
        </motion.div>
      )}
    </Card>
  );
};

export default ReadingHeatmap;
