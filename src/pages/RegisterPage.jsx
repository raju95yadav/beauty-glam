import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await signup(data);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FAF9F6] dark:bg-[#121214] px-4 py-16 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white dark:bg-[#18181B] rounded-[2.5rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-2xl shadow-black/5 dark:shadow-none overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] border border-[#EFECE6] dark:border-[#3E3E42] text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A880] mb-4">
              <Sparkles className="size-3 text-[#C5A880]" />
              Editorial Atelier
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] mb-2 tracking-tight">Create Account</h1>
            <p className="text-sm text-[#6E6D7A] font-medium">Join the exclusive world of luxury beauty</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Eleanor Vance"
                  className={`w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border ${errors.name ? 'border-red-500' : 'border-[#EFECE6] dark:border-[#2A2A2E]'} text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/50 rounded-2xl outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 text-sm font-medium transition-all`}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6D7A] size-4" />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  })}
                  placeholder="eleanor@atelier.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border ${errors.email ? 'border-red-500' : 'border-[#EFECE6] dark:border-[#2A2A2E]'} text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/50 rounded-2xl outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 text-sm font-medium transition-all`}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6D7A] size-4" />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' }
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border ${errors.password ? 'border-red-500' : 'border-[#EFECE6] dark:border-[#2A2A2E]'} text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/50 rounded-2xl outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 text-sm font-medium transition-all`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6D7A] size-4" />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#6E6D7A] uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] dark:bg-[#121214] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#EFECE6] dark:border-[#2A2A2E]'} text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A]/50 rounded-2xl outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 text-sm font-medium transition-all`}
                />
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6D7A] size-4" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black py-4 mt-6 rounded-2xl hover:bg-black dark:hover:bg-white transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70 text-xs uppercase tracking-widest shadow-xl shadow-black/10"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="size-4 text-[#C5A880]" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-[#6E6D7A] px-4 leading-relaxed">
            By creating an account, you agree to our{' '}
            <span className="text-[#121214] dark:text-[#FAF9F6] font-semibold">Terms of Service</span> and{' '}
            <span className="text-[#121214] dark:text-[#FAF9F6] font-semibold">Privacy Policy</span>.
          </p>
        </div>

        <div className="p-6 bg-[#FAF9F6] dark:bg-[#121214] border-t border-[#EFECE6] dark:border-[#2A2A2E] text-center">
          <p className="text-xs text-[#6E6D7A] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#121214] dark:text-[#FAF9F6] font-black hover:text-[#C5A880] transition-colors ml-1 uppercase tracking-wider">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
