import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/ui/Loader';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="bg-rose-50 dark:bg-rose-950/40 p-8 rounded-full mb-6 text-rose-600 dark:text-rose-400 shadow-inner">
          <Heart className="size-16" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wider text-center">Login to See Your Wishlist</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center text-sm font-medium">Sign in to save your favorite beauty products and access them from any device.</p>
        <Link to="/login" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-10 py-3.5 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-rose-200 dark:shadow-none transform active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="bg-rose-50 dark:bg-rose-950/40 p-8 rounded-full mb-6 text-rose-600 dark:text-rose-400 animate-pulse shadow-inner">
          <Heart className="size-16" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-wider text-center">Your Wishlist is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center text-sm font-medium">Save items you love here and they'll be waiting for you when you're ready to sparkle.</p>
        <Link to="/products" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-10 py-3.5 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-rose-200 dark:shadow-none transform active:scale-95">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wider">My Wishlist</h1>
        <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full text-xs">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <ProductGrid products={wishlistItems} loading={false} />
      </div>

      <div className="mt-10 text-center">
         <Link to="/products" className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all group">
           Back to Shopping <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
};

export default WishlistPage;
