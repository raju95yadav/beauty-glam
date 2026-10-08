import React, { useState } from 'react';
import { 
  CheckCircle, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Tag, 
  Feather, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ 
  categories = [], 
  categoryCounts = [],
  selectedCategories = [], 
  onCategoryChange, 
  
  brands = [],
  brandCounts = [],
  selectedBrands = [],
  onBrandChange,

  skinTypes = [],
  selectedSkinTypes = [],
  onSkinTypeChange,

  ingredients = [],
  selectedIngredients = [],
  onIngredientChange,

  minPrice = 0, 
  maxPrice = 10000, 
  dbMaxPrice = 10000,
  onPriceChange, 

  onClearAll,
  totalActiveFilters = 0,
  isMobile = false
}) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [openSections, setOpenSections] = useState({
    price: true,
    categories: true,
    brands: true,
    skinType: true,
    ingredients: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBrands = brands.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const pricePresets = [
    { label: 'Under ₹500', max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: 'Above ₹2,000', min: 2000, max: dbMaxPrice || 10000 },
  ];

  const getCategoryCount = (catName) => {
    const item = categoryCounts.find(c => c._id?.toLowerCase() === catName.toLowerCase());
    return item ? item.count : null;
  };

  const getBrandCount = (brandName) => {
    const item = brandCounts.find(b => b._id?.toLowerCase() === brandName.toLowerCase());
    return item ? item.count : null;
  };

  const sidebarContent = (
    <div className="space-y-8">
      {/* Sidebar Header */}
      {!isMobile && (
        <div className="flex justify-between items-center pb-5 border-b border-[#EFECE6] dark:border-[#2A2A2E]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-[#FAF9F6] dark:bg-[#2A2A2E] flex items-center justify-center text-[#C5A880]">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <h3 className="font-black text-[#121214] dark:text-[#FAF9F6] uppercase text-[11px] tracking-[0.2em]">Filter By</h3>
              <p className="text-[10px] text-[#6E6D7A] font-medium">Curate selection</p>
            </div>
          </div>

          {totalActiveFilters > 0 && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[10px] font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider hover:border-[#C5A880] border border-[#EFECE6] dark:border-[#3E3E42] transition-all group"
            >
              <RotateCcw className="size-3 text-[#C5A880] group-hover:rotate-[-180deg] transition-transform duration-500" />
              Reset ({totalActiveFilters})
            </motion.button>
          )}
        </div>
      )}

      {/* 1. Price Range Section */}
      <div className="border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
        <button 
          onClick={() => toggleSection('price')} 
          className="w-full flex justify-between items-center font-black text-[#121214] dark:text-[#FAF9F6] uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
        >
          <span className="flex items-center gap-2">
            <DollarSign className="size-3.5 text-[#C5A880]" />
            Price Point
          </span>
          <ChevronDown className={`size-4 text-[#6E6D7A] transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {openSections.price && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-5 overflow-hidden"
            >
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-2">
                {pricePresets.map((preset, idx) => {
                  const isPresetActive = (preset.min ? minPrice === preset.min : minPrice === 0) && maxPrice === preset.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => onPriceChange(preset.min || 0, preset.max)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border text-center ${
                        isPresetActive 
                          ? 'bg-[#0D0D0D] dark:bg-[#FAF9F6] border-[#0D0D0D] dark:border-[#FAF9F6] text-white dark:text-[#0D0D0D] shadow-md' 
                          : 'bg-[#FAF9F6] dark:bg-[#121214] border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-[#6E6D7A]">
                  <span>₹0</span>
                  <span className="text-[#121214] dark:text-[#FAF9F6] font-black">Up to ₹{maxPrice.toLocaleString()}</span>
                  <span>₹{dbMaxPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={dbMaxPrice || 10000} 
                  step="100"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                  className="w-full accent-[#0D0D0D] dark:accent-[#C5A880] h-2 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Categories Section */}
      {categories.length > 0 && (
        <div className="border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
          <button 
            onClick={() => toggleSection('categories')} 
            className="w-full flex justify-between items-center font-black text-[#121214] dark:text-[#FAF9F6] uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Layers className="size-3.5 text-[#C5A880]" />
              Categories
              {selectedCategories.length > 0 && (
                <span className="size-4 rounded-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] text-[9px] flex items-center justify-center font-bold">
                  {selectedCategories.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-[#6E6D7A] transition-transform duration-300 ${openSections.categories ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.categories && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2.5 overflow-hidden max-h-56 overflow-y-auto pr-1 custom-scrollbar"
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.toLowerCase());
                  const count = getCategoryCount(cat);
                  return (
                    <label key={cat} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF9F6] dark:hover:bg-[#2A2A2E] cursor-pointer group transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer size-4 border border-[#EFECE6] dark:border-[#3E3E42] rounded-lg appearance-none checked:bg-[#0D0D0D] dark:checked:bg-[#FAF9F6] checked:border-[#0D0D0D] dark:checked:border-[#FAF9F6] bg-white dark:bg-[#18181B] transition-all cursor-pointer"
                            checked={isSelected}
                            onChange={() => onCategoryChange(cat.toLowerCase())}
                          />
                          <CheckCircle className="absolute size-3 text-white dark:text-[#0D0D0D] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                          isSelected ? 'text-[#121214] dark:text-[#FAF9F6] font-black' : 'text-[#6E6D7A] group-hover:text-[#121214] dark:group-hover:text-[#FAF9F6]'
                        }`}>
                          {cat}
                        </span>
                      </div>
                      {count !== null && (
                        <span className="text-[10px] font-bold text-[#6E6D7A] bg-[#FAF9F6] dark:bg-[#121214] group-hover:text-[#121214] dark:group-hover:text-[#FAF9F6] px-2 py-0.5 rounded-full transition-colors border border-[#EFECE6] dark:border-[#2A2A2E]">
                          {count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. Brands Section */}
      {brands.length > 0 && (
        <div className="border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
          <button 
            onClick={() => toggleSection('brands')} 
            className="w-full flex justify-between items-center font-black text-[#121214] dark:text-[#FAF9F6] uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-[#C5A880]" />
              Brands
              {selectedBrands.length > 0 && (
                <span className="size-4 rounded-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] text-[9px] flex items-center justify-center font-bold">
                  {selectedBrands.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-[#6E6D7A] transition-transform duration-300 ${openSections.brands ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.brands && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Brand Search input */}
                {brands.length > 5 && (
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#6E6D7A]" />
                    <input
                      type="text"
                      placeholder="Search brand..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/60 rounded-xl focus:outline-none focus:border-[#C5A880] transition-all"
                    />
                  </div>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredBrands.map((brand) => {
                    const isSelected = selectedBrands.includes(brand.toLowerCase());
                    const count = getBrandCount(brand);
                    return (
                      <label key={brand} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#FAF9F6] dark:hover:bg-[#2A2A2E] cursor-pointer group transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              className="peer size-4 border border-[#EFECE6] dark:border-[#3E3E42] rounded-lg appearance-none checked:bg-[#0D0D0D] dark:checked:bg-[#FAF9F6] checked:border-[#0D0D0D] dark:checked:border-[#FAF9F6] bg-white dark:bg-[#18181B] transition-all cursor-pointer"
                              checked={isSelected}
                              onChange={() => onBrandChange(brand.toLowerCase())}
                            />
                            <CheckCircle className="absolute size-3 text-white dark:text-[#0D0D0D] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                          </div>
                          <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                            isSelected ? 'text-[#121214] dark:text-[#FAF9F6] font-black' : 'text-[#6E6D7A] group-hover:text-[#121214] dark:group-hover:text-[#FAF9F6]'
                          }`}>
                            {brand}
                          </span>
                        </div>
                        {count !== null && (
                          <span className="text-[10px] font-bold text-[#6E6D7A] bg-[#FAF9F6] dark:bg-[#121214] group-hover:text-[#121214] dark:group-hover:text-[#FAF9F6] px-2 py-0.5 rounded-full transition-colors border border-[#EFECE6] dark:border-[#2A2A2E]">
                            {count}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Skin Type Section */}
      {skinTypes.length > 0 && (
        <div className="border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
          <button 
            onClick={() => toggleSection('skinType')} 
            className="w-full flex justify-between items-center font-black text-[#121214] dark:text-[#FAF9F6] uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Feather className="size-3.5 text-[#C5A880]" />
              Skin Type
              {selectedSkinTypes.length > 0 && (
                <span className="size-4 rounded-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] text-[9px] flex items-center justify-center font-bold">
                  {selectedSkinTypes.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-[#6E6D7A] transition-transform duration-300 ${openSections.skinType ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.skinType && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-1">
                  {skinTypes.map((st) => {
                    const isSelected = selectedSkinTypes.includes(st.toLowerCase());
                    return (
                      <button
                        key={st}
                        onClick={() => onSkinTypeChange(st.toLowerCase())}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          isSelected 
                            ? 'bg-[#0D0D0D] dark:bg-[#FAF9F6] border-[#0D0D0D] dark:border-[#FAF9F6] text-white dark:text-[#0D0D0D] shadow-md scale-105' 
                            : 'bg-white dark:bg-[#18181B] border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6]'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 5. Key Ingredients Section */}
      {ingredients.length > 0 && (
        <div className="border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
          <button 
            onClick={() => toggleSection('ingredients')} 
            className="w-full flex justify-between items-center font-black text-[#121214] dark:text-[#FAF9F6] uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Tag className="size-3.5 text-[#C5A880]" />
              Ingredients
              {selectedIngredients.length > 0 && (
                <span className="size-4 rounded-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] text-[9px] flex items-center justify-center font-bold">
                  {selectedIngredients.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-[#6E6D7A] transition-transform duration-300 ${openSections.ingredients ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.ingredients && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ingredients.map((ing) => {
                    const isSelected = selectedIngredients.includes(ing.toLowerCase());
                    return (
                      <button
                        key={ing}
                        onClick={() => onIngredientChange(ing.toLowerCase())}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                          isSelected 
                            ? 'bg-[#FAF9F6] dark:bg-[#2A2A2E] border-[#C5A880] text-[#121214] dark:text-[#FAF9F6] font-black' 
                            : 'bg-white dark:bg-[#18181B] border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6]'
                        }`}
                      >
                        {ing}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Editorial Luxury Banner */}
      <div className="relative rounded-[2rem] bg-[#0D0D0D] p-6 text-white overflow-hidden shadow-xl border border-[#2A2A2E] group">
         <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-[#C5A880] mb-3">Atelier Exclusive</span>
            <h4 className="font-black text-lg mb-2 leading-tight tracking-tight">Pure Formulation</h4>
            <p className="text-[11px] text-[#FAF9F6]/80 font-medium">Bespoke luxury skincare filtered by clean active ingredients.</p>
         </div>
         <div className="absolute -bottom-10 -right-10 size-36 bg-[#C5A880]/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
      </div>
    </div>
  );

  if (isMobile) {
    return sidebarContent;
  }

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-28 bg-white dark:bg-[#18181B] backdrop-blur-xl p-6 rounded-[2.5rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/5 dark:shadow-none transition-colors duration-300">
        {sidebarContent}
      </div>
    </aside>
  );
};

export default FilterSidebar;
