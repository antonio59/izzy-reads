import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Star } from "lucide-react";
import { useGamification } from "../contexts/GamificationContext";
import type { Achievement } from "../lib/achievements";

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 to-amber-600",
};

const RARITY_GLOW = {
  common: "shadow-gray-300",
  rare: "shadow-blue-300",
  epic: "shadow-purple-300",
  legendary: "shadow-amber-300",
};

const AchievementNotification: React.FC = () => {
  const { recentlyUnlocked, dismissRecentAchievements } = useGamification();
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);

  // Queue up achievements to show one at a time
  useEffect(() => {
    if (recentlyUnlocked.length > 0) {
      setQueue((prev) => [...prev, ...recentlyUnlocked]);
      dismissRecentAchievements();
    }
  }, [recentlyUnlocked, dismissRecentAchievements]);

  // Show next achievement from queue
  useEffect(() => {
    if (!currentAchievement && queue.length > 0) {
      setCurrentAchievement(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [currentAchievement, queue]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (currentAchievement) {
      const timer = setTimeout(() => {
        setCurrentAchievement(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentAchievement]);

  const handleDismiss = () => {
    setCurrentAchievement(null);
  };

  return (
    <AnimatePresence>
      {currentAchievement && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div
            className={`
              relative overflow-hidden rounded-2xl bg-white 
              shadow-2xl ${RARITY_GLOW[currentAchievement.rarity]}
            `}
          >
            {/* Animated background shimmer for legendary */}
            {currentAchievement.rarity === "legendary" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Header with gradient */}
            <div
              className={`bg-gradient-to-r ${RARITY_COLORS[currentAchievement.rarity]} p-4 text-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    Achievement Unlocked!
                  </span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Achievement icon */}
                <motion.div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-4xl
                    bg-gradient-to-br ${RARITY_COLORS[currentAchievement.rarity]}
                  `}
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  {currentAchievement.icon}
                </motion.div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-stone-900 text-lg">
                    {currentAchievement.name}
                  </h3>
                  <p className="text-stone-600 text-sm mt-1">
                    {currentAchievement.description}
                  </p>

                  {/* XP reward */}
                  <motion.div
                    className="flex items-center gap-1 mt-2 text-amber-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold">
                      +{currentAchievement.xpReward} XP
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Rarity badge */}
              <div className="flex justify-end mt-3">
                <span
                  className={`
                  text-xs font-bold uppercase px-3 py-1 rounded-full
                  bg-gradient-to-r ${RARITY_COLORS[currentAchievement.rarity]} text-white
                `}
                >
                  {currentAchievement.rarity}
                </span>
              </div>
            </div>

            {/* Celebration particles for epic and legendary */}
            {(currentAchievement.rarity === "epic" ||
              currentAchievement.rarity === "legendary") && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-lg"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                      y: [0, -20],
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.3 + i * 0.1,
                      repeat: 2,
                      repeatDelay: 0.5,
                    }}
                  >
                    {["✨", "⭐", "🌟", "💫"][i % 4]}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Queue indicator */}
          {queue.length > 0 && (
            <motion.div
              className="mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-xs text-stone-500 bg-white/80 px-3 py-1 rounded-full">
                +{queue.length} more achievement{queue.length > 1 ? "s" : ""}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
