import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Heart,
  PenTool,
  Home,
  Settings,
  Shield,
  Feather,
  LogOut,
  Sparkles,
  Star,
  Trophy,
  Target,
  Library,
  Download,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";

interface NavigationProps {
  isParentMode: boolean;
  setIsParentMode: (mode: boolean) => void;
}

const mainNavItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/bookshelf", icon: BookOpen, label: "My Books" },
  { path: "/poems", icon: Feather, label: "Poems" },
  { path: "/blog", icon: PenTool, label: "Blog" },
];

const moreNavItems = [
  { path: "/wishlist", icon: Heart, label: "Wishlist" },
  { path: "/reviews", icon: Star, label: "Reviews" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/series", icon: Library, label: "Series" },
  { path: "/export", icon: Download, label: "Export" },
];

// Combined for mobile - show most important
const mobileNavItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/bookshelf", icon: BookOpen, label: "Books" },
  { path: "/achievements", icon: Trophy, label: "Awards" },
  { path: "/poems", icon: Feather, label: "Poems" },
];

const Navigation: React.FC<NavigationProps> = ({
  isParentMode,
  setIsParentMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { level } = useGamification();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isMoreActive = moreNavItems.some(
    (item) => location.pathname === item.path,
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 group"
              aria-label="Izzy's Bookshelf Dashboard"
            >
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary-500" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900">
                Izzy's Bookshelf
              </span>
              {/* Level indicator */}
              <div className="hidden lg:flex items-center gap-1 ml-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <span className="text-sm">{level.icon}</span>
                <span className="text-xs font-medium text-purple-700">
                  Lvl {level.level}
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 bg-white shadow-soft rounded-lg"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-2 ${
                        isActive
                          ? "text-primary-600"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    isMoreActive
                      ? "text-primary-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {isMoreActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-white shadow-soft rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    More
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${showMoreMenu ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>

                <AnimatePresence>
                  {showMoreMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                      onMouseLeave={() => setShowMoreMenu(false)}
                    >
                      {moreNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              isActive
                                ? "bg-primary-50 text-primary-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              {/* Parent Mode Toggle */}
              <motion.button
                onClick={() => setIsParentMode(!isParentMode)}
                className={`p-2.5 rounded-lg transition-colors relative ${
                  isParentMode
                    ? "bg-accent-100 text-accent-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={
                  isParentMode ? "Parent Mode Active" : "Switch to Parent Mode"
                }
                aria-label={
                  isParentMode ? "Disable Parent Mode" : "Enable Parent Mode"
                }
              >
                <Shield className="h-5 w-5" />
                {isParentMode && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-500 rounded-full"
                  />
                )}
              </motion.button>

              {/* Parent Dashboard Link */}
              <AnimatePresence>
                {isParentMode && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/parent"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-500 text-white text-sm font-medium hover:bg-accent-600 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Parent</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center py-1 px-3"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute -top-2 w-12 h-1 bg-primary-500 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`h-5 w-5 ${isActive ? "text-primary-500" : "text-gray-400"}`}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-primary-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More menu on mobile */}
          <button
            onClick={() => setShowMobileMore(!showMobileMore)}
            className="relative flex flex-col items-center py-1 px-3 text-gray-400"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>

        {/* Mobile More Menu */}
        <AnimatePresence>
          {showMobileMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="grid grid-cols-3 gap-2 p-4">
                {[
                  ...moreNavItems,
                  { path: "/parent", icon: Shield, label: "Parent" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMore(false)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <item.icon className="h-6 w-6 text-gray-600" />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navigation;
