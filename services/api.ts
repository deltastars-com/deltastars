import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { CartPage } from './components/CartPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { DeveloperDashboardPage } from './components/DeveloperDashboardPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { DriverDashboardPage } from './components/DriverDashboardPage';
import { DevConsolePage } from './components/DevConsolePage';
import { SourcingRequestPage } from './components/SourcingRequestPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { ReturnsPage } from './components/ReturnsPage';
import { ShippingPolicyPage } from './components/ShippingPolicyPage';
import { WishlistPage } from './components/WishlistPage';
import { ShowroomPage } from './components/ShowroomPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { UnitsPage } from './components/UnitsPage';
import { Page } from './types';
import { useCart } from './hooks/useCart';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DeveloperAuthProvider, useDeveloperAuth } from './contexts/DeveloperAuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';
import { SplashScreen } from './components/SplashScreen';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { OdayAssistant } from './components/OdayAssistant';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showOday, setShowOday] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { itemCount, clearCart } = useCart();
  const { user, logout } = useAuth();
  const { devUser, isDevAuthenticated, devLogout } = useDeveloperAuth();

  const handleLogout = () => { logout(); setCurrentPage('home'); };
  const handleDevLogout = () => { devLogout(); setCurrentPage('home'); };

  const renderPage = () => {
    if (showAdminLogin) {
      return <AdminLoginPage onSuccess={() => { setShowAdminLogin(false); setCurrentPage('admin_dashboard'); }} onBack={() => setShowAdminLogin(false)} />;
    }
    switch (currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'products': return <ProductsPage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'cart': return <CartPage setPage={setCurrentPage} clearCart={clearCart} />;
      case 'login': return <LoginPage setPage={setCurrentPage} />;
      case 'dashboard': return <div>لوحة تحكم العميل (قيد التطوير)</div>;
      case 'admin_dashboard': return <AdminDashboardPage setPage={setCurrentPage} />;
      case 'dev_console': return isDevAuthenticated ? <DeveloperDashboardPage onLogout={handleDevLogout} /> : <div>غير مصرح</div>;
      case 'trackOrder': return <OrderTrackingPage />;
      case 'driverDashboard': return <DriverDashboardPage setPage={setCurrentPage} />;
      case 'sourcing': return <SourcingRequestPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return <PrivacyPolicyPage />;
      case 'terms': return <TermsPage />;
      case 'returns': return <ReturnsPage />;
      case 'shipping': return <ShippingPolicyPage />;
      case 'wishlist': return <WishlistPage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'showroom': return <ShowroomPage setPage={setCurrentPage} />;
      case 'productDetail': return selectedProductId ? <ProductDetailPage productId={selectedProductId} setPage={setCurrentPage} /> : <ProductsPage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'units': return <UnitsPage />;
      default: return <HomePage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
    }
  };

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header setPage={setCurrentPage} cartItemCount={itemCount} user={user} onLogout={handleLogout} onToggleAiAssistant={() => setShowOday(!showOday)} />
      <main className="flex-grow pt-32">{renderPage()}</main>
      <Footer setPage={setCurrentPage} />
      <PwaInstallPrompt />
      {showOday && <OdayAssistant onClose={() => setShowOday(false)} />}
    </div>
  );
};

function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <DeveloperAuthProvider>
            <AppContent />
          </DeveloperAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
