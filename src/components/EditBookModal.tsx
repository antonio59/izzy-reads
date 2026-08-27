import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  BookOpen,
  Calendar,
  Save,
  Sparkles,
  Gift,
  Smile,
  ChevronDown,
  Camera,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useToastActions } from "./ui/Toast";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input, Textarea, Select } from "./ui/Input";
import type { Book } from "../types";

interface EditBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookId: string, updates: Partial<Book>) => Promise<void>;
}

// Emoji categories for reviews
const REVIEW_EMOJIS = {
  Reactions: [
    "😍",
    "🥰",
    "😊",
    "🤩",
    "😭",
    "😢",
    "🤔",
    "😮",
    "🫣",
    "😱",
    "🥺",
    "😇",
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
  Ratings: [
    "⭐",
    "🌟",
    "💫",
    "✨",
    "💖",
    "❤️",
    "💯",
    "👍",
    "👎",
    "🔥",
    "🫶",
    "💕",
  ],
  Books: [
    "📚",
    "📖",
    "📕",
    "📗",
    "📘",
    "📙",
    "🔖",
    "📝",
    "✏️",
    "🎓",
    "📑",
    "🗒️",
  ],
  Fun: ["🦋", "🌈", "🎉", "🎊", "🏆", "🎭", "🎨", "🎵", "🌸", "🦄", "🎀", "✨"],
};

// Generate month options
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Generate year options (last 10 years)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);

export function EditBookModal({
  book,
  isOpen,
  onClose,
  onSave,
}: EditBookModalProps) {
  const { books } = useBooks();
  const toast = useToastActions();
  const [rating, setRating] = useState(() => book?.rating || 0);
  const [notes, setNotes] = useState(() => book?.notes || "");
  const [tags, setTags] = useState<string[]>(() => book?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [month, setMonth] = useState(() => {
    if (book?.dateRead) {
      return book.dateRead.split("-")[1] || "";
    }
    return String(new Date().getMonth() + 1).padStart(2, "0");
  });
  const [year, setYear] = useState(() => {
    if (book?.dateRead) {
      return book.dateRead.split("-")[0] || String(currentYear);
    }
    return String(currentYear);
  });
  const [giftFrom, setGiftFrom] = useState(() => book?.giftFrom || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showGiftSuggestions, setShowGiftSuggestions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState("Reactions");
  const [coverUrl, setCoverUrl] = useState(() => book?.coverUrl || "");
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const giftInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Get unique gift givers from all books
  const existingGiftGivers = useMemo(() => {
    const givers = new Set<string>();
    books.forEach((b) => {
      if (b.giftFrom && b.giftFrom.trim()) {
        givers.add(b.giftFrom.trim());
      }
    });
    return Array.from(givers).sort();
  }, [books]);

  // Insert emoji at cursor position in notes
  const insertEmoji = (emoji: string) => {
    if (notesRef.current) {
      const start = notesRef.current.selectionStart;
      const end = notesRef.current.selectionEnd;
      const newNotes = notes.substring(0, start) + emoji + notes.substring(end);
      setNotes(newNotes);
      setTimeout(() => {
        if (notesRef.current) {
          notesRef.current.selectionStart = start + emoji.length;
          notesRef.current.selectionEnd = start + emoji.length;
          notesRef.current.focus();
        }
      }, 0);
    } else {
      setNotes(notes + emoji);
    }
  };



  // Handle cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large", "Please use an image under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Combine month and year into dateRead format
  const dateRead = useMemo(() => {
    if (month && year) {
      return `${year}-${month}`;
    }
    return "";
  }, [month, year]);

  if (!book) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(book.id, {
        rating,
        notes,
        dateRead,
        giftFrom: giftFrom || undefined,
        coverUrl: coverUrl || undefined,
        tags,
      });
      toast.success("Changes saved!", `Updated "${book.title}"`);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <Card
            variant="default"
            padding="none"
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with Book Info */}
            <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                {/* Book Cover - clickable to upload */}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="w-20 h-28 rounded-lg overflow-hidden shadow-lg flex-shrink-0 bg-white/20 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all relative group"
                  title="Click to upload cover"
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold mb-1 line-clamp-2">
                    {book.title}
                  </h2>
                  <p className="text-white/80 text-sm mb-2">by {book.author}</p>
                  {book.genre && (
                    <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs">
                      {book.genre}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  <Star className="w-4 h-4 inline mr-2 text-amber-500" />
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= displayRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-lg font-bold text-stone-700 ml-2">
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>

              {/* Month/Year Read */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-primary-500" />
                  When did you finish this book?
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      options={MONTHS}
                      placeholder="Select month"
                    />
                  </div>
                  <div className="w-32">
                    <Select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      options={YEARS.map((y) => ({ value: String(y), label: String(y) }))}
                      placeholder="Year"
                    />
                  </div>
                </div>
              </div>

              {/* Gift From - Combobox Style */}
              <div className="relative">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  <Gift className="w-4 h-4 inline mr-2 text-pink-500" />
                  Gift from (optional)
                </label>
                <p className="text-xs text-stone-500 mb-2">
                  Did someone special give you this book? Select from previous
                  givers or type a new name.
                </p>

                {/* Selected value as tag or input */}
                <div className="relative">
                  {giftFrom ? (
                    <div className="flex items-center gap-2 px-4 py-3 border border-pink-200 bg-pink-50 rounded-xl">
                      <Gift className="w-4 h-4 text-pink-500" />
                      <span className="flex-1 text-stone-700 font-medium">
                        {giftFrom}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGiftFrom("")}
                        className="p-1 hover:bg-pink-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-pink-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Input
                        ref={giftInputRef}
                        value={giftFrom}
                        onChange={(e) => setGiftFrom(e.target.value)}
                        onFocus={() => setShowGiftSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowGiftSuggestions(false), 200)
                        }
                        placeholder="Type a name or select below..."
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowGiftSuggestions(!showGiftSuggestions)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-stone-400 transition-transform ${showGiftSuggestions ? "rotate-180" : ""}`}
                        />
                      </button>
                    </>
                  )}
                </div>

                {/* Gift Giver Dropdown */}
                <AnimatePresence>
                  {showGiftSuggestions && !giftFrom && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden"
                    >
                      {existingGiftGivers.length > 0 && (
                        <>
                          <div className="p-2 border-b border-stone-100 bg-stone-50">
                            <p className="text-xs text-stone-500 font-medium">
                              People who've given you books:
                            </p>
                          </div>
                          <div className="max-h-40 overflow-y-auto">
                            {existingGiftGivers.map((giver) => (
                              <button
                                key={giver}
                                type="button"
                                onClick={() => {
                                  setGiftFrom(giver);
                                  setShowGiftSuggestions(false);
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-pink-50 text-stone-700 text-sm flex items-center gap-2 transition-colors"
                              >
                                <Gift className="w-4 h-4 text-pink-400" />
                                {giver}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      <div className="p-2 border-t border-stone-100 bg-stone-50">
                        <p className="text-xs text-stone-400">
                          Or type a new name above
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mood / tags */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Mood tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(
                    [
                      "cozy",
                      "funny",
                      "scary",
                      "magical",
                      "sad",
                      "adventure",
                      "must-read",
                      "reread",
                    ] as const
                  ).map((tag) => {
                    const active = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setTags((prev) =>
                            active
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag],
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          active
                            ? "bg-primary-600 text-white"
                            : "bg-cream-200 text-stone-600 hover:bg-primary-50"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a custom tag…"
                    size="sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const next = tagInput.trim().toLowerCase();
                        if (next && !tags.includes(next)) {
                          setTags((prev) => [...prev, next]);
                        }
                        setTagInput("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const next = tagInput.trim().toLowerCase();
                      if (next && !tags.includes(next)) {
                        setTags((prev) => [...prev, next]);
                      }
                      setTagInput("");
                    }}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setTags((prev) => prev.filter((t) => t !== tag))
                        }
                        className="px-2 py-0.5 rounded-full text-xs bg-accent-100 text-accent-700 hover:bg-accent-200"
                        title="Remove tag"
                      >
                        {tag} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Review/Notes with Emoji Picker */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  <Sparkles className="w-4 h-4 inline mr-2 text-accent-500" />
                  Your Review
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Share your thoughts about this book! What did you love? What
                  would you tell a friend about it?
                </p>

                {/* Emoji Toolbar */}
                <div className="flex items-center gap-2 mb-2 p-2 bg-stone-50 rounded-t-xl border border-b-0 border-stone-200">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        showEmojiPicker
                          ? "bg-accent-100 text-accent-700"
                          : "bg-white text-stone-600 hover:bg-accent-50 hover:text-accent-600 border border-stone-200"
                      }`}
                    >
                      <Smile className="w-4 h-4" />
                      Add Emoji
                    </button>

                    {/* Emoji Picker Dropdown */}
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-20 top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden"
                        >
                          {/* Category Tabs */}
                          <div className="flex overflow-x-auto p-2 border-b border-stone-100 gap-1">
                            {Object.keys(REVIEW_EMOJIS).map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setActiveEmojiCategory(category)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                                  activeEmojiCategory === category
                                    ? "bg-accent-100 text-accent-700"
                                    : "text-stone-500 hover:bg-stone-100"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>

                          {/* Emoji Grid */}
                          <div className="p-3">
                            <div className="grid grid-cols-5 gap-1">
                              {REVIEW_EMOJIS[
                                activeEmojiCategory as keyof typeof REVIEW_EMOJIS
                              ].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    insertEmoji(emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-stone-100 rounded-lg transition-colors"
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
                  <span className="text-xs text-stone-400 ml-auto">
                    Express yourself with emojis!
                  </span>
                </div>

                <Textarea
                  ref={notesRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your review here... What did you think of the story? Who was your favorite character? Would you recommend it? 📚✨"
                  className="rounded-b-xl rounded-t-none"
                  rows={6}
                />
                <p className="text-xs text-stone-400 mt-2 text-right">
                  {notes.length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <Button variant="secondary" fullWidth onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSave}
                  loading={isSaving}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditBookModal;
