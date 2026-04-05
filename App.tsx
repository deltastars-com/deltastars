import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingBag, Loader2 } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const DeltaStarsStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('id', { ascending: true });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-green-800"><Loader2 className="animate-spin mb-2" size={40}/> جاري تحميل الخيرات...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans" dir="rtl">
      <nav className="bg-green-800 text-white p-4 shadow-lg sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-black">نجوم دلتا للتجارة 🌟</h1>
        <ShoppingBag size={24} />
      </nav>

      <main className="p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <img src={p.image_url} className="h-32 w-full object-cover" alt={p.name_ar} />
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-xs text-green-900 mb-2 leading-tight h-8 overflow-hidden">{p.name_ar}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-orange-600 font-black text-sm">{p.price_1kg} <small className="text-[8px]">ر.س</small></span>
                  <button className="bg-green-700 text-white text-[10px] px-2 py-1 rounded-lg shadow-sm">إضافة</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-8 text-center text-gray-400 text-xs">جدة - شارع المنار | v2.5</footer>
    </div>
  );
};
export default DeltaStarsStore;
