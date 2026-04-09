import React, { useState } from 'react';
import { TruckIcon, PlusIcon, SearchIcon, FilterIcon } from './lib/contexts/Icons';

export default function ShipmentManagement() {
  const [shipments, setShipments] = useState([
    { id: 'SH-7701', supplier: 'مزارع القصيم', status: 'في الطريق', eta: '2024-04-10', items: 'تمور، خضروات', tracking: 'TRK99201' },
    { id: 'SH-7702', supplier: 'شركة النيل للاستيراد', status: 'تم الاستلام', eta: '2024-04-08', items: 'برتقال، ليمون', tracking: 'TRK99205' },
    { id: 'SH-7703', supplier: 'مزارع الجوف', status: 'قيد التجهيز', eta: '2024-04-12', items: 'زيت زيتون، تمور', tracking: 'TRK99210' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary mb-2">إدارة المشتريات والاستيراد 🚢</h2>
          <p className="text-gray-400 font-bold">تتبع الشحنات الدولية والمحلية وسجل الموردين</p>
        </div>
        <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
          <PlusIcon className="w-6 h-6" /> إضافة شحنة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">شحنات نشطة</p>
          <p className="text-4xl font-black text-primary">5</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">تصل اليوم</p>
          <p className="text-4xl font-black text-secondary">2</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">إجمالي الموردين</p>
          <p className="text-4xl font-black text-slate-800">18</p>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-black text-slate-800">قائمة الشحنات الجارية</h3>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <input type="text" placeholder="بحث برقم الشحنة..." className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary/20" />
              <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
            <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all">
              <FilterIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">رقم الشحنة</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">المورد</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">الأصناف</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">تاريخ الوصول المتوقع</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">التتبع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map(shipment => (
                <tr key={shipment.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6 font-black text-primary">{shipment.id}</td>
                  <td className="px-8 py-6 font-bold text-slate-700">{shipment.supplier}</td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-bold">{shipment.items}</td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-black">{shipment.eta}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                      shipment.status === 'تم الاستلام' ? 'bg-emerald-100 text-emerald-600' : 
                      shipment.status === 'في الطريق' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 group-hover:text-primary transition-all cursor-pointer">
                      <TruckIcon className="w-4 h-4" />
                      {shipment.tracking}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
