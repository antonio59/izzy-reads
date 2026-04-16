import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Feather, Calendar, Sparkles, Share2, Copy, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";
import { PoemReactionButtons } from "./ReactionButtons";

const BACKGROUND_PATTERNS = [
  "from-violet-100 via-purple-50 to-fuchsia-100",
  "from-sky-100 via-cyan-50 to-teal-100",
  "from-amber-100 via-yellow-50 to-orange-100",
  "from-emerald-100 via-green-50 to-teal-100",
  "from-rose-100 via-pink-50 to-fuchsia-100",
  "from-indigo-100 via-blue-50 to-violet-100",
];

const PoemDetail = () => {
  const { poemId } = useParams<{ poemId: string }>();
  const navigate = useNavigate();
  const { poems } = useBooks();
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  // Support both slug and id for backward compatibility
  const poem = poems.find((p) => p.slug === poemId || p.id === poemId);
  const poemIndex = poems.findIndex((p) => p.slug === poemId || p.id === poemId);

  const prevPoem = poemIndex > 0 ? poems[poemIndex - 1] : null;
  const nextPoem = poemIndex < poems.length - 1 ? poems[poemIndex + 1] : null;
  const readTime = poem ? Math.max(1, Math.ceil(poem.content.trim().split(/\s+/).length / 200)) : 1;

  const defaultAvatar: AvatarConfig = {
    skinTone: "fair",
    hairStyle: "long",
    hairColor: "brown",
    eyeColor: "brown",
    accessory: "none",
    background: "pink",
    outfit: "tshirt",
    outfitColor: "purple",
    expression: "happy",
  };
  const userAvatar = user?.avatar || defaultAvatar;

  // Scroll to top when poem loads
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

  if (!poem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Feather className="w-12 h-12 text-violet-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-stone-800 mb-3">
              Poem Not Found
            </h1>
            <p className="text-stone-500 mb-6">
              This poem seems to have wandered off...
            </p>
            <Link
              to="/poetry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Poetry Corner
            </Link>
          </motion.div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const backgroundPattern = BACKGROUND_PATTERNS[poemIndex % BACKGROUND_PATTERNS.length];

  const poemUrl = `${window.location.origin}/poetry/${poem.slug || poem.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      <Helmet>
        <title>{`${poem.title} | Izzy's Poetry Corner`}</title>
        <meta name="description" content={`Read "${poem.title}" - a poem by Izzy on Izzy's Bookshelf.`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${poem.title} | Izzy's Poetry Corner`} />
        <meta property="og:description" content={`Read "${poem.title}" - a poem by Izzy on Izzy's Bookshelf.`} />
        <meta property="og:url" content={poemUrl} />
        <meta property="og:image" content={`${window.location.origin}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${poem.title} | Izzy's Poetry Corner`} />
        <meta name="twitter:description" content={`Read "${poem.title}" - a poem by Izzy on Izzy's Bookshelf.`} />
      </Helmet>
      <PublicNav />

      {/* Compact Top Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-violet-100 sticky top-[57px] z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.button
            onClick={() => navigate("/poetry")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-stone-600 hover:bg-violet-50 hover:text-violet-700 transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <div className="flex items-center gap-2">
            {poem.template && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-violet-50 rounded-full text-xs font-bold text-violet-700">
                <Sparkles className="w-3 h-3" />
                {poem.template}
              </span>
            )}
            <motion.button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Copy poem text"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </motion.button>
            <motion.button
              onClick={async () => {
                const shareData = {
                  title: poem.title,
                  text: `Check out "${poem.title}" by Izzy on Izzy's Bookshelf!`,
                  url: poemUrl,
                };
                if (navigator.share) {
                  try { await navigator.share(shareData); } catch { await navigator.clipboard.writeText(poemUrl); }
                } else {
                  await navigator.clipboard.writeText(poemUrl);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-full text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Elegant Poem Card */}
      <main className="px-4 py-6 md:py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden"
          >
            {/* Decorative gradient header strip */}
            <div className={`h-3 bg-gradient-to-r ${backgroundPattern}`} />

            <div className="p-6 md:p-10">
              {/* Title & Date */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-display font-bold text-stone-800 mb-2 leading-tight">
                  {poem.title}
                </h1>
                <div className="flex items-center justify-center gap-3 text-stone-400 text-sm flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(poem.dateCreated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readTime} min read
                  </span>
                </div>
                {poem.template && (
                  <span className="sm:hidden inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-violet-50 rounded-full text-[10px] font-bold text-violet-700">
                    <Sparkles className="w-3 h-3" />
                    {poem.template}
                  </span>
                )}
              </div>

              {/* Poem content */}
              <div className="relative">
                <span className="absolute -top-2 -left-2 text-4xl text-violet-200 font-serif select-none">
                  &ldquo;
                </span>
                <p className="text-lg md:text-xl text-stone-700 font-serif leading-relaxed whitespace-pre-wrap text-center px-4 md:px-6">
                  {poem.content}
                </p>
                <span className="absolute -bottom-6 -right-2 text-4xl text-violet-200 font-serif select-none">
                  &rdquo;
                </span>
              </div>

              {/* Author signature - compact horizontal */}
              <div className="mt-10 pt-6 border-t border-stone-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-violet-100">
                    <AvatarPreview config={userAvatar} size="sm" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-stone-800 text-sm">Written by Izzy</p>
                    <p className="text-stone-500 text-xs">Young Poet & Dreamer</p>
                  </div>
                </div>
              </div>

              {/* Reactions - compact horizontal row */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-500 text-center mb-3 uppercase tracking-wide">
                  React to this poem
                </p>
                <div className="flex justify-center">
                  <PoemReactionButtons poemId={poem.id} size="sm" />
                </div>
              </div>

              {/* Prev / Next Navigation */}
              {(prevPoem || nextPoem) && (
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <div className="flex items-center justify-between gap-3">
                    {prevPoem ? (
                      <Link
                        to={`/poetry/${prevPoem.slug || prevPoem.id}`}
                        className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 hover:bg-violet-50 border border-stone-100 hover:border-violet-100 transition-all flex-1 min-w-0"
                      >
                        <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-violet-500 flex-shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className="text-[10px] uppercase tracking-wide text-stone-400 font-semibold">Previous</p>
                          <p className="text-sm font-display font-bold text-stone-700 group-hover:text-violet-700 truncate">
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
                        className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 hover:bg-violet-50 border border-stone-100 hover:border-violet-100 transition-all flex-1 min-w-0"
                      >
                        <div className="min-w-0 text-right flex-1">
                          <p className="text-[10px] uppercase tracking-wide text-stone-400 font-semibold">Next</p>
                          <p className="text-sm font-display font-bold text-stone-700 group-hover:text-violet-700 truncate">
                            {nextPoem.title}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-violet-500 flex-shrink-0" />
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* More Poems - horizontal scroll */}
      {poems.length > 1 && (
        <section className="py-6 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-base font-bold text-stone-600 text-center mb-4">
              More Poems
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
              {poems
                .filter((p) => p.id !== poem.id)
                .slice(0, 6)
                .map((otherPoem) => (
                  <Link
                    key={otherPoem.id}
                    to={`/poetry/${otherPoem.slug || otherPoem.id}`}
                    className="group flex-shrink-0 w-56 snap-start"
                  >
                    <motion.div
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-stone-100 hover:-translate-y-1"
                      whileHover={{ y: -2 }}
                    >
                      <h3 className="font-display font-bold text-stone-800 text-sm mb-1 group-hover:text-violet-600 transition-colors line-clamp-1">
                        {otherPoem.title}
                      </h3>
                      <p className="text-stone-400 text-xs line-clamp-2 font-serif italic">
                        {otherPoem.content.substring(0, 80)}...
                      </p>
                    </motion.div>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-2">
              <Link
                to="/poetry"
                className="inline-flex items-center gap-1 text-violet-600 font-semibold hover:text-violet-700 transition-colors text-sm"
              >
                View all {poems.length} poems
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Toast for copied text */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
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
