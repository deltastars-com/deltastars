import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { HomePage } from './HomePage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { VipLoginPage } from './VipLoginPage';
import { VipDashboardPage } from './VipDashboardPage';
import { WishlistPage } from './WishlistPage';
import { ShowroomPage } from './ShowroomPage';
import { ProductDetailPage } from './ProductDetailPage';
import { OperationsPage } from './OperationsPage';
import { WarehousePage } from './WarehousePage';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { SecuritySetupPage } from './SecuritySetupPage';
import { OrderTrackingPage } from './OrderTrackingPage';
import { DevConsolePage } from './DevConsolePage';
import { TrustCenterPage } from './TrustCenterPage';
import { SourcingRequestPage } from './SourcingRequestPage';
import { TermsPage } from './TermsPage';
import { ReturnsPage } from './ReturnsPage';
import { ShippingPolicyPage } from './ShippingPolicyPage';
import { DriverDashboardPage } from './DriverDashboardPage';
import { UnitsPage } from './UnitsPage';
import { ContactPage } from './ContactPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { Page } from '../../types';
import { useCart } from '../hooks/useCart';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { I18nProvider } from '../contexts/I18nContext';
import { SplashScreen } from './SplashScreen';
import { PwaInstallPrompt } from './PwaInstallPrompt';
import { OdayAssistant } from './OdayAssistant';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showOday, setShowOday] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { itemCount, clearCart } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); setCurrentPage('home'); };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'products': return <ProductsPage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'cart': return <CartPage setPage={setCurrentPage} clearCart={clearCart} />;
      case 'login': return <LoginPage setPage={setCurrentPage} />;
      case 'dashboard': return <DashboardPage setPage={setCurrentPage} />;
      case 'vipLogin': return <VipLoginPage setPage={setCurrentPage} />;
      case 'vipDashboard': return <VipDashboardPage setPage={setCurrentPage} />;
      case 'wishlist': return <WishlistPage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'showroom': return <ShowroomPage setPage={setCurrentPage} />;
      case 'productDetail': return selectedProductId ? <ProductDetailPage productId={selectedProductId} setPage={setCurrentPage} /> : <ProductsPage setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'operations': return <OperationsPage setPage={setCurrentPage} />;
      case 'warehouse': return <WarehousePage setPage={setCurrentPage} />;
      case 'privacy': return <PrivacyPolicyPage />;
      case 'security_setup': return <SecuritySetupPage setPage={setCurrentPage} />;
      case 'trackOrder': return <OrderTrackingPage />;
      case 'dev_console': return <DevConsolePage setPage={setCurrentPage} />;
      case 'trust_center': return <TrustCenterPage />;
      case 'sourcing': return <SourcingRequestPage />;
      case 'terms': return <TermsPage />;
      case 'returns': return <ReturnsPage />;
      case 'shipping': return <ShippingPolicyPage />;
      case 'driverDashboard': return <DriverDashboardPage setPage={setCurrentPage} />;
      case 'units': return <UnitsPage />;
      case 'contact': return <ContactPage />;
      case 'admin_dashboard': return <AdminDashboardPage setPage={setCurrentPage} />;
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
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
