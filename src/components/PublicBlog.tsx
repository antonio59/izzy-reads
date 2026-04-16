import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Calendar, X, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useBooks } from "../contexts/BookContext";
import { useUser } from "../contexts/UserContext";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { WritingReactionButtons } from "./ReactionButtons";
import { AvatarPreview, type AvatarConfig } from "./AvatarCreator";

const BACKGROUND_PATTERNS = [
  "from-rose-100 via-pink-50 to-fuchsia-100",
  "from-amber-100 via-orange-50 to-yellow-100",
  "from-emerald-100 via-teal-50 to-cyan-100",
  "from-violet-100 via-purple-50 to-indigo-100",
  "from-sky-100 via-blue-50 to-indigo-100",
  "from-lime-100 via-green-50 to-emerald-100",
];

const PublicBlog = () => {
  const { blogPosts } = useBooks();
  const { user } = useUser();
  const [selectedPost, setSelectedPost] = useState<
    (typeof blogPosts)[0] | null
  >(null);

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

  const pageUrl = `${window.location.origin}/blog`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <Helmet>
        <title>Izzy's Writing | Izzy's Bookshelf</title>
        <meta name="description" content="Thoughts, reading adventures, and stories from Izzy's reading journey." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Izzy's Writing" />
        <meta property="og:description" content="Thoughts, reading adventures, and stories from Izzy's reading journey." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${window.location.origin}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Izzy's Writing" />
        <meta name="twitter:description" content="Thoughts, reading adventures, and stories from Izzy's reading journey." />
      </Helmet>
      {/* Navigation */}
      <PublicNav />

      {/* Compact Hero Section */}
      <section className="py-8 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-stone-800">
                  Izzy's Writing
                </h1>
                <p className="text-sm text-stone-500">
                  Thoughts & adventures from my reading journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl font-bold text-rose-600">
                {sortedPosts.length}
              </span>
              <span className="text-sm text-stone-500">posts</span>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-4"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">✍️</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-800 mb-3">
                Writing Coming Soon!
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-6">
                Soon I'll be sharing reading challenges, book adventures, and
                stories here. It's going to be fun!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="bg-rose-50 px-4 py-2 rounded-full text-sm text-rose-600 font-medium">
                  📚 Reading Challenges
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-full text-sm text-orange-600 font-medium">
                  ✨ Book Adventures
                </div>
                <div className="bg-amber-50 px-4 py-2 rounded-full text-sm text-amber-600 font-medium">
                  💭 My Thoughts
                </div>
              </div>
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

                  {/* Reactions */}
                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <p className="text-sm font-semibold text-stone-600 mb-3">
                      What do you think?
                    </p>
                    <WritingReactionButtons postId={selectedPost.id} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm ring-2 ring-rose-100">
                      <AvatarPreview config={userAvatar} size="md" />
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
