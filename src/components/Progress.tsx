import { motion } from "framer-motion";
import { Trophy, Target, Flame, BookOpen, Star, Award } from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useGamification } from "../contexts/GamificationContext";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const Progress: React.FC = () => {
  const { books, readingStats } = useBooks();
  const {
    totalXP,
    level,
    allAchievements,
    unlockedAchievements,
    progressPercent,
  } = useGamification();

  const readBooks = books.filter((b) => b.isRead);
  const unlockedList = allAchievements.filter((a: Achievement) =>
    unlockedAchievements.includes(a.id),
  );
  const lockedList = allAchievements.filter(
    (a: Achievement) => !unlockedAchievements.includes(a.id),
  );

  // Use progress from context
  const xpProgress = progressPercent / 100;

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
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              {level.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Level {level.level}</h3>
              <p className="text-sm text-gray-500">{level.title}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-purple-600">{totalXP} XP</p>
            <p className="text-sm text-gray-500">
              {Math.round((1 - xpProgress) * 100)}% to next level
            </p>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievements
        </h2>

        {/* Unlocked */}
        {unlockedList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Unlocked</h3>
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
            <h3 className="text-sm font-medium text-gray-500 mb-3">
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
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          Reading Goals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard
            title="Books This Year"
            current={readingStats.booksThisYear}
            target={12}
            icon="📚"
          />
          <GoalCard
            title="Books This Month"
            current={readingStats.booksThisMonth}
            target={2}
            icon="📖"
          />
        </div>
      </div>
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
      className="bg-white rounded-xl p-4 border border-gray-100"
      whileHover={{ y: -2 }}
    >
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
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
          : "bg-gray-50 border border-gray-100 opacity-50"
      }`}
      whileHover={unlocked ? { scale: 1.05 } : {}}
    >
      <div className={`text-3xl mb-2 ${unlocked ? "" : "grayscale"}`}>
        {achievement.icon}
      </div>
      <p
        className={`text-xs font-medium ${unlocked ? "text-gray-900" : "text-gray-500"}`}
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
      className={`p-4 rounded-xl border ${isComplete ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <span
          className={`font-bold ${isComplete ? "text-green-600" : "text-gray-600"}`}
        >
          {current}/{target}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
