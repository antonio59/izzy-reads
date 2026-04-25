import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Database, ArrowRight, CheckCircle, AlertCircle, Loader2, ImageIcon } from "lucide-react";
import { Card } from "./ui/Card";

export function CoverMigrationPanel() {
  const status = useQuery(api.migration.getMigrationStatus);
  const bulkMigrateBooks = useAction(api.migration.bulkMigrateBookCovers);
  const bulkMigrateWishlist = useAction(api.migration.bulkMigrateWishlistCovers);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    books?: {
      processed: number;
      successful: number;
      failed: number;
      skipped: number;
      totalPending: number;
      hasMore: boolean;
      nextOffset?: number;
      results: Array<{ bookId: string; title: string; success: boolean; oldUrl?: string; newUrl?: string; error?: string }>;
    };
    wishlist?: {
      processed: number;
      successful: number;
      failed: number;
      skipped: number;
      totalPending: number;
      hasMore: boolean;
      nextOffset?: number;
      results: Array<{ wishlistId: string; title: string; success: boolean; oldUrl?: string; newUrl?: string; error?: string }>;
    };
  } | null>(null);

  const runMigration = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      // Migrate books
      const bookResults = await bulkMigrateBooks({ batchSize: 10, dryRun: false });
      setResults((prev) => ({
        ...prev,
        books: {
          processed: bookResults.processed,
          successful: bookResults.successful,
          failed: bookResults.failed,
          skipped: bookResults.skipped,
          totalPending: bookResults.totalPending,
          hasMore: bookResults.hasMore,
          nextOffset: bookResults.nextOffset,
          results: bookResults.results,
        },
      }));

      // Migrate wishlist
      const wishlistResults = await bulkMigrateWishlist({ batchSize: 10, dryRun: false });
      setResults((prev) => ({
        ...prev,
        wishlist: {
          processed: wishlistResults.processed,
          successful: wishlistResults.successful,
          failed: wishlistResults.failed,
          skipped: wishlistResults.skipped,
          totalPending: wishlistResults.totalPending,
          hasMore: wishlistResults.hasMore,
          nextOffset: wishlistResults.nextOffset,
          results: wishlistResults.results,
        },
      }));
    } catch (error) {
      console.error("Migration failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  if (!status) {
    return (
      <Card variant="outlined" padding="md" className="shadow-sm border-cream-300">
        <div className="flex items-center gap-2 text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading migration status...
        </div>
      </Card>
    );
  }

  const totalToMigrate = status.books.withExternalUrl + status.wishlist.withExternalUrl;

  return (
    <Card variant="outlined" padding="md" className="shadow-sm border-cream-300 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-800">Cover Migration</h2>
          <p className="text-sm text-stone-500">Move book covers to permanent Convex storage</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
          <h3 className="font-bold text-stone-700 mb-3">Books</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Total</span>
              <span className="font-medium">{status.books.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">With external URL</span>
              <span className="font-medium text-amber-600">{status.books.withExternalUrl}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Already in Convex</span>
              <span className="font-medium text-green-600">{status.books.withConvexUrl}</span>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
          <h3 className="font-bold text-stone-700 mb-3">Wishlist</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Total</span>
              <span className="font-medium">{status.wishlist.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">With external URL</span>
              <span className="font-medium text-amber-600">{status.wishlist.withExternalUrl}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Already in Convex</span>
              <span className="font-medium text-green-600">{status.wishlist.withConvexUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Migration Button */}
      {totalToMigrate > 0 ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runMigration}
          disabled={isRunning}
          className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Migrating {results?.books ? "wishlist..." : "books..."}
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Migrate {totalToMigrate} Covers to Convex
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      ) : (
        <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">All covers migrated!</p>
            <p className="text-sm text-green-600">All book covers are now stored in Convex storage.</p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-cream-200 pt-4 space-y-4"
          >
            <h3 className="font-bold text-stone-700">Migration Results</h3>

            {results.books && (
              <div className="bg-cream-50 rounded-xl p-4">
                <h4 className="font-medium text-stone-700 mb-2">Books</h4>
                <div className="flex gap-4 mb-3">
                  <div className="text-sm">
                    <span className="text-green-600 font-semibold">{results.books.successful}</span>{" "}
                    <span className="text-stone-500">migrated</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-600 font-semibold">{results.books.failed}</span>{" "}
                    <span className="text-stone-500">failed</span>
                  </div>
                  {results.books.skipped > 0 && (
                    <div className="text-sm">
                      <span className="text-stone-400 font-semibold">{results.books.skipped}</span>{" "}
                      <span className="text-stone-400">already done</span>
                    </div>
                  )}
                </div>
                {results.books.hasMore && (
                  <p className="text-xs text-amber-600 mb-2">
                    ⚠️ {results.books.totalPending - results.books.processed} more books remaining — run migration again to continue.
                  </p>
                )}
                {results.books.failed > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {results.books.results
                      .filter((r) => !r.success)
                      .map((r) => (
                        <div key={r.bookId} className="text-xs flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {r.title}: {r.error}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {results.wishlist && (
              <div className="bg-cream-50 rounded-xl p-4">
                <h4 className="font-medium text-stone-700 mb-2">Wishlist</h4>
                <div className="flex gap-4 mb-3">
                  <div className="text-sm">
                    <span className="text-green-600 font-semibold">{results.wishlist.successful}</span>{" "}
                    <span className="text-stone-500">migrated</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-600 font-semibold">{results.wishlist.failed}</span>{" "}
                    <span className="text-stone-500">failed</span>
                  </div>
                  {results.wishlist.skipped > 0 && (
                    <div className="text-sm">
                      <span className="text-stone-400 font-semibold">{results.wishlist.skipped}</span>{" "}
                      <span className="text-stone-400">already done</span>
                    </div>
                  )}
                </div>
                {results.wishlist.hasMore && (
                  <p className="text-xs text-amber-600">
                    ⚠️ {results.wishlist.totalPending - results.wishlist.processed} more items remaining — run migration again to continue.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default CoverMigrationPanel;
