import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Database,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  ArrowLeft,
  UsersRound,
  Plus,
  Trash2,
  Calendar,
  Check,
  X,
  Search,
  Image,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { searchBooks } from "../services/bookApi";
import type { UnifiedBook } from "../services/bookApi";
import { CoverRefreshPanel } from "../components/CoverRefreshPanel";

type AdminTab = "overview" | "bookclub" | "covers";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const { user } = useAuth();

  // Simple admin check - in production you'd check for admin role
  const isAdmin = user?.email?.includes("admin") || user?.email?.includes("parent");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm ring-1 ring-cream-300 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-red-100">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900 mb-2">
            Admin access required
          </h1>
          <p className="text-stone-500 mb-6 leading-relaxed">
            You don&apos;t have permission to open the admin panel.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-display font-bold text-sm hover:bg-primary-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to site
          </Link>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Shield }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookclub", label: "Book Club", icon: UsersRound },
    { id: "covers", label: "Covers", icon: Image },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-300 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-stone-900">
                  Admin
                </h1>
                <p className="text-xs text-stone-500">
                  Izzy&apos;s Bookshelf management
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
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
              <h3 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
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
                    <h2 className="font-display text-xl font-bold text-stone-900 mb-2">
                      Welcome back
                    </h2>
                    <p className="text-stone-500 mb-6 leading-relaxed">
                      Manage book club picks, refresh blurry covers, and keep
                      Izzy&apos;s public shelf looking sharp.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <AdminOverviewCard
                        title="Book Club"
                        description="Create and manage shared reads for friends to follow along"
                        icon={UsersRound}
                        accent="primary"
                        onClick={() => setActiveTab("bookclub")}
                      />
                      <AdminOverviewCard
                        title="Covers"
                        description="Sharpen and permanently save blurry book thumbnails"
                        icon={Image}
                        accent="accent"
                        onClick={() => setActiveTab("covers")}
                      />
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
                  <CoverRefreshPanel />
                </motion.div>
              )}

              {activeTab === "bookclub" && (
                <motion.div
                  key="bookclub"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <BookClubAdminPanel />
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

function AdminOverviewCard({
  title,
  description,
  icon: Icon,
  accent,
  onClick,
}: {
  title: string;
  description: string;
  icon: typeof Shield;
  accent: "primary" | "accent";
  onClick: () => void;
}) {
  const iconBg = accent === "primary" ? "bg-primary-600" : "bg-accent-600";
  const ringHover =
    accent === "primary" ? "hover:ring-primary-200" : "hover:ring-accent-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left p-5 rounded-2xl bg-cream-50/60 border border-cream-300 ring-1 ring-cream-200 ${ringHover} hover:bg-white hover:shadow-md transition-all`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-bold text-stone-900">{title}</h3>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p className="text-sm text-stone-500 mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}


function BookClubAdminPanel() {
  const clubs = useQuery(api.bookClubs.getAll);
  const createClub = useMutation(api.bookClubs.create);
  const updateClub = useMutation(api.bookClubs.update);
  const removeClub = useMutation(api.bookClubs.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<UnifiedBook | null>(null);
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchBooks(query, 6);
      setSearchResults(results);
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedBook || !endDate) return;
    await createClub({
      title: selectedBook.title,
      author: selectedBook.author,
      coverUrl: selectedBook.coverUrl || undefined,
      description: description || undefined,
      endDate,
    });
    setIsCreating(false);
    setSelectedBook(null);
    setEndDate("");
    setDescription("");
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleToggleActive = async (id: Id<"bookClubs">, current: boolean) => {
    await updateClub({ id, isActive: !current });
  };

  const handleDelete = async (id: Id<"bookClubs">) => {
    if (confirm("Delete this book club?")) {
      await removeClub({ id });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-stone-900">
            Book Club
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Pick a book for friends to read along with Izzy
          </p>
        </div>
        <motion.button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-display font-bold text-sm hover:bg-primary-700 transition-colors shadow-sm flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          New pick
        </motion.button>
      </div>

      {isCreating && (
        <div className="mb-8 p-5 bg-cream-50 rounded-2xl border border-cream-300 ring-1 ring-cream-200">
          <h3 className="font-display font-bold text-stone-900 mb-4">
            Create new book club pick
          </h3>
          
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-stone-600 mb-1">Search for a book</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Start typing to search..."
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin" />}
              </div>
              {searchResults.length > 0 && !selectedBook && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => {
                        setSelectedBook(book);
                        setSearchQuery(book.title);
                        setSearchResults([]);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-primary-50 transition-colors text-left border-b border-stone-100 last:border-b-0"
                    >
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-14 bg-cream-200 rounded flex items-center justify-center flex-shrink-0 ring-1 ring-cream-300">
                          <BookOpen className="w-5 h-5 text-stone-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{book.title}</p>
                        <p className="text-sm text-stone-500 truncate">{book.author}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedBook && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                {selectedBook.coverUrl ? (
                  <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                ) : (
                  <div className="w-12 h-16 bg-cream-200 rounded flex items-center justify-center ring-1 ring-cream-300">
                    <BookOpen className="w-6 h-6 text-stone-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{selectedBook.title}</p>
                  <p className="text-sm text-stone-500">{selectedBook.author}</p>
                </div>
                <button onClick={() => { setSelectedBook(null); setSearchQuery(""); }} className="p-1 hover:bg-stone-100 rounded-full">
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Description / why this pick?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell everyone why you chose this book..."
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 px-4 py-2 bg-stone-100 text-stone-600 rounded-lg font-medium hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!selectedBook || !endDate}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Pick
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {clubs && clubs.length > 0 ? (
          clubs.map((club) => (
            <div
              key={club._id}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border ring-1 transition-colors ${
                club.isActive
                  ? "border-emerald-200 bg-emerald-50/40 ring-emerald-100"
                  : "border-cream-300 bg-white ring-cream-200"
              }`}
            >
              {club.coverUrl ? (
                <img
                  src={club.coverUrl}
                  alt={club.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-md ring-1 ring-cream-300 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-24 bg-cream-200 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-cream-300">
                  <BookOpen className="w-6 h-6 text-stone-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display font-bold text-stone-900">
                    {club.title}
                  </h4>
                  {club.isActive && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-500">by {club.author}</p>
                {club.description && (
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                    {club.description}
                  </p>
                )}
                <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Ends {new Date(club.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(club._id, club.isActive)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    club.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {club.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {club.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleDelete(club._id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-14 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
            <UsersRound className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="font-display font-bold text-stone-700">
              No book clubs yet
            </p>
            <p className="text-sm text-stone-500 mt-1">
              Create a pick so friends can read along with Izzy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
