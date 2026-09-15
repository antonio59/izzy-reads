declare const process: { env: Record<string, string | undefined> };
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { DataModel } from "./_generated/dataModel";

// Only these emails can sign up / sign in — stored as Convex env var
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

const CustomPassword = Password<DataModel>({
  profile(params) {
    const email = (params.email as string).toLowerCase().trim();
    if (ALLOWED_EMAILS.length === 0) {
      // Fail closed: when the invite list is not configured, allow existing
      // accounts to sign in but block all new registrations.
      if (params.flow === "signUp") {
        throw new Error(
          JSON.stringify({
            error: "Access denied. This site is invite-only.",
            code: "EMAIL_NOT_ALLOWED",
          }),
        );
      }
    } else if (!ALLOWED_EMAILS.includes(email)) {
      throw new Error(
        JSON.stringify({
          error: "Access denied. This site is invite-only.",
          code: "EMAIL_NOT_ALLOWED",
        }),
      );
    }
    return {
      email,
      name: (params.name as string) || email.split("@")[0],
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword],
});
