import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { CartPage } from './components/CartPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { DeveloperDashboardPage } from './components/DeveloperDashboardPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useCart } from './hooks/useCart';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DeveloperAuthProvider } from './contexts/DeveloperAuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';

function AppContent() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        setPage={() => {}} 
        cartItemCount={itemCount} 
        user={user} 
        onLogout={logout} 
        onToggleAiAssistant={() => {}} 
      />
      <main className="flex-grow pt-32">
        <Routes>
          <Route path="/" element={<HomePage setPage={() => {}} setSelectedProductId={() => {}} />} />
          <Route path="/products" element={<ProductsPage setPage={() => {}} setSelectedProductId={() => {}} />} />
          <Route path="/cart" element={<CartPage setPage={() => {}} clearCart={() => {}} />} />
          <Route path="/login" element={<LoginPage setPage={() => {}} />} />
          <Route path="/dashboard" element={<AdminDashboardPage setPage={() => {}} />} />
          <Route path="/dev-console" element={<DeveloperDashboardPage onLogout={() => {}} />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
        </Routes>
      </main>
      <Footer setPage={() => {}} />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <DeveloperAuthProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </DeveloperAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
