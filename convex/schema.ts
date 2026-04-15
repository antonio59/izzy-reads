import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth tables (users, sessions, accounts, etc.)
  ...authTables,

  // Custom user profile data (extends the auth user)
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    age: v.optional(v.number()),
    isParent: v.boolean(),
    parentId: v.optional(v.id("users")),
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("colorful")),
    ),
    readingGoal: v.optional(v.number()), // Legacy - yearly goal
    yearlyBookGoal: v.optional(v.number()), // Books per year goal
    monthlyBookGoal: v.optional(v.number()), // Books per month goal
    notifications: v.optional(v.boolean()),
    requireApproval: v.optional(v.boolean()),
    contentFilter: v.optional(v.boolean()),
    timeLimit: v.optional(v.number()),
    allowedGenres: v.optional(v.array(v.string())),
    // Avatar customization
    avatar: v.optional(
      v.object({
        skinTone: v.string(),
        hairStyle: v.string(),
        hairColor: v.string(),
        eyeColor: v.string(),
        accessory: v.optional(v.string()),
        background: v.string(),
        outfit: v.string(),
        outfitColor: v.string(),
        expression: v.optional(v.string()),
      }),
    ),
    hasSeenOnboarding: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  books: defineTable({
    userId: v.id("users"),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.string(),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.string(),
    dateAdded: v.string(),
    dateRead: v.optional(v.string()), // Format: "YYYY-MM" for month/year
    rating: v.optional(v.number()),
    isRead: v.boolean(),
    notes: v.optional(v.string()),
    giftFrom: v.optional(v.string()), // Who gave this book as a gift
  })
    .index("by_user", ["userId"])
    .index("by_user_isRead", ["userId", "isRead"])
    .index("by_user_genre", ["userId", "genre"])
    .index("by_user_rating", ["userId", "rating"]),

  wishlist: defineTable({
    userId: v.id("users"),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    isbn: v.optional(v.string()),
    genre: v.string(),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    ageRating: v.string(),
    dateAdded: v.string(),
    boughtBy: v.optional(v.string()),
    boughtAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  poems: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    emoji: v.optional(v.string()),
    dateCreated: v.string(),
    likes: v.number(),
    template: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  blogPosts: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    bookId: v.optional(v.id("books")),
    dateCreated: v.string(),
    dateModified: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    // Keep parentApproved for backward compatibility but it's no longer used
    parentApproved: v.optional(v.boolean()),
    tags: v.array(v.string()),
    emoji: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  readingChallenges: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    target: v.number(),
    current: v.number(),
    type: v.union(v.literal("books"), v.literal("pages"), v.literal("genres")),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    completed: v.boolean(),
    badge: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Book discovery swipe decisions (Tinder-style recommendations)
  bookSwipes: defineTable({
    userId: v.id("users"),
    googleBookId: v.string(),
    title: v.string(),
    author: v.string(),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    description: v.optional(v.string()),
    action: v.union(v.literal("liked"), v.literal("passed")),
    addedToWishlist: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_action", ["userId", "action"])
    .index("by_user_googleBookId", ["userId", "googleBookId"]),

  // Book suggestions from visitors
  bookSuggestions: defineTable({
    title: v.string(),
    author: v.string(),
    suggestedBy: v.string(), // Name of the person suggesting
    reason: v.optional(v.string()), // Why they think Izzy would like it
    genre: v.optional(v.string()),
    dateSubmitted: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("declined"),
    ),
  }).index("by_status", ["status"]),

  // Reactions from visitors on books/reviews (public, no auth required)
  bookReactions: defineTable({
    bookId: v.id("books"),
    visitorId: v.string(), // Anonymous visitor ID (from localStorage)
    reactionType: v.union(
      // Book reactions
      v.literal("love"),
      v.literal("amazing"),
      v.literal("mustRead"),
      v.literal("soGood"),
      v.literal("notForMe"),
      // Review reactions
      v.literal("helpful"),
      v.literal("greatReview"),
      v.literal("agree"),
      v.literal("funny"),
      v.literal("insightful"),
    ),
    isReviewReaction: v.boolean(), // true = reaction to review, false = reaction to book
    createdAt: v.string(),
  })
    .index("by_book", ["bookId"])
    .index("by_visitor", ["visitorId"])
    .index("by_book_visitor", ["bookId", "visitorId"]),

  // Book series for tracking series progress
  bookSeries: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    bookIds: v.array(v.id("books")), // Ordered list of books in the series
    completed: v.boolean(),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  // Persistent audit log for cover migrations
  migrationLogs: defineTable({
    entityType: v.union(v.literal("book"), v.literal("wishlist")),
    entityId: v.string(),
    title: v.string(),
    success: v.boolean(),
    oldUrl: v.string(),
    newUrl: v.optional(v.string()),
    error: v.optional(v.string()),
    migratedAt: v.string(),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_success", ["success"]),

  // About/Profile page content
  aboutProfile: defineTable({
    userId: v.id("users"),
    isPublished: v.boolean(),
    bio: v.string(),
    favoriteGenres: v.array(v.string()),
    favoriteAuthors: v.array(v.string()),
    whyIRead: v.string(),
    funFacts: v.array(v.string()),
    currentlyReading: v.optional(v.string()),
    readingGoals: v.array(v.string()),
    achievements: v.array(v.string()),
    // Hero section customization
    heroTagline: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    updatedAt: v.string(),
  }).index("by_user", ["userId"]),
});
