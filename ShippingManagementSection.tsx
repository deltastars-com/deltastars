import React, { useState } from 'react';
import { useI18n, useToast } from './lib/contexts';
import { MapPinIcon, TruckIcon, PlusIcon, TrashIcon } from './lib/contexts/Icons';

export default function ShippingManagementSection() {
  const { language } = useI18n();
  const { addToast } = useToast();
  const [zones, setZones] = useState([
    { id: 1, name_ar: 'جدة - المنطقة المركزية', name_en: 'Jeddah - Central', price: 25, minOrder: 100 },
    { id: 2, name_ar: 'مكة المكرمة', name_en: 'Makkah', price: 35, minOrder: 150 },
    { id: 3, name_ar: 'الرياض', name_en: 'Riyadh', price: 50, minOrder: 200 },
  ]);

  const handleDelete = (id: number) => {
    setZones(zones.filter(z => z.id !== id));
    addToast(language === 'ar' ? 'تم حذف منطقة الشحن' : 'Shipping zone deleted', 'success');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary mb-2">إدارة الشحن والتوصيل 🚚</h2>
          <p className="text-gray-400 font-bold">تحديد مناطق التوصيل، أسعار الشحن، والحد الأدنى للطلبات</p>
        </div>
        <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
          <PlusIcon className="w-6 h-6" /> إضافة منطقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {zones.map(zone => (
          <div key={zone.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 flex justify-between items-center group hover:border-primary transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <MapPinIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{language === 'ar' ? zone.name_ar : zone.name_en}</h3>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">السعر: <span className="text-secondary">{zone.price} ر.س</span></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">الحد الأدنى: <span className="text-primary">{zone.minOrder} ر.س</span></span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(zone.id)}
              className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-primary p-12 rounded-[4rem] shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-2xl font-black">إعدادات الشحن العامة ⚙️</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">شحن مجاني للطلبات فوق</label>
              <input type="number" defaultValue={500} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl font-black outline-none focus:bg-white/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">وقت التوصيل المتوقع (ساعة)</label>
              <input type="number" defaultValue={24} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl font-black outline-none focus:bg-white/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">ضريبة القيمة المضافة (%)</label>
              <input type="number" defaultValue={15} className="w-full p-4 bg-white/10 border border-white/20 rounded-xl font-black outline-none focus:bg-white/20" />
            </div>
          </div>
          <button className="bg-secondary text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">حفظ الإعدادات العامة</button>
        </div>
      </div>
    </div>
  );
}
