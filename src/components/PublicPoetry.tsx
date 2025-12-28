import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, X, Sparkles } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";

const BACKGROUND_PATTERNS = [
  "from-violet-100 via-purple-50 to-fuchsia-100",
  "from-sky-100 via-cyan-50 to-teal-100",
  "from-amber-100 via-yellow-50 to-orange-100",
  "from-emerald-100 via-green-50 to-teal-100",
  "from-rose-100 via-pink-50 to-fuchsia-100",
  "from-indigo-100 via-blue-50 to-violet-100",
];

const PublicPoetry = () => {
  const { poems } = useBooks();
  const [selectedPoem, setSelectedPoem] = useState<(typeof poems)[0] | null>(
    null,
  );

  const sortedPoems = [...poems].sort(
    (a, b) =>
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      {/* Navigation */}
      <PublicNav />

      {/* Compact Hero Section */}
      <section className="py-8 bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg flex items-center justify-center">
                <Feather className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-stone-800">
                  Poetry Corner
                </h1>
                <p className="text-sm text-stone-500">
                  Izzy's magical world of words
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-2xl font-bold text-violet-600">
                  {poems.length}
                </span>
                <span className="text-sm text-stone-500">poems</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-violet-100 p-6 text-center"
          >
            <span className="text-4xl mb-3 block">✨</span>
            <p className="text-stone-600 leading-relaxed">
              This is where I share my own poems - words from my heart about
              books, adventures, feelings, and all the magical things I love to
              write about!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Poems Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {sortedPoems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPoems.map((poem, index) => (
                <motion.article
                  key={poem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedPoem(poem)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-stone-100 hover:-translate-y-2">
                    {/* Card Header */}
                    <div
                      className={`h-40 bg-gradient-to-br ${BACKGROUND_PATTERNS[index % BACKGROUND_PATTERNS.length]} relative overflow-hidden`}
                    >
                      {poem.imageUrl ? (
                        <img
                          src={poem.imageUrl}
                          alt={poem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.span
                            className="text-7xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {poem.emoji || "✨"}
                          </motion.span>
                        </div>
                      )}

                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-bl-full" />

                      {/* Template badge */}
                      {poem.template && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-stone-700 shadow-sm">
                          {poem.template}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold text-stone-800 mb-3 group-hover:text-violet-600 transition-colors">
                        {poem.title}
                      </h3>

                      <p className="text-stone-500 font-serif italic line-clamp-3 leading-relaxed mb-4">
                        {poem.content}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                        <span className="text-xs text-stone-400 font-medium">
                          {new Date(poem.dateCreated).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Feather className="w-16 h-16 text-violet-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                Poems Coming Soon!
              </h3>
              <p className="text-stone-500 max-w-md mx-auto">
                Izzy is busy crafting beautiful words. Check back soon for
                magical poetry!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Poem Detail Modal */}
      <AnimatePresence>
        {selectedPoem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedPoem(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header with gradient or image */}
                <div
                  className={`relative h-48 ${
                    selectedPoem.imageUrl
                      ? ""
                      : `bg-gradient-to-br ${BACKGROUND_PATTERNS[poems.indexOf(selectedPoem) % BACKGROUND_PATTERNS.length]}`
                  }`}
                >
                  {selectedPoem.imageUrl ? (
                    <img
                      src={selectedPoem.imageUrl}
                      alt={selectedPoem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-8xl"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {selectedPoem.emoji || "✨"}
                      </motion.span>
                    </div>
                  )}

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPoem(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <X className="w-5 h-5 text-stone-600" />
                  </button>

                  {/* Floating sparkles */}
                  <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-white/50" />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 max-h-[50vh] overflow-y-auto">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-2">
                        {selectedPoem.title}
                      </h2>
                      <p className="text-stone-500 flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        {new Date(selectedPoem.dateCreated).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    {selectedPoem.template && (
                      <span className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-bold">
                        {selectedPoem.template}
                      </span>
                    )}
                  </div>

                  {/* Poem Content */}
                  <div className="bg-gradient-to-br from-stone-50 to-amber-50/50 rounded-2xl p-8 border border-stone-100">
                    <p className="text-xl md:text-2xl text-stone-700 font-serif leading-loose whitespace-pre-wrap text-center">
                      {selectedPoem.content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-center mt-8 pt-6 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                        I
                      </div>
                      <div>
                        <p className="font-bold text-stone-800">
                          Written by Izzy
                        </p>
                        <p className="text-sm text-stone-500">
                          Young Poet & Dreamer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicPoetry;
