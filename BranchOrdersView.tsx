
import React, { useState, useEffect } from 'react';
import { Order, Branch } from './types';
import { useI18n } from './I18nContext';
import { useFirebase } from './lib/contexts/FirebaseContext';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { DeliveryIcon, LocationMarkerIcon, QualityIcon, EyeIcon, XIcon } from './lib/contexts/Icons';
import { useToast } from './ToastContext';

interface BranchOrdersViewProps {
    branchId: string;
    onBack: () => void;
}

export const BranchOrdersView: React.FC<BranchOrdersViewProps> = ({ branchId, onBack }) => {
    const { language, t } = useI18n();
    const { db } = useFirebase();
    const { addToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    useEffect(() => {
        if (db && branchId) {
            const q = query(collection(db, 'orders'), where('branchId', '==', branchId));
            const unsub = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setLoading(false);
            }, (err) => {
                console.error(err);
                setLoading(false);
            });
            return () => unsub();
        }
    }, [db, branchId]);

    const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
        if (!db) return;
        try {
            await updateDoc(doc(db, 'orders', orderId), { status });
            addToast(language === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated', 'success');
        } catch (e) {
            addToast('Error updating status', 'error');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-24 text-black">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[4rem] shadow-xl border border-gray-100 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-primary mb-2">شاشة استقبال الطلبات</h2>
                    <p className="text-gray-400 font-bold">فرع: {branchId} • متابعة وتجهيز الطلبات الواردة</p>
                </div>
                <button onClick={onBack} className="bg-gray-100 text-gray-500 px-10 py-5 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all">الرجوع</button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    <div className="p-20 text-center font-black text-gray-300 uppercase tracking-[0.5em]">Loading Branch Orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-100">
                        <p className="text-2xl font-black text-gray-300 uppercase">لا توجد طلبات لهذا الفرع حالياً</p>
                    </div>
                ) : (
                    (orders || []).map(order => (
                        <div key={order.id} className="bg-white p-10 rounded-[4rem] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-4xl transition-all">
                            <div className="flex items-center gap-8">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-xl ${
                                    order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-primary text-white'
                                }`}>
                                    {order.status === 'delivered' ? '✅' : '📦'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">#{order.id.slice(-6)}</h3>
                                    <p className="font-bold text-gray-400">{order.customerName}</p>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{order.paymentMethod}</span>
                                        <span className="text-[10px] font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase tracking-widest">{order.total} ر.س</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button 
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setIsOrderModalOpen(true);
                                    }}
                                    className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-primary hover:text-white transition-all"
                                >
                                    <EyeIcon className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                    className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                                        order.status === 'preparing' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                >
                                    تجهيز
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(order.id, 'setup')}
                                    className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                                        order.status === 'setup' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
                                    }`}
                                >
                                    إعداد
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                    className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                                        order.status === 'shipped' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                                >
                                    شحن
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                    className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                                        order.status === 'delivered' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600'
                                    }`}
                                >
                                    تسليم
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            {isOrderModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-scale-in">
                        <div className="p-8 md:p-12 border-b-2 border-gray-50 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">تفاصيل الطلب #{selectedOrder.id.slice(-6)}</h3>
                                <p className="text-gray-400 font-bold mt-1">{new Date(selectedOrder.createdAt).toLocaleString('ar-SA')}</p>
                            </div>
                            <button 
                                onClick={() => setIsOrderModalOpen(false)}
                                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all group"
                            >
                                <XIcon className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="p-8 md:p-12 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">معلومات العميل</h4>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                                        <p className="text-xl font-black text-slate-800">{selectedOrder.customerName}</p>
                                        <p className="text-sm font-bold text-gray-400 mt-1">ID: {selectedOrder.customerId}</p>
                                        <p className="text-sm font-bold text-primary mt-2">طريقة الدفع: {selectedOrder.paymentMethod}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">حالة الطلب</h4>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                                        <span className={`px-6 py-2 rounded-full font-black text-xs uppercase ${
                                            selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                            selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">محتويات الطلب</h4>
                                <div className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden">
                                    <table className="w-full text-right">
                                        <thead className="bg-slate-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-5 font-black text-primary text-xs uppercase">المنتج</th>
                                                <th className="p-5 font-black text-primary text-xs uppercase text-center">الكمية</th>
                                                <th className="p-5 font-black text-primary text-xs uppercase">السعر</th>
                                                <th className="p-5 font-black text-primary text-xs uppercase">الإجمالي</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {(selectedOrder.items || []).map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 transition-all">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-4">
                                                            <img src={item.image} alt={item.name_ar} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                                            <div>
                                                                <p className="font-black text-slate-800">{item.name_ar}</p>
                                                                <p className="text-[10px] font-bold text-gray-400">{item.unit_ar}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-center font-black text-slate-600">x{item.quantity}</td>
                                                    <td className="p-5 font-bold text-slate-600">{item.price} ر.س</td>
                                                    <td className="p-5 font-black text-secondary">{(item.price * item.quantity).toFixed(2)} ر.س</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-50 border-t-2 border-gray-100">
                                            <tr>
                                                <td colSpan={3} className="p-6 text-left font-black text-slate-400 uppercase tracking-widest">الإجمالي الكلي</td>
                                                <td className="p-6 font-black text-3xl text-secondary">{selectedOrder.total} ر.س</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8 md:p-12 bg-slate-50 border-t-2 border-gray-100 flex justify-end gap-4">
                            <button 
                                onClick={() => setIsOrderModalOpen(false)}
                                className="px-10 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black text-slate-400 hover:bg-gray-100 transition-all"
                            >
                                إغلاق
                            </button>
                            <button 
                                onClick={() => {
                                    window.print();
                                }}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:bg-secondary transition-all"
                            >
                                طباعة الفاتورة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
