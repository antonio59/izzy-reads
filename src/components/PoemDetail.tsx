import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Feather,
  Calendar,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { PoemReactionButtons } from "./ReactionButtons";

const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "fair",
  hairStyle: "long",
  hairColor: "brown",
  eyeColor: "brown",
  accessory: "none",
  background: "pink",
  outfit: "tshirt",
  outfitColor: "pink",
  expression: "happy",
};

const PoemDetail = () => {
  const { poemId } = useParams<{ poemId: string }>();
  const navigate = useNavigate();
  const { poems } = useBooks();
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();
  const [copied, setCopied] = useState(false);
  const remotePoem = useQuery(
    api.poems.getBySlug,
    poemId ? { slug: poemId } : "skip",
  );

  const contextPoem = poems.find((p) => p.slug === poemId || p.id === poemId);
  const poem = remotePoem
    ? {
        id: remotePoem._id,
        title: remotePoem.title,
        slug: remotePoem.slug,
        content: remotePoem.content,
        emoji: remotePoem.emoji,
        dateCreated: remotePoem.dateCreated,
        likes: remotePoem.likes,
        template: remotePoem.template,
      }
    : contextPoem;

  const poemIndex = poems.findIndex(
    (p) => p.slug === poemId || p.id === poemId || p.id === poem?.id,
  );

  const prevPoem = poemIndex > 0 ? poems[poemIndex - 1] : null;
  const nextPoem =
    poemIndex >= 0 && poemIndex < poems.length - 1
      ? poems[poemIndex + 1]
      : null;
  const readTime = poem
    ? Math.max(1, Math.ceil(poem.content.trim().split(/\s+/).length / 200))
    : 1;

  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [poemId]);

  const handleCopyText = async () => {
    if (!poem) return;
    const text = `${poem.title}\n\n${poem.content}\n\n— Izzy`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!poem) return;
    const poemUrl = `${window.location.origin}/poetry/${poem.slug || poem.id}`;
    const shareData = {
      title: poem.title,
      text: `Check out "${poem.title}" by Izzy on Izzy's Bookshelf!`,
      url: poemUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        await navigator.clipboard.writeText(poemUrl);
      }
    } else {
      await navigator.clipboard.writeText(poemUrl);
    }
  };

  if (poemId && remotePoem === undefined && !contextPoem) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
            className="max-w-md"
          >
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
              <Feather className="w-8 h-8 text-primary-400" aria-hidden />
            </div>
            <h1 className="font-accent text-3xl sm:text-4xl font-semibold text-stone-900 mb-3">
              Poem not found
            </h1>
            <p className="text-stone-500 mb-8 leading-relaxed">
              This poem seems to have wandered off…
            </p>
            <Link
              to="/poetry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-display font-bold text-sm shadow-md shadow-primary-600/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Poetry
            </Link>
          </motion.div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const poemUrl = `${window.location.origin}/poetry/${poem.slug || poem.id}`;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>{`${poem.title} | Izzy's Poetry Corner`}</title>
        <meta
          name="description"
          content={`Read "${poem.title}" - a poem by Izzy on Izzy's Bookshelf.`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`${poem.title} | Izzy's Poetry Corner`}
        />
        <meta
          property="og:description"
          content={`Read "${poem.title}" - a poem by Izzy on Izzy's Bookshelf.`}
        />
        <meta property="og:url" content={poemUrl} />
        <meta
          property="og:image"
          content={`${window.location.origin}/og-image.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${poem.title} | Izzy's Poetry Corner`}
        />
        <meta
          name="twitter:description"
          content={`Read "${poem.title}" - a poem by Izzy on Izzy's Bookshelf.`}
        />
      </Helmet>

      <PublicNav />

      {/* Soft hero wash + reading layout */}
      <section className="relative overflow-hidden flex-1">
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 0%, rgba(217,70,168,0.10), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(13,148,136,0.08), transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Toolbar — quiet, not a sticky bar */}
          <div className="flex items-center justify-between gap-3 mb-8 sm:mb-10">
            <button
              type="button"
              onClick={() => navigate("/poetry")}
              className="inline-flex items-center gap-2 text-stone-500 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Poetry
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-stone-600 hover:text-stone-800 text-sm font-medium transition-colors"
                title="Copy poem text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <motion.article
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Title & meta */}
            <header className="text-center mb-8 sm:mb-10">
              {poem.template && (
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-3">
                  {poem.template}
                </p>
              )}
              <h1 className="font-accent text-3xl sm:text-4xl md:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.1] mb-4">
                {poem.title}
              </h1>
              <div className="flex items-center justify-center gap-3 text-stone-400 text-sm flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden />
                  {new Date(poem.dateCreated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300" aria-hidden />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden />
                  {readTime} min read
                </span>
              </div>
            </header>

            {/* Poem body — open serif reading */}
            <p className="text-lg sm:text-xl text-stone-700 font-serif leading-relaxed whitespace-pre-wrap text-center px-2 sm:px-4">
              {poem.content}
            </p>

            {/* Attribution */}
            <div className="mt-12 pt-8 border-t border-cream-300">
              <div className="flex items-center justify-center gap-3">
                <div className="rounded-full overflow-hidden ring-2 ring-primary-100 shadow-sm">
                  <AvatarPreview config={userAvatar} size="sm" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-stone-800 text-sm">
                    Written by Izzy
                  </p>
                  <p className="text-stone-500 text-xs">Young poet & dreamer</p>
                </div>
              </div>
            </div>

            {/* Reactions */}
            <div className="mt-8 pt-8 border-t border-cream-300">
              <p className="text-xs font-semibold text-stone-400 text-center mb-3 uppercase tracking-wider">
                React to this poem
              </p>
              <div className="flex justify-center">
                <PoemReactionButtons poemId={poem.id} size="sm" />
              </div>
            </div>

            {/* Prev / Next */}
            {(prevPoem || nextPoem) && (
              <nav
                className="mt-8 pt-8 border-t border-cream-300"
                aria-label="Poem navigation"
              >
                <div className="flex items-stretch justify-between gap-4">
                  {prevPoem ? (
                    <Link
                      to={`/poetry/${prevPoem.slug || prevPoem.id}`}
                      className="group flex items-center gap-2 flex-1 min-w-0 py-2"
                    >
                      <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-primary-600 flex-shrink-0 transition-colors" />
                      <div className="min-w-0 text-left">
                        <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                          Previous
                        </p>
                        <p className="text-sm font-display font-bold text-stone-700 group-hover:text-primary-700 truncate transition-colors">
                          {prevPoem.title}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {nextPoem ? (
                    <Link
                      to={`/poetry/${nextPoem.slug || nextPoem.id}`}
                      className="group flex items-center gap-2 flex-1 min-w-0 py-2 justify-end"
                    >
                      <div className="min-w-0 text-right">
                        <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                          Next
                        </p>
                        <p className="text-sm font-display font-bold text-stone-700 group-hover:text-primary-700 truncate transition-colors">
                          {nextPoem.title}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary-600 flex-shrink-0 transition-colors" />
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              </nav>
            )}
          </motion.article>
        </div>
      </section>

      {/* More poems */}
      {poems.length > 1 && (
        <section className="py-10 sm:py-12 px-4 border-t border-cream-300">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-display font-bold text-stone-800 text-center mb-6">
              More poems
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
              {poems
                .filter((p) => p.id !== poem.id)
                .slice(0, 6)
                .map((otherPoem) => (
                  <Link
                    key={otherPoem.id}
                    to={`/poetry/${otherPoem.slug || otherPoem.id}`}
                    className="group flex-shrink-0 w-56 snap-start"
                  >
                    <h3 className="font-display font-bold text-stone-800 text-sm mb-1.5 group-hover:text-primary-700 transition-colors line-clamp-1">
                      {otherPoem.title}
                    </h3>
                    <p className="text-stone-500 text-xs line-clamp-3 font-serif italic leading-relaxed">
                      {otherPoem.content.substring(0, 100)}
                      {otherPoem.content.length > 100 ? "…" : ""}
                    </p>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-6">
              <Link
                to="/poetry"
                className="inline-flex items-center gap-1.5 text-primary-600 font-semibold hover:text-primary-700 transition-colors text-sm"
              >
                View all {poems.length} poems
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
            }
            transition={prefersReducedMotion ? { duration: 0 } : undefined}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-full shadow-lg"
          >
            Poem copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  );
};

export default PoemDetail;
