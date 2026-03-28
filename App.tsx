import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- إعدادات النظام الموحدة ---
const SYSTEM_CONFIG = {
  BRAND_NAME: "نجوم دلتا للتجارة",
  SLOGAN: "شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة",
  PRIMARY_COLOR: "#1a3a1a",
  SECONDARY_COLOR: "#ca8a04", // Gold
  AUTH: {
    ADMIN: "marketing@deltastars-ksa.com",
    DEV: "deltastars@zoho.mail.com",
    ADMIN_PASS: "***733691903***%",
    DEV_PASS: "321666"
  }
};

export default function DeltaStarsSovereignApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([
    { id: 1, name: "تمور خلاص فاخر", price: 45, stock: 120, unit: "كجم", desc: "تمور من مزارع القصيم مباشرة" },
    { id: 2, name: "صندوق طماطم طازج", price: 25, stock: 85, unit: "صندوق", desc: "قطاف اليوم - نخب أول" }
  ]);
  const [finances, setFinances] = useState({ revenue: 12450, orders: 48, pending: 1200 });

  // --- نظام الأمان والأقفال الذكي ---
  const handleLogin = (email, pass) => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === SYSTEM_CONFIG.AUTH.ADMIN && pass === SYSTEM_CONFIG.AUTH.ADMIN_PASS) {
      setUser({ type: 'admin', email: cleanEmail, permissions: 'full' });
      setCurrentPage('dashboard');
    } else if (cleanEmail === SYSTEM_CONFIG.AUTH.DEV && pass === SYSTEM_CONFIG.AUTH.DEV_PASS) {
      setUser({ type: 'developer', email: cleanEmail, permissions: 'root' });
      setCurrentPage('dashboard');
    } else {
      alert("⚠️ وصول غير مصرح به! تأكد من البيانات.");
    }
  };

  // --- واجهة الهيدر الملكي ---
  const Header = () => (
    <header className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b-[4px] border-yellow-600 shadow-2xl font-['Tajawal']">
      <div className="container mx-auto h-24 px-6 flex items-center justify-between">
        <div className="flex flex-col cursor-pointer" onClick={() => setCurrentPage('home')}>
          <h1 className="text-3xl font-black text-[#1a3a1a] tracking-tighter leading-none">{SYSTEM_CONFIG.BRAND_NAME}</h1>
          <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{SYSTEM_CONFIG.SLOGAN}</span>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-100 p-2 px-6 rounded-full border border-gray-200">
              <span className="text-xs font-black text-[#1a3a1a]">{user.email}</span>
              {user.type === 'developer' && <button onClick={() => setCurrentPage('dev_console')} className="bg-yellow-500 p-2 rounded-lg animate-bounce" title="صلاحيات الجذر">⚙️</button>}
              <button onClick={() => {setUser(null); setCurrentPage('home');}} className="text-red-600 font-black text-xs border-r pr-4 border-gray-300">خروج</button>
            </div>
          ) : (
            <button onClick={() => setCurrentPage('login')} className="bg-[#1a3a1a] text-white px-8 py-3 rounded-full font-black text-sm hover:bg-yellow-600 transition-all shadow-lg border-b-4 border-green-900">دخول الإدارة 🔒</button>
          )}
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-['Tajawal',sans-serif] selection:bg-yellow-500 text-right" dir="rtl">
      <Header />
      
      <main className="pt-24">
        {/* --- الواجهة الرئيسية (Home) --- */}
        {currentPage === 'home' && (
          <section className="h-[90vh] flex items-center justify-center bg-[#1a3a1a] text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80')] bg-cover bg-center animate-pulse"></div>
            <div className="relative z-10 px-4">
              <h2 className="text-7xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl">نجوم دلتا</h2>
              <p className="text-2xl md:text-4xl font-bold text-yellow-500 mb-12 italic leading-relaxed max-w-4xl mx-auto">
                {SYSTEM_CONFIG.SLOGAN}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                 <button onClick={() => setCurrentPage('products')} className="bg-yellow-600 text-white px-12 py-5 rounded-full font-black text-3xl shadow-[0_20px_50px_rgba(202,138,4,0.4)] hover:scale-105 transition-all">تسوق الآن 🛒</button>
                 <button onClick={() => setCurrentPage('login')} className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-12 py-5 rounded-full font-black text-3xl hover:bg-white hover:text-black transition-all">بوابة الشركاء 🤝</button>
              </div>
            </div>
          </section>
        )}

        {/* --- نظام الدخول المحمي --- */}
        {currentPage === 'login' && (
          <div className="h-[80vh] flex items-center justify-center p-6 bg-slate-100">
            <div className="bg-white p-12 rounded-[3rem] shadow-4xl border-t-8 border-[#1a3a1a] w-full max-w-md">
              <h2 className="text-3xl font-black text-center mb-4">الدخول السيادي</h2>
              <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-widest">Sovereign Access Only</p>
              <input id="email" type="email" placeholder="البريد الإلكتروني" className="w-full p-5 mb-4 border-2 rounded-2xl focus:border-yellow-500 outline-none transition-all font-bold" />
              <input id="pass" type="password" placeholder="كلمة المرور" className="w-full p-5 mb-8 border-2 rounded-2xl focus:border-yellow-500 outline-none transition-all font-bold" />
              <button onClick={() => handleLogin(document.getElementById('email').value, document.getElementById('pass').value)} className="w-full bg-[#1a3a1a] text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all">تفعيل الدخول 🔑</button>
            </div>
          </div>
        )}

        {/* --- لوحة التحكم الشاملة (Dashboard) --- */}
        {currentPage === 'dashboard' && user && (
          <div className="p-10 container mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-12">
               <h2 className="text-5xl font-black text-[#1a3a1a]">لوحة إدارة نجوم دلتا</h2>
               <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-black text-sm">وضع {user.type === 'developer' ? 'الجذر' : 'المدير'} نشط</div>
            </div>

            {/* النظام المحاسبي المالي */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <div className="bg-white p-8 rounded-[2rem] shadow-xl border-b-8 border-emerald-500">
                  <p className="text-gray-400 font-bold mb-2">إجمالي المبيعات</p>
                  <h4 className="text-4xl font-black text-emerald-600">{finances.revenue} ر.س</h4>
               </div>
               <div className="bg-white p-8 rounded-[2rem] shadow-xl border-b-8 border-blue-500">
                  <p className="text-gray-400 font-bold mb-2">الطلبات النشطة</p>
                  <h4 className="text-4xl font-black text-blue-600">{finances.orders} طلب</h4>
               </div>
               <div className="bg-white p-8 rounded-[2rem] shadow-xl border-b-8 border-yellow-500">
                  <p className="text-gray-400 font-bold mb-2">مبالغ تحت التحصيل</p>
                  <h4 className="text-4xl font-black text-yellow-600">{finances.pending} ر.س</h4>
               </div>
            </div>

            {/* المخزون الذكي وإدارة المطور */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black">إدارة المخزون والتسعير الذكي 📦</h3>
                  {user.type === 'developer' && <button className="bg-black text-white px-6 py-2 rounded-xl text-xs font-bold">تحديث الأكواد البرمجية ⚡</button>}
               </div>
               <table className="w-full text-right">
                  <thead>
                     <tr className="text-gray-400 border-b-2">
                        <th className="py-4">المنتج</th>
                        <th>السعر (ر.س)</th>
                        <th>الكمية المتوفرة</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                     </tr>
                  </thead>
                  <tbody>
                     {inventory.map(item => (
                        <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                           <td className="py-6 font-black">{item.name}</td>
                           <td className="font-bold text-yellow-700">{item.price}</td>
                           <td className="font-bold">{item.stock} {item.unit}</td>
                           <td><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">نشط</span></td>
                           <td>          
                              <button className="text-blue-600 ml-4 font-bold">تعديل</button>
                              {user.type === 'developer' && <button className="text-red-600 font-bold">حذف</button>}
                           </td>          
                        </tr>          
                     ))}          
                  </tbody>          
               </table>          
            </div>          
          </div>          
        )}          
      </main>          
      
      {/* ستايل الخط العام لضمان تحسين الخط في كل المتصفحات */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
        body { font-family: 'Tajawal', sans-serif !important; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>          
  );          
}
