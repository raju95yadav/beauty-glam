import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react';

const FullscreenLoader = ({ message = "Establishing atelier session..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#121214]/95 backdrop-blur-xl"
    >
      <div className="relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            borderColor: ['#C5A880', '#FAF9F6', '#C5A880']
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="size-32 rounded-[2.5rem] border-4 border-[#C5A880] flex items-center justify-center"
        >
          <ShieldCheck size={48} className="text-[#C5A880] drop-shadow-[0_0_15px_rgba(197,168,128,0.5)]" />
        </motion.div>
        
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-4 -right-4"
        >
          <Sparkles className="text-[#C5A880]" size={24} />
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-3">
          Editorial <span className="text-[#C5A880]">Atelier</span>
        </h3>
        <p className="text-[#6E6D7A] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
           {message} <Loader2 size={14} className="animate-spin text-[#C5A880]" />
        </p>
      </div>

      <div className="absolute bottom-12 w-full max-w-xs px-8">
         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-[#C5A880] shadow-[0_0_20px_rgba(197,168,128,0.5)]"
            />
         </div>
         <p className="text-[10px] text-[#6E6D7A] font-black uppercase tracking-[0.3em] text-center mt-4">
            Atelier Security v2.0
         </p>
      </div>
    </motion.div>
  );
};

export default FullscreenLoader;
