import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  Navigation,
  ShieldCheck,
  Search,
  Star,
  Activity
} from 'lucide-react';
import api from '../services/api';
import Loader from '../components/ui/Loader';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError('Order not found or access denied');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
           <div className="size-20 bg-white rounded-full flex items-center justify-center mx-auto text-red-500 shadow-sm">
              <Search className="size-10" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Order Not Found</h2>
           <p className="text-gray-400 text-sm font-medium">We couldn't track that order ID. Please double check correctly.</p>
           <Link to="/orders" className="block w-full bg-gray-900 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-black transition-all">Go to My Orders</Link>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { status: 'Confirmed', icon: ShieldCheck, label: 'Order Confirmed', date: order.createdAt },
    { status: 'Packed', icon: Package, label: 'Packed', date: order.trackingData?.packedAt },
    { status: 'Shipped', icon: Truck, label: 'Shipped', date: order.trackingData?.shippedAt },
    { status: 'Out for Delivery', icon: Navigation, label: 'Out for Delivery', date: order.trackingData?.outForDeliveryAt },
    { status: 'Delivered', icon: CheckCircle2, label: 'Delivered', date: order.deliveredAt },
  ];

  const currentStatusIndex = trackingSteps.findIndex(s => s.status === order.orderStatus);
  const progressPercentage = ((currentStatusIndex) / (trackingSteps.length - 1)) * 100;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-5xl py-12 space-y-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <Link to="/orders" className="flex items-center gap-2 text-pink-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                 <ChevronLeft className="size-4" />
                 Back to History
              </Link>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Track Order <span className="text-pink-600">.</span></h1>
           </div>
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
              <p className="text-xs font-black text-gray-900 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Timeline */}
          <div className="lg:col-span-2 space-y-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/50"
             >
                <div className="flex items-center justify-between mb-16">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-600">Estimated Arrival</p>
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                        {new Date(order.trackingData?.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </h2>
                   </div>
                   <div className="size-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 relative">
                      <Activity className="size-8 animate-pulse" />
                      <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white"></div>
                   </div>
                </div>

                {/* Tracking Graph */}
                <div className="relative pb-16">
                   {/* Background Line */}
                   <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]"
                      />
                   </div>

                   {/* Timeline Points */}
                   <div className="flex justify-between relative px-2">
                      {trackingSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;

                        return (
                          <div key={index} className="flex flex-col items-center gap-4 group">
                             <motion.div 
                               initial={{ scale: 0.8, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               transition={{ delay: index * 0.1 }}
                               className={`size-12 rounded-2xl flex items-center justify-center relative transition-all duration-500 shadow-lg ${
                                 isActive 
                                 ? 'bg-pink-600 text-white shadow-pink-200' 
                                 : 'bg-white text-gray-300 border border-gray-100'
                               } ${isCurrent ? 'ring-4 ring-pink-50 scale-110 z-10' : ''}`}
                             >
                                <Icon className={`size-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                                <AnimatePresence>
                                   {isCurrent && (
                                     <motion.div 
                                       initial={{ opacity: 0, y: -10 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       className="absolute -top-10 bg-gray-900 text-white text-[8px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap uppercase tracking-widest"
                                     >
                                        Live Status
                                     </motion.div>
                                   )}
                                </AnimatePresence>
                             </motion.div>
                             <div className="text-center space-y-1">
                                <p className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                                <p className="text-[8px] font-bold text-gray-400 opacity-60">
                                   {step.date ? new Date(step.date).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                                </p>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>

                {/* Logistics Info Card */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col md:flex-row gap-8 mt-12">
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="size-10 bg-white rounded-xl flex items-center justify-center text-pink-600 shadow-sm italic font-black text-xs">
                            {order.trackingData?.dispatchCity.charAt(0)}
                         </div>
                         <div className="h-0.5 flex-1 bg-gray-200 bg-dashed relative">
                            <Navigation className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-4 text-pink-600/30 rotate-90" />
                         </div>
                         <div className="size-10 bg-white rounded-xl flex items-center justify-center text-pink-600 shadow-sm italic font-black text-xs">
                            {order.trackingData?.destinationCity.charAt(0)}
                         </div>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                         <span>{order.trackingData?.dispatchCity}</span>
                         <span>{order.trackingData?.destinationCity}</span>
                      </div>
                   </div>
                   
                   <div className="w-px bg-gray-200 hidden md:block"></div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <Truck className="size-4 text-pink-600" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{order.trackingData?.courierPartner}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Clock className="size-4 text-pink-600" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">48h Delivery Window</span>
                      </div>
                   </div>
                </div>
             </motion.div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Package Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {order.orderItems.map((item, idx) => (
                     <div key={idx} className="flex gap-4 p-4 border border-gray-50 rounded-2xl group hover:border-pink-100 transition-all">
                        <img src={item.image} alt="" className="size-16 rounded-xl object-cover bg-gray-50" />
                        <div>
                           <p className="text-xs font-black uppercase tracking-tight text-gray-900 line-clamp-1">{item.name}</p>
                           <p className="text-[10px] font-bold text-pink-600 mt-1 uppercase">Quantity: {item.qty}</p>
                           <p className="text-[10px] font-black text-gray-400 mt-1 tracking-widest uppercase">Verified Quality</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-8">
             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-50 pb-4">Shipping To</h3>
                   <div className="space-y-2">
                      <p className="text-sm font-black text-gray-900 uppercase italic">Home Delivery</p>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">
                         {order.shippingAddress.street},<br />
                         {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
                         {order.shippingAddress.country}
                      </p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-50 pb-4">Payment Status</h3>
                   <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${order.isPaid ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                         <ShieldCheck className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase tracking-tighter text-gray-900">{order.isPaid ? 'Payment Confirmed' : 'COD Active'}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.paymentMethod}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-50 pb-4">Help & Support</h3>
                   <div className="space-y-3 font-black uppercase tracking-widest text-[9px]">
                      <Link to="/support/shipping-policy" className="block text-gray-900 hover:text-pink-600 transition-colors">Shipping Questions?</Link>
                      <Link to="/contact" className="block text-gray-900 hover:text-pink-600 transition-colors">Contact Support</Link>
                   </div>
                </div>
             </div>

             <div className="bg-pink-600 p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 space-y-4">
                   <Star className="size-8 fill-white/20" />
                   <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none">Unlock Extra Perks</h4>
                   <p className="text-[10px] font-medium opacity-80 leading-relaxed">Join our Beauty Insider club and get early access to drops while tracking orders.</p>
                   <button className="bg-white text-pink-600 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Join Now</button>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
