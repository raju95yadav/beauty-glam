import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Settings, 
  Bell, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileEditModal from '../components/ui/ProfileEditModal';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [checkingSub, setCheckingSub] = useState(true);

  useEffect(() => {
    if (user?.email) {
      checkSubscriptionStatus();
    }
  }, [user?.email]);

  const checkSubscriptionStatus = async () => {
    try {
      setCheckingSub(true);
      const { data } = await api.get(`/main/newsletter/status?email=${encodeURIComponent(user.email)}`);
      setIsSubscribed(data?.isSubscribed || false);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    } finally {
      setCheckingSub(false);
    }
  };

  const handleToggleNewsletter = async () => {
    if (!user?.email) return;
    setSubLoading(true);
    try {
      if (isSubscribed) {
        await api.post('/main/newsletter/unsubscribe', { email: user.email });
        setIsSubscribed(false);
        toast.success('Unsubscribed from Beauty Circle newsletter');
      } else {
        await api.post('/main/newsletter', { email: user.email, source: 'profile' });
        setIsSubscribed(true);
        toast.success('Subscribed to VIP Beauty Circle!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setSubLoading(false);
    }
  };

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'Track, return or buy pieces again', path: '/orders' },
    { icon: Heart, label: 'My Wishlist', desc: 'Exclusive items you have saved for later', path: '/wishlist' },
    { icon: MapPin, label: 'My Addresses', desc: 'Manage your primary delivery locations', path: '/profile' },
    { icon: Bell, label: 'Notifications', desc: 'Stay updated on private drops & allocations', path: '/profile' },
    { icon: Settings, label: 'Account Settings', desc: 'Update your profile and security credentials', path: '#' },
  ];

  if (!user) return null;

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] text-[#121214] dark:text-[#FAF9F6] min-h-screen pb-16 transition-colors duration-300">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#18181B] border-b border-[#EFECE6] dark:border-[#2A2A2E]">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="size-24 rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] flex items-center justify-center text-[#121214] dark:text-[#FAF9F6] border-4 border-[#EFECE6] dark:border-[#3E3E42] shadow-inner">
            <User className="size-12 text-[#C5A880]" />
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] dark:bg-[#2A2A2E] border border-[#EFECE6] dark:border-[#3E3E42] text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A880] mb-2">
              <Sparkles className="size-3" /> Atelier Member
            </div>
            <h1 className="text-3xl font-black text-[#121214] dark:text-[#FAF9F6] mb-1 tracking-tight">{user.name || 'Member'}</h1>
            <p className="text-[#6E6D7A] text-sm mb-4 font-medium">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <button 
                 onClick={() => setIsEditModalOpen(true)} 
                 className="px-5 py-2 border border-[#0D0D0D] dark:border-[#FAF9F6] text-[#0D0D0D] dark:text-[#FAF9F6] text-xs font-black rounded-full hover:bg-[#0D0D0D] hover:text-white dark:hover:bg-[#FAF9F6] dark:hover:text-[#0D0D0D] transition-all uppercase tracking-widest shadow-sm"
               >
                 Edit Profile
               </button>
               <button 
                 onClick={logout}
                 className="px-5 py-2 border border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] text-xs font-black rounded-full hover:border-red-500 hover:text-red-500 transition-all uppercase tracking-widest flex items-center gap-2"
               >
                 <LogOut className="size-3" /> Logout
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-[0.25em] mb-4">Account Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -3 }}
                onClick={() => {
                  if (item.path === '#') {
                    setIsEditModalOpen(true);
                  } else {
                    navigate(item.path);
                  }
                }}
                className="p-6 bg-white dark:bg-[#18181B] rounded-[2rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm hover:shadow-md transition-all text-left flex items-start gap-5 group"
              >
                <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-2xl text-[#C5A880] group-hover:bg-[#0D0D0D] group-hover:text-white dark:group-hover:bg-[#FAF9F6] dark:group-hover:text-[#0D0D0D] transition-colors">
                  <item.icon className="size-5" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black text-sm text-[#121214] dark:text-[#FAF9F6] mb-1 uppercase tracking-tight">{item.label}</h3>
                  <p className="text-xs text-[#6E6D7A] leading-relaxed font-medium">{item.desc}</p>
                </div>
                <ChevronRight className="size-5 text-[#6E6D7A]/50 group-hover:text-[#C5A880] transition-colors shrink-0 mt-1" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Editorial Welcome Banner */}
          <div className="bg-[#0D0D0D] p-8 rounded-[2rem] text-white shadow-xl shadow-black/10 border border-[#2A2A2E] relative overflow-hidden">
             <div className="relative z-10">
               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-[#C5A880] mb-4">
                 VIP Curations
               </div>
               <h3 className="font-black text-xl mb-2 tracking-tight">Atelier Experience</h3>
               <p className="text-xs text-[#FAF9F6]/80 mb-6 font-medium leading-relaxed">Indulge in our private edit of iconic fragrances, high-performance skincare, and bespoke makeup.</p>
               <Link to="/products" className="bg-[#FAF9F6] text-[#0D0D0D] px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-md inline-block">
                 Explore Collection
               </Link>
             </div>
             <div className="absolute -bottom-8 -right-8 size-36 bg-[#C5A880]/15 rounded-full blur-2xl"></div>
          </div>

          {/* VIP Beauty Circle Card */}
          <div className="p-6 bg-white dark:bg-[#18181B] rounded-[2rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-10 rounded-2xl bg-[#FAF9F6] dark:bg-[#2A2A2E] flex items-center justify-center text-[#C5A880]">
                      <Sparkles className="size-5" />
                   </div>
                   <div>
                      <h4 className="font-black text-sm text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">VIP Beauty Circle</h4>
                      <p className="text-[11px] text-[#6E6D7A] font-medium">Private drops & perks</p>
                   </div>
                </div>
                {checkingSub ? (
                   <Loader2 className="size-4 animate-spin text-[#6E6D7A]" />
                ) : (
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isSubscribed 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-[#FAF9F6] dark:bg-[#2A2A2E] text-[#6E6D7A]'
                   }`}>
                      {isSubscribed ? (
                        <>
                          <CheckCircle2 className="size-3" /> Subscribed
                        </>
                      ) : (
                        'Not Enrolled'
                      )}
                   </span>
                )}
             </div>

             <p className="text-xs text-[#6E6D7A] leading-relaxed font-medium">
               {isSubscribed 
                 ? `Your email (${user.email}) is enrolled in the Atelier Circle. You will receive first-access alerts and VIP allocations.`
                 : `Subscribe to receive early notifications on flash drops, private sales, and curated advice delivered to ${user.email}.`
               }
             </p>

             <button
               onClick={handleToggleNewsletter}
               disabled={subLoading || checkingSub}
               className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                 isSubscribed 
                   ? 'border border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-red-500 hover:text-red-500' 
                   : 'bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] shadow-md hover:bg-black dark:hover:bg-white'
               }`}
             >
               {subLoading ? (
                 <Loader2 className="size-3.5 animate-spin" />
               ) : isSubscribed ? (
                 'Unsubscribe'
               ) : (
                 <>
                   <Mail className="size-3.5 text-[#C5A880]" /> Join the Circle (1-Click)
                 </>
               )}
             </button>
          </div>
        </div>
      </div>

      <ProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ProfilePage;
