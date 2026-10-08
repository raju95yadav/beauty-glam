import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { Search, Loader2 } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await productService.searchProducts(query);
        setProducts(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A880] block mb-2">Search Curation</span>
        <h1 className="text-2xl md:text-4xl font-black text-[#121214] dark:text-[#FAF9F6] flex items-center gap-3 tracking-tight">
          <Search className="text-[#C5A880] size-7" />
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-xs text-[#6E6D7A] font-medium mt-1 uppercase tracking-wider">{products.length} {products.length === 1 ? 'creation' : 'creations'} located</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="size-10 text-[#C5A880] animate-spin mb-4" />
          <p className="text-[#6E6D7A] font-bold text-xs uppercase tracking-widest">Searching the atelier catalogue...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-[#18181B] rounded-[3rem] border border-[#EFECE6] dark:border-[#2A2A2E] shadow-xl shadow-black/5 dark:shadow-none p-8">
          <p className="text-[#6E6D7A] mb-8 text-sm font-medium">We could not find any matches for &ldquo;{query}&rdquo;</p>
          <div className="max-w-md mx-auto">
             <h3 className="font-black text-[#121214] dark:text-[#FAF9F6] mb-4 uppercase tracking-widest text-[11px]">Recommended Inquiries:</h3>
             <div className="flex flex-wrap justify-center gap-2">
               {['Lipstick', 'Serum', 'Moisturizer', 'Perfume', 'Mascara', 'Sunscreen'].map((tag) => (
                 <button 
                   key={tag}
                   onClick={() => navigate(`/search?q=${tag}`)}
                   className="px-4 py-2 bg-[#FAF9F6] dark:bg-[#121214] border border-[#EFECE6] dark:border-[#2A2A2E] rounded-full text-xs font-bold text-[#121214] dark:text-[#FAF9F6] hover:border-[#C5A880] transition-all cursor-pointer"
                 >
                   {tag}
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
