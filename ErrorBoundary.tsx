import React from 'react';
import { COMPANY_INFO } from '../constants';
import { User, Page } from '../../types';

export const Header: React.FC<{setPage:(p:Page)=>void; cartItemCount:number; user:User|null; onLogout:()=>void; onToggleAiAssistant:()=>void;}> = ({ setPage, cartItemCount, user, onLogout, onToggleAiAssistant }) => {
  return (                                            
    <header className="fixed top-0 left-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm font-['Tajawal']">              
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex flex-col cursor-pointer" onClick={() => setPage('home')}>
          <h1 className="text-2xl font-black text-[#1a3a1a]">{COMPANY_INFO.name_ar}</h1>
          <span className="text-[10px] text-gray-500 font-bold tracking-tighter">شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة</span>
        </div>                              
        <div className="flex items-center gap-6">
          <button onClick={() => setPage('products')} className="text-sm font-bold text-gray-700 hover:text-green-700 transition-colors">سوق المنتجات</button>
          {user ? (
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span className="text-xs font-black text-green-800">{user.email}</span>
              {user.type === 'developer' && <button onClick={() => setPage('dev_console')} className="bg-yellow-500 text-white p-1 rounded-full shadow-lg hover:rotate-90 transition-transform">⚙️</button>}
              <button onClick={onLogout} className="text-[10px] text-red-500 font-bold border-r pr-3 border-gray-200">خروج</button>
            </div>                              
          ) : (
            <button onClick={() => setPage('login')} className="bg-[#1a3a1a] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-yellow-600 transition-all">دخول الإدارة 🔐</button>
          )}                              
          <div className="relative cursor-pointer" onClick={() => setPage('cart')}>
            <span className="text-2xl">🛒</span>
            {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cartItemCount}</span>}
          </div>                              
        </div>                              
      </div>                              
    </header>                              
  );                              
};                              
