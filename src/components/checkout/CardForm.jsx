import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, Calendar, Lock } from 'lucide-react';

const CardForm = ({ onValidChange, onSubmit, loading }) => {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    else return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') formattedValue = formatCardNumber(value);
    if (name === 'expiry') formattedValue = formatExpiry(value);
    if (name === 'cvv') formattedValue = value.substring(0, 3);

    const newData = { ...cardData, [name]: formattedValue };
    setCardData(newData);
    
    // Simple validation
    const isValid = 
      newData.number.replace(/\s/g, '').length === 16 && 
      newData.name.length > 2 && 
      newData.expiry.length === 5 && 
      newData.cvv.length === 3;
    
    onValidChange(isValid, newData);
  };

  const cardType = (number) => {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    return 'Generic';
  };

  return (
    <div className="space-y-12">
      {/* 3D Card Preview */}
      <div className="perspective-1000 h-56 w-full max-w-sm mx-auto">
        <motion.div
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
           className="relative w-full h-full preserve-3d cursor-pointer"
           onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-[#0D0D0D] rounded-3xl p-8 text-white shadow-2xl border border-[#2A2A2E] overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A880]/15 rounded-full blur-3xl -mr-32 -mt-32"></div>
             
             <div className="flex justify-between items-start mb-12">
                <div className="size-12 bg-gradient-to-br from-[#E2DDD5] via-[#C5A880] to-[#9E8055] rounded-xl shadow-inner flex items-center justify-center overflow-hidden border border-[#C5A880]/30">
                   <div className="w-full h-0.5 bg-black/20 my-1"></div>
                   <div className="w-full h-0.5 bg-black/20 my-1"></div>
                </div>
                <span className="text-xl font-black italic tracking-tighter text-[#C5A880]">{cardType(cardData.number)}</span>
             </div>

             <div className="space-y-8">
                <div className="text-2xl font-bold tracking-[0.2em] shadow-sm text-[#FAF9F6]">
                   {cardData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#6E6D7A]">Card Holder</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#FAF9F6]">{cardData.name || 'Your Name'}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#6E6D7A]">Expires</p>
                      <p className="text-xs font-bold tracking-widest text-[#FAF9F6]">{cardData.expiry || 'MM/YY'}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden bg-[#18181B] rounded-3xl text-white shadow-2xl border border-[#2A2A2E] rotate-y-180 flex flex-col justify-between py-8">
             <div className="w-full h-12 bg-black mt-4"></div>
             <div className="px-8 space-y-4">
                <div className="flex justify-end pr-4">
                   <div className="bg-[#FAF9F6] text-[#0D0D0D] px-4 py-2 rounded-lg font-mono font-bold tracking-widest">
                      {cardData.cvv || '•••'}
                   </div>
                </div>
                <p className="text-[8px] text-[#6E6D7A] leading-relaxed text-center uppercase tracking-wider">
                   TEST MODE — Simulated atelier payment demo
                </p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Form Inputs Header */}
      <div className="flex justify-between items-center px-1">
         <span className="text-[10px] font-black uppercase tracking-widest text-[#6E6D7A]">Card Details</span>
         <button
           type="button"
           onClick={() => {
             const demo = { number: '4111 1111 1111 1111', name: 'TEST USER', expiry: '12/28', cvv: '123' };
             setCardData(demo);
             onValidChange(true, demo);
           }}
           className="text-[10px] font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-widest hover:underline bg-[#FAF9F6] dark:bg-[#2A2A2E] px-3.5 py-1.5 rounded-full border border-[#EFECE6] dark:border-[#3E3E42] transition-all flex items-center gap-1.5"
         >
           <span className="text-[#C5A880]">⚡</span> Auto-fill Test Card
         </button>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="relative md:col-span-2 group">
            <input 
              type="text" 
              name="number"
              value={cardData.number}
              onChange={handleChange}
              onFocus={() => setIsFlipped(false)}
              maxLength="19"
              placeholder=" "
              className="peer w-full px-6 py-4 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-bold text-sm text-[#121214] dark:text-[#FAF9F6]"
            />
            <label className="absolute left-6 top-4 text-xs font-bold text-[#6E6D7A] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white dark:peer-focus:bg-[#18181B] peer-focus:px-2 peer-focus:text-[#121214] dark:peer-focus:text-[#FAF9F6] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-[#18181B] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-[#121214] dark:peer-[:not(:placeholder-shown)]:text-[#FAF9F6]">
               Card Number
            </label>
            <CreditCard className="absolute right-6 top-4 size-5 text-[#6E6D7A] peer-focus:text-[#C5A880] transition-colors" />
         </div>

         <div className="relative md:col-span-2 group">
            <input 
              type="text" 
              name="name"
              value={cardData.name}
              onChange={handleChange}
              onFocus={() => setIsFlipped(false)}
              placeholder=" "
              className="peer w-full px-6 py-4 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-bold text-sm text-[#121214] dark:text-[#FAF9F6]"
            />
            <label className="absolute left-6 top-4 text-xs font-bold text-[#6E6D7A] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white dark:peer-focus:bg-[#18181B] peer-focus:px-2 peer-focus:text-[#121214] dark:peer-focus:text-[#FAF9F6] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-[#18181B] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-[#121214] dark:peer-[:not(:placeholder-shown)]:text-[#FAF9F6]">
               Card Holder Name
            </label>
            <User className="absolute right-6 top-4 size-5 text-[#6E6D7A] peer-focus:text-[#C5A880] transition-colors" />
         </div>

         <div className="relative group">
            <input 
              type="text" 
              name="expiry"
              value={cardData.expiry}
              onChange={handleChange}
              onFocus={() => setIsFlipped(false)}
              maxLength="5"
              placeholder=" "
              className="peer w-full px-6 py-4 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-bold text-sm text-[#121214] dark:text-[#FAF9F6]"
            />
            <label className="absolute left-6 top-4 text-xs font-bold text-[#6E6D7A] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white dark:peer-focus:bg-[#18181B] peer-focus:px-2 peer-focus:text-[#121214] dark:peer-focus:text-[#FAF9F6] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-[#18181B] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-[#121214] dark:peer-[:not(:placeholder-shown)]:text-[#FAF9F6]">
               Expiry (MM/YY)
            </label>
            <Calendar className="absolute right-6 top-4 size-5 text-[#6E6D7A] peer-focus:text-[#C5A880] transition-colors" />
         </div>

         <div className="relative group">
            <input 
              type="password" 
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              onFocus={() => setIsFlipped(true)}
              maxLength="3"
              placeholder=" "
              className="peer w-full px-6 py-4 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-2xl focus:bg-white dark:focus:bg-[#18181B] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 outline-none transition-all font-bold text-sm text-[#121214] dark:text-[#FAF9F6]"
            />
            <label className="absolute left-6 top-4 text-xs font-bold text-[#6E6D7A] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white dark:peer-focus:bg-[#18181B] peer-focus:px-2 peer-focus:text-[#121214] dark:peer-focus:text-[#FAF9F6] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-[#18181B] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-[#121214] dark:peer-[:not(:placeholder-shown)]:text-[#FAF9F6]">
               CVV
            </label>
            <Lock className="absolute right-6 top-4 size-5 text-[#6E6D7A] peer-focus:text-[#C5A880] transition-colors" />
         </div>
      </div>
    </div>
  );
};

export default CardForm;
