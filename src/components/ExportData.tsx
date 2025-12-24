import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Table,
  Image,
  Check,
  Loader2,
  BookOpen,
  Star,
  Calendar,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useGamification } from "../contexts/GamificationContext";
import { Card } from "./ui/Card";
import { FadeIn } from "./PageTransition";

type ExportFormat = "json" | "csv" | "pdf";

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: "json",
    label: "JSON",
    description: "Full data backup, great for importing later",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    format: "csv",
    label: "CSV Spreadsheet",
    description: "Open in Excel or Google Sheets",
    icon: <Table className="w-6 h-6" />,
  },
  {
    format: "pdf",
    label: "PDF Report",
    description: "Beautiful printable reading report",
    icon: <Image className="w-6 h-6" />,
  },
];

const ExportData: React.FC = () => {
  const { books, poems, blogPosts, readingStats } = useBooks();
  const { stats, level, totalXP, unlockedAchievements } = useGamification();

  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [exported, setExported] = useState<ExportFormat[]>([]);

  const generateJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      books: books,
      poems: poems,
      blogPosts: blogPosts,
      readingStats: readingStats,
      gamification: {
        level: level.level,
        levelTitle: level.title,
        totalXP,
        achievements: unlockedAchievements,
        stats,
      },
    };
    return JSON.stringify(data, null, 2);
  };

  const generateCSV = () => {
    const headers = [
      "Title",
      "Author",
      "Genre",
      "Pages",
      "Rating",
      "Date Read",
      "Notes",
    ];
    const rows = books
      .filter((b) => b.isRead)
      .map((book) => [
        `"${book.title.replace(/"/g, '""')}"`,
        `"${book.author.replace(/"/g, '""')}"`,
        book.genre,
        book.pageCount || "",
        book.rating || "",
        book.dateRead || "",
        `"${(book.notes || "").replace(/"/g, '""')}"`,
      ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  };

  const generatePDFContent = () => {
    // Generate HTML content that can be printed as PDF
    const readBooks = books.filter((b) => b.isRead);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reading Report</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
            h2 { color: #4c1d95; margin-top: 30px; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .stat { background: #f3e8ff; padding: 20px; border-radius: 12px; text-align: center; }
            .stat-value { font-size: 2em; font-weight: bold; color: #7c3aed; }
            .stat-label { color: #6b7280; font-size: 0.9em; }
            .book { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .book-title { font-weight: bold; font-size: 1.1em; }
            .book-author { color: #6b7280; }
            .book-rating { color: #f59e0b; }
            .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 0.8em; }
          </style>
        </head>
        <body>
          <h1>My Reading Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${stats.booksRead}</div>
              <div class="stat-label">Books Read</div>
            </div>
            <div class="stat">
              <div class="stat-value">${stats.pagesRead.toLocaleString()}</div>
              <div class="stat-label">Pages Read</div>
            </div>
            <div class="stat">
              <div class="stat-value">Level ${level.level}</div>
              <div class="stat-label">${level.title}</div>
            </div>
          </div>
          
          <h2>Books I've Read (${readBooks.length})</h2>
          ${readBooks
            .map(
              (book) => `
            <div class="book">
              <div class="book-title">${book.title}</div>
              <div class="book-author">by ${book.author}</div>
              ${book.rating ? `<div class="book-rating">${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</div>` : ""}
              ${book.dateRead ? `<div>Read: ${new Date(book.dateRead).toLocaleDateString()}</div>` : ""}
            </div>
          `,
            )
            .join("")}
          
          <div class="footer">
            <p>Izzy's Bookshelf - Reading is an Adventure!</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case "json":
        content = generateJSON();
        filename = `izzys-bookshelf-backup-${new Date().toISOString().split("T")[0]}.json`;
        mimeType = "application/json";
        break;
      case "csv":
        content = generateCSV();
        filename = `izzys-bookshelf-books-${new Date().toISOString().split("T")[0]}.csv`;
        mimeType = "text/csv";
        break;
      case "pdf": {
        const pdfContent = generatePDFContent();
        // Open in new window for printing as PDF
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(pdfContent);
          printWindow.document.close();
          printWindow.print();
        }
        setExporting(null);
        setExported((prev) => [...prev, format]);
        return;
      }
      default:
        return;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(null);
    setExported((prev) => [...prev, format]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <Card variant="gradient" padding="lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Export Your Data
              </h1>
              <p className="text-gray-600">
                Download your reading history and statistics
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Stats summary */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card padding="md" className="text-center">
            <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.booksRead}
            </p>
            <p className="text-sm text-gray-500">Books</p>
          </Card>
          <Card padding="md" className="text-center">
            <FileText className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{poems.length}</p>
            <p className="text-sm text-gray-500">Poems</p>
          </Card>
          <Card padding="md" className="text-center">
            <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {unlockedAchievements.length}
            </p>
            <p className="text-sm text-gray-500">Achievements</p>
          </Card>
          <Card padding="md" className="text-center">
            <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {stats.streakWeeks}
            </p>
            <p className="text-sm text-gray-500">Week Streak</p>
          </Card>
        </div>
      </FadeIn>

      {/* Export options */}
      <FadeIn delay={0.2}>
        <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
          Choose Export Format
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {EXPORT_OPTIONS.map((option) => {
            const isExporting = exporting === option.format;
            const isExported = exported.includes(option.format);

            return (
              <motion.button
                key={option.format}
                onClick={() => handleExport(option.format)}
                disabled={isExporting}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  isExported
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isExported
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isExporting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isExported ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      option.icon
                    )}
                  </div>
                  {isExported && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Downloaded
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </motion.button>
            );
          })}
        </div>
      </FadeIn>

      {/* Tips */}
      <FadeIn delay={0.3}>
        <Card
          padding="lg"
          className="bg-gradient-to-r from-blue-50 to-purple-50"
        >
          <h3 className="font-bold text-gray-900 mb-3">Export Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <strong>JSON:</strong> Best for backing up all your data. You
                can import this later!
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span>
                <strong>CSV:</strong> Perfect for analyzing your reading in a
                spreadsheet app.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <span>
                <strong>PDF:</strong> Great for printing or sharing your reading
                achievements!
              </span>
            </li>
          </ul>
        </Card>
      </FadeIn>
    </div>
  );
};

export default ExportData;
