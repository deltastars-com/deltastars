import { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const useAppState = () => {
  const [appState, setAppState] = useState<'active' | 'background' | 'inactive'>('active');
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    if (!Capacitor.isNativePlatform()) return;

    const handlers = [
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        setAppState(isActive ? 'active' : 'background');
      }),
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          // الخروج من التطبيق عند الضغط على زر الرجوع في الصفحة الرئيسية
          CapacitorApp.exitApp();
        }
      })
    ];

    return () => {
      handlers.forEach(h => h.remove());
    };
  }, []);

  return { appState, isNative };
};
