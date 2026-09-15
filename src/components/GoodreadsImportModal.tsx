import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  BookMarked,
  Heart,
  Loader2,
} from "lucide-react";
import { Modal, ModalFooter } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useBooks } from "../contexts/BookContext";
import {
  parseGoodreadsCsv,
  planGoodreadsImport,
  coverUrlForIsbn,
  type GoodreadsImportPlan,
  type GoodreadsRow,
} from "../lib/goodreads";
import type { Book } from "../types";

interface GoodreadsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = "pick" | "preview" | "importing" | "done" | "error";

function rowToBook(row: GoodreadsRow, isRead: boolean): Omit<Book, "id"> {
  return {
    title: row.title,
    author: row.author,
    coverUrl: coverUrlForIsbn(row.isbn),
    isbn: row.isbn,
    genre: "Fiction",
    pageCount: row.pageCount,
    ageRating: "8+",
    dateAdded: row.dateAdded ?? new Date().toISOString().split("T")[0],
    dateRead: isRead ? row.dateRead : undefined,
    rating: isRead ? row.rating : undefined,
    isRead,
    notes: isRead ? row.review : undefined,
  };
}

function rowToWishlistItem(row: GoodreadsRow): Omit<Book, "id"> {
  return {
    title: row.title,
    author: row.author,
    coverUrl: coverUrlForIsbn(row.isbn),
    isbn: row.isbn,
    genre: "Fiction",
    pageCount: row.pageCount,
    ageRating: "8+",
    dateAdded: row.dateAdded ?? new Date().toISOString().split("T")[0],
    isRead: false,
  };
}

export function GoodreadsImportModal({
  isOpen,
  onClose,
}: GoodreadsImportModalProps) {
  const { books, wishlist, bulkAddBooks, bulkAddToWishlist } = useBooks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [plan, setPlan] = useState<GoodreadsImportPlan | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setPhase("pick");
    setPlan(null);
    setFileName("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (phase === "importing") return;
    reset();
    onClose();
  };

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const rows = parseGoodreadsCsv(text);
      if (rows.length === 0) {
        throw new Error("No books found in this file.");
      }
      setFileName(file.name);
      setPlan(planGoodreadsImport(rows, [...books, ...wishlist]));
      setPhase("preview");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't read that file.",
      );
      setPhase("error");
    }
  };

  const handleImport = async () => {
    if (!plan) return;
    setPhase("importing");
    try {
      const toShelf = [
        ...plan.finished.map((r) => rowToBook(r, true)),
        ...plan.reading.map((r) => rowToBook(r, false)),
      ];
      const toWishlist = plan.wishlist.map(rowToWishlistItem);

      if (toShelf.length > 0) await bulkAddBooks(toShelf);
      if (toWishlist.length > 0) await bulkAddToWishlist(toWishlist);
      setPhase("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Import failed – try again.",
      );
      setPhase("error");
    }
  };

  const totalToImport = plan
    ? plan.finished.length + plan.reading.length + plan.wishlist.length
    : 0;

  const previewRows = plan
    ? [
        ...plan.finished.map((r) => ({ row: r, dest: "Finished" as const })),
        ...plan.reading.map((r) => ({ row: r, dest: "Reading" as const })),
        ...plan.wishlist.map((r) => ({ row: r, dest: "Wishlist" as const })),
      ]
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import from Goodreads"
      description="Bring your Goodreads library over in one go."
      size="lg"
      closeOnOverlayClick={phase !== "importing"}
    >
      {phase === "pick" && (
        <div className="space-y-4">
          <ol className="text-sm text-stone-600 space-y-2 list-decimal list-inside">
            <li>
              On Goodreads, go to <strong>My Books → Import/Export</strong> and
              choose <strong>Export Library</strong>.
            </li>
            <li>Download the CSV file it gives you.</li>
            <li>Upload it here – we'll sort everything into place.</li>
          </ol>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-primary-200 hover:border-primary-400 hover:bg-primary-50/50 rounded-2xl p-8 text-center transition-colors group"
          >
            <Upload className="w-8 h-8 mx-auto text-primary-400 group-hover:text-primary-500 mb-2" />
            <p className="font-display font-bold text-stone-800">
              Choose your Goodreads CSV
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Usually called goodreads_library_export.csv
            </p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-sm text-red-800 bg-red-50 border border-red-100 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={reset}>
              Try again
            </Button>
          </ModalFooter>
        </div>
      )}

      {phase === "preview" && plan && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{fileName}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
              <BookOpen className="w-4 h-4 mx-auto text-green-600 mb-1" />
              <p className="text-xl font-display font-bold text-green-700">
                {plan.finished.length}
              </p>
              <p className="text-xs text-green-700/80">Finished</p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
              <BookMarked className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <p className="text-xl font-display font-bold text-blue-700">
                {plan.reading.length}
              </p>
              <p className="text-xs text-blue-700/80">Reading</p>
            </div>
            <div className="rounded-xl bg-primary-50 border border-primary-100 p-3 text-center">
              <Heart className="w-4 h-4 mx-auto text-primary-600 mb-1" />
              <p className="text-xl font-display font-bold text-primary-700">
                {plan.wishlist.length}
              </p>
              <p className="text-xs text-primary-700/80">Wishlist</p>
            </div>
          </div>

          {previewRows.length > 0 && (
            <ul className="max-h-56 overflow-y-auto divide-y divide-stone-100 rounded-xl border border-stone-200">
              {previewRows.map(({ row, dest }, i) => (
                <li
                  key={`${row.title}-${i}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-stone-800 truncate">
                      {row.title}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {row.author}
                      {row.rating ? ` · ${row.rating}★` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                      dest === "Finished"
                        ? "bg-green-100 text-green-700"
                        : dest === "Reading"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {dest}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {plan.skipped.length > 0 && (
            <p className="text-xs text-stone-500">
              {plan.skipped.length} {plan.skipped.length === 1 ? "book" : "books"} skipped
              (already on your shelf or missing a shelf).
            </p>
          )}

          <ModalFooter>
            <Button variant="secondary" onClick={reset}>
              Pick a different file
            </Button>
            <Button
              variant="primary"
              onClick={() => void handleImport()}
              disabled={totalToImport === 0}
            >
              Import {totalToImport}{" "}
              {totalToImport === 1 ? "book" : "books"}
            </Button>
          </ModalFooter>
        </div>
      )}

      {phase === "importing" && (
        <div className="py-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary-500 mb-3" />
          <p className="font-display font-bold text-stone-800">
            Adding your books…
          </p>
          <p className="text-sm text-stone-500 mt-1">
            Keep this open for a few seconds.
          </p>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-display font-bold">Import complete!</p>
              <p className="mt-0.5">
                Added {plan ? plan.finished.length : 0} finished,{" "}
                {plan ? plan.reading.length : 0} reading, and{" "}
                {plan ? plan.wishlist.length : 0} wishlist{" "}
                {totalToImport === 1 ? "book" : "books"}.
              </p>
            </div>
          </div>
          <ModalFooter>
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </ModalFooter>
        </div>
      )}
    </Modal>
  );
}

export default GoodreadsImportModal;
