import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import ReviewCard from '../components/product/ReviewCard';
import WishlistButton from '../components/ui/WishlistButton';
import Loader from '../components/ui/Loader';
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCcw, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(error.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment for your review');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.addReview(id, { rating: newRating, comment: newComment });
      toast.success('Thank you! Your review has been submitted.');
      setShowReviewModal(false);
      setNewComment('');
      setNewRating(5);
      fetchProduct();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
       <h2 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] mb-6 uppercase tracking-widest">Product Not Found</h2>
       <button onClick={() => navigate('/products')} className="bg-[#0D0D0D] text-[#FAF9F6] px-8 py-3 rounded-xl font-bold uppercase tracking-widest">Shop All Products</button>
    </div>
  );

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="pb-20 bg-[#FAF9F6] dark:bg-[#121214] text-[#121214] dark:text-[#FAF9F6] transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#6E6D7A] uppercase tracking-widest">
           <span onClick={() => navigate('/')} className="hover:text-[#0D0D0D] dark:hover:text-[#FAF9F6] cursor-pointer transition-colors">Home</span>
           <ChevronRight className="size-3" />
           <span onClick={() => navigate('/products')} className="hover:text-[#0D0D0D] dark:hover:text-[#FAF9F6] cursor-pointer transition-colors">Products</span>
           <ChevronRight className="size-3" />
           <span className="text-[#C5A880] font-black">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-24">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`size-20 md:size-24 rounded-2xl flex-shrink-0 border-2 overflow-hidden transition-all ${
                    selectedImage === idx ? 'border-[#0D0D0D] dark:border-[#C5A880] shadow-md scale-95' : 'border-[#EFECE6] dark:border-[#2A2A2E] hover:border-[#C5A880]/50'
                  }`}
                >
                  <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <div className="order-1 md:order-2 flex-grow aspect-[4/5] rounded-[3rem] overflow-hidden bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] relative group">
               <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={product.images?.[selectedImage]?.url || product.images?.[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
               />
               <div className="absolute top-6 right-6">
                 <WishlistButton product={product} />
               </div>
               {discount > 0 && (
                 <div className="absolute top-6 left-6 bg-[#C5A880] text-[#0D0D0D] text-xs font-black px-4 py-1.5 rounded-full shadow-lg tracking-wider">
                   {discount}% OFF
                 </div>
               )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-xs font-black text-[#C5A880] uppercase tracking-[0.3em]">{product.brand || 'Glam Luxe'}</span>
                 <div className="h-px flex-grow bg-[#EFECE6] dark:bg-[#2A2A2E] translate-y-0.5"></div>
              </div>
              <h1 className="text-4xl font-black text-[#121214] dark:text-[#FAF9F6] leading-tight mb-4 tracking-tighter uppercase">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-700 dark:text-emerald-400">
                  <span className="text-sm font-black">{product.rating || 0}</span>
                  <Star className="size-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-[#6E6D7A] uppercase tracking-widest underline cursor-pointer">{product.numReviews || 0} Ratings</span>
              </div>
            </div>

            <div className="flex items-end gap-6 border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-8">
               <div className="flex flex-col">
                  <p className="text-[10px] text-[#6E6D7A] font-bold uppercase tracking-widest mb-1">Selling Price</p>
                  <p className="text-4xl font-black text-[#121214] dark:text-[#FAF9F6]">₹{product.price}</p>
               </div>
               {product.oldPrice > product.price && (
                 <div className="flex flex-col">
                    <p className="text-[10px] text-[#6E6D7A] font-bold uppercase tracking-widest mb-1">MRP</p>
                    <p className="text-xl text-gray-400 dark:text-gray-600 line-through font-bold">₹{product.oldPrice}</p>
                 </div>
               )}
               <p className="text-xs text-[#6E6D7A] mb-1 font-medium">(Incl. of all taxes)</p>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] text-[#6E6D7A] font-bold uppercase tracking-widest mb-4">Quantity</p>
                    <div className="flex items-center bg-white dark:bg-[#18181B] rounded-2xl p-1 border border-[#EFECE6] dark:border-[#2A2A2E]">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="size-10 flex items-center justify-center hover:text-[#0D0D0D] dark:hover:text-[#C5A880] text-[#6E6D7A]"><Minus className="size-4" /></button>
                      <span className="w-12 text-center font-black text-[#121214] dark:text-[#FAF9F6]">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="size-10 flex items-center justify-center hover:text-[#0D0D0D] dark:hover:text-[#C5A880] text-[#6E6D7A]"><Plus className="size-4" /></button>
                    </div>
                  </div>
                  <div className="flex-grow">
                     <p className="text-[10px] text-[#6E6D7A] font-bold uppercase tracking-widest mb-4">Availability</p>
                     <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-2xl w-fit border border-emerald-500/20">
                        <ShieldCheck className="size-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    onClick={async () => {
                      if (!isAuthenticated) {
                        toast.error('Please login to add items to your bag');
                        navigate('/login');
                        return;
                      }
                      const success = await addToCart({ ...product, quantity });
                      if (success) {
                        toast.success('Added to bag');
                      }
                    }}
                    disabled={product.countInStock === 0}
                    className="flex-grow bg-[#0D0D0D] hover:bg-[#2A2A2E] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#0D0D0D] font-black py-5 rounded-2xl uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border border-[#0D0D0D] dark:border-[#FAF9F6] group"
                  >
                    <ShoppingBag className="size-6 text-[#C5A880]" />
                    Add to Bag
                  </button>
               </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#EFECE6] dark:border-[#2A2A2E]">
               <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#18181B] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                  <Truck className="size-5 text-[#C5A880]" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#121214] dark:text-[#FAF9F6]">Free Delivery</p>
                    <p className="text-[9px] text-[#6E6D7A] uppercase tracking-tighter">On orders above ₹299</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#18181B] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                  <RefreshCcw className="size-5 text-[#C5A880]" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#121214] dark:text-[#FAF9F6]">Easy Returns</p>
                    <p className="text-[9px] text-[#6E6D7A] uppercase tracking-tighter">7 days replacement policy</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24">
          <div className="flex border-b border-[#EFECE6] dark:border-[#2A2A2E] overflow-x-auto no-scrollbar mb-12">
            {['description', 'ingredients', 'how to use', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-12 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-[#121214] dark:text-[#FAF9F6]' : 'text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A880] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-4">
             <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{product.description}</p>
                  </motion.div>
                )}
                
                 {activeTab === 'reviews' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                     <div className="flex flex-col md:flex-row justify-between items-center bg-[#FAF9F6] dark:bg-[#18181B] p-10 rounded-[3rem] gap-8 border border-[#EFECE6] dark:border-[#2A2A2E]">
                        <div className="text-center">
                           <p className="text-6xl font-black text-[#121214] dark:text-[#FAF9F6] mb-2">{product.rating || 0}</p>
                           <div className="flex justify-center text-[#C5A880] mb-2">
                              {[1,2,3,4,5].map(i => <Star key={i} className={`size-5 ${i <= Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />)}
                           </div>
                           <p className="text-xs font-bold text-[#6E6D7A] uppercase tracking-widest">{product.numReviews || 0} Ratings</p>
                        </div>
                        <div className="flex-grow max-w-md space-y-2">
                           {[5,4,3,2,1].map(star => {
                             const totalReviews = product.reviews?.length || 0;
                             const count = product.reviews?.filter(r => Math.round(r.rating) === star).length || 0;
                             const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                             return (
                             <div key={star} className="flex items-center gap-4">
                               <span className="text-[10px] font-bold text-[#6E6D7A] w-4">{star}★</span>
                               <div className="flex-grow h-1.5 bg-white dark:bg-[#121214] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#C5A880] rounded-full" style={{ width: `${percent}%` }}></div>
                               </div>
                             </div>
                             );
                           })}
                        </div>
                        <button 
                           onClick={() => {
                             if (!isAuthenticated) {
                               toast.error('Please sign in to rate this product');
                               navigate('/login');
                             } else {
                               setShowReviewModal(true);
                             }
                           }}
                           className="bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black px-8 py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-black/10 border border-[#0D0D0D] dark:border-white hover:bg-black dark:hover:bg-white transition-all text-xs"
                        >Rate Product</button>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {product.reviews?.length > 0 ? (
                         product.reviews.map((review, idx) => (
                           <ReviewCard key={idx} review={review} />
                         ))
                       ) : (
                         <div className="col-span-full py-16 text-center border-2 border-dashed border-[#EFECE6] dark:border-[#2A2A2E] rounded-[2rem]">
                            <p className="text-[#6E6D7A] font-bold uppercase tracking-widest text-sm">No reviews yet for this product.</p>
                         </div>
                       )}
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6] rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl relative border border-[#EFECE6] dark:border-[#2A2A2E]"
            >
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 p-2 text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] transition-all"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight mb-1">Write a Review</h3>
              <p className="text-xs text-[#6E6D7A] font-medium mb-6">Share your experience with <span className="text-[#C5A880] font-bold">{product.name}</span></p>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-[#6E6D7A] uppercase tracking-widest mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 text-[#C5A880] hover:scale-125 transition-transform"
                      >
                        <Star className={`size-8 ${star <= newRating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-gray-200 dark:text-gray-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#6E6D7A] uppercase tracking-widest mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What did you like or dislike about this product?"
                    className="w-full p-4 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] bg-[#FAF9F6] dark:bg-[#121214] text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/50 text-sm focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-4 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] font-black rounded-2xl uppercase tracking-widest text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 py-4 bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white transition-all disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsPage;
