import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CheckCircle2, Loader2 } from 'lucide-react';

const UPIForm = ({ onValidChange, onVerify, loading }) => {
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (customId) => {
    const targetId = customId || upiId;
    if (!targetId.includes('@')) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      onValidChange(true, { upiId: targetId });
    }, 400);
  };

  const handleAutoFill = () => {
    const testId = 'testuser@upi';
    setUpiId(testId);
    handleVerify(testId);
  };

  const handleChange = (e) => {
    setUpiId(e.target.value);
    setIsVerified(false);
    onValidChange(false, null);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="bg-[#FAF9F6] dark:bg-[#18181B] p-6 rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E] mb-8">
         <div className="flex items-start gap-4 text-[#121214] dark:text-[#FAF9F6]">
            <Smartphone className="size-6 shrink-0 text-[#C5A880]" />
            <div>
               <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Direct UPI Transfer</h4>
               <p className="text-[10px] uppercase font-black tracking-widest text-[#6E6D7A] leading-relaxed">
                  Enter your registered VPA handle (e.g. name@okhdfcbank) and verify to complete checkout.
               </p>
            </div>
         </div>
      </div>

      <div className="flex justify-between items-center px-1">
         <span className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A]">UPI Identification</span>
         <button
           type="button"
           onClick={handleAutoFill}
           className="text-[10px] font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-widest hover:underline bg-[#FAF9F6] dark:bg-[#2A2A2E] px-3.5 py-1.5 rounded-full border border-[#EFECE6] dark:border-[#3E3E42] transition-all flex items-center gap-1.5"
         >
           <span className="text-[#C5A880]">⚡</span> Auto-fill Test UPI
         </button>
      </div>

      <div className="relative group">
         <input 
           type="text" 
           value={upiId}
           onChange={handleChange}
           placeholder=" "
           className="peer w-full px-8 py-5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-[2rem] focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-bold text-sm pr-32 text-[#121214] dark:text-[#FAF9F6]"
         />
         <label className="absolute left-8 top-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E6D7A] pointer-events-none transition-all peer-focus:top-2 peer-focus:text-[#121214] dark:peer-focus:text-[#FAF9F6] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[#121214] dark:peer-[:not(:placeholder-shown)]:text-[#FAF9F6]">
            Your UPI ID
         </label>
         
         <button 
           onClick={() => handleVerify()}
           disabled={!upiId.includes('@') || isVerifying || isVerified}
           className="absolute right-2 top-2 bottom-2 px-6 rounded-2xl bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white transition-all disabled:opacity-30"
         >
           {isVerifying ? (
             <Loader2 className="size-4 animate-spin text-[#C5A880]" />
           ) : isVerified ? (
             <CheckCircle2 className="size-4 text-emerald-500" />
           ) : (
             'Verify'
           )}
         </button>
      </div>

      <AnimatePresence>
         {isVerified && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex items-center gap-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40"
           >
              <CheckCircle2 className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">UPI ID Verified: {upiId}</span>
           </motion.div>
         )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4 opacity-50">
         {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
           <div key={app} className="aspect-square bg-[#FAF9F6] dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl flex items-center justify-center text-[10px] font-black uppercase text-[#6E6D7A] tracking-wider">
              {app}
           </div>
         ))}
      </div>
    </div>
  );
};

export default UPIForm;
