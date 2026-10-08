import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black text-[#EFECE6] dark:text-[#2A2A2E] mb-4 select-none tracking-tighter">404</h1>
        <h2 className="text-3xl font-black text-[#121214] dark:text-[#FAF9F6] mb-4 tracking-tight">Ooops! Page Not Found</h2>
        <p className="text-[#6E6D7A] mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          The page you are looking for might have been moved, had its luxury curation updated, or is temporarily unavailable.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] font-black px-8 py-3.5 rounded-full hover:bg-black dark:hover:bg-white transition-all uppercase text-xs tracking-widest shadow-xl shadow-black/10 active:scale-95"
          >
            <Home className="size-4 text-[#C5A880]" />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#121214] dark:text-[#FAF9F6] bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] hover:border-[#C5A880] font-black px-8 py-3.5 rounded-full transition-all uppercase text-xs tracking-widest active:scale-95"
          >
            <ArrowLeft className="size-4 text-[#6E6D7A]" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
