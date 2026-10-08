import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Briefcase, MapPin, Search, Loader2, Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/main/jobs');
        setJobs(response.data);
      } catch (err) {
        console.error('Job fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(j => 
    !searchQuery || 
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen pb-20 md:pb-32 transition-colors duration-300">
      {/* Hero */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] pt-24 pb-16 md:pt-40 md:pb-28 border-b border-[#EFECE6] dark:border-[#2A2A2E] relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A880]/10 -skew-x-12 translate-x-1/2 opacity-60"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] text-[10px] font-semibold uppercase tracking-[0.25em] rounded-full mb-6 md:mb-8"
          >
             <Star size={12} className="text-[#C5A880] fill-[#C5A880]" /> Shaping the Atelier
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight mb-6 leading-tight"
          >
            Careers at <span className="italic font-serif text-[#C5A880]">Glam Atelier</span>
          </motion.h1>
          <p className="text-base md:text-xl text-[#6E6D7A] dark:text-[#A1A1AA] max-w-2xl leading-relaxed">
            We are looking for visionary thinkers and craftspeople to build the world's most elegant luxury beauty destination.
          </p>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10 border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-8">
           <div className="space-y-1.5">
              <h2 className="text-[11px] font-bold text-[#C5A880] uppercase tracking-[0.3em]">Available Roles</h2>
              <p className="text-2xl md:text-3xl font-bold text-[#121214] dark:text-[#FAF9F6] tracking-tight">Open Opportunities</p>
           </div>
           <div className="relative group w-full md:min-w-[320px]">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search position or department..." 
                className="w-full bg-[#FFFFFF] dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] text-[#121214] dark:text-[#FAF9F6] placeholder-[#6E6D7A] dark:placeholder-[#A1A1AA] pl-11 pr-5 py-3.5 rounded-xl text-sm font-medium shadow-sm focus:border-[#0D0D0D] dark:focus:border-[#C5A880] outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6E6D7A] pointer-events-none group-focus-within:text-[#121214] dark:group-focus-within:text-[#FAF9F6] transition-colors" />
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center flex-col items-center py-28 gap-4 bg-[#FFFFFF] dark:bg-[#18181B] rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E]">
             <Loader2 className="size-10 text-[#C5A880] animate-spin" />
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6E6D7A]">Loading opportunities...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] dark:bg-[#18181B] rounded-3xl border border-[#EFECE6] dark:border-[#2A2A2E] p-8">
            <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-sm">No openings found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {filteredJobs.map((job) => (
              <motion.div 
                key={job.id || job._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedJob(job === selectedJob ? null : job)}
                className={`
                  bg-[#FFFFFF] dark:bg-[#18181B] p-6 md:p-8 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden
                  ${selectedJob === job ? 'border-[#0D0D0D] dark:border-[#C5A880] ring-2 ring-[#C5A880]/20' : 'border-[#EFECE6] dark:border-[#2A2A2E] hover:border-[#C5A880] hover:shadow-lg hover:shadow-black/[0.03]'}
                `}
              >
                 <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="space-y-2">
                       <span className="inline-block px-3 py-1 bg-[#FAF9F6] dark:bg-[#202024] text-[#6E6D7A] dark:text-[#A1A1AA] text-[10px] font-semibold uppercase tracking-wider rounded-md group-hover:bg-[#0D0D0D] group-hover:text-white transition-colors">
                         {job.department}
                       </span>
                       <h3 className="text-xl font-bold text-[#121214] dark:text-[#FAF9F6] tracking-tight">{job.title}</h3>
                    </div>
                    <div className="size-10 bg-[#FAF9F6] dark:bg-[#202024] rounded-xl flex items-center justify-center text-[#121214] dark:text-[#FAF9F6] group-hover:bg-[#0D0D0D] group-hover:text-[#C5A880] transition-all">
                       <ArrowRight size={18} />
                    </div>
                 </div>

                 <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-sm leading-relaxed mb-6 relative z-10 font-normal">
                   {job.description}
                 </p>

                 <div className="flex items-center gap-5 text-[10px] font-semibold uppercase tracking-wider text-[#6E6D7A] dark:text-[#A1A1AA] relative z-10">
                    <span className="flex items-center gap-1.5"><Briefcase className="size-3.5" /> Full-Time</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {job.location || 'Paris / Remote'}</span>
                 </div>

                 <AnimatePresence>
                   {selectedJob === job && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden border-t border-[#EFECE6] dark:border-[#2A2A2E] pt-6 mt-6 space-y-6"
                     >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] flex items-center gap-2">
                                <Sparkles size={12} className="text-[#C5A880]" /> Requirements
                              </h4>
                              <ul className="space-y-2">
                                 {(job.requirements || ['Experience in high-growth e-commerce', 'Keen eye for luxury design']).map((req, i) => (
                                   <li key={i} className="flex items-start gap-2 text-xs text-[#6E6D7A] dark:text-[#A1A1AA]">
                                      <CheckCircle2 size={13} className="text-[#C5A880] shrink-0 mt-0.5" />
                                      {req}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                           <div className="space-y-3">
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] flex items-center gap-2">
                                <Star size={12} className="text-[#C5A880]" /> Perks
                              </h4>
                              <ul className="space-y-2">
                                 {(job.perks || ['Competitive equity + salary', 'Annual luxury beauty allowance', 'Flexible hybrid policy']).map((perk, i) => (
                                   <li key={i} className="flex items-start gap-2 text-xs text-[#6E6D7A] dark:text-[#A1A1AA]">
                                      <CheckCircle2 size={13} className="text-[#C5A880] shrink-0 mt-0.5" />
                                      {perk}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                        <button className="w-full bg-[#0D0D0D] hover:bg-[#262626] dark:bg-[#FAF9F6] dark:hover:bg-white text-white dark:text-[#0D0D0D] py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md">
                           Submit Application
                        </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hiring Process */}
      <div className="container mx-auto px-4 max-w-6xl py-16 md:py-24">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/[0.02]"
         >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
               <div className="space-y-5">
                  <div className="inline-block px-3 py-1 bg-[#FAF9F6] dark:bg-[#202024] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full">
                     <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">Our Method</span>
                  </div>
                  <p className="text-3xl md:text-5xl font-bold text-[#121214] dark:text-[#FAF9F6] leading-tight tracking-tight">
                     The Path to <br/>
                     <span className="italic font-serif text-[#C5A880]">Excellence</span>
                  </p>
                  <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-sm leading-relaxed max-w-md">
                     Our process is thoughtful, direct, and tailored for exceptional individuals who take pride in meticulous execution.
                  </p>
               </div>
               
               <div className="space-y-3">
                  {[
                    { step: '01', title: 'Curated Portfolio Review', text: 'We review evidence of impact, precision, and passion.' },
                    { step: '02', title: 'Atelier Alignment', text: 'Discussion about our aesthetic philosophies and shared vision.' },
                    { step: '03', title: 'Practical Deep-Dive', text: 'Collaborative problem solving on live architectural challenges.' },
                    { step: '04', title: 'Offer & Induction', text: 'Welcome to the atelier to co-create the future of luxury beauty.' },
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="flex gap-5 p-3.5 rounded-2xl hover:bg-[#FAF9F6] dark:hover:bg-[#202024] transition-all"
                    >
                       <span className="text-xl md:text-2xl font-serif italic text-[#C5A880]">
                          {item.step}
                       </span>
                       <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wide">
                             {item.title}
                          </h4>
                          <p className="text-xs text-[#6E6D7A] dark:text-[#A1A1AA] leading-relaxed">
                             {item.text}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default CareersPage;
