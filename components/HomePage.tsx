import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Page } from '../../types';

interface HomePageProps {
  setPage: (page: Page) => void;
  setSelectedProductId: (id: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setPage, setSelectedProductId }) => {
  const { language } = useI18n();

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/95 to-primary-dark/90 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2070&auto=format"
            alt="Fresh vegetables and fruits"
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-tight drop-shadow-2xl">
            Delta Stars
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة'
              : 'Your ideal partner for high-quality vegetables, fruits, and dates'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setPage('products')}
              className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-full font-black text-lg shadow-2xl transition-all transform hover:scale-105"
            >
              {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
            </button>
            <button
              onClick={() => setPage('sourcing')}
              className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-black text-lg transition-all"
            >
              {language === 'ar' ? 'طلب توريد خاص' : 'Special Sourcing'}
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>
    </div>
  );
};
