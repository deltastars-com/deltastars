import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { setupMockApi } from './components/lib/mockApi';

// Initialize Mock API Layer
setupMockApi();

/**
 * Delta Stars Sovereign Update Engine v61.0
 * نظام التحديث التلقائي اللحظي والتعافي من الانقطاع
 */
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = 'service-worker.js';
    
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Delta Engine v62.0: Sovereign Stable & Synchronizing');
        
        setInterval(() => {
          registration.update().catch(err => console.debug('Sync delayed:', err.message));
        }, 60 * 1000);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
                console.log('Sovereign Update v62.0 Installed. Refreshing context...');
              }
            };
          }
        };
      })
      .catch(error => {
        console.warn('Delta Shield: Cloud Sync Offline.', error.message);
      });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}
*/

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Critical Mount Failure.");

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
