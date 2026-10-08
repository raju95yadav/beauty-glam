import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Droplets, 
  Wind, 
  Flower2, 
  Bath, 
  Baby, 
  HeartPulse, 
  User, 
  Diamond 
} from 'lucide-react';

const categories = [
  { name: 'Makeup', icon: Sparkles },
  { name: 'Skin Care', icon: Droplets },
  { name: 'Hair Care', icon: Wind },
  { name: 'Fragrance', icon: Flower2 },
  { name: 'Personal Care', icon: Bath },
  { name: 'Mom & Baby', icon: Baby },
  { name: 'Health & Wellness', icon: HeartPulse },
  { name: 'Men', icon: User },
  { name: 'Luxe', icon: Diamond }
];

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 }
};

const CategoryMenu = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-transparent transition-colors duration-300"
    >
      <div className="max-w-[1240px] mx-auto px-4">
        <ul className="flex items-center justify-between h-11 overflow-x-auto no-scrollbar gap-5 md:gap-7">
          {categories.map((category) => (
            <motion.li 
              key={category.name} 
              variants={itemVariants}
              className="group relative flex-shrink-0"
            >
              <Link
                to={`/category/${category.name.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`}
                className="flex items-center gap-2 text-[11px] md:text-[12px] font-semibold text-[#6E6D7A] hover:text-[#121214] dark:text-[#9E9EA7] dark:hover:text-[#FAF9F6] transition-colors duration-200 uppercase tracking-wider py-2.5 block whitespace-nowrap"
              >
                <category.icon className="size-3.5 text-[#6E6D7A] dark:text-[#9E9EA7] group-hover:text-[#C5A880] transition-colors" strokeWidth={2} />
                {category.name}
              </Link>
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-[#C5A880] rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.2 }}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CategoryMenu;

