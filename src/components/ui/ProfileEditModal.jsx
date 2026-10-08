import React, { useState } from 'react';
import { X, User, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateUser(updateData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#18181B] w-full max-w-md rounded-[2.5rem] border border-[#EFECE6] dark:border-[#2A2A2E] overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-[#0D0D0D] px-8 py-8 text-white relative border-b border-[#2A2A2E]">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-[#6E6D7A] hover:text-white rounded-full bg-white/10 transition-colors"
            >
              <X className="size-4" />
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A880] block mb-1">Editorial Atelier</span>
            <h2 className="text-2xl font-black tracking-tight mb-1">Edit Profile</h2>
            <p className="text-xs text-[#FAF9F6]/80 font-medium">Update your client information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-2xl flex items-center gap-3 text-xs font-semibold"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl flex items-center gap-3 text-xs font-semibold"
              >
                <CheckCircle className="size-4 shrink-0" />
                Profile updated successfully!
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E6D7A]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/20 focus:border-[#C5A880] transition-all text-[#121214] dark:text-[#FAF9F6] text-sm font-medium"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E6D7A]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/20 focus:border-[#C5A880] transition-all text-[#121214] dark:text-[#FAF9F6] text-sm font-medium"
                    placeholder="client@atelier.com"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#EFECE6] dark:border-[#2A2A2E]">
                <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Update Security Key</label>
                <p className="text-[10px] text-[#6E6D7A] mb-2 px-1">Leave blank to retain current password</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E6D7A]" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/20 focus:border-[#C5A880] transition-all text-[#121214] dark:text-[#FAF9F6] text-sm font-medium"
                      placeholder="New password"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E6D7A]" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/20 focus:border-[#C5A880] transition-all text-[#121214] dark:text-[#FAF9F6] text-sm font-medium"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-4 bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black rounded-full shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin text-[#C5A880]" />
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileEditModal;
