import React from 'react';
import { COMPANY_INFO, SOCIAL_LINKS } from './constants';
import { PhoneIcon, GlobeIcon, MapPinIcon, MessageCircleIcon } from './lib/contexts/Icons';

export function ContactPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary text-white py-32 border-b-[10px] border-secondary text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80')] bg-cover"></div>
        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">تواصل معنا</h2>
          <p className="text-xl md:text-2xl text-yellow-500 font-bold italic">نحن هنا لخدمتكم على مدار الساعة</p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sovereign border border-gray-100 space-y-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary">
                <PhoneIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">اتصل بنا</h3>
                <p className="text-gray-400 font-bold text-sm">الخط الأرضي: {COMPANY_INFO.phone}</p>
                <p className="text-gray-400 font-bold text-sm">واتساب: {COMPANY_INFO.whatsapp}</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sovereign border border-gray-100 space-y-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary">
                <GlobeIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">البريد الإلكتروني</h3>
                <p className="text-gray-400 font-bold text-sm">{COMPANY_INFO.email}</p>
                <p className="text-gray-400 font-bold text-sm">INFO@DELTASTARS-KSA.COM</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sovereign border border-gray-100 space-y-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary">
                <MapPinIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-primary">الموقع الرئيسي</h3>
                <p className="text-gray-400 font-bold text-sm">{COMPANY_INFO.address}</p>
                <a href="https://maps.app.goo.gl/ZHoiZKmkuj4no2vg8" target="_blank" rel="noreferrer" className="text-secondary font-black text-xs underline">عرض على الخريطة 📍</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-12 md:p-20 rounded-[4rem] shadow-sovereign border border-gray-100">
            <h3 className="text-4xl font-black text-primary mb-12">أرسل لنا رسالة ✉️</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الاسم الكامل</label>
                <input type="text" placeholder="أدخل اسمك هنا" className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-2xl outline-none font-bold transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">البريد الإلكتروني</label>
                <input type="email" placeholder="example@mail.com" className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-2xl outline-none font-bold transition-all" />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الموضوع</label>
                <input type="text" placeholder="كيف يمكننا مساعدتك؟" className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-2xl outline-none font-bold transition-all" />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الرسالة</label>
                <textarea rows={6} placeholder="اكتب رسالتك بالتفصيل..." className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-2xl outline-none font-bold transition-all resize-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="button" className="w-full bg-primary text-white py-6 rounded-3xl font-black text-2xl shadow-sovereign hover:bg-black transition-all">إرسال الرسالة 🚀</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-6 mt-24">
        <div className="bg-white p-4 rounded-[4rem] shadow-sovereign border border-gray-100 overflow-hidden h-[500px] relative group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.123456789!2d39.2238!3d21.5678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM0JzA0LjEiTiAzOcKwMTMnMjUuNyJF!5e0!3m2!1sen!2ssa!4v1620000000000!5m2!1sen!2ssa" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[3.5rem]"
          ></iframe>
          <div className="absolute top-10 right-10 bg-primary text-white p-6 rounded-3xl shadow-2xl border-b-4 border-secondary pointer-events-none opacity-0 group-hover:opacity-100 transition-all">
            <h4 className="font-black text-xl mb-2">فرع جدة الرئيسي</h4>
            <p className="text-xs font-bold text-yellow-500">شارع المنار، جدة، المملكة العربية السعودية</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="container mx-auto px-6 mt-24">
        <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100 text-center space-y-12">
          <h3 className="text-3xl font-black text-primary">تابعنا على منصات التواصل الاجتماعي</h3>
          <div className="flex flex-wrap justify-center gap-10">
            {Object.entries(SOCIAL_LINKS).map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all shadow-lg border border-gray-100">
                  <img src={`https://cdn-icons-png.flaticon.com/512/733/${key === 'whatsapp_community' ? '733585' : key === 'instagram' ? '733558' : '733579'}.png`} className="w-10 h-10 group-hover:invert transition-all" alt="" />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-all">{key.replace('_', ' ')}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
