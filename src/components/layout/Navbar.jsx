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
    <nav className="relative transition-all duration-300 border-b border-gray-100/70 dark:border-gray-800/70">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 bg-gray-100/80 dark:bg-gray-900/80 rounded-2xl text-gray-700 dark:text-gray-300 transition-all hover:scale-105 active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Luxury Logo */}
          <Link to="/" className="flex items-baseline gap-0.5 group shrink-0">
             <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter transition-colors group-hover:text-rose-600">GLAM</span>
             <span className="text-rose-600 font-serif italic text-2xl md:text-3xl tracking-tight transition-transform group-hover:-translate-y-0.5 block">Beauty</span>
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
                className="flex items-center gap-2.5 p-1.5 md:p-2 hover:bg-gray-100/80 dark:hover:bg-gray-900/80 rounded-2xl transition-all group cursor-pointer"
                aria-label="User account menu"
              >
                {user ? (
                  <div className="size-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                    {getInitials(user.name)}
                  </div>
                ) : (
                  <div className="size-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/40 group-hover:text-rose-600 transition-colors">
                    <User className="size-4.5" />
                  </div>
                )}
                <div className="hidden xl:block text-left min-w-0">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">
                    {user ? 'Member' : 'Access'}
                  </p>
                  <p className="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider truncate max-w-[100px]">
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
                    className="absolute right-0 mt-2 w-64 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl p-2 z-50 overflow-hidden"
                  >
                    {/* User Details Header Card */}
                    <div className="p-3 bg-gradient-to-r from-rose-50/80 to-amber-50/40 dark:from-rose-950/40 dark:to-gray-900/60 rounded-xl mb-1.5 flex items-center gap-3 border border-rose-100/50 dark:border-rose-900/30">
                      <div className="size-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider truncate">
                          {user.name || 'Member'}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items with Icons */}
                    <div className="space-y-0.5">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
                      >
                        <UserCircle className="size-4 text-gray-400 group-hover:text-rose-600" />
                        Account Details
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
                      >
                        <Package className="size-4 text-gray-400 group-hover:text-rose-600" />
                        Order History
                      </Link>
                      <Link 
                        to="/wishlist" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
                      >
                        <Heart className="size-4 text-gray-400 group-hover:text-rose-600" />
                        My Wishlist
                      </Link>
                    </div>

                    <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />

                    <button 
                      onClick={() => { logout(); navigate('/'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors uppercase tracking-wider cursor-pointer"
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
              className="p-2.5 text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 rounded-full transition-all relative group hidden md:flex"
              aria-label="View Wishlist"
            >
              <Heart className="size-5 group-hover:fill-current" />
            </Link>

            <Link 
              to="/cart" 
              className="relative p-2.5 bg-gray-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md group overflow-hidden"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-rose-600 text-[10px] font-black size-5 flex items-center justify-center rounded-full shadow-md ring-2 ring-gray-900 dark:ring-rose-600 animate-pulse">
                  {cartCount}
                </span>
              )}
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
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">GLAM</span>
                    <span className="text-rose-600 font-serif italic text-2xl tracking-tight">Portal</span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-full hover:rotate-90 transition-transform">
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-6 bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-rose-500 transition-all">
                  <SearchBar onSearchSuccess={() => setIsMobileMenuOpen(false)} />
                </div>

                {/* Mobile Drawer Theme Switch */}
                <div className="mb-8">
                  <ThemeToggle variant="row" />
                </div>

                <nav className="space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2 flex items-center gap-2">
                       <Sparkles size={12} className="text-rose-400" /> Curated Collections
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
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
                           className={`flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                             item.primary ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-rose-600'
                           }`}
                         >
                           <item.icon className={`size-4 ${item.primary ? 'text-rose-400' : 'text-gray-400'}`} strokeWidth={2.5} />
                           {item.name}
                         </Link>
                       ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-gray-900">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-2">Member Portal</h3>
                    {user ? (
                      <div className="grid grid-cols-1 gap-1">
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 text-[11px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-rose-600 transition-all">
                          <UserCircle className="size-5" /> Account Details
                        </Link>
                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 text-[11px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-rose-600 transition-all">
                          <Package className="size-5" /> Track Orders
                        </Link>
                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 text-[11px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all rounded-2xl mt-4">
                          <LogOut className="size-5" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block p-5 bg-rose-600 text-white text-center rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-rose-200">
                        Sign In / Join Now
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
