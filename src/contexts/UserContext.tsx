import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, UserSettings, AvatarConfig } from "../types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isParentMode: boolean;
  setIsParentMode: (mode: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateUserProfile: (profile: {
    avatar?: AvatarConfig;
    name?: string;
  }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load saved avatar at initialization to avoid setState in effect
    let savedAvatar: AvatarConfig | undefined;
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.avatar) {
          savedAvatar = parsed.avatar;
        }
      } catch {
        // Ignore parse errors
      }
    }

    return {
      id: "1",
      name: "Isabella",
      age: 10,
      isParent: false,
      avatar: savedAvatar,
      settings: {
        theme: "colorful",
        readingGoal: 20,
        notifications: true,
        parentalControls: {
          requireApproval: true,
          contentFilter: true,
          allowedGenres: [
            "Fiction",
            "Fantasy",
            "Adventure",
            "Mystery",
            "Science Fiction",
          ],
        },
      },
    };
  });
  const [isParentMode, setIsParentMode] = useState(false);

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    if (user) {
      setUser({
        ...user,
        settings: {
          ...user.settings,
          ...newSettings,
        },
      });
    }
  };

  const updateUserProfile = async (profile: {
    avatar?: AvatarConfig;
    name?: string;
  }) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...profile,
      };
      setUser(updatedUser);
      // In a real app, this would save to the database
      // For now, save to localStorage for persistence
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    setUser,
    isParentMode,
    setIsParentMode,
    updateUserSettings,
    updateUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
