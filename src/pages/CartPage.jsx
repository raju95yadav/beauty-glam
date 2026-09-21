import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import { AnimatePresence } from 'framer-motion';
import CartItem from '../components/cart/CartItem';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return <Loader fullScreen />;

  const shipping = cartTotal > 299 ? 0 : 50;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="bg-pink-50 dark:bg-rose-950/40 p-10 rounded-full mb-8 text-pink-600 dark:text-rose-400 animate-bounce">
          <ShoppingBag className="size-20" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-center">Your Bag is Empty!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm text-center font-medium">Add something beautiful to your bag and start your glam journey with Nykaa Clone.</p>
        <Link to="/products" className="bg-pink-600 text-white font-black px-12 py-4 rounded-2xl hover:bg-pink-700 transition-all uppercase tracking-widest shadow-2xl shadow-pink-100 dark:shadow-none transform active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Shopping Bag</h1>
        <span className="text-pink-600 dark:text-rose-400 font-bold bg-pink-50 dark:bg-rose-950/40 px-3 py-1 rounded-full text-sm">({cartItems.length})</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Cart Items List */}
        <div className="flex-grow w-full space-y-6">
          <AnimatePresence>
            {cartItems.map((item) => (
              <CartItem 
                key={item._id} 
                item={item} 
                onUpdateQuantity={updateQuantity} 
                onRemove={removeFromCart} 
              />
            ))}
          </AnimatePresence>
          
          <div className="flex justify-between items-center py-6 border-t border-gray-100 dark:border-gray-800 mt-8">
            <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-pink-600 dark:hover:text-rose-400 transition-all">
              <ArrowRight className="size-4 rotate-180" /> Continue Shopping
            </Link>
            <button 
              onClick={() => { if (window.confirm('Are you sure you want to clear your entire bag?')) { clearCart(); toast.success('Bag cleared'); } }}
              className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Sticky Detail Sidebar */}
        <aside className="lg:w-[400px] w-full flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-100 dark:shadow-none sticky top-40 transition-colors duration-300">
            <div className="mb-8">
               <h3 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-sm border-b border-gray-100 dark:border-gray-800 pb-4">Order Summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Bag Subtotal</span>
                     <span className="text-base font-bold text-gray-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Estimated Shipping</span>
                     {shipping === 0 ? (
                       <span className="text-green-600 dark:text-emerald-400 font-black uppercase text-[10px] bg-green-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">Free</span>
                     ) : (
                       <span className="text-base font-bold text-gray-900 dark:text-white">₹{shipping}</span>
                     )}
                  </div>
               </div>
            </div>

            {/* Coupons */}
            <div className="bg-gray-50 dark:bg-gray-800/70 rounded-2xl p-4 mb-8 border border-gray-100 dark:border-gray-750">
              <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Have a coupon?</span>
                 <button className="text-[10px] font-black text-pink-600 dark:text-rose-400 uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Code" 
                  className="flex-grow px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold uppercase text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="bg-gray-900 dark:bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Apply</button>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10 pt-4 border-t border-gray-100 dark:border-gray-800">
               <div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="text-3xl font-black text-pink-600 dark:text-rose-500">₹{total}</p>
               </div>
               <div className="text-right">
                  {cartTotal > 299 && <p className="text-[10px] text-green-600 dark:text-emerald-400 font-black uppercase tracking-widest">Free Shipping Applied!</p>}
               </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-pink-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-pink-700 transition-all uppercase tracking-widest shadow-2xl shadow-pink-100 dark:shadow-none group"
            >
              Checkout Now
              <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
            </Link>

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
               <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                 <ShieldCheck className="size-4 text-green-500" /> Secure Payments
               </div>
               <div className="flex gap-6 grayscale opacity-40">
                  <img src="https://checkout.razorpay.com/v1/logo.png" className="h-4" alt="Razorpay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
