import { useState } from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PoemReactionButtons } from "./ReactionButtons";
import { usePublishedTranslations } from "../hooks/useContentTranslations";
import { OriginalLanguageToggle } from "./ui/OriginalLanguageToggle";

export const PUBLISHED_POEM_TITLE = "The Volcano";

/** Izzy's poem as printed in Wonderverse – school name intentionally omitted. */
const PUBLISHED_POEM = {
  title: PUBLISHED_POEM_TITLE,
  author: "Izzy",
  anthology: "Wonderverse: Dreamscapes and Daydreams",
  publisher: "Young Writers",
  page: 99,
  coverSrc: "/images/wonderverse-cover.jpg",
  stanzas: [
    "The volcano is a grumbler,\nHe reaches out high,\nHe stretches and belches,\nAs he touches the sky.",
    "The volcano is an artist,\nHe paints the whole sky,\nHe splishes and splashes,\nLike tears from a cry.",
    "The volcano is a baby,\nHe rumbles and cries,\nHe bosses his temper,\nAnd launches tears at the skies.",
    "The volcano is a country singer,\nHe yodels for a sound,\nGiving music to ears,\nHe goes round and round.",
    "The volcano is a grabber,\nEverything in his sight,\nHe gobbles it up,\nWith all of his might.",
  ],
} as const;

interface PublishedPoemFeatureProps {
  className?: string;
  /** The saved poem's id, so reactions are shared with its poem page */
  poemId?: string;
}

export function PublishedPoemFeature({
  className = "",
  poemId,
}: PublishedPoemFeatureProps) {
  const { prefersReducedMotion } = useMotionPreference();
  const { t } = useTranslation();
  const poem = PUBLISHED_POEM;
  const italian = usePublishedTranslations("poem").get(poemId ?? "");
  const [showOriginal, setShowOriginal] = useState(false);
  const useItalian = Boolean(italian) && !showOriginal;
  const title = useItalian ? (italian?.title ?? poem.title) : poem.title;
  const stanzas: readonly string[] = useItalian
    ? (italian?.body ?? "").split(/\n\s*\n/).map((st) => st.trim()).filter(Boolean)
    : poem.stanzas;

  return (
    <section
      aria-labelledby="published-poem-heading"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white shadow-xl ${className}`}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.25) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0 1px, transparent 2px), radial-gradient(circle at 40% 85%, rgba(255,255,255,0.2) 0 1px, transparent 2px)",
          backgroundSize: "120px 120px, 90px 90px, 150px 150px",
        }}
      />

      <div className="relative grid gap-8 md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,17rem)_1fr] items-start p-6 sm:p-10">
        <motion.figure
          className="mx-auto w-44 sm:w-56 md:w-full"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 18 }}
        >
          <img
            src={poem.coverSrc}
            alt={t("wonderverse.coverAlt", { anthology: poem.anthology })}
            width={580}
            height={895}
            loading="lazy"
            className="w-full rounded-lg shadow-2xl ring-1 ring-white/20"
          />
          <figcaption className="mt-3 text-center text-xs text-purple-200">
            {t("wonderverse.publishedBy", { publisher: poem.publisher, page: poem.page })}
          </figcaption>
        </motion.figure>

        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200 ring-1 ring-amber-200/30">
            <Sparkles className="w-3.5 h-3.5" aria-hidden />
            {t("wonderverse.badge")}
          </p>
          <h2
            id="published-poem-heading"
            className="mt-4 text-3xl sm:text-4xl font-display font-bold leading-tight !text-white"
          >
            {t("wonderverse.heading")}
          </h2>
          <p className="mt-2 text-purple-100 max-w-lg">
            <Trans
              i18nKey="wonderverse.chosenFor"
              values={{ anthology: poem.anthology }}
              components={{ em: <em /> }}
            />
          </p>

          <article className="mt-8 rounded-2xl bg-white/5 p-5 sm:p-7 ring-1 ring-white/10">
            <h3 className="text-2xl font-serif font-semibold !text-amber-100">{title}</h3>
            <div className="mt-4 space-y-4 font-serif text-lg leading-relaxed text-purple-50">
              {stanzas.map((stanza) => (
                <p key={stanza} className="whitespace-pre-line">
                  {stanza}
                </p>
              ))}
            </div>
            <p className="mt-6 font-display font-bold text-amber-200">
              – {poem.author}
            </p>
            {italian && (
              <OriginalLanguageToggle
                tone="dark"
                className="mt-4"
                showingOriginal={showOriginal}
                onToggle={() => setShowOriginal((v) => !v)}
              />
            )}
            {poemId && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <PoemReactionButtons poemId={poemId} />
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
