import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { CartPage } from './components/CartPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { DeveloperDashboardPage } from './components/DeveloperDashboardPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { DeveloperAuthProvider } from './contexts/DeveloperAuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';

function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <DeveloperAuthProvider>
            <div className="min-h-screen bg-white flex flex-col">
              <Header />
              <main className="flex-grow pt-32">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/dev-console" element={<DeveloperDashboardPage />} />
                  <Route path="/track-order" element={<OrderTrackingPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </DeveloperAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
