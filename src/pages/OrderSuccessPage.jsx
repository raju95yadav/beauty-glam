import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3.5rem] p-8 md:p-14 border border-gray-100 shadow-2xl shadow-gray-200/50 text-center relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50"></div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="size-24 bg-pink-600 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl shadow-pink-200 mb-8"
        >
          <CheckCircle2 className="size-12" />
        </motion.div>

        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="size-3.5" /> Razorpay Payment Verified
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed text-sm">
            Your beauty haul is officially locked in. A confirmation email and tax invoice have been generated.
          </p>
        </div>

        <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 mb-8 border border-gray-100 relative z-10 space-y-4">
           <div className="grid grid-cols-2 gap-6">
              <div className="text-left space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Reference</p>
                 <p className="text-xs md:text-sm font-black text-gray-900 font-mono break-all">#{orderId}</p>
              </div>
              <div className="text-right space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Arrival</p>
                 <p className="text-xs md:text-sm font-black text-pink-600">{getEstimatedDelivery()}</p>
              </div>
           </div>

           {/* Invoice Download Action Banner */}
           <div className="pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                 <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
                    <FileText className="size-4" />
                 </div>
                 <div>
                    <p className="text-[11px] font-black uppercase text-gray-900">Official GST Tax Invoice</p>
                    <p className="text-[10px] text-gray-400 font-medium">Digital A4 PDF with itemized tax details</p>
                 </div>
              </div>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading || !orderId || orderId === 'N/A'}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-gray-900 font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <div className="size-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3.5 text-pink-600" />
                    <span>Download Invoice (PDF)</span>
                  </>
                )}
              </button>
           </div>
        </div>

        <div className="space-y-4 mb-8">
           <div className="flex items-center justify-center gap-4 text-gray-400">
              <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                 <Truck className="size-5" />
              </div>
              <div className="h-px w-8 bg-gray-100"></div>
              <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm text-pink-600">
                 <Star className="size-5" />
              </div>
              <div className="h-px w-8 bg-gray-100"></div>
              <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                 <ShoppingBag className="size-5" />
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Track shipment anytime in your orders section</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <Link 
             to={`/orders/${orderId}`}
             className="flex-1 bg-gray-900 text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all uppercase tracking-widest text-xs"
           >
              Track Order
              <ChevronRight className="size-4" />
           </Link>
           <Link 
             to="/products" 
             className="flex-1 bg-white text-gray-900 font-black py-4 md:py-5 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 hover:border-pink-200 hover:text-pink-600 transition-all uppercase tracking-widest text-xs"
           >
              Keep Shopping
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
