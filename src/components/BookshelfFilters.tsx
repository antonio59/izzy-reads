import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  SortAsc,
  SortDesc,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Badge } from "./ui/Badge";

interface BookshelfFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  sortBy: "title" | "author" | "dateRead" | "rating" | "dateAdded";
  onSortByChange: (
    sort: "title" | "author" | "dateRead" | "rating" | "dateAdded",
  ) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  availableGenres: string[];
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

const BookshelfFilters: React.FC<BookshelfFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenres,
  onGenreChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  availableGenres,
  showFilters = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showFilters);

  const hasActiveFilters = selectedGenres.length > 0 || selectedRating !== null;

  const clearFilters = () => {
    onGenreChange([]);
    onRatingChange(null);
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  const sortOptions = [
    {
      value: "dateRead",
      label: "Date Read",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: "dateAdded",
      label: "Date Added",
      icon: <Calendar className="w-4 h-4" />,
    },
    { value: "title", label: "Title", icon: <BookOpen className="w-4 h-4" /> },
    {
      value: "author",
      label: "Author",
      icon: <BookOpen className="w-4 h-4" />,
    },
    { value: "rating", label: "Rating", icon: <Star className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Search and filter toggle */}
      <div className="flex gap-3">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search books by title or author..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            isExpanded || hasActiveFilters
              ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
              : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
              {selectedGenres.length + (selectedRating ? 1 : 0)}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </motion.button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
              {/* Sort options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSortByChange(option.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        sortBy === option.value
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}

                  {/* Sort order toggle */}
                  <button
                    onClick={() =>
                      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-all"
                  >
                    {sortOrder === "asc" ? (
                      <>
                        <SortAsc className="w-4 h-4" />
                        <span className="hidden sm:inline">Ascending</span>
                      </>
                    ) : (
                      <>
                        <SortDesc className="w-4 h-4" />
                        <span className="hidden sm:inline">Descending</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Genre filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[null, 5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating ?? "all"}
                      onClick={() => onRatingChange(rating)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedRating === rating
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {rating === null ? (
                        "All"
                      ) : (
                        <>
                          {rating}+
                          <Star className="w-3 h-3 fill-current" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active filters and clear */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {selectedGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="primary"
                        removable
                        onRemove={() => toggleGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                    {selectedRating && (
                      <Badge
                        variant="accent"
                        removable
                        onRemove={() => onRatingChange(null)}
                        icon={<Star className="w-3 h-3" />}
                      >
                        {selectedRating}+ stars
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick filter chips when collapsed */}
      {!isExpanded && hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 items-center"
        >
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="primary"
              size="sm"
              removable
              onRemove={() => toggleGenre(genre)}
            >
              {genre}
            </Badge>
          ))}
          {selectedRating && (
            <Badge
              variant="accent"
              size="sm"
              removable
              onRemove={() => onRatingChange(null)}
              icon={<Star className="w-3 h-3" />}
            >
              {selectedRating}+ stars
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            Clear
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BookshelfFilters;
