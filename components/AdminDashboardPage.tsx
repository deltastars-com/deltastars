import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabaseClient';
import { Page, Product } from '../../types';
import {
  Users, Package, Truck, MapPin, ShoppingBag, Gift, Ticket, Settings,
  DollarSign, Percent, Image, Eye, Edit, Trash2, PlusCircle, RefreshCw,
  Search, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';

interface AdminDashboardPageProps {
  setPage: (page: Page) => void;
}

// ==================== قسم الحسابات والمستخدمين ====================
const AccountsSection: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, email, phone, role, created_at');
      if (data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> الحسابات والمستخدمين</h3>
      {loading ? (
        <div className="animate-pulse">جاري التحميل...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="p-2 text-right">البريد/الهاتف</th><th className="p-2">الدور</th><th className="p-2">تاريخ التسجيل</th></tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.email || u.phone}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleDateString('ar-SA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== قسم العمليات والطلبات ====================
const OperationsSection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('id, customer_name, total_amount, order_status, created_at').order('created_at', { ascending: false }).limit(10);
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> العمليات والطلبات</h3>
      {loading ? <div className="animate-pulse">جاري التحميل...</div> : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center border-b py-2">
              <div><span className="font-mono text-xs">{order.id.slice(-8)}</span><br /><span className="text-sm">{order.customer_name}</span></div>
              <div className="text-right"><span className="font-bold">{order.total_amount} ر.س</span><br /><span className="text-xs text-gray-400">{order.order_status}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== قسم المندوبين ====================
const DriversSection: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  useEffect(() => {
    const fetchDrivers = async () => {
      const { data } = await supabase.from('drivers').select('*, users(full_name, phone)');
      if (data) setDrivers(data);
    };
    fetchDrivers();
  }, []);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> المندوبين</h3>
      {drivers.map((d) => (
        <div key={d.user_id} className="flex justify-between items-center border-b py-2">
          <div><span className="font-bold">{d.users?.full_name || 'مندوب'}</span><br /><span className="text-xs">{d.users?.phone}</span></div>
          <div className="text-right"><span className="text-xs bg-green-100 px-2 py-1 rounded-full">{d.current_status}</span></div>
        </div>
      ))}
    </div>
  );
};

// ==================== قسم الشحن والتوصيل ====================
const ShippingSection: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> الشحن والتوصيل</h3>
      <p className="text-gray-500">إعدادات مناطق التوصيل وأسعار الشحن (قريباً)</p>
    </div>
  );
};

// ==================== إدارة المنتجات ====================
const ProductsManagementSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = supabase.from('products').select('*', { count: 'exact' });
    if (search) {
      query = query.or(`name_ar.ilike.%${search}%,name_en.ilike.%${search}%`);
    }
    const { data, error, count } = await query.range(from, to).order('id');
    if (data) {
      setProducts(data);
      setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> إدارة المنتجات</h3>
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 p-2 border rounded-xl" />
        <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1"><PlusCircle className="w-4 h-4" /> إضافة</button>
      </div>
      {loading ? <div>جاري التحميل...</div> : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th>المنتج</th><th>السعر (كجم)</th><th>المخزون</th><th></th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.name_ar}</td>
                    <td>{p.price_1kg} ر.س</td>
                    <td>{p.stock_available}</td>
                    <td className="flex gap-2">
                      <button className="text-blue-500"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)} className="p-2 rounded-full bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            <span>صفحة {currentPage} من {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p+1)} className="p-2 rounded-full bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
          </div>
        </>
      )}
    </div>
  );
};

// ==================== صالة العروض الترويجية ====================
const PromotionsSection: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase.from('promotions').select('*').eq('is_active', true);
      if (data) setBanners(data);
    };
    fetchBanners();
  }, []);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Image className="w-5 h-5 text-primary" /> صالة العروض الترويجية</h3>
      <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold mb-4 flex items-center gap-2"><PlusCircle className="w-4 h-4" /> إضافة عرض جديد</button>
      {banners.map((b) => (
        <div key={b.id} className="border rounded-xl p-2 mb-2 flex justify-between">
          <span>{b.title_ar}</span>
          <button className="text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
};

// ==================== الكاش باك والكوبونات ====================
const CashbackCouponsSection: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  useEffect(() => {
    const fetchCoupons = async () => {
      const { data } = await supabase.from('coupons').select('*');
      if (data) setCoupons(data);
    };
    fetchCoupons();
  }, []);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" /> الكاش باك والكوبونات</h3>
      <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold mb-4">إضافة كوبون جديد</button>
      {coupons.map((c) => (
        <div key={c.id} className="border rounded-xl p-2 mb-2 flex justify-between">
          <span>{c.code} - {c.discount_value} {c.discount_type === 'percentage' ? '%' : 'ر.س'}</span>
          <button className="text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
};

// ==================== إدارة الحماية وكلمات المرور ====================
const SecuritySection: React.FC = () => {
  const { changeAdminPassword, user } = useAuth();
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      addToast('كلمتا المرور غير متطابقتين', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
      return;
    }
    try {
      await changeAdminPassword(newPassword);
      addToast('تم تغيير كلمة المرور بنجاح', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addToast('فشل تغيير كلمة المرور', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> إدارة الحماية وكلمات المرور</h3>
      <div className="space-y-4">
        <input type="password" placeholder="كلمة المرور الجديدة" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border rounded-xl" />
        <input type="password" placeholder="تأكيد كلمة المرور الجديدة" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded-xl" />
        <button onClick={handleChangePassword} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">تغيير كلمة المرور</button>
      </div>
    </div>
  );
};

// ==================== المكون الرئيسي للوحة ====================
export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setPage }) => {
  const { user, logout } = useAuth();

  const sections = [
    { id: 'accounts', component: <AccountsSection /> },
    { id: 'operations', component: <OperationsSection /> },
    { id: 'drivers', component: <DriversSection /> },
    { id: 'shipping', component: <ShippingSection /> },
    { id: 'products', component: <ProductsManagementSection /> },
    { id: 'promotions', component: <PromotionsSection /> },
    { id: 'cashback', component: <CashbackCouponsSection /> },
    { id: 'security', component: <SecuritySection /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-primary text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black">لوحة التحكم العامة</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm hidden md:inline">{user?.email || 'Admin'}</span>
            <button onClick={logout} className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30">تسجيل خروج</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.id}>{section.component}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
