import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';
import FullscreenLoader from './FullscreenLoader';
import { useAuth } from '../hooks/useAuth';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || isRedirecting) return;
    
    setLoading(true);
    const loadingToast = toast.loading('Establishing secure administrative session...');
    
    try {
      const { data } = await authApi.adminLogin(email, password);
      const role = data.role || data.user?.role || 'admin';
      const adminBaseUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://beauty-admin-pied.vercel.app');
      
      // Professional delay for UX
      setTimeout(() => {
        setLoading(false);
        setIsRedirecting(true);
        
        // Centralized login state synchronization
        login(data.user, data.token);
        
        toast.success('Access Granted. Welcome, Admin.', { id: loadingToast });
        
        // Final fade-out and redirect
        setTimeout(() => {
           window.location.href = `${adminBaseUrl}/dashboard?token=${data.token}&role=${role}`;
        }, 2200);
      }, 1500);

    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Unauthorized: Invalid Credentials', { id: loadingToast });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isRedirecting && <FullscreenLoader message="Initializing secure management console..." />}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onSubmit={handleLogin}
        autoComplete="off"
        className={loading || isRedirecting ? "space-y-6 opacity-40 pointer-events-none grayscale blur-md transition-all duration-1000" : "space-y-6 transition-all duration-500"}
      >
        {/* Anti-autofill dummy honeypots to absorb Chrome autofill */}
        <input type="text" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <input type="password" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />

        <div className="bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-white/10 p-6 rounded-[2rem] shadow-soft">
          <div className="flex items-center gap-4">
             <div className="size-10 bg-[#0D0D0D] rounded-2xl flex items-center justify-center text-[#C5A880] shadow-soft border border-[#C5A880]/30">
                <ShieldCheck size={20} className="text-[#C5A880]" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-[0.2em]">Authorized Access</p>
               <p className="text-[9px] text-[#6E6D7A] mt-0.5 uppercase tracking-widest font-medium italic">Administrative Gateway</p>
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-[0.2em] px-1">Identity</label>
          <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#FAF9F6] dark:bg-[#121214] rounded-lg group-focus-within/input:bg-[#0D0D0D] group-focus-within/input:text-[#C5A880] transition-all duration-300">
              <Mail className="size-4 text-[#6E6D7A] group-focus-within/input:text-[#C5A880] transition-colors" />
            </div>
            <input
              type="email"
              name="mgmt_admin_identity_email"
              id="mgmt_admin_identity_email"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              required
              placeholder="Enter admin email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-medium text-[#121214] dark:text-[#FAF9F6] placeholder:text-[#6E6D7A]/50 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-[0.2em] px-1">Credential</label>
          <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#FAF9F6] dark:bg-[#121214] rounded-lg group-focus-within/input:bg-[#0D0D0D] group-focus-within/input:text-[#C5A880] transition-all duration-300">
              <Key className="size-4 text-[#6E6D7A] group-focus-within/input:text-[#C5A880] transition-colors" />
            </div>
            <input
              type="password"
              name="mgmt_admin_credential_key"
              id="mgmt_admin_credential_key"
              autoComplete="new-password"
              required
              placeholder="Enter admin security password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-medium text-[#121214] dark:text-[#FAF9F6] placeholder:text-[#6E6D7A]/50 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isRedirecting}
          className="w-full py-5 bg-[#0D0D0D] hover:bg-[#262626] text-white dark:bg-[#FAF9F6] dark:text-[#0D0D0D] dark:hover:bg-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="size-4 border-2 border-[#C5A880]/20 border-t-[#C5A880] rounded-full animate-spin" />
              <span className="opacity-70 text-[#FAF9F6]">Verifying Identity...</span>
            </>
          ) : (
            <>
              Secure Authorize <ArrowRight size={16} className="text-[#C5A880]" />
          </>
        )}
      </button>
      <p className="text-center text-[9px] text-[#6E6D7A] uppercase tracking-widest leading-relaxed">
        Access to this portal is restricted and monitored.
      </p>
    </motion.form>
    </>
  );
};

export default AdminLoginForm;
