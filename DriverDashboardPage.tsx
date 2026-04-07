import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { useDriverTracking } from '../hooks/useDriverTracking';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { Page, Order } from '../../types';
import api from '../services/api';
import { Truck, MapPin, Navigation, Star, CheckCircle } from 'lucide-react';

export const DriverDashboardPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
  const { user } = useAuth();
  const { location, startWatching, stopWatching, isWatching } = useLocation(true);
  const { updateMyLocation } = useDriverTracking();
  const { addToast } = useToast();
  const { t, language } = useI18n();
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ todayDeliveries: 0, todayEarnings: 0, rating: 4.8, totalDeliveries: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        // نحتاج إلى دالة getUserOrders في api، لكنها غير موجودة. سنستخدم طريقة بديلة:
        // في الواقع، يمكن جلب الطلبات عبر supabase مباشرة، ولكن للتبسيط سنستخدم orders التي تم تعيينها للمندوب.
        // هذا مجرد مثال؛ يجب تعديله حسب هيكل قاعدة البيانات.
        const { data: orders } = await supabase.from('orders').select('*').eq('driver_id', user?.id);
        const all = orders || [];
        setAvailableOrders(all.filter(o => o.order_status === 'pending'));
        setCurrentOrder(all.find(o => o.order_status === 'shipped') || null);
        const completed = all.filter(o => o.order_status === 'delivered');
        const today = new Date().toDateString();
        setStats({
          todayDeliveries: completed.filter(o => new Date(o.created_at).toDateString() === today).length,
          todayEarnings: 15 * completed.filter(o => new Date(o.created_at).toDateString() === today).length,
          rating: 4.8,
          totalDeliveries: completed.length,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.id) load();
  }, [user?.id]);

  useEffect(() => {
    if (isOnline) startWatching();
    else stopWatching();
  }, [isOnline]);

  useEffect(() => {
    if (isOnline && location && currentOrder) updateMyLocation(location.lat, location.lng, currentOrder.id);
  }, [isOnline, location, currentOrder]);

  const acceptOrder = async (order: Order) => {
    await api.updateOrderStatus(order.id, 'shipped');
    await api.updateDriverLocation(user?.id || '', location?.lat || 0, location?.lng || 0, order.id);
    setCurrentOrder(order);
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    addToast('تم قبول الطلب', 'success');
  };

  const completeDelivery = async () => {
    if (!currentOrder) return;
    await api.updateOrderStatus(currentOrder.id, 'delivered');
    addToast('تم تسليم الطلب', 'success');
    setCurrentOrder(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-primary text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-6"><button onClick={() => setPage('home')} className="text-white/70">← العودة</button><h1 className="text-2xl font-black">لوحة المندوب</h1><div className="w-10"></div></div>
        <div className="bg-white/10 rounded-2xl p-4 flex justify-between items-center"><div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div><span className="font-bold">{isOnline ? 'متصل' : 'غير متصل'}</span></div><button onClick={() => setIsOnline(!isOnline)} className={`px-6 py-2 rounded-full font-bold ${isOnline ? 'bg-red-500' : 'bg-green-500'} text-white`}>{isOnline ? 'إيقاف' : 'تشغيل'}</button></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl"><p className="text-gray-400 text-xs">توصيلات اليوم</p><p className="text-3xl font-black text-primary">{stats.todayDeliveries}</p></div>
          <div className="bg-white p-4 rounded-2xl"><p className="text-gray-400 text-xs">أرباح اليوم</p><p className="text-3xl font-black text-green-600">{stats.todayEarnings} ر.س</p></div>
          <div className="bg-white p-4 rounded-2xl flex items-center gap-1"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /><span className="text-2xl font-black">{stats.rating}</span></div>
          <div className="bg-white p-4 rounded-2xl"><p className="text-gray-400 text-xs">إجمالي التوصيلات</p><p className="text-3xl font-black text-primary">{stats.totalDeliveries}</p></div>
        </div>
        {currentOrder && <div className="bg-white rounded-3xl shadow-lg mb-8 overflow-hidden"><div className="bg-secondary text-white px-6 py-4 font-black flex items-center gap-2"><Truck className="w-5 h-5" /> الطلب الحالي</div><div className="p-6"><div className="flex justify-between"><div><p className="text-gray-400 text-xs">رقم الطلب</p><p className="font-mono font-bold">{currentOrder.id}</p></div><div><p className="text-gray-400 text-xs">المبلغ</p><p className="font-black text-lg">{currentOrder.total_amount} ر.س</p></div></div><div className="border-t pt-4 mt-4"><MapPin className="w-4 h-4 text-gray-400 inline ml-1" />{(currentOrder.delivery_address as any)?.city}</div><button onClick={completeDelivery} className="w-full mt-6 py-4 bg-green-500 text-white rounded-2xl font-black flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5" /> تأكيد التسليم</button></div></div>}
        {availableOrders.length > 0 && <div><h2 className="text-xl font-black mb-4">طلبات متاحة ({availableOrders.length})</h2>{availableOrders.map(order => <div key={order.id} className="bg-white rounded-2xl p-5 mb-4 shadow-sm"><div className="flex justify-between"><div><p className="text-xs text-gray-400">طلب #{order.id.slice(-8)}</p><p className="font-bold">{order.customer_name}</p></div><div className="text-right"><p className="text-lg font-black text-primary">{order.total_amount} ر.س</p></div></div><button onClick={() => acceptOrder(order)} disabled={!isOnline} className={`w-full mt-3 py-3 rounded-xl font-bold ${isOnline ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>قبول التوصيل</button></div>)}</div>}
        {!isOnline && availableOrders.length === 0 && !currentOrder && <div className="text-center py-16"><Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-black text-gray-600">أنت غير متصل</h3><p className="text-gray-400">فعّل الاتصال لاستلام الطلبات</p></div>}
      </div>
    </div>
  );
};
