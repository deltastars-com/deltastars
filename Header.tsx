
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // PWA Install Logic
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const navLinks = [
    { label: t('header.navLinks.home'), page: 'home' as const },
    { label: t('header.navLinks.products'), page: 'products' as const },
    { label: language === 'ar' ? 'طلب توريد خاص' : 'Special Sourcing', page: 'sourcing' as const },
    { label: t('header.navLinks.trackOrder'), page: 'trackOrder' as const },
  ];

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    document.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700`}>
      <div className="bg-primary/95 backdrop-blur-md py-2 border-b border-white/5 hidden sm:block">
         <div className="container mx-auto px-10 flex justify-between items-center text-[9px] font-black text-white/70 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                    {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-secondary/80">{getHijriDate()}</span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-emerald-400">Sovereign Stable v25.0</span>
                </span>
                {deferredPrompt && (
                  <button onClick={handleInstallClick} className="bg-secondary/20 text-secondary px-3 py-1 rounded-full border border-secondary/30 hover:bg-secondary hover:text-white transition-all animate-bounce">
                    🚀 {language === 'ar' ? 'تثبيت التطبيق' : 'INSTALL APP'}
                  </button>
                )}
            </div>
            
            <div className="flex items-center gap-8">
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 bg-white/5 hover:bg-secondary px-4 py-1.5 rounded-full transition-all border border-white/10 group"
                >
                    <GlobeAltIcon className="w-3.5 h-3.5 text-secondary group-hover:text-white" />
                    <span className="text-white font-black">{language === 'ar' ? 'ENGLISH' : 'العربية'}</span>
                </button>
                <span className="text-secondary/60">Verified Institutional Supplier ✓</span>
                <span className="opacity-40 italic">{t('header.utility.version')}</span>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-2">
        <div className={`transition-all duration-700 rounded-b-[3.5rem] md:rounded-b-[4.5rem] border-x-2 border-b-[4px] relative overflow-visible ${
          isScrolled 
          ? 'bg-white/95 backdrop-blur-2xl shadow-sovereign border-white/20 border-b-secondary' 
          : 'bg-white/30 backdrop-blur-xl border-white/10 border-b-secondary/40 shadow-2xl'
        }`}>
          
          <div className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-20">
            <div className="flex items-center gap-3 md:gap-6">
                <button 
                  className="p-3 rounded-2xl transition-all shadow-sm text-primary bg-primary/10 hover:bg-primary/20"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                </button>

                <nav className="hidden xl:flex items-center gap-8">
                    {navLinks.map(link => (
                        <button 
                            key={link.page} 
                            onClick={() => setPage(link.page)} 
                            className="transition-all text-sm font-black uppercase tracking-widest relative group/link text-primary hover:text-primary/70"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover/link:w-full"></span>
                        </button>
                    ))}
                </nav>

                <button 
                  onClick={onToggleAiAssistant} 
                  className="group relative flex items-center gap-3 px-5 py-3 rounded-[2rem] transition-all border-2 shadow-xl bg-primary/10 border-primary/20 hover:bg-primary/20"
                >
                    <SparklesIcon className="w-6 h-6 transition-colors animate-pulse text-primary" />
                    <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest text-primary">
                      {t('header.navLinks.oday')}
                    </span>
                </button>

                <button 
                  onClick={() => setPage('cart')} 
                  className="relative p-3 md:p-4 rounded-2xl transition-all shadow-lg border-b-4 bg-primary text-white border-primary-dark hover:bg-secondary"
                >
                    <ShoppingCartIcon className="w-6 h-6" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-xl animate-bounce">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>

            <div 
                className="flex items-center gap-5 cursor-pointer group/logo transform transition-all duration-500 hover:scale-105"
                onClick={() => setPage('home')}
            >
                <div className={`${language === 'ar' ? 'text-right' : 'text-left'} hidden sm:block`}>
                    <h1 className="text-2xl md:text-3xl font-black leading-none tracking-tighter uppercase text-primary">
                        {language === 'ar' ? COMPANY_INFO.name : COMPANY_INFO.name_en}
                    </h1>
                    <div className={`h-0.5 w-12 bg-secondary mt-1 rounded-full opacity-60 group-hover/logo:w-full transition-all duration-700 ${language === 'ar' ? 'ml-auto' : 'mr-auto'}`}></div>
                </div>
                <img 
                    src={COMPANY_INFO.logo_url} 
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 object-contain relative transition-all duration-700 drop-shadow-2xl" 
                    alt="Delta Stars Logo" 
                />
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[150] animate-fade-in flex flex-col p-10 pt-40">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 end-10 text-white"><XIcon className="w-12 h-12" /></button>
              <div className="space-y-8 text-center">
                  {navLinks.map(link => (
                      <button key={link.page} onClick={() => { setPage(link.page); setIsMenuOpen(false); }} className="block w-full text-5xl font-black text-white hover:text-secondary transition-all uppercase tracking-tighter">{link.label}</button>
                  ))}
                  <div className="pt-12 border-t border-white/10 flex flex-col items-center gap-8">
                      <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="bg-secondary text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-xl flex items-center gap-4">
                          <GlobeAltIcon className="w-8 h-8" />
                          {language === 'ar' ? 'ENGLISH VERSION' : 'النسخة العربية'}
                      </button>
                      {deferredPrompt && (
                         <button onClick={() => { handleInstallClick(); setIsMenuOpen(false); }} className="bg-white text-primary px-12 py-5 rounded-[2rem] font-black text-2xl shadow-xl">
                            📲 {language === 'ar' ? 'تثبيت التطبيق على جهازك' : 'INSTALL ON DEVICE'}
                         </button>
                      )}
                      {user ? (
                          <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-red-500 font-black text-2xl uppercase tracking-widest underline decoration-2 underline-offset-8">Logout Session</button>
                      ) : (
                          <button onClick={() => { setPage('login'); setIsMenuOpen(false); }} className="text-white font-black text-2xl uppercase tracking-widest">Admin Dashboard</button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </header>
  );
};
