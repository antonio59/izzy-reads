import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Feather, Search, Quote } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { Input } from "./ui/Input";

const BACKGROUND_PATTERNS = [
  "from-violet-100/80 via-purple-50/80 to-fuchsia-100/80",
  "from-sky-100/80 via-cyan-50/80 to-teal-100/80",
  "from-amber-100/80 via-yellow-50/80 to-orange-100/80",
  "from-emerald-100/80 via-green-50/80 to-teal-100/80",
  "from-rose-100/80 via-pink-50/80 to-fuchsia-100/80",
  "from-indigo-100/80 via-blue-50/80 to-violet-100/80",
];

const PublicPoetry = () => {
  const { poems } = useBooks();
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 left-[10%] text-6xl opacity-20"
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute top-20 right-[15%] text-5xl opacity-15"
            animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            🌙
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-[20%] text-4xl opacity-10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            💫
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg mb-6">
              <Feather className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-800 mb-4">
              Poetry Corner
            </h1>
            <p className="text-lg text-stone-600 mb-8">
              A collection of words woven with magic, imagination, and heart
            </p>

            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm">
                <span className="text-2xl font-bold text-violet-600">{poems.length}</span>
                <span className="text-stone-500">poems</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm">
                <Quote className="w-4 h-4 text-violet-500" />
                <span className="text-stone-500">Original works</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      {poems.length > 0 && (
        <section className="py-8 px-4 bg-white/50 border-b border-violet-100">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                type="text"
                placeholder="Search poems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
                iconPosition="left"
                className="border-2 border-violet-100 focus:border-violet-400"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Poems Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredPoems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPoems.map((poem, index) => (
                <Link
                  key={poem.id}
                  to={`/poetry/${poem.slug || poem.id}`}
                  className="group block"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="h-full"
                  >
                    <div className="relative h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 group-hover:-translate-y-1"
                    >
                      {/* Card Header - Clean gradient, no placeholder emoji */}
                      <div
                        className={`h-32 bg-gradient-to-br ${BACKGROUND_PATTERNS[index % BACKGROUND_PATTERNS.length]} relative overflow-hidden`}
                      >
                        {/* Only show image if one exists */}
                        {poem.imageUrl && (
                          <img
                            src={poem.imageUrl}
                            alt={poem.title}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Template badge - positioned better */}
                        {poem.template && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-stone-700 shadow-sm">
                            {poem.template}
                          </span>
                        )}

                        {/* Subtle decorative element */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-tl-full" />
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-display font-bold text-stone-800 mb-2 group-hover:text-violet-600 transition-colors line-clamp-1"
                        >
                          {poem.title}
                        </h3>

                        <p className="text-stone-500 font-serif italic line-clamp-3 leading-relaxed text-sm mb-4"
                        >
                          {poem.content.substring(0, 120)}
                          {poem.content.length > 120 && "..."}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                          <span className="text-xs text-stone-400">
                            {new Date(poem.dateCreated).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="text-xs font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              {searchQuery ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-stone-800 mb-2">
                    No poems found
                  </h3>
                  <p className="text-stone-500">
                    Try a different search term
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-violet-600 font-semibold hover:text-violet-700"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Feather className="w-12 h-12 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                    Poems Coming Soon!
                  </h3>
                  <p className="text-stone-500 max-w-md mx-auto">
                    Izzy is busy crafting beautiful words. Check back soon for
                    magical poetry!
                  </p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default PublicPoetry;
