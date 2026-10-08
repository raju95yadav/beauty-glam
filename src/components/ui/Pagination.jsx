import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2.5 rounded-full border border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`size-10 rounded-full border font-black text-xs transition-all cursor-pointer ${
            currentPage === page
              ? 'bg-[#0D0D0D] border-[#0D0D0D] dark:bg-[#FAF9F6] dark:border-[#FAF9F6] text-white dark:text-[#0D0D0D] shadow-md'
              : 'border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2.5 rounded-full border border-[#EFECE6] dark:border-[#2A2A2E] text-[#6E6D7A] hover:border-[#C5A880] hover:text-[#121214] dark:hover:text-[#FAF9F6] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};

export default Pagination;
