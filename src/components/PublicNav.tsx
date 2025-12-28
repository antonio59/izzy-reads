import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Book,
  PenTool,
  Gift,
  User,
  Star,
  LayoutDashboard,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Custom book logo SVG component
export function BookLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Open book with pages */}
      <path
        d="M12 6.5C12 6.5 10 4 6 4C3.5 4 2 5 2 5V19C2 19 3.5 18 6 18C10 18 12 20 12 20C12 20 14 18 18 18C20.5 18 22 19 22 19V5C22 5 20.5 4 18 4C14 4 12 6.5 12 6.5Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center spine */}
      <path
        d="M12 6.5V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Page lines left */}
      <path
        d="M5 8H8M5 11H9M5 14H8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Page lines right */}
      <path
        d="M16 8H19M15 11H19M16 14H19"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Small heart/bookmark accent */}
      <path
        d="M12 3L13.5 5L12 6.5L10.5 5L12 3Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  show?: boolean;
}

export function PublicNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "home", label: "My Books", icon: Book, path: "/", show: true },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      path: "/reviews",
      show: true,
    },
    { id: "poems", label: "Poems", icon: PenTool, path: "/poetry", show: true },
    { id: "blog", label: "Writing", icon: FileText, path: "/blog", show: true },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Gift,
      path: "/my-wishlist",
      show: true,
    },
    { id: "about", label: "About", icon: User, path: "/about", show: true },
  ];

  const visibleItems = navItems.filter((item) => item.show);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-300 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookLogo className="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-stone-700">
              Izzy's Bookshelf
            </span>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/" && location.pathname === "/");

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-stone-500 hover:bg-cream-200 hover:text-stone-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Dashboard link for logged-in users */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="ml-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-cream-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-cream-200 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/" && location.pathname === "/");

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 transition-all ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-stone-600 hover:bg-cream-200 hover:text-stone-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Dashboard link for logged-in users */}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 bg-primary-500 text-white hover:bg-primary-600 transition-all"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default PublicNav;
