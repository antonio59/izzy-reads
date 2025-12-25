import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Feather, Plus, Edit, Trash2, Heart } from "lucide-react";
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
  const {
    poems,
    blogPosts,
    addPoem,
    updatePoem,
    deletePoem,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
  } = useBooks();
  const [activeTab, setActiveTab] = useState<TabType>("poems");
  const [showPoemEditor, setShowPoemEditor] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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

  // Blog post handlers
  const handleSavePost = async (title: string, content: string) => {
    const now = new Date().toISOString();
    if (editingPost) {
      await updateBlogPost(editingPost.id, {
        title,
        content,
        dateModified: now,
      });
    } else {
      await addBlogPost({
        title,
        content,
        dateCreated: now,
        dateModified: now,
        status: "draft",
        parentApproved: false,
        tags: [],
      });
    }
    setShowPostEditor(false);
    setEditingPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowPostEditor(true);
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
                : setShowPostEditor(true)
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
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("poems")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === "poems"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
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
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <PenTool className="w-4 h-4" />
          Posts ({blogPosts.length})
        </button>
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
          onAction={() => setShowPostEditor(true)}
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

      {/* Simple Post Editor Modal */}
      <AnimatePresence>
        {showPostEditor && (
          <PostEditor
            post={editingPost}
            onSave={handleSavePost}
            onClose={() => {
              setShowPostEditor(false);
              setEditingPost(null);
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
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
      whileHover={{ y: -4 }}
    >
      <div
        className={`h-32 ${pattern} flex items-center justify-center relative`}
      >
        <span className="text-5xl">{poem.emoji || "✨"}</span>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 bg-white/90 rounded-lg hover:bg-white text-gray-600"
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
        <h3 className="font-bold text-gray-900 mb-2">{poem.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-3 italic">
          {poem.content}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {new Date(poem.dateCreated).toLocaleDateString()}
          </span>
          <button
            onClick={onLike}
            className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors"
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
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {post.emoji && <span className="text-2xl">{post.emoji}</span>}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              post.status === "published"
                ? "bg-green-100 text-green-700"
                : post.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {post.status}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
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
      <h3 className="font-bold text-gray-900 text-lg mb-2">{post.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-3">{post.content}</p>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
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

// Simple Post Editor
interface PostEditorProps {
  post: BlogPost | null;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onClose }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSave(title, content);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {post ? "Edit Post" : "Write a New Post"}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {post ? "Save Changes" : "Publish"}
          </button>
        </div>
      </motion.div>
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
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
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
