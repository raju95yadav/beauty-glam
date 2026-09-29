import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Target, Users, Code, Globe, ShieldCheck, Zap, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
        <Loader2 className="size-12 text-rose-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen overflow-hidden transition-colors duration-300">
      {/* Hero Section - Luxury Gradient */}
      <div className="relative pt-28 pb-20 md:pt-44 md:pb-36 bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden border-b border-rose-100/60 dark:border-gray-800 transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-rose-300/30 dark:bg-rose-600/20 rounded-full blur-[90px] md:blur-[140px] animate-pulse"></div>
           <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-purple-300/25 dark:bg-purple-600/15 rounded-full blur-[70px] md:blur-[120px]"></div>
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-5 py-2 bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 rounded-full mb-6 shadow-sm"
          >
            <span className="text-rose-600 dark:text-rose-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">The Heritage of Beauty</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-6 text-gray-900 dark:text-white italic leading-none drop-shadow-sm"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 dark:from-rose-500 dark:to-purple-500">Story</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            {content?.company.description}
          </motion.p>
        </div>
      </div>

      {/* Stats Section - Premium Grid */}
      <div className="relative -mt-10 md:-mt-16 z-20 container mx-auto px-4 max-w-6xl">
        <div className="bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/50 dark:shadow-none rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
          {[
            { label: 'Happy Customers', value: '10M+', icon: Heart },
            { label: 'Beauty Brands', value: '2500+', icon: Sparkles },
            { label: 'Locations', value: '150+', icon: Target },
            { label: 'Experts', value: '5000+', icon: Users }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
               <div className="size-12 md:size-16 bg-gray-50 dark:bg-gray-800 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 md:mb-6 text-gray-900 dark:text-gray-100 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 dark:border-gray-700">
                  <stat.icon className="size-6 md:size-8" />
               </div>
               <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{stat.value}</h3>
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-20 md:py-32 container mx-auto px-4 max-w-6xl">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8 md:space-y-10">
               <div className="space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-rose-600 dark:text-rose-400 italic">Core Philosophy</h2>
                  <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter uppercase italic">Redefining the <span className="underline decoration-rose-500 decoration-8 underline-offset-8">Standard</span></p>
               </div>
               <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
                  {content?.company.story}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  {[
                    { title: 'Authenticity', icon: ShieldCheck, text: 'Direct sourcing from brands.' },
                    { title: 'Innovation', icon: Zap, text: 'Tech-driven beauty curation.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="size-10 md:size-12 shrink-0 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                        <item.icon className="size-5 md:size-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest text-gray-900 dark:text-white mb-1">{item.title}</h4>
                        <p className="text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative group shadow-2xl border border-gray-100 dark:border-gray-800">
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800" 
                    alt="Luxury Beauty" 
                    className="size-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100"
                  />
                  <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 p-6 md:p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-2 italic">Vision 2026</p>
                     <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{content?.company.vision}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Developer Spotlight - ADVANCED SECTION */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-20 md:py-32 border-y border-gray-100 dark:border-gray-800/80 relative overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 relative max-w-sm mx-auto md:max-w-none">
               <div className="absolute -top-10 -left-10 size-40 bg-rose-200/30 dark:bg-rose-900/20 rounded-full blur-3xl"></div>
               <div className="relative z-10 aspect-square max-w-sm mx-auto md:mx-0">
                 <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-[2.5rem] md:rounded-[3.5rem] rotate-6"></div>
                 <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                   {admin?.profilePic ? (
                     <img 
                       src={admin.profilePic} 
                       alt={content?.developer.name} 
                       className="size-full object-cover hover:scale-105 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="size-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-200 dark:text-gray-600">
                        <Users className="size-20 md:size-32" strokeWidth={1} />
                     </div>
                   )}
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute -right-4 top-10 p-3 md:p-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 animate-bounce">
                    <Code className="text-rose-500 size-5 md:size-6" />
                 </div>
                 <div className="absolute -left-4 bottom-20 p-3 md:p-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 animate-pulse delay-700">
                    <Globe className="text-purple-500 size-5 md:size-6" />
                 </div>
               </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
               <div className="space-y-4">
                  <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-rose-600 dark:text-rose-400 italic">The Architect</h2>
                  <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic uppercase">
                    {content?.developer.name}
                  </h3>
                  <p className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{content?.developer.role}</p>
               </div>
               
               <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed italic border-l-0 md:border-l-4 border-rose-500 md:pl-6 bg-rose-50/30 dark:bg-rose-950/20 md:bg-rose-50/20 p-6 md:py-4 rounded-2xl md:rounded-r-2xl mx-auto md:mx-0 max-w-md md:max-w-none border border-rose-100/50 dark:border-rose-900/30">
                 "{content?.developer.description}"
               </p>

               <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                  {content?.developer.expertise.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:border-rose-500 dark:hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-default shadow-sm"
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
      <div className="py-24 md:py-40 bg-white dark:bg-gray-950 relative transition-colors duration-300">
         <div className="container mx-auto px-4 max-w-4xl text-center space-y-8 md:space-y-12">
            <h2 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none italic">
               Be part of our <br className="md:hidden" /> <span className="text-rose-600 dark:text-rose-500">Evolution.</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 dark:text-gray-500 font-medium max-w-2xl mx-auto">Join us as we redefine the digital beauty landscape across the globe.</p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
               <button className="bg-gray-900 dark:bg-rose-600 text-white px-10 py-5 md:px-12 md:py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-rose-600 dark:hover:bg-rose-700 transition-all shadow-xl shadow-gray-200 dark:shadow-none">
                  Join Our Team
               </button>
               <button className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 px-10 py-5 md:px-12 md:py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:border-gray-900 dark:hover:border-rose-500 transition-all">
                  Partner with us
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutPage;
