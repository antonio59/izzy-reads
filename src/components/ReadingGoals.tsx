import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen,
  Flame,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useGamification } from "../contexts/GamificationContext";
import { Card } from "./ui/Card";
import { CircularProgress, Progress } from "./ui/Progress";
import { Badge } from "./ui/Badge";
import { FadeIn, StaggerContainer, StaggerItem } from "./PageTransition";
import ReadingHeatmap from "./ReadingHeatmap";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: "books" | "pages" | "streak" | "genres";
  deadline?: string;
  completed: boolean;
  emoji: string;
}

const GOAL_TYPES = [
  {
    type: "books",
    label: "Books",
    emoji: "📚",
    description: "Read a certain number of books",
  },
  {
    type: "pages",
    label: "Pages",
    emoji: "📖",
    description: "Read a certain number of pages",
  },
  {
    type: "streak",
    label: "Streak",
    emoji: "🔥",
    description: "Maintain a reading streak",
  },
  {
    type: "genres",
    label: "Genres",
    emoji: "🎭",
    description: "Explore different genres",
  },
] as const;

const ReadingGoals: React.FC = () => {
  useBooks(); // Hook needed for context subscription
  const { stats } = useGamification();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Read 20 books this year",
      target: 20,
      current: stats.booksRead,
      type: "books",
      deadline: `${new Date().getFullYear()}-12-31`,
      completed: false,
      emoji: "📚",
    },
    {
      id: "2",
      title: "Read 5000 pages",
      target: 5000,
      current: stats.pagesRead,
      type: "pages",
      completed: stats.pagesRead >= 5000,
      emoji: "📖",
    },
    {
      id: "3",
      title: "Explore 5 genres",
      target: 5,
      current: stats.genresRead,
      type: "genres",
      completed: stats.genresRead >= 5,
      emoji: "🎭",
    },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: 10,
    type: "books" as Goal["type"],
    deadline: "",
    emoji: "📚",
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: newGoal.target,
      current: 0,
      type: newGoal.type,
      deadline: newGoal.deadline || undefined,
      completed: false,
      emoji: newGoal.emoji,
    };

    setGoals((prev) => [...prev, goal]);
    setShowAddGoal(false);
    setNewGoal({
      title: "",
      target: 10,
      type: "books",
      deadline: "",
      emoji: "📚",
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Calculate overall progress
  const overallProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (sum, g) => sum + Math.min((g.current / g.target) * 100, 100),
            0,
          ) / goals.length,
        )
      : 0;

  const completedGoals = goals.filter(
    (g) => g.completed || g.current >= g.target,
  ).length;

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
                  <Target className="w-7 h-7 text-rose-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900">
                    Reading Goals
                  </h1>
                  <p className="text-gray-600">Track your reading journey</p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <CircularProgress
                  value={overallProgress}
                  max={100}
                  size={80}
                  color="primary"
                  showValue={true}
                />
                <p className="text-xs text-gray-600 mt-1">Overall</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-3xl font-display font-bold text-purple-600">
                  {completedGoals}/{goals.length}
                </p>
                <p className="text-sm text-gray-600">Goals Complete</p>
              </div>
            </div>
          </div>

          {/* Decorations */}
          <motion.span
            className="absolute top-4 right-20 text-4xl opacity-20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎯
          </motion.span>
        </Card>
      </FadeIn>

      {/* Stats Overview */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.booksRead}
            </p>
            <p className="text-sm text-gray-500">Books Read</p>
          </Card>
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.pagesRead.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Pages Read</p>
          </Card>
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-100 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.streakWeeks}
            </p>
            <p className="text-sm text-gray-500">Week Streak</p>
          </Card>
          <Card padding="md" className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-pink-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.genresRead}
            </p>
            <p className="text-sm text-gray-500">Genres Explored</p>
          </Card>
        </div>
      </FadeIn>

      {/* Reading Heatmap */}
      <FadeIn delay={0.15}>
        <ReadingHeatmap />
      </FadeIn>

      {/* Goals Section */}
      <FadeIn delay={0.2}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-gray-900">
            Your Goals
          </h2>
          <motion.button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </motion.button>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isComplete = goal.current >= goal.target;

            return (
              <StaggerItem key={goal.id}>
                <Card
                  padding="lg"
                  className={`relative overflow-hidden ${isComplete ? "ring-2 ring-green-400" : ""}`}
                >
                  {isComplete && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{goal.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-gray-900 mb-1 truncate">
                        {goal.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="gray" size="sm">
                          {goal.type}
                        </Badge>
                        {goal.deadline && (
                          <Badge
                            variant="outline"
                            size="sm"
                            icon={<Calendar className="w-3 h-3" />}
                          >
                            {new Date(goal.deadline).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {goal.current.toLocaleString()} /{" "}
                            {goal.target.toLocaleString()}
                          </span>
                          <span
                            className={`font-medium ${isComplete ? "text-green-600" : "text-purple-600"}`}
                          >
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress
                          value={goal.current}
                          max={goal.target}
                          color={isComplete ? "sage" : "primary"}
                          size="md"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Celebration effect for completed goals */}
                  {isComplete && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="absolute text-2xl"
                          initial={{
                            x: "50%",
                            y: "50%",
                            scale: 0,
                            opacity: 1,
                          }}
                          animate={{
                            x: `${20 + Math.random() * 60}%`,
                            y: `${20 + Math.random() * 60}%`,
                            scale: [0, 1, 0],
                            opacity: [1, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          {["✨", "🌟", "⭐", "💫", "🎉"][i]}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </FadeIn>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Create a New Goal
              </h2>

              <div className="space-y-4">
                {/* Goal title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g., Read 10 books this summer"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Goal type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOAL_TYPES.map((type) => (
                      <button
                        key={type.type}
                        onClick={() =>
                          setNewGoal((prev) => ({
                            ...prev,
                            type: type.type,
                            emoji: type.emoji,
                          }))
                        }
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          newGoal.type === type.type
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl block mb-1">
                          {type.emoji}
                        </span>
                        <span className="font-medium text-gray-900">
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        target: parseInt(e.target.value) || 0,
                      }))
                    }
                    min={1}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline (optional)
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingGoals;
