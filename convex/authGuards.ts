declare const process: { env: Record<string, string | undefined> };
import { auth } from "./auth";
import { api } from "./_generated/api";
import type { QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Explicit admin allowlist from the Convex deployment environment.
 * Set ADMIN_EMAILS to a comma-separated list of exact email addresses.
 * These are matched exactly (case-insensitive) – never by substring.
 */
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

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
 * Non-throwing admin check. An admin is either:
 *  - a user whose email is listed exactly in the ADMIN_EMAILS env var, or
 *  - a user whose userProfiles row has isParent === true (set via the
 *    Convex dashboard or an admin-only mutation – never by the client).
 */
export async function isAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
): Promise<boolean> {
  const user = await ctx.db.get(userId);
  const email = (user?.email ?? "").toLowerCase();
  if (email && ADMIN_EMAILS.has(email)) return true;

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  return Boolean(profile?.isParent);
}

/**
 * Require an authenticated admin (parent) user.
 * Matches the admin check in users.isCurrentUserAdmin.
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<Id<"users">> {
  const userId = await requireUser(ctx);
  if (!(await isAdmin(ctx, userId))) {
    throw new Error("Admin access required");
  }
  return userId;
}

/**
 * Require an authenticated admin inside an action (no direct db access).
 */
export async function requireAdminAction(ctx: ActionCtx): Promise<void> {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const isAdminUser = await ctx.runQuery(api.users.isCurrentUserAdmin, {});
  if (!isAdminUser) throw new Error("Admin access required");
}

/** Require any authenticated user inside an action. */
export async function requireUserAction(ctx: ActionCtx): Promise<void> {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
}
