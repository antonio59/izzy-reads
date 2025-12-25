import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Types for reactions
export type BookReactionType =
  | "love"
  | "amazing"
  | "mustRead"
  | "soGood"
  | "notForMe";
export type ReviewReactionType =
  | "helpful"
  | "greatReview"
  | "agree"
  | "funny"
  | "insightful";

export interface ReactionCounts {
  love: number;
  amazing: number;
  mustRead: number;
  soGood: number;
  notForMe: number;
}

export interface ReviewReactionCounts {
  helpful: number;
  greatReview: number;
  agree: number;
  funny: number;
  insightful: number;
}

// Get or create a persistent visitor ID
function getVisitorId(): string {
  const STORAGE_KEY = "izzy_visitor_id";
  let visitorId = localStorage.getItem(STORAGE_KEY);

  if (!visitorId) {
    // Generate a unique ID
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(STORAGE_KEY, visitorId);
  }

  return visitorId;
}

// Hook for book reactions
export function useBookReactions(bookId: string | undefined) {
  const [visitorId] = useState(() => getVisitorId());

  // Query reaction counts
  const reactionCounts = useQuery(
    api.reactions.getBookReactions,
    bookId ? { bookId: bookId as Id<"books"> } : "skip",
  );

  // Query visitor's current reaction
  const visitorReaction = useQuery(
    api.reactions.getVisitorReaction,
    bookId
      ? {
          bookId: bookId as Id<"books">,
          visitorId,
          isReviewReaction: false,
        }
      : "skip",
  );

  // Mutation to add/toggle reaction
  const addReactionMutation = useMutation(api.reactions.addReaction);

  const addReaction = useCallback(
    async (reactionType: BookReactionType) => {
      if (!bookId) return;

      try {
        await addReactionMutation({
          bookId: bookId as Id<"books">,
          visitorId,
          reactionType,
          isReviewReaction: false,
        });
      } catch (error) {
        console.error("Failed to add reaction:", error);
      }
    },
    [bookId, visitorId, addReactionMutation],
  );

  const totalReactions =
    reactionCounts !== undefined
      ? Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
      : 0;

  return {
    counts: reactionCounts ?? {
      love: 0,
      amazing: 0,
      mustRead: 0,
      soGood: 0,
      notForMe: 0,
    },
    visitorReaction: visitorReaction ?? null,
    totalReactions,
    addReaction,
    isLoading: reactionCounts === undefined,
  };
}

// Hook for review reactions
export function useReviewReactions(bookId: string | undefined) {
  const [visitorId] = useState(() => getVisitorId());

  // Query reaction counts
  const reactionCounts = useQuery(
    api.reactions.getReviewReactions,
    bookId ? { bookId: bookId as Id<"books"> } : "skip",
  );

  // Query visitor's current reaction
  const visitorReaction = useQuery(
    api.reactions.getVisitorReaction,
    bookId
      ? {
          bookId: bookId as Id<"books">,
          visitorId,
          isReviewReaction: true,
        }
      : "skip",
  );

  // Mutation to add/toggle reaction
  const addReactionMutation = useMutation(api.reactions.addReaction);

  const addReaction = useCallback(
    async (reactionType: ReviewReactionType) => {
      if (!bookId) return;

      try {
        await addReactionMutation({
          bookId: bookId as Id<"books">,
          visitorId,
          reactionType,
          isReviewReaction: true,
        });
      } catch (error) {
        console.error("Failed to add review reaction:", error);
      }
    },
    [bookId, visitorId, addReactionMutation],
  );

  const totalReactions =
    reactionCounts !== undefined
      ? Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)
      : 0;

  return {
    counts: reactionCounts ?? {
      helpful: 0,
      greatReview: 0,
      agree: 0,
      funny: 0,
      insightful: 0,
    },
    visitorReaction: visitorReaction ?? null,
    totalReactions,
    addReaction,
    isLoading: reactionCounts === undefined,
  };
}
