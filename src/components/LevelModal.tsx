import { motion } from "framer-motion";
import { Sparkles, TreeDeciduous } from "lucide-react";
import { Modal } from "./ui/Modal";
import {
  LEVELS,
  getLevelProgress,
  formatXP,
  XP_REWARDS,
} from "../lib/leveling";

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalXP: number;
}

export function LevelModal({ isOpen, onClose, totalXP }: LevelModalProps) {
  const progress = getLevelProgress(totalXP);
  const { level, xpInLevel, xpForNextLevel, progressPercent, nextLevel } =
    progress;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={level.title}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-6 text-white relative overflow-hidden -mx-6 -mt-6 mb-6">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-4 text-4xl">🌟</div>
          <div className="absolute top-8 right-8 text-3xl">✨</div>
          <div className="absolute bottom-2 left-1/3 text-2xl">🌱</div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            className="text-5xl"
            animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {level.icon}
          </motion.div>
          <div>
            <p className="text-white/80 text-sm">Level {level.level}</p>
            <h2 className="text-2xl font-display font-bold">
              {level.title}
            </h2>
            <p className="text-white/90 text-sm mt-1">
              {formatXP(totalXP)} Total XP
            </p>
          </div>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>{formatXP(xpInLevel)} XP</span>
              <span>{formatXP(xpForNextLevel)} XP</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-center text-sm text-white/90 mt-2">
              {formatXP(xpForNextLevel - xpInLevel)} XP to{" "}
              {nextLevel.title} {nextLevel.icon}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[50vh] -mx-6 -mb-6 px-6 pb-6">
              {/* Level Tree */}
              <div className="flex items-center gap-2 mb-4">
                <TreeDeciduous className="w-5 h-5 text-green-600" />
                <h3 className="font-display font-bold text-stone-900">
                  Your Reading Journey
                </h3>
              </div>

              <div className="relative">
                {/* Tree trunk line */}
                <div className="absolute left-[22px] top-6 bottom-6 w-1 bg-gradient-to-b from-green-300 via-green-400 to-stone-200 rounded-full" />

                <div className="space-y-2">
                  {LEVELS.map((lvl) => {
                    const isComplete = level.level > lvl.level;
                    const isCurrent = level.level === lvl.level;
                    const isLocked = level.level < lvl.level;

                    return (
                      <motion.div
                        key={lvl.level}
                        className={`
                          relative flex items-center gap-3 p-3 rounded-xl transition-all
                          ${isCurrent ? "bg-gradient-to-r from-purple-50 to-pink-50 ring-2 ring-purple-300" : ""}
                          ${isComplete ? "bg-green-50" : ""}
                          ${isLocked ? "opacity-50" : ""}
                        `}
                        initial={false}
                        animate={isCurrent ? { scale: [1, 1.01, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {/* Node on the tree */}
                        <div
                          className={`
                            w-11 h-11 rounded-full flex items-center justify-center text-xl
                            border-4 relative z-10
                            ${isComplete ? "bg-green-100 border-green-400" : ""}
                            ${isCurrent ? "bg-purple-100 border-purple-400 ring-4 ring-purple-200" : ""}
                            ${isLocked ? "bg-stone-100 border-stone-300 grayscale" : ""}
                          `}
                        >
                          {lvl.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${isLocked ? "text-stone-400" : "text-stone-900"}`}
                            >
                              Level {lvl.level}
                            </span>
                            {isCurrent && (
                              <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                You are here!
                              </span>
                            )}
                            {isComplete && (
                              <span className="text-xs text-green-600">✓</span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${isLocked ? "text-stone-400" : "text-stone-600"}`}
                          >
                            {lvl.title}
                          </p>
                        </div>

                        <span
                          className={`text-xs ${isLocked ? "text-stone-400" : "text-stone-500"}`}
                        >
                          {formatXP(lvl.minXP)} XP
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* How to earn XP */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h4 className="font-display font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  How to Earn XP
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-600">Finish a book</span>
                    <span className="font-semibold text-purple-600">
                      +{XP_REWARDS.finishBook}
                    </span>
                  </div>
                  <div className="flex justify-between bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-600">Long book (400+)</span>
                    <span className="font-semibold text-purple-600">
                      +{XP_REWARDS.finishLongBook}
                    </span>
                  </div>
                  <div className="flex justify-between bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-600">Rate a book</span>
                    <span className="font-semibold text-purple-600">
                      +{XP_REWARDS.rateBook}
                    </span>
                  </div>
                  <div className="flex justify-between bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-600">Write review</span>
                    <span className="font-semibold text-purple-600">
                      +{XP_REWARDS.writeReview}
                    </span>
                  </div>
                  <div className="flex justify-between bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-600">Write poem</span>
                    <span className="font-semibold text-purple-600">
                      +{XP_REWARDS.writePoem}
                    </span>
                  </div>
                  <div className="flex justify-between bg-stone-50 rounded-lg px-3 py-2">
                    <span className="text-stone-600">Blog post</span>
                    <span className="font-semibold text-purple-600">
                      +{XP_REWARDS.writeBlogPost}
                    </span>
                  </div>
                </div>
              </div>
      </div>
    </Modal>
  );
}

export default LevelModal;
