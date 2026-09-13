import { auth } from "./auth";
import { api } from "./_generated/api";
import type { QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Require an authenticated user. Throws if the caller is not signed in.
 * Use in queries and mutations.
 */
export async function requireUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

/**
 * Require an authenticated admin (parent) user.
 * Matches the admin check in users.isCurrentUserAdmin.
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  const userId = await requireUser(ctx);

  const user = await ctx.db.get(userId);
  const email = (user?.email ?? "").toLowerCase();
  if (email.includes("admin") || email.includes("parent")) return userId;

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  if (!profile?.isParent) throw new Error("Admin access required");
  return userId;
}

/**
 * Require an authenticated admin inside an action (no direct db access).
 */
export async function requireAdminAction(ctx: ActionCtx): Promise<void> {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const isAdmin = await ctx.runQuery(api.users.isCurrentUserAdmin, {});
  if (!isAdmin) throw new Error("Admin access required");
}
