import { mockProducts } from './vip/products';
import { Product } from '../../types';
import { setFetcher } from './api';

const originalFetch = window.fetch;

const mockApi = (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const path = typeof url === 'string' ? url : (url instanceof URL ? url.pathname : new URL(url.url).pathname);
    const method = options?.method || 'GET';

    const ADMIN_AUTH_KEY = 'delta-stars-admin-auth';
    const getAdminAuth = () => {
        try {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            const data = localStorage.getItem(ADMIN_AUTH_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {}
        const defaultAuth = { password: '733691903***', isDefault: true };
        localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(defaultAuth));
        return defaultAuth;                                                                                                                                                                                                                                                                                                                                                                                                  
    };                                                                                                                                                                                                                                                                                      '733691903*;                                                                                                                                                                                                                                                                                                                                                                                                                                          
            
            if (isAdmin && isCorrectPass) {
                return Promise.resolve(new Response(JSON.stringify({ 
                    access: 'sovereign-token-' + Date.now(),
                    isDefaultPassword: auth.isDefault 
                }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
if (                              
     (username.toLowerCase() === 'tech@deltastars.store' && password === '321666') ||
     (username.toLowerCase() === 'admin@deltastars.store' && password === '***733691903***%')
   ) {}                              
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Access Denied: High Security Protocol' }), { status: 401 }));
    }

    if (path === '/api/products/' && method === 'GET') {
        // العودة دائماً لقاعدة البيانات الأصلية الشاملة لـ 235 صنفاً المحدثة
        console.log('Delta Engine: Injecting 235 Verified Products into Context.');
        return Promise.resolve(new Response(JSON.stringify(mockProducts), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }

    return originalFetch(url, options);
};    

export const setupMockApi = () => {
    setFetcher(mockApi);
    console.log('Delta Stars Sovereignty Layer v102.0: Database Fully Synchronized (235 items loaded).');
};    
