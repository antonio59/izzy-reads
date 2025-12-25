import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "icon",
  className = "",
}) => {
  const { theme, setTheme, toggleDark } = useTheme();

  if (variant === "icon") {
    return (
      <motion.button
        onClick={toggleDark}
        className={`p-2.5 rounded-lg transition-colors ${
          theme === "dark"
            ? "bg-stone-800 text-yellow-400"
            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
        } ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={
          theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
        }
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <div
      className={`flex gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl ${className}`}
    >
      <ThemeButton
        active={theme === "light"}
        onClick={() => setTheme("light")}
        icon={<Sun className="h-4 w-4" />}
        label="Light"
      />
      <ThemeButton
        active={theme === "dark"}
        onClick={() => setTheme("dark")}
        icon={<Moon className="h-4 w-4" />}
        label="Dark"
      />
      <ThemeButton
        active={theme === "colorful"}
        onClick={() => setTheme("colorful")}
        icon={<Palette className="h-4 w-4" />}
        label="Colorful"
      />
    </div>
  );
};

function ThemeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "text-white"
          : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
      }`}
    >
      {active && (
        <motion.div
          layoutId="themeIndicator"
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}

export default ThemeToggle;
