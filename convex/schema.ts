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
      }),
    ),
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
    dateRead: v.optional(v.string()),
    rating: v.optional(v.number()),
    isRead: v.boolean(),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),

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
});
