import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import FilterSidebar from '../components/product/FilterSidebar';
import Pagination from '../components/ui/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X, Search, Sparkles, RefreshCw, Filter, ArrowUpDown } from 'lucide-react';
import debounce from 'lodash/debounce';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Backend Filter Metadata Options
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    categoryCounts: [],
    brands: [],
    brandCounts: [],
    skinTypes: [],
    ingredients: [],
    minPrice: 0,
    maxPrice: 10000
  });

  // Filter States
  const [categories, setCategories] = useState(
    searchParams.get('category') ? searchParams.get('category').split(',').map(c => c.trim()).filter(Boolean) : []
  );
  const [brands, setBrands] = useState(
    searchParams.get('brand') ? searchParams.get('brand').split(',').map(b => b.trim()).filter(Boolean) : []
  );
  const [skinTypes, setSkinTypes] = useState(
    searchParams.get('skinType') ? searchParams.get('skinType').split(',').map(s => s.trim()).filter(Boolean) : []
  );
  const [ingredients, setIngredients] = useState(
    searchParams.get('ingredients') ? searchParams.get('ingredients').split(',').map(i => i.trim()).filter(Boolean) : []
  );
  const [priceRange, setPriceRange] = useState({
    min: Number(searchParams.get('minPrice')) || 0,
    max: Number(searchParams.get('maxPrice')) || 10000
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch filter metadata on mount
  useEffect(() => {
    const fetchFilterMetadata = async () => {
      try {
        setFilterLoading(true);
        const data = await productService.getFilterOptions();
        setFilterOptions({
          categories: data.categories || [],
          categoryCounts: data.categoryCounts || [],
          brands: data.brands || [],
          brandCounts: data.brandCounts || [],
          skinTypes: data.skinTypes || [],
          ingredients: data.ingredients || [],
          minPrice: data.minPrice || 0,
          maxPrice: data.maxPrice || 10000
        });

        // Set max price limit from DB if maxPrice not explicitly in URL
        if (!searchParams.get('maxPrice') && data.maxPrice) {
          setPriceRange(prev => ({ ...prev, max: data.maxPrice }));
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilterMetadata();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: categories.join(','),
        brand: brands.join(','),
        skinType: skinTypes.join(','),
        ingredients: ingredients.join(','),
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sort: sortBy,
        pageNumber: page,
        keyword: searchParams.get('q') || ''
      };
      const data = await productService.getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced price search params updater
  const updateUrlParams = useCallback(
    debounce((newFilterState) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (newFilterState.categories.length > 0) newParams.set('category', newFilterState.categories.join(','));
      else newParams.delete('category');

      if (newFilterState.brands.length > 0) newParams.set('brand', newFilterState.brands.join(','));
      else newParams.delete('brand');

      if (newFilterState.skinTypes.length > 0) newParams.set('skinType', newFilterState.skinTypes.join(','));
      else newParams.delete('skinType');

      if (newFilterState.ingredients.length > 0) newParams.set('ingredients', newFilterState.ingredients.join(','));
      else newParams.delete('ingredients');

      if (newFilterState.priceRange.min > 0) newParams.set('minPrice', newFilterState.priceRange.min);
      else newParams.delete('minPrice');

      if (newFilterState.priceRange.max < filterOptions.maxPrice) newParams.set('maxPrice', newFilterState.priceRange.max);
      else newParams.delete('maxPrice');

      if (newFilterState.sortBy && newFilterState.sortBy !== 'newest') newParams.set('sort', newFilterState.sortBy);
      else newParams.delete('sort');

      if (newFilterState.page > 1) newParams.set('page', newFilterState.page);
      else newParams.delete('page');

      setSearchParams(newParams);
    }, 400),
    [searchParams, filterOptions.maxPrice]
  );

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page, categories, brands, skinTypes, ingredients, sortBy, priceRange.max, priceRange.min]);

  // Handlers
  const handleCategoryToggle = (cat) => {
    const next = categories.includes(cat) ? categories.filter(c => c !== cat) : [...categories, cat];
    setCategories(next);
    setPage(1);
    updateUrlParams({ categories: next, brands, skinTypes, ingredients, priceRange, sortBy, page: 1 });
  };

  const handleBrandToggle = (b) => {
    const next = brands.includes(b) ? brands.filter(item => item !== b) : [...brands, b];
    setBrands(next);
    setPage(1);
    updateUrlParams({ categories, brands: next, skinTypes, ingredients, priceRange, sortBy, page: 1 });
  };

  const handleSkinTypeToggle = (st) => {
    const next = skinTypes.includes(st) ? skinTypes.filter(item => item !== st) : [...skinTypes, st];
    setSkinTypes(next);
    setPage(1);
    updateUrlParams({ categories, brands, skinTypes: next, ingredients, priceRange, sortBy, page: 1 });
  };

  const handleIngredientToggle = (ing) => {
    const next = ingredients.includes(ing) ? ingredients.filter(item => item !== ing) : [...ingredients, ing];
    setIngredients(next);
    setPage(1);
    updateUrlParams({ categories, brands, skinTypes, ingredients: next, priceRange, sortBy, page: 1 });
  };

  const handlePriceChange = (min, max) => {
    const nextPrice = { min: Number(min), max: Number(max) };
    setPriceRange(nextPrice);
    setPage(1);
    updateUrlParams({ categories, brands, skinTypes, ingredients, priceRange: nextPrice, sortBy, page: 1 });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    setPage(1);
    updateUrlParams({ categories, brands, skinTypes, ingredients, priceRange, sortBy: val, page: 1 });
  };

  const clearAllFilters = () => {
    setCategories([]);
    setBrands([]);
    setSkinTypes([]);
    setIngredients([]);
    setPriceRange({ min: 0, max: filterOptions.maxPrice || 10000 });
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  // Compute total active count
  const totalActiveFilters = 
    categories.length + 
    brands.length + 
    skinTypes.length + 
    ingredients.length + 
    (priceRange.max < (filterOptions.maxPrice || 10000) ? 1 : 0) +
    (priceRange.min > 0 ? 1 : 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen pb-24 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-14 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
             <nav className="flex items-center gap-2 text-[10px] font-black text-[#6E6D7A] uppercase tracking-[0.2em] mb-4">
                <Link to="/" className="hover:text-[#121214] dark:hover:text-[#FAF9F6] cursor-pointer transition-colors">Glam Luxe</Link>
                <ChevronDown className="size-3 -rotate-90 text-[#C5A880]" />
                <span className="text-[#121214] dark:text-[#FAF9F6] font-bold">Catalog</span>
             </nav>

             <div className="flex items-center gap-3">
               <h1 className="text-4xl md:text-6xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tighter leading-none">
                  Beauty<span className="text-[#C5A880] px-2 italic">Atelier</span>
               </h1>
               <span className="px-3.5 py-1 bg-white dark:bg-[#18181B] text-[#C5A880] font-black rounded-full text-xs uppercase tracking-widest hidden sm:inline-block border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm">
                 Curated Edit
               </span>
             </div>
             
             <p className="mt-3 text-[#6E6D7A] text-xs md:text-sm font-medium flex items-center gap-2">
               <span>Displaying <strong className="text-[#121214] dark:text-[#FAF9F6]">{products.length}</strong> of <strong className="text-[#121214] dark:text-[#FAF9F6]">{totalProducts}</strong> creations</span>
               {searchParams.get('q') && (
                 <span className="bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] px-2.5 py-0.5 rounded-full font-bold border border-[#EFECE6] dark:border-[#3E3E42]">
                   for "{searchParams.get('q')}"
                 </span>
               )}
             </p>
          </motion.div>

          {/* Controls Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#18181B] p-2.5 rounded-[2.2rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/5 dark:shadow-none"
          >
             {/* Sort Select Dropdown */}
             <div className="relative group">
                <div className="flex items-center gap-2 pl-4 pr-10 py-3 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] text-[10px] font-black uppercase tracking-widest text-[#121214] dark:text-[#FAF9F6] cursor-pointer group-hover:border-[#C5A880] transition-all">
                  <ArrowUpDown className="size-3.5 text-[#C5A880]" />
                  <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-transparent outline-none cursor-pointer text-[#121214] dark:text-[#FAF9F6] font-black"
                  >
                    <option value="newest" className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6]">Newest Arrivals</option>
                    <option value="price_asc" className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6]">Price: Low to High</option>
                    <option value="price_desc" className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6]">Price: High to Low</option>
                    <option value="rating" className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6]">Top Rated</option>
                    <option value="popular" className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6]">Most Popular</option>
                    <option value="name_asc" className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6]">Name: A to Z</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#6E6D7A] pointer-events-none group-hover:text-[#C5A880] transition-transform group-hover:rotate-180 duration-300" />
                </div>
             </div>

             <div className="h-8 w-px bg-[#EFECE6] dark:bg-[#2A2A2E] mx-1 hidden lg:block"></div>

             {/* View Mode Toggle */}
             <div className="flex bg-[#FAF9F6] dark:bg-[#121214] p-1 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                <button 
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#0D0D0D] dark:bg-[#FAF9F6] shadow-md text-white dark:text-[#0D0D0D] font-bold' : 'text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6]'}`}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#0D0D0D] dark:bg-[#FAF9F6] shadow-md text-white dark:text-[#0D0D0D] font-bold' : 'text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6]'}`}
                >
                  <List className="size-4" />
                </button>
             </div>

             {/* Mobile Filter Toggle Button */}
             <button 
               onClick={() => setShowMobileFilters(true)}
               className="lg:hidden flex items-center gap-2 px-5 py-3 bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95 transition-all"
             >
               <SlidersHorizontal className="size-4 text-[#C5A880]" /> 
               Filters
               {totalActiveFilters > 0 && (
                 <span className="size-5 bg-[#C5A880] text-[#0D0D0D] rounded-full text-[10px] font-black flex items-center justify-center">
                   {totalActiveFilters}
                 </span>
               )}
             </button>
          </motion.div>
        </div>

        {/* Active Filter Chips Bar */}
        <AnimatePresence>
          {totalActiveFilters > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-white dark:bg-[#18181B] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm flex flex-wrap items-center gap-2"
            >
              <span className="text-[10px] font-black text-[#6E6D7A] uppercase tracking-widest flex items-center gap-1.5 mr-2">
                <Filter className="size-3 text-[#C5A880]" /> Active Filters:
              </span>

              {categories.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-[10px] font-black uppercase tracking-wider rounded-xl border border-[#EFECE6] dark:border-[#3E3E42]">
                  Cat: {c}
                  <X className="size-3 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white cursor-pointer" onClick={() => handleCategoryToggle(c)} />
                </span>
              ))}

              {brands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-[10px] font-black uppercase tracking-wider rounded-xl border border-[#EFECE6] dark:border-[#3E3E42]">
                  Brand: {b}
                  <X className="size-3 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white cursor-pointer" onClick={() => handleBrandToggle(b)} />
                </span>
              ))}

              {skinTypes.map((st) => (
                <span key={st} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-[10px] font-black uppercase tracking-wider rounded-xl border border-[#EFECE6] dark:border-[#3E3E42]">
                  Skin: {st}
                  <X className="size-3 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white cursor-pointer" onClick={() => handleSkinTypeToggle(st)} />
                </span>
              ))}

              {ingredients.map((ing) => (
                <span key={ing} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-[10px] font-black uppercase tracking-wider rounded-xl border border-[#EFECE6] dark:border-[#3E3E42]">
                  Ing: {ing}
                  <X className="size-3 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white cursor-pointer" onClick={() => handleIngredientToggle(ing)} />
                </span>
              ))}

              {(priceRange.max < (filterOptions.maxPrice || 10000) || priceRange.min > 0) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-[10px] font-black uppercase tracking-wider rounded-xl border border-[#EFECE6] dark:border-[#3E3E42]">
                  Price: ₹{priceRange.min} - ₹{priceRange.max}
                  <X className="size-3 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white cursor-pointer" onClick={() => handlePriceChange(0, filterOptions.maxPrice || 10000)} />
                </span>
              )}

              <button 
                onClick={clearAllFilters} 
                className="ml-auto text-[10px] font-black text-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6] uppercase tracking-widest flex items-center gap-1 underline underline-offset-4"
              >
                <RefreshCw className="size-3" /> Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-10 relative items-start">
          {/* Desktop Sidebar */}
          <FilterSidebar 
            categories={filterOptions.categories}
            categoryCounts={filterOptions.categoryCounts}
            selectedCategories={categories}
            onCategoryChange={handleCategoryToggle}

            brands={filterOptions.brands}
            brandCounts={filterOptions.brandCounts}
            selectedBrands={brands}
            onBrandChange={handleBrandToggle}

            skinTypes={filterOptions.skinTypes}
            selectedSkinTypes={skinTypes}
            onSkinTypeChange={handleSkinTypeToggle}

            ingredients={filterOptions.ingredients}
            selectedIngredients={ingredients}
            onIngredientChange={handleIngredientToggle}

            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            dbMaxPrice={filterOptions.maxPrice}
            onPriceChange={handlePriceChange}

            onClearAll={clearAllFilters}
            totalActiveFilters={totalActiveFilters}
          />

          {/* Product Grid Area */}
          <div className="flex-grow min-w-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="skeleton"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-6`}
                >
                  {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div 
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-6`}
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-[#18181B] rounded-[3rem] border border-dashed border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm text-center"
                >
                   <div className="size-20 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-3xl flex items-center justify-center text-[#C5A880] mb-6 shadow-inner border border-[#EFECE6] dark:border-[#3E3E42]">
                      <Search className="size-10" />
                   </div>
                   <h3 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-widest mb-2">No Matching Atelier Pieces</h3>
                   <p className="text-[#6E6D7A] text-xs md:text-sm max-w-md mb-8">
                     We could not find products matching your selected filter criteria. Try expanding your search.
                   </p>
                   <button 
                     onClick={clearAllFilters} 
                     className="bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white active:scale-95 transition-all"
                   >
                      Reset All Filters
                   </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="mt-16">
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={(p) => {
                      setPage(p);
                      updateUrlParams({ categories, brands, skinTypes, ingredients, priceRange, sortBy, page: p });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                  />
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
         {showMobileFilters && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowMobileFilters(false)}
                 className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
               />
               <motion.div 
                 initial={{ x: '100%' }}
                 animate={{ x: 0 }}
                 exit={{ x: '100%' }}
                 transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                 className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#18181B] z-[101] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between text-[#121214] dark:text-[#FAF9F6]"
               >
                  <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#EFECE6] dark:border-[#2A2A2E]">
                       <div className="flex items-center gap-2">
                         <div className="size-8 rounded-xl bg-[#FAF9F6] dark:bg-[#2A2A2E] flex items-center justify-center text-[#C5A880]">
                           <SlidersHorizontal className="size-4" />
                         </div>
                         <h2 className="text-lg font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider">Refine Products</h2>
                       </div>
                       <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-xl hover:bg-gray-100 transition-colors">
                          <X className="size-5 text-[#6E6D7A]" />
                       </button>
                    </div>
                    
                    {/* Mobile Sidebar Content */}
                    <FilterSidebar 
                      categories={filterOptions.categories}
                      categoryCounts={filterOptions.categoryCounts}
                      selectedCategories={categories}
                      onCategoryChange={handleCategoryToggle}

                      brands={filterOptions.brands}
                      brandCounts={filterOptions.brandCounts}
                      selectedBrands={brands}
                      onBrandChange={handleBrandToggle}

                      skinTypes={filterOptions.skinTypes}
                      selectedSkinTypes={skinTypes}
                      onSkinTypeChange={handleSkinTypeToggle}

                      ingredients={filterOptions.ingredients}
                      selectedIngredients={ingredients}
                      onIngredientChange={handleIngredientToggle}

                      minPrice={priceRange.min}
                      maxPrice={priceRange.max}
                      dbMaxPrice={filterOptions.maxPrice}
                      onPriceChange={handlePriceChange}

                      onClearAll={clearAllFilters}
                      totalActiveFilters={totalActiveFilters}
                      isMobile={true}
                    />
                  </div>

                  <div className="sticky bottom-0 pt-6 pb-2 bg-white dark:bg-[#18181B] border-t border-[#EFECE6] dark:border-[#2A2A2E] space-y-2 mt-8">
                     <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black py-4 rounded-full uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-98 transition-all"
                     >
                        Apply Filters ({products.length} Items Found)
                     </button>
                     <button 
                        onClick={clearAllFilters}
                        className="w-full bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#6E6D7A] font-bold py-3 rounded-full uppercase tracking-widest text-[10px] hover:text-[#121214] transition-all"
                     >
                        Reset All Filters
                     </button>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
