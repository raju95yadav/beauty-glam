import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut, Package, UserCircle, Search, Menu, X, Sparkles, Droplets, Wind, Diamond, Baby, Zap, Flower2, Bath, HeartPulse } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from '../ui/SearchBar';
import ThemeToggle from '../ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'GB';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="relative transition-all duration-300 border-b border-[#EFECE6] dark:border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-white/10 rounded-2xl text-[#121214] dark:text-[#FAF9F6] transition-all hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Luxury Logo */}
          <Link to="/" className="flex items-baseline gap-0.5 group shrink-0">
             <span className="text-2xl md:text-3xl font-black text-[#121214] dark:text-[#FAF9F6] tracking-tighter transition-colors group-hover:text-[#C5A880]">GLAM</span>
             <span className="text-[#C5A880] font-serif italic text-2xl md:text-3xl tracking-tight transition-transform group-hover:-translate-y-0.5 block">Beauty</span>
          </Link>

          {/* Premium Search Container */}
          <div className="hidden md:flex flex-grow max-w-2xl px-6 lg:px-12">
             <div className="w-full relative group">
                <SearchBar />
             </div>
          </div>

          {/* Elevated Actions */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            {/* Theme Toggle in Customer Navbar */}
            <ThemeToggle className="hidden sm:inline-flex" />
            <ThemeToggle variant="icon" className="sm:hidden" />

            {/* Profile Menu Trigger & Floating Glass Card */}
            <div 
              className="relative"
              onMouseEnter={() => user && setIsUserMenuOpen(true)}
              onMouseLeave={() => user && setIsUserMenuOpen(false)}
            >
              <button 
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    setIsUserMenuOpen(prev => !prev);
                  }
                }}
                className="flex items-center gap-2.5 p-1.5 md:p-2 hover:bg-[#EFECE6]/50 dark:hover:bg-white/5 rounded-2xl transition-all group cursor-pointer"
                aria-label="User account menu"
              >
                {user ? (
                  <div className="size-9 rounded-full bg-gradient-to-tr from-[#0D0D0D] to-[#C5A880] text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0 border border-[#C5A880]/30">
                    {getInitials(user.name)}
                  </div>
                ) : (
                  <div className="size-9 rounded-full bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-white/10 flex items-center justify-center text-[#6E6D7A] dark:text-[#FAF9F6] group-hover:bg-[#C5A880]/10 group-hover:text-[#0D0D0D] dark:group-hover:text-[#C5A880] transition-colors shadow-sm">
                    <User className="size-4.5" />
                  </div>
                )}
                <div className="hidden xl:block text-left min-w-0">
                  <p className="text-[9px] text-[#6E6D7A] font-bold uppercase tracking-[0.2em] mb-0.5">
                    {user ? 'Member' : 'Access'}
                  </p>
                  <p className="text-[11px] font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider truncate max-w-[100px]">
                    {user ? (user.name?.split(' ')[0] || 'Member') : 'Sign In'}
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {user && isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-white/95 dark:bg-[#18181B]/95 border border-[#EFECE6] dark:border-white/10 shadow-2xl rounded-2xl p-2 z-50 overflow-hidden"
                  >
                    {/* User Details Header Card */}
                    <div className="p-3 bg-[#FAF9F6] dark:bg-[#121214] rounded-xl mb-1.5 flex items-center gap-3 border border-[#EFECE6] dark:border-white/10">
                      <div className="size-10 rounded-full bg-gradient-to-tr from-[#0D0D0D] to-[#C5A880] text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0 border border-[#C5A880]/30">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider truncate">
                          {user.name || 'Member'}
                        </p>
                        <p className="text-[11px] text-[#6E6D7A] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items with Icons */}
                    <div className="space-y-0.5">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] hover:bg-[#FAF9F6] dark:hover:bg-white/5 uppercase tracking-wider rounded-xl transition-colors"
                      >
                        <UserCircle className="size-4 text-[#C5A880]" />
                        Account Details
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] hover:bg-[#FAF9F6] dark:hover:bg-white/5 uppercase tracking-wider rounded-xl transition-colors"
                      >
                        <Package className="size-4 text-[#C5A880]" />
                        Order History
                      </Link>
                      <Link 
                        to="/wishlist" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] hover:bg-[#FAF9F6] dark:hover:bg-white/5 uppercase tracking-wider rounded-xl transition-colors"
                      >
                        <Heart className="size-4 text-[#C5A880]" />
                        My Wishlist
                      </Link>
                    </div>

                    <div className="my-1.5 border-t border-[#EFECE6] dark:border-white/10" />

                    <button 
                      onClick={() => { logout(); navigate('/'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/wishlist" 
              className="size-10 md:size-11 rounded-2xl flex items-center justify-center text-[#121214] dark:text-[#FAF9F6] bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-white/10 hover:border-[#C5A880]/50 hover:text-[#C5A880] transition-all duration-300 hover:scale-105 active:scale-95 group relative hidden md:flex cursor-pointer shadow-sm"
              aria-label="View Wishlist"
            >
              <Heart className="size-4.5 transition-transform duration-300 group-hover:scale-110 group-hover:fill-[#C5A880] group-hover:text-[#C5A880]" />
            </Link>

            <Link 
              to="/cart" 
              className="relative flex items-center gap-2 h-10 md:h-11 px-3.5 md:px-4 rounded-2xl bg-[#0D0D0D] hover:bg-[#262626] dark:bg-[#FAF9F6] dark:text-[#0D0D0D] text-white font-medium shadow-md shadow-black/10 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] group cursor-pointer border border-[#0D0D0D]/10"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="size-4.5 transition-transform duration-300 group-hover:-rotate-6" />
              <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-wider">
                Bag
              </span>
              <span className="px-1.5 py-0.5 min-w-[20px] h-5 rounded-full bg-[#C5A880] text-[#0D0D0D] dark:bg-[#0D0D0D] dark:text-[#C5A880] text-[10px] font-black flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* High-Fidelity Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-950 z-[101] shadow-2xl overflow-y-auto rounded-r-[3rem]"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#121214] dark:text-[#FAF9F6] tracking-tight">GLAM</span>
                    <span className="text-[#C5A880] font-serif italic text-2xl tracking-tight">Atelier</span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-[#FAF9F6] dark:bg-[#202024] rounded-full hover:rotate-90 transition-transform">
                    <X className="size-5 text-[#6E6D7A]" />
                  </button>
                </div>

                <div className="mb-6 bg-[#FAF9F6] dark:bg-[#202024] rounded-2xl p-3 border border-[#EFECE6] dark:border-[#2A2A2E] focus-within:border-[#0D0D0D] transition-all">
                  <SearchBar onSearchSuccess={() => setIsMobileMenuOpen(false)} />
                </div>

                {/* Mobile Drawer Theme Switch */}
                <div className="mb-6">
                  <ThemeToggle variant="row" />
                </div>

                <nav className="space-y-6">
                  <div className="space-y-2.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6E6D7A] mb-4 px-2 flex items-center gap-2">
                       <Sparkles size={12} className="text-[#C5A880]" /> Curated Collections
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5">
                       {[
                         { name: 'Featured Products', path: '/products', primary: true, icon: Zap },
                         { name: 'Makeup', path: '/category/makeup', icon: Sparkles },
                         { name: 'Skin Care', path: '/category/skin', icon: Droplets },
                         { name: 'Hair Care', path: '/category/hair', icon: Wind },
                         { name: 'Fragrance', path: '/category/fragrance', icon: Flower2 },
                         { name: 'Luxe', path: '/category/luxe', icon: Diamond },
                         { name: 'Mom & Baby', path: '/category/mom-and-baby', icon: Baby },
                         { name: 'Men', path: '/category/men', icon: User },
                       ].map((item) => (
                         <Link 
                           key={item.name} 
                           to={item.path} 
                           onClick={() => setIsMobileMenuOpen(false)} 
                           className={`flex items-center gap-3.5 p-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                             item.primary ? 'bg-[#0D0D0D] text-white shadow-sm' : 'bg-[#FAF9F6] dark:bg-[#202024] text-[#121214] dark:text-[#FAF9F6] hover:text-[#C5A880]'
                           }`}
                         >
                           <item.icon className={`size-4 ${item.primary ? 'text-[#C5A880]' : 'text-[#6E6D7A]'}`} strokeWidth={2} />
                           {item.name}
                         </Link>
                       ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#EFECE6] dark:border-[#2A2A2E]">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6E6D7A] mb-4 px-2">Member Portal</h3>
                    {user ? (
                      <div className="grid grid-cols-1 gap-1">
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-xs font-semibold uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] hover:text-[#C5A880] transition-all">
                          <UserCircle className="size-5 text-[#6E6D7A]" /> Account Details
                        </Link>
                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-xs font-semibold uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] hover:text-[#C5A880] transition-all">
                          <Package className="size-5 text-[#6E6D7A]" /> Track Orders
                        </Link>
                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 text-xs font-semibold uppercase tracking-wider text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all rounded-xl mt-2">
                          <LogOut className="size-5" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block p-4 bg-[#0D0D0D] hover:bg-[#262626] dark:bg-[#FAF9F6] dark:hover:bg-white text-white dark:text-[#0D0D0D] text-center rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm">
                        Sign In / Join Atelier
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
