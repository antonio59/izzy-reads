import React, { createContext, useContext, useEffect, useState } from "react";
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [convexUserId, setConvexUserId] = useState<Id<"users"> | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Query to get current user profile
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  const createUserProfile = useMutation(api.users.createProfile);

  useEffect(() => {
    // Mark initial check as done once we have a definitive auth state
    if (!isLoading) {
      setInitialCheckDone(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (currentUser) {
      setUser({
        id: currentUser._id,
        email: currentUser.email || "",
        name: currentUser.name,
      });
      setConvexUserId(currentUser._id);
    } else if (!isAuthenticated && !isLoading) {
      setUser(null);
      setConvexUserId(null);
    }
  }, [currentUser, isAuthenticated, isLoading]);

  // Create profile for new users after signup
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      if (isAuthenticated && user && !currentUser && !isLoading) {
        // New user just signed up, create their profile
        try {
          await createUserProfile({
            name: user.name || user.email.split("@")[0],
            isParent: false,
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
          console.log("Profile creation handled or will retry");
        }
      }
    };

    createProfileIfNeeded();
  }, [isAuthenticated, user, currentUser, isLoading, createUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signIn");

      await convexSignIn("password", formData);
    } catch (error: unknown) {
      console.error("Sign in error:", error);

      // Provide user-friendly error messages
      const errMessage = error instanceof Error ? error.message : "";
      const errData = (error as { data?: { code?: string } })?.data;

      if (
        errMessage.includes("InvalidAccountId") ||
        errMessage.includes("invalid") ||
        errData?.code === "InvalidAccountId"
      ) {
        throw new Error(
          "No account found with this email. Please sign up first.",
        );
      }
      if (
        errMessage.includes("InvalidSecret") ||
        errMessage.includes("password")
      ) {
        throw new Error("Incorrect password. Please try again.");
      }

      throw new Error("Unable to sign in. Please check your credentials.");
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
        );
      }
      if (errMessage.includes("weak") || errMessage.includes("password")) {
        throw new Error(
          "Password is too weak. Please use at least 8 characters with a mix of letters and numbers.",
        );
      }

      throw new Error("Unable to create account. Please try again.");
    }
  };

  const signOut = async () => {
    try {
      await convexSignOut();
      setUser(null);
      setConvexUserId(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Consider loading if:
  // 1. Initial auth check hasn't completed
  // 2. Convex auth is still loading
  // 3. We're authenticated but user data hasn't loaded yet
  const loading =
    !initialCheckDone ||
    isLoading ||
    (isAuthenticated && currentUser === undefined);

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
