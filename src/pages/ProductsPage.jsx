import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import FilterSidebar from '../components/product/FilterSidebar';
import Pagination from '../components/ui/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X, Search } from 'lucide-react';
import debounce from 'lodash/debounce';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filter States
  const [categories, setCategories] = useState(
    searchParams.get('category') ? searchParams.get('category').split(',') : []
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || 0,
    max: searchParams.get('maxPrice') || 10000
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: categories.join(','),
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

  // Debounced price fetch
  const debouncedFetch = useCallback(
    debounce(() => {
      setPage(1);
      const newParams = new URLSearchParams(searchParams);
      if (priceRange.max < 10000) newParams.set('maxPrice', priceRange.max);
      else newParams.delete('maxPrice');
      newParams.set('page', 1);
      setSearchParams(newParams);
    }, 500),
    [priceRange, categories, sortBy, searchParams]
  );

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page, categories, sortBy]);

  const handleCategoryToggle = (cat) => {
    const nextCategories = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat];
    
    setCategories(nextCategories);
    setPage(1);
    
    const newParams = new URLSearchParams(searchParams);
    if (nextCategories.length > 0) newParams.set('category', nextCategories.join(','));
    else newParams.delete('category');
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    debouncedFetch();
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', val);
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setCategories([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  const availableCategories = ['Makeup', 'Skin Care', 'Hair Care', 'Fragrance', 'Appliances', 'Natural', 'Personal Care', 'Mom & Baby', 'Health & Wellness', 'Men', 'Luxe'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
             <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                <span className="hover:text-pink-600 cursor-pointer transition-colors">Nykaa</span>
                <ChevronDown className="size-3 -rotate-90" />
                <span className="text-pink-600">Shop All</span>
             </nav>
             <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                Beauty<span className="text-pink-600 px-2 italic">Hub</span>
             </h1>
             <p className="mt-4 text-gray-400 text-sm font-medium">Showing {products.length} of {totalProducts} curated products</p>
          </motion.div>

          {/* Controls Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-3 bg-white/70 backdrop-blur-xl p-3 rounded-[2rem] border border-white/50 shadow-2xl shadow-pink-100/20"
          >
             {/* Sort Select */}
             <div className="relative group">
                <select 
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-gray-50 border-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 focus:ring-2 focus:ring-pink-500/20 outline-none cursor-pointer pr-12 min-w-[180px]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
             </div>

             <div className="h-8 w-px bg-gray-100 mx-2 hidden lg:block"></div>

             {/* View Mode */}
             <div className="flex bg-gray-50 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-lg text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-lg text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="size-4" />
                </button>
             </div>

             <button 
               onClick={() => setShowMobileFilters(true)}
               className="lg:hidden flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200"
             >
               <SlidersHorizontal className="size-4" /> Filters
             </button>
          </motion.div>
        </div>

        <div className="flex gap-12 relative">
          {/* Desktop Sidebar */}
          <FilterSidebar 
            categories={availableCategories}
            selectedCategories={categories}
            onCategoryChange={handleCategoryToggle}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            onPriceChange={handlePriceChange}
            onClearAll={clearAllFilters}
          />

          {/* Product Grid Area */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="skeleton"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div 
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200"
                >
                   <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                      <Search className="size-10" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">No matching products</h3>
                   <p className="text-gray-400 text-sm mb-10">We couldn't find what you're looking for. Try a different filter.</p>
                   <button onClick={clearAllFilters} className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-pink-100 hover:scale-105 transition-all">
                      Reset All Filters
                   </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="mt-20">
                  <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={(p) => {
                      setPage(p);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', p);
                      setSearchParams(newParams);
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
                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
               />
               <motion.div 
                 initial={{ x: '100%' }}
                 animate={{ x: 0 }}
                 exit={{ x: '100%' }}
                 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                 className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[101] shadow-2xl p-8 overflow-y-auto"
               >
                  <div className="flex justify-between items-center mb-10 pb-6 border-b">
                     <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Filter By</h2>
                     <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <X className="size-6 text-gray-400" />
                     </button>
                  </div>
                  
                  {/* Reuse Sidebar Logic for Mobile */}
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Categories</h4>
                        <div className="grid grid-cols-2 gap-3">
                           {availableCategories.map(cat => (
                              <button 
                                key={cat}
                                onClick={() => handleCategoryToggle(cat.toLowerCase())}
                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                   categories.includes(cat.toLowerCase()) 
                                   ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-100' 
                                   : 'bg-white border-gray-100 text-gray-500'
                                }`}
                              >
                                 {cat}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Point</h4>
                           <span className="text-[10px] font-black text-pink-600">₹{priceRange.max}+</span>
                        </div>
                        <input 
                           type="range" 
                           min="0" 
                           max="10000" 
                           step="500"
                           value={priceRange.max}
                           onChange={(e) => handlePriceChange(0, e.target.value)}
                           className="w-full accent-pink-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                        />
                     </div>
                  </div>

                  <div className="fixed bottom-0 left-0 right-0 p-8 bg-white border-t space-y-3">
                     <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-gray-200"
                     >
                        Apply Filters
                     </button>
                     <button 
                        onClick={clearAllFilters}
                        className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl uppercase tracking-widest text-[10px]"
                     >
                        Reset Everything
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
