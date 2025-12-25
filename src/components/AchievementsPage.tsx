import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Star, Filter } from "lucide-react";
import { useGamification } from "../contexts/GamificationContext";
import {
  ACHIEVEMENTS,
  type Achievement,
  type AchievementCategory,
} from "../lib/achievements";
import { Card } from "./ui/Card";
import { EmptyAchievements } from "./ui/EmptyState";
import { FadeIn, StaggerContainer, StaggerItem } from "./PageTransition";

const CATEGORY_INFO: Record<
  AchievementCategory,
  { label: string; emoji: string; color: string }
> = {
  reading: {
    label: "Reading",
    emoji: "📚",
    color: "from-blue-400 to-blue-600",
  },
  streak: {
    label: "Streaks",
    emoji: "🔥",
    color: "from-orange-400 to-red-500",
  },
  genre: { label: "Genres", emoji: "🎭", color: "from-purple-400 to-pink-500" },
  writing: {
    label: "Writing",
    emoji: "✍️",
    color: "from-teal-400 to-cyan-500",
  },
  social: { label: "Social", emoji: "💬", color: "from-pink-400 to-rose-500" },
  special: {
    label: "Special",
    emoji: "⭐",
    color: "from-amber-400 to-yellow-500",
  },
};

const RARITY_INFO = {
  common: { label: "Common", color: "bg-stone-200 text-stone-700", glow: "" },
  rare: {
    label: "Rare",
    color: "bg-blue-100 text-blue-700",
    glow: "shadow-blue-200",
  },
  epic: {
    label: "Epic",
    color: "bg-purple-100 text-purple-700",
    glow: "shadow-purple-200",
  },
  legendary: {
    label: "Legendary",
    color: "bg-amber-100 text-amber-700",
    glow: "shadow-amber-200",
  },
};

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  progress: number;
}

function AchievementCard({
  achievement,
  unlocked,
  progress,
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rarityInfo = RARITY_INFO[achievement.rarity];

  return (
    <motion.div
      className={`relative p-5 rounded-2xl transition-all ${
        unlocked
          ? "bg-white shadow-soft hover:shadow-lg"
          : "bg-stone-50 opacity-75"
      } ${unlocked && achievement.rarity !== "common" ? `shadow-lg ${rarityInfo.glow}` : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Rarity badge */}
      <div className="absolute top-3 right-3">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${rarityInfo.color}`}
        >
          {rarityInfo.label}
        </span>
      </div>

      {/* Icon */}
      <div className="relative mb-4">
        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
            unlocked
              ? `bg-gradient-to-br ${CATEGORY_INFO[achievement.category].color}`
              : "bg-stone-200"
          }`}
          animate={unlocked && isHovered ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {unlocked ? (
            achievement.icon
          ) : (
            <Lock className="w-8 h-8 text-stone-400" />
          )}
        </motion.div>

        {unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <span className="text-white text-sm">✓</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <h3
        className={`font-display font-bold mb-1 ${unlocked ? "text-stone-900" : "text-stone-400"}`}
      >
        {unlocked || !achievement.secret ? achievement.name : "???"}
      </h3>
      <p
        className={`text-sm mb-3 ${unlocked ? "text-stone-600" : "text-stone-400"}`}
      >
        {unlocked || !achievement.secret
          ? achievement.description
          : "Keep reading to unlock!"}
      </p>

      {/* Progress bar for locked achievements */}
      {!unlocked && progress > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-stone-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* XP reward */}
      <div className="flex items-center gap-1 text-sm">
        <Star
          className={`w-4 h-4 ${unlocked ? "text-amber-500" : "text-stone-400"}`}
        />
        <span
          className={unlocked ? "text-amber-600 font-medium" : "text-stone-400"}
        >
          +{achievement.xpReward} XP
        </span>
      </div>

      {/* Shine effect for legendary */}
      {unlocked && achievement.rarity === "legendary" && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12" />
        </motion.div>
      )}
    </motion.div>
  );
}

const AchievementsPage: React.FC = () => {
  const {
    level,
    xpInLevel,
    xpForNextLevel,
    unlockedAchievements,
    getAchievementProgress,
  } = useGamification();

  const [filter, setFilter] = useState<AchievementCategory | "all">("all");
  const [showUnlocked, setShowUnlocked] = useState<
    "all" | "unlocked" | "locked"
  >("all");

  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    if (filter !== "all" && a.category !== filter) return false;
    if (showUnlocked === "unlocked" && !unlockedAchievements.includes(a.id))
      return false;
    if (showUnlocked === "locked" && unlockedAchievements.includes(a.id))
      return false;
    // Don't show secret achievements that aren't unlocked
    if (a.secret && !unlockedAchievements.includes(a.id)) return false;
    return true;
  });

  const stats = {
    total: ACHIEVEMENTS.filter(
      (a) => !a.secret || unlockedAchievements.includes(a.id),
    ).length,
    unlocked: unlockedAchievements.length,
    totalXP: unlockedAchievements.reduce((sum, id) => {
      const a = ACHIEVEMENTS.find((ach) => ach.id === id);
      return sum + (a?.xpReward || 0);
    }, 0),
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <FadeIn>
        <Card
          variant="gradient"
          padding="lg"
          className="relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-stone-900">
                    Achievements
                  </h1>
                  <p className="text-stone-600">
                    {stats.unlocked} of {stats.total} unlocked
                  </p>
                </div>
              </div>
            </div>

            {/* Level display */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 min-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{level.icon}</span>
                <div>
                  <p className="font-bold text-stone-900">Level {level.level}</p>
                  <p className="text-sm text-stone-600">{level.title}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>{xpInLevel.toLocaleString()} XP</span>
                  <span>{xpForNextLevel.toLocaleString()} XP</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(xpInLevel / xpForNextLevel) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating decorations */}
          <motion.span
            className="absolute top-4 right-20 text-4xl opacity-20"
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🏆
          </motion.span>
          <motion.span
            className="absolute bottom-4 right-4 text-3xl opacity-20"
            animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ⭐
          </motion.span>
        </Card>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-stone-600">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setFilter(key as AchievementCategory)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  filter === key
                    ? "bg-purple-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span>{info.emoji}</span>
                <span className="hidden sm:inline">{info.label}</span>
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-stone-200 hidden sm:block" />

          {/* Status filters */}
          <div className="flex gap-2">
            {(["all", "unlocked", "locked"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setShowUnlocked(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  showUnlocked === status
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const { unlocked, progress } = getAchievementProgress(
              achievement.id,
            );
            return (
              <StaggerItem key={achievement.id}>
                <AchievementCard
                  achievement={achievement}
                  unlocked={unlocked}
                  progress={progress}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      ) : (
        <EmptyAchievements />
      )}

      {/* Stats footer */}
      <FadeIn delay={0.3}>
        <Card
          padding="lg"
          className="bg-gradient-to-r from-purple-50 to-pink-50"
        >
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-purple-600">
                {stats.unlocked}
              </p>
              <p className="text-sm text-stone-600">Achievements Unlocked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-pink-600">
                {stats.totalXP.toLocaleString()}
              </p>
              <p className="text-sm text-stone-600">XP from Achievements</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-amber-600">
                {Math.round((stats.unlocked / stats.total) * 100)}%
              </p>
              <p className="text-sm text-stone-600">Completion</p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

export default AchievementsPage;
