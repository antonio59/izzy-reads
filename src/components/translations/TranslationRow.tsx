import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { ChevronDown, Sparkles, Check, EyeOff, Save } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui";
import { STATUS_STYLES, type TranslationItem } from "./translationStatus";

const TYPE_LABELS: Record<TranslationItem["contentType"], string> = {
  poem: "Poem",
  review: "Review",
  blogPost: "Writing",
};

function errorMessage(error: unknown): string {
  if (error instanceof ConvexError) return String(error.data);
  return "Something went wrong – please try again.";
}

interface TranslationRowProps {
  item: TranslationItem;
  suggestionsEnabled: boolean;
}

/** One poem / review / post: English on the left, Izzy's Italian on the right. */
export function TranslationRow({ item, suggestionsEnabled }: TranslationRowProps) {
  const [open, setOpen] = useState(false);
  // Local edits; null means "show what's saved on the server"
  const [edit, setEdit] = useState<{ title: string; body: string } | null>(null);
  const [busy, setBusy] = useState<"suggest" | "save" | "publish" | "unpublish" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const suggest = useAction(api.translations.suggest);
  const saveDraft = useMutation(api.translations.saveDraft);
  const publish = useMutation(api.translations.publish);
  const unpublish = useMutation(api.translations.unpublish);

  const hasTitle = item.englishTitle !== undefined;
  const title = edit?.title ?? item.draftTitle ?? "";
  const body = edit?.body ?? item.draftBody;
  const isDirty = edit !== null;
  const ref = { contentType: item.contentType, contentId: item.contentId };
  const status = STATUS_STYLES[item.status];

  const run = async (
    kind: NonNullable<typeof busy>,
    task: () => Promise<unknown>,
    done: string,
  ) => {
    setBusy(kind);
    setError("");
    setNotice("");
    try {
      await task();
      setNotice(done);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const handleSuggest = () => {
    if (
      body.trim() &&
      !window.confirm("Replace the Italian below with a new suggestion?")
    ) {
      return;
    }
    void run(
      "suggest",
      async () => {
        await suggest(ref);
        setEdit(null);
      },
      "New suggestion ready – read it through, tweak anything, then publish.",
    );
  };

  const saveIfDirty = async () => {
    if (!isDirty) return;
    await saveDraft({ ...ref, title: hasTitle ? title : undefined, body });
    setEdit(null);
  };

  const handleSave = () =>
    void run("save", saveIfDirty, "Saved – not public yet.");

  const handlePublish = () =>
    void run(
      "publish",
      async () => {
        await saveIfDirty();
        await publish(ref);
      },
      "Published! Italian visitors will now see this version.",
    );

  const handleUnpublish = () =>
    void run(
      "unpublish",
      () => unpublish(ref),
      "Unpublished – Italian visitors will see your English again.",
    );

  const onChange = (next: Partial<{ title: string; body: string }>) =>
    setEdit({ title, body, ...next });

  return (
    <li className="rounded-2xl bg-white ring-1 ring-cream-300 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cream-50 transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-accent-600 w-16 shrink-0">
          {TYPE_LABELS[item.contentType]}
        </span>
        <span className="flex-1 min-w-0 font-display font-bold text-stone-800 truncate">
          {item.label}
        </span>
        <span className={`hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-cream-200 p-4 space-y-4">
          <span className={`sm:hidden inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>

          <div className="grid md:grid-cols-2 gap-4">
            <section aria-label="English original">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                🇬🇧 Your English
              </h3>
              <div className="rounded-xl bg-cream-50 ring-1 ring-cream-200 p-3 text-sm text-stone-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {hasTitle && (
                  <p className="font-display font-bold mb-2">{item.englishTitle}</p>
                )}
                {item.englishBody}
              </div>
            </section>

            <section aria-label="Italian version">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                🇮🇹 Italian
              </h3>
              {hasTitle && (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onChange({ title: e.target.value })}
                  placeholder="Italian title"
                  aria-label="Italian title"
                  className="w-full mb-2 px-3 py-2 rounded-xl border border-cream-300 text-sm font-display font-bold focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              )}
              <textarea
                value={body}
                onChange={(e) => onChange({ body: e.target.value })}
                rows={10}
                placeholder={
                  suggestionsEnabled
                    ? "Tap “Suggest Italian” for a first draft, or type your own."
                    : "Type the Italian version here."
                }
                aria-label="Italian text"
                className="w-full px-3 py-2 rounded-xl border border-cream-300 text-sm leading-relaxed focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </section>
          </div>

          {item.englishChanged && (
            <p className="text-sm text-orange-800 bg-orange-50 rounded-xl px-3 py-2">
              You changed the English after publishing the Italian. Suggest again
              or update the Italian, then publish.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-error-700 bg-error-50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {notice && !error && (
            <p role="status" className="text-sm text-green-800 bg-green-50 rounded-xl px-3 py-2">
              {notice}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {suggestionsEnabled && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
                loading={busy === "suggest"}
                disabled={busy !== null}
                onClick={handleSuggest}
              >
                {body.trim() ? "Suggest again" : "Suggest Italian"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={<Save className="w-4 h-4" />}
              loading={busy === "save"}
              disabled={busy !== null || !isDirty}
              onClick={handleSave}
            >
              Save draft
            </Button>
            <Button
              variant="success"
              size="sm"
              icon={<Check className="w-4 h-4" />}
              loading={busy === "publish"}
              disabled={
                busy !== null ||
                !body.trim() ||
                (item.isPublished && !isDirty && !item.hasUnpublishedChanges && !item.englishChanged)
              }
              onClick={handlePublish}
            >
              {item.isPublished ? "Publish changes" : "Approve & publish"}
            </Button>
            {item.isPublished && (
              <Button
                variant="ghost"
                size="sm"
                icon={<EyeOff className="w-4 h-4" />}
                loading={busy === "unpublish"}
                disabled={busy !== null}
                onClick={handleUnpublish}
              >
                Unpublish
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default TranslationRow;
