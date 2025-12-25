import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Calendar, X, Sparkles } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";

const BACKGROUND_PATTERNS = [
  "from-rose-100 via-pink-50 to-fuchsia-100",
  "from-amber-100 via-orange-50 to-yellow-100",
  "from-emerald-100 via-teal-50 to-cyan-100",
  "from-violet-100 via-purple-50 to-indigo-100",
  "from-sky-100 via-blue-50 to-indigo-100",
  "from-lime-100 via-green-50 to-emerald-100",
];

const DECORATIVE_ELEMENTS = ["📝", "✨", "💭", "🌟", "📖", "💫", "🎨", "🦋"];

const PublicBlog = () => {
  const { blogPosts } = useBooks();
  const [selectedPost, setSelectedPost] = useState<
    (typeof blogPosts)[0] | null
  >(null);

  const sortedPosts = [...blogPosts]
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );

  // Render content with GIF support
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

  // Get first image/GIF from content for card preview
  const getPreviewImage = (content: string): string | null => {
    const gifMatch = content.match(/!\[GIF\]\(([^)]+)\)/);
    return gifMatch ? gifMatch[1] : null;
  };

  // Get preview text without GIF markdown
  const getPreviewText = (content: string): string => {
    return content.replace(/!\[GIF\]\([^)]+\)/g, "").trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
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
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-2xl shadow-rose-300/50 mb-8">
              <PenTool className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 mb-6">
              Izzy's Blog
            </h1>

            <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Thoughts, adventures, and stories from my reading journey. Join me
              as I explore new worlds through books!
            </p>

            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-4xl font-bold text-rose-600">
                  {sortedPosts.length}
                </p>
                <p className="text-sm text-stone-500 font-medium">Blog Posts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {sortedPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {sortedPosts.map((post, index) => {
                const previewImage = getPreviewImage(post.content);
                const previewText = getPreviewText(post.content);

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => setSelectedPost(post)}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-stone-100 hover:-translate-y-2">
                      {/* Card Header */}
                      <div
                        className={`h-48 bg-gradient-to-br ${BACKGROUND_PATTERNS[index % BACKGROUND_PATTERNS.length]} relative overflow-hidden`}
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.span
                              className="text-7xl"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {post.emoji || "📝"}
                            </motion.span>
                          </div>
                        )}

                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-bl-full" />
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-display font-bold text-stone-800 mb-3 group-hover:text-rose-600 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-stone-500 line-clamp-3 leading-relaxed mb-4">
                          {previewText || "Click to read more..."}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                          <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.dateCreated).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <PenTool className="w-16 h-16 text-rose-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                Blog Posts Coming Soon!
              </h3>
              <p className="text-stone-500 max-w-md mx-auto">
                Izzy is busy writing about reading adventures. Check back soon
                for exciting posts!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedPost(null)}
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
                {/* Header with gradient */}
                <div
                  className={`relative h-32 bg-gradient-to-br ${BACKGROUND_PATTERNS[sortedPosts.indexOf(selectedPost) % BACKGROUND_PATTERNS.length]}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-6xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {selectedPost.emoji || "📝"}
                    </motion.span>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <X className="w-5 h-5 text-stone-600" />
                  </button>

                  {/* Floating sparkles */}
                  <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-white/50" />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 max-h-[60vh] overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-3">
                      {selectedPost.title}
                    </h2>
                    <p className="text-stone-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
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
                  </div>

                  {/* Tags */}
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed">
                    {renderContent(selectedPost.content)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      I
                    </div>
                    <div>
                      <p className="font-bold text-stone-800">
                        Written by Izzy
                      </p>
                      <p className="text-sm text-stone-500">
                        Book Lover & Storyteller
                      </p>
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

export default PublicBlog;
