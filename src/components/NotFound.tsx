import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { Home, BookOpen, Sparkles, ArrowLeft } from "lucide-react";

// Fun messages that rotate
const MESSAGES = [
  {
    emoji: "📚",
    title: "Oops! This page got lost in a book!",
    subtitle: "Even the best explorers take wrong turns sometimes.",
  },
  {
    emoji: "🔮",
    title: "This page vanished like magic!",
    subtitle: "Not even a wizard could find it here.",
  },
  {
    emoji: "🗺️",
    title: "X marks the spot... but not here!",
    subtitle: "This treasure map led to the wrong island.",
  },
  {
    emoji: "🚀",
    title: "Houston, we have a problem!",
    subtitle: "This page is floating somewhere in space.",
  },
  {
    emoji: "🦄",
    title: "Even unicorns can't find this page!",
    subtitle: "It's more mythical than magical creatures.",
  },
  {
    emoji: "🐉",
    title: "A dragon ate this page!",
    subtitle: "Sorry, it was extra crispy.",
  },
  {
    emoji: "🌈",
    title: "This page is at the end of a rainbow!",
    subtitle: "And we haven't found it yet.",
  },
  {
    emoji: "🧙‍♂️",
    title: "Abracadabra... nope, still gone!",
    subtitle: "Even magic spells can't bring it back.",
  },
];

// Floating book animation component
const FloatingBook = ({
  delay,
  x,
  size,
  emoji,
  duration,
}: {
  delay: number;
  x: number;
  size: number;
  emoji: string;
  duration: number;
}) => (
  <motion.div
    className="absolute text-4xl pointer-events-none select-none"
    style={{ left: `${x}%`, fontSize: `${size}rem` }}
    initial={{ y: "100vh", opacity: 0, rotate: 0 }}
    animate={{
      y: "-100vh",
      opacity: [0, 1, 1, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    {emoji}
  </motion.div>
);

// Sparkle effect
const Sparkle = ({ x, y, repeatDelay }: { x: number; y: number; repeatDelay: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{
      scale: [0, 1, 0],
      opacity: [1, 1, 0],
    }}
    transition={{
      duration: 0.8,
      repeat: Infinity,
      repeatDelay,
    }}
  />
);

const NotFound: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [sparkles] = useState<
    { id: number; x: number; y: number }[]
  >(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (i * 17 + 3) % 100,
      y: (i * 23 + 7) % 100,
    })),
  );

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = MESSAGES[messageIndex];

  const floatingBooks = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        delay: i * 1.5,
        x: 10 + i * 12,
        size: 2 + (i % 3) * 0.7 + 0.5,
        emoji: ["📕", "📗", "📘", "📙", "📚", "📖"][i % 6],
        duration: 8 + (i % 4) + 1,
      })),
    [],
  );

  const sparkleData = useMemo(
    () =>
      sparkles.map((s) => ({
        ...s,
        repeatDelay: (s.id % 5) * 0.4 + 0.2,
      })),
    [sparkles],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating books background */}
      {floatingBooks.map((book, i) => (
        <FloatingBook
          key={i}
          delay={book.delay}
          x={book.x}
          size={book.size}
          emoji={book.emoji}
          duration={book.duration}
        />
      ))}

      {/* Sparkles */}
      {sparkleData.map((sparkle) => (
        <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} repeatDelay={sparkle.repeatDelay} />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Big 404 */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="relative inline-block">
            <motion.h1
              className="text-[12rem] md:text-[16rem] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 leading-tight select-none"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              404
            </motion.h1>

            {/* Decorative elements around 404 */}
            <motion.span
              className="absolute -top-4 -left-4 text-5xl"
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -top-4 -right-4 text-5xl"
              animate={{ rotate: [0, -10, 10, 0], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              ⭐
            </motion.span>
            <motion.span
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-6xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              📚
            </motion.span>
          </div>
        </motion.div>

        {/* Message card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-7xl block mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {currentMessage.emoji}
              </motion.span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-stone-800 mb-2">
                {currentMessage.title}
              </h2>
              <p className="text-stone-600 text-lg mb-8">
                {currentMessage.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-5 h-5" />
                Go Home
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                icon={<BookOpen className="w-5 h-5" />}
              >
                My Bookshelf
              </Button>
            </Link>
          </div>

          {/* Fun suggestion */}
          <motion.div
            className="mt-8 pt-8 border-t border-stone-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              While you're here, why not read a book?
              <Sparkles className="w-4 h-4 text-pink-500" />
            </p>
          </motion.div>
        </motion.div>

        {/* Back button */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          <motion.path
            d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
            fill="url(#wave-gradient)"
            animate={{
              d: [
                "M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z",
                "M0,60 C150,30 350,90 600,60 C850,30 1050,90 1200,60 L1200,120 L0,120 Z",
                "M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default NotFound;
