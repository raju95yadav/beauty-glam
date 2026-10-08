import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../services/productService';

const TRENDING_SEARCHES = [
  'Serum',
  'Red Lipstick',
  'Sunscreen',
  'Moisturizer',
  'Vitamin C',
  'Foundation',
  'Perfume',
  'Eye Cream'
];

const LOCAL_STORAGE_KEY = 'glam_recent_searches';

// Helper component for dynamic substring match highlighting
const HighlightMatch = ({ text, query }) => {
  if (!text || !query || !query.trim()) {
    return <>{text}</>;
  }

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="font-black text-[#121214] dark:text-[#FAF9F6] underline decoration-[#C5A880]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const SearchBar = ({ className = '', onSearchSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsListRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
  }, []);

  const saveRecentSearch = useCallback((term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim().replace(/^#/, '');
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent search:', e);
      }
      return updated;
    });
  }, []);

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== termToRemove);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update recent searches:', e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches:', e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await productService.searchProducts(searchQuery.trim());
      setResults(data?.slice(0, 6) || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query);
      } else {
        setResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  // Execute navigation
  const executeSearch = (searchTerm) => {
    const term = (searchTerm || query).trim();
    if (!term) return;
    saveRecentSearch(term);
    setIsFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    navigate(`/search?q=${encodeURIComponent(term)}`);
    if (onSearchSuccess) onSearchSuccess();
  };

  const handleSelectProduct = (product) => {
    saveRecentSearch(product.name);
    setQuery(product.name);
    setIsFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    navigate(`/product/${product._id}`);
    if (onSearchSuccess) onSearchSuccess();
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!isFocused) return;

    if (e.key === 'Escape') {
      setIsFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelectProduct(results[activeIndex]);
        } else {
          executeSearch();
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  const hasQuery = query.trim().length > 0;
  const showDropdown = isFocused;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); executeSearch(); }} className="relative z-10">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search luxury formulations, iconic scents, shades..."
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          className="w-full pl-10 pr-11 py-2.5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full outline-none focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 transition-all font-medium text-sm text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/60"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6D7A] size-4 pointer-events-none" />

        {loading ? (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5A880] size-4 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white transition-colors p-0.5 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </form>

      {/* Floating Suggestions & Empty State Panel */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#18181B] backdrop-blur-xl rounded-[2rem] shadow-2xl border border-[#EFECE6] dark:border-[#2A2A2E] py-3 z-50 overflow-hidden"
          >
            {/* Case 1: Search suggestions results */}
            {hasQuery && results.length > 0 && (
              <div ref={resultsListRef} className="space-y-1">
                <div className="px-5 py-2 flex items-center justify-between text-[10px] font-black text-[#6E6D7A] uppercase tracking-wider">
                  <span>Atelier Recommendations</span>
                  <span>Use ↑↓ to navigate</span>
                </div>
                {results.map((item, index) => {
                  const isSelected = index === activeIndex;
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSelectProduct(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full px-5 py-3 text-left transition-colors flex items-center justify-between gap-3 group cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6]' 
                          : 'hover:bg-[#FAF9F6] dark:hover:bg-[#2A2A2E]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-11 rounded-xl bg-[#FAF9F6] dark:bg-[#121214] overflow-hidden shrink-0 border border-[#EFECE6] dark:border-[#2A2A2E]">
                          <img
                            src={item.images?.[0]?.url || 'https://placehold.co/100x100?text=Beauty'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#121214] dark:text-[#FAF9F6] line-clamp-1 group-hover:text-[#C5A880]">
                            <HighlightMatch text={item.name} query={query} />
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-black text-[#121214] dark:text-[#FAF9F6]">
                              ₹{item.price}
                            </span>
                            {item.brand && (
                              <span className="text-[10px] text-[#6E6D7A] truncate">
                                • {item.brand}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`size-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${isSelected ? 'opacity-100 text-[#C5A880]' : 'text-[#6E6D7A]'}`} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Case 2: No suggestions found for query */}
            {hasQuery && !loading && results.length === 0 && (
              <div className="px-5 py-6 text-center">
                <p className="text-xs text-[#6E6D7A] mb-3">
                  No products found for &ldquo;<span className="font-semibold text-[#121214] dark:text-[#FAF9F6]">{query}</span>&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => executeSearch()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-xs font-black border border-[#EFECE6] dark:border-[#3E3E42] hover:border-[#C5A880] transition-colors cursor-pointer"
                >
                  <Search className="size-3.5 text-[#C5A880]" /> Search catalogue for &ldquo;{query}&rdquo;
                </button>
              </div>
            )}

            {/* Case 3: Empty query - Trending Searches & Recent Searches */}
            {!hasQuery && (
              <div className="space-y-4 px-5 py-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-[#6E6D7A] uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="size-3 text-[#C5A880]" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="text-[10px] font-bold text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] transition-colors cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          onClick={() => executeSearch(term)}
                          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF9F6] dark:bg-[#121214] hover:border-[#C5A880] text-[#121214] dark:text-[#FAF9F6] border border-[#EFECE6] dark:border-[#2A2A2E] transition-all cursor-pointer"
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white p-0.5 rounded-full"
                            title="Remove"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5 text-[10px] font-black text-[#6E6D7A] uppercase tracking-wider">
                    <TrendingUp className="size-3 text-[#C5A880]" />
                    <span>Curated Trends</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => executeSearch(tag)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF9F6] dark:bg-[#121214] hover:border-[#C5A880] text-[#121214] dark:text-[#FAF9F6] border border-[#EFECE6] dark:border-[#2A2A2E] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="text-[#C5A880] text-[11px]">#</span>
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
