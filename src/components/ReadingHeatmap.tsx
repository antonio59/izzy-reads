import { useMemo } from "react";
import type { Book } from "../types";

interface ReadingHeatmapProps {
  books: Book[];
  /** Calendar year to display (defaults to current) */
  year?: number;
}

function parseReadDay(dateRead: string, year: number): string | null {
  // Full day: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(dateRead)) {
    const d = dateRead.slice(0, 10);
    if (d.startsWith(String(year))) return d;
    return null;
  }
  // Month only: YYYY-MM → count on the 15th of that month
  if (/^\d{4}-\d{2}$/.test(dateRead)) {
    const [y, m] = dateRead.split("-");
    if (Number(y) !== year) return null;
    return `${y}-${m}-15`;
  }
  // Fallback Date parse
  const parsed = new Date(dateRead);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getFullYear() !== year) return null;
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const dd = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function colorForCount(count: number): string {
  if (count <= 0) return "bg-cream-200";
  if (count === 1) return "bg-primary-200";
  if (count === 2) return "bg-primary-400";
  return "bg-primary-600";
}

/**
 * GitHub-style reading calendar for a year.
 * Uses full YYYY-MM-DD when available; maps YYYY-MM finishes to mid-month.
 */
export function ReadingHeatmap({
  books,
  year = new Date().getFullYear(),
}: ReadingHeatmapProps) {
  const { cells, max, total, weeks } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const book of books) {
      if (!book.isRead || !book.dateRead) continue;
      const key = parseReadDay(book.dateRead, year);
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const start = new Date(year, 0, 1);
    // Align to Sunday start of week containing Jan 1
    const startPad = start.getDay(); // 0=Sun
    const end = new Date(year, 11, 31);
    const days: { date: string; count: number; label: string }[] = [];

    // Leading empty cells for alignment
    for (let i = 0; i < startPad; i++) {
      days.push({ date: "", count: -1, label: "" });
    }

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const key = `${yyyy}-${mm}-${dd}`;
      const count = counts.get(key) || 0;
      days.push({
        date: key,
        count,
        label: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    let maxCount = 0;
    let totalBooks = 0;
    for (const c of counts.values()) {
      maxCount = Math.max(maxCount, c);
      totalBooks += c;
    }

    const weekCount = Math.ceil(days.length / 7);
    return { cells: days, max: maxCount, total: totalBooks, weeks: weekCount };
  }, [books, year]);

  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    cells.forEach((cell, i) => {
      if (!cell.date) return;
      const month = Number(cell.date.slice(5, 7)) - 1;
      if (month !== lastMonth) {
        lastMonth = month;
        labels.push({
          month: new Date(year, month, 1).toLocaleString("en-US", {
            month: "short",
          }),
          weekIndex: Math.floor(i / 7),
        });
      }
    });
    return labels;
  }, [cells, year]);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-stone-900 text-lg">
            Reading heatmap
          </h3>
          <p className="text-sm text-stone-500">
            {total > 0
              ? `${total} book${total === 1 ? "" : "s"} finished in ${year}`
              : `No finishes logged in ${year} yet`}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-stone-400">
          <span>Less</span>
          {[0, 1, 2, 3].map((n) => (
            <span
              key={n}
              className={`w-2.5 h-2.5 rounded-sm ${colorForCount(n === 3 ? 3 : n)}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div
          className="inline-grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
            gridTemplateRows: "auto repeat(7, 10px)",
          }}
        >
          {/* Month labels row */}
          {Array.from({ length: weeks }).map((_, wi) => {
            const label = monthLabels.find((m) => m.weekIndex === wi);
            return (
              <div
                key={`m-${wi}`}
                className="text-[10px] text-stone-400 h-4 leading-none"
                style={{ gridColumn: wi + 1, gridRow: 1 }}
              >
                {label?.month ?? ""}
              </div>
            );
          })}

          {cells.map((cell, i) => {
            const week = Math.floor(i / 7);
            const day = (i % 7) + 2; // row 2-8
            if (cell.count < 0) {
              return (
                <div
                  key={`pad-${i}`}
                  style={{ gridColumn: week + 1, gridRow: day }}
                  className="w-2.5 h-2.5"
                />
              );
            }
            return (
              <div
                key={cell.date}
                title={
                  cell.count > 0
                    ? `${cell.label}: ${cell.count} book${cell.count === 1 ? "" : "s"}`
                    : cell.label
                }
                style={{ gridColumn: week + 1, gridRow: day }}
                className={`w-2.5 h-2.5 rounded-sm ${colorForCount(cell.count)} ${
                  cell.count > 0 ? "ring-1 ring-primary-700/10" : ""
                }`}
              />
            );
          })}
        </div>
      </div>

      {max === 0 && (
        <p className="text-xs text-stone-400 mt-3">
          Finish a book to light up the calendar.
        </p>
      )}
    </div>
  );
}

export default ReadingHeatmap;
