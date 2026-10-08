import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import Loader from '../components/ui/Loader';
import { 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  Truck, 
  AlertCircle,
  Smartphone,
  Banknote,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Payment Components
import CardForm from '../components/checkout/CardForm';
import UPIForm from '../components/checkout/UPIForm';
import CODOption from '../components/checkout/CODOption';
import SuccessModal from '../components/checkout/SuccessModal';
import AddressModal from '../components/checkout/AddressModal';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { loadRazorpayScript } from '../utils/razorpay';
import paymentService from '../services/paymentService';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [error, setError] = useState(null);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay', 'cod'
  const [isPaymentValid, setIsPaymentValid] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  const shipping = cartTotal > 299 ? 0 : 50;
  const total = cartTotal + shipping;

  useEffect(() => {
    if (cartItems.length === 0 && !loading && !showSuccess) {
      navigate('/cart');
    }

    // Initialize addresses from user profile
    if (user) {
      const initialAddresses = [];
      if (user.address) {
        // Try to parse structured address or use as is
        try {
          const parsed = JSON.parse(user.address);
          if (Array.isArray(parsed)) {
            initialAddresses.push(...parsed);
          } else {
            initialAddresses.push(parsed);
          }
        } catch (e) {
          // Fallback for simple string address
          initialAddresses.push({
            name: user.name || 'Default Name',
            street: user.address,
            city: '',
            state: '',
            zip: '',
            phone: user.phone || '',
            country: 'India',
            label: 'Saved Address'
          });
        }
      }
      setAddresses(initialAddresses);
    }
  }, [cartItems, loading, navigate, showSuccess, user]);

  const handleSaveAddress = async (newAddress) => {
    try {
      setLoading(true);
      const updatedAddresses = [...addresses, { ...newAddress, label: addresses.length === 0 ? 'Home' : 'Work' }];
      
      // Update User Profile
      await updateUser({
        address: JSON.stringify(updatedAddresses),
        phone: newAddress.phone
      });

      setAddresses(updatedAddresses);
      setSelectedAddressIndex(updatedAddresses.length - 1);
      toast.success('Address saved successfully!');
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error('Failed to save address to profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!addresses || addresses.length === 0) {
      toast.error('Please add a shipping address first.');
      setStep(1);
      return;
    }

    // Pre-flight stock check on cart items
    for (const item of cartItems) {
      if (typeof item.stock === 'number') {
        if (item.stock === 0) {
          const msg = `"${item.name}" is OUT OF STOCK. Please remove it from your bag.`;
          toast.error(msg);
          setError(msg);
          return;
        }
        if (item.quantity > item.stock) {
          const msg = `Only ${item.stock} units of "${item.name}" available in stock. You requested ${item.quantity}. Please update your bag.`;
          toast.error(msg);
          setError(msg);
          return;
        }
      }
    }

    const selectedAddress = addresses[selectedAddressIndex] || {
      street: user?.address || 'Street address',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      country: 'India',
      phone: user?.phone || '9999999999'
    };

    const orderPayload = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.images?.[0]?.url || item.images?.[0],
        price: item.price,
        product: item._id
      })),
      shippingAddress: {
        street: selectedAddress.street,
        city: selectedAddress.city || 'Mumbai',
        state: selectedAddress.state || 'Maharashtra',
        zip: selectedAddress.zip || '400001',
        country: selectedAddress.country || 'India'
      },
      itemsPrice: cartTotal,
      shippingPrice: shipping,
      taxPrice: 0,
      totalPrice: total,
      amount: total
    };

    // --- Path A: Razorpay Sandbox Payment ---
    if (paymentMethod === 'razorpay') {
      try {
        setPaymentLoading(true);
        setError(null);

        // 1. Ensure Razorpay SDK script is loaded
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error('Unable to load Razorpay checkout script. Please check your network.');
          setPaymentLoading(false);
          return;
        }

        // 2. Call backend to create Razorpay Order & Initialize Pending DB Order
        const orderRes = await paymentService.createRazorpayOrder(orderPayload);

        if (!orderRes.success) {
          throw new Error(orderRes.message || 'Failed to initiate Razorpay order');
        }

        // 3. Initialize Razorpay Modal Options
        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency || 'INR',
          name: 'Glam Beauty',
          description: 'Luxury Boutique Cosmetics Order',
          order_id: orderRes.orderId,
          prefill: {
            name: selectedAddress.name || user?.name || 'Customer',
            email: user?.email || '',
            contact: selectedAddress.phone || user?.phone || '9999999999'
          },
          theme: {
            color: '#0D0D0D' // Parisian Onyx Luxury CTA
          },
          handler: async function (response) {
            try {
              setPaymentLoading(true);
              setShowSuccess(true);

              // 4. Verify Payment Signature on backend
              const verifyRes = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderRes.dbOrderId
              });

              if (verifyRes.success) {
                toast.success('Payment verified successfully!');
                clearCart();
                try { console.clear(); } catch (e) {}
                setTimeout(() => {
                  navigate(`/order-success?orderId=${orderRes.dbOrderId}`);
                }, 1500);
              } else {
                setShowSuccess(false);
                toast.error(verifyRes.message || 'Payment verification failed');
              }
            } catch (vErr) {
              console.error('Verification error:', vErr);
              setShowSuccess(false);
              toast.error(vErr.message || 'Error verifying signature');
            } finally {
              setPaymentLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast('Payment cancelled by user', { icon: '⚠️' });
              setPaymentLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          console.error('Payment failed event:', resp.error);
          toast.error(resp.error?.description || 'Payment failed. Please retry.');
          setPaymentLoading(false);
        });

        rzp.open();
      } catch (err) {
        console.error('Razorpay checkout initiation error:', err);
        setPaymentLoading(false);
        const serverMessage = err.message || err.response?.data?.message || 'Failed to initialize payment.';
        setError(serverMessage);
        toast.error(serverMessage);
      }
      return;
    }

    // --- Path B: Cash on Delivery ---
    if (paymentMethod === 'cod') {
      try {
        setPaymentLoading(true);
        setShowSuccess(true);
        setError(null);

        const codOrderData = {
          ...orderPayload,
          paymentMethod: 'Cash on Delivery',
          isPaid: false,
          paidAt: null,
          paymentResult: { id: `COD-${Date.now()}`, status: 'PENDING' }
        };

        const createdOrder = await orderService.createOrder(codOrderData);
        setPaymentLoading(false);

        setTimeout(() => {
          clearCart();
          navigate(`/order-success?orderId=${createdOrder._id}`);
        }, 1500);
      } catch (err) {
        console.error('Error placing COD order:', err);
        setShowSuccess(false);
        setPaymentLoading(false);
        const serverMessage = err.message || err.response?.data?.message || 'Failed to place COD order.';
        setError(serverMessage);
        toast.error(serverMessage);
      }
    }
  };

  const steps = [
    { id: 1, name: 'ADDRESS' },
    { id: 2, name: 'PAYMENT' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 transition-colors duration-300">
      {loading && <Loader fullScreen />}
      <SuccessModal show={showSuccess} loading={paymentLoading} />
      <AddressModal 
        isOpen={showAddressModal} 
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />
      
      {/* Checkout Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-8 sticky top-0 z-30 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Checkout</h1>
              <div className="flex items-center gap-4 md:gap-12">
                {steps.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`size-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s.id ? 'bg-[#0D0D0D] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#0D0D0D]' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                      {s.id}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${step >= s.id ? 'text-[#121214] dark:text-[#FAF9F6]' : 'text-gray-400 dark:text-gray-500'}`}>{s.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-[#6E6D7A] uppercase tracking-widest">Total Amount</p>
                 <p className="text-sm font-black text-[#121214] dark:text-[#FAF9F6] tracking-tighter">₹{total}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-start gap-4 border border-red-200 dark:border-red-900/50 shadow-sm"
            >
              <AlertCircle className="size-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-red-700 dark:text-red-300">Stock & Order Alert</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400 leading-snug">{error}</p>
              </div>
            </motion.div>
          )}

          {step === 1 ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white dark:bg-[#18181B] rounded-[3rem] p-10 md:p-14 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-stone-200/50 dark:shadow-none transition-colors duration-300"
             >
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tighter flex items-center gap-4">
                    <div className="size-12 bg-[#0D0D0D] text-[#C5A880] rounded-2xl flex items-center justify-center">
                      <MapPin className="size-6" />
                    </div>
                    Shipping Location
                  </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                   {addresses.map((addr, idx) => (
                     <div 
                       key={idx}
                       onClick={() => setSelectedAddressIndex(idx)}
                       className={`p-8 border-2 rounded-[2.5rem] relative transition-all group cursor-pointer shadow-lg ${
                         selectedAddressIndex === idx 
                         ? 'border-[#0D0D0D] dark:border-[#C5A880] bg-[#FAF9F6] dark:bg-[#121214]' 
                         : 'border-[#EFECE6] dark:border-[#2A2A2E] hover:border-[#C5A880]/50 bg-white dark:bg-[#18181B]'
                       }`}
                     >
                       <div className="absolute top-6 right-6 text-[#C5A880] bg-white dark:bg-[#18181B] rounded-full p-2 ring-1 ring-[#C5A880]/40 shadow-md">
                         {selectedAddressIndex === idx ? <ShieldCheck className="size-5" /> : <div className="size-5 rounded-full border border-gray-200 dark:border-gray-700" />}
                       </div>
                       <div className="space-y-1 mb-6">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedAddressIndex === idx ? 'text-[#C5A880]' : 'text-[#6E6D7A]'}`}>
                            {addr.label || 'Saved Address'}
                          </p>
                          <p className="text-xl font-bold text-[#121214] dark:text-[#FAF9F6]">{addr.name || 'Recipient'}</p>
                       </div>
                       <p className="text-sm text-[#6E6D7A] dark:text-stone-400 mb-6 leading-relaxed font-medium">
                         {addr.street}, {addr.city},<br />
                         {addr.state} - {addr.zip}, {addr.country || 'India'}
                       </p>
                       <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-widest bg-white/80 dark:bg-zinc-800 inline-block px-3 py-1.5 rounded-lg border border-[#EFECE6] dark:border-[#2A2A2E]">
                         {addr.phone}
                       </p>
                     </div>
                   ))}

                   <button 
                     onClick={() => setShowAddressModal(true)}
                     className="p-8 border-2 border-dashed border-[#EFECE6] dark:border-[#2A2A2E] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#0D0D0D] dark:hover:text-[#FAF9F6] transition-all group bg-[#FAF9F6]/50 dark:bg-[#121214]/50 min-h-[250px]"
                   >
                     <div className="size-14 rounded-full bg-white dark:bg-[#18181B] flex items-center justify-center group-hover:border-[#C5A880] shadow-sm border border-[#EFECE6] dark:border-[#2A2A2E] transition-all">
                       <span className="text-3xl font-light text-[#6E6D7A] group-hover:text-[#C5A880]">+</span>
                     </div>
                     <span className="text-xs font-black uppercase tracking-[0.2em]">Add New Address</span>
                   </button>
                </div>

               <button 
                 onClick={() => {
                   if (addresses.length === 0) {
                     toast.error('Please add a shipping address');
                     return;
                   }
                   setStep(2);
                 }}
                 className="w-full bg-[#0D0D0D] hover:bg-[#2A2A2E] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#0D0D0D] font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all uppercase tracking-widest shadow-2xl active:scale-[0.98] border border-[#0D0D0D] dark:border-[#FAF9F6]"
               >
                 Proceed to Payment
                 <ChevronRight className="size-5 text-[#C5A880]" />
               </button>
             </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white dark:bg-[#18181B] rounded-[3rem] p-8 md:p-14 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-stone-200/50 dark:shadow-none transition-colors duration-300"
             >
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tighter flex items-center gap-4">
                    <div className="size-12 bg-[#0D0D0D] text-[#C5A880] rounded-2xl flex items-center justify-center">
                      <CreditCard className="size-6" />
                    </div>
                    Payment Gateway
                  </h2>
                  <button onClick={() => setStep(1)} className="text-[#6E6D7A] hover:text-[#0D0D0D] dark:hover:text-[#FAF9F6] text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-2 transition-colors">Back to Address</button>
               </div>

                {/* Security Trust Banner */}
                <div className="mb-8 p-4 bg-emerald-50/80 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                         <ShieldCheck className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-emerald-950 dark:text-emerald-300 uppercase tracking-wider">Razorpay Sandbox Gateway</p>
                         <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">PCI-DSS Level 1 Compliant • 256-Bit SSL Encryption</p>
                      </div>
                   </div>
                   <span className="hidden sm:inline-block px-3 py-1 bg-white dark:bg-[#18181B] text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-xs">
                      Test Mode Active
                   </span>
                </div>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 p-2 bg-[#FAF9F6] dark:bg-[#121214] rounded-[2rem] gap-2 mb-10 border border-[#EFECE6] dark:border-[#2A2A2E]">
                   {[
                     { id: 'razorpay', name: 'Razorpay Online', subtitle: 'UPI / Cards / Netbanking', icon: CreditCard },
                     { id: 'cod', name: 'Cash on Delivery', subtitle: 'Pay when delivered', icon: Banknote },
                   ].map((tab) => (
                     <button
                       key={tab.id}
                       onClick={() => {
                         setPaymentMethod(tab.id);
                         setIsPaymentValid(true);
                       }}
                       className={`flex flex-col sm:flex-row items-center justify-center gap-3 px-6 py-4 rounded-[1.5rem] transition-all text-center sm:text-left ${
                         paymentMethod === tab.id 
                         ? 'bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6] shadow-md border border-[#C5A880]' 
                         : 'text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6]'
                       }`}
                     >
                       <tab.icon className="size-5 shrink-0 text-[#C5A880]" />
                       <div>
                         <p className="text-[11px] font-black uppercase tracking-[0.15em]">{tab.name}</p>
                         <p className="text-[9px] font-bold text-[#6E6D7A] uppercase tracking-wider hidden sm:block">{tab.subtitle}</p>
                       </div>
                     </button>
                   ))}
                </div>

                {/* Payment Method Content */}
                <div className="mb-10">
                   <AnimatePresence mode="wait">
                      {paymentMethod === 'razorpay' && (
                         <motion.div 
                           key="razorpay" 
                           initial={{ opacity: 0, y: 10 }} 
                           animate={{ opacity: 1, y: 0 }} 
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-6">
                                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm space-y-6">
                               <div className="flex items-center justify-between border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
                                  <div>
                                     <span className="text-[10px] font-black text-[#C5A880] uppercase tracking-widest block mb-1">Standard Gateway</span>
                                     <h3 className="text-xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">Razorpay Instant Checkout</h3>
                                  </div>
                                  <div className="px-3 py-1.5 bg-[#C5A880]/15 text-[#C5A880] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#C5A880]/30">
                                     Zero Surcharge
                                  </div>
                               </div>

                               <p className="text-sm text-[#6E6D7A] dark:text-stone-300 leading-relaxed font-medium">
                                  Clicking <span className="font-bold text-[#121214] dark:text-[#FAF9F6]">"Pay Now"</span> will launch Razorpay's secure checkout modal supporting:
                                </p>

                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  <div className="p-3 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xs text-center space-y-1">
                                     <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6]">UPI</p>
                                     <p className="text-[9px] text-[#6E6D7A] font-bold uppercase">GPay, PhonePe, Paytm</p>
                                  </div>
                                  <div className="p-3 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xs text-center space-y-1">
                                     <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6]">Cards</p>
                                     <p className="text-[9px] text-[#6E6D7A] font-bold uppercase">Visa, MC, RuPay</p>
                                  </div>
                                  <div className="p-3 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xs text-center space-y-1">
                                     <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6]">Net Banking</p>
                                     <p className="text-[9px] text-[#6E6D7A] font-bold uppercase">50+ Major Banks</p>
                                  </div>
                                  <div className="p-3 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xs text-center space-y-1">
                                     <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6]">Wallets</p>
                                     <p className="text-[9px] text-[#6E6D7A] font-bold uppercase">Paytm, Mobikwik</p>
                                  </div>
                               </div>

                               <div className="p-4 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] flex items-center justify-between text-[11px] text-[#6E6D7A] font-medium">
                                  <span>Automated PDF Tax Invoice</span>
                                  <span className="text-[#C5A880] font-bold">Generated upon payment</span>
                                </div>
                            </div>
                         </motion.div>
                      )}

                      {paymentMethod === 'cod' && (
                         <motion.div 
                           key="cod" 
                           initial={{ opacity: 0, y: 10 }} 
                           animate={{ opacity: 1, y: 0 }} 
                           exit={{ opacity: 0, y: -10 }}
                         >
                            <CODOption onValidChange={(v) => setIsPaymentValid(v)} />
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={!isPaymentValid || paymentLoading}
                  className="w-full bg-[#0D0D0D] hover:bg-[#2A2A2E] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#0D0D0D] font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] disabled:opacity-30 disabled:scale-[0.98] border border-[#0D0D0D] dark:border-[#FAF9F6]"
                >
                  {paymentLoading ? (
                     <>
                        <div className="size-5 border-2 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin" />
                        <span>Processing Order...</span>
                     </>
                  ) : paymentMethod === 'razorpay' ? (
                     <>
                        <span>Pay Now ₹{total}</span>
                        <ShieldCheck className="size-6 text-[#C5A880]" />
                     </>
                  ) : (
                     <>
                        <span>Confirm Order (COD) ₹{total}</span>
                        <ShieldCheck className="size-6 text-[#C5A880]" />
                     </>
                  )}
                </button>
                
                <p className="text-center mt-8 text-[#6E6D7A] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                   <ShieldCheck className="size-3.5 text-emerald-500" />
                   Razorpay Secure • 256-bit SSL Encryption • RBI Authorized
                </p>
             </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="space-y-8 sticky top-32 h-fit">
           <div className="bg-white dark:bg-[#18181B] p-10 rounded-[3rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-gray-200/50 dark:shadow-none transition-colors duration-300">
             <h3 className="text-sm font-black text-[#121214] dark:text-[#FAF9F6] mb-8 uppercase tracking-[0.3em] border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6 italic">Checkout Summary</h3>
             <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar mb-8 pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-6 group">
                    <div className="size-16 rounded-2xl bg-[#FAF9F6] dark:bg-[#121214] overflow-hidden flex-shrink-0 border border-[#EFECE6] dark:border-[#2A2A2E] group-hover:scale-105 transition-all">
                      <img src={item.images?.[0]?.url || item.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] line-clamp-1 uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-widest">{item.brand?.name}</p>
                      <p className="text-[10px] font-black text-[#C5A880]">QTY: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] whitespace-nowrap pt-1">₹{item.price * item.quantity}</p>
                  </div>
                ))}
             </div>

             <div className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-t border-[#EFECE6] dark:border-[#2A2A2E] pt-8 text-[#6E6D7A]">
                <div className="flex justify-between">
                   <span>Bag Subtotal</span>
                   <span className="text-[#121214] dark:text-[#FAF9F6]">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                   <span>Shipping Fee</span>
                   <span className={shipping === 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-[#121214] dark:text-[#FAF9F6]"}>{shipping === 0 ? 'WAIVED OFF' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between items-center bg-[#FAF9F6] dark:bg-[#121214] -mx-4 px-4 py-4 rounded-2xl mt-4 border border-[#EFECE6] dark:border-[#2A2A2E]">
                   <span className="text-[#121214] dark:text-[#FAF9F6] text-[11px]">Total Tax</span>
                   <span className="text-[#6E6D7A] text-[11px]">Included</span>
                </div>
             </div>

             <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] font-black text-[#6E6D7A] uppercase tracking-[0.3em]">Total Payable</p>
                <div className="text-right">
                   <span className="text-3xl font-black text-[#121214] dark:text-[#FAF9F6] tracking-tighter italic block">₹{total}</span>
                </div>
             </div>
           </div>

           <div className="bg-white dark:bg-[#18181B] p-8 rounded-[2.5rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-lg shadow-gray-100/50 dark:shadow-none space-y-4 transition-colors duration-300">
              <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400">
                 <Truck className="size-6 text-[#C5A880]" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest italic leading-none mb-1 text-emerald-700 dark:text-emerald-400">Express Delivery</p>
                    <p className="text-[11px] font-bold text-[#6E6D7A] tracking-tight">Estimated delivery in 3–5 business days</p>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
