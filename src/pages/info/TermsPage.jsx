import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, FileText, Lock, ShieldAlert, Scale, CreditCard, Truck, RefreshCw, AlertCircle, Eye } from 'lucide-react';

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using Glam Atelier, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. Our services are strictly for personal and non-commercial use. If you do not agree to these terms, please discontinue use immediately."
    },
    {
      icon: Lock,
      title: "2. Client Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. We reserve the right to terminate accounts that provide false information or violate our safety guidelines."
    },
    {
      icon: CreditCard,
      title: "3. Payments & Billing",
      content: "All transactions are processed through secure, encrypted gateways. We accept major credit/debit cards, UPI, and net banking. Prices are subject to change without notice, but changes will not affect orders already accepted."
    },
    {
      icon: Truck,
      title: "4. Shipping & Delivery",
      content: "Delivery timelines are estimates and not guarantees. We are not liable for delays caused by third-party logistics or force majeure events. Risk of loss passes to you upon delivery to the carrier."
    },
    {
      icon: RefreshCw,
      title: "5. Returns & Refunds",
      content: "Our returns policy is integrated herein. Items must be returned within 15 days in original condition. Refunds are issued to the original payment method and may take 5-7 business days to reflect."
    },
    {
      icon: Eye,
      title: "6. Intellectual Property",
      content: "All content—including logos, designs, text, and images—is the exclusive property of Glam Atelier and protected by international copyright laws. Unauthorized reproduction is strictly prohibited."
    },
    {
      icon: ShieldAlert,
      title: "7. Prohibited Conduct",
      content: "Users may not engage in data mining, use automated bots, or attempt to breach the site's security protocols. Any such action will result in immediate legal pursuit."
    },
    {
      icon: AlertCircle,
      title: "8. Limitation of Liability",
      content: "Glam Atelier shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services or products."
    },
    {
      icon: Scale,
      title: "9. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Patna, Bihar."
    },
    {
      icon: Gavel,
      title: "10. Modifications",
      content: "We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms."
    }
  ];

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen py-16 md:py-28 transition-colors duration-300">
       <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-black/[0.02] border border-[#EFECE6] dark:border-[#2A2A2E] flex flex-col md:flex-row gap-12 md:gap-16 transition-colors duration-300"
          >
             {/* Sidebar Info */}
             <div className="md:w-1/3 space-y-6">
                <div className="space-y-4">
                   <div className="size-14 md:size-16 bg-[#FAF9F6] dark:bg-[#202024] rounded-2xl flex items-center justify-center text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm">
                      <Gavel className="size-7 md:size-8" />
                   </div>
                   <h1 className="text-3xl md:text-4xl font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight leading-none">
                     Legal <br className="hidden md:block"/> 
                     <span className="italic font-serif text-[#C5A880]">Charter</span>
                   </h1>
                </div>
                
                <div className="p-6 bg-[#FAF9F6] dark:bg-[#202024] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880]">Edition</p>
                   <p className="text-xs font-bold text-[#121214] dark:text-[#FAF9F6] leading-relaxed">Version 2.4.0 <br/> Effective April 2026</p>
                   <div className="h-0.5 w-8 bg-[#C5A880] rounded-full"></div>
                   <p className="text-[11px] text-[#6E6D7A] dark:text-[#A1A1AA] leading-relaxed">Terms may be periodically revised to align with regulatory standards.</p>
                </div>

                <div className="space-y-2 pt-4">
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] border-l-2 border-[#C5A880] pl-3">Legal Department</p>
                   <p className="text-xs text-[#6E6D7A] dark:text-[#A1A1AA] pl-3">legal@glamportal.com</p>
                </div>
             </div>

             {/* Content Area */}
             <div className="md:w-2/3 space-y-10">
                <div>
                   <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-base leading-relaxed italic border-b border-[#EFECE6] dark:border-[#2A2A2E] pb-6">
                      "At Glam Atelier, we uphold absolute clarity, authenticity, and legal discretion across every client engagement."
                   </p>
                </div>

                <div className="space-y-8">
                   {sections.map((section, i) => (
                     <motion.section 
                       key={i}
                       initial={{ opacity: 0, x: 15 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.03 }}
                       className="group space-y-2"
                     >
                        <div className="flex items-center gap-3">
                           <div className="size-8 rounded-lg bg-[#FAF9F6] dark:bg-[#202024] flex items-center justify-center text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E]">
                              <section.icon size={15} />
                           </div>
                           <h2 className="text-base font-bold text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wide">{section.title}</h2>
                        </div>
                        <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-sm leading-relaxed pl-11">
                           {section.content}
                        </p>
                     </motion.section>
                   ))}
                </div>

                <div className="pt-10 border-t border-[#EFECE6] dark:border-[#2A2A2E] flex justify-between items-center">
                   <p className="text-[10px] font-bold text-[#6E6D7A] dark:text-[#A1A1AA] uppercase tracking-wider">Glam Atelier Legal © 2026</p>
                   <div className="flex gap-2">
                      <div className="size-2 bg-[#EFECE6] dark:bg-[#2A2A2E] rounded-full"></div>
                      <div className="size-2 bg-[#C5A880] rounded-full"></div>
                      <div className="size-2 bg-[#0D0D0D] dark:bg-[#FAF9F6] rounded-full"></div>
                   </div>
                </div>
             </div>
          </motion.div>
       </div>
    </div>
  );
};

export default TermsPage;
