import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Feather, Calendar, Sparkles, Heart } from "lucide-react";
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

const PoemDetail = () => {
  const { poemId } = useParams<{ poemId: string }>();
  const navigate = useNavigate();
  const { poems } = useBooks();

  const poem = poems.find((p) => p.id === poemId);
  const poemIndex = poems.findIndex((p) => p.id === poemId);

  // Scroll to top when poem loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [poemId]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      <PublicNav />

      {/* Hero Section */}
      <section className={`relative min-h-[50vh] bg-gradient-to-br ${backgroundPattern} flex items-center justify-center py-16 px-4`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 text-6xl opacity-30"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10 text-5xl opacity-30"
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🌙
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4 text-4xl opacity-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💫
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.button
            onClick={() => navigate("/poetry")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-600 hover:bg-white transition-all mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Poetry Corner
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {poem.template && (
              <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm font-bold text-violet-700 mb-4">
                <Sparkles className="w-4 h-4" />
                {poem.template}
              </span>
            )}

            <h1 className="text-4xl md:text-6xl font-display font-bold text-stone-800 mb-4 leading-tight">
              {poem.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-stone-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(poem.dateCreated).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {poem.likes > 0 && (
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  {poem.likes} likes
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Poem Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 md:p-16 relative overflow-hidden"
          >
            {/* Subtle decorative border */}
            <div className="absolute inset-4 border-2 border-dashed border-violet-100 rounded-2xl pointer-events-none" />

            {/* Poem content */}
            <div className="relative">
              <p className="text-xl md:text-2xl text-stone-700 font-serif leading-loose whitespace-pre-wrap text-center">
                {poem.content}
              </p>
            </div>

            {/* Author signature */}
            <div className="mt-12 pt-8 border-t border-stone-100">
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  I
                </div>
                <div className="text-center">
                  <p className="font-bold text-stone-800 text-lg">Written by Izzy</p>
                  <p className="text-stone-500">Young Poet & Dreamer</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* More Poems Section */}
      {poems.length > 1 && (
        <section className="py-12 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-stone-800 text-center mb-8">
              More Poems to Explore
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poems
                .filter((p) => p.id !== poem.id)
                .slice(0, 3)
                .map((otherPoem, idx) => (
                  <Link
                    key={otherPoem.id}
                    to={`/poetry/${otherPoem.id}`}
                    className="group"
                  >
                    <motion.div
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-stone-100 hover:-translate-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <h3 className="font-display font-bold text-stone-800 mb-2 group-hover:text-violet-600 transition-colors">
                        {otherPoem.title}
                      </h3>
                      <p className="text-stone-500 text-sm line-clamp-2 font-serif italic">
                        {otherPoem.content.substring(0, 100)}...
                      </p>
                    </motion.div>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/poetry"
                className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors"
              >
                View all {poems.length} poems
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
};

export default PoemDetail;
