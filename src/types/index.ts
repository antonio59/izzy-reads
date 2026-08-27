export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
  genre: string;
  pageCount?: number;
  description?: string;
  ageRating: string;
  dateAdded: string;
  dateRead?: string; // "YYYY-MM" or "YYYY-MM-DD"
  rating?: number;
  isRead: boolean;
  notes?: string;
  review?: string;
  giftFrom?: string; // Who gave this book as a gift
  boughtBy?: string; // Visitor who bought this wishlist item
  boughtAt?: number; // When it was marked as bought
  tags?: string[]; // mood / custom tags
  reactions?: BookReactions;
  reviewReactions?: ReviewReactions;
}

// Reactions about the BOOK itself (used on book cards/modals)
export interface BookReactions {
  love: number; // ❤️ Love it!
  amazing: number; // 🤩 Amazing!
  mustRead: number; // 📚 Must read!
  soGood: number; // 🔥 So good!
  notForMe: number; // 😕 Not for me
}

// Reactions about Izzy's REVIEW (used on review pages)
export interface ReviewReactions {
  helpful: number; // 👍 Helpful
  greatReview: number; // ⭐ Great review!
  agree: number; // 🤝 I agree
  funny: number; // 😂 Funny
  insightful: number; // 💡 Insightful
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  content: string;
  bookId?: string;
  dateCreated: string;
  dateModified: string;
  status: "draft" | "published";
  tags: string[];
  emoji?: string;
}

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  accessory?: string;
  background: string;
  outfit: string;
  outfitColor: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  isParent: boolean;
  parentId?: string;
  settings: UserSettings;
  avatar?: AvatarConfig;
}

export interface UserSettings {
  theme: "light" | "dark" | "colorful";
  readingGoal: number;
  notifications: boolean;
  parentalControls: ParentalControls;
}

export interface ParentalControls {
  requireApproval: boolean;
  contentFilter: boolean;
  timeLimit?: number;
  allowedGenres: string[];
}

export interface ReadingStats {
  totalBooks: number;
  totalPages: number;
  favoriteGenre: string;
  readingStreak: number;
  averageRating: number;
  booksThisMonth: number;
  booksThisYear: number;
}

export interface Poem {
  id: string;
  title: string;
  slug?: string;
  content: string;
  emoji?: string;
  dateCreated: string;
  likes: number;
  template?: string;
  imageUrl?: string;
  isPublished?: boolean;
  style?: {
    background?: string;
    font?: string;
    color?: string;
  };
}

export interface BookSeries {
  id: string;
  name: string;
  books: SeriesBook[];
  completed: boolean;
}

export interface SeriesBook {
  bookId: string;
  orderInSeries: number;
  isRead: boolean;
}
