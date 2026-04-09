import React from 'react';
import { createRoot } from 'react-dom/client';
import AppContent from '../App';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from '../ToastContext';
import { I18nProvider } from '../I18nContext';
import { CartProvider } from '../CartContext';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </React.StrictMode>
  );
}
