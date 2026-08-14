import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist from backend when user is authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistIds([]);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      const products = data.products || [];
      setWishlistItems(products);
      setWishlistIds(products.map((p) => p._id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your wishlist');
      return false;
    }
    try {
      await wishlistService.addToWishlist(product._id);
      // Optimistic update
      setWishlistItems((prev) => {
        if (prev.find((item) => item._id === product._id)) return prev;
        return [...prev, product];
      });
      setWishlistIds((prev) => {
        if (prev.includes(product._id)) return prev;
        return [...prev, product._id];
      });
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;
    try {
      await wishlistService.removeFromWishlist(productId);
      // Optimistic update
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return false;
    }
    if (isInWishlist(product._id)) {
      return removeFromWishlist(product._id);
    } else {
      return addToWishlist(product);
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    loading,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
