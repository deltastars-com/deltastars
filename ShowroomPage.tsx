import React, { useState, useMemo } from 'react';
import { useI18n } from './lib/contexts';
import { SearchIcon, FilterIcon, ShoppingCartIcon, XIcon } from './lib/contexts/Icons';

interface ShowroomPageProps {
  items: any[];
  showroomBanner: string;
  setPage: (page: string) => void;
}

export function ShowroomPage({ items, showroomBanner, setPage }: ShowroomPageProps) {
  const { language, formatCurrency } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category));
    return ['all', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const name = language === 'ar' ? item.name_ar : item.name_en;
      const desc = language === 'ar' ? item.description_ar : item.description_en;
      const matchesSearch = name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            desc?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory, language]);

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={showroomBanner} 
          className="w-full h-full object-cover" 
          alt="Showroom Banner"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex items-end p-12">
          <div className="container mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter">صالة العرض الملكية</h2>
            <p className="text-xl md:text-2xl text-yellow-500 font-bold italic">{language === 'ar' ? 'شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة' : 'Your Ideal Partner for High-Quality Vegetables, Fruits & Dates'}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white p-8 rounded-[3rem] shadow-sovereign border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 relative w-full">
            <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full p-5 pr-16 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-2xl outline-none font-bold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-4 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}
              >
                {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-sovereign transition-all border border-gray-100 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={language === 'ar' ? item.name_ar : item.name_en}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-secondary text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg">
                  {item.category}
                </div>
                {item.is_featured && (
                  <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg animate-bounce">
                    {language === 'ar' ? 'مميز ⭐' : 'Featured ⭐'}
                  </div>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-primary mb-2">{language === 'ar' ? item.name_ar : item.name_en}</h3>
                <p className="text-gray-400 font-bold text-sm mb-6 line-clamp-2">{language === 'ar' ? item.description_ar : item.description_en}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">السعر</span>
                    <span className="text-2xl font-black text-secondary">{formatCurrency(item.price)}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(item)}
                    className="bg-primary text-white p-4 rounded-2xl hover:bg-secondary transition-all shadow-lg active:scale-90"
                  >
                    <ShoppingCartIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-4xl relative flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-8 left-8 z-10 bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-red-600 transition-all"
            >
              <XIcon className="w-8 h-8" />
            </button>
            
            <div className="flex-1 h-96 md:h-auto">
              <img 
                src={selectedProduct.image} 
                className="w-full h-full object-cover" 
                alt={language === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1 p-12 md:p-20 space-y-8">
              <div className="space-y-2">
                <span className="text-secondary font-black text-sm uppercase tracking-widest">{selectedProduct.category}</span>
                <h2 className="text-5xl font-black text-primary">{language === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}</h2>
              </div>
              
              <p className="text-xl text-gray-500 font-bold leading-relaxed">{language === 'ar' ? selectedProduct.description_ar : selectedProduct.description_en}</p>
              
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">السعر النهائي</span>
                  <span className="text-5xl font-black text-secondary">{formatCurrency(selectedProduct.price)}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">الرقم المرجعي</span>
                  <p className="text-xl font-black text-primary">#DS-{selectedProduct.id}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={() => {
                    setSelectedProduct(null);
                    setPage('vip_login');
                  }}
                  className="flex-1 bg-primary text-white py-6 rounded-3xl font-black text-2xl shadow-sovereign hover:bg-black transition-all"
                >
                  اطلب الآن 🚀
                </button>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="px-10 border-4 border-slate-100 rounded-3xl font-black text-gray-400 hover:bg-slate-50 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
