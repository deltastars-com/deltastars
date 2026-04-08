import React, { useState } from 'react';
import { User, Page } from '../../types';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { ShoppingCart, User as UserIcon, LogOut, Settings, Menu, X } from 'lucide-react';

interface HeaderProps { setPage: (page: Page) => void; cartItemCount: number; user: User | null; onLogout: () => void; onToggleAiAssistant: () => void; }

export const Header: React.FC<HeaderProps> = ({ setPage, cartItemCount, user, onLogout, onToggleAiAssistant }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useI18n();
  const { isRole } = useAuth();

  const navLinks = [
    { key: 'home', label: t('header.navLinks.home') },
    { key: 'products', label: t('header.navLinks.products') },
    { key: 'showroom', label: t('header.navLinks.showroom') },
    { key: 'wishlist', label: t('header.navLinks.wishlist') },
    { key: 'trackOrder', label: t('header.navLinks.trackOrder') },
    { key: 'contact', label: t('header.navLinks.contact') },
  ];
  const adminLinks = [
    { key: 'dashboard', label: t('header.navLinks.dashboard'), roles: ['admin', 'ops', 'gm'] },
    { key: 'vipPortal', label: t('header.navLinks.vipPortal'), roles: ['admin', 'vip'] },
    { key: 'driverDashboard', label: t('header.navLinks.driverDashboard'), roles: ['admin', 'delegate'] },
    { key: 'dev_console', label: t('header.navLinks.dev_console'), roles: ['developer'] },
  ];

  const handleNav = (page: Page) => { setPage(page); setMobileMenuOpen(false); };

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex flex-col cursor-pointer mt-2 md:mt-0" onClick={() => handleNav('home')}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-primary tracking-tight leading-none">Delta Stars</h1>
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-500 mt-1 sm:mt-1.5">{t('header.storeTitle')}</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => <button key={link.key} onClick={() => handleNav(link.key as Page)} className="text-sm font-black text-gray-600 hover:text-primary uppercase tracking-wide">{link.label}</button>)}
            {user && adminLinks.map(link => (link.roles && !isRole(link.roles) ? null : <button key={link.key} onClick={() => handleNav(link.key as Page)} className="text-sm font-black text-secondary hover:text-primary uppercase tracking-wide">{link.label}</button>))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={onToggleAiAssistant} className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-black">🤖 {t('header.navLinks.oday')}</button>
            <button onClick={() => handleNav('cart')} className="relative p-2"><ShoppingCart className="w-6 h-6" />{cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartItemCount}</span>}</button>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-full"><UserIcon className="w-5 h-5" /><span className="text-sm font-bold max-w-[100px] truncate">{user.full_name || user.email || user.phone}</span></button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-2"><div className="px-3 py-2 border-b"><p className="text-xs text-gray-400">{user.role}</p><p className="text-sm font-bold truncate">{user.email || user.phone}</p></div>
                  <button onClick={() => handleNav('dashboard')} className="w-full text-right px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-2"><Settings className="w-4 h-4" /> لوحة التحكم</button>
                  <button onClick={onLogout} className="w-full text-right px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"><LogOut className="w-4 h-4" /> تسجيل خروج</button></div>
                </div>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="hidden md:flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full text-sm font-black"><UserIcon className="w-4 h-4" /> {t('header.navLinks.dashboard')}</button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="lg:hidden bg-white border-t py-4 px-4 flex flex-col gap-3">{navLinks.map(link => <button key={link.key} onClick={() => handleNav(link.key as Page)} className="text-right px-4 py-3 text-gray-600 font-bold">{link.label}</button>)}{user && adminLinks.map(link => <button key={link.key} onClick={() => handleNav(link.key as Page)} className="text-right px-4 py-3 text-secondary font-bold">{link.label}</button>)}<button onClick={onToggleAiAssistant} className="text-right px-4 py-3 text-primary font-bold">🤖 {t('header.navLinks.oday')}</button></div>}
    </header>
  );
};
