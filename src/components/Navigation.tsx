import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PenTool,
  Home,
  LogOut,
  Sparkles,
  Trophy,
  Compass,
  Globe,
  Menu,
  X,
  Library,
  User,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { LevelModal } from "./LevelModal";

// Simplified to 4 core navigation items
const mainNavItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/books", icon: BookOpen, label: "My Bookshelf" },
  { path: "/discover", icon: Compass, label: "Discover" },
  { path: "/create", icon: PenTool, label: "Create" },
  { path: "/progress", icon: Trophy, label: "Progress" },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { level, totalXP } = useGamification();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

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
      <nav className="hidden md:block sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-100">
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
              <span className="text-xl font-display font-bold text-stone-900">
                Izzy's Bookshelf
              </span>
            </Link>
            {/* Level indicator - clickable */}
            <motion.button
              onClick={() => setShowLevelModal(true)}
              className="hidden lg:flex items-center gap-1 ml-2 px-2.5 py-1.5 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View your reading level"
            >
              <span className="text-sm">{level.icon}</span>
              <span className="text-xs font-medium text-primary-700">
                Lvl {level.level}
              </span>
            </motion.button>

            {/* Main Navigation - Simplified to 4 items */}
            <div className="flex items-center bg-stone-50 rounded-xl p-1">
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
                          : "text-stone-500 hover:text-stone-900"
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-500 hover:text-primary-600 hover:bg-primary-50 transition-colors text-sm font-medium"
                title="View your public bookshelf"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden lg:inline">My Bookshelf</span>
              </Link>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-100 safe-area-inset-bottom">
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
                  className={`h-5 w-5 ${isActive ? "text-primary-500" : "text-stone-400"}`}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-primary-600 font-medium" : "text-stone-500"
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
            className="relative flex flex-col items-center py-1 px-3 text-stone-400"
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
                  <h3 className="text-lg font-bold text-stone-900">Menu</h3>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-full hover:bg-stone-100"
                  >
                    <X className="h-5 w-5 text-stone-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-primary-500" />
                    <span className="font-medium text-stone-700">
                      My Public Bookshelf
                    </span>
                  </Link>

                  <Link
                    to="/series"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <Library className="h-5 w-5 text-accent-500" />
                    <span className="font-medium text-stone-700">
                      Series Tracker
                    </span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <User className="h-5 w-5 text-sage-500" />
                    <span className="font-medium text-stone-700">
                      Edit Profile
                    </span>
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <Shield className="h-5 w-5 text-stone-500" />
                    <span className="font-medium text-stone-700">
                      Admin
                    </span>
                  </Link>

                  <hr className="my-4 border-stone-100" />

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

      {/* Level Progress Modal */}
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        totalXP={totalXP}
      />
    </>
  );
};

export default Navigation;
