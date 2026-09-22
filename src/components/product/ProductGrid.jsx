import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const ProductGrid = ({ products, loading, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4 md:gap-6`}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 px-4'} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
