import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Target, Users, Code, Globe, ShieldCheck, Zap, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, adminRes] = await Promise.all([
          api.get('/main/about'),
          api.get('/main/admin-contact')
        ]);
        setContent(aboutRes.data);
        setAdmin(adminRes.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#121214] transition-colors duration-300">
        <Loader2 className="size-10 text-[#C5A880] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen overflow-hidden transition-colors duration-300">
      {/* Hero Section - Editorial French Atelier */}
      <div className="relative pt-28 pb-20 md:pt-40 md:pb-32 bg-[#FAF9F6] dark:bg-[#121214] overflow-hidden border-b border-[#EFECE6] dark:border-[#2A2A2E] transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-[#C5A880]/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#0D0D0D]/5 dark:bg-[#FAF9F6]/5 rounded-full blur-[80px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#12121406_1px,transparent_1px),linear-gradient(to_bottom,#12121406_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFFFFF] dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full mb-6 shadow-sm"
          >
            <span className="size-2 rounded-full bg-[#C5A880]"></span>
            <span className="text-[#121214] dark:text-[#FAF9F6] text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em]">The Atelier Heritage</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter mb-6 text-[#121214] dark:text-[#FAF9F6] leading-none"
          >
            Our <span className="italic font-serif text-[#C5A880]">Story</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-[#6E6D7A] dark:text-[#A1A1AA] max-w-3xl mx-auto leading-relaxed font-normal"
          >
            {content?.company?.description || 'Crafting bespoke beauty rituals designed for discerning individuals worldwide.'}
          </motion.p>
        </div>
      </div>

      {/* Stats Section - French Atelier Surface */}
      <div className="relative -mt-10 md:-mt-16 z-20 container mx-auto px-4 max-w-6xl">
        <div className="bg-[#FFFFFF] dark:bg-[#18181B] shadow-xl shadow-black/[0.03] dark:shadow-none rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border border-[#EFECE6] dark:border-[#2A2A2E] transition-colors duration-300">
          {[
            { label: 'Happy Patrons', value: '10M+', icon: Heart },
            { label: 'Luxury Houses', value: '2500+', icon: Sparkles },
            { label: 'Boutiques', value: '150+', icon: Target },
            { label: 'Beauty Connoisseurs', value: '5000+', icon: Users }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
               <div className="size-12 md:size-16 bg-[#FAF9F6] dark:bg-[#202024] rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-[#121214] dark:text-[#FAF9F6] group-hover:bg-[#0D0D0D] group-hover:text-[#C5A880] transition-all duration-300 border border-[#EFECE6] dark:border-[#2A2A2E]">
                  <stat.icon className="size-6 md:size-7" />
               </div>
               <h3 className="text-2xl md:text-4xl font-bold text-[#121214] dark:text-[#FAF9F6] mb-1 tracking-tight">{stat.value}</h3>
               <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E6D7A] dark:text-[#A1A1AA]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-20 md:py-32 container mx-auto px-4 max-w-6xl">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8 md:space-y-10">
               <div className="space-y-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C5A880]">Core Philosophy</h2>
                  <p className="text-3xl md:text-5xl font-bold text-[#121214] dark:text-[#FAF9F6] leading-tight tracking-tight">
                    Elevating the Art of <span className="italic font-serif underline decoration-[#C5A880] decoration-2 underline-offset-8">Beauty</span>
                  </p>
               </div>
               <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-base md:text-lg leading-relaxed">
                  {content?.company?.story || 'We believe luxury lies in purity, transparency, and exquisite formulations curated for timeless grace.'}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-2">
                  {[
                    { title: 'Authenticity', icon: ShieldCheck, text: 'Direct curation from Parisian & global ateliers.' },
                    { title: 'Purity & Tech', icon: Zap, text: 'Clean formulations backed by clinical precision.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="size-11 shrink-0 bg-[#FAF9F6] dark:bg-[#202024] rounded-xl flex items-center justify-center text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E]">
                        <item.icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] mb-1">{item.title}</h4>
                        <p className="text-xs text-[#6E6D7A] dark:text-[#A1A1AA] leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative">
               <div className="aspect-[4/5] bg-[#FFFFFF] dark:bg-[#18181B] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden relative group shadow-xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800" 
                    alt="Luxury Beauty Atelier" 
                    className="size-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 p-6 md:p-8 bg-[#FFFFFF]/95 dark:bg-[#18181B]/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-lg border border-[#EFECE6] dark:border-[#2A2A2E]">
                     <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880] mb-1.5">Atelier Vision</p>
                     <p className="text-xs md:text-sm text-[#6E6D7A] dark:text-[#A1A1AA] font-normal leading-relaxed">{content?.company?.vision || 'Empowering effortless self-expression through modern editorial aesthetics.'}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Developer Spotlight */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] py-20 md:py-32 border-y border-[#EFECE6] dark:border-[#2A2A2E] relative overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 relative max-w-sm mx-auto md:max-w-none">
               <div className="absolute -top-10 -left-10 size-40 bg-[#C5A880]/15 rounded-full blur-3xl"></div>
               <div className="relative z-10 aspect-square max-w-sm mx-auto md:mx-0">
                 <div className="absolute inset-0 bg-[#0D0D0D] dark:bg-[#C5A880] rounded-[2.5rem] rotate-3 opacity-90"></div>
                 <div className="absolute inset-1 bg-[#FFFFFF] dark:bg-[#18181B] rounded-[2.3rem] overflow-hidden border border-[#EFECE6] dark:border-[#2A2A2E]">
                   {admin?.profilePic ? (
                     <img 
                       src={admin.profilePic} 
                       alt={content?.developer?.name || 'Architect'} 
                       className="size-full object-cover hover:scale-105 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="size-full bg-[#FAF9F6] dark:bg-[#202024] flex items-center justify-center text-[#6E6D7A]">
                        <Users className="size-24" strokeWidth={1} />
                     </div>
                   )}
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute -right-3 top-8 p-3 bg-[#FFFFFF] dark:bg-[#202024] shadow-md rounded-xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                    <Code className="text-[#C5A880] size-5" />
                 </div>
                 <div className="absolute -left-3 bottom-14 p-3 bg-[#FFFFFF] dark:bg-[#202024] shadow-md rounded-xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                    <Globe className="text-[#121214] dark:text-[#FAF9F6] size-5" />
                 </div>
               </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
               <div className="space-y-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C5A880]">The Architect</h2>
                  <h3 className="text-3xl md:text-5xl font-bold text-[#121214] dark:text-[#FAF9F6] tracking-tight leading-none">
                    {content?.developer?.name || 'Lead Technologist'}
                  </h3>
                  <p className="text-sm font-semibold text-[#6E6D7A] dark:text-[#A1A1AA] uppercase tracking-wider">{content?.developer?.role || 'Head of Engineering'}</p>
               </div>
               
               <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-base leading-relaxed italic border-l-0 md:border-l-2 border-[#C5A880] md:pl-5 bg-[#FAF9F6] dark:bg-[#202024] p-5 rounded-2xl md:rounded-r-2xl border border-[#EFECE6] dark:border-[#2A2A2E]">
                 "{content?.developer?.description || 'Crafting performant digital experiences with luxury editorial standards.'}"
               </p>

               <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                  {(content?.developer?.expertise || ['Full-Stack', 'Cloud Architecture', 'UX Luxury Design', 'API Systems']).map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-xl text-[10px] font-semibold uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] hover:border-[#C5A880] transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 md:py-36 bg-[#FAF9F6] dark:bg-[#121214] relative transition-colors duration-300">
         <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight leading-tight">
               Be part of our <span className="italic font-serif text-[#C5A880]">Evolution.</span>
            </h2>
            <p className="text-base md:text-lg text-[#6E6D7A] dark:text-[#A1A1AA] max-w-xl mx-auto">Discover the art of timeless aesthetics and join us in shaping modern cosmetic commerce.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
               <Link 
                 to="/careers"
                 className="bg-[#0D0D0D] hover:bg-[#262626] dark:bg-[#FAF9F6] dark:hover:bg-white text-white dark:text-[#0D0D0D] px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2"
               >
                  Join Our Team <ArrowRight size={14} />
               </Link>
               <Link 
                 to="/contact"
                 className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#121214] dark:text-[#FAF9F6] border border-[#EFECE6] dark:border-[#2A2A2E] hover:border-[#0D0D0D] dark:hover:border-[#C5A880] px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center"
               >
                  Partner With Us
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutPage;
