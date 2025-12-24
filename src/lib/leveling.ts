// XP and Leveling System for Izzy's Bookshelf
// Defines level progression, titles, and XP rewards

export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: string;
}

// Level progression table
// XP required increases with each level
export const LEVELS: Level[] = [
  { level: 1, title: "Curious Reader", minXP: 0, maxXP: 100, icon: "🌱" },
  { level: 2, title: "Page Explorer", minXP: 100, maxXP: 250, icon: "🌿" },
  { level: 3, title: "Story Seeker", minXP: 250, maxXP: 450, icon: "🌳" },
  { level: 4, title: "Book Adventurer", minXP: 450, maxXP: 700, icon: "⭐" },
  { level: 5, title: "Chapter Champion", minXP: 700, maxXP: 1000, icon: "🌟" },
  { level: 6, title: "Tale Traveler", minXP: 1000, maxXP: 1400, icon: "✨" },
  { level: 7, title: "Word Wizard", minXP: 1400, maxXP: 1900, icon: "🔮" },
  { level: 8, title: "Literary Legend", minXP: 1900, maxXP: 2500, icon: "👑" },
  { level: 9, title: "Reading Master", minXP: 2500, maxXP: 3200, icon: "🏆" },
  { level: 10, title: "Book Sage", minXP: 3200, maxXP: 4000, icon: "📜" },
  { level: 11, title: "Story Guardian", minXP: 4000, maxXP: 5000, icon: "🛡️" },
  { level: 12, title: "Epic Reader", minXP: 5000, maxXP: 6200, icon: "⚔️" },
  {
    level: 13,
    title: "Legendary Bookworm",
    minXP: 6200,
    maxXP: 7600,
    icon: "🐉",
  },
  { level: 14, title: "Mythic Scholar", minXP: 7600, maxXP: 9200, icon: "🌙" },
  {
    level: 15,
    title: "Grand Librarian",
    minXP: 9200,
    maxXP: 11000,
    icon: "🏛️",
  },
  {
    level: 16,
    title: "Keeper of Tales",
    minXP: 11000,
    maxXP: 13000,
    icon: "📖",
  },
  {
    level: 17,
    title: "Eternal Reader",
    minXP: 13000,
    maxXP: 15500,
    icon: "♾️",
  },
  {
    level: 18,
    title: "Timeless Scholar",
    minXP: 15500,
    maxXP: 18500,
    icon: "⏳",
  },
  {
    level: 19,
    title: "Cosmic Bookkeeper",
    minXP: 18500,
    maxXP: 22000,
    icon: "🌌",
  },
  {
    level: 20,
    title: "Ultimate Bibliophile",
    minXP: 22000,
    maxXP: Infinity,
    icon: "💎",
  },
];

// XP rewards for various actions
export const XP_REWARDS = {
  // Reading
  finishBook: 50,
  finishLongBook: 75, // 400+ pages
  finishEpicBook: 100, // 600+ pages

  // Rating & Reviews
  rateBook: 10,
  writeReview: 25, // detailed notes

  // Writing
  writePoem: 20,
  writeBlogPost: 30,
  publishBlogPost: 15, // bonus for getting approved

  // Challenges
  completeChallenge: 100,
  completeBingoRow: 50,
  completeBingoFull: 200,

  // Streaks
  weeklyStreakBonus: 25, // per week maintained
  monthlyStreakBonus: 100,

  // Milestones (one-time bonuses)
  firstBook: 25,
  tenthBook: 50,
  hundredthPage: 10,
  thousandthPage: 50,
};

// Get level info for a given XP amount
export function getLevelForXP(totalXP: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Get progress within current level
export function getLevelProgress(totalXP: number): {
  level: Level;
  currentXP: number;
  xpInLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  nextLevel: Level | null;
} {
  const level = getLevelForXP(totalXP);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1) || null;

  const xpInLevel = totalXP - level.minXP;
  const xpForNextLevel = level.maxXP - level.minXP;

  return {
    level,
    currentXP: totalXP,
    xpInLevel,
    xpForNextLevel,
    progressPercent: Math.min((xpInLevel / xpForNextLevel) * 100, 100),
    nextLevel,
  };
}

// Calculate XP for finishing a book based on page count
export function getBookFinishXP(pageCount: number): number {
  if (pageCount >= 600) return XP_REWARDS.finishEpicBook;
  if (pageCount >= 400) return XP_REWARDS.finishLongBook;
  return XP_REWARDS.finishBook;
}

// Check if level up occurred
export function checkLevelUp(previousXP: number, newXP: number): Level | null {
  const previousLevel = getLevelForXP(previousXP);
  const newLevel = getLevelForXP(newXP);

  if (newLevel.level > previousLevel.level) {
    return newLevel;
  }
  return null;
}

// Get all levels up to and including current
export function getCompletedLevels(totalXP: number): Level[] {
  return LEVELS.filter((level) => totalXP >= level.minXP);
}

// Format XP number with commas
export function formatXP(xp: number): string {
  return xp.toLocaleString();
}

// Calculate total XP from reading stats
export interface ReadingActivity {
  booksRead: number;
  pagesRead: number;
  booksRated: number;
  booksWithNotes: number;
  poemsWritten: number;
  blogPostsWritten: number;
  blogPostsPublished: number;
  challengesCompleted: number;
  currentStreak: number;
}

export function calculateTotalXP(
  activity: ReadingActivity,
  achievementXP: number = 0,
): number {
  let total = 0;

  // Books (simplified - assumes average books)
  total += activity.booksRead * XP_REWARDS.finishBook;

  // Ratings
  total += activity.booksRated * XP_REWARDS.rateBook;

  // Reviews/Notes
  total += activity.booksWithNotes * XP_REWARDS.writeReview;

  // Writing
  total += activity.poemsWritten * XP_REWARDS.writePoem;
  total += activity.blogPostsWritten * XP_REWARDS.writeBlogPost;
  total += activity.blogPostsPublished * XP_REWARDS.publishBlogPost;

  // Challenges
  total += activity.challengesCompleted * XP_REWARDS.completeChallenge;

  // Streak bonuses
  total += activity.currentStreak * XP_REWARDS.weeklyStreakBonus;

  // Achievement XP
  total += achievementXP;

  return total;
}
