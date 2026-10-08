import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, ShieldCheck } from 'lucide-react';

const CODOption = ({ onValidChange }) => {
  // Use effect to signal that COD is always valid when selected
  React.useEffect(() => {
    onValidChange(true, { method: 'cod' });
  }, []);

  return (
    <div className="space-y-8 py-6">
       <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white dark:bg-[#18181B] p-8 rounded-[2.5rem] border border-[#EFECE6] dark:border-[#2A2A2E] text-center space-y-6 shadow-sm"
       >
          <div className="size-20 bg-[#FAF9F6] dark:bg-[#121214] rounded-full flex items-center justify-center mx-auto shadow-sm text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E]">
             <Banknote className="size-9 text-[#C5A880]" />
          </div>
          <div className="space-y-2">
             <h3 className="text-xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">Cash on Delivery</h3>
             <p className="text-[#6E6D7A] text-sm max-w-xs mx-auto leading-relaxed font-medium">
                Settle directly upon personal delivery of your bespoke atelier selection.
             </p>
          </div>
          
          <div className="flex items-center gap-2 justify-center text-[10px] font-black uppercase tracking-[0.2em] text-[#121214] dark:text-[#FAF9F6] bg-[#FAF9F6] dark:bg-[#121214] py-3 rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
             <ShieldCheck className="size-4 text-[#C5A880]" />
             Safe & Verified Delivery
          </div>
       </motion.div>

       <div className="px-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A]">Delivery Notes:</p>
          <ul className="space-y-2">
             {[
               'Please keep exact payment ready at handover',
               'Change may be limited with courier partner',
               'Contactless digital payment option available upon dispatch'
             ].map((note, i) => (
               <li key={i} className="flex gap-3 text-xs text-[#6E6D7A] font-medium">
                  <span className="text-[#C5A880] mt-0.5">•</span>
                  {note}
               </li>
             ))}
          </ul>
       </div>
    </div>
  );
};

export default CODOption;
