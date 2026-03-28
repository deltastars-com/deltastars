import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Header } from './lib/Header';
import { Footer } from './lib/Footer';
import { Product, User, Page } from '../types';
import { I18nProvider, GeminiAiProvider, useI18n } from './lib/contexts/I18nContext';
import { ToastProvider } from './ToastContext';
import { ToastContainer } from './ToastContainer';
import { mockProducts } from './lib/vip/products';
import { mockInvoices, mockVipClients, mockTransactions, mockPayments } from './lib/contexts/accounting';
import { SplashScreen } from './lib/SplashScreen';

const Home = lazy(() => import('./Home').then(m => ({ default: m.Home })));
const LoginPage = lazy(() => import('./lib/vip/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./lib/contexts/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DeveloperDashboard = lazy(() => import('./DeveloperDashboard').then(m => ({ default: m.DeveloperDashboard })));

function MainApp() {
  const { language } = useI18n();
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const setPage = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pageContent = useMemo(() => {
    return (
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-black">DELTA STARS LOADING...</div>}>
        {(() => {
          switch (currentPage) {
            case 'home': return <Home setPage={setPage} addToCart={()=>{}} products={mockProducts} promotions={[]} />;
            case 'login': return <LoginPage onLogin={async (c)=>{
                const email = c.email.toLowerCase().trim();
                const pass = c.password.trim();
                // 🔑 قفل الإدارة العليا (Admin)
                if (email === 'marketing@deltastars-ksa.com' && (pass === '***733691903***%' || pass === '%***733691903***')) {
                  setCurrentUser({ type: 'admin', email });
                  setPage('dashboard');
                  return { success: true };
                }
                // 🔑 قفل المطور (Developer)
                if (email === 'deltastars@zoho.mail.com' && pass === '321666') {
                  setCurrentUser({ type: 'developer', email });
                  setPage('dashboard');
                  return { success: true };
                }
                return { success: false, error: 'عذراً، بيانات الدخول غير صحيحة' };
            }} setPage={setPage} />;
            case 'dashboard':
              if (!currentUser) { setPage('login'); return null; }
              return <div className="pt-40"><DashboardPage user={currentUser} products={mockProducts} showroomItems={[]} promotions={[]} categoryConfigs={[]} onAddProduct={async(p)=>p} onUpdateProduct={async(p)=>p} onDeleteProduct={async()=>true} setPage={setPage} invoices={mockInvoices} payments={mockPayments} vipClients={mockVipClients} transactions={mockTransactions} onAddPayment={()=>{}} onAddVipClient={async(c)=>c} onUpdateVipClient={async(c)=>c} onDeleteVipClient={async()=>true} /></div>;
            case 'dev_console':                  
              if (!currentUser || currentUser.type !== 'developer') { setPage('dashboard'); return null; }  
              return <div className="pt-40"><DeveloperDashboard products={mockProducts} promotions={[]} showroomItems={[]} homeSections={[]} onUpdateProducts={()=>{}} onUpdatePromos={()=>{}} onUpdateShowroom={()=>{}} onUpdateSections={()=>{}} onBack={()=>setPage('dashboard')} /></div>;
            default: return <Home setPage={setPage} addToCart={()=>{}} products={mockProducts} promotions={[]} />;
          }
        })()}
      </Suspense>                
    );                
  }, [currentPage, currentUser, setPage]);

  if (isInitializing) return <SplashScreen onComplete={() => setIsInitializing(false)} />;

  return (                
    <div className="min-h-screen flex flex-col font-sans">
      <Header setPage={setPage} cartItemCount={0} user={currentUser} onLogout={()=>{setCurrentUser(null); setPage('home')}} onToggleAiAssistant={()=>{}} />
      <main className="flex-grow">{pageContent}</main>
      <Footer setPage={setPage} />
    </div>                
  );                
}

export default function App() {
  return (                
    <I18nProvider><ToastProvider><GeminiAiProvider><MainApp /><ToastContainer /></GeminiAiProvider></ToastProvider></I18nProvider>
  );                
}
