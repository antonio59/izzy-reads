import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Flame,
  BookOpen,
  Star,
  Award,
  Settings,
  X,
  Check,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useGamification } from "../contexts/GamificationContext";
import { useUser } from "../contexts/UserContext";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const Progress: React.FC = () => {
  const { books, readingStats } = useBooks();
  const { user, updateUserSettings } = useUser();
  const {
    totalXP,
    level,
    allAchievements,
    unlockedAchievements,
    progressPercent,
  } = useGamification();

  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [yearlyGoal, setYearlyGoal] = useState(
    user?.settings?.readingGoal || 12,
  );
  const [monthlyGoal, setMonthlyGoal] = useState(
    Math.ceil((user?.settings?.readingGoal || 12) / 12) || 2,
  );

  const readBooks = books.filter((b) => b.isRead);
  const unlockedList = allAchievements.filter((a: Achievement) =>
    unlockedAchievements.includes(a.id),
  );
  const lockedList = allAchievements.filter(
    (a: Achievement) => !unlockedAchievements.includes(a.id),
  );

  // Use progress from context
  const xpProgress = progressPercent / 100;

  // Get goals from user settings or use defaults
  const targetYearlyBooks = user?.settings?.readingGoal || 12;
  const targetMonthlyBooks = Math.ceil(targetYearlyBooks / 12) || 2;

  const handleSaveGoals = () => {
    updateUserSettings({ readingGoal: yearlyGoal });
    setShowGoalEditor(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              My Progress
            </h1>
            <p className="text-white/90 mt-1">
              Track your reading journey and achievements
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          value={readBooks.length}
          label="Books Read"
          color="purple"
        />
        <StatCard
          icon={Star}
          value={readingStats.totalPages.toLocaleString()}
          label="Pages Read"
          color="blue"
        />
        <StatCard
          icon={Flame}
          value={readingStats.readingStreak}
          label="Week Streak"
          color="orange"
        />
        <StatCard
          icon={Award}
          value={unlockedList.length}
          label="Badges Earned"
          color="green"
        />
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              {level.icon}
            </div>
            <div>
              <h3 className="font-bold text-stone-900">Level {level.level}</h3>
              <p className="text-sm text-stone-500">{level.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-purple-600">{totalXP} XP</p>
            <p className="text-sm text-stone-500">
              {Math.round((1 - xpProgress) * 100)}% to next level
            </p>
          </div>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievements
        </h2>

        {/* Unlocked */}
        {unlockedList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-stone-500 mb-3">Unlocked</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {unlockedList.map((achievement: Achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {lockedList.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 mb-3">
              Keep Reading to Unlock
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {lockedList.slice(0, 8).map((achievement: Achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reading Goals */}
      <div className="bg-white rounded-2xl p-6 border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Reading Goals
          </h2>
          <button
            onClick={() => setShowGoalEditor(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Edit Goals
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard
            title="Books This Year"
            current={readingStats.booksThisYear}
            target={targetYearlyBooks}
            icon="📚"
          />
          <GoalCard
            title="Books This Month"
            current={readingStats.booksThisMonth}
            target={targetMonthlyBooks}
            icon="📖"
          />
        </div>
      </div>

      {/* Goal Editor Modal */}
      <AnimatePresence>
        {showGoalEditor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGoalEditor(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-stone-900">
                  Set Reading Goals
                </h3>
                <button
                  onClick={() => setShowGoalEditor(false)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Books per Year
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={yearlyGoal}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setYearlyGoal(val);
                        setMonthlyGoal(Math.ceil(val / 12));
                      }}
                      className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="w-12 text-center font-bold text-purple-600">
                      {yearlyGoal}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Books per Month
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={monthlyGoal}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setMonthlyGoal(val);
                        setYearlyGoal(val * 12);
                      }}
                      className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="w-12 text-center font-bold text-purple-600">
                      {monthlyGoal}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setShowGoalEditor(false)}
                    className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGoals}
                    className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Stat Card
interface StatCardProps {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: "purple" | "blue" | "orange" | "green";
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
}) => {
  const colors = {
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-red-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-4 border border-stone-100"
      whileHover={{ y: -2 }}
    >
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-sm text-stone-500">{label}</p>
    </motion.div>
  );
};

// Achievement Badge
interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  unlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
}) => {
  return (
    <motion.div
      className={`p-3 rounded-xl text-center transition-all ${
        unlocked
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
          : "bg-stone-50 border border-stone-100 opacity-50"
      }`}
      whileHover={unlocked ? { scale: 1.05 } : {}}
    >
      <div className={`text-3xl mb-2 ${unlocked ? "" : "grayscale"}`}>
        {achievement.icon}
      </div>
      <p
        className={`text-xs font-medium ${unlocked ? "text-stone-900" : "text-stone-500"}`}
      >
        {achievement.name}
      </p>
    </motion.div>
  );
};

// Goal Card
interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  icon: string;
}

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  current,
  target,
  icon,
}) => {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div
      className={`p-4 rounded-xl border ${isComplete ? "bg-green-50 border-green-200" : "bg-stone-50 border-stone-100"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium text-stone-900">{title}</span>
        </div>
        <span
          className={`font-bold ${isComplete ? "text-green-600" : "text-stone-600"}`}
        >
          {current}/{target}
        </span>
      </div>
      <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${isComplete ? "bg-green-500" : "bg-purple-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {isComplete && (
        <p className="text-xs text-green-600 mt-2 font-medium">
          Goal Complete!
        </p>
      )}
    </div>
  );
};

export default Progress;
