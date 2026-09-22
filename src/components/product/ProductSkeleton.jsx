import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900/80 rounded-2xl md:rounded-3xl p-3 md:p-3.5 border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse flex flex-col justify-between">
      {/* Image Skeleton with 3:4 Portrait Ratio */}
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl md:rounded-2xl mb-3.5"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-2.5 px-1 pb-1">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
          <div className="h-3 w-10 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full"></div>
        <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-800/60">
          <div className="h-5 w-20 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
          <div className="size-8 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
