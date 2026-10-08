import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Shield, Truck, RefreshCw, HelpCircle, Loader2, ChevronRight, Search, MessageCircle } from 'lucide-react';

const iconMap = {
  'order-tracking': Truck,
  'shipping-policy': Shield,
  'return-policy': RefreshCw,
  'faqs': HelpCircle
};

const SupportPage = () => {
  const { type = 'faqs' } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const Icon = iconMap[type] || HelpCircle;

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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#121214] transition-colors duration-300">
        <Loader2 className="size-10 text-[#C5A880] animate-spin" />
      </div>
    );
  }

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF9F6] dark:bg-[#121214] transition-colors duration-300">
       <div className="text-center space-y-5">
          <div className="size-16 bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl flex items-center justify-center mx-auto text-[#6E6D7A] border border-[#EFECE6] dark:border-[#2A2A2E]">
             <Search size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight">Content Not Found</h2>
          <Link to="/" className="inline-block bg-[#0D0D0D] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs">Return to Atelier</Link>
       </div>
    </div>
  );

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen transition-colors duration-300">
      {/* Header Tier */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] border-b border-[#EFECE6] dark:border-[#2A2A2E] pt-24 pb-12 md:pt-36 md:pb-16 transition-colors duration-300">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="flex items-center gap-5">
                  <div className="size-14 md:size-16 rounded-2xl flex items-center justify-center bg-[#FAF9F6] dark:bg-[#202024] text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm">
                     <Icon className="size-7 md:size-8" />
                  </div>
                  <div>
                     <h1 className="text-2xl md:text-4xl font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight leading-none mb-2">
                        {content.title}
                     </h1>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#C5A880] font-semibold uppercase tracking-[0.25em]">Atelier Concierge</span>
                        <div className="size-1 bg-[#EFECE6] dark:bg-[#2A2A2E] rounded-full"></div>
                        <span className="text-[10px] text-[#6E6D7A] dark:text-[#A1A1AA] font-semibold uppercase tracking-wider">Updated for 2026</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  {['order-tracking', 'shipping-policy', 'return-policy', 'faqs'].map((nav) => (
                    <Link 
                      key={nav} 
                      to={`/support/${nav}`}
                      className={`size-11 rounded-xl flex items-center justify-center transition-all ${
                        nav === type 
                          ? 'bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] shadow-sm' 
                          : 'bg-[#FAF9F6] dark:bg-[#202024] text-[#6E6D7A] hover:text-[#121214] dark:hover:text-white border border-[#EFECE6] dark:border-[#2A2A2E]'
                      }`}
                    >
                       {React.createElement(iconMap[nav], { size: 18 })}
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl py-10 md:py-16">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-8 space-y-6">
               {(content.sections || []).map((section, i) => (
                 <motion.section 
                    key={section.id || i} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm hover:border-[#C5A880] transition-all"
                 >
                    <div className="flex items-start gap-5">
                       <span className="text-xl md:text-2xl font-serif italic text-[#C5A880] leading-none pt-0.5">
                         {section.id < 10 ? `0${section.id}` : section.id}
                       </span>
                       <div className="space-y-2">
                          <h2 className="text-lg font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wide">{section.title}</h2>
                          <p className="text-[#6E6D7A] dark:text-[#A1A1AA] font-normal leading-relaxed text-sm">
                             {section.content}
                          </p>
                       </div>
                    </div>
                 </motion.section>
               ))}
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-3xl p-6 md:p-8 text-[#121214] dark:text-[#FAF9F6] space-y-6 sticky top-28 border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm">
                  <div className="space-y-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                        Personal Assistance
                     </span>
                     <p className="text-xl font-bold leading-tight uppercase tracking-tight">
                        Our Concierge <br/>
                        <span className="italic font-serif text-[#C5A880]">is at your disposal.</span>
                     </p>
                  </div>
                  
                  <div className="space-y-2.5">
                     <Link 
                       to="/contact"
                       className="w-full bg-[#FAF9F6] dark:bg-[#202024] hover:bg-[#EFECE6] dark:hover:bg-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-[#EFECE6] dark:border-[#2A2A2E]"
                     >
                        <MessageCircle size={16} className="text-[#C5A880]" /> Concierge Desk
                     </Link>
                     <Link 
                       to="/contact" 
                       className="w-full bg-[#0D0D0D] hover:bg-[#262626] dark:bg-[#FAF9F6] dark:hover:bg-white text-white dark:text-[#0D0D0D] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                     >
                        Submit Ticket <ChevronRight size={16} />
                     </Link>
                  </div>

                  <div className="pt-5 border-t border-[#EFECE6] dark:border-[#2A2A2E] space-y-2.5">
                     <p className="text-[10px] text-[#6E6D7A] dark:text-[#A1A1AA] font-bold uppercase tracking-wider">Average Response Time</p>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6E6D7A] dark:text-[#A1A1AA]">WhatsApp Desk</span>
                        <span className="text-[#C5A880] font-bold">&lt; 5 Mins</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6E6D7A] dark:text-[#A1A1AA]">Email Concierge</span>
                        <span className="text-[#121214] dark:text-[#FAF9F6] font-bold">~ 2 Hours</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SupportPage;
