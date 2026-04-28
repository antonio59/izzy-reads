/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

type MotionPreferenceContextType = {
  prefersReducedMotion: boolean;
};

const MotionPreferenceContext = createContext<MotionPreferenceContextType>({
  prefersReducedMotion: false,
});

export const useMotionPreference = () => useContext(MotionPreferenceContext);

interface MotionPreferenceProviderProps {
  children: ReactNode;
}

export const MotionPreferenceProvider: React.FC<
  MotionPreferenceProviderProps
> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({ prefersReducedMotion }),
    [prefersReducedMotion],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
};

export const ReducedMotionAnimatePresence: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { prefersReducedMotion } = useMotionPreference();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return <AnimatePresence>{children}</AnimatePresence>;
};
