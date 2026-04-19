import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import WishlistButton from '../ui/WishlistButton';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, 1);
      toast.success('Added to collection');
    } catch (error) {
      toast.error('Failed to add to bag');
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -12 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-white dark:bg-gray-900 rounded-[3rem] p-3 md:p-4 border border-gray-50 dark:border-gray-800 shadow-soft hover:shadow-2xl transition-all duration-700 overflow-hidden"
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Elite Image Container */}
        <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-800 mb-6 group-hover:shadow-xl transition-all duration-700">
          <motion.img
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            src={product?.images?.[0]?.url || 'https://placehold.co/400x500?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
             <div className="absolute top-4 left-4 bg-rose-600 text-white text-[9px] font-black px-4 py-2 rounded-full shadow-2xl backdrop-blur-md uppercase tracking-[0.2em] z-10">
                {product.discount}% OFF
             </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 z-10">
             <WishlistButton 
               product={product} 
               className="!size-11 !rounded-[1.25rem] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl !border-white/20 shadow-2xl" 
             />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Editorial Content */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-black uppercase text-rose-600 tracking-[0.2em] px-3 py-1 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center gap-1.5">
               <Sparkles size={10} /> {product.category}
            </span>
            <div className="flex items-center text-amber-400 gap-1 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full">
               <Star className="size-3 fill-current" />
               <span className="text-[10px] font-black text-amber-600">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-sm md:text-base font-light text-gray-900 dark:text-gray-100 group-hover:text-rose-600 transition-colors line-clamp-1 mb-1 tracking-tight">
            {product.name}
          </h3>
          <p className="text-[10px] text-gray-400 line-clamp-1 mb-5 italic font-serif">
            {product.brand}
          </p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
               <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tighter">₹{product.price}</span>
               {product.discount > 0 && (
                  <span className="text-[10px] text-gray-400 line-through font-bold opacity-50">₹{Math.round(product.price * (1 + product.discount/100))}</span>
               )}
            </div>

            <button 
              onClick={handleAddToCart}
              className="size-14 bg-gray-900 dark:bg-rose-600 text-white rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-gray-200 dark:shadow-none relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
              <ShoppingBag className="size-6" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
