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
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-600/20">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-stone-900">
              Refresh covers
            </h2>
            <p className="text-sm text-stone-500 mt-1 leading-relaxed">
              Sharpen blurry thumbnails and save them permanently so Izzy&apos;s
              shelf and wishlist stay crisp.
            </p>
          </div>
        </div>

        {status && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <CoverStatCard
              label="Bookshelf"
              total={status.books.total}
              convex={status.books.withConvexUrl}
              external={status.books.withExternalUrl}
              missing={status.books.withoutCover}
              accent="primary"
            />
            <CoverStatCard
              label="Wishlist"
              total={status.wishlist.total}
              convex={status.wishlist.withConvexUrl}
              external={status.wishlist.withExternalUrl}
              missing={status.wishlist.withoutCover}
              accent="accent"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={running !== null}
            onClick={() => runRefresh("books")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-display font-bold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {running === "books" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh bookshelf
          </button>
          <button
            type="button"
            disabled={running !== null}
            onClick={() => runRefresh("wishlist")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white font-display font-bold text-sm hover:bg-accent-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {running === "wishlist" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh wishlist
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-red-800 bg-red-50 border border-red-100 rounded-xl p-3">
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
          <h3 className="font-display font-bold text-stone-800 mb-3">
            Recent results
          </h3>
          <ul className="space-y-1.5 text-sm text-stone-600 max-h-64 overflow-y-auto font-mono bg-cream-50 rounded-xl p-3 ring-1 ring-cream-200">
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

function CoverStatCard({
  label,
  total,
  convex,
  external,
  missing,
  accent,
}: {
  label: string;
  total: number;
  convex: number;
  external: number;
  missing: number;
  accent: "primary" | "accent";
}) {
  const savedPct = total > 0 ? Math.round((convex / total) * 100) : 0;
  const barColor = accent === "primary" ? "bg-primary-500" : "bg-accent-500";
  const textColor =
    accent === "primary" ? "text-primary-700" : "text-accent-700";

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50/50 p-4 ring-1 ring-cream-200">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-display font-bold text-stone-800">{label}</p>
        <p className={`text-2xl font-display font-bold tabular-nums ${textColor}`}>
          {savedPct}%
        </p>
      </div>
      <p className="text-xs text-stone-500 mb-2">{total} items total</p>

      <div className="h-2 rounded-full bg-cream-200 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${savedPct}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white px-2 py-2 ring-1 ring-cream-200">
          <p className="font-display font-bold text-emerald-700 tabular-nums">
            {convex}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">Saved</p>
        </div>
        <div className="rounded-lg bg-white px-2 py-2 ring-1 ring-cream-200">
          <p className="font-display font-bold text-amber-700 tabular-nums">
            {external}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">External</p>
        </div>
        <div className="rounded-lg bg-white px-2 py-2 ring-1 ring-cream-200">
          <p className="font-display font-bold text-stone-500 tabular-nums">
            {missing}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">Missing</p>
        </div>
      </div>
    </div>
  );
}
