import { describe, it, expect } from "vitest";
import {
  getAchievement,
  getAchievementsByCategory,
  getVisibleAchievements,
  checkAchievementProgress,
  getNewlyUnlockedAchievements,
  calculateAchievementXP,
  ACHIEVEMENTS,
  type UserStats,
} from "../achievements";

describe("Achievement System", () => {
  const emptyStats: UserStats = {
    booksRead: 0,
    pagesRead: 0,
    streakWeeks: 0,
    genresRead: 0,
    poemsWritten: 0,
    postsWritten: 0,
    ratingsGiven: 0,
    challengesCompleted: 0,
  };

  describe("getAchievement", () => {
    it("should find achievement by ID", () => {
      const achievement = getAchievement("first_book");
      expect(achievement).toBeDefined();
      expect(achievement?.name).toBe("First Chapter");
    });

    it("should return undefined for invalid ID", () => {
      const achievement = getAchievement("invalid_id");
      expect(achievement).toBeUndefined();
    });
  });

  describe("getAchievementsByCategory", () => {
    it("should filter achievements by category", () => {
      const readingAchievements = getAchievementsByCategory("reading");
      expect(readingAchievements.length).toBeGreaterThan(0);
      expect(readingAchievements.every((a) => a.category === "reading")).toBe(
        true,
      );
    });

    it("should return writing achievements", () => {
      const writingAchievements = getAchievementsByCategory("writing");
      expect(writingAchievements.length).toBeGreaterThan(0);
      expect(writingAchievements.some((a) => a.id === "first_poem")).toBe(true);
    });
  });

  describe("getVisibleAchievements", () => {
    it("should hide secret achievements when not unlocked", () => {
      const visible = getVisibleAchievements([]);
      const secretCount = ACHIEVEMENTS.filter((a) => a.secret).length;
      expect(visible.length).toBe(ACHIEVEMENTS.length - secretCount);
    });

    it("should show secret achievements when unlocked", () => {
      const visible = getVisibleAchievements(["century_reader"]);
      expect(visible.some((a) => a.id === "century_reader")).toBe(true);
    });
  });

  describe("checkAchievementProgress", () => {
    it("should check progress for books_read achievement", () => {
      const stats = { ...emptyStats, booksRead: 3 };
      const achievement = getAchievement("bookworm")!; // Requires 5 books

      const { unlocked, progress } = checkAchievementProgress(
        achievement,
        stats,
      );

      expect(unlocked).toBe(false);
      expect(progress).toBe(60); // 3/5 = 60%
    });

    it("should mark achievement as unlocked when requirement met", () => {
      const stats = { ...emptyStats, booksRead: 5 };
      const achievement = getAchievement("bookworm")!;

      const { unlocked, progress } = checkAchievementProgress(
        achievement,
        stats,
      );

      expect(unlocked).toBe(true);
      expect(progress).toBe(100);
    });

    it("should check pages_read achievement", () => {
      const stats = { ...emptyStats, pagesRead: 250 };
      const achievement = getAchievement("page_turner")!; // Requires 500 pages

      const { unlocked, progress } = checkAchievementProgress(
        achievement,
        stats,
      );

      expect(unlocked).toBe(false);
      expect(progress).toBe(50);
    });
  });

  describe("getNewlyUnlockedAchievements", () => {
    it("should return newly unlocked achievements", () => {
      const previouslyUnlocked: string[] = [];
      const stats = { ...emptyStats, booksRead: 1 };

      const newlyUnlocked = getNewlyUnlockedAchievements(
        previouslyUnlocked,
        stats,
      );

      expect(newlyUnlocked.length).toBe(1);
      expect(newlyUnlocked[0].id).toBe("first_book");
    });

    it("should not return already unlocked achievements", () => {
      const previouslyUnlocked = ["first_book"];
      const stats = { ...emptyStats, booksRead: 1 };

      const newlyUnlocked = getNewlyUnlockedAchievements(
        previouslyUnlocked,
        stats,
      );

      expect(newlyUnlocked.length).toBe(0);
    });

    it("should return multiple achievements at once", () => {
      const previouslyUnlocked: string[] = [];
      const stats = {
        ...emptyStats,
        booksRead: 1,
        poemsWritten: 1,
      };

      const newlyUnlocked = getNewlyUnlockedAchievements(
        previouslyUnlocked,
        stats,
      );

      expect(newlyUnlocked.length).toBe(2);
      expect(newlyUnlocked.some((a) => a.id === "first_book")).toBe(true);
      expect(newlyUnlocked.some((a) => a.id === "first_poem")).toBe(true);
    });
  });

  describe("calculateAchievementXP", () => {
    it("should calculate total XP from achievements", () => {
      const unlocked = ["first_book", "first_poem"];
      const xp = calculateAchievementXP(unlocked);

      // first_book = 50 XP, first_poem = 50 XP
      expect(xp).toBe(100);
    });

    it("should return 0 for no achievements", () => {
      const xp = calculateAchievementXP([]);
      expect(xp).toBe(0);
    });

    it("should handle invalid achievement IDs gracefully", () => {
      const xp = calculateAchievementXP(["invalid_id", "first_book"]);
      expect(xp).toBe(50); // Only first_book XP
    });
  });
});
