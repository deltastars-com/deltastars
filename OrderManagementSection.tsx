
import React, { useState } from 'react';
import { Order, Branch } from './types';
import { useI18n } from './I18nContext';
import { useToast } from './ToastContext';
import { db, doc, updateDoc, handleFirestoreError, OperationType } from '@/firebase';
import { EyeIcon } from './lib/contexts/Icons';

interface OrderManagementSectionProps {
    orders: Order[];
    branches: Branch[];
    onViewOrder: (order: Order) => void;
}

export const OrderManagementSection: React.FC<OrderManagementSectionProps> = ({ orders, branches, onViewOrder }) => {
    const { language } = useI18n();
    const { addToast } = useToast();

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status });
            addToast('تم تحديث حالة الطلب', 'success');
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, 'orders');
            addToast('فشل في تحديث حالة الطلب', 'error');
        }
    };

    const handleAssignOrderToBranch = async (orderId: string, branchId: string) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { branchId });
            addToast('تم تعيين الفرع للطلب', 'success');
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, 'orders');
            addToast('فشل في تعيين الفرع', 'error');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black text-slate-800 uppercase">Order Command Center</h2>
            
            <div className="bg-white rounded-[3rem] border-2 border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b-2 border-gray-100">
                        <tr>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">رقم الطلب</th>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">العميل</th>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">التاريخ</th>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">المبلغ</th>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">الحالة</th>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">الفرع</th>
                            <th className="p-6 font-black text-primary uppercase tracking-widest text-xs">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {(orders || []).map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-all">
                                <td className="p-6 font-black text-slate-800">#{order.id.slice(-6)}</td>
                                <td className="p-6 font-bold text-slate-600">{order.customerName || 'عميل VIP'}</td>
                                <td className="p-6 text-sm text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                                <td className="p-6 font-black text-secondary">{order.total} ر.س</td>
                                <td className="p-6">
                                    <select 
                                        value={order.status}
                                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                        className={`p-2 rounded-lg font-black text-xs border-2 ${
                                            order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                            order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                            'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}
                                    >
                                        <option value="pending">قيد الانتظار (Received)</option>
                                        <option value="preparing">جاري التجهيز (Preparation)</option>
                                        <option value="setup">جاري الإعداد والتحميل (Setup)</option>
                                        <option value="shipped">قيد الشحن (Shipping)</option>
                                        <option value="delivered">تم التسليم (Delivered)</option>
                                        <option value="cancelled">ملغي (Cancelled)</option>
                                    </select>
                                </td>
                                <td className="p-6">
                                    <select 
                                        value={order.branchId || ''}
                                        onChange={e => handleAssignOrderToBranch(order.id, e.target.value)}
                                        className="p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                                    >
                                        <option value="">غير محدد</option>
                                        {(branches || []).map(b => (
                                            <option key={b.id} value={b.id}>{b.name_ar}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-6">
                                    <button 
                                        onClick={() => onViewOrder(order)}
                                        className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary hover:text-white transition-all"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
