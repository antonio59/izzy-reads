import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Database, 
  Users, 
  BookOpen, 
  ChevronRight,
  LayoutDashboard,
  ImageIcon,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { CoverMigrationPanel } from "../components/CoverMigrationPanel";
import { useAuth } from "../contexts/AuthContext";

type AdminTab = "overview" | "covers" | "users" | "books";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const { user } = useAuth();

  // Simple admin check - in production you'd check for admin role
  const isAdmin = user?.email?.includes("admin") || user?.email?.includes("parent");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Admin Access Required</h1>
          <p className="text-stone-500 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Shield }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "covers", label: "Cover Migration", icon: ImageIcon },
    { id: "users", label: "Users", icon: Users },
    { id: "books", label: "Books", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream-100 to-accent-50">
      {/* Header */}
      <header className="bg-white border-b border-cream-300 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800">Admin Panel</h1>
                <p className="text-xs text-stone-500">Izzy's Bookshelf Management</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                        : "text-stone-600 hover:bg-cream-50 border-l-4 border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-cream-300 p-4">
              <h3 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">User</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Role</span>
                  <span className="font-medium text-primary-600">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-6">
                    <h2 className="text-xl font-bold text-stone-800 mb-4">
                      Welcome to Admin Panel
                    </h2>
                    <p className="text-stone-600 mb-6">
                      Manage Izzy's Bookshelf from here. Use the sidebar to navigate between different admin functions.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setActiveTab("covers")}
                        className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-primary-100 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-stone-800">Cover Migration</h3>
                        </div>
                        <p className="text-sm text-stone-600">
                          Migrate book covers from external URLs to permanent Convex storage
                        </p>
                      </div>

                      <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 opacity-60">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-stone-400 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-semibold text-stone-800">User Management</h3>
                        </div>
                        <p className="text-sm text-stone-600">
                          Manage user accounts and permissions (coming soon)
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "covers" && (
                <motion.div
                  key="covers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CoverMigrationPanel />
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-sm border border-cream-300 p-12 text-center"
                >
                  <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-stone-800 mb-2">User Management</h2>
                  <p className="text-stone-500">Coming soon...</p>
                </motion.div>
              )}

              {activeTab === "books" && (
                <motion.div
                  key="books"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-2xl shadow-sm border border-cream-300 p-12 text-center"
                >
                  <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-stone-800 mb-2">Book Management</h2>
                  <p className="text-stone-500">Coming soon...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
