import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product, Page } from '../types';
import { ShoppingCartIcon, HeartIcon, StarIcon, SparklesIcon } from './lib/contexts/Icons';
import { useI18n } from './lib/contexts/I18nContext';
import { ArViewerModal } from './lib/ArViewerModal';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  setPage: (page: Page, productId?: number) => void;
  rating?: { average: number; count: number };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, toggleWishlist, isInWishlist, setPage, rating }) => {
  const { t, language, formatCurrency } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [showAr, setShowAr] = useState(false);

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productUnit = language === 'ar' ? product.unit_ar : product.unit_en;
  
  const handleCardClick = () => {
    setPage('productDetail', product.id);
  };

  const handleARView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAr(true);
  };

  const fallbackImg = "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop";

  return (
    <>
      {showAr && <ArViewerModal product={product} onClose={() => setShowAr(false)} />}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white rounded-[3.5rem] shadow-lg hover:shadow-[0_60px_120px_rgba(0,0,0,0.18)] transition-all duration-700 overflow-hidden flex flex-col group border border-gray-50 ProductCard"
      >
        {/* Image Container with Enhanced AR Discovery */}
        <div className="relative overflow-hidden cursor-pointer aspect-square" onClick={handleCardClick}>
          <img 
            src={imgError ? fallbackImg : product.image} 
            alt={productName} 
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 bg-gray-50" 
          />
          
          {/* Immersive AR Hover Overlay */}
          <div className="absolute inset-0 bg-primary/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex flex-col items-center justify-center p-8">
             <button
                onClick={handleARView}
                className="ar-launch-btn pointer-events-auto transform translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center gap-6 px-12 py-6 rounded-full bg-white text-primary border-4 border-secondary shadow-4xl hover:bg-secondary hover:text-white hover:scale-110 active:scale-95 transition-all duration-700"
              >
                <div className="bg-secondary/10 p-2.5 rounded-full text-secondary group-hover:bg-white group-hover:text-secondary animate-pulse">
                    <SparklesIcon className="w-7 h-7" />
                </div>
                <span className="text-lg font-black uppercase tracking-tighter pt-1">
                  {language === 'ar' ? 'فحص جودة AR' : 'AR QUALITY CHECK'}
                </span>
              </button>
          </div>

          {/* Floating Mini AR Badge (Discovery) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
             <div 
               onClick={handleARView}
               className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border-2 border-primary/5 hover:scale-110 hover:bg-secondary hover:text-white transition-all cursor-pointer group/badge relative overflow-hidden"
               title={language === 'ar' ? 'فحص الجودة بالواقع المعزز' : 'Quality Check via AR'}
             >
                <SparklesIcon className="w-8 h-8 text-secondary group-hover/badge:text-white animate-pulse" />
                <div className="absolute inset-0 scan-pulse-line opacity-10 pointer-events-none"></div>
             </div>
          </div>

          {/* Wishlist Toggle */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 pointer-events-auto z-20">
              <button
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                className={`p-4 rounded-full backdrop-blur-3xl transition-all duration-500 shadow-xl border border-white/10 ${
                  isInWishlist ? 'bg-red-500 text-white border-red-400' : 'bg-white/20 text-white hover:bg-white hover:text-red-500'
                }`}
              >
                <HeartIcon filled={isInWishlist} className="w-6 h-6" />
              </button>
          </div>

          {/* Quality Badge */}
          <div className="absolute bottom-6 left-6 bg-primary/90 backdrop-blur-md text-white text-[9px] font-black px-6 py-2.5 rounded-full shadow-2xl uppercase tracking-[0.4em] border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            Sovereign Standard
          </div>
        </div>

        <div className="p-10 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] text-primary font-black opacity-50 uppercase tracking-[0.3em]">{t(`categories.${product.category}`)}</span>
            <div className="flex items-center gap-1.5">
               <StarIcon filled className="w-4 h-4 text-yellow-400" />
               <span className="text-xs font-black text-slate-400 tracking-widest">5.00</span>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 flex-grow cursor-pointer line-clamp-2 leading-tight group-hover:text-primary transition-colors" onClick={handleCardClick}>{productName}</h3>
          
          {/* Details Section */}
          <div className="mb-6 grid grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-[2rem] border border-gray-100 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest mb-1">{language === 'ar' ? 'المصدر' : 'Origin'}</span>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-black text-slate-700">{product.origin_ar || '---'}</span>
                <span className="text-[9px] font-bold text-gray-400 italic">{product.origin_en || '---'}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest mb-1">{language === 'ar' ? 'الوحدة' : 'Unit'}</span>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-black text-slate-700">{product.unit_ar || '---'}</span>
                <span className="text-[9px] font-bold text-gray-400 italic">{product.unit_en || '---'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 bg-slate-50 p-6 rounded-[3rem] border border-gray-100 shadow-inner">
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{t('product.unit')}: <span className="text-slate-800">{productUnit}</span></p>
              <div className="flex items-center gap-6">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl font-black text-primary transition-all border border-transparent hover:border-gray-200 shadow-sm active:scale-90"
                  >-</button>
                  <span className="font-black text-2xl w-8 text-center text-primary">{quantity}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl font-black text-primary transition-all border border-transparent hover:border-gray-200 shadow-sm active:scale-90"
                  >+</button>
              </div>
          </div>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-primary tracking-tighter">{product.price > 0 ? formatCurrency(product.price) : '---'}</span>
            </div>
            <button 
              onClick={() => { onAddToCart(product, quantity); setQuantity(1); }}
              className="bg-primary text-white p-7 rounded-[3rem] hover:bg-secondary transition-all shadow-4xl hover:scale-110 active:scale-95 border-b-[8px] border-primary-dark active:border-b-0"
              aria-label={t('product.addToCart')}
            >
              <ShoppingCartIcon className="w-10 h-10" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};