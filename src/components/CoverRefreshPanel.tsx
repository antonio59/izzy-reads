import { useCallback, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Image,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../convex/_generated/api";

type CoverTarget = "books" | "wishlist";

export function CoverRefreshPanel() {
  const status = useQuery(api.migration.getMigrationStatus);
  const refreshLibraryCovers = useAction(api.covers.refreshLibraryCovers);

  const [running, setRunning] = useState<CoverTarget | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [summary, setSummary] = useState<{
    stored: number;
    upgraded: number;
    failed: number;
    skipped: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runRefresh = useCallback(
    async (target: CoverTarget) => {
      setRunning(target);
      setError(null);
      setLog([]);
      setSummary({ stored: 0, upgraded: 0, failed: 0, skipped: 0 });

      let offset = 0;
      let hasMore = true;
      const totals = { stored: 0, upgraded: 0, failed: 0, skipped: 0 };

      try {
        while (hasMore) {
          const result = await refreshLibraryCovers({
            target,
            batchSize: 8,
            offset,
          });

          totals.stored += result.stored;
          totals.upgraded += result.upgraded;
          totals.failed += result.failed;
          totals.skipped += result.skipped;
          setSummary({ ...totals });

          const batchLines = result.results.map(
            (r) => `${r.title}: ${r.status}`,
          );
          setLog((prev) => [...batchLines, ...prev].slice(0, 40));

          hasMore = result.hasMore;
          offset = result.nextOffset ?? offset + result.processed;

          if (result.totalPending === 0) {
            setLog((prev) => [
              `No external ${target} covers left to refresh.`,
              ...prev,
            ]);
            break;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setRunning(null);
      }
    },
    [refreshLibraryCovers],
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Refresh covers</h2>
            <p className="text-sm text-stone-600 mt-1">
              Sharpen blurry Google/Open Library thumbnails and save them to
              Convex so they stay clear and permanent.
            </p>
          </div>
        </div>

        {status && (
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <StatCard
              label="Bookshelf covers"
              total={status.books.total}
              convex={status.books.withConvexUrl}
              external={status.books.withExternalUrl}
              missing={status.books.withoutCover}
            />
            <StatCard
              label="Wishlist covers"
              total={status.wishlist.total}
              convex={status.wishlist.withConvexUrl}
              external={status.wishlist.withExternalUrl}
              missing={status.wishlist.withoutCover}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={running !== null}
            onClick={() => runRefresh("books")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {running === "books" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh bookshelf covers
          </button>
          <button
            type="button"
            disabled={running !== null}
            onClick={() => runRefresh("wishlist")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white font-semibold text-sm hover:bg-accent-700 disabled:opacity-60 transition-colors"
          >
            {running === "wishlist" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh wishlist covers
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {summary && !running && !error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl p-3"
          >
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Done — stored {summary.stored}, sharpened {summary.upgraded},
              skipped {summary.skipped}, failed {summary.failed}.
            </span>
          </motion.div>
        )}
      </div>

      {log.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-6">
          <h3 className="font-bold text-stone-800 mb-3">Recent results</h3>
          <ul className="space-y-1.5 text-sm text-stone-600 max-h-64 overflow-y-auto font-mono">
            {log.map((line, i) => (
              <li key={`${line}-${i}`} className="truncate">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  total,
  convex,
  external,
  missing,
}: {
  label: string;
  total: number;
  convex: number;
  external: number;
  missing: number;
}) {
  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50/60 p-4">
      <p className="text-sm font-semibold text-stone-800 mb-2">{label}</p>
      <p className="text-xs text-stone-500 mb-2">{total} items</p>
      <div className="space-y-1 text-xs text-stone-600">
        <div className="flex justify-between">
          <span>Saved (Convex)</span>
          <span className="font-medium text-emerald-700">{convex}</span>
        </div>
        <div className="flex justify-between">
          <span>External (refreshable)</span>
          <span className="font-medium text-amber-700">{external}</span>
        </div>
        <div className="flex justify-between">
          <span>Missing</span>
          <span className="font-medium text-stone-500">{missing}</span>
        </div>
      </div>
    </div>
  );
}
