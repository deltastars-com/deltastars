import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Page } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface ProductsPageProps {
  setPage: (page: Page) => void;
  setSelectedProductId: (id: number) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ setPage, setSelectedProductId }) => {
  const { language } = useI18n();
  const {
    products,
    loading,
    currentPage,
    totalPages,
    selectedCategory,
    categories,
    changeCategory,
    goToPage,
    totalProducts,
  } = useProducts();

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    for (let i = start; i <= end; i++) range.push(i);
    if (start > 1) range.unshift(1, '...');
    if (end < totalPages) range.push('...', totalPages);
    return range;
  };

  // دالة مساعدة لعرض اسم القسم باللغة المناسبة (اختياري)
  const getCategoryLabel = (catKey: string) => {
    if (catKey === 'all') return language === 'ar' ? 'الكل' : 'All';
    // إذا كان catKey موجوداً بالعربية أو الإنجليزية نعرضه كما هو، أو يمكنك إضافة ترجمة إذا أردت
    return catKey;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-primary mb-2">
          {language === 'ar' ? 'سوق المنتجات الطازجة' : 'Fresh Products Market'}
        </h1>
        <p className="text-gray-500">
          {language === 'ar'
            ? 'نختار لك الأجود من المزارع الوطنية والعالمية بعناية فائقة'
            : 'We select the best from national and international farms with extreme care'}
        </p>
      </div>

      {/* أزرار الأقسام الديناميكية */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      {/* عرض المنتجات */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">
            {language === 'ar' ? 'لا توجد منتجات في هذا القسم' : 'No products in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {
                setSelectedProductId(product.id);
                setPage('productDetail');
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={idx} className="px-3 py-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => goToPage(page as number)}
                className={`w-10 h-10 rounded-full font-bold transition ${
                  currentPage === page
                    ? 'bg-primary text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {!loading && totalProducts > 0 && (
        <div className="text-center text-sm text-gray-400 mt-6">
          {language === 'ar'
            ? `عرض ${products.length} من ${totalProducts} منتج`
            : `Showing ${products.length} of ${totalProducts} products`}
        </div>
      )}
    </div>
  );
};
