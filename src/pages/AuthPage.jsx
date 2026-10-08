import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToggleTabs from '../components/ToggleTabs';
import UserOtpForm from '../components/UserOtpForm';
import AdminLoginForm from '../components/AdminLoginForm';
import { Sparkles, ShieldCheck } from 'lucide-react';
import influencerImg from '../assets/beauty_influencer_login.png';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF9F6] dark:bg-[#121214] transition-colors duration-700 font-sans selection:bg-[#C5A880]/30 selection:text-[#121214] overflow-hidden">
      {/* Left Section: Editorial Imagery (Desktop) */}
      <div className="hidden md:flex flex-1 relative group overflow-hidden bg-[#0D0D0D]">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={influencerImg} 
          alt="French Atelier Luxury" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-end p-20 text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-[#C5A880]">
              <Sparkles size={12} className="text-[#C5A880]" /> Editorial French Atelier
            </div>
            <h1 className="text-6xl font-black mb-4 tracking-tight leading-none uppercase">
              Glam <span className="italic text-[#C5A880]">Luxe</span>
            </h1>
            <p className="text-sm font-medium text-[#FAF9F6]/80 max-w-sm mx-auto leading-relaxed mb-10">
              Where Parisian refinement meets bespoke beauty curation. Discover your signature glow.
            </p>
            
            <div className="flex gap-8 justify-center items-center opacity-60 text-[#C5A880]">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Pure Luxe</span>
              <div className="size-1 rounded-full bg-[#C5A880]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Authentic</span>
              <div className="size-1 rounded-full bg-[#C5A880]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Exclusive</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section: Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-[#FAF9F6] dark:bg-[#121214]">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md relative z-10"
        >
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tighter mb-1">
              Glam <span className="italic text-[#C5A880]">Luxe</span>
            </h2>
            <p className="text-[10px] font-black text-[#6E6D7A] uppercase tracking-widest">Editorial French Atelier</p>
          </div>

          <div className="mb-8 text-center md:text-left">
            <motion.div layout transition={{ duration: 0.5 }}>
              <h2 className="text-4xl md:text-5xl font-black text-[#121214] dark:text-[#FAF9F6] tracking-tight mb-2">
                {activeTab === 'user' ? 'Welcome' : 'Management'} <span className="italic text-[#C5A880]">{activeTab === 'user' ? 'Back' : 'Gateway'}</span>
              </h2>
              <p className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-[0.2em]">
                {activeTab === 'user' ? 'Access your private atelier profile' : 'Secure administrative gateway'}
              </p>
            </motion.div>
          </div>

          <div className="bg-white dark:bg-[#18181B] rounded-[2.5rem] p-3 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-2xl shadow-black/5 dark:shadow-none">
            <ToggleTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="px-6 pb-6">
              <div className={activeTab === 'user' ? 'block' : 'hidden'}>
                <UserOtpForm />
              </div>
              <div className={activeTab === 'admin' ? 'block' : 'hidden'}>
                <AdminLoginForm />
              </div>
            </div>
          </div>

          <footer className="mt-10 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#6E6D7A] uppercase tracking-[0.25em]">
              <ShieldCheck size={14} className="text-[#C5A880]" /> 256-Bit Encrypted Authentication
            </div>
            <div className="mt-5 flex justify-center gap-6">
               <button className="text-[10px] font-black text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] transition-colors uppercase tracking-widest cursor-pointer">Help</button>
               <button className="text-[10px] font-black text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] transition-colors uppercase tracking-widest cursor-pointer">Privacy</button>
               <button className="text-[10px] font-black text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] transition-colors uppercase tracking-widest cursor-pointer">Terms</button>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
