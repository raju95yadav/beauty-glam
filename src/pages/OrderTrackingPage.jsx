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
  Activity,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Box,
  FileText,
  HelpCircle,
  Download
} from 'lucide-react';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import Loader from '../components/ui/Loader';
import { toast } from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderTracking(id);
      setTrackingData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tracking:', err);
      setError(err.response?.data?.message || 'Order tracking not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const handleCopyTrackingNumber = () => {
    if (trackingData?.trackingNumber) {
      navigator.clipboard.writeText(trackingData.trackingNumber);
      setCopied(true);
      toast.success('Tracking code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInvoice = async () => {
    const targetOrderId = trackingData?.orderId || id;
    if (!targetOrderId) return;
    try {
      setDownloadingInvoice(true);
      toast.loading('Generating your official PDF tax invoice...', { id: 'invoice-gen' });
      await paymentService.downloadInvoice(targetOrderId);
      toast.success('Invoice downloaded successfully!', { id: 'invoice-gen' });
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error('Failed to download invoice. Please try again.', { id: 'invoice-gen' });
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121214] flex items-center justify-center p-4 transition-colors duration-300">
        <div className="text-center space-y-6 max-w-sm">
           <div className="size-20 bg-red-50 dark:bg-red-950/40 rounded-3xl flex items-center justify-center mx-auto text-red-500 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-900/50">
              <Search className="size-10" />
           </div>
           <h2 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tighter">Order Not Found</h2>
           <p className="text-[#6E6D7A] text-xs font-medium leading-relaxed">{error || "We could not find tracking records for that identifier. Please verify and try again."}</p>
           <div className="space-y-3">
             <button onClick={fetchTracking} className="w-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black py-3.5 rounded-full uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
               <RefreshCw className="size-3.5 animate-spin text-[#C5A880]" /> Retry Tracking
             </button>
             <Link to="/orders" className="block w-full bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] font-black py-3.5 rounded-full uppercase tracking-widest text-[10px] transition-all text-center">Back to Orders</Link>
           </div>
        </div>
      </div>
    );
  }

  const {
    orderId,
    trackingNumber,
    orderStatus,
    isCancelled,
    cancelledAt,
    estimatedDelivery,
    courierPartner,
    dispatchCity,
    destinationCity,
    stages = [],
    activeIndex = 0,
    progressPercentage = 0,
    statusLogs = [],
    orderItems = [],
    shippingAddress,
    paymentMethod,
    isPaid,
    totalPrice
  } = trackingData;

  const stageIcons = {
    'Order Placed': ShieldCheck,
    'Processing': Clock,
    'Packed': Box,
    'Shipped': Truck,
    'Out for Delivery': Navigation,
    'Delivered': CheckCircle2
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen pb-24 border-t border-[#EFECE6] dark:border-[#2A2A2E] transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-5xl py-8 md:py-12 space-y-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <Link to="/orders" className="flex items-center gap-2 text-[#121214] dark:text-[#FAF9F6] font-black text-[10px] uppercase tracking-widest hover:text-[#C5A880] transition-colors">
                 <ChevronLeft className="size-4 text-[#C5A880]" />
                 Back to Order History
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">
                Track Order <span className="text-[#C5A880]">.</span>
              </h1>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white dark:bg-[#18181B] px-5 py-2.5 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm flex items-center gap-3">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6E6D7A]">Order Ref</p>
                    <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] font-mono">#{orderId.substring(orderId.length - 8).toUpperCase()}</p>
                 </div>
              </div>

              <div className="bg-white dark:bg-[#18181B] px-5 py-2.5 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm flex items-center gap-3">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6E6D7A]">Tracking Code</p>
                    <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] font-mono">{trackingNumber}</p>
                 </div>
                 <button 
                   onClick={handleCopyTrackingNumber}
                   className="p-1.5 rounded-lg bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#C5A880] hover:text-[#121214] dark:hover:text-white transition-colors cursor-pointer"
                   title="Copy Tracking Number"
                 >
                   {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                 </button>
              </div>

              <button
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] px-5 py-2.5 rounded-full border border-[#0D0D0D] dark:border-white shadow-sm flex items-center gap-2.5 transition-all text-xs font-black uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                title="Download PDF Tax Invoice"
              >
                {downloadingInvoice ? (
                  <div className="size-3.5 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="size-4 text-[#C5A880]" />
                )}
                <span>Invoice (PDF)</span>
              </button>
           </div>
        </div>

        {/* Cancellation Alert Banner */}
        {isCancelled ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 dark:bg-red-900/80 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-red-400/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          >
             <div className="flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                   <AlertTriangle className="size-8 text-white" />
                </div>
                <div className="space-y-1">
                   <span className="px-3 py-1 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Order Status</span>
                   <h2 className="text-2xl font-black uppercase tracking-tight">This Order Has Been Cancelled</h2>
                   <p className="text-xs text-red-100 font-medium">
                     Cancelled on {cancelledAt ? new Date(cancelledAt).toLocaleString() : 'Recent'}. Stock has been restored and any pending payments are reversed.
                   </p>
                </div>
             </div>
             <Link 
               to="/products"
               className="bg-white text-red-600 dark:bg-black dark:text-red-400 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shrink-0 shadow-lg"
             >
               Re-Order Items
             </Link>
          </motion.div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Timeline */}
          <div className="lg:col-span-2 space-y-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white dark:bg-[#18181B] rounded-[3rem] p-8 md:p-12 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/5 dark:shadow-none space-y-12 transition-colors duration-300"
             >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EFECE6] dark:border-[#2A2A2E]">
                   <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A880] flex items-center gap-2">
                        <Clock className="size-3.5" /> Estimated Delivery Arrival
                      </p>
                      <h2 className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">
                        {new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h2>
                   </div>
                   
                   <div className="flex items-center gap-3 bg-[#FAF9F6] dark:bg-[#121214] px-4 py-2.5 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                      <div className="size-3 rounded-full bg-emerald-500 animate-ping"></div>
                      <div>
                        <p className="text-[9px] font-black text-[#6E6D7A] uppercase tracking-widest">Current Status</p>
                        <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider">{orderStatus}</p>
                      </div>
                   </div>
                </div>

                {/* Multi-Step Visual Progress Bar */}
                <div className="relative pt-6 pb-8">
                   {/* Background Track Line */}
                   <div className="absolute top-11 left-6 right-6 h-2 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-full overflow-hidden z-0">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isCancelled ? '0%' : `${progressPercentage}%` }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="h-full bg-[#C5A880] shadow-md"
                      />
                   </div>

                   {/* Timeline Step Nodes */}
                   <div className="grid grid-cols-6 relative z-10 text-center">
                      {stages.map((stage, idx) => {
                        const Icon = stageIcons[stage.key] || Package;
                        const isCompleted = !isCancelled && idx <= activeIndex;
                        const isCurrent = !isCancelled && idx === activeIndex;

                        return (
                          <div key={idx} className="flex flex-col items-center group relative">
                             {/* Floating Current Badge */}
                             <AnimatePresence>
                                {isCurrent && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute -top-10 bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] text-[8px] font-black px-2.5 py-1 rounded-full whitespace-nowrap uppercase tracking-widest shadow-md z-20"
                                  >
                                     Active Stage
                                  </motion.div>
                                )}
                             </AnimatePresence>

                             <motion.div 
                               initial={{ scale: 0.8 }}
                               animate={{ scale: isCurrent ? 1.15 : 1 }}
                               className={`size-11 sm:size-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                                 isCancelled
                                  ? 'bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#6E6D7A] border border-[#EFECE6] dark:border-[#3E3E42]'
                                  : isCompleted 
                                    ? 'bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] shadow-black/10' 
                                    : 'bg-white dark:bg-[#18181B] text-[#6E6D7A] border border-[#EFECE6] dark:border-[#2A2A2E]'
                               } ${isCurrent ? 'ring-4 ring-[#C5A880]/30 shadow-xl' : ''}`}
                             >
                                <Icon className={`size-5 ${isCurrent ? 'animate-bounce text-[#C5A880]' : ''}`} />
                             </motion.div>

                             <div className="mt-3 space-y-0.5">
                                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter leading-tight ${
                                  isCompleted ? 'text-[#121214] dark:text-[#FAF9F6] font-extrabold' : 'text-[#6E6D7A]'
                                }`}>
                                   {stage.label}
                                </p>
                                {stage.date && (
                                  <p className="text-[8px] font-bold text-[#6E6D7A] hidden sm:block">
                                    {new Date(stage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                )}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>

                {/* Route & Courier Card */}
                <div className="bg-[#FAF9F6] dark:bg-[#121214] rounded-[2.5rem] p-6 md:p-8 border border-[#EFECE6] dark:border-[#2A2A2E] space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4 flex-1 w-full">
                         <div className="bg-white dark:bg-[#18181B] p-3.5 rounded-2xl shadow-sm border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] font-black text-xs flex items-center gap-2">
                            <MapPin className="size-4 text-[#C5A880]" />
                            <span>{dispatchCity}</span>
                         </div>
                         <div className="h-0.5 flex-1 bg-[#C5A880]/40 relative min-w-[50px]">
                            <Navigation className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-4 text-[#C5A880] rotate-90 animate-pulse" />
                         </div>
                         <div className="bg-white dark:bg-[#18181B] p-3.5 rounded-2xl shadow-sm border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] font-black text-xs flex items-center gap-2">
                            <MapPin className="size-4 text-[#C5A880]" />
                            <span>{destinationCity}</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white dark:bg-[#18181B] px-5 py-3 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm w-full md:w-auto">
                         <Truck className="size-5 text-[#C5A880] shrink-0" />
                         <div>
                            <p className="text-[9px] font-black text-[#6E6D7A] uppercase tracking-widest">Partner</p>
                            <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6]">{courierPartner}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Real-time Status History Logs Tree */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-3">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#121214] dark:text-[#FAF9F6] flex items-center gap-2">
                         <Activity className="size-4 text-[#C5A880]" />
                         Real-Time Tracking History
                      </h3>
                      <span className="text-[10px] font-bold text-[#6E6D7A] bg-[#FAF9F6] dark:bg-[#121214] px-3 py-1 rounded-full border border-[#EFECE6] dark:border-[#2A2A2E]">
                         {statusLogs.length} Events Recorded
                      </span>
                   </div>

                   <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EFECE6] dark:before:bg-[#2A2A2E]">
                      {statusLogs.map((log, idx) => (
                         <motion.div 
                           key={idx}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           className="relative group"
                         >
                            <div className="absolute -left-6 top-1.5 size-3.5 rounded-full bg-[#0D0D0D] dark:bg-[#FAF9F6] ring-4 ring-[#C5A880]/20"></div>
                            <div className="bg-[#FAF9F6] dark:bg-[#121214] p-4 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] hover:border-[#C5A880] transition-colors">
                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                  <h4 className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wide">{log.title || log.status}</h4>
                                  <span className="text-[10px] font-bold text-[#C5A880] font-mono">
                                     {new Date(log.timestamp).toLocaleString()}
                                  </span>
                               </div>
                               <p className="text-xs text-[#6E6D7A] font-medium mb-2">{log.description}</p>
                               {log.location && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#6E6D7A] bg-white dark:bg-[#18181B] px-2.5 py-1 rounded-lg border border-[#EFECE6] dark:border-[#2A2A2E]">
                                     <MapPin className="size-3 text-[#C5A880]" /> {log.location}
                                  </span>
                               )}
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
             </motion.div>

             {/* Package Items Card */}
             <div className="bg-white dark:bg-[#18181B] rounded-[2.5rem] p-8 border border-[#EFECE6] dark:border-[#2A2A2E] space-y-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#6E6D7A] flex items-center gap-2">
                   <Package className="size-4 text-[#C5A880]" /> Items In This Shipment ({orderItems.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {orderItems.map((item, idx) => (
                     <div key={idx} className="flex gap-4 p-4 border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl bg-[#FAF9F6] dark:bg-[#121214] hover:border-[#C5A880] transition-all">
                        <img src={item.image} alt={item.name} className="size-16 rounded-xl object-cover bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] shrink-0" />
                        <div className="min-w-0 flex-1">
                           <p className="text-xs font-black uppercase tracking-tight text-[#121214] dark:text-[#FAF9F6] truncate">{item.name}</p>
                           <p className="text-[10px] font-bold text-[#6E6D7A] mt-1 uppercase">Qty: {item.qty} × ₹{item.price}</p>
                           <span className="inline-block mt-2 text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full uppercase">Quality Checked</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Sidebar Info */}
          <aside className="space-y-8">
             <div className="bg-white dark:bg-[#18181B] p-8 rounded-[3rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/5 dark:shadow-none space-y-8 transition-colors duration-300">
                {/* Destination Details */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E6D7A] border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-3">Delivery Destination</h3>
                   <div className="space-y-2">
                      <p className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase italic">Shipping Address</p>
                      <p className="text-xs font-medium text-[#6E6D7A] leading-relaxed bg-[#FAF9F6] dark:bg-[#121214] p-4 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                         {shippingAddress?.street},<br />
                         {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.zip}<br />
                         {shippingAddress?.country}
                      </p>
                   </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E6D7A] border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-3">Payment Summary</h3>
                   <div className="bg-[#FAF9F6] dark:bg-[#121214] p-4 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] space-y-3">
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-[#6E6D7A]">Method</span>
                         <span className="font-black text-[#121214] dark:text-[#FAF9F6] uppercase">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-[#6E6D7A]">Payment Status</span>
                         <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${isPaid ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'}`}>
                            {isPaid ? 'Paid' : 'Pending COD'}
                         </span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-[#EFECE6] dark:border-[#2A2A2E]">
                         <span className="font-black text-[#121214] dark:text-[#FAF9F6]">Total Charged</span>
                         <span className="font-black text-[#121214] dark:text-[#FAF9F6] text-sm">₹{totalPrice}</span>
                      </div>
                      <div className="pt-1">
                         <button
                           onClick={handleDownloadInvoice}
                           disabled={downloadingInvoice}
                           className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-[#18181B] hover:bg-[#0D0D0D] hover:text-white dark:hover:bg-white dark:hover:text-[#0D0D0D] text-[#121214] dark:text-[#FAF9F6] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                         >
                            {downloadingInvoice ? (
                              <div className="size-3 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Download className="size-3.5 text-[#C5A880]" />
                            )}
                            <span>Download Tax Invoice (PDF)</span>
                         </button>
                      </div>
                   </div>
                </div>

                {/* Customer Support */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E6D7A] border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-3">Atelier Concierge</h3>
                   <div className="space-y-2.5">
                      <Link to="/contact" className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#121214] hover:border-[#C5A880] text-[#121214] dark:text-[#FAF9F6] text-xs font-black uppercase tracking-wider transition-all border border-[#EFECE6] dark:border-[#2A2A2E]">
                         <span className="flex items-center gap-2"><HelpCircle className="size-4 text-[#C5A880]" /> Concierge Support</span>
                         <ChevronLeft className="size-4 rotate-180 text-[#6E6D7A]" />
                      </Link>
                   </div>
                </div>
             </div>

             {/* Atelier Promise Card */}
             <div className="bg-[#0D0D0D] p-8 rounded-[3rem] text-white space-y-5 relative overflow-hidden shadow-xl border border-[#2A2A2E] group">
                <div className="relative z-10 space-y-3">
                   <Star className="size-7 text-[#C5A880]" />
                   <h4 className="text-xl font-black uppercase tracking-tight leading-tight">Editorial Atelier Promise</h4>
                   <p className="text-[11px] font-medium text-[#FAF9F6]/80 leading-relaxed">
                      Every piece is authentic, temperature-regulated, and inspected before express white-glove dispatch.
                   </p>
                </div>
                <div className="absolute -bottom-10 -right-10 size-36 bg-[#C5A880]/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
