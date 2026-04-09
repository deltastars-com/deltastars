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
import { UnitsPage } from './UnitsPage';
import { ContactPage } from './ContactPage';
import { useAuth } from './src/contexts/AuthContext';
import { useProducts } from './src/hooks/useProducts';
import { useCart } from './src/hooks/useCart';
import { AiAssistant } from './AiAssistant';
import { BotIcon } from './lib/contexts/Icons';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { products, loading: productsLoading, categories: productCategories } = useProducts();
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { language } = useI18n();
  const { ads, categories: firebaseCategories, units, updateProduct } = useFirebase();
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    // Auto-redirect based on role if authenticated
    if (isAuthenticated && user) {
      const isLoginPage = currentPage === 'login' || currentPage === 'vip_login';
      if (isLoginPage) {
        if (user.role === 'driver') {
          setCurrentPage('driver_dashboard');
        } else if (['admin', 'developer', 'marketing'].includes(user.role)) {
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
          setCurrentPage={setCurrentPage} 
          SYSTEM_CONFIG={{ BRAND_NAME: 'نجوم دلتا', SLOGAN: 'شريكك الأمثل' }} 
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
            setCurrentPage(page);
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
          setPage={setCurrentPage as any}
          addPurchaseHistory={() => {}}
        />
      );
      case 'login': return <LoginPage onLoginSuccess={() => setCurrentPage('home')} />;
      case 'admin_login': return (
        <AdminLoginPage 
          onSuccess={() => {
            setShowAdminLogin(false);
            setCurrentPage('admin_dashboard');
          }} 
          onBack={() => setCurrentPage('home')} 
        />
      );
      case 'vip_login': return <VipLoginPage onLoginSuccess={() => setCurrentPage('vip_dashboard')} />;
      case 'vip_dashboard': return <VipDashboardPage user={user as any} onLogout={() => { logout(); setCurrentPage('home'); }} />;
      case 'wishlist': return (
        <WishlistPage 
          wishlist={[]} 
          removeFromWishlist={() => {}} 
          addToCart={addItem} 
          setPage={(page, id) => {
            if (id) setSelectedProductId(id);
            setCurrentPage(page);
          }}
        />
      );
      case 'showroom': return <ShowroomPage items={[]} showroomBanner="" setPage={setCurrentPage as any} />;
      case 'productDetail': return (
        <ProductDetailPage 
          product={products.find(p => p.id === selectedProductId) || products[0] || {} as any}
          setPage={(page, id) => {
            if (id) setSelectedProductId(id);
            setCurrentPage(page);
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
      case 'driver_dashboard': return <DriverDashboardPage onLogout={() => { logout(); setCurrentPage('home'); }} />;
      case 'privacy': return <PrivacyPolicyPage onBack={() => setCurrentPage('home')} />;
      case 'terms': return <TermsPage onBack={() => setCurrentPage('home')} />;
      case 'returns': return <ReturnsPage onBack={() => setCurrentPage('home')} />;
      case 'shipping': return <ShippingPolicyPage onBack={() => setCurrentPage('home')} />;
      case 'dev_console': return <DevConsolePage onBack={() => setCurrentPage('home')} />;
      case 'operations': return <OperationsPage onBack={() => setCurrentPage('admin_dashboard')} />;
      case 'warehouse': return (
        <WarehousePage 
          onBack={() => setCurrentPage('admin_dashboard')} 
          products={products}
          onUpdateStock={(id, qty) => updateProduct(id, { stock_quantity: qty })}
          invoices={[]}
        />
      );
      case 'units': return <UnitsPage units={units || []} />;
      default: return <HomePage setCurrentPage={setCurrentPage} SYSTEM_CONFIG={{ BRAND_NAME: 'نجوم دلتا', SLOGAN: 'شريكك الأمثل' }} ads={[]} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-tajawal" dir="rtl">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="pt-24 min-h-[80vh]">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      
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
