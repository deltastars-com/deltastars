{user?.role === 'admin' && (
  <button onClick={() => setPage('admin_dashboard')} className="text-sm font-black text-secondary hover:text-primary uppercase tracking-wide">
    📊 لوحة التحكم
  </button>
)}
{/* زر قسم المطور يظهر فقط إذا كان المستخدم له دور developer */}
{user?.role === 'developer' && (
  <button onClick={() => setPage('dev_console')} className="text-sm font-black text-secondary hover:text-primary uppercase tracking-wide">
    🔧 قسم المطور
  </button>
)}
import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { useCart } from '../src/hooks/useCart';
import { useI18n } from './lib/contexts';
import { 
  SearchIcon, UserIcon, HeartIcon, ShoppingCartIcon, 
  BellIcon, MenuIcon, XIcon, PhoneIcon,
  CalendarIcon, ClockIcon, ShieldCheckIcon
} from './lib/contexts/Icons';
import { COMPANY_INFO } from './constants';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { language, t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-uma', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(dateTime);

  const gregorianDate = new Intl.DateTimeFormat('ar-SA', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(dateTime);

  const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(dateTime);

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'shadow-2xl' : ''}`}>
      {/* Top Bar */}
      <div className="bg-[#1a3a1a] text-white py-2 px-4 md:px-8 text-[10px] md:text-xs flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
            <CalendarIcon className="w-3 h-3 text-yellow-500" />
            <span className="font-bold">{dayName} | {gregorianDate} | {hijriDate}</span>
          </div>
          <button 
            onClick={() => onNavigate('admin_login')}
            className="hidden md:flex items-center gap-2 text-yellow-500 hover:text-white transition-colors"
          >
            <ShieldCheckIcon className="w-3 h-3" />
            <span>بوابة الإدارة</span>
          </button>
          <div className="hidden md:flex items-center gap-2 text-yellow-500 animate-pulse">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>نخدمكم في جميع أنحاء المملكة 🇸🇦</span>
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <ClockIcon className="w-3 h-3 text-yellow-500" />
          {dateTime.toLocaleTimeString('ar-SA')}
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white/95 backdrop-blur-md border-b-4 border-yellow-600 px-4 md:px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-20' : 'h-24'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-green-900">
            {isMenuOpen ? <XIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
          </button>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-all overflow-hidden border-2 border-yellow-600/30">
              <img src={COMPANY_INFO.logo_url} className="w-full h-full object-cover" alt="Delta Stars" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black text-green-900 leading-none">DELTA STARS</h1>
              <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-tighter">نجوم دلتا للتجارة</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { id: 'home', label: 'الرئيسية' },
            { id: 'showroom', label: 'صالة العرض' },
            { id: 'products', label: 'منتجاتنا' },
            { id: 'contact', label: 'اتصل بنا' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm font-black transition-all relative group ${currentPage === item.id ? 'text-yellow-600' : 'text-green-900 hover:text-yellow-600'}`}
            >
              {item.label}
              <span className={`absolute -bottom-1 right-0 h-0.5 bg-yellow-600 transition-all ${currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden xl:flex items-center gap-3 bg-gray-50 p-2 px-4 rounded-xl border border-gray-100">
            <PhoneIcon className="w-4 h-4 text-green-800" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400">الدعم المباشر</span>
              <span className="text-xs font-black text-green-900">{COMPANY_INFO.phone}</span>
            </div>
          </div>

          <button onClick={() => onNavigate('wishlist')} className="p-2 text-green-900 hover:text-yellow-600 relative">
            <HeartIcon className="w-6 h-6" />
          </button>

          <button onClick={() => onNavigate('cart')} className="p-2 text-green-900 hover:text-yellow-600 relative">
            <ShoppingCartIcon className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate(user?.role === 'driver' ? 'driver_dashboard' : 'vip_dashboard')}
                className="flex items-center gap-2 bg-green-50 p-2 px-4 rounded-full border border-green-100 hover:bg-green-100 transition-all"
              >
                <UserIcon className="w-5 h-5 text-green-800" />
                <span className="hidden md:block text-xs font-black text-green-900">{user?.full_name || 'حسابي'}</span>
              </button>
              <button onClick={logout} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-green-900 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-xs md:text-sm hover:bg-green-800 transition-all shadow-lg border-b-4 border-green-950"
            >
              دخول 🔒
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t-4 border-yellow-600 p-6 space-y-4 shadow-2xl animate-fade-in">
          {[
            { id: 'home', label: 'الرئيسية' },
            { id: 'showroom', label: 'صالة العرض' },
            { id: 'products', label: 'منتجاتنا' },
            { id: 'contact', label: 'اتصل بنا' },
            { id: 'vip_login', label: 'بوابة العملاء VIP' },
            { id: 'admin_login', label: 'بوابة الإدارة السيادية' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
              className="block w-full text-right font-black text-green-900 text-lg py-3 border-b border-gray-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
