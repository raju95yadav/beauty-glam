import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Mail, MessageSquare, Clock, Globe, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState({ phone: '917857873455', email: 'rajuglamsupport@gmail.com' });

  React.useEffect(() => {
    const fetchAdminContact = async () => {
      try {
        const { data } = await api.get('/main/admin-contact');
        if (data.phone) {
          setAdmin(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to fetch admin contact');
      }
    };
    fetchAdminContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/main/contact', formData);
      toast.success(response.data.message || 'Message received. We will respond shortly.');
      
      // WhatsApp Redirection
      const whatsappText = `Hello! I am ${formData.name}. %0A%0A${formData.message}%0A%0AMy Email: ${formData.email}`;
      const whatsappUrl = `https://wa.me/${admin.phone}?text=${whatsappText}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1200);

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
       toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-28 pb-16 md:pt-40 md:pb-28 bg-[#FFFFFF] dark:bg-[#18181B] overflow-hidden border-b border-[#EFECE6] dark:border-[#2A2A2E] transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#12121406_1px,transparent_1px),linear-gradient(to_bottom,#12121406_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
           <div className="absolute -top-24 left-1/4 size-72 bg-[#C5A880]/10 rounded-full blur-[90px]"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full mb-6 shadow-sm"
          >
            <span className="size-2 rounded-full bg-[#C5A880]"></span>
            <span className="text-[#121214] dark:text-[#FAF9F6] text-[10px] font-semibold uppercase tracking-[0.25em]">Concierge Desk</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight mb-5 leading-none"
          >
            Initiate a <span className="italic font-serif text-[#C5A880]">Dialogue</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-[#6E6D7A] dark:text-[#A1A1AA] max-w-xl mx-auto font-normal leading-relaxed"
          >
            Our dedicated atelier concierge is on standby to assist with bespoke inquiries, orders, and private consultations.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
           {/* Channels Column */}
           <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-[#FFFFFF] dark:bg-[#18181B] p-6 rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm space-y-4">
                   <div className="size-11 bg-[#FAF9F6] dark:bg-[#202024] rounded-xl flex items-center justify-center text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E]">
                      <Mail className="size-5" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wide">Email Concierge</h3>
                      <p className="text-xs text-[#6E6D7A] dark:text-[#A1A1AA]">Inquiries & order assistance</p>
                   </div>
                   <a href={`mailto:${admin.email}`} className="block text-sm font-bold text-[#121214] dark:text-[#FAF9F6] hover:text-[#C5A880] transition-colors break-all">
                     {admin.email}
                   </a>
                </div>

                <div className="bg-[#FFFFFF] dark:bg-[#18181B] p-6 rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm space-y-4">
                   <div className="size-11 bg-[#FAF9F6] dark:bg-[#202024] rounded-xl flex items-center justify-center text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E]">
                      <MessageSquare className="size-5" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wide">WhatsApp Desk</h3>
                      <p className="text-xs text-[#6E6D7A] dark:text-[#A1A1AA]">Real-time dispatch updates</p>
                   </div>
                   <a href={`https://wa.me/${admin.phone}`} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-[#121214] dark:text-[#FAF9F6] hover:text-[#C5A880] transition-colors">
                     +{admin.phone}
                   </a>
                </div>
              </div>

              {/* Atelier Details Card */}
              <div className="bg-[#FFFFFF] dark:bg-[#18181B] p-8 rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[#C5A880]">
                          <Clock size={16} />
                          <h4 className="text-[10px] font-bold uppercase tracking-wider">Operating Hours</h4>
                       </div>
                       <p className="text-xs text-[#121214] dark:text-[#FAF9F6] font-medium leading-relaxed">
                         Mon - Sat: 10:00 - 20:00<br/>
                         <span className="text-[#6E6D7A] dark:text-[#A1A1AA]">Sun: Priority Dispatch Only</span>
                       </p>
                    </div>

                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[#C5A880]">
                          <MapPin size={16} />
                          <h4 className="text-[10px] font-bold uppercase tracking-wider">Boutique Suite</h4>
                       </div>
                       <p className="text-xs text-[#121214] dark:text-[#FAF9F6] font-medium leading-relaxed">
                         Glam Atelier, Suite 2<br/>
                         Station Road, Patna 800001
                       </p>
                    </div>

                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[#C5A880]">
                          <Globe size={16} />
                          <h4 className="text-[10px] font-bold uppercase tracking-wider">Corporate</h4>
                       </div>
                       <p className="text-xs text-[#121214] dark:text-[#FAF9F6] font-medium leading-relaxed">
                         corporate@glamportal.com<br/>
                         <span className="text-[#6E6D7A] dark:text-[#A1A1AA]">Global Press & Retail</span>
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="lg:col-span-5">
              <div className="bg-[#FFFFFF] dark:bg-[#18181B] p-7 md:p-9 rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-md space-y-6">
                 <div className="space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-tight text-[#121214] dark:text-[#FAF9F6]">Send a Request</h2>
                    <p className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider">Average response within 2 hours</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6D7A] dark:text-[#A1A1AA]">Full Name</label>
                       <input 
                         type="text" 
                         required
                         placeholder="e.g. Camille Laurent"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A] focus:border-[#0D0D0D] dark:focus:border-[#C5A880] outline-none text-sm transition-all"
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6D7A] dark:text-[#A1A1AA]">Email Address</label>
                       <input 
                         type="email" 
                         required
                         placeholder="you@domain.com"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A] focus:border-[#0D0D0D] dark:focus:border-[#C5A880] outline-none text-sm transition-all"
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E6D7A] dark:text-[#A1A1AA]">Inquiry Details</label>
                       <textarea 
                         required
                         rows="4"
                         placeholder="How can our concierge assist you?"
                         value={formData.message}
                         onChange={(e) => setFormData({...formData, message: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A] focus:border-[#0D0D0D] dark:focus:border-[#C5A880] outline-none text-sm resize-none transition-all"
                       />
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0D0D0D] hover:bg-[#262626] dark:bg-[#FAF9F6] dark:hover:bg-white text-white dark:text-[#0D0D0D] font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Transmitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-3.5" /> Dispatch Message
                        </>
                      )}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
