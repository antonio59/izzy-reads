import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Feather,
  Plus,
  Edit,
  Trash2,
  Heart,
  Sparkles,
  FileText,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import PoetryEditor from "./PoetryEditor";
import type { Poem, BlogPost } from "../types";

type TabType = "poems" | "posts";

const BACKGROUND_PATTERNS = [
  "bg-gradient-to-br from-pink-100 to-purple-100",
  "bg-gradient-to-br from-blue-100 to-cyan-100",
  "bg-gradient-to-br from-amber-100 to-orange-100",
  "bg-gradient-to-br from-green-100 to-emerald-100",
  "bg-gradient-to-br from-indigo-100 to-purple-100",
];

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { poems, blogPosts, addPoem, updatePoem, deletePoem, deleteBlogPost } =
    useBooks();
  const [activeTab, setActiveTab] = useState<TabType>("poems");
  const [showPoemEditor, setShowPoemEditor] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);

  // Poem handlers
  const handleSavePoem = async (
    poemData: Omit<Poem, "id" | "dateCreated" | "likes">,
  ) => {
    if (editingPoem) {
      await updatePoem(editingPoem.id, poemData);
    } else {
      await addPoem({
        ...poemData,
        dateCreated: new Date().toISOString(),
        likes: 0,
      });
    }
    setShowPoemEditor(false);
    setEditingPoem(null);
  };

  const handleEditPoem = (poem: Poem) => {
    setEditingPoem(poem);
    setShowPoemEditor(true);
  };

  const handleDeletePoem = async (id: string) => {
    if (confirm("Delete this poem?")) {
      await deletePoem(id);
    }
  };

  const handleLikePoem = async (poem: Poem) => {
    await updatePoem(poem.id, { likes: poem.likes + 1 });
  };

  // Blog post handlers - now uses navigation to full-page editor
  const handleEditPost = (post: BlogPost) => {
    navigate(`/create/post/${post.id}`);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Delete this post?")) {
      await deleteBlogPost(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <PenTool className="w-8 h-8" />
              Create
            </h1>
            <p className="text-white/90 mt-1">
              Express yourself through writing
            </p>
          </div>
          <motion.button
            onClick={() =>
              activeTab === "poems"
                ? setShowPoemEditor(true)
                : navigate("/create/post")
            }
            className="bg-white text-purple-600 px-5 py-2.5 rounded-full font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            {activeTab === "poems" ? "Write Poem" : "Write Post"}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("poems")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "poems"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Feather className="w-4 h-4" />
          Poems ({poems.length})
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "posts"
              ? "bg-white text-pink-600 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <PenTool className="w-4 h-4" />
          Posts ({blogPosts.length})
        </button>
      </div>

      {/* Tab Description */}
      <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl p-4 border border-stone-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {activeTab === "poems" ? (
              <Feather className="w-5 h-5 text-purple-500" />
            ) : (
              <FileText className="w-5 h-5 text-pink-500" />
            )}
          </div>
          <div>
            {activeTab === "poems" ? (
              <>
                <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                  My Poems <Sparkles className="w-4 h-4 text-purple-500" />
                </h3>
                <p className="text-sm text-stone-600 mt-0.5">
                  Write poems about anything you like! They can be about books
                  you've read, things you love, or just how you're feeling. Use
                  fun templates or write your own style!
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                  My Blog Posts <Sparkles className="w-4 h-4 text-pink-500" />
                </h3>
                <p className="text-sm text-stone-600 mt-0.5">
                  Share longer stories and thoughts! Write book reviews, talk
                  about your favorite characters, or tell stories about your
                  reading adventures. Your posts will appear on your website!
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "poems" ? (
        poems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poems.map((poem, index) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                pattern={
                  BACKGROUND_PATTERNS[index % BACKGROUND_PATTERNS.length]
                }
                onEdit={() => handleEditPoem(poem)}
                onDelete={() => handleDeletePoem(poem.id)}
                onLike={() => handleLikePoem(poem)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Feather}
            title="No poems yet"
            description="Write your first poem and share your creativity!"
            actionLabel="Write a Poem"
            onAction={() => setShowPoemEditor(true)}
          />
        )
      ) : blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={() => handleEditPost(post)}
              onDelete={() => handleDeletePost(post.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PenTool}
          title="No posts yet"
          description="Write about your reading adventures!"
          actionLabel="Write a Post"
          onAction={() => navigate("/create/post")}
        />
      )}

      {/* Poem Editor Modal */}
      <AnimatePresence>
        {showPoemEditor && (
          <PoetryEditor
            poem={editingPoem}
            onSave={handleSavePoem}
            onClose={() => {
              setShowPoemEditor(false);
              setEditingPoem(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Poem Card
interface PoemCardProps {
  poem: Poem;
  pattern: string;
  onEdit: () => void;
  onDelete: () => void;
  onLike: () => void;
}

const PoemCard: React.FC<PoemCardProps> = ({
  poem,
  pattern,
  onEdit,
  onDelete,
  onLike,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group"
      whileHover={{ y: -4 }}
    >
      <div
        className={`h-32 ${pattern} flex items-center justify-center relative`}
      >
        <span className="text-5xl">{poem.emoji || "✨"}</span>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 bg-white/90 rounded-lg hover:bg-white text-stone-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/90 rounded-lg hover:bg-white text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-stone-900 mb-2">{poem.title}</h3>
        <p className="text-stone-500 text-sm line-clamp-3 italic">
          {poem.content}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <span className="text-xs text-stone-400">
            {new Date(poem.dateCreated).toLocaleDateString()}
          </span>
          <button
            onClick={onLike}
            className="flex items-center gap-1 text-stone-400 hover:text-pink-500 transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${poem.likes > 0 ? "fill-pink-500 text-pink-500" : ""}`}
            />
            <span className="text-sm">{poem.likes}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Post Card
interface PostCardProps {
  post: BlogPost;
  onEdit: () => void;
  onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 group"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {post.emoji && <span className="text-2xl">{post.emoji}</span>}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              post.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {post.status}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <h3 className="font-bold text-stone-900 text-lg mb-2">{post.title}</h3>
      <p className="text-stone-500 text-sm line-clamp-3">{post.content}</p>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
        <span className="text-xs text-stone-400">
          {new Date(post.dateModified).toLocaleDateString()}
        </span>
        {post.tags.length > 0 && (
          <div className="flex gap-1">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Empty State
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-stone-400" />
      </div>
      <h3 className="text-xl font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 mb-6">{description}</p>
      <button
        onClick={onAction}
        className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-700 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default Create;
