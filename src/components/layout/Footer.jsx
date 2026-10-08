import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Heart,
  Info,
  Briefcase,
  Phone,
  ShieldCheck,
  Package,
  Truck,
  RefreshCcw,
  HelpCircle
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email (e.g. name@gmail.com)');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/main/newsletter', { 
        email: email.trim(), 
        source: 'footer' 
      });

      if (data?.alreadySubscribed) {
        toast('You are already subscribed to the Beauty Circle!', {
          icon: '✨',
          style: {
            borderRadius: '12px',
            background: '#18181b',
            color: '#f43f5e',
          },
        });
      } else {
        toast.success(data?.message || 'Welcome to the Beauty Circle!');
        setSubscribed(true);
      }
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about', icon: Info },
        { label: 'Careers', path: '/careers', icon: Briefcase },
        { label: 'Contact Us', path: '/contact', icon: Phone },
        { label: 'Terms & Conditions', path: '/terms', icon: ShieldCheck },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Order Tracking', path: '/support/order-tracking', icon: Package },
        { label: 'Shipping Policy', path: '/support/shipping-policy', icon: Truck },
        { label: 'Return Policy', path: '/support/return-policy', icon: RefreshCcw },
        { label: 'FAQs', path: '/support/faqs', icon: HelpCircle },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-[#FAF9F6] dark:bg-[#121214] text-[#6E6D7A] dark:text-[#9E9EA7] pt-24 pb-12 overflow-hidden border-t border-[#EFECE6] dark:border-white/10 transition-colors duration-300">
      {/* Decorative Gradient Overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 max-w-7xl relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Branding Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <Link to="/">
                <h3 className="text-3xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tighter italic">
                  GLAM Beauty<span className="text-[#C5A880]">.</span>
                </h3>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs text-[#6E6D7A] dark:text-[#9E9EA7]">
                Your premier destination for luxury beauty. Curating the finest makeup, skincare, and wellness products since 2026.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[
                { 
                  name: 'Instagram',
                  icon: Instagram, 
                  href: 'https://www.instagram.com/rajuyd.94',
                  isExternal: true,
                  title: 'Instagram (@rajuyd.94)'
                },
                { 
                  name: 'Facebook',
                  icon: Facebook, 
                  href: '#',
                  onClick: (e) => {
                    e.preventDefault();
                    toast.error('Admin has not attached Facebook and Twitter link.');
                  },
                  title: 'Facebook'
                },
                { 
                  name: 'Twitter',
                  icon: Twitter, 
                  href: '#',
                  onClick: (e) => {
                    e.preventDefault();
                    toast.error('Admin has not attached Facebook and Twitter link.');
                  },
                  title: 'Twitter'
                },
                { 
                  name: 'Email',
                  icon: Mail, 
                  href: 'mailto:ridexplateform2026@gmail.com',
                  isExternal: false,
                  title: 'ridexplateform2026@gmail.com'
                }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href}
                  onClick={social.onClick}
                  target={social.isExternal ? "_blank" : undefined}
                  rel={social.isExternal ? "noopener noreferrer" : undefined}
                  title={social.title}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="size-10 rounded-xl bg-white dark:bg-[#18181B] flex items-center justify-center text-[#6E6D7A] hover:bg-[#0D0D0D] hover:text-[#C5A880] dark:hover:bg-[#FAF9F6] dark:hover:text-[#0D0D0D] transition-all border border-[#EFECE6] dark:border-white/10 cursor-pointer shadow-sm"
                >
                  <social.icon className="size-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, idx) => (
            <motion.div variants={itemVariants} key={idx} className="space-y-8">
              <h4 className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-[0.3em] italic border-b border-[#EFECE6] dark:border-white/10 pb-4 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-4 text-[13px] font-bold text-[#6E6D7A] hover:text-[#121214] dark:hover:text-[#FAF9F6] transition-all duration-300"
                    >
                      <div className="relative">
                        <span className="size-9 rounded-xl bg-white dark:bg-[#18181B] flex items-center justify-center text-[#6E6D7A] group-hover:bg-[#0D0D0D] group-hover:text-[#C5A880] dark:group-hover:bg-[#FAF9F6] dark:group-hover:text-[#0D0D0D] group-hover:-rotate-12 transition-all duration-500 border border-[#EFECE6] dark:border-white/10 shadow-sm">
                          <link.icon className="size-4" />
                        </span>
                        {/* Subtle Active Indicator */}
                        <span className="absolute -top-1 -right-1 size-2 bg-[#C5A880] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 border-2 border-white dark:border-[#121214]"></span>
                      </div>
                      <span className="uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h4 className="text-xs font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-[0.3em] italic border-b border-[#EFECE6] dark:border-white/10 pb-4 inline-block">
              Join the Circle
            </h4>
            <div className="space-y-6">
              <p className="text-sm text-[#6E6D7A] dark:text-[#9E9EA7]">Subscribe for early access to drops and exclusive beauty tips.</p>
              
              <form onSubmit={handleSubscribe} className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address" 
                  className="w-full bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-white/10 rounded-[2rem] px-8 py-5 text-[11px] font-bold text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A] focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all pr-14 shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-3.5 bg-[#0D0D0D] hover:bg-[#262626] text-white dark:bg-[#FAF9F6] dark:text-[#0D0D0D] rounded-2xl transition-all flex items-center justify-center disabled:opacity-50 shadow-md"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : subscribed ? (
                    <CheckCircle2 className="size-4 text-[#C5A880]" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </button>
              </form>

              {subscribed && (
                <p className="text-xs text-[#9E8055] dark:text-[#E0CFA9] font-bold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="size-3.5 flex-shrink-0 text-[#C5A880]" />
                  You're in! Welcome to the Beauty Circle.
                </p>
              )}
              
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#6E6D7A]">
                 <div className="size-5 rounded-full bg-[#C5A880]/15 flex items-center justify-center">
                    <Heart className="size-2.5 text-[#C5A880] fill-[#C5A880]" />
                 </div>
                 Join 10M+ beauty lovers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[#EFECE6] dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#6E6D7A]">
            &copy; {new Date().getFullYear()} Glam Boutique. All Rights Reserved.
          </p>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-[#6E6D7A]">
             <span className="hover:text-[#121214] dark:hover:text-[#FAF9F6] cursor-pointer transition-all hover:-translate-y-0.5">Privacy</span>
             <span className="hover:text-[#121214] dark:hover:text-[#FAF9F6] cursor-pointer transition-all hover:-translate-y-0.5">Terms</span>
             <span className="hover:text-[#121214] dark:hover:text-[#FAF9F6] cursor-pointer transition-all hover:-translate-y-0.5">Legal</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
