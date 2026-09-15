import React, { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  convexUserId: Id<"users"> | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();

  // Query to get current user profile
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  const createUserProfile = useMutation(api.users.createProfile);

  // The caller's userProfiles row – null once loaded if none exists yet.
  const myProfile = useQuery(
    api.users.getMyProfile,
    isAuthenticated ? {} : "skip",
  );

  // Derive auth user directly from Convex query to avoid setState in effect
  const user: AuthUser | null = useMemo(() => {
    if (currentUser) {
      return {
        id: currentUser._id,
        email: currentUser.email || "",
        name: currentUser.name,
      };
    }
    if (!isAuthenticated && !isLoading) {
      return null;
    }
    return null;
  }, [currentUser, isAuthenticated, isLoading]);

  const convexUserId: Id<"users"> | null = useMemo(() => {
    if (currentUser) return currentUser._id;
    if (!isAuthenticated && !isLoading) return null;
    return null;
  }, [currentUser, isAuthenticated, isLoading]);

  // Create profile for new users after signup – fires when the profile
  // query resolves to null (loaded, no row). Idempotent server-side.
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (isAuthenticated && myProfile === null && user) {
        try {
          await createUserProfile({
            name: user.name || user.email.split("@")[0],
            theme: "colorful",
            readingGoal: 20,
            notifications: true,
            requireApproval: true,
            contentFilter: true,
            allowedGenres: [
              "Fiction",
              "Fantasy",
              "Adventure",
              "Mystery",
              "Science Fiction",
            ],
          });
        } catch {
          // Profile may already exist or will be created on next action
        }
      }
    };

    createProfileIfNeeded();
  }, [isAuthenticated, myProfile, user, createUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signIn");

      await convexSignIn("password", formData);
    } catch (error: unknown) {
      console.error("Sign in error:", error);

      // One generic message – distinct errors for unknown-email vs
      // wrong-password let callers probe which addresses have accounts.
      throw new Error("Invalid email or password. Please try again.", {
        cause: error,
      });
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signUp");
      if (name) {
        formData.append("name", name);
      }

      await convexSignIn("password", formData);

      // Profile will be created by useEffect when currentUser becomes available
      // This is more reliable than setTimeout which could race
    } catch (error: unknown) {
      console.error("Sign up error:", error);

      // Provide user-friendly error messages
      const errMessage = error instanceof Error ? error.message : "";

      if (
        errMessage.includes("AccountAlreadyExists") ||
        errMessage.includes("already exists")
      ) {
        throw new Error(
          "An account with this email already exists. Please sign in instead.",
          { cause: error },
        );
      }
      if (errMessage.includes("weak") || errMessage.includes("password")) {
        throw new Error(
          "Password is too weak. Please use at least 8 characters with a mix of letters and numbers.",
          { cause: error },
        );
      }

      throw new Error("Unable to create account. Please try again.", { cause: error });
    }
  };

  const signOut = async () => {
    try {
      await convexSignOut();
      // user and convexUserId are derived from currentUser/isAuthenticated,
      // so they will automatically become null once auth state updates.
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Consider loading if auth is still resolving or user data hasn't loaded yet
  const loading = isLoading || (isAuthenticated && currentUser === undefined);

  const value = {
    user,
    convexUserId,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
