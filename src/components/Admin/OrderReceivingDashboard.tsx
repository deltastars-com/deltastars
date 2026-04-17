import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../contexts/ToastContext';
import { Package, MapPin, CheckCircle, Clock, Truck, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  order_status: string;
  delivery_address: any;
  created_at: string;
  branch_id: string;
  driver_id: string | null;
}

export const OrderReceivingDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadOrders();
    const channel = supabase.channel('orders-receiving');
    channel.on('broadcast', { event: 'new-order' }, (payload) => {
      addToast(`طلب جديد رقم ${payload.payload.orderId.slice(-8)}`, 'info');
      loadOrders();
      const audio = new Audio('/notification.mp3');
      audio.play();
    }).subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('order_status', ['processing', 'assigned_to_branch', 'assigned_to_driver', 'shipped', 'out_for_delivery'])
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) addToast('فشل تحديث حالة الطلب', 'error');
    else addToast(`تم تحديث حالة الطلب`, 'success');
    loadOrders();
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      processing: { color: 'bg-blue-100 text-blue-600', text: 'قيد المعالجة' },
      assigned_to_branch: { color: 'bg-purple-100 text-purple-600', text: 'تم التوجيه للفرع' },
      assigned_to_driver: { color: 'bg-indigo-100 text-indigo-600', text: 'تم تعيين مندوب' },
      shipped: { color: 'bg-yellow-100 text-yellow-600', text: 'تم الشحن' },
      out_for_delivery: { color: 'bg-orange-100 text-orange-600', text: 'خرج للتوصيل' },
      delivered: { color: 'bg-green-100 text-green-600', text: 'تم التسليم' }
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-600', text: status };
  };

  if (loading) return <div className="animate-pulse p-8 text-center">جاري تحميل الطلبات...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          لوحة استقبال الطلبات
        </h2>
        <button onClick={loadOrders} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const statusBadge = getStatusBadge(order.order_status);
          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">#{order.id.slice(-8)}</p>
                    <p className="font-bold text-lg">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">{order.customer_phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{order.delivery_address?.city}، {order.delivery_address?.district}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{new Date(order.created_at).toLocaleTimeString('ar-SA')}</span>
                  </div>
                  <p className="font-bold text-primary">{order.total_amount.toLocaleString()} ر.س</p>
                </div>
                {order.order_status === 'assigned_to_branch' && (
                  <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-primary text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    <Package className="w-4 h-4" /> بدء التجهيز
                  </button>
                )}
                {order.order_status === 'preparing' && (
                  <button onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')} className="w-full bg-secondary text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> جاهز للاستلام
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>لا توجد طلبات حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};
