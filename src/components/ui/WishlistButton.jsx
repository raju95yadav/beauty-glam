import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const WishlistButton = ({ product, className = '' }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const active = isInWishlist(product._id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`size-10 rounded-full flex items-center justify-center transition-all bg-white shadow-lg border border-gray-100 ${
        active ? 'text-pink-600' : 'text-gray-400'
      } hover:scale-110 active:scale-90 ${className}`}
    >
      <Heart className={`size-5 ${active ? 'fill-current' : ''}`} />
    </button>
  );
};

export default WishlistButton;
