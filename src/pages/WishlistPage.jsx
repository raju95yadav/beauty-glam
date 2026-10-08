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
        <div className="bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] p-8 rounded-full mb-6 text-[#C5A880] shadow-xl shadow-black/5">
          <Heart className="size-14" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] mb-3 uppercase tracking-wider text-center">Sign In to View Wishlist</h2>
        <p className="text-[#6E6D7A] mb-8 max-w-sm text-center text-sm font-medium">Sign in to save your private beauty wishlist and access your curations across devices.</p>
        <Link to="/login" className="bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black px-10 py-4 rounded-full transition-all uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] p-8 rounded-full mb-6 text-[#C5A880] shadow-xl shadow-black/5 animate-pulse">
          <Heart className="size-14" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] mb-3 uppercase tracking-wider text-center">Your Wishlist is Empty</h2>
        <p className="text-[#6E6D7A] mb-8 max-w-sm text-center text-sm font-medium">Save iconic fragrances, formulations and luxury cosmetics here to revisit anytime.</p>
        <Link to="/products" className="bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black px-10 py-4 rounded-full transition-all uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white active:scale-95">
          Explore Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider">My Wishlist</h1>
        <span className="text-[#C5A880] font-bold bg-[#FAF9F6] dark:bg-[#2A2A2E] border border-[#EFECE6] dark:border-[#3E3E42] px-3.5 py-1 rounded-full text-xs uppercase tracking-wider">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'creation' : 'creations'}
        </span>
      </div>

      <div className="bg-white dark:bg-[#18181B] rounded-[2.5rem] p-6 md:p-10 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/5 dark:shadow-none transition-colors duration-300">
        <ProductGrid products={wishlistItems} loading={false} />
      </div>

      <div className="mt-12 text-center">
         <Link to="/products" className="inline-flex items-center gap-2 text-[#121214] dark:text-[#FAF9F6] hover:text-[#C5A880] font-black text-xs uppercase tracking-widest hover:gap-3 transition-all group">
           Back to Shopping <ArrowRight className="size-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
};

export default WishlistPage;
