import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', variant = 'capsule', showLabel = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  // Variant 1: Compact Icon Button (Ideal for dense header / mobile action bar)
  if (variant === 'icon') {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`relative size-10 md:size-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isDark 
            ? 'bg-gray-900/90 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_-3px_rgba(251,191,36,0.15)] hover:bg-gray-850' 
            : 'bg-rose-50/80 text-rose-600 border border-rose-100 shadow-soft hover:bg-rose-100/70'
        } ${className}`}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Activate Light Mode' : 'Activate Dark Mode'}
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
            <Sun className="size-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          ) : (
            <Moon className="size-5 fill-rose-600 text-rose-600" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  // Variant 2: Drawer Row (Used in mobile navigation menu)
  if (variant === 'row') {
    return (
      <div className={`flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors ${className}`}>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm">
            {isDark ? (
              <Moon className="size-4 text-indigo-400 fill-indigo-400" />
            ) : (
              <Sun className="size-4 text-amber-500 fill-amber-400" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
              {isDark ? 'Midnight Luxe Theme' : 'Pure Radiance Theme'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
            isDark ? 'bg-rose-600' : 'bg-gray-200'
          }`}
          aria-label="Toggle theme"
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="size-6 rounded-full bg-white shadow-md flex items-center justify-center"
            style={{ marginLeft: isDark ? 'auto' : '0' }}
          >
            {isDark ? (
              <Moon className="size-3.5 text-rose-600 fill-rose-600" />
            ) : (
              <Sun className="size-3.5 text-amber-500 fill-amber-500" />
            )}
          </motion.div>
        </button>
      </div>
    );
  }

  // Variant 3: Default Luxury Animated Pill / Capsule Switch (Fits beautifully in the Navbar header)
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="group relative flex items-center gap-1.5 h-10 px-1.5 rounded-full bg-gray-100/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800/90 shadow-inner backdrop-blur-md transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-500/40 focus:outline-none select-none cursor-pointer"
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Activate Light Radiance' : 'Activate Midnight Luxe'}
      >
        {/* Animated Sliding Highlight Pill */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`absolute top-1 bottom-1 w-7 rounded-full shadow-md transition-colors duration-300 ${
            isDark 
              ? 'left-[calc(100%-2.25rem)] bg-gradient-to-tr from-gray-950 via-gray-900 to-indigo-950 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
              : 'left-1 bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
          }`}
        />

        {/* Light Icon (Sun) */}
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
                  ? 'text-amber-500 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]' 
                  : 'text-gray-400 dark:text-gray-500'
              }`} 
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        {/* Dark Icon (Moon) */}
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
                  ? 'text-indigo-300 fill-indigo-400 drop-shadow-[0_0_6px_rgba(165,180,252,0.6)]' 
                  : 'text-gray-400'
              }`} 
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        {showLabel && (
          <span className="relative z-10 pr-2 text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hidden sm:inline-block">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
