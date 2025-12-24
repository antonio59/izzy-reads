// Achievement System for Izzy's Bookshelf
// Defines all achievements, their requirements, and rewards

export type AchievementCategory =
  | "reading"
  | "streak"
  | "genre"
  | "writing"
  | "social"
  | "special";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  requirement: {
    type:
      | "books_read"
      | "pages_read"
      | "streak_days"
      | "genres_read"
      | "poems_written"
      | "posts_written"
      | "rating_given"
      | "challenge_complete";
    value: number;
  };
  xpReward: number;
  secret?: boolean; // Hidden until unlocked
}

// All achievements in the system
export const ACHIEVEMENTS: Achievement[] = [
  // === READING MILESTONES ===
  {
    id: "first_book",
    name: "First Chapter",
    description: "Read your very first book",
    icon: "📖",
    category: "reading",
    rarity: "common",
    requirement: { type: "books_read", value: 1 },
    xpReward: 50,
  },
  {
    id: "bookworm",
    name: "Bookworm",
    description: "Read 5 books",
    icon: "🐛",
    category: "reading",
    rarity: "common",
    requirement: { type: "books_read", value: 5 },
    xpReward: 100,
  },
  {
    id: "book_lover",
    name: "Book Lover",
    description: "Read 10 books",
    icon: "💕",
    category: "reading",
    rarity: "rare",
    requirement: { type: "books_read", value: 10 },
    xpReward: 200,
  },
  {
    id: "book_dragon",
    name: "Book Dragon",
    description: "Read 25 books",
    icon: "🐉",
    category: "reading",
    rarity: "epic",
    requirement: { type: "books_read", value: 25 },
    xpReward: 500,
  },
  {
    id: "library_legend",
    name: "Library Legend",
    description: "Read 50 books",
    icon: "🏛️",
    category: "reading",
    rarity: "legendary",
    requirement: { type: "books_read", value: 50 },
    xpReward: 1000,
  },
  {
    id: "century_reader",
    name: "Century Reader",
    description: "Read 100 books",
    icon: "💯",
    category: "reading",
    rarity: "legendary",
    requirement: { type: "books_read", value: 100 },
    xpReward: 2500,
    secret: true,
  },

  // === PAGE MILESTONES ===
  {
    id: "page_turner",
    name: "Page Turner",
    description: "Read 500 pages",
    icon: "📄",
    category: "reading",
    rarity: "common",
    requirement: { type: "pages_read", value: 500 },
    xpReward: 75,
  },
  {
    id: "marathon_reader",
    name: "Marathon Reader",
    description: "Read 1,000 pages",
    icon: "🏃",
    category: "reading",
    rarity: "rare",
    requirement: { type: "pages_read", value: 1000 },
    xpReward: 150,
  },
  {
    id: "page_master",
    name: "Page Master",
    description: "Read 5,000 pages",
    icon: "📚",
    category: "reading",
    rarity: "epic",
    requirement: { type: "pages_read", value: 5000 },
    xpReward: 400,
  },
  {
    id: "infinite_pages",
    name: "Infinite Pages",
    description: "Read 10,000 pages",
    icon: "♾️",
    category: "reading",
    rarity: "legendary",
    requirement: { type: "pages_read", value: 10000 },
    xpReward: 1000,
  },

  // === STREAK ACHIEVEMENTS ===
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 1-week reading streak",
    icon: "🔥",
    category: "streak",
    rarity: "common",
    requirement: { type: "streak_days", value: 1 },
    xpReward: 50,
  },
  {
    id: "fortnight_focus",
    name: "Fortnight Focus",
    description: "Maintain a 2-week reading streak",
    icon: "⚡",
    category: "streak",
    rarity: "rare",
    requirement: { type: "streak_days", value: 2 },
    xpReward: 100,
  },
  {
    id: "month_master",
    name: "Month Master",
    description: "Maintain a 4-week reading streak",
    icon: "🌟",
    category: "streak",
    rarity: "epic",
    requirement: { type: "streak_days", value: 4 },
    xpReward: 250,
  },
  {
    id: "quarter_champion",
    name: "Quarter Champion",
    description: "Maintain a 12-week reading streak",
    icon: "👑",
    category: "streak",
    rarity: "legendary",
    requirement: { type: "streak_days", value: 12 },
    xpReward: 750,
  },

  // === GENRE EXPLORER ===
  {
    id: "genre_curious",
    name: "Genre Curious",
    description: "Read books from 3 different genres",
    icon: "🎭",
    category: "genre",
    rarity: "common",
    requirement: { type: "genres_read", value: 3 },
    xpReward: 75,
  },
  {
    id: "genre_explorer",
    name: "Genre Explorer",
    description: "Read books from 5 different genres",
    icon: "🗺️",
    category: "genre",
    rarity: "rare",
    requirement: { type: "genres_read", value: 5 },
    xpReward: 150,
  },
  {
    id: "genre_master",
    name: "Genre Master",
    description: "Read books from 8 different genres",
    icon: "🎨",
    category: "genre",
    rarity: "epic",
    requirement: { type: "genres_read", value: 8 },
    xpReward: 350,
  },

  // === WRITING ACHIEVEMENTS ===
  {
    id: "first_poem",
    name: "Poet's Beginning",
    description: "Write your first poem",
    icon: "✨",
    category: "writing",
    rarity: "common",
    requirement: { type: "poems_written", value: 1 },
    xpReward: 50,
  },
  {
    id: "poetry_collection",
    name: "Poetry Collection",
    description: "Write 5 poems",
    icon: "📝",
    category: "writing",
    rarity: "rare",
    requirement: { type: "poems_written", value: 5 },
    xpReward: 150,
  },
  {
    id: "wordsmith",
    name: "Wordsmith",
    description: "Write 10 poems",
    icon: "🖋️",
    category: "writing",
    rarity: "epic",
    requirement: { type: "poems_written", value: 10 },
    xpReward: 300,
  },
  {
    id: "first_post",
    name: "First Blog Post",
    description: "Write your first blog post",
    icon: "📰",
    category: "writing",
    rarity: "common",
    requirement: { type: "posts_written", value: 1 },
    xpReward: 50,
  },
  {
    id: "blogger",
    name: "Blogger",
    description: "Write 5 blog posts",
    icon: "💻",
    category: "writing",
    rarity: "rare",
    requirement: { type: "posts_written", value: 5 },
    xpReward: 150,
  },

  // === RATING ACHIEVEMENTS ===
  {
    id: "critic",
    name: "Critic",
    description: "Rate 5 books",
    icon: "⭐",
    category: "reading",
    rarity: "common",
    requirement: { type: "rating_given", value: 5 },
    xpReward: 50,
  },
  {
    id: "super_critic",
    name: "Super Critic",
    description: "Rate 20 books",
    icon: "🌟",
    category: "reading",
    rarity: "rare",
    requirement: { type: "rating_given", value: 20 },
    xpReward: 150,
  },

  // === CHALLENGE ACHIEVEMENTS ===
  {
    id: "challenge_accepted",
    name: "Challenge Accepted",
    description: "Complete your first reading challenge",
    icon: "🎯",
    category: "special",
    rarity: "rare",
    requirement: { type: "challenge_complete", value: 1 },
    xpReward: 200,
  },
  {
    id: "challenge_champion",
    name: "Challenge Champion",
    description: "Complete 5 reading challenges",
    icon: "🏆",
    category: "special",
    rarity: "legendary",
    requirement: { type: "challenge_complete", value: 5 },
    xpReward: 500,
  },
];

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

// Get achievements by category
export function getAchievementsByCategory(
  category: AchievementCategory,
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

// Get visible achievements (non-secret or unlocked)
export function getVisibleAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.secret || unlockedIds.includes(a.id));
}

// Check if achievement is unlocked based on stats
export interface UserStats {
  booksRead: number;
  pagesRead: number;
  streakWeeks: number;
  genresRead: number;
  poemsWritten: number;
  postsWritten: number;
  ratingsGiven: number;
  challengesCompleted: number;
}

export function checkAchievementProgress(
  achievement: Achievement,
  stats: UserStats,
): { unlocked: boolean; progress: number } {
  let current = 0;
  const target = achievement.requirement.value;

  switch (achievement.requirement.type) {
    case "books_read":
      current = stats.booksRead;
      break;
    case "pages_read":
      current = stats.pagesRead;
      break;
    case "streak_days":
      current = stats.streakWeeks;
      break;
    case "genres_read":
      current = stats.genresRead;
      break;
    case "poems_written":
      current = stats.poemsWritten;
      break;
    case "posts_written":
      current = stats.postsWritten;
      break;
    case "rating_given":
      current = stats.ratingsGiven;
      break;
    case "challenge_complete":
      current = stats.challengesCompleted;
      break;
  }

  return {
    unlocked: current >= target,
    progress: Math.min((current / target) * 100, 100),
  };
}

// Get newly unlocked achievements
export function getNewlyUnlockedAchievements(
  previouslyUnlocked: string[],
  stats: UserStats,
): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => {
    if (previouslyUnlocked.includes(achievement.id)) return false;
    const { unlocked } = checkAchievementProgress(achievement, stats);
    return unlocked;
  });
}

// Calculate total XP from achievements
export function calculateAchievementXP(unlockedIds: string[]): number {
  return unlockedIds.reduce((total, id) => {
    const achievement = getAchievement(id);
    return total + (achievement?.xpReward || 0);
  }, 0);
}
