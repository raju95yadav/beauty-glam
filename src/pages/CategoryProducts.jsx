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
        <div className="bg-gray-50/50 dark:bg-gray-950 min-h-screen pb-20 transition-colors duration-300">
            {/* Header / Breadcrumbs */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 py-3.5 max-w-7xl">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Home</Link>
                        <ChevronRight className="size-3" />
                        <span className="text-rose-600 dark:text-rose-400">{displayName}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-10 max-w-7xl">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-3">
                            {displayName}<span className="text-rose-600 dark:text-rose-400 px-2 italic font-serif">Collection</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Exploring {products.length} premium {displayName} products curated for you
                        </p>
                    </motion.div>
                    
                    <Link 
                        to="/products"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 transition-all shadow-sm w-fit"
                    >
                        <ArrowLeft className="size-4" /> View All Products
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
                            className="flex flex-col items-center justify-center py-28 bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 shadow-sm"
                        >
                            <div className="size-20 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 shadow-inner">
                                <ShoppingBag className="size-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">No Products Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 text-center max-w-xs">
                                We're currently updating our {displayName} inventory. Please check back soon!
                            </p>
                            <Link 
                                to="/products" 
                                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-rose-200 dark:shadow-none hover:scale-105 transition-all"
                            >
                                Explore Other Categories
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoryProducts;
