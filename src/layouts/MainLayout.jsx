import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import CategoryMenu from '../components/layout/CategoryMenu';
import Footer from '../components/layout/Footer';
import { useUI } from '../context/UIContext';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const { activeModal, closeModal } = useUI();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-rose-100 dark:selection:bg-rose-950/60 selection:text-rose-600 transition-colors duration-300">
      {/* Unified Luxury Glassmorphic Header Stack */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-950/90 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
        <AnnouncementBar />
        <Navbar />
        <CategoryMenu />
      </header>
      
      <main className="flex-grow">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      <Footer />
      
      {/* Global Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 text-gray-900 dark:text-white"
            >
              {/* Modal content based on activeModal */}
               <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
               >✕</button>
               {activeModal === 'login' && <div>Login Flow</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
