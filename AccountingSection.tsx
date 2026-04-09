import React from 'react';
import { ChartBarIcon } from 'lucide-react';
import { Order, Product } from './types';

interface AccountingSectionProps {
    language: 'ar' | 'en';
    orders: Order[];
    products: Product[];
    handleUpdateOrder: (orderId: string, data: Partial<Order>) => Promise<void>;
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AccountingSection: React.FC<AccountingSectionProps> = ({
    language,
    orders,
    products,
    handleUpdateOrder,
    addToast,
}) => {
    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                <ChartBarIcon className="w-10 h-10 text-primary" />
                {language === 'ar' ? 'التكامل المالي والتحصيل' : 'Financial Integration & Collection'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="p-8 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">إجمالي المبيعات</p>
                    <p className="text-4xl font-black text-primary">
                        {orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)} ر.س
                    </p>
                </div>
                <div className="p-8 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">طلبات اليوم</p>
                    <p className="text-4xl font-black text-secondary">
                        {(orders || []).filter(
                            (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
                        ).length}
                    </p>
                </div>
                <div className="p-8 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">قيمة المخزون التقديرية</p>
                    <p className="text-4xl font-black text-slate-800">
                        {products.reduce((acc, p) => acc + p.price * p.stock_quantity, 0).toLocaleString()} ر.س
                    </p>
                </div>
                <div className="p-8 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">الطلبات المعلقة مالياً</p>
                    <p className="text-4xl font-black text-red-600">
                        {(orders || []).filter((o) => o.paymentStatus === 'pending').length}
                    </p>
                </div>
            </div>

            {/* Order Approval Section */}
            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-8">
                <h3 className="text-2xl font-black text-primary border-b pb-4">الموافقة على الطلبات والتحصيل المالي</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="text-gray-400 text-xs uppercase tracking-widest border-b">
                                <th className="pb-4">رقم الطلب</th>
                                <th className="pb-4">العميل</th>
                                <th className="pb-4">المبلغ الإجمالي</th>
                                <th className="pb-4">طريقة الدفع</th>
                                <th className="pb-4">حالة الدفع</th>
                                <th className="pb-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(orders || [])
                                .filter((o) => o.paymentStatus === 'pending')
                                .map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50 transition-all">
                                        <td className="py-6 font-black text-primary">#{order.id.slice(-6)}</td>
                                        <td className="py-6 font-bold">{order.customerName}</td>
                                        <td className="py-6 font-black text-secondary">{order.total.toFixed(2)} ر.س</td>
                                        <td className="py-6 font-bold text-xs uppercase">{order.paymentMethod}</td>
                                        <td className="py-6">
                                            <span className="px-4 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await handleUpdateOrder(order.id, {
                                                            paymentStatus: 'paid',
                                                            status: 'preparing',
                                                        });
                                                        addToast('تم تأكيد الدفع بنجاح', 'success');
                                                    } catch (err) {
                                                        addToast('فشل تأكيد الدفع', 'error');
                                                    }
                                                }}
                                                className="bg-green-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-green-700 transition-all shadow-lg"
                                            >
                                                تأكيد الاستلام المالي
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {orders.filter((o) => o.paymentStatus === 'pending').length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400 font-bold italic">
                                        لا توجد طلبات معلقة مالياً حالياً
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm">
                <div className="space-y-8">
                    <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-gray-100">
                        <div>
                            <h4 className="text-xl font-black">
                                {language === 'ar' ? 'ربط الحساب البنكي' : 'Bank Integration'}
                            </h4>
                            <p className="text-sm font-bold text-gray-400">ANB - SA4730400108095516770029</p>
                        </div>
                        <span className="bg-green-100 text-green-600 px-6 py-2 rounded-full font-black text-xs uppercase">
                            Connected
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-gray-100">
                        <div>
                            <h4 className="text-xl font-black">
                                {language === 'ar' ? 'نظام الفوترة الإلكترونية' : 'E-Invoicing'}
                            </h4>
                            <p className="text-sm font-bold text-gray-400">ZATCA Phase 2 Integration Active</p>
                        </div>
                        <span className="bg-green-100 text-green-600 px-6 py-2 rounded-full font-black text-xs uppercase">
                            Active
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-gray-100">
                        <div>
                            <h4 className="text-xl font-black">{language === 'ar' ? 'بوابة الدفع' : 'Payment Gateway'}</h4>
                            <p className="text-sm font-bold text-gray-400">Stripe / STC Pay Production Ready</p>
                        </div>
                        <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-black text-xs uppercase">
                            Pending
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
