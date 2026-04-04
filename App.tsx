import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // تم التصحيح هنا لضمان عمل المكتبة
import { ShoppingBag, ShieldCheck, Truck, LayoutDashboard, Loader2 } from 'lucide-react';

/**
 * 🌟 نظام نجوم دلتا للتجارة - المحرك السيادي الموحد
 * الربط الشامل: GitHub -> Netlify -> Supabase
 * فرع جدة - شارع المنار
 */

// --- إعدادات الاتصال الآمنة ---
// تسحب القيم تلقائياً من Environment Variables في Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DeltaStarsSovereignApp = () => {
  const [products, setProducts] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات الحقيقية من Supabase (الخضروات والتمور)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // تأكد أن اسم الجدول في سوبابيس هو products
          .select('*');
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. نظام الدخول المحمي (Admin & Delegates)
  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data?.user) {
      setIsLogged(true);
      alert("تم دخول نظام نجوم دلتا بنجاح 🚀");
    } else {
      alert("بيانات الدخول غير صحيحة - يرجى مراجعة الإدارة");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-green-800">
        <Loader2 className="animate-spin mb-4" size={48} />
        <h2 className="text-xl font-bold">جاري تشغيل محرك نجوم دلتا...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans" dir="rtl">
      {/* واجهة المتجر السيادية */}
      <nav className="bg-green-800 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-full text-green-800">
             <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl font-black">نجوم دلتا للتجارة 🌟</h1>
        </div>
        <button 
          onClick={() => window.location.href='/admin'}
          className="hover:bg-green-700 p-2 rounded-full transition-colors"
        >
          <ShieldCheck size={28} />
        </button>
      </nav>

      <main className="p-6 max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black text-green-900 mb-2">منتجاتنا الطازجة</h2>
          <p className="text-gray-500">من مزارعنا في جدة - شارع المنار مباشرة إلى مائدتكم</p>
          <div className="h-1 w-24 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </header>

        {products.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">لا توجد منتجات معروضة حالياً في "الخزنة".. بانتظار إضافة أول صنف من Supabase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={item.image_url || 'https://via.placeholder.com/400x300?text=Delta+Stars'} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {item.category || 'طازج'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-green-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 h-12 overflow-hidden leading-relaxed">
                    {item.description || 'وصف المنتج غير متوفر حالياً'}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">السعر</span>
                      <span className="font-black text-2xl text-orange-600">{item.price} <small className="text-xs">ر.س</small></span>
                    </div>
                    <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg shadow-green-100">
                      إضافة للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white mt-20 p-10 border-t border-gray-100 text-center">
        <div className="flex justify-center gap-6 mb-4 text-green-800 opacity-50">
          <Truck size={24} />
          <LayoutDashboard size={24} />
        </div>
        <p className="text-gray-600 font-bold mb-2">مؤسسة نجوم دلتا للتجارة - جميع الحقوق محفوظة © 2026</p>
        <p className="text-xs text-gray-400">جدة - شارع المنار | نظام المطور المتكامل V2.1</p>
      </footer>
    </div>
  );
};

export default DeltaStarsSovereignApp;
