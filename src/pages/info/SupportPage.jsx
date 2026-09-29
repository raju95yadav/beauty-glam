import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Truck, RefreshCw, HelpCircle, Loader2, ChevronRight, Search, MessageCircle } from 'lucide-react';

const iconMap = {
  'order-tracking': Truck,
  'shipping-policy': Shield,
  'return-policy': RefreshCw,
  'faqs': HelpCircle
};

const colorMap = {
  'order-tracking': 'text-blue-600 bg-blue-50 border-blue-100',
  'shipping-policy': 'text-purple-600 bg-purple-50 border-purple-100',
  'return-policy': 'text-orange-600 bg-orange-50 border-orange-100',
  'faqs': 'text-rose-600 bg-rose-50 border-rose-100'
};

const SupportPage = () => {
  const { type } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const Icon = iconMap[type] || HelpCircle;
  const colors = colorMap[type] || colorMap['faqs'];

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/main/support/${type}`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching support content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
        <Loader2 className="size-12 text-rose-600 animate-spin" />
      </div>
    );
  }

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950 transition-colors duration-300">
       <div className="text-center space-y-6">
          <div className="size-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-600">
             <Search size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Content Not Found</h2>
          <Link to="/" className="inline-block bg-gray-900 dark:bg-rose-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">Return Home</Link>
       </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header Tier */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-24 pb-12 md:pt-32 md:pb-20 transition-colors duration-300">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-10">
               <div className="flex items-center gap-6 md:gap-8">
                  <div className={`size-16 md:size-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center border ${colors} shadow-xl shadow-gray-100 dark:shadow-none`}>
                     <Icon className="size-8 md:size-10" />
                  </div>
                  <div>
                     <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2 md:mb-3 italic">
                        {content.title}
                     </h1>
                     <div className="flex items-center gap-3 md:gap-4">
                        <span className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.3em]">Help Center</span>
                        <div className="size-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <span className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.3em]">Updated April 2026</span>
                     </div>
                  </div>
               </div>
               
               <div className="hidden lg:flex gap-3">
                  {['order-tracking', 'shipping-policy', 'return-policy', 'faqs'].map((nav) => (
                    <Link 
                      key={nav} 
                      to={`/support/${nav}`}
                      className={`size-12 rounded-2xl flex items-center justify-center transition-all ${nav === type ? 'bg-gray-900 dark:bg-rose-600 text-white shadow-lg rotate-12' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                       {React.createElement(iconMap[nav], { size: 20 })}
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl py-12 md:py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
               {content.sections.map((section, i) => (
                 <motion.section 
                    key={section.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none group hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                 >
                    <div className="flex items-start gap-6 md:gap-8">
                       <span className="text-3xl md:text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-rose-100 dark:group-hover:text-rose-950/60 transition-colors uppercase tracking-tighter italic leading-none pt-1 md:pt-2">
                         {section.id < 10 ? `0${section.id}` : section.id}
                       </span>
                       <div className="space-y-4 md:space-y-6">
                          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{section.title}</h2>
                          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-base md:text-lg">
                             {section.content}
                          </p>
                       </div>
                    </div>
                 </motion.section>
               ))}
            </div>

            <div className="lg:col-span-4 space-y-8">
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white dark:bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-gray-900 dark:text-white space-y-8 sticky top-32 border border-rose-100 dark:border-gray-800 shadow-2xl shadow-rose-100/40 dark:shadow-none relative overflow-hidden transition-all duration-300"
               >
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 size-48 bg-rose-100/50 dark:bg-rose-900/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="space-y-3 relative z-10">
                     <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-rose-600 dark:text-rose-400 inline-block px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-full border border-rose-200/60 dark:border-rose-500/20">
                        Need more help?
                     </span>
                     <p className="text-2xl md:text-3xl font-black leading-tight tracking-tighter uppercase italic pt-2">
                        Our concierge <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-500 dark:to-pink-400">is here for you.</span>
                     </p>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                     <button className="w-full bg-gray-50 dark:bg-white/10 hover:bg-rose-50/50 dark:hover:bg-white/20 text-gray-800 dark:text-white py-4 md:py-5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow hover:border-rose-200 active:scale-[0.98]">
                        <MessageCircle size={18} className="text-rose-600 dark:text-rose-400" /> Live Chat Now
                     </button>
                     <Link to="/contact" className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-4 md:py-5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-500/25 active:scale-[0.98]">
                        Submit a Ticket <ChevronRight size={18} />
                     </Link>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-4 relative z-10">
                     <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest italic">Average Response Times</p>
                     <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                        <span className="text-gray-500 dark:text-gray-400">Chat</span>
                        <span className="text-rose-600 dark:text-rose-400 font-black">2 Mins</span>
                     </div>
                     <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                        <span className="text-gray-500 dark:text-gray-400">Email</span>
                        <span className="text-gray-900 dark:text-white font-black">4 Hours</span>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SupportPage;
