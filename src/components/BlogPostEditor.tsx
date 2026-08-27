import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Smile,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  Image,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { GifPicker } from "./GifPicker";
import { Card } from "./ui/Card";

// Common emoji categories for a teen reader
const EMOJI_CATEGORIES = {
  Favorites: [
    "📚",
    "✨",
    "💖",
    "🌟",
    "📖",
    "🎉",
    "💫",
    "🦋",
    "🌸",
    "💜",
    "🎀",
    "🫶",
  ],
  Feelings: [
    "😊",
    "🥰",
    "😍",
    "🤩",
    "😭",
    "😢",
    "😤",
    "🤔",
    "😌",
    "🥺",
    "😇",
    "🫠",
  ],
  Laughing: [
    "😂",
    "🤣",
    "😆",
    "😹",
    "😝",
    "🤭",
    "😜",
    "🙈",
    "💀",
    "😅",
    "😁",
    "🤪",
  ],
  Reactions: [
    "👍",
    "👏",
    "🙌",
    "💪",
    "🔥",
    "💯",
    "✅",
    "❤️",
    "💕",
    "🫡",
    "🤝",
    "👀",
  ],
  Nature: [
    "🌈",
    "☀️",
    "🌙",
    "⭐",
    "🌺",
    "🌻",
    "🍀",
    "🌊",
    "🦄",
    "🐱",
    "🐶",
    "🦊",
  ],
  Objects: [
    "📝",
    "✏️",
    "🎨",
    "🎵",
    "🎬",
    "📷",
    "🎁",
    "💌",
    "🏆",
    "☕",
    "🍕",
    "🎮",
  ],
};

const BlogPostEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { blogPosts, addBlogPost, updateBlogPost } = useBooks();

  // Find existing post if editing
  const existingPost = id ? blogPosts.find((p) => p.id === id) : null;

  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] =
    useState<string>("Favorites");
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  // Insert emoji at cursor position
  const insertEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent =
        content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + emoji.length;
          textareaRef.current.selectionEnd = start + emoji.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setContent(content + emoji);
    }
  };

  // Insert GIF as markdown image
  const insertGif = (gifUrl: string) => {
    const gifMarkdown = `\n![GIF](${gifUrl})\n`;
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent =
        content.substring(0, start) + gifMarkdown + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + gifMarkdown.length;
          textareaRef.current.selectionEnd = start + gifMarkdown.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setContent(content + gifMarkdown);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    const now = new Date().toISOString();

    try {
      if (existingPost) {
        await updateBlogPost(existingPost.id, {
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
          status: "published",
          tags: [],
        });
      }
      navigate("/create");
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render content with GIF previews
  const renderPreview = () => {
    // Simple markdown-like rendering for GIFs
    const parts = content.split(/(!\[GIF\]\([^)]+\))/g);
    return parts.map((part, idx) => {
      const gifMatch = part.match(/!\[GIF\]\(([^)]+)\)/);
      if (gifMatch) {
        return (
          <img
            key={idx}
            src={gifMatch[1]}
            alt="GIF"
            className="max-w-full h-auto rounded-lg my-2"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-primary-50 to-accent-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showPreview
                  ? "bg-primary-100 text-primary-700"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showPreview ? "Edit" : "Preview"}
            </button>

            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : existingPost ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showPreview ? (
            <Card
              key="preview"
              variant="elevated"
              padding="lg"
              className="shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-3xl font-bold text-stone-900 mb-6">
                {title || "Untitled Post"}
              </h1>
              <div className="prose prose-lg max-w-none text-stone-700">
                {renderPreview()}
              </div>
            </Card>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Title */}
              <Card variant="elevated" padding="md" className="shadow-lg">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your post an awesome title..."
                  className="w-full text-3xl font-bold text-stone-900 placeholder-stone-300 border-none focus:outline-none focus:ring-0"
                />
              </Card>

              {/* Toolbar */}
              <Card variant="elevated" padding="sm" className="shadow-lg">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Emoji Picker */}
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        showEmojiPicker
                          ? "bg-primary-100 text-primary-700"
                          : "bg-stone-100 text-stone-600 hover:bg-primary-50 hover:text-primary-600"
                      }`}
                    >
                      <Smile className="w-5 h-5" />
                      Emoji
                    </button>

                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute z-50 top-full mt-2 left-0 w-80 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden"
                        >
                          {/* Category Tabs */}
                          <div className="flex overflow-x-auto p-2 border-b border-stone-100 gap-1">
                            {Object.keys(EMOJI_CATEGORIES).map((category) => (
                              <button
                                key={category}
                                onClick={() => setActiveEmojiCategory(category)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                                  activeEmojiCategory === category
                                    ? "bg-primary-100 text-primary-700"
                                    : "text-stone-500 hover:bg-stone-100"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>

                          {/* Emoji Grid */}
                          <div className="p-3">
                            <div className="grid grid-cols-5 gap-2">
                              {EMOJI_CATEGORIES[
                                activeEmojiCategory as keyof typeof EMOJI_CATEGORIES
                              ].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    insertEmoji(emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-stone-100 rounded-xl transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* GIF Picker - wrapped in styled button */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                    <Image className="w-5 h-5" />
                    <span className="font-medium">GIF</span>
                    <GifPicker
                      onSelect={insertGif}
                      buttonClassName="!p-0 !bg-transparent"
                    />
                  </div>

                  <div className="flex-1" />

                  <div className="flex items-center gap-2 text-sm text-stone-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Express yourself!</span>
                  </div>
                </div>
              </Card>

              {/* Content Editor */}
              <Card variant="elevated" padding="md">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your amazing post here... Add emojis, GIFs, and let your creativity flow!"
                  className="w-full min-h-[400px] text-lg text-stone-700 placeholder-stone-300 border-none focus:outline-none focus:ring-0 resize-none"
                />

                {/* GIF Previews */}
                {content.includes("![GIF]") && (
                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-sm font-medium text-stone-500 mb-3">
                      GIFs in your post:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {content
                        .match(/!\[GIF\]\((https?:\/\/[^)]+)\)/g)
                        ?.map((match, idx) => {
                          const url = match.match(
                            /\((https?:\/\/[^)]+)\)/,
                          )?.[1];
                          return url ? (
                            <img
                              key={idx}
                              src={url}
                              alt="GIF preview"
                              className="h-24 rounded-lg object-cover shadow-md"
                            />
                          ) : null;
                        })}
                    </div>
                  </div>
                )}
              </Card>

              {/* Tips */}
              <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl p-6">
                <h3 className="font-bold text-primary-800 mb-2">Writing Tips</h3>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>Use emojis to make your post more expressive and fun!</li>
                  <li>Add GIFs to show reactions or illustrate your points</li>
                  <li>
                    Write about books you've read, your reading journey, or
                    anything creative!
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BlogPostEditor;
