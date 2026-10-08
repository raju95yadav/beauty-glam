import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'size-6 border-2',
    md: 'size-12 border-3',
    lg: 'size-16 border-4',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 1, ease: 'linear' },
          scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        }}
        className={`${sizeClasses[size] || sizeClasses.md} border-[#EFECE6] dark:border-[#2A2A2E] border-t-[#C5A880] rounded-full`}
      />
      {fullScreen && (
        <p className="text-[#C5A880] font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Curating Atelier Experience...
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FAF9F6]/90 dark:bg-[#121214]/90 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
