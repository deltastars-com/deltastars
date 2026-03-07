import React, { useState, useMemo, useEffect } from 'react';
import { Product, Page, Review, CategoryKey } from '../../../types';
import { ProductCard } from '../../ProductCard';
import { useI18n } from './I18nContext';
import { StarIcon, SparklesIcon } from './Icons';

interface ProductsPageProps {
  addToCart: (product: Product, quantity: number) => void;
  products: Product[];
  toggleWishlist: (product: Product) => void;
  isProductInWishlist: (productId: number) => boolean;
  setPage: (page: Page, productId?: number, category?: string) => void;
  getAverageRating: (productId: number) => { average: number; count: number };
  reviews: Review[];
  initialCategory?: CategoryKey | 'all';
}

const ALL_CATEGORIES_KEY = 'all';
const PRODUCTS_PER_PAGE = 250; // عرض كافة الـ 235 منتجاً في صفحة واحدة لضمان الشمولية

export const ProductsPage: React.FC<ProductsPageProps> = ({ 
    addToCart, products, toggleWishlist, isProductInWishlist, 
    setPage, getAverageRating, initialCategory = ALL_CATEGORIES_KEY 
}) => {
  const { t, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>(initialCategory);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCategory]);
  
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    return [ALL_CATEGORIES_KEY, ...categories];
  }, [products]);

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesCategory = selectedCategory === ALL_CATEGORIES_KEY || product.category === selectedCategory;
      const productName = language === 'ar' ? product.name_ar : product.name_en;
      return matchesCategory && productName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortableProducts = [...filtered];
    switch (sortOption) {
      case 'priceAsc': sortableProducts.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': sortableProducts.sort((a, b) => b.price - a.price); break;
    }
    return sortableProducts;
  }, [searchTerm, selectedCategory, sortOption, language, products]);

  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = sortedAndFilteredProducts.slice((currentPage-1)*PRODUCTS_PER_PAGE, currentPage*PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in text-black">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-4 bg-primary/5 px-8 py-3 rounded-full border border-primary/10 mb-6">
            <SparklesIcon className="w-5 h-5 text-secondary" />
            <span className="text-primary font-black text-xs uppercase tracking-widest">كتالوج 235 صنفاً معتمداً</span>
        </div>
        <h1 className="text-6xl font-black text-primary mb-4 tracking-tighter uppercase">{t('products.title')}</h1>
        <p className="text-2xl text-gray-400 font-bold max-w-2xl mx-auto">{t('products.subtitle')}</p>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl mb-16 flex flex-col lg:flex-row gap-8 border border-gray-100 items-center">
        <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-6 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-primary/10 font-black text-xl transition-all"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl opacity-20">🔍</span>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
              className="flex-1 lg:w-64 p-6 bg-gray-50 border-none rounded-3xl font-black text-lg focus:ring-4 focus:ring-primary/10 cursor-pointer appearance-none"
            >
              <option value={ALL_CATEGORIES_KEY}>{language === 'ar' ? 'كافة الأقسام' : 'All Categories'}</option>
              {uniqueCategories.filter(c => c !== ALL_CATEGORIES_KEY).map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="flex-1 lg:w-64 p-6 bg-gray-50 border-none rounded-3xl font-black text-lg focus:ring-4 focus:ring-primary/10 cursor-pointer appearance-none"
            >
              <option value="default">{t('products.sort.default')}</option>
              <option value="priceAsc">{t('products.sort.priceAsc')}</option>
              <option value="priceDesc">{t('products.sort.priceDesc')}</option>
            </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 min-h-[600px]">
        {currentProducts.length > 0 ? (
          currentProducts.map((p, index) => (
            <div key={p.id} className="stagger-item" style={{ animationDelay: `${index * 0.03}s` }}>
                <ProductCard 
                  product={p} 
                  onAddToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  isInWishlist={isProductInWishlist(p.id)}
                  setPage={setPage}
                  rating={getAverageRating(p.id)}
                />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-32 bg-white rounded-[5rem] shadow-inner border-4 border-dashed border-gray-100 animate-pulse">
            <span className="text-9xl block mb-8">📦</span>
            <p className="text-4xl font-black text-gray-300 uppercase tracking-tighter">{t('products.noResults')}</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-24 flex justify-center items-center gap-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-20 h-20 bg-white border-4 border-gray-50 rounded-full font-black disabled:opacity-20 hover:border-primary transition-all flex items-center justify-center shadow-xl group"
            >
              &larr;
            </button>
            <div className="flex items-center gap-4 flex-wrap justify-center max-w-2xl">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} onClick={() => setCurrentPage(i+1)}
                        className={`w-12 h-12 rounded-xl font-black transition-all ${currentPage === i+1 ? 'bg-primary text-white shadow-lg scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-20 h-20 bg-white border-4 border-gray-50 rounded-full font-black disabled:opacity-20 hover:border-primary transition-all flex items-center justify-center shadow-xl group"
            >
              &rarr;
            </button>
        </div>
      )}
    </div>
  );
};