import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Check, Copy, Mail } from "lucide-react";

// Brand icons removed from lucide-react v1; using inline SVGs instead
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: "button" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  action: (title: string, text: string, url: string) => void;
}

function ShareButton({
  title,
  text,
  url,
  variant = "button",
  size = "md",
  className = "",
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const shareOptions: ShareOption[] = [
    {
      name: "Twitter",
      icon: <TwitterIcon className="w-4 h-4" />,
      color: "hover:bg-sky-100 text-sky-500",
      action: (_title, text, url) => {
        const tweetText = encodeURIComponent(`${text}\n\n${url}`);
        window.open(
          `https://twitter.com/intent/tweet?text=${tweetText}`,
          "_blank",
          "width=550,height=420",
        );
      },
    },
    {
      name: "Facebook",
      icon: <FacebookIcon className="w-4 h-4" />,
      color: "hover:bg-blue-100 text-blue-600",
      action: (_title, text, url) => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
          "_blank",
          "width=550,height=420",
        );
      },
    },
    {
      name: "Email",
      icon: <Mail className="w-4 h-4" />,
      color: "hover:bg-stone-100 text-stone-600",
      action: (title, text, url) => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
      },
    },
    {
      name: "Copy Link",
      icon: copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      ),
      color: copied
        ? "bg-green-100 text-green-600"
        : "hover:bg-stone-100 text-stone-600",
      action: async (_title, _text, url) => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = url;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      },
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed - show menu instead
        setShowMenu(true);
      }
    } else {
      setShowMenu(true);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="relative">
      {variant === "button" ? (
        <motion.button
          onClick={handleNativeShare}
          className={`flex items-center ${sizeClasses[size]} bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full font-medium transition-colors ${className}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className={iconSizes[size]} />
          Share
        </motion.button>
      ) : (
        <motion.button
          onClick={handleNativeShare}
          className={`p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Share2 className={iconSizes[size]} />
        </motion.button>
      )}

      {/* Share Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 mb-1">
                  <span className="text-sm font-medium text-stone-700">
                    Share
                  </span>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3 text-stone-400" />
                  </button>
                </div>

                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => {
                      option.action(title, text, shareUrl);
                      if (option.name !== "Copy Link") {
                        setShowMenu(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${option.color}`}
                  >
                    {option.icon}
                    <span className="text-sm font-medium">
                      {option.name === "Copy Link" && copied
                        ? "Copied!"
                        : option.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Convenience component for sharing a book
interface ShareBookButtonProps {
  book: {
    title: string;
    author: string;
    id?: string;
  };
  variant?: "button" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShareBookButton({
  book,
  variant = "button",
  size = "md",
  className = "",
}: ShareBookButtonProps) {
  const url = book.id
    ? `${window.location.origin}/reviews/${book.id}`
    : window.location.href;

  return (
    <ShareButton
      title={`${book.title} by ${book.author}`}
      text={`Check out "${book.title}" by ${book.author} on Izzy's Bookshelf!`}
      url={url}
      variant={variant}
      size={size}
      className={className}
    />
  );
}

// Convenience component for sharing a review
interface ShareReviewButtonProps {
  book: {
    title: string;
    author: string;
    id: string;
  };
  variant?: "button" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShareReviewButton({
  book,
  variant = "button",
  size = "md",
  className = "",
}: ShareReviewButtonProps) {
  const url = `${window.location.origin}/reviews/${book.id}`;

  return (
    <ShareButton
      title={`Izzy's Review: ${book.title}`}
      text={`Check out Izzy's review of "${book.title}" by ${book.author}!`}
      url={url}
      variant={variant}
      size={size}
      className={className}
    />
  );
}

export default ShareButton;
