import React from 'react';
import { COMPANY_INFO } from '../constants';
import { User, Page } from '../../types';

interface HeaderProps {
  setPage: (page: Page) => void;
  cartItemCount: number;
  user: User | null;
  onLogout: () => void;
  onToggleAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setPage, cartItemCount, user, onLogout }) => {
  return (
    <header className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b-2 border-yellow-600 shadow-xl font-['Tajawal']">
      <div className="container mx-auto h-20 px-6 flex items-center justify-between">
        <div className="cursor-pointer group" onClick={() => setPage('home')}>
          <h1 className="text-2xl font-black text-[#1a3a1a]">{COMPANY_INFO.name_ar}</h1>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">شريكك الأمثل للخضروات والفواكه والتمور</p>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
              <span className="text-[11px] font-black text-primary">{user.email}</span>
              {user.type === 'developer' && (
                <button onClick={() => setPage('dev_console')} className="bg-yellow-500 text-black px-2 py-1 rounded text-[10px] font-black hover:rotate-12 transition-transform">لوحة العمليات ⚙️</button>
              )}
              <button onClick={onLogout} className="text-[10px] text-red-600 font-bold border-r pr-3 border-gray-300">خروج</button>
            </div>
          ) : (
            <button onClick={() => setPage('login')} className="text-sm font-black text-primary hover:text-yellow-600">دخول الإدارة</button>
          )}
          <div className="text-2xl cursor-pointer relative" onClick={() => setPage('cart')}>🛒</div>
        </div>
      </div>
    </header>
  );
};
