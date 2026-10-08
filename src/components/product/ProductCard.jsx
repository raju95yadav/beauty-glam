import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import WishlistButton from '../ui/WishlistButton';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const originalMRP = product.mrp || (product.discount > 0 
    ? Math.round(product.price * (1 + product.discount / 100)) 
    : null);

  const ratingValue = Number(product.rating || 0);
  const reviewCount = Number(product.numReviews || 0);
  const hasReviews = reviewCount > 0 || ratingValue > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (!isAuthenticated) {
      toast.error('Please login to add items to your bag');
      navigate('/login');
      return;
    }
    const success = await addToCart(product, 1);
    if (success) {
      toast.success('Added to bag');
    }
  };

  return (
    <motion.div
      layout
      className="group relative bg-white dark:bg-[#18181B] rounded-2xl md:rounded-3xl p-3 md:p-3.5 border border-[#EFECE6] dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#C5A880]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <Link to={`/product/${product._id}`} className="block flex-grow">
        {/* Luxury 3:4 Portrait Image Container */}
        <div className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-[#FAF9F6] dark:bg-[#121214] mb-3.5">
          <img
            src={product?.images?.[0]?.url || 'https://placehold.co/400x533?text=No+Image'}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <span className="bg-[#C5A880]/15 text-[#9E8055] dark:text-[#E0CFA9] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C5A880]/30 shadow-sm">
                {product.discount}% OFF
              </span>
            )}
            {isOutOfStock ? (
              <span className="bg-[#121214]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="bg-[#0D0D0D] text-[#C5A880] border border-[#C5A880]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                Only {product.stock} Left
              </span>
            ) : null}
          </div>

          {/* Top-Right Floating Wishlist Icon */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <WishlistButton 
              product={product} 
              className="size-8 md:size-9 shadow-md"
            />
          </div>

          {/* Bottom Gradient for Contrast on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Slide-Up Action Bar from Bottom of Card */}
          <div className="absolute inset-x-2.5 bottom-2.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg ${
                isOutOfStock
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-[#0D0D0D] hover:bg-[#262626] text-white dark:bg-[#FAF9F6] dark:text-[#0D0D0D] dark:hover:bg-white active:scale-95'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Quick Add to Bag'}
            >
              <ShoppingBag className="size-3.5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Quick Add'}</span>
            </button>
          </div>
        </div>

        {/* Editorial Content */}
        <div className="px-1 pt-1 pb-1">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase text-[#C5A880] tracking-wider truncate">
              {product.category || 'Beauty'}
            </span>

            {hasReviews ? (
              <div className="flex items-center gap-1 bg-[#C5A880]/10 px-2 py-0.5 rounded-full shrink-0">
                <Star className="size-3 fill-[#C5A880] text-[#C5A880]" />
                <span className="text-[11px] font-bold text-[#9E8055] dark:text-[#E0CFA9]">
                  {ratingValue.toFixed(1)}
                </span>
                {reviewCount > 0 && (
                  <span className="text-[10px] text-[#6E6D7A]">
                    ({reviewCount})
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] font-semibold text-[#9E8055] dark:text-[#E0CFA9] bg-[#C5A880]/15 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="size-2.5 text-[#C5A880]" /> New
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-[#121214] dark:text-[#FAF9F6] group-hover:text-[#C5A880] transition-colors line-clamp-1 mb-0.5">
            {product.name}
          </h3>

          {/* Brand */}
          <p className="text-[11px] text-[#6E6D7A] line-clamp-1 mb-3">
            {product.brand}
          </p>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EFECE6] dark:border-white/10">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base md:text-lg font-bold text-[#121214] dark:text-[#FAF9F6] tracking-tight">
                ₹{product.price}
              </span>
              {originalMRP && originalMRP > product.price && (
                <span className="text-xs text-[#6E6D7A] line-through">
                  ₹{originalMRP}
                </span>
              )}
            </div>

            {/* Mobile / Direct Bag Button */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isOutOfStock
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0D0D0D] hover:bg-[#262626] text-white dark:bg-[#FAF9F6] dark:text-[#0D0D0D] active:scale-90 md:opacity-0 md:group-hover:opacity-100'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
            >
              <ShoppingBag className="size-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
