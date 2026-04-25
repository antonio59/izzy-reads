import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Type,
  Sparkles,
  X,
  Check,
  Feather,
  Upload,
  Palette,
  Layout,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input, Textarea } from "./ui/Input";
import { Card } from "./ui/Card";
import type { Poem } from "../types";
import { EmojiButton } from "./EmojiPicker";
import GifPicker from "./GifPicker";

interface PoetryEditorProps {
  poem?: Poem | null;
  onSave: (poem: Omit<Poem, "id" | "dateCreated" | "likes">) => void;
  onClose: () => void;
}

const POEM_TEMPLATES = [
  {
    name: "Haiku",
    description: "5-7-5 syllable pattern, capturing a moment",
    emoji: "🌸",
    placeholder:
      "Line 1 (5 syllables)\nLine 2 (7 syllables)\nLine 3 (5 syllables)",
    style: "haiku",
  },
  {
    name: "Acrostic",
    description: "First letter of each line spells a word",
    emoji: "🔤",
    placeholder:
      "Choose a word and make each line\nstart with those letters!\n\nExample for LOVE:\nLaughing in the sunshine\nOver hills we run\nVery happy together\nEvery single day",
    style: "acrostic",
  },
  {
    name: "Free Verse",
    description: "No rules, pure expression",
    emoji: "✨",
    placeholder:
      "Let your imagination flow freely...\n\nWrite whatever comes to your heart.\nThere are no rules here,\njust your beautiful thoughts.",
    style: "free",
  },
  {
    name: "Rhyming",
    description: "Lines that rhyme together",
    emoji: "🎵",
    placeholder:
      "Roses are red,\nViolets are blue,\nWrite your own rhymes,\nMake them come true!",
    style: "rhyming",
  },
  {
    name: "Shape Poem",
    description: "Words arranged in a shape",
    emoji: "💫",
    placeholder:
      "         *\n       * * *\n     *       *\n   *           *\n *               *\n*                 *\n *               *\n   *           *\n     *       *\n       * * *\n         *",
    style: "shape",
  },
  {
    name: "Upload",
    description: "Upload a picture of your handwritten poem",
    emoji: "📷",
    placeholder: "",
    style: "uploaded",
  },
];

const BACKGROUND_THEMES = [
  {
    name: "Sunset",
    gradient: "from-orange-100 via-rose-100 to-purple-100",
    text: "text-rose-900",
  },
  {
    name: "Ocean",
    gradient: "from-blue-100 via-cyan-100 to-teal-100",
    text: "text-blue-900",
  },
  {
    name: "Forest",
    gradient: "from-green-100 via-emerald-100 to-teal-100",
    text: "text-emerald-900",
  },
  {
    name: "Lavender",
    gradient: "from-violet-100 via-purple-100 to-fuchsia-100",
    text: "text-violet-900",
  },
  {
    name: "Golden",
    gradient: "from-amber-100 via-yellow-100 to-orange-100",
    text: "text-amber-900",
  },
  {
    name: "Classic",
    gradient: "from-stone-100 via-stone-50 to-amber-50",
    text: "text-stone-900",
  },
];

const FONT_OPTIONS = [
  { name: "Elegant", className: "font-serif", preview: "Aa" },
  { name: "Modern", className: "font-body", preview: "Aa" },
  { name: "Playful", className: "font-display", preview: "Aa" },
];

const PoetryEditor: React.FC<PoetryEditorProps> = ({
  poem,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState<"template" | "write" | "style">(
    poem ? "write" : "template",
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    poem?.template || "",
  );
  const [title, setTitle] = useState(poem?.title || "");
  const [content, setContent] = useState(poem?.content || "");
  const [emoji, setEmoji] = useState(poem?.emoji || "✨");
  const [imageUrl, setImageUrl] = useState(poem?.imageUrl || "");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center",
  );
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(true);
  const [gifUrl, setGifUrl] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Insert GIF into content
  const handleGifSelect = (url: string) => {
    setGifUrl(url);
    // Add GIF reference to content
    const gifMarkdown = `\n![GIF](${url})\n`;
    setContent((prev) => prev + gifMarkdown);
  };

  const handleSelectTemplate = (template: (typeof POEM_TEMPLATES)[0]) => {
    setSelectedTemplate(template.name);
    if (template.style === "uploaded") {
      fileInputRef.current?.click();
    } else {
      setContent(template.placeholder);
      setEmoji(template.emoji);
      setStep("write");
    }
  };

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
          setSelectedTemplate("Uploaded");
          setEmoji("📷");
          setStep("write");
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleSave = () => {
    if (!title.trim() || (!content.trim() && !imageUrl)) return;

    onSave({
      title,
      content: content || "Handwritten Poem",
      emoji,
      imageUrl,
      template: selectedTemplate,
      style: {
        background: BACKGROUND_THEMES[selectedTheme].gradient,
        font: FONT_OPTIONS[selectedFont].className,
        color: BACKGROUND_THEMES[selectedTheme].text,
      },
    });
  };

  const theme = BACKGROUND_THEMES[selectedTheme];
  const font = FONT_OPTIONS[selectedFont];

  return (
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
      />

      {/* Editor Container */}
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-xl"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Template Selection Step */}
        <AnimatePresence mode="wait">
          {step === "template" && (
            <motion.div
              key="template"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                    <Feather className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-stone-800">
                      Create a Poem
                    </h2>
                    <p className="text-stone-500">Choose your style</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-stone-500" />
                </button>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {POEM_TEMPLATES.map((template, index) => (
                  <motion.button
                    key={template.name}
                    onClick={() => handleSelectTemplate(template)}
                    className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl text-left hover:from-violet-50 hover:to-fuchsia-50 transition-all border-2 border-transparent hover:border-violet-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                      {template.emoji}
                    </span>
                    <h3 className="font-bold text-stone-800 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {template.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Writing Step */}
          {step === "write" && (
            <motion.div
              key="write"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col h-[85vh]"
            >
              {/* Top Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep("template")}
                    className="p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-600"
                    title="Back to templates"
                  >
                    <Layout className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-stone-500 font-medium px-2">
                    {selectedTemplate || "Free Verse"}
                  </span>
                </div>

                {!imageUrl && (
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-stone-200 p-1">
                    <button
                      onClick={() => setIsBold(!isBold)}
                      className={`p-2 rounded transition-colors ${isBold ? "bg-violet-100 text-violet-700" : "hover:bg-stone-100"}`}
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsItalic(!isItalic)}
                      className={`p-2 rounded transition-colors ${isItalic ? "bg-violet-100 text-violet-700" : "hover:bg-stone-100"}`}
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-stone-200 mx-1" />
                    <button
                      onClick={() => setTextAlign("left")}
                      className={`p-2 rounded transition-colors ${textAlign === "left" ? "bg-violet-100 text-violet-700" : "hover:bg-stone-100"}`}
                      title="Align Left"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTextAlign("center")}
                      className={`p-2 rounded transition-colors ${textAlign === "center" ? "bg-violet-100 text-violet-700" : "hover:bg-stone-100"}`}
                      title="Align Center"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTextAlign("right")}
                      className={`p-2 rounded transition-colors ${textAlign === "right" ? "bg-violet-100 text-violet-700" : "hover:bg-stone-100"}`}
                      title="Align Right"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-stone-200 mx-1" />
                    <button
                      onClick={() => setStep("style")}
                      className="p-2 rounded hover:bg-stone-100 transition-colors"
                      title="Style & Theme"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-stone-200 mx-1" />
                    <GifPicker onSelect={handleGifSelect} />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!title.trim() || (!content.trim() && !imageUrl)}
                    icon={<Check className="w-4 h-4" />}
                  >
                    Publish
                  </Button>
                </div>
              </div>

              {/* Main Editor Area */}
              <div
                className={`flex-1 overflow-auto bg-gradient-to-br ${theme.gradient}`}
              >
                <div className="max-w-2xl mx-auto py-12 px-8">
                  {/* Emoji Selector - Full picker */}
                  <div className="flex justify-center mb-6">
                    <EmojiButton value={emoji} onChange={setEmoji} size="lg" />
                  </div>

                  {/* GIF Preview (if added) */}
                  {gifUrl && (
                    <div className="flex justify-center mb-6">
                      <div className="relative inline-block">
                        <img
                          src={gifUrl}
                          alt="Added GIF"
                          className="max-w-xs rounded-xl shadow-lg"
                        />
                        <button
                          onClick={() => {
                            setGifUrl("");
                            setContent((prev) =>
                              prev.replace(`\n![GIF](${gifUrl})\n`, ""),
                            );
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Title Input */}
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title of your poem..."
                    variant="outlined"
                    className={`text-3xl md:text-4xl font-display font-bold text-center bg-transparent border-none outline-none placeholder-stone-400 mb-8 focus:ring-0 ${theme.text}`}
                  />

                  {/* Content Area - Image or Text */}
                  {imageUrl ? (
                    <Card variant="elevated" padding="none" className="relative shadow-lg">
                      <img
                        src={imageUrl}
                        alt="Uploaded poem"
                        className="w-full"
                      />
                      <button
                        onClick={() => setImageUrl("")}
                        className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <X className="w-4 h-4 text-stone-600" />
                      </button>
                    </Card>
                  ) : (
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing your poem..."
                        variant="outlined"
                        className={`min-h-[300px] text-xl leading-relaxed bg-transparent border-none outline-none placeholder-stone-400 focus:ring-0 ${font.className} ${theme.text} ${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""}`}
                        style={{ textAlign }}
                      />

                      {/* Upload option for text mode */}
                      <div className="mt-6 pt-6 border-t border-stone-200/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          icon={<Upload className="w-4 h-4" />}
                          className="mx-auto text-stone-500 hover:text-violet-600"
                        >
                          Or upload a handwritten poem
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Style Customization Step */}
          {step === "style" && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep("write")}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                  <h2 className="text-xl font-display font-bold text-stone-800">
                    Customize Style
                  </h2>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setStep("write")}
                >
                  Done
                </Button>
              </div>

              {/* Theme Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-stone-700 uppercase mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Background Theme
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {BACKGROUND_THEMES.map((t, index) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTheme(index)}
                      className={`aspect-square rounded-xl bg-gradient-to-br ${t.gradient} border-2 transition-all ${
                        selectedTheme === index
                          ? "border-violet-500 scale-105 shadow-lg"
                          : "border-transparent hover:scale-105"
                      }`}
                      title={t.name}
                    >
                      {selectedTheme === index && (
                        <Check className="w-6 h-6 text-violet-600 mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-stone-700 uppercase mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Style
                </h3>
                <div className="flex gap-3">
                  {FONT_OPTIONS.map((f, index) => (
                    <button
                      key={f.name}
                      onClick={() => setSelectedFont(index)}
                      className={`px-6 py-4 rounded-xl border-2 transition-all ${
                        selectedFont === index
                          ? "border-violet-500 bg-violet-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <span className={`text-2xl ${f.className}`}>
                        {f.preview}
                      </span>
                      <p className="text-sm text-stone-600 mt-1">{f.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8">
                <h3 className="text-sm font-bold text-stone-700 uppercase mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Preview
                </h3>
                <div
                  className={`p-8 rounded-2xl bg-gradient-to-br ${theme.gradient}`}
                >
                  <p
                    className={`text-xl text-center ${font.className} ${theme.text} ${isItalic ? "italic" : ""}`}
                  >
                    {content || "Your beautiful poem will appear here..."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default PoetryEditor;
