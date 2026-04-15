import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { useBooks } from "./BookContext";
import {
  getLevelProgress,
  calculateTotalXP,
  checkLevelUp,
  type Level,
  type ReadingActivity,
} from "../lib/leveling";
import {
  ACHIEVEMENTS,
  checkAchievementProgress,
  getNewlyUnlockedAchievements,
  calculateAchievementXP,
  type Achievement,
  type UserStats,
} from "../lib/achievements";

interface GamificationState {
  totalXP: number;
  level: Level;
  xpInLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  nextLevel: Level | null;
  unlockedAchievements: string[];
  recentlyUnlocked: Achievement[];
  stats: UserStats;
}

interface GamificationContextType extends GamificationState {
  awardXP: (amount: number, reason: string) => void;
  checkAchievements: () => Achievement[];
  dismissRecentAchievements: () => void;
  getAchievementProgress: (achievementId: string) => {
    unlocked: boolean;
    progress: number;
  };
  allAchievements: Achievement[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined,
);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamification must be used within a GamificationProvider",
    );
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "izzys-bookshelf-gamification";

export const GamificationProvider: React.FC<GamificationProviderProps> = ({
  children,
}) => {
  const { books, poems, blogPosts, readingStats, readingChallenges } =
    useBooks();

  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.totalXP || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.unlockedAchievements || [];
        } catch {
          return [];
        }
      }
      return [];
    },
  );
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement[]>([]);
  const [xpHistory, setXPHistory] = useState<
    { amount: number; reason: string; date: string }[]
  >(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.xpHistory || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Calculate user stats from book context
  const stats: UserStats = useMemo(
    () => ({
      booksRead: books.filter((b) => b.isRead).length,
      pagesRead: books
        .filter((b) => b.isRead)
        .reduce((sum, b) => sum + (b.pageCount || 0), 0),
      streakWeeks: readingStats.readingStreak,
      genresRead: new Set(books.filter((b) => b.isRead).map((b) => b.genre))
        .size,
      poemsWritten: poems.length,
      postsWritten: blogPosts.length,
      ratingsGiven: books.filter((b) => b.rating && b.rating > 0).length,
      challengesCompleted: readingChallenges.filter((c) => c.completed).length,
    }),
    [
      books,
      readingStats.readingStreak,
      poems.length,
      blogPosts.length,
      readingChallenges,
    ],
  );

  // Save state to localStorage
  useEffect(() => {
    const state = { totalXP, unlockedAchievements, xpHistory };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [totalXP, unlockedAchievements, xpHistory]);

  // Calculate derived XP from reading activity during render
  const calculatedXP = useMemo(() => {
    const activity: ReadingActivity = {
      booksRead: stats.booksRead,
      pagesRead: stats.pagesRead,
      booksRated: stats.ratingsGiven,
      booksWithNotes: books.filter((b) => b.notes && b.notes.length > 50)
        .length,
      poemsWritten: stats.poemsWritten,
      blogPostsWritten: stats.postsWritten,
      blogPostsPublished: blogPosts.filter((p) => p.status === "published")
        .length,
      challengesCompleted: stats.challengesCompleted,
      currentStreak: stats.streakWeeks,
    };

    const achievementXP = calculateAchievementXP(unlockedAchievements);
    return calculateTotalXP(activity, achievementXP);
  }, [stats, unlockedAchievements, books, blogPosts]);

  // Sync calculated XP during render (React will bail out if unchanged)
  if (calculatedXP > totalXP) {
    setTotalXP(calculatedXP);
  }

  // Check for new achievements during render
  const newAchievements = useMemo(
    () => getNewlyUnlockedAchievements(unlockedAchievements, stats),
    [unlockedAchievements, stats],
  );
  if (newAchievements.length > 0) {
    setUnlockedAchievements((prev) => [
      ...prev,
      ...newAchievements.map((a) => a.id),
    ]);
    setRecentlyUnlocked((prev) => [...prev, ...newAchievements]);
  }

  const levelProgress = getLevelProgress(totalXP);

  const awardXP = useCallback(
    (amount: number, reason: string) => {
      const previousXP = totalXP;
      const newXP = totalXP + amount;

      setTotalXP(newXP);
      setXPHistory((prev) => [
        { amount, reason, date: new Date().toISOString() },
        ...prev.slice(0, 49), // Keep last 50 entries
      ]);

      // Check for level up
      const newLevel = checkLevelUp(previousXP, newXP);
      if (newLevel) {
        // Level up notification could be handled here
      }
    },
    [totalXP],
  );

  const checkAchievements = useCallback((): Achievement[] => {
    return getNewlyUnlockedAchievements(unlockedAchievements, stats);
  }, [unlockedAchievements, stats]);

  const dismissRecentAchievements = useCallback(() => {
    setRecentlyUnlocked([]);
  }, []);

  const getAchievementProgress = useCallback(
    (achievementId: string): { unlocked: boolean; progress: number } => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!achievement) return { unlocked: false, progress: 0 };

      if (unlockedAchievements.includes(achievementId)) {
        return { unlocked: true, progress: 100 };
      }

      return checkAchievementProgress(achievement, stats);
    },
    [unlockedAchievements, stats],
  );

  const value: GamificationContextType = {
    totalXP,
    level: levelProgress.level,
    xpInLevel: levelProgress.xpInLevel,
    xpForNextLevel: levelProgress.xpForNextLevel,
    progressPercent: levelProgress.progressPercent,
    nextLevel: levelProgress.nextLevel,
    unlockedAchievements,
    recentlyUnlocked,
    stats,
    awardXP,
    checkAchievements,
    dismissRecentAchievements,
    getAchievementProgress,
    allAchievements: ACHIEVEMENTS,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
