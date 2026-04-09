import React from 'react';
import { useFirebase } from './lib/contexts/FirebaseContext';

export default function DashboardStats() {
  const { orders, products } = useFirebase();
  
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeShipments = orders.filter(o => o.status === 'preparing' || o.status === 'setup').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-bold mb-2">إجمالي الطلبات اليوم</p>
        <h3 className="text-3xl font-black text-primary">{todayOrders.length}</h3>
        <div className="mt-4 flex items-center text-green-500 text-xs font-bold">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          +12% من أمس
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-bold mb-2">الشحنات النشطة</p>
        <h3 className="text-3xl font-black text-secondary">{activeShipments}</h3>
        <div className="mt-4 flex items-center text-blue-500 text-xs font-bold">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          في الوقت المحدد
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-bold mb-2">إجمالي المبيعات</p>
        <h3 className="text-3xl font-black text-primary">{totalRevenue.toLocaleString()} ر.س</h3>
        <div className="mt-4 flex items-center text-green-500 text-xs font-bold">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          +5% هذا الشهر
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-bold mb-2">إجمالي المنتجات</p>
        <h3 className="text-3xl font-black text-yellow-500">{products.length}</h3>
        <div className="mt-4 flex items-center text-yellow-500 text-xs font-bold">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          نشط في المتجر
        </div>
      </div>
    </div>
  );
}
