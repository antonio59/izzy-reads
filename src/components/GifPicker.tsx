import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, X, Search, Loader2, Sparkles } from "lucide-react";
import {
  searchGifs,
  getTrendingGifs,
  isGiphyConfigured,
  type GifData,
} from "../services/giphyApi";
import { Input } from "./ui/Input";

interface GifPickerProps {
  onSelect: (gifUrl: string) => void;
  buttonClassName?: string;
}

export function GifPicker({ onSelect, buttonClassName = "" }: GifPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState<GifData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if Giphy is configured
  const giphyAvailable = isGiphyConfigured();

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadTrendingGifs = useCallback(async () => {
    setLoading(true);
    try {
      const trending = await getTrendingGifs(12);
      setGifs(trending);
    } catch (error) {
      console.error("Failed to load trending GIFs:", error);
    } finally {
      setLoading(false);
    }
  }, []);



  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setHasSearched(false);
      loadTrendingGifs();
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await searchGifs(query, 12);
      setGifs(results);
    } catch (error) {
      console.error("Failed to search GIFs:", error);
    } finally {
      setLoading(false);
    }
  }, [loadTrendingGifs]);

  // Debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleGifSelect = (gif: GifData) => {
    onSelect(gif.url);
    setIsOpen(false);
    setSearchQuery("");
    setHasSearched(false);
    setGifs([]);
  };

  // Quick search suggestions for kids
  const quickSearches = [
    "happy",
    "excited",
    "reading",
    "celebration",
    "thumbs up",
    "wow",
  ];

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          const opening = !isOpen;
          setIsOpen(opening);
          if (opening && !hasSearched && gifs.length === 0 && giphyAvailable) {
            loadTrendingGifs();
          }
        }}
        className={`p-2 rounded-lg hover:bg-stone-100 transition-colors ${buttonClassName}`}
        title="Add GIF"
      >
        <Image className="w-5 h-5 text-stone-500 hover:text-primary-500" />
      </button>

      <AnimatePresence>
        {isOpen && !giphyAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 w-64 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-stone-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                GIFs
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <p className="text-sm text-stone-500">
              GIF support is not configured yet. Ask the admin to add a Giphy
              API key!
            </p>
          </motion.div>
        )}
        {isOpen && giphyAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-0 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  Find a GIF
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              {/* Search input */}
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for GIFs..."
                icon={<Search className="w-4 h-4" />}
                iconPosition="left"
                variant="filled"
                size="sm"
                className="rounded-lg"
                autoFocus
              />

              {/* Quick searches */}
              {!hasSearched && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                      className="px-2 py-1 text-xs bg-stone-100 hover:bg-primary-100 text-stone-600 hover:text-primary-600 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GIF Grid */}
            <div className="h-64 overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
              ) : gifs.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {gifs.map((gif) => (
                    <motion.button
                      key={gif.id}
                      onClick={() => handleGifSelect(gif)}
                      className="relative aspect-video rounded-lg overflow-hidden bg-stone-100 hover:ring-2 hover:ring-primary-400 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={gif.url}
                        alt={gif.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.button>
                  ))}
                </div>
              ) : hasSearched ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <Image className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">No GIFs found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-stone-400">
                  <p className="text-sm">Search for GIFs above</p>
                </div>
              )}
            </div>

            {/* Giphy attribution */}
            <div className="p-2 border-t border-stone-100 bg-stone-50">
              <p className="text-xs text-stone-400 text-center">
                Powered by GIPHY
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GifPicker;
