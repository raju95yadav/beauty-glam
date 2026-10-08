import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="p-6 bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-[#FAF9F6] dark:bg-[#202024] flex items-center justify-center text-[#121214] dark:text-[#FAF9F6] font-bold text-sm uppercase border border-[#EFECE6] dark:border-[#2A2A2E]">
            {review?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-bold text-sm text-[#121214] dark:text-[#FAF9F6]">{review?.name || 'Verified Client'}</p>
            <p className="text-[10px] text-[#6E6D7A] dark:text-[#A1A1AA] font-medium">Verified Atelier Client • {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-[#202024] px-2.5 py-1 rounded-md text-[#C5A880] border border-[#EFECE6] dark:border-[#2A2A2E]">
          <span className="text-xs font-bold text-[#121214] dark:text-[#FAF9F6]">{review?.rating || 5}</span>
          <Star className="size-3 fill-[#C5A880] text-[#C5A880]" />
        </div>
      </div>
      <p className="text-[#6E6D7A] dark:text-[#A1A1AA] text-sm leading-relaxed">&quot;{review?.comment}&quot;</p>
      
      {/* Review Badges */}
      <div className="flex gap-2 mt-4">
        {['Authentic Formulation', 'Fast Shipping'].map((badge) => (
          <span key={badge} className="text-[9px] font-semibold text-[#6E6D7A] dark:text-[#A1A1AA] uppercase tracking-wider bg-[#FAF9F6] dark:bg-[#202024] px-2.5 py-1 rounded-md border border-[#EFECE6] dark:border-[#2A2A2E]">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
