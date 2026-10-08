import React from 'react';
import { motion } from 'framer-motion';

const ToggleTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex p-1 bg-[#FAF9F6] dark:bg-[#18181B] rounded-full mb-6 border border-[#EFECE6] dark:border-[#2A2A2E]">
      <button
        onClick={() => onTabChange('user')}
        className={`relative flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
          activeTab === 'user' ? 'text-white dark:text-[#0D0D0D]' : 'text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white'
        }`}
      >
        {activeTab === 'user' && (
          <motion.div
            layoutId="active-tab-glow"
            className="absolute inset-0 bg-[#0D0D0D] dark:bg-[#FAF9F6] rounded-full shadow-md"
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Client Access</span>
      </button>
      <button
        onClick={() => onTabChange('admin')}
        className={`relative flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
          activeTab === 'admin' ? 'text-white dark:text-[#0D0D0D]' : 'text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white'
        }`}
      >
        {activeTab === 'admin' && (
          <motion.div
            layoutId="active-tab-glow"
            className="absolute inset-0 bg-[#0D0D0D] dark:bg-[#FAF9F6] rounded-full shadow-md"
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">Management</span>
      </button>
    </div>
  );
};

export default ToggleTabs;
