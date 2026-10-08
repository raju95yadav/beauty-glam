import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-[#0D0D0D] text-[#FAF9F6] py-1.5 text-center text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] border-b border-[#262626] transition-colors duration-300">
      <div className="container mx-auto px-4 overflow-hidden whitespace-nowrap">
        <p className="inline-block">
          Free Shipping on Orders Over ₹299 <span className="text-[#C5A880] mx-2">•</span> 100% Authentic Products <span className="text-[#C5A880] mx-2">•</span> Easy Returns
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
