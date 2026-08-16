import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Build a normalized cart item from the backend populated response
  const normalizeCartItems = (backendCart) => {
    if (!backendCart || !backendCart.cartItems) return [];
    return backendCart.cartItems.map((item) => ({
      _id: item.product?._id || item.product,
      name: item.product?.name || '',
      price: item.product?.price || item.price,
      images: item.product?.images || [],
      brand: item.product?.brand || '',
      category: item.product?.category || '',
      quantity: item.qty,
    }));
  };

  // Fetch cart from backend when authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartItems(normalizeCartItems(data));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
    } else {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your bag');
      return false;
    }
    try {
      await cartService.addToCart(product._id, quantity, product.price);
      // Optimistic update
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item._id === product._id);
        if (existingItem) {
          return prevItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add to bag');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;
    try {
      await cartService.removeFromCart(productId);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
      toast.success('Item removed from bag');
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.message || 'Failed to remove item');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return false;
    if (!isAuthenticated) return false;
    try {
      await cartService.updateCartItem(productId, quantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || 'Failed to update quantity');
      return false;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      // Even if backend fails, clear locally for checkout flow
      setCartItems([]);
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    loading,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
