import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const WishlistButton = ({ product, className = '' }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const active = isInWishlist(product._id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }

    if (busy) return;
    setBusy(true);
    try {
      await toggleWishlist(product);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`size-10 rounded-full flex items-center justify-center transition-all bg-white shadow-lg border border-gray-100 ${
        active ? 'text-pink-600' : 'text-gray-400'
      } hover:scale-110 active:scale-90 disabled:opacity-50 ${className}`}
    >
      <Heart className={`size-5 ${active ? 'fill-current' : ''} ${busy ? 'animate-pulse' : ''}`} />
    </button>
  );
};

export default WishlistButton;
