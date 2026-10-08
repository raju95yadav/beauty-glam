import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Mail, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const email = location.state?.email;

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { user, token } = response.data;
      
      const role = user.role || response.data.role || 'user';
      login(user, token);
      
      if (role === 'admin') {
        const adminBaseUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://beauty-admin-five.vercel.app');
        toast.success('Admin authentication verified! Loading console...');
        setTimeout(() => {
          window.location.href = `${adminBaseUrl}/dashboard?token=${token}&role=${role}`;
        }, 1200);
      } else {
        navigate('/login-success');
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAF9F6] dark:bg-[#121214] transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-[#18181B] rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-none p-8 md:p-12 border border-[#EFECE6] dark:border-[#2A2A2E]"
      >
        <div className="text-center mb-8">
          <div className="size-16 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-3xl flex items-center justify-center text-[#C5A880] mx-auto mb-6 border border-[#EFECE6] dark:border-[#3E3E42]">
            <Mail className="size-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] border border-[#EFECE6] dark:border-[#3E3E42] text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A880] mb-3">
            <Sparkles className="size-3" /> Two-Factor Key
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight mb-2">Verify Security Key</h2>
          <p className="text-[#6E6D7A] text-xs font-semibold">
            One-time key dispatched to <span className="text-[#121214] dark:text-[#FAF9F6] font-bold">{email}</span>
          </p>
        </div>
        
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-[10px] font-black text-[#6E6D7A] uppercase tracking-[0.2em] mb-3 text-center px-1">Enter 6-digit Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000 000"
              maxLength="6"
              required
              className="w-full px-6 py-5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-black text-2xl md:text-3xl text-center text-[#121214] dark:text-[#FAF9F6] tracking-[0.4em] placeholder-[#6E6D7A]/30"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold p-4 rounded-2xl text-center border border-red-200 dark:border-red-900/40"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black py-4 rounded-full uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin text-[#C5A880]" /> Verifying...
              </span>
            ) : 'Verify & Continue'}
          </button>
        </form>
        
        <div className="mt-8 text-center flex flex-col gap-3">
           <button 
             onClick={() => navigate('/login')}
             className="text-[10px] font-black text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] uppercase tracking-widest transition-colors cursor-pointer"
           >
             Use Different Email
           </button>
           <div className="h-px bg-[#EFECE6] dark:bg-[#2A2A2E] flex-grow"></div>
           <p className="text-[11px] text-[#6E6D7A] font-medium">
             Didn't receive code? <span className="text-[#121214] dark:text-[#FAF9F6] font-bold cursor-pointer hover:underline">Resend Code</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerificationPage;
