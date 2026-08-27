import { BookMarked } from "lucide-react";
import type { Book } from "../types";
import { BookCoverImage } from "./ui/BookCoverImage";
import { isLikelyInvalidCover } from "../lib/coverUrl";

interface CurrentlyReadingStripProps {
  books: Book[];
  /** Limit how many covers to show */
  limit?: number;
  className?: string;
}

/** Quiet “in progress” strip — brags without needing a review. */
export function CurrentlyReadingStrip({
  books,
  limit = 6,
  className = "",
}: CurrentlyReadingStripProps) {
  const reading = books
    .filter((b) => !b.isRead)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, limit);

  if (reading.length === 0) return null;

  return (
    <section
      id="currently-reading"
      className={`rounded-2xl border border-cream-300 bg-white/70 px-4 py-4 sm:px-5 sm:py-5 scroll-mt-24 ${className}`}
      aria-label="Currently reading"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookMarked className="w-4 h-4 text-accent-600" aria-hidden />
        <h2 className="font-display font-bold text-stone-800 text-sm sm:text-base">
          Currently reading
        </h2>
        <span className="text-xs text-stone-400 tabular-nums">
          {reading.length}
        </span>
      </div>

      <ul className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {reading.map((book) => (
          <li key={book.id} className="flex-shrink-0 w-20 sm:w-24">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md ring-1 ring-cream-300 bg-cream-100">
              {!isLikelyInvalidCover(book.coverUrl) ? (
                <BookCoverImage
                  book={book}
                  className="w-full h-full"
                  size="thumb"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 text-center">
                  <span className="text-[10px] font-semibold text-stone-500 line-clamp-4">
                    {book.title}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs font-display font-bold text-stone-800 line-clamp-2">
              {book.title}
            </p>
            <p className="text-[10px] text-stone-400 line-clamp-1">
              {book.author}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
