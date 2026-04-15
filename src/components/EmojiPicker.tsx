import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, X, Loader2 } from "lucide-react";
import Picker from "@emoji-mart/react";

// Dynamically import emoji data to reduce initial bundle size
let emojiDataPromise: Promise<typeof import("@emoji-mart/data")> | null = null;
function getEmojiData() {
  if (!emojiDataPromise) {
    emojiDataPromise = import("@emoji-mart/data");
  }
  return emojiDataPromise;
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  buttonClassName?: string;
  pickerPosition?: "top" | "bottom" | "left" | "right";
}

interface EmojiData {
  native: string;
  id: string;
  name: string;
}

export function EmojiPicker({
  onSelect,
  buttonClassName = "",
  pickerPosition = "bottom",
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emojiData, setEmojiData] = useState<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !emojiData) {
      getEmojiData().then((mod) => setEmojiData(mod as any));
    }
  }, [isOpen, emojiData]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleEmojiSelect = (emoji: EmojiData) => {
    onSelect(emoji.native);
    setIsOpen(false);
  };

  const positionStyles = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg hover:bg-stone-100 transition-colors ${buttonClassName}`}
        title="Add emoji"
      >
        <Smile className="w-5 h-5 text-stone-500 hover:text-primary-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionStyles[pickerPosition]}`}
          >
            <div className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {emojiData ? (
                <Picker
                  data={emojiData}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  previewPosition="none"
                  skinTonePosition="none"
                  maxFrequentRows={2}
                  perLine={8}
                  categories={[
                    "frequent",
                    "people",
                    "nature",
                    "foods",
                    "activity",
                    "places",
                    "objects",
                    "symbols",
                  ]}
                />
              ) : (
                <div className="w-[352px] h-[435px] flex items-center justify-center bg-white rounded-xl">
                  <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline emoji button that shows the selected emoji or a default
interface EmojiButtonProps {
  value?: string;
  onChange: (emoji: string) => void;
  size?: "sm" | "md" | "lg";
}

export function EmojiButton({
  value,
  onChange,
  size = "md",
}: EmojiButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emojiData, setEmojiData] = useState<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !emojiData) {
      getEmojiData().then((mod) => setEmojiData(mod as any));
    }
  }, [isOpen, emojiData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleEmojiSelect = (emoji: EmojiData) => {
    onChange(emoji.native);
    setIsOpen(false);
  };

  const sizeStyles = {
    sm: "text-xl w-8 h-8",
    md: "text-2xl w-10 h-10",
    lg: "text-3xl w-12 h-12",
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeStyles[size]} rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Choose emoji"
      >
        {value || "😊"}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0"
          >
            <div className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {emojiData ? (
                <Picker
                  data={emojiData}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  previewPosition="none"
                  skinTonePosition="none"
                  maxFrequentRows={2}
                  perLine={8}
                />
              ) : (
                <div className="w-[352px] h-[435px] flex items-center justify-center bg-white rounded-xl">
                  <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EmojiPicker;
