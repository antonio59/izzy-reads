import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { WritingReactionButtons } from "./ReactionButtons";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";

const DEFAULT_AVATAR: AvatarConfig = {
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

const PublicBlog = () => {
  const { blogPosts } = useBooks();
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();
  const [selectedPost, setSelectedPost] = useState<
    (typeof blogPosts)[0] | null
  >(null);

  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  const sortedPosts = [...blogPosts]
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );

  const renderContent = (content: string) => {
    const parts = content.split(/(!\[GIF\]\([^)]+\))/g);
    return parts.map((part, idx) => {
      const gifMatch = part.match(/!\[GIF\]\(([^)]+)\)/);
      if (gifMatch) {
        return (
          <img
            key={idx}
            src={gifMatch[1]}
            alt="GIF"
            className="max-w-full h-auto rounded-xl my-4 mx-auto"
          />
        );
      }
      return (
        <span key={idx} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  const getPreviewText = (content: string): string =>
    content.replace(/!\[GIF\]\([^)]+\)/g, "").trim();

  useEffect(() => {
    if (!selectedPost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  const pageUrl = `${window.location.origin}/blog`;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>Izzy&apos;s Writing | Izzy&apos;s Bookshelf</title>
        <meta
          name="description"
          content="Thoughts, reading adventures, and stories from Izzy's reading journey."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Izzy's Writing" />
        <meta
          property="og:description"
          content="Thoughts, reading adventures, and stories from Izzy's reading journey."
        />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:image"
          content={`${window.location.origin}/og-image.png`}
        />
      </Helmet>

      <PublicNav />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 0%, rgba(217,70,168,0.10), transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(13,148,136,0.10), transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 sm:pt-14 pb-8 text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <p className="font-accent text-sm sm:text-base text-primary-600 tracking-wide mb-3">
              Thoughts & adventures
            </p>
            <h1 className="font-accent text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.05] mb-3">
              Writing
            </h1>
            <p className="text-base text-stone-500 max-w-md mx-auto leading-relaxed">
              Stories from my reading journey — challenges, adventures, and ideas.
            </p>
            {sortedPosts.length > 0 && (
              <p className="mt-5 text-sm text-stone-400">
                <span className="font-display font-bold text-stone-700 tabular-nums">
                  {sortedPosts.length}
                </span>{" "}
                {sortedPosts.length === 1 ? "post" : "posts"}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {sortedPosts.length > 0 ? (
            <div className="space-y-10 sm:space-y-12 divide-y divide-cream-300">
              {sortedPosts.map((post, index) => {
                const previewText = getPreviewText(post.content);
                return (
                  <button
                    type="button"
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`group block w-full text-left ${index === 0 ? "" : "pt-10 sm:pt-12"}`}
                  >
                    <motion.article
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { delay: Math.min(index * 0.04, 0.2) }
                      }
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                        {post.tags?.[0] && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                            {post.tags[0]}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                          <Calendar className="w-3 h-3" aria-hidden />
                          {new Date(post.dateCreated).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 group-hover:text-primary-700 transition-colors leading-snug mb-3">
                        {post.title}
                      </h2>
                      <p className="text-stone-600 leading-relaxed line-clamp-3">
                        {previewText || "Open to read more…"}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-4 text-primary-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                        Read post <ArrowRight className="w-4 h-4" />
                      </span>
                    </motion.article>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                Writing coming soon
              </h3>
              <p className="text-stone-500 max-w-md mx-auto">
                Soon I&apos;ll share reading challenges, book adventures, and
                stories here.
              </p>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-stone-900/45 backdrop-blur-[2px]"
              aria-label="Close"
              onClick={() => setSelectedPost(null)}
            />
            <motion.div
              className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 40 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
            >
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-cream-200"
                aria-label="Close post"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>

              <div className="p-6 sm:p-10 pt-14">
                <p className="text-xs text-stone-400 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden />
                  {new Date(selectedPost.dateCreated).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
                <h2
                  id="post-title"
                  className="text-3xl font-display font-bold text-stone-900 mb-4"
                >
                  {selectedPost.title}
                </h2>

                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed mb-8">
                  {renderContent(selectedPost.content)}
                </div>

                <div className="pt-6 border-t border-cream-200 mb-6">
                  <p className="text-sm font-medium text-stone-500 mb-3">
                    What do you think?
                  </p>
                  <WritingReactionButtons postId={selectedPost.id} />
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-cream-200">
                  <div className="rounded-full overflow-hidden ring-2 ring-primary-100">
                    <AvatarPreview config={userAvatar} size="sm" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-stone-800 text-sm">
                      Written by Izzy
                    </p>
                    <p className="text-xs text-stone-500">
                      Book lover &amp; storyteller
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  );
};

export default PublicBlog;
