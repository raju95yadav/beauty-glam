import React from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  minPrice, 
  maxPrice, 
  onPriceChange, 
  onClearAll 
}) => {
  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-28 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 uppercase text-[11px] tracking-[0.2em]">Filters</h3>
          <button 
            onClick={onClearAll}
            className="flex items-center gap-2 text-[10px] font-black text-pink-600 uppercase tracking-widest hover:text-pink-700 transition-colors group"
          >
            <RotateCcw className="size-3 group-hover:rotate-[-45deg] transition-transform" />
            Clear All
          </button>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-[0.2em] mb-6">Categories</h4>
          <div className="space-y-3">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.toLowerCase());
              return (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer size-5 accent-pink-600 border-2 border-gray-200 rounded-xl appearance-none checked:bg-pink-600 checked:border-pink-600 bg-white transition-all cursor-pointer"
                      checked={isSelected}
                      onChange={() => onCategoryChange(cat.toLowerCase())}
                    />
                    <CheckCircle className="absolute size-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                    isSelected ? 'text-pink-600' : 'text-gray-500 group-hover:text-pink-600'
                  }`}>
                    {cat}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-[0.2em]">Price Range</h4>
            <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">₹{maxPrice}+</span>
          </div>
          <div className="space-y-6">
             <input 
               type="range" 
               min="0" 
               max="10000" 
               step="500"
               value={maxPrice || 10000}
               onChange={(e) => onPriceChange(minPrice, e.target.value)}
               className="w-full accent-pink-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
             />
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Min Price</p>
                   <p className="text-xs font-bold text-gray-900">₹{minPrice || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Price</p>
                   <p className="text-xs font-bold text-gray-900">₹{maxPrice || 10000}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="relative rounded-[2.5rem] bg-pink-600 p-8 text-white overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Flash Sale</p>
              <h4 className="font-black text-2xl mb-4 leading-tight italic">30% OFF<br />All Makeup</h4>
              <button className="bg-white text-pink-600 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Shop Now</button>
           </div>
           {/* Abstract shapes */}
           <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
           <div className="absolute -top-10 -left-10 size-24 bg-pink-400/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
