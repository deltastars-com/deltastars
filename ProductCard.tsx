import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-secondary/20"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={product.image_url}
            alt={product.name_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-sm">صورة غير متوفرة</span>
          </div>
        )}
        
        {/* أيقونة AR مصغرة – تم تصغيرها لتناسب التصميم */}
        <button 
          className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-full z-10 hover:bg-black/70 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            // هنا يمكن إضافة منطق الواقع المعزز لاحقاً
          }}
        >
          AR
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{product.name_ar}</h3>
        <p className="text-xs text-gray-400 mb-2 line-clamp-1">{product.name_en}</p>
        <div className="flex justify-between items-center mt-2">
          <div>                                                                          
            <span className="text-lg font-black text-primary">{product.price_1kg} ر.س</span>      
            <span className="text-xs text-gray-400 mr-1">/ كجم</span>
          </div>                                                                    
          <button                                                                    
            className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // هنا يمكن إضافة منطق إضافة إلى السلة
            }}                                                                    
          >
            أضف للسلة
          </button>                                                                    
        </div>                                                                    
      </div>                                                                    
    </div>                                                                    
  );                                                                    
};                                                                    
