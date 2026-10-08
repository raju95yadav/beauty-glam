import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', variant = 'capsule', showLabel = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  // Variant 1: Compact Icon Button
  if (variant === 'icon') {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`relative size-10 md:size-11 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDark 
            ? 'bg-[#18181B] text-[#C5A880] border border-[#2A2A2E] shadow-sm' 
            : 'bg-[#FAF9F6] text-[#121214] border border-[#EFECE6] shadow-sm'
        } ${className}`}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Activate Warm Alabaster' : 'Activate Noir Atelier'}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="size-5 fill-[#C5A880] text-[#C5A880]" />
          ) : (
            <Moon className="size-5 fill-[#121214] text-[#121214]" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  // Variant 2: Drawer Row
  if (variant === 'row') {
    return (
      <div className={`flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] transition-colors ${className}`}>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full flex items-center justify-center bg-white dark:bg-[#121214] text-[#C5A880] shadow-sm border border-[#EFECE6] dark:border-[#2A2A2E]">
            {isDark ? (
              <Moon className="size-4 text-[#C5A880] fill-[#C5A880]" />
            ) : (
              <Sun className="size-4 text-[#C5A880] fill-[#C5A880]" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#121214] dark:text-[#FAF9F6]">
              {isDark ? 'Noir Atelier' : 'Warm Alabaster'}
            </p>
            <p className="text-[9px] text-[#6E6D7A] font-medium">
              {isDark ? 'Editorial Midnight Palette' : 'Clean French Atelier Palette'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
            isDark ? 'bg-[#0D0D0D] border border-[#2A2A2E]' : 'bg-[#EFECE6] border border-[#E2DDD5]'
          }`}
          aria-label="Toggle theme"
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="size-6 rounded-full bg-white dark:bg-[#FAF9F6] shadow-md flex items-center justify-center"
            style={{ marginLeft: isDark ? 'auto' : '0' }}
          >
            {isDark ? (
              <Moon className="size-3.5 text-[#0D0D0D] fill-[#0D0D0D]" />
            ) : (
              <Sun className="size-3.5 text-[#C5A880] fill-[#C5A880]" />
            )}
          </motion.div>
        </button>
      </div>
    );
  }

  // Variant 3: Default Luxury Capsule
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="group relative flex items-center gap-1.5 h-10 px-1.5 rounded-full bg-[#FAF9F6] dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#C5A880] focus:outline-none select-none cursor-pointer"
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Activate Warm Alabaster' : 'Activate Noir Atelier'}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`absolute top-1 bottom-1 w-7 rounded-full shadow-md transition-colors duration-300 ${
            isDark 
              ? 'left-[calc(100%-2.25rem)] bg-[#0D0D0D] border border-[#2A2A2E]' 
              : 'left-1 bg-white border border-[#EFECE6]'
          }`}
        />

        {/* Light Icon */}
        <div className="relative z-10 size-7 flex items-center justify-center transition-colors duration-300">
          <motion.div
            animate={{ 
              rotate: isDark ? -20 : 0, 
              scale: isDark ? 0.8 : 1,
              opacity: isDark ? 0.45 : 1 
            }}
            transition={{ duration: 0.3 }}
          >
            <Sun 
              className={`size-4 transition-colors duration-300 ${
                !isDark 
                  ? 'text-[#C5A880] fill-[#C5A880]' 
                  : 'text-[#6E6D7A]'
              }`} 
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        {/* Dark Icon */}
        <div className="relative z-10 size-7 flex items-center justify-center transition-colors duration-300">
          <motion.div
            animate={{ 
              rotate: isDark ? 0 : 20, 
              scale: isDark ? 1 : 0.8,
              opacity: isDark ? 1 : 0.45 
            }}
            transition={{ duration: 0.3 }}
          >
            <Moon 
              className={`size-4 transition-colors duration-300 ${
                isDark 
                  ? 'text-[#C5A880] fill-[#C5A880]' 
                  : 'text-[#6E6D7A]'
              }`} 
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        {showLabel && (
          <span className="relative z-10 pr-2 text-[10px] font-black uppercase tracking-wider text-[#6E6D7A] hidden sm:inline-block">
            {isDark ? 'Noir' : 'Warm'}
          </span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
