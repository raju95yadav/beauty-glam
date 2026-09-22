import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const WishlistButton = ({ product, className = '' }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [justToggled, setJustToggled] = useState(false);
  const active = isAuthenticated ? isInWishlist(product._id) : false;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add or remove items from your wishlist');
      navigate('/login');
      return;
    }

    if (busy) return;
    setBusy(true);
    setJustToggled(true);
    try {
      await toggleWishlist(product);
      setTimeout(() => setJustToggled(false), 600);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={busy}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`size-9 md:size-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-md border ${
        active 
          ? 'bg-rose-50/95 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 shadow-rose-100/50 dark:shadow-none' 
          : 'bg-white/90 dark:bg-gray-900/90 text-gray-400 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 border-gray-100 dark:border-gray-800'
      } disabled:opacity-50 cursor-pointer ${className}`}
    >
      <motion.div
        animate={justToggled ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Heart 
          className={`size-4 md:size-4.5 transition-colors ${active ? 'fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400' : ''} ${busy ? 'animate-pulse' : ''}`} 
          strokeWidth={active ? 2.5 : 2}
        />
      </motion.div>
    </motion.button>
  );
};

export default WishlistButton;
