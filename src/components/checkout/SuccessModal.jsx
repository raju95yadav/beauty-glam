import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const SuccessModal = ({ show, loading, orderId }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-[#18181B] rounded-[3rem] p-10 md:p-12 max-w-sm w-full text-center relative z-10 shadow-2xl border border-[#EFECE6] dark:border-[#2A2A2E] transition-colors duration-300"
          >
            {loading ? (
              <div className="space-y-8 py-10">
                 <div className="relative size-24 mx-auto">
                    <Loader2 className="size-24 text-[#C5A880] animate-spin opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="size-14 bg-[#0D0D0D] dark:bg-[#FAF9F6] rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">Processing</h2>
                    <p className="text-[#6E6D7A] text-xs font-bold uppercase tracking-widest">Securing your atelier order...</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-8">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                   className="size-24 bg-[#0D0D0D] dark:bg-[#FAF9F6] rounded-full mx-auto flex items-center justify-center text-[#C5A880] shadow-xl shadow-black/10 border-2 border-[#C5A880]"
                 >
                    <CheckCircle2 className="size-12" />
                 </motion.div>
                 
                 <div className="space-y-3">
                    <h2 className="text-3xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">Order Confirmed</h2>
                    <p className="text-[#6E6D7A] text-sm font-medium leading-relaxed">
                       Thank you for your acquisition. Your bespoke beauty journey begins here.
                    </p>
                 </div>

                 <div className="bg-[#FAF9F6] dark:bg-[#121214] p-5 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A] mb-1">Order Reference</p>
                     <p className="text-xs font-bold text-[#121214] dark:text-[#FAF9F6] font-mono">{orderId ? `#${orderId.toString().slice(-8).toUpperCase()}` : 'Processing...'}</p>
                     <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1">
                       Payment Verified
                     </p>
                 </div>

                 <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A880]">
                    <Sparkles className="size-4" />
                    Preparing in Paris Atelier
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
