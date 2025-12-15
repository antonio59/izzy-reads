import { describe, it, expect } from "vitest";
import {
  getLevelForXP,
  getLevelProgress,
  getBookFinishXP,
  checkLevelUp,
  calculateTotalXP,
} from "../leveling";

describe("Leveling System", () => {
  describe("getLevelForXP", () => {
    it("should return level 1 for 0 XP", () => {
      const level = getLevelForXP(0);
      expect(level.level).toBe(1);
      expect(level.title).toBe("Curious Reader");
    });

    it("should return level 2 for 100 XP", () => {
      const level = getLevelForXP(100);
      expect(level.level).toBe(2);
      expect(level.title).toBe("Page Explorer");
    });

    it("should return level 5 for 700 XP", () => {
      const level = getLevelForXP(700);
      expect(level.level).toBe(5);
    });

    it("should return max level for very high XP", () => {
      const level = getLevelForXP(100000);
      expect(level.level).toBe(20);
      expect(level.title).toBe("Ultimate Bibliophile");
    });
  });

  describe("getLevelProgress", () => {
    it("should calculate progress correctly at level 1", () => {
      const progress = getLevelProgress(50);
      expect(progress.level.level).toBe(1);
      expect(progress.xpInLevel).toBe(50);
      expect(progress.xpForNextLevel).toBe(100);
      expect(progress.progressPercent).toBe(50);
    });

    it("should show next level info", () => {
      const progress = getLevelProgress(50);
      expect(progress.nextLevel?.level).toBe(2);
      expect(progress.nextLevel?.title).toBe("Page Explorer");
    });

    it("should handle max level", () => {
      const progress = getLevelProgress(25000);
      expect(progress.level.level).toBe(20);
      expect(progress.nextLevel).toBeNull();
    });
  });

  describe("getBookFinishXP", () => {
    it("should return 50 XP for normal books", () => {
      expect(getBookFinishXP(200)).toBe(50);
      expect(getBookFinishXP(300)).toBe(50);
    });

    it("should return 75 XP for long books (400+ pages)", () => {
      expect(getBookFinishXP(400)).toBe(75);
      expect(getBookFinishXP(500)).toBe(75);
    });

    it("should return 100 XP for epic books (600+ pages)", () => {
      expect(getBookFinishXP(600)).toBe(100);
      expect(getBookFinishXP(1000)).toBe(100);
    });
  });

  describe("checkLevelUp", () => {
    it("should detect level up", () => {
      const newLevel = checkLevelUp(90, 110);
      expect(newLevel).not.toBeNull();
      expect(newLevel?.level).toBe(2);
    });

    it("should return null if no level up", () => {
      const newLevel = checkLevelUp(50, 90);
      expect(newLevel).toBeNull();
    });

    it("should handle multiple level ups", () => {
      const newLevel = checkLevelUp(50, 300);
      expect(newLevel?.level).toBe(3);
    });
  });

  describe("calculateTotalXP", () => {
    it("should calculate XP from reading activity", () => {
      const activity = {
        booksRead: 5,
        pagesRead: 1000,
        booksRated: 3,
        booksWithNotes: 2,
        poemsWritten: 1,
        blogPostsWritten: 1,
        blogPostsPublished: 1,
        challengesCompleted: 0,
        currentStreak: 2,
      };

      const xp = calculateTotalXP(activity);

      // 5 books * 50 = 250
      // 3 ratings * 10 = 30
      // 2 notes * 25 = 50
      // 1 poem * 20 = 20
      // 1 blog post * 30 = 30
      // 1 published * 15 = 15
      // 2 streak weeks * 25 = 50
      // Total = 445
      expect(xp).toBe(445);
    });

    it("should include achievement XP", () => {
      const activity = {
        booksRead: 0,
        pagesRead: 0,
        booksRated: 0,
        booksWithNotes: 0,
        poemsWritten: 0,
        blogPostsWritten: 0,
        blogPostsPublished: 0,
        challengesCompleted: 0,
        currentStreak: 0,
      };

      const xp = calculateTotalXP(activity, 100);
      expect(xp).toBe(100);
    });
  });
});
