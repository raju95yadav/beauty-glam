import { motion } from 'framer-motion';

const AnnouncementBar = () => {
  return (
    <div className="bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 py-1 text-center text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] border-b border-rose-100/50 dark:border-rose-900/30 transition-colors duration-300">
      <div className="container mx-auto px-4 overflow-hidden whitespace-nowrap">
        <p className="inline-block">
          Free Shipping on Orders Over ₹299 <span className="opacity-40 mx-2">•</span> 100% Authentic Products <span className="opacity-40 mx-2">•</span> Easy Returns
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
