/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { ReactNode, ComponentProps } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Motion wrapper components that respect reduced motion
export const FadeIn: React.FC<
  ComponentProps<"div"> & { delay?: number; duration?: number }
> = ({ children, className = "", delay = 0, duration = 0.4, ...props }) => {
  const { prefersReducedMotion } = useMotionPreference();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn: React.FC<
  ComponentProps<"div"> & { direction?: "left" | "right" | "up" | "down" }
> = ({ children, className = "", direction = "up", ...props }) => {
  const { prefersReducedMotion } = useMotionPreference();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const offsets = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3 }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn: React.FC<ComponentProps<"div">> = ({
  children,
  className = "",
  ...props
}) => {
  const { prefersReducedMotion } = useMotionPreference();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.div>
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
