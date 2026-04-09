import React from 'react';
import { COMPANY_INFO } from './constants';
import { Ad } from './types';
import { useI18n } from './I18nContext';

interface HomeProps {
  setCurrentPage: (page: string) => void;
  SYSTEM_CONFIG: any;
  ads: Ad[];
}

export default function Home({ setCurrentPage, SYSTEM_CONFIG, ads }: HomeProps) {
  const { language } = useI18n();
  
  const activeAds = (ads || []).filter(ad => ad.status === 'active');

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1920" 
            alt="Fresh Produce" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90"></div>
        </div>

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
            {SYSTEM_CONFIG.BRAND_NAME}
          </h2>
          <p className="text-xl md:text-3xl font-bold text-yellow-500 mb-12 italic leading-relaxed">
            {SYSTEM_CONFIG.SLOGAN}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => setCurrentPage('showroom')} 
              className="bg-secondary text-white px-12 py-5 rounded-full font-black text-2xl shadow-sovereign hover:scale-105 transition-all border-b-4 border-yellow-800"
            >
              استعراض المنتجات 🛒
            </button>
            <button 
              onClick={() => setCurrentPage('vip_login')} 
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-12 py-5 rounded-full font-black text-2xl hover:bg-white hover:text-primary transition-all"
            >
              بوابة العملاء VIP 🤝
            </button>
          </div>
        </div>
      </section>

      {/* Ads / Promotional Banners */}
      {activeAds.length > 0 && (
        <section className="py-12 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
              {activeAds.map(ad => (
                <a 
                  key={ad.id} 
                  href={ad.link || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-shrink-0 w-full md:w-[600px] h-80 rounded-[3rem] overflow-hidden shadow-2xl snap-center relative group"
                >
                  <img 
                    src={ad.image} 
                    alt={language === 'ar' ? ad.title_ar : ad.title_en} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                    <h3 className="text-2xl font-black text-white mb-2">{language === 'ar' ? ad.title_ar : ad.title_en}</h3>
                    <span className="text-secondary font-black text-sm uppercase tracking-widest">إعلان ترويجي</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats / Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-10 bg-slate-50 rounded-[3rem] border-t-8 border-secondary text-center space-y-4">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-2xl font-black text-primary">تغطية شاملة</h3>
            <p className="text-gray-500 font-bold">نخدم جميع مناطق المملكة العربية السعودية بفروعنا المتعددة.</p>
          </div>
          <div className="p-10 bg-slate-50 rounded-[3rem] border-t-8 border-secondary text-center space-y-4">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-black text-primary">جودة فائقة</h3>
            <p className="text-gray-500 font-bold">نلتزم بأعلى معايير الجودة العالمية في اختيار وتوريد منتجاتنا.</p>
          </div>
          <div className="p-10 bg-slate-50 rounded-[3rem] border-t-8 border-secondary text-center space-y-4">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-black text-primary">سرعة التوصيل</h3>
            <p className="text-gray-500 font-bold">أسطول مبرد يضمن وصول المنتجات طازجة وفي أسرع وقت.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight">شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة</h2>
            <p className="text-xl text-gray-600 font-bold leading-relaxed">
              اكتشف التميز مع دلتا ستارز، الموزع الأول للخضروات والفواكه في السوق السعودي. إن التزامنا الثابت بالجودة جعلنا المورد المفضل لمجموعة كبيرة من المؤسسات بما في ذلك المطاعم والفنادق وخدمات تقديم الطعام والأسواق الكبرى والمستشفيات.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="font-black text-primary">منتجات عضوية</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="font-black text-primary">تمور فاخرة</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="font-black text-primary">استيراد مباشر</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="font-black text-primary">دعم فني 24/7</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" 
                className="rounded-[4rem] shadow-sovereign border-8 border-white" 
                alt="Market"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-secondary text-white p-10 rounded-[3rem] shadow-2xl hidden md:block">
                <p className="text-5xl font-black">15+</p>
                <p className="font-bold">سنة من الخبرة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-primary mb-12 uppercase tracking-widest">نحن نقدر ثقتكم - عملاؤنا الكرام</h2>
          <div className="max-w-6xl mx-auto">
            <img 
              src={COMPANY_INFO.partners_url} 
              alt="Our Partners" 
              className="w-full h-auto rounded-[3rem] shadow-2xl border-4 border-secondary/20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
