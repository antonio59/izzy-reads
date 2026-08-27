import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { PageMeta } from "./PageMeta";
import { pageMeta } from "../lib/seo";

const PublicBlog = () => {
  const { blogPosts } = useBooks();
  const { prefersReducedMotion } = useMotionPreference();

  const sortedPosts = [...blogPosts]
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );

  const getPreviewText = (content: string): string =>
    content.replace(/!\[GIF\]\([^)]+\)/g, "").trim();

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <PageMeta
        title={pageMeta.writing.title}
        description={pageMeta.writing.description}
        path="/blog"
      />

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
              Thoughts &amp; adventures
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
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug || post.id}`}
                    className={`group block ${index === 0 ? "" : "pt-10 sm:pt-12"}`}
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
                  </Link>
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

      <PublicFooter />
    </div>
  );
};

export default PublicBlog;
