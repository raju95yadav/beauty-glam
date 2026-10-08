import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';

const CategoryProducts = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const displayName = categoryName
        .split('-')
        .map(word => word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProductsByCategory(categoryName);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching category products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [categoryName]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="bg-[#FAF9F6] dark:bg-[#121214] min-h-screen pb-24 transition-colors duration-300">
            {/* Header / Breadcrumbs */}
            <div className="bg-white dark:bg-[#18181B] border-b border-[#EFECE6] dark:border-[#2A2A2E]">
                <div className="container mx-auto px-4 py-3.5 max-w-7xl">
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#6E6D7A] uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#121214] dark:hover:text-[#FAF9F6] transition-colors">Home</Link>
                        <ChevronRight className="size-3 text-[#C5A880]" />
                        <span className="text-[#121214] dark:text-[#FAF9F6] font-bold">{displayName}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-12 max-w-7xl">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A880] block mb-2">Editorial Atelier Curation</span>
                        <h1 className="text-4xl md:text-6xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-tight leading-none mb-3">
                            {displayName} <span className="text-[#C5A880] italic">Collection</span>
                        </h1>
                        <p className="text-[#6E6D7A] text-sm font-medium">
                            Displaying {products.length} bespoke {displayName.toLowerCase()} creations
                        </p>
                    </motion.div>
                    
                    <Link 
                        to="/products"
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#18181B] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full text-[11px] font-black uppercase tracking-wider text-[#121214] dark:text-[#FAF9F6] hover:border-[#C5A880] transition-all shadow-sm w-fit"
                    >
                        <ArrowLeft className="size-4 text-[#C5A880]" /> View All Creations
                    </Link>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="skeleton"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        >
                            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                        </motion.div>
                    ) : products.length > 0 ? (
                        <motion.div 
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        >
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-28 bg-white dark:bg-[#18181B] rounded-[3rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-sm text-center px-4"
                        >
                            <div className="size-20 bg-[#FAF9F6] dark:bg-[#2A2A2E] rounded-full flex items-center justify-center text-[#C5A880] mb-6 shadow-inner border border-[#EFECE6] dark:border-[#3E3E42]">
                                <ShoppingBag className="size-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-[#121214] dark:text-[#FAF9F6] uppercase tracking-wider mb-2">No Pieces Found</h3>
                            <p className="text-[#6E6D7A] text-sm mb-8 max-w-xs">
                                We are currently curating new {displayName} formulas for this season.
                            </p>
                            <Link 
                                to="/products" 
                                className="bg-[#0D0D0D] dark:bg-[#FAF9F6] text-white dark:text-[#0D0D0D] px-8 py-4 rounded-full font-black uppercase tracking-wider text-xs shadow-xl shadow-black/10 hover:bg-black dark:hover:bg-white transition-all"
                            >
                                Explore Full Catalogue
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoryProducts;
