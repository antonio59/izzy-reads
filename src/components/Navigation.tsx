import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PenTool,
  Home,
  Settings,
  Shield,
  LogOut,
  Sparkles,
  Trophy,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";

interface NavigationProps {
  isParentMode: boolean;
  setIsParentMode: (mode: boolean) => void;
}

// Simplified to 4 core navigation items
const mainNavItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/books", icon: BookOpen, label: "My Books" },
  { path: "/create", icon: PenTool, label: "Create" },
  { path: "/progress", icon: Trophy, label: "Progress" },
];

const Navigation: React.FC<NavigationProps> = ({
  isParentMode,
  setIsParentMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { level } = useGamification();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Check if current path matches nav item (including sub-paths)
  const isActivePath = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

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

            {/* Main Navigation - Simplified to 4 items */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1">
              {mainNavItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
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
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              {/* View Public Site */}
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors text-sm font-medium"
                title="View your public portfolio"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden lg:inline">My Portfolio</span>
              </Link>

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

      {/* Mobile Bottom Navigation - Simplified */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mainNavItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center py-1 px-3 min-w-[60px]"
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

          {/* Menu button for settings/logout */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="relative flex flex-col items-center py-1 px-3 text-gray-400"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Menu</h3>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-primary-500" />
                    <span className="font-medium text-gray-700">
                      My Public Portfolio
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsParentMode(!isParentMode);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors w-full"
                  >
                    <Shield
                      className={`h-5 w-5 ${isParentMode ? "text-accent-500" : "text-gray-400"}`}
                    />
                    <span className="font-medium text-gray-700">
                      {isParentMode ? "Exit Parent Mode" : "Parent Mode"}
                    </span>
                  </button>

                  {isParentMode && (
                    <Link
                      to="/parent"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-accent-50 transition-colors"
                    >
                      <Settings className="h-5 w-5 text-accent-600" />
                      <span className="font-medium text-accent-700">
                        Parent Dashboard
                      </span>
                    </Link>
                  )}

                  <hr className="my-4 border-gray-100" />

                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors w-full text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Log Out</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navigation;
