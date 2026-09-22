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
    { icon: Package, label: 'My Orders', desc: 'Track, return or buy things again', path: '/orders' },
    { icon: Heart, label: 'My Wishlist', desc: 'Items you have saved for later', path: '/wishlist' },
    { icon: MapPin, label: 'My Addresses', desc: 'Manage your shipping addresses', path: '/profile' },
    { icon: Bell, label: 'Notifications', desc: 'Stay updated on offers and orders', path: '/profile' },
    { icon: Settings, label: 'Account Settings', desc: 'Update your profile and password', path: '#' },
  ];

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen pb-12 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="size-24 rounded-full bg-pink-100 dark:bg-rose-950/50 flex items-center justify-center text-pink-600 dark:text-rose-400 border-4 border-pink-50 dark:border-rose-900/30 shadow-inner">
            <User className="size-12" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.name || 'User'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <button 
                 onClick={() => setIsEditModalOpen(true)} 
                 className="px-4 py-1.5 border border-pink-600 dark:border-rose-500 text-pink-600 dark:text-rose-400 text-xs font-bold rounded-full hover:bg-pink-600 hover:text-white transition-all uppercase tracking-tighter"
               >
                 Edit Profile
               </button>
               <button 
                 onClick={logout}
                 className="px-4 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-400 text-xs font-bold rounded-full hover:border-red-500 hover:text-red-500 transition-all uppercase tracking-tighter flex items-center gap-2"
               >
                 <LogOut className="size-3" /> Logout
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-widest mb-6">Account Dashboard</h2>
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
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-5 group"
              >
                <div className="p-3 bg-pink-50 dark:bg-rose-950/40 rounded-xl text-pink-600 dark:text-rose-400 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <item.icon className="size-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                <ChevronRight className="size-5 text-gray-300 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-rose-400 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-pink-600 to-rose-500 p-8 rounded-2xl text-white shadow-xl shadow-pink-100 dark:shadow-none relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-xl mb-2">Welcome Back!</h3>
               <p className="text-sm opacity-90 mb-6 font-medium">Enjoy your shopping experience with exclusive deals and fast delivery.</p>
               <Link to="/products" className="bg-white text-pink-600 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors shadow-lg inline-block">
                 Shop Now
               </Link>
             </div>
             <div className="absolute -bottom-4 -right-4 size-32 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute -top-4 -left-4 size-24 bg-white/5 rounded-full blur-xl"></div>
          </div>

          {/* VIP Beauty Circle & Newsletter Management Card */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-10 rounded-xl bg-pink-50 dark:bg-rose-950/40 flex items-center justify-center text-pink-600 dark:text-rose-400">
                      <Sparkles className="size-5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">VIP Beauty Circle</h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">Exclusive drops & perks</p>
                   </div>
                </div>
                {checkingSub ? (
                   <Loader2 className="size-4 animate-spin text-gray-400" />
                ) : (
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isSubscribed 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                   }`}>
                      {isSubscribed ? (
                        <>
                          <CheckCircle2 className="size-3" /> Subscribed
                        </>
                      ) : (
                        'Not Subscribed'
                      )}
                   </span>
                )}
             </div>

             <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
               {isSubscribed 
                 ? `Your email (${user.email}) is active in the Beauty Circle. You will receive first-access alerts and VIP discounts.`
                 : `Subscribe to get early notifications on flash drops, private sales, and beauty advice delivered to ${user.email}.`
               }
             </p>

             <button
               onClick={handleToggleNewsletter}
               disabled={subLoading || checkingSub}
               className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                 isSubscribed 
                   ? 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500' 
                   : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md hover:opacity-95'
               }`}
             >
               {subLoading ? (
                 <Loader2 className="size-3.5 animate-spin" />
               ) : isSubscribed ? (
                 'Unsubscribe'
               ) : (
                 <>
                   <Mail className="size-3.5" /> Join the Circle (1-Click)
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
