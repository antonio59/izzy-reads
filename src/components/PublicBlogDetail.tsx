import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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

function renderContent(content: string) {
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
}

const PublicBlogDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const { blogPosts } = useBooks();
  const { user } = useUser();
  const { prefersReducedMotion } = useMotionPreference();
  const remotePost = useQuery(
    api.blogPosts.getBySlugOrId,
    postId ? { slugOrId: postId } : "skip",
  );

  const userAvatar = user?.avatar || DEFAULT_AVATAR;

  // Prefer live query; fall back to context while loading
  const contextPost = blogPosts.find(
    (p) =>
      p.status === "published" &&
      (p.slug === postId || p.id === postId),
  );
  const post = remotePost
    ? {
        id: remotePost._id,
        title: remotePost.title,
        slug: remotePost.slug,
        content: remotePost.content,
        dateCreated: remotePost.dateCreated,
        tags: remotePost.tags,
        emoji: remotePost.emoji,
      }
    : contextPost;

  if (remotePost === undefined && !contextPost) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center px-4 text-center">
          <div>
            <h1 className="font-accent text-3xl font-semibold text-stone-900 mb-3">
              Post not found
            </h1>
            <p className="text-stone-500 mb-6">
              This writing may have wandered off.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to writing
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const pageUrl = `${window.location.origin}/blog/${post.slug || post.id}`;
  const morePosts = blogPosts
    .filter((p) => p.status === "published" && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <Helmet>
        <title>{`${post.title} | Izzy's Writing`}</title>
        <meta
          name="description"
          content={`Read "${post.title}" by Izzy on Izzy's Bookshelf.`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>

      <PublicNav />

      <div className="max-w-3xl mx-auto px-4 pt-6 w-full">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-primary-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          All writing
        </Link>
      </div>

      <main className="flex-1 py-8 sm:py-10">
        <article className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <p className="text-xs text-stone-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden />
              {new Date(post.dateCreated).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="font-accent text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.1] mb-6">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed mb-10">
              {renderContent(post.content)}
            </div>

            <div className="py-6 border-y border-cream-300 mb-8">
              <p className="text-sm font-medium text-stone-500 mb-3">
                What do you think?
              </p>
              <WritingReactionButtons postId={post.id} />
            </div>

            <div className="flex items-center gap-3 mb-12">
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
          </motion.div>

          {morePosts.length > 0 && (
            <section>
              <h2 className="text-xl font-display font-bold text-stone-800 mb-4">
                More writing
              </h2>
              <ul className="space-y-4">
                {morePosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/blog/${p.slug || p.id}`}
                      className="group block"
                    >
                      <h3 className="font-display font-bold text-stone-800 group-hover:text-primary-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {new Date(p.dateCreated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicBlogDetail;
