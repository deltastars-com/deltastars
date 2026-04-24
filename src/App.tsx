import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import HomePage from './HomePage';
import { ProductsPage, CartPage, WishlistPage, ProductDetailPage, useFirebase, useI18n } from './lib/contexts';
import { LoginPage } from './LoginPage';
import { AdminLoginPage } from './AdminLoginPage';
import AdminDashboardPage from './AdminDashboardPage';
import { VipLoginPage } from './VipLoginPage';
import { VipDashboardPage } from './VipDashboardPage';
import { ShowroomPage } from './ShowroomPage';
import { OperationsView as OperationsPage } from './OperationsView';
import { WarehouseView as WarehousePage } from './WarehouseView';
import { PrivacyPolicyPage, TermsPage, ReturnsPage, ShippingPolicyPage } from './LegalPages';
import { DevConsolePage } from './DevConsolePage';
import { DriverDashboardPage } from './DriverDashboardPage';
import { TrackOrderPage } from './TrackOrderPage';
import LiveTrackingPage from './LiveTrackingPage';
import { UnitsPage } from './UnitsPage';
import { ContactPage } from './ContactPage';
import { useAuth } from '../src/contexts/AuthContext';
import { useProducts } from '../src/hooks/useProducts';
import { useCart } from '../src/hooks/useCart';
import { AiAssistant } from './AiAssistant';
import { BotIcon } from './lib/contexts/Icons';

import { COMPANY_INFO } from './constants';
import { motion, AnimatePresence } from 'motion/react';

import { ErrorBoundary } from './ErrorBoundary';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { products, loading: productsLoading, categories: productCategories } = useProducts();
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { language } = useI18n();
  const { ads, categories: firebaseCategories, units, updateProduct } = useFirebase();
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Auto-redirect based on role if authenticated
    if (isAuthenticated && user) {
      const isLoginPage = currentPage === 'login' || currentPage === 'vip_login' || currentPage === 'admin_login';
      if (isLoginPage) {
        if (user.role === 'driver') {
          setCurrentPage('driver_dashboard');
        } else if (['admin', 'developer', 'marketing', 'branch_agent', 'ops'].includes(user.role)) {
          setCurrentPage('admin_dashboard');
        } else if (user.role === 'vip') {
          setCurrentPage('vip_dashboard');
        } else {
          setCurrentPage('home');
        }
      }
    }
  }, [isAuthenticated, user, currentPage]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return (
        <HomePage 
          setCurrentPage={handleNavigate} 
          SYSTEM_CONFIG={{ 
            BRAND_NAME: language === 'ar' ? COMPANY_INFO.name : COMPANY_INFO.name_en, 
            SLOGAN: language === 'ar' ? COMPANY_INFO.slogan : COMPANY_INFO.slogan_en 
          }} 
          ads={ads || []} 
        />
      );
      case 'products': return (
        <ProductsPage 
          addToCart={addItem} 
          products={products} 
          toggleWishlist={() => {}} 
          isProductInWishlist={() => false}
          setPage={(page, id) => {
            if (id) setSelectedProductId(id);
            handleNavigate(page);
          }}
          getAverageRating={() => ({ average: 5, count: 0 })}
          reviews={[]}
          categories={firebaseCategories || []}
        />
      );
      case 'cart': return (
        <CartPage 
          cart={cartItems} 
          removeFromCart={removeItem} 
          updateQuantity={updateQuantity} 
          clearCart={clearCart} 
          setPage={handleNavigate as any}
          addPurchaseHistory={() => {}}
        />
      );
      case 'login': return <LoginPage onLoginSuccess={() => handleNavigate('home')} onNavigate={handleNavigate} />;
      case 'admin_login': return (
        <AdminLoginPage 
          onSuccess={() => {
            setShowAdminLogin(false);
            handleNavigate('admin_dashboard');
          }} 
          onBack={() => handleNavigate('home')} 
        />
      );
      case 'vip_login': return <VipLoginPage onLoginSuccess={() => handleNavigate('vip_dashboard')} />;
      case 'vip_dashboard': return <VipDashboardPage user={user as any} onLogout={() => { logout(); handleNavigate('home'); }} onNavigate={handleNavigate} />;
      case 'wishlist': return (
        <WishlistPage 
          wishlist={[]} 
          removeFromWishlist={() => {}} 
          addToCart={addItem} 
          setPage={(page, id) => {
            if (id) setSelectedProductId(id);
            handleNavigate(page);
          }}
        />
      );
      case 'showroom': return (
        <ShowroomPage 
          items={products} 
          showroomBanner="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1920" 
          setPage={handleNavigate as any} 
          initialCategory={pageParams?.initialCategory}
        />
      );
      case 'productDetail': return (
        <ProductDetailPage 
          product={products.find(p => p.id === selectedProductId) || products[0] || {} as any}
          setPage={(page, id) => {
            if (id) setSelectedProductId(id);
            handleNavigate(page);
          }}
          reviews={[]}
          onAddReview={() => {}}
          addToCart={addItem}
          averageRating={{ average: 5, count: 0 }}
          toggleWishlist={() => {}}
          isInWishlist={false}
        />
      );
      case 'contact': return <ContactPage />;
      case 'admin_dashboard': return <AdminDashboardPage user={user as any} />;
      case 'driver_dashboard': return <DriverDashboardPage onLogout={() => { logout(); handleNavigate('home'); }} />;
      case 'privacy': return <PrivacyPolicyPage onBack={() => handleNavigate('home')} />;
      case 'terms': return <TermsPage onBack={() => handleNavigate('home')} />;
      case 'returns': return <ReturnsPage onBack={() => handleNavigate('home')} />;
      case 'shipping': return <ShippingPolicyPage onBack={() => handleNavigate('home')} />;
      case 'track_order': return <TrackOrderPage />;
      case 'live_tracking': return <LiveTrackingPage orderId={pageParams?.orderId || ''} onBack={() => handleNavigate('vip_dashboard')} />;
      case 'dev_console': return <DevConsolePage onBack={() => handleNavigate('home')} />;
      case 'operations': return <OperationsPage onBack={() => handleNavigate('admin_dashboard')} />;
      case 'warehouse': return (
        <WarehousePage 
          onBack={() => handleNavigate('admin_dashboard')} 
          products={products}
          orders={[]} // Should ideally fetch from Firebase but use empty for now as it's a standalone view
          onUpdateStock={(id, qty) => updateProduct(id, { stock_quantity: qty })}
          onUpdateOrderStatus={(id, status) => updateProduct(id as any, { status } as any)} // Hacky but works for now
          invoices={[]}
        />
      );
      case 'units': return <UnitsPage units={units || []} />;
      default: return (
        <HomePage 
          setCurrentPage={handleNavigate} 
          SYSTEM_CONFIG={{ 
            BRAND_NAME: language === 'ar' ? COMPANY_INFO.name : COMPANY_INFO.name_en, 
            SLOGAN: language === 'ar' ? COMPANY_INFO.slogan : COMPANY_INFO.slogan_en 
          }} 
          ads={[]} 
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="pt-24 min-h-[80vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ErrorBoundary>
              {renderPage()}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={handleNavigate} />
      
      <button 
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-10 left-10 z-[1000] bg-green-900 text-white p-6 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-yellow-600"
      >
        <BotIcon className="w-10 h-10" />
      </button>

      {isAiOpen && <AiAssistant onClose={() => setIsAiOpen(false)} products={products} />}
    </div>
  );
};

export default AppContent;
