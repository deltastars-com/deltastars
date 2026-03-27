import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon, SparklesIcon, GlobeAltIcon } from './contexts/Icons';
import { User, Page } from '../../types';
import { useI18n } from './contexts/I18nContext';
import { COMPANY_INFO } from '../constants';

interface HeaderProps {
  setPage: (page: Page) => void;
  cartItemCount: number;
  wishlistItemCount: number;
  user: User | null;
  onLogout: () => void;
  onToggleAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setPage, cartItemCount, user, onLogout, onToggleAiAssistant }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage, getHijriDate } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    document.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  const navLinks = [
    { label: t('header.navLinks.home'), page: 'home' as const },
    { label: t('header.navLinks.products'), page: 'products' as const },
    { label: language === 'ar' ? 'طلب توريد خاص' : 'Sourcing', page: 'sourcing' as const },
    { label: t('header.navLinks.trackOrder'), page: 'trackOrder' as const },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-['Tajawal']`}>
      {/* شريط المعلومات العلوي المحسن */}
      <div className="bg-[#1a3a1a] py-2 border-b border-white/10 hidden sm:block">
         <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-bold text-white/90 tracking-wider">
            <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                    {getHijriDate()} | {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </span>
                <span className="text-yellow-500/90 font-black">Verified Institutional Supplier ✓</span>
            </div>
            
            <div className="flex items-center gap-6">
                {user && (
                    <div className="flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        <span className="text-emerald-400">● {user.email}</span>
                        {/* زر المطور الذهبي - يظهر لك فقط */}
                        {user.type === 'developer' && (
                            <button 
                                onClick={() => setPage('dev_console')}
                                className="bg-yellow-500 text-black px-2 py-0.5 rounded-md font-black hover:bg-white transition-colors"
                            >
                                لوحة العمليات ⚙️
                            </button>
                        )}
                    </div>
                )}
                <button onClick={toggleLanguage} className="hover:text-yellow-500 transition-colors uppercase">
                    {language === 'ar' ? 'English' : 'العربية'}
                </button>
            </div>
         </div>
      </div>

      {/* شريط التنقل الرئيسي */}
      <div className="container mx-auto px-4 mt-2">
        <div className={`transition-all duration-500 rounded-[2.5rem] border-x border-b-[3px] relative ${
          isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-white/20 border-b-yellow-600' 
          : 'bg-white/80 backdrop-blur-md border-white/30 border-b-yellow-600/50'
        }`}>
          
          <div className="flex items-center justify-between py-3 px-6 md:px-10">
            <div className="flex items-center gap-4">
                <button 
                  className="p-2.5 rounded-xl transition-all text-primary bg-primary/5 hover:bg-primary/10"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <MenuIcon className="w-6 h-6" />
                </button>

                <nav className="hidden xl:flex items-center gap-6">
                    {navLinks.map(link => (
                        <button 
                            key={link.page} 
                            onClick={() => setPage(link.page)} 
                            className="text-[11px] font-black uppercase tracking-tighter text-primary hover:text-yellow-600 transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* زر المساعد عدي */}
                <button 
                  onClick={onToggleAiAssistant} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a3a1a] text-white shadow-lg hover:bg-yellow-600 transition-all group"
                >
                    <SparklesIcon className="w-4 h-4 text-yellow-500 group-hover:text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t('header.navLinks.oday')}
                    </span>
                </button>
            </div>

            {/* الهوية الجديدة وشعار نجوم دلتا */}
            <div 
                className="flex items-center gap-4 cursor-pointer group transform transition-transform hover:scale-105"
                onClick={() => setPage('home')}
            >
                <div className={`${language === 'ar' ? 'text-right' : 'text-left'} hidden sm:block`}>
                    <h1 className="text-xl md:text-2xl font-black text-[#1a3a1a] leading-none">
                        {language === 'ar' ? COMPANY_INFO.name_ar : COMPANY_INFO.name}
                    </h1>
                    <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-tighter">
                        {language === 'ar' ? 'شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة' : COMPANY_INFO.slogan_en}
                    </p>
                </div>
                <img 
                    src={COMPANY_INFO.logo_url} 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md" 
                    alt="Delta Stars Logo" 
                />
            </div>

            {/* أيقونة السلة */}
            <button 
              onClick={() => setPage('cart')} 
              className="relative p-3 rounded-xl bg-[#1a3a1a] text-white hover:bg-yellow-600 transition-all shadow-md"
            >
                <ShoppingCartIcon className="w-5 h-5" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-bounce">
                        {cartItemCount}                            
                    </span>                            
                )}                          
            </button>                      
          </div>                      
        </div>                      
      </div>                      

      {/* القائمة الجانبية للجوال */}
      {isMenuOpen && (
          <div className="fixed inset-0 bg-[#1a3a1a]/98 backdrop-blur-xl z-[150] animate-fade-in flex flex-col p-10">
              <button onClick={() => setIsMenuOpen(false)} className="self-end text-white"><XIcon className="w-10 h-10" /></button>
              <div className="flex-grow flex flex-col justify-center gap-6 text-center">
                  {navLinks.map(link => (
                      <button key={link.page} onClick={() => { setPage(link.page); setIsMenuOpen(false); }} className="text-4xl font-black text-white hover:text-yellow-500 transition-all">{link.label}</button>
                  ))}                      
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="mt-10 text-red-500 font-bold underline">خروج من الجلسة</button>
              </div>                      
          </div>                      
      )}                      
    </header>                      
  );                      
};                      
