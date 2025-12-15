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
    readingGoal: v.optional(v.number()),
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
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("published"),
    ),
    parentApproved: v.boolean(),
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
});
