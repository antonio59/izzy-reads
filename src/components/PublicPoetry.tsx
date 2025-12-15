import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Heart, Sparkles, X } from "lucide-react";
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

const DECORATIVE_ELEMENTS = ["✨", "🌸", "🦋", "🌙", "⭐", "🌺", "💫", "🌿"];

const PublicPoetry = () => {
  const { poems } = useBooks();
  const [selectedPoem, setSelectedPoem] = useState<(typeof poems)[0] | null>(
    null,
  );
  const [likedPoems, setLikedPoems] = useState<Set<string>>(new Set());

  const handleLike = (poemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPoems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(poemId)) {
        newSet.delete(poemId);
      } else {
        newSet.add(poemId);
      }
      return newSet;
    });
  };

  const sortedPoems = [...poems].sort(
    (a, b) =>
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      {/* Navigation */}
      <PublicNav />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {DECORATIVE_ELEMENTS.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl opacity-20"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: 0.5 + Math.random() * 0.5,
              }}
              animate={{
                y: [null, "-20px", "20px", null],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-2xl shadow-violet-300/50 mb-8">
              <Feather className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 mb-6">
              Poetry Corner
            </h1>

            <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Welcome to Izzy's magical world of words. Each poem is a window
              into imagination, crafted with love and sprinkled with stardust.
            </p>

            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-4xl font-bold text-violet-600">
                  {poems.length}
                </p>
                <p className="text-sm text-stone-500 font-medium">
                  Poems Written
                </p>
              </div>
              <div className="w-px h-12 bg-stone-200" />
              <div className="text-center">
                <p className="text-4xl font-bold text-fuchsia-600">
                  {poems.reduce((sum, p) => sum + (p.likes || 0), 0)}
                </p>
                <p className="text-sm text-stone-500 font-medium">
                  Total Likes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Poems Grid */}
      <section className="py-16 px-4">
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

                        <button
                          onClick={(e) => handleLike(poem.id, e)}
                          className="flex items-center gap-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 transition-all ${
                              likedPoems.has(poem.id)
                                ? "fill-rose-500 text-rose-500 scale-110"
                                : "hover:scale-110"
                            }`}
                          />
                          <span className="font-medium text-sm">
                            {(poem.likes || 0) +
                              (likedPoems.has(poem.id) ? 1 : 0)}
                          </span>
                        </button>
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
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
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

                    <button
                      onClick={(e) => handleLike(selectedPoem.id, e)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                        likedPoems.has(selectedPoem.id)
                          ? "bg-rose-500 text-white"
                          : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${likedPoems.has(selectedPoem.id) ? "fill-white" : ""}`}
                      />
                      {(selectedPoem.likes || 0) +
                        (likedPoems.has(selectedPoem.id) ? 1 : 0)}{" "}
                      Likes
                    </button>
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
