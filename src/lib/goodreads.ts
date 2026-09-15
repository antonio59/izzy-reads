// Goodreads library CSV import + link helpers.
// Goodreads no longer offers a public API, so integration works via the
// "Export library" CSV (goodreads.com → My Books → Import/Export → Export)
// plus outbound links to book search pages.

export type GoodreadsShelf = "read" | "currently-reading" | "to-read" | "other";

export interface GoodreadsRow {
  title: string;
  author: string;
  isbn?: string;
  rating?: number; // My Rating, 1-5
  pageCount?: number;
  dateRead?: string; // normalized to YYYY-MM-DD
  dateAdded?: string; // normalized to YYYY-MM-DD
  shelf: GoodreadsShelf;
  review?: string;
}

export interface GoodreadsImportPlan {
  finished: GoodreadsRow[];
  reading: GoodreadsRow[];
  wishlist: GoodreadsRow[];
  skipped: { title: string; reason: string }[];
}

/** Minimal CSV parser that handles quoted fields, commas, and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

/** Goodreads exports ISBNs wrapped as ="978..." for spreadsheet compatibility. */
function cleanIsbn(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/^="?|"?$/g, "").replace(/[^0-9Xx]/g, "");
  return cleaned.length >= 10 ? cleaned : undefined;
}

/** Goodreads dates are YYYY/MM/DD – normalize to YYYY-MM-DD. */
function cleanDate(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const m = raw.trim().match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!m) return undefined;
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

export function parseGoodreadsCsv(text: string): GoodreadsRow[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const idx = {
    title: col("title"),
    author: col("author"),
    isbn: col("isbn"),
    isbn13: col("isbn13"),
    myRating: col("my rating"),
    numPages: col("number of pages"),
    dateRead: col("date read"),
    dateAdded: col("date added"),
    exclusiveShelf: col("exclusive shelf"),
    myReview: col("my review"),
  };

  if (idx.title === -1 || idx.author === -1) {
    throw new Error(
      "This doesn't look like a Goodreads export – no Title/Author columns found.",
    );
  }

  const result: GoodreadsRow[] = [];
  for (const r of rows.slice(1)) {
    const title = r[idx.title]?.trim();
    const author = r[idx.author]?.trim();
    if (!title || !author) continue;

    const shelfRaw = (r[idx.exclusiveShelf] ?? "").trim().toLowerCase();
    const shelf: GoodreadsShelf =
      shelfRaw === "read" ||
      shelfRaw === "currently-reading" ||
      shelfRaw === "to-read"
        ? shelfRaw
        : "other";

    const rating = parseInt(r[idx.myRating] ?? "", 10);
    const pages = parseInt(r[idx.numPages] ?? "", 10);
    const review = r[idx.myReview]?.trim();

    result.push({
      title,
      author,
      isbn: cleanIsbn(r[idx.isbn13]) ?? cleanIsbn(r[idx.isbn]),
      rating: rating >= 1 && rating <= 5 ? rating : undefined,
      pageCount: Number.isFinite(pages) && pages > 0 ? pages : undefined,
      dateRead: cleanDate(r[idx.dateRead]),
      dateAdded: cleanDate(r[idx.dateAdded]),
      shelf,
      review: review && review.length > 0 ? review : undefined,
    });
  }
  return result;
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Split parsed rows into import buckets, dropping rows that already exist
 * in the library (matched by ISBN, then by title+author).
 */
export function planGoodreadsImport(
  rows: GoodreadsRow[],
  existing: { isbn?: string; title: string; author: string }[],
): GoodreadsImportPlan {
  const existingIsbns = new Set(
    existing.map((b) => b.isbn).filter((x): x is string => Boolean(x)),
  );
  const existingTitles = new Set(
    existing.map((b) => `${normalize(b.title)}|${normalize(b.author)}`),
  );

  const plan: GoodreadsImportPlan = {
    finished: [],
    reading: [],
    wishlist: [],
    skipped: [],
  };

  for (const row of rows) {
    const dup =
      (row.isbn && existingIsbns.has(row.isbn)) ||
      existingTitles.has(`${normalize(row.title)}|${normalize(row.author)}`);
    if (dup) {
      plan.skipped.push({ title: row.title, reason: "Already on your shelf" });
      continue;
    }
    if (row.shelf === "read") plan.finished.push(row);
    else if (row.shelf === "currently-reading") plan.reading.push(row);
    else if (row.shelf === "to-read") plan.wishlist.push(row);
    else plan.skipped.push({ title: row.title, reason: "No shelf assigned" });
  }

  return plan;
}

/** Cover art via Open Library, keyed on the imported ISBN. */
export function coverUrlForIsbn(isbn?: string): string | undefined {
  return isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : undefined;
}

/** Link out to the book's Goodreads page (by ISBN when we have one). */
export function goodreadsSearchUrl(book: {
  title: string;
  author: string;
  isbn?: string;
}): string {
  return `https://www.goodreads.com/search?q=${encodeURIComponent(
    book.isbn ?? `${book.title} ${book.author}`,
  )}`;
}
