import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, CheckCircle2, Truck, Star, Download, FileText, ShieldCheck } from 'lucide-react';
import paymentService from '../services/paymentService';
import { toast } from 'react-hot-toast';

const OrderSuccessPage = () => {
  const location = useLocation();
  const params = useParams();
  const orderId = params.orderId || new URLSearchParams(location.search).get('orderId') || 'N/A';
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      console.clear();
    } catch (e) {}
  }, []);

  // Calculate estimated delivery date (5 business days from now)
  const getEstimatedDelivery = () => {
    const date = new Date();
    let daysAdded = 0;
    while (daysAdded < 5) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) daysAdded++;
    }
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleDownloadInvoice = async () => {
    if (!orderId || orderId === 'N/A') {
      toast.error('Order ID not found for invoice generation');
      return;
    }
    try {
      setDownloading(true);
      toast.loading('Generating your official PDF tax invoice...', { id: 'invoice-gen' });
      await paymentService.downloadInvoice(orderId);
      toast.success('Invoice downloaded successfully!', { id: 'invoice-gen' });
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error('Failed to download invoice. Please try again.', { id: 'invoice-gen' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121214] flex items-center justify-center p-4 py-24 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-[#18181B] rounded-[3.5rem] p-8 md:p-14 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-2xl shadow-black/5 dark:shadow-none text-center relative overflow-hidden transition-colors duration-300"
      >
        {/* Subtle Luxury Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A880]/10 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="size-24 bg-[#0D0D0D] dark:bg-[#FAF9F6] rounded-full mx-auto flex items-center justify-center text-[#C5A880] shadow-2xl shadow-black/10 mb-8 border-2 border-[#C5A880]"
        >
          <CheckCircle2 className="size-12" />
        </motion.div>

        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] rounded-full border border-[#EFECE6] dark:border-[#3E3E42] text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="size-3.5 text-[#C5A880]" /> Atelier Payment Verified
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">Order Confirmed</h1>
          <p className="text-[#6E6D7A] font-medium max-w-md mx-auto leading-relaxed text-sm">
            Your luxury acquisition has been secured. An official confirmation email and digital tax invoice have been generated.
          </p>
        </div>

        <div className="bg-[#FAF9F6] dark:bg-[#121214] rounded-[2rem] p-6 md:p-8 mb-8 border border-[#EFECE6] dark:border-[#2A2A2E] relative z-10 space-y-4">
           <div className="grid grid-cols-2 gap-6">
              <div className="text-left space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A]">Order Reference</p>
                 <p className="text-xs md:text-sm font-black text-[#121214] dark:text-[#FAF9F6] font-mono break-all">#{orderId}</p>
              </div>
              <div className="text-right space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A]">Estimated Arrival</p>
                 <p className="text-xs md:text-sm font-black text-[#121214] dark:text-[#FAF9F6]">{getEstimatedDelivery()}</p>
              </div>
           </div>

           {/* Invoice Download Action Banner */}
           <div className="pt-4 border-t border-[#EFECE6] dark:border-[#2A2A2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                 <div className="p-2.5 bg-white dark:bg-[#18181B] text-[#C5A880] rounded-xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                    <FileText className="size-4" />
                 </div>
                 <div>
                    <p className="text-[11px] font-black uppercase text-[#121214] dark:text-[#FAF9F6]">Official GST Tax Invoice</p>
                    <p className="text-[10px] text-[#6E6D7A] font-medium">Digital A4 PDF with itemized tax details</p>
                 </div>
              </div>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading || !orderId || orderId === 'N/A'}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black text-[10px] uppercase tracking-wider rounded-full hover:bg-black dark:hover:bg-white transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {downloading ? (
                  <>
                    <div className="size-3.5 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3.5 text-[#C5A880]" />
                    <span>Download Invoice (PDF)</span>
                  </>
                )}
              </button>
           </div>
        </div>

        <div className="space-y-4 mb-8">
           <div className="flex items-center justify-center gap-4 text-[#6E6D7A]">
              <div className="size-10 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] flex items-center justify-center shadow-sm">
                 <Truck className="size-4 text-[#C5A880]" />
              </div>
              <div className="h-px w-8 bg-[#EFECE6] dark:border-[#2A2A2E]"></div>
              <div className="size-10 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] flex items-center justify-center shadow-sm text-[#C5A880]">
                 <Star className="size-4" />
              </div>
              <div className="h-px w-8 bg-[#EFECE6] dark:border-[#2A2A2E]"></div>
              <div className="size-10 bg-[#FAF9F6] dark:bg-[#121214] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] flex items-center justify-center shadow-sm">
                 <ShoppingBag className="size-4 text-[#C5A880]" />
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E6D7A]">Track shipment anytime in your orders section</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <Link 
             to={`/orders/${orderId}`}
             className="flex-1 bg-[#0D0D0D] dark:bg-[#FAF9F6] hover:bg-black dark:hover:bg-white text-white dark:text-[#0D0D0D] font-black py-4 md:py-4.5 rounded-full flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs shadow-xl shadow-black/10"
           >
              Track Order
              <ChevronRight className="size-4 text-[#C5A880]" />
           </Link>
           <Link 
             to="/products" 
             className="flex-1 bg-white dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6] font-black py-4 md:py-4.5 rounded-full border border-[#EFECE6] dark:border-[#2A2A2E] flex items-center justify-center gap-3 hover:border-[#C5A880] transition-all uppercase tracking-widest text-xs"
           >
              Keep Shopping
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
