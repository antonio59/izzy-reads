import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Languages } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { TranslationRow } from "../components/translations/TranslationRow";
import {
  STATUS_STYLES,
  type TranslationItem,
} from "../components/translations/translationStatus";

type StatusFilter = "todo" | TranslationItem["status"] | "all";
type TypeFilter = TranslationItem["contentType"] | "all";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "draft", label: STATUS_STYLES.draft.label },
  { value: "published", label: "Published" },
  { value: "all", label: "Everything" },
];

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "poem", label: "Poems" },
  { value: "review", label: "Reviews" },
  { value: "blogPost", label: "Writing" },
];

function matchesStatus(item: TranslationItem, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "todo") return item.status !== "published";
  return item.status === filter;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 px-3 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-primary-600 text-white"
          : "bg-white text-stone-600 ring-1 ring-cream-300 hover:ring-primary-300"
      }`}
    >
      {children}
    </button>
  );
}

/** Izzy's dashboard page for approving Italian versions of her writing. */
export default function TranslationsPage() {
  const items = useQuery(api.translations.listForAdmin);
  const suggestionsEnabled = useQuery(api.translations.suggestionsEnabled) ?? false;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todo");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const counts = useMemo(() => {
    const list = items ?? [];
    return {
      published: list.filter((i) => i.status === "published").length,
      total: list.length,
    };
  }, [items]);

  const visible = (items ?? []).filter(
    (item) =>
      matchesStatus(item, statusFilter) &&
      (typeFilter === "all" || item.contentType === typeFilter),
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
          <Languages className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-800">
            Italian 🇮🇹
          </h1>
          <p className="text-stone-500 mt-1 max-w-2xl">
            Share your poems, reviews and writing with your Italian family.
            Get a suggested translation, check it (maybe with someone who speaks
            Italian!), fix anything, then publish. Nothing shows in Italian until
            you publish it – until then, Italian visitors see your English.
          </p>
          {items && (
            <p className="text-sm text-stone-500 mt-2">
              <strong className="text-stone-700">{counts.published}</strong> of{" "}
              {counts.total} published in Italian
            </p>
          )}
        </div>
      </header>

      {items && !suggestionsEnabled && (
        <p className="text-sm text-amber-900 bg-amber-50 ring-1 ring-amber-200 rounded-xl px-4 py-3">
          Automatic suggestions aren&apos;t switched on yet, so you&apos;ll need
          to type the Italian yourself for now.
        </p>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((f) => (
            <Chip
              key={f.value}
              active={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {TYPE_FILTERS.map((f) => (
            <Chip
              key={f.value}
              active={typeFilter === f.value}
              onClick={() => setTypeFilter(f.value)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      {items === undefined ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-center text-stone-500 py-12">
          {statusFilter === "todo"
            ? "All done – everything here is published in Italian! 🎉"
            : "Nothing here yet."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <TranslationRow
              key={`${item.contentType}:${item.contentId}`}
              item={item}
              suggestionsEnabled={suggestionsEnabled}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
