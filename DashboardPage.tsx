import React, { useState, useEffect } from 'react';
import { User, Product, ShowroomItem, Page, Invoice, Payment, VipClient, VipTransaction, Promotion } from '../../../types';
import { useI18n } from './I18nContext';
import { ChartBarIcon, LogoutIcon, PlusIcon, UserIcon, DeliveryIcon, SparklesIcon, PencilIcon, DocumentTextIcon } from './Icons';
import { AccountsView } from '../../AccountsView';
import { OperationsView } from '../../OperationsView';
import { WarehouseView } from '../../WarehouseView';
import { MarketingView } from '../../MarketingView';
import { SectionAuthModal } from '../SectionAuthModal';

interface DashboardPageProps {
  user: User | null;
  products: Product[];
  showroomItems: ShowroomItem[];
  promotions: Promotion[];
  categoryConfigs: any[];
  onAddProduct: (p: Product) => Promise<Product>;
  onUpdateProduct: (p: Product) => Promise<Product>;
  onDeleteProduct: (id: number) => Promise<boolean>;
  onSetShowroomItems: (items: ShowroomItem[]) => void;
  onSetPromotions: (promos: Promotion[]) => void;
  onSetCategoryConfigs: (configs: any[]) => void;
  setPage: (page: Page) => void;
  invoices: Invoice[];
  payments: Payment[];
  vipClients: VipClient[];
  transactions: VipTransaction[];
  onAddPayment: (p: Payment) => void;
  onAddVipClient: (c: VipClient) => Promise<VipClient>;
  onUpdateVipClient: (c: VipClient) => Promise<VipClient>;
  onDeleteVipClient: (id: string) => Promise<boolean>;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { language, t, formatCurrency } = useI18n();
  const [view, setView] = useState<string>(() => localStorage.getItem('delta-last-view-v24') || 'menu');
  const [authNeeded, setAuthNeeded] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('delta-last-view-v24', view);
  }, [view]);

  const handleReturnToMenu = () => setView('menu');

  const totalSales = (props.invoices || []).filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
  const lowStockCount = (props.products || []).filter(p => p.stock_quantity <= (p.min_threshold || 10)).length;

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen text-black">
      {authNeeded && (
        <SectionAuthModal 
            section={authNeeded as any} 
            onUnlock={() => { 
                if(authNeeded === 'developer') props.setPage('dev_console');
                else setView(authNeeded); 
                setAuthNeeded(null); 
            }} 
            onClose={() => setAuthNeeded(null)} 
        />
      )}
      
      {/* Sovereign Header */}
      <div className="bg-primary text-white p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] shadow-4xl mb-16 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12 border-b-[20px] border-secondary">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-right" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                {t('dashboard.title')}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Sovereign v27.0</span>
                <p className="text-xl font-bold text-white/60 italic">{t('dashboard.subtitle')}</p>
            </div>
        </div>
        <div className="relative z-10 flex flex-wrap justify-center gap-4">
             <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-[2rem] font-black border border-white/20 flex items-center gap-4 shadow-2xl">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                <span className="text-lg">{props.user?.email || 'Admin Session'}</span>
             </div>
             <button onClick={() => props.setPage('home')} className="bg-white text-primary px-8 py-4 rounded-[2rem] font-black hover:bg-secondary hover:text-white transition-all shadow-3xl">
                {t('header.navLinks.home')}
             </button>
        </div>
      </div>

      {view === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in text-black pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* 1. Administration */}
            <div onClick={() => setAuthNeeded('gm.portal')} className="bg-slate-900 text-white p-10 rounded-[4rem] shadow-4xl hover:-translate-y-4 transition-all cursor-pointer group border-b-[15px] border-primary flex flex-col items-center text-center">
                <div className="text-8xl mb-8 group-hover:scale-110 transition-transform">⚖️</div>
                <h3 className="text-3xl font-black mb-2">{t('dashboard.sections.admin.title')}</h3>
                <p className="text-sm font-bold opacity-40">{t('dashboard.sections.admin.desc')}</p>
            </div>

            {/* 2. Marketing */}
            <div onClick={() => setView('marketing')} className="bg-white text-slate-800 p-10 rounded-[4rem] shadow-xl hover:shadow-4xl hover:-translate-y-4 transition-all cursor-pointer group border-b-[15px] border-secondary flex flex-col items-center text-center border border-gray-100">
                <div className="text-8xl mb-8 group-hover:scale-110 transition-transform">📢</div>
                <h3 className="text-3xl font-black mb-2">{t('dashboard.sections.marketing.title')}</h3>
                <p className="text-sm font-bold text-gray-400">{t('dashboard.sections.marketing.desc')}</p>
            </div>

            {/* 3. Operations */}
            <div onClick={() => setAuthNeeded('operations')} className="bg-white text-slate-800 p-10 rounded-[4rem] shadow-xl hover:shadow-4xl hover:-translate-y-4 transition-all cursor-pointer group border-b-[15px] border-green-600 flex flex-col items-center text-center border border-gray-100">
                <div className="text-8xl mb-8 group-hover:scale-110 transition-transform">🚛</div>
                <h3 className="text-3xl font-black mb-2">{t('dashboard.sections.ops.title')}</h3>
                <p className="text-sm font-bold text-gray-400">{t('dashboard.sections.ops.desc')}</p>
            </div>

            {/* 4. Developer */}
            <div onClick={() => setAuthNeeded('developer')} className="bg-secondary text-white p-10 rounded-[4rem] shadow-4xl hover:-translate-y-4 transition-all cursor-pointer group border-b-[15px] border-orange-700 flex flex-col items-center text-center">
                <div className="text-8xl mb-8 group-hover:scale-110 transition-transform">🛡️</div>
                <h3 className="text-3xl font-black mb-2">{t('dashboard.sections.dev.title')}</h3>
                <p className="text-sm font-bold opacity-60">{t('dashboard.sections.dev.desc')}</p>
            </div>
        </div>
      )}

      {/* View Containers */}
      {view === 'gm.portal' && (
          <div className="space-y-10 animate-fade-in pb-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border-b-8 border-green-500">
                      <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('dashboard.stats.sales')}</p>
                      <p className="text-5xl font-black text-slate-800">{formatCurrency(totalSales)}</p>
                  </div>
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border-b-8 border-orange-500">
                      <p className="text-xs font-black text-gray-400 uppercase mb-2">{t('dashboard.stats.lowStock')}</p>
                      <p className="text-5xl font-black text-slate-800">{lowStockCount}</p>
                  </div>
                  <div className="bg-primary text-white p-10 rounded-[3.5rem] shadow-xl">
                      <p className="text-xs font-black text-secondary uppercase mb-2">{t('dashboard.stats.pending')}</p>
                      <p className="text-5xl font-black">3</p>
                  </div>
              </div>
              <AccountsView onBack={handleReturnToMenu} invoices={props.invoices} payments={props.payments} vipClients={props.vipClients} transactions={props.transactions} onAddPayment={props.onAddPayment} onAddVipClient={props.onAddVipClient} onUpdateVipClient={props.onUpdateVipClient} onDeleteVipClient={props.onDeleteVipClient} />
          </div>
      )}
      
      {view === 'marketing' && (
          <MarketingView 
            products={props.products} 
            onUpdateProduct={props.onUpdateProduct} 
            onAddProduct={props.onAddProduct}
            onBack={handleReturnToMenu} 
          />
      )}

      {view === 'warehouse' && <WarehouseView products={props.products} onUpdateStock={async (id, qty) => {
          const p = props.products.find(x => x.id === id);
          if (p) await props.onUpdateProduct({ ...p, stock_quantity: qty });
      }} onBack={handleReturnToMenu} invoices={props.invoices} />}
      
      {view === 'operations' && <OperationsView onBack={handleReturnToMenu} />}
    </div>
  );
};