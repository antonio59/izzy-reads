import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useMotionPreference } from "../contexts/MotionPreferenceContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { SearchInput } from "./ui";
import { PageMeta } from "./PageMeta";
import { pageMeta } from "../lib/seo";

const PublicPoetry = () => {
  const { poems } = useBooks();
  const { prefersReducedMotion } = useMotionPreference();
  const [searchQuery, setSearchQuery] = useState("");

  const sortedPoems = [...poems].sort(
    (a, b) =>
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  );

  const filteredPoems = sortedPoems.filter(
    (poem) =>
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <PageMeta
        title={pageMeta.poetry.title}
        description={pageMeta.poetry.description}
        path="/poetry"
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
              Words from the heart
            </p>
            <h1 className="font-accent text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.05] mb-3">
              Poetry
            </h1>
            <p className="text-base text-stone-500 max-w-md mx-auto leading-relaxed">
              Poems I&apos;ve written — imagination, feelings, and a little magic.
            </p>
            {poems.length > 0 && (
              <p className="mt-5 text-sm text-stone-400">
                <span className="font-display font-bold text-stone-700 tabular-nums">
                  {poems.length}
                </span>{" "}
                {poems.length === 1 ? "poem" : "poems"}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {poems.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 w-full pb-2">
          <SearchInput
            placeholder="Search poems…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="bg-white border-cream-300"
            aria-label="Search poems"
          />
        </div>
      )}

      <main className="flex-1 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {filteredPoems.length > 0 ? (
            <div className="space-y-10 sm:space-y-12 divide-y divide-cream-300">
              {filteredPoems.map((poem, index) => (
                <Link
                  key={poem.id}
                  to={`/poetry/${poem.slug || poem.id}`}
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
                      {poem.template && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                          {poem.template}
                        </span>
                      )}
                      <span className="text-xs text-stone-400">
                        {new Date(poem.dateCreated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 group-hover:text-primary-700 transition-colors leading-snug mb-3">
                      {poem.title}
                    </h2>
                    <p className="text-stone-600 font-serif italic leading-relaxed line-clamp-3">
                      {poem.content}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-primary-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                      Read poem <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              {searchQuery ? (
                <>
                  <Search className="w-10 h-10 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold text-stone-800 mb-2">
                    No poems found
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-primary-600 font-semibold text-sm hover:text-primary-700"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                    Poems coming soon
                  </h3>
                  <p className="text-stone-500 max-w-md mx-auto">
                    Izzy is crafting beautiful words. Check back soon!
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicPoetry;
