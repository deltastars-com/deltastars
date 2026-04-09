import React, { useState, useMemo } from 'react';
import { useFirebase, useI18n, useToast } from './lib/contexts';
import QualityManagement from './QualityManagement';
import ComplaintsManagement from './ComplaintsManagement';
import ShipmentManagement from './ShipmentManagement';
import DelegatesManagement from './DelegatesManagement';
import ShippingManagementSection from './ShippingManagementSection';
import SecuritySection from './SecuritySection';
import AccountingManagement from './AccountingManagement';
import { DeveloperDashboard } from './DeveloperDashboard';
import { ProductManagementSection } from './ProductManagementSection';
import { UserManagementSection } from './UserManagementSection';
import { AdManagementSection } from './AdManagementSection';
import { CouponManagementSection } from './CouponManagementSection';
import { BranchManagementSection } from './BranchManagementSection';
import { PriceUpdateRequestSection } from './PriceUpdateRequestSection';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  PackageIcon, 
  TrendingUpIcon, 
  DollarSignIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  XIcon,
  SearchIcon,
  FilterIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  EyeIcon,
  MapPinIcon,
  TruckIcon,
  BellIcon,
  MegaphoneIcon,
  TicketIcon,
  MapIcon
} from './lib/contexts/Icons';
import { query, collection, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { MarketingView } from './MarketingView';
import { BranchOrdersView } from './BranchOrdersView';
import { BRANCH_LOCATIONS } from './constants';

interface AdminDashboardProps {
  user: any;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { language, formatCurrency } = useI18n();
  const { products, orders, updateProduct, deleteProduct, addProduct, updateOrder, categories, db } = useFirebase();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState(user.type === 'marketing' ? 'products' : 'overview');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter((n: any) => !n.isRead).length);
    });
    return () => unsubscribe();
  }, []);

  // Form State
  const [formData, setFormData] = useState<any>({
    name_ar: '',
    name_en: '',
    price: 0,
    category: 'vegetables',
    image: '',
    description_ar: '',
    description_en: '',
    stock_quantity: 100,
    unit_ar: 'كيلو',
    unit_en: 'kg'
  });

  // --- Tabs Configuration based on Role and Permissions ---
  const tabs = useMemo(() => {
    const userPermissions = user.permissions || [];
    
    const allTabs = [
      { id: 'overview', label: 'نظرة عامة', icon: TrendingUpIcon, roles: ['admin', 'marketing', 'developer', 'ops'], permission: null },
      { id: 'products', label: 'إدارة المنتجات', icon: PackageIcon, roles: ['admin', 'marketing', 'developer'], permission: 'manage_products' },
      { id: 'shipments', label: 'المشتريات والشحنات', icon: TruckIcon, roles: ['admin', 'ops', 'developer'], permission: 'manage_shipments' },
      { id: 'orders', label: 'الطلبات والمبيعات', icon: ShoppingCartIcon, roles: ['admin', 'marketing', 'developer', 'ops'], permission: 'receive_orders' },
      { id: 'customers', label: 'قاعدة العملاء', icon: UserIcon, roles: ['admin', 'developer'], permission: 'manage_users' },
      { id: 'accounting', label: 'النظام المحاسبي', icon: DollarSignIcon, roles: ['admin', 'developer'], permission: 'manage_accounting' },
      { id: 'delegates', label: 'المندوبين', icon: TruckIcon, roles: ['admin', 'developer', 'ops'], permission: 'manage_users' },
      { id: 'shipping', label: 'الشحن والتوصيل', icon: MapPinIcon, roles: ['admin', 'developer'], permission: 'manage_branches' },
      { id: 'quality', label: 'إدارة الجودة', icon: ShieldCheckIcon, roles: ['admin', 'developer', 'ops'], permission: 'manage_quality' },
      { id: 'complaints', label: 'الشكاوى', icon: MessageSquareIcon, roles: ['admin', 'developer', 'ops'], permission: 'manage_complaints' },
      { id: 'ads', label: 'الإعلانات', icon: MegaphoneIcon, roles: ['admin', 'marketing', 'developer'], permission: 'manage_ads' },
      { id: 'coupons', label: 'الكوبونات', icon: TicketIcon, roles: ['admin', 'marketing', 'developer'], permission: 'manage_coupons' },
      { id: 'branches', label: 'الفروع', icon: MapIcon, roles: ['admin', 'developer'], permission: 'manage_branches' },
      { id: 'price_requests', label: 'طلبات الأسعار', icon: TrendingUpIcon, roles: ['admin', 'developer'], permission: 'manage_prices' },
      { id: 'branch_orders', label: 'طلبات الفرع', icon: MapPinIcon, roles: ['admin', 'developer', 'ops'], permission: 'receive_orders' },
      { id: 'security', label: 'إدارة الحماية', icon: ShieldCheckIcon, roles: ['admin', 'developer'], permission: 'manage_developer' },
      { id: 'developer', label: 'قسم المطور', icon: EditIcon, roles: ['developer'], permission: 'manage_developer' },
    ];

    return allTabs.filter(tab => {
      if (user.type === 'developer') return true;
      if (tab.permission && userPermissions.includes(tab.permission)) return true;
      return tab.roles.includes(user.type);
    });
  }, [user.type, user.permissions]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const totalRevenue = orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
    const totalProducts = products?.length || 0;
    return { totalRevenue, pendingOrders, totalProducts };
  }, [orders, products]);

  const filteredItems = useMemo(() => {
    return products?.filter(item => 
      (item.name_ar || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.name_en || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [products, searchTerm]);

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      addToast(language === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated', 'success');
    } catch (err) {
      addToast(language === 'ar' ? 'خطأ في التحديث' : 'Update error', 'error');
    }
  };

  const handleAssignBranch = async (orderId: string, branchId: string) => {
    try {
      await updateOrder(orderId, { branchId });
      addToast(language === 'ar' ? 'تم تعيين الفرع للطلب' : 'Branch assigned to order', 'success');
    } catch (err) {
      addToast(language === 'ar' ? 'خطأ في التعيين' : 'Assignment error', 'error');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (user.type === 'marketing') {
      addToast(language === 'ar' ? 'لا تملك صلاحية الحذف' : 'No delete permission', 'error');
      return;
    }
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        addToast(language === 'ar' ? 'تم حذف المنتج' : 'Product deleted', 'success');
      } catch (err) {
        addToast(language === 'ar' ? 'خطأ في الحذف' : 'Delete error', 'error');
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateProduct(editingItem.id, formData);
        addToast(language === 'ar' ? 'تم تحديث المنتج' : 'Product updated', 'success');
      } else {
        await addProduct(formData);
        addToast(language === 'ar' ? 'تم إضافة المنتج' : 'Product added', 'success');
      }
      setIsAddingItem(false);
      setEditingItem(null);
      setFormData({
        name_ar: '',
        name_en: '',
        price: 0,
        category: 'vegetables',
        image: '',
        description_ar: '',
        description_en: '',
        stock_quantity: 100,
        unit_ar: 'كيلو',
        unit_en: 'kg'
      });
    } catch (err) {
      addToast(language === 'ar' ? 'خطأ في الحفظ' : 'Save error', 'error');
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name_ar: item.name_ar,
      name_en: item.name_en,
      price: item.price,
      category: item.category,
      image: item.image,
      description_ar: item.description_ar || '',
      description_en: item.description_en || '',
      stock_quantity: item.stock_quantity || 100,
      unit_ar: item.unit_ar || 'كيلو',
      unit_en: item.unit_en || 'kg'
    });
    setIsAddingItem(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-tajawal">
      {/* Sidebar */}
      <aside className="w-80 bg-primary text-white p-10 flex flex-col border-l-[10px] border-secondary">
        <div className="mb-20">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Delta Stars</h2>
          <p className="text-secondary font-bold text-xs mt-2 uppercase tracking-widest">
            {user.type === 'admin' ? 'لوحة الإدارة العامة' : 
             user.type === 'marketing' ? 'لوحة التسويق والمبيعات' : 'لوحة المطور السيادية'}
          </p>
        </div>
        
        <nav className="flex-1 space-y-4">
          {(tabs || []).map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-sm transition-all ${activeTab === tab.id ? 'bg-secondary text-white shadow-xl translate-x-2' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <tab.icon className="w-6 h-6" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-white/5 p-6 rounded-3xl border border-white/10">
          <p className="text-xs font-bold text-gray-500 mb-2">المستخدم الحالي</p>
          <p className="text-sm font-black text-secondary break-all">{user.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {/* غرفة العمليات - الهيدر */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl mb-10 flex flex-col md:flex-row justify-between items-center gap-6 border-r-[12px] border-green-700">
          <div>
            <h1 className="text-4xl font-black text-green-900 mb-2">غرفة العمليات المركزية</h1>
            <p className="text-gray-400 font-bold flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              نظام الإدارة السيادي - {user.type === 'admin' ? 'المدير العام' : user.type === 'developer' ? 'المطور التقني' : 'مسؤول التسويق'}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Notification Bell */}
            <div className="relative group">
              <button className="p-4 bg-green-50 rounded-2xl border-2 border-green-100 text-green-700 hover:bg-green-100 transition-all relative">
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute top-full left-0 mt-4 w-80 bg-white rounded-3xl shadow-4xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-6">
                <h4 className="font-black text-primary mb-4 flex items-center justify-between">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-400 uppercase tracking-widest">Live Radar</span>
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 italic text-sm">{language === 'ar' ? 'لا توجد إشعارات حالياً' : 'No notifications'}</p>
                  ) : (notifications || []).map(n => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 hover:border-primary transition-all cursor-pointer">
                      <p className="font-black text-sm text-slate-800">{language === 'ar' ? n.title_ar : n.title_en}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{language === 'ar' ? n.message_ar : n.message_en}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{new Date(n.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 px-6 py-3 rounded-2xl border-2 border-green-100 text-center">
              <p className="text-[10px] text-gray-400 font-black uppercase">حالة النظام</p>
              <p className="text-green-600 font-black flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-ping"></span>
                متصل وآمن
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-green-600 flex items-center justify-between transform hover:scale-105 transition-all">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">إجمالي الإيرادات</p>
                  <h4 className="text-4xl font-black text-green-700">{formatCurrency(stats.totalRevenue)}</h4>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center text-green-700">
                  <DollarSignIcon className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-yellow-500 flex items-center justify-between transform hover:scale-105 transition-all">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">طلبات قيد الانتظار</p>
                  <h4 className="text-4xl font-black text-yellow-600">{stats.pendingOrders} طلب</h4>
                </div>
                <div className="w-16 h-16 bg-yellow-100 rounded-3xl flex items-center justify-center text-yellow-600">
                  <ShoppingCartIcon className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-blue-500 flex items-center justify-between transform hover:scale-105 transition-all">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">إجمالي المنتجات</p>
                  <h4 className="text-4xl font-black text-blue-600">{stats.totalProducts} صنف</h4>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
                  <PackageIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-black text-primary mb-8">آخر الطلبات الواردة 📦</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-gray-400 border-b-2 font-bold text-sm">
                      <th className="py-6">رقم الطلب</th>
                      <th>العميل</th>
                      <th>التاريخ</th>
                      <th>المبلغ</th>
                      <th>الحالة</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.slice(0, 5).map(order => (
                      <tr key={order.id} className="border-b hover:bg-slate-50 transition-all group">
                        <td className="py-6 font-black text-primary">#{order.id.slice(0, 8)}</td>
                        <td className="font-bold text-gray-600">{order.customerName || 'عميل VIP'}</td>
                        <td className="text-gray-400 font-bold text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="font-black text-secondary">{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'delivered' ? 'مكتمل' : order.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => handleStatusChange(order.id, 'delivered')} className="text-emerald-600 hover:scale-110 transition-transform"><CheckCircleIcon className="w-6 h-6" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          user.type === 'marketing' ? (
            <MarketingView 
              products={products} 
              onUpdateProduct={updateProduct} 
              onAddProduct={addProduct} 
              onBack={() => setActiveTab('overview')} 
            />
          ) : (
            <ProductManagementSection />
          )
        )}

        {activeTab === 'orders' && (
          <div className="space-y-12 animate-fade-in">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-primary">إدارة الطلبات والمبيعات 📦</h3>
                <div className="flex gap-4">
                   <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-black uppercase">إجمالي الطلبات</p>
                      <p className="text-xl font-black text-primary">{orders?.length || 0}</p>
                   </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-gray-400 border-b-2 font-bold text-sm">
                      <th className="py-6">رقم الطلب</th>
                      <th>العميل</th>
                      <th>التاريخ</th>
                      <th>المبلغ</th>
                      <th>الفرع</th>
                      <th>الحالة</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map(order => (
                      <tr key={order.id} className="border-b hover:bg-slate-50 transition-all group">
                        <td className="py-6 font-black text-primary">#{order.id.slice(0, 8)}</td>
                        <td className="font-bold text-gray-600">
                          <div>
                            <p>{order.customerName || 'عميل VIP'}</p>
                            <p className="text-[10px] text-gray-400">{order.customerId}</p>
                          </div>
                        </td>
                        <td className="text-gray-400 font-bold text-xs">{new Date(order.createdAt).toLocaleString('ar-SA')}</td>
                        <td className="font-black text-secondary">{formatCurrency(order.total)}</td>
                        <td>
                          <select 
                            value={order.branchId || ''} 
                            onChange={(e) => handleAssignBranch(order.id, e.target.value)}
                            className="bg-slate-100 p-2 rounded-xl text-xs font-bold outline-none border-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">غير معين</option>
                            {BRANCH_LOCATIONS.map(branch => (
                              <option key={branch.id} value={branch.id}>{branch.name_ar}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-none outline-none ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <option value="pending">قيد الانتظار</option>
                            <option value="preparing">جاري التجهيز</option>
                            <option value="setup">جاري الإعداد</option>
                            <option value="shipped">قيد الشحن</option>
                            <option value="delivered">تم التسليم</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                            className="text-primary hover:scale-110 transition-transform p-2 bg-slate-100 rounded-xl"
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
          </div>
        )}

        {activeTab === 'customers' && (
          <UserManagementSection />
        )}

        {activeTab === 'ads' && (
          <AdManagementSection />
        )}

        {activeTab === 'coupons' && (
          <CouponManagementSection />
        )}

        {activeTab === 'branches' && (
          <BranchManagementSection />
        )}

        {activeTab === 'price_requests' && (
          <PriceUpdateRequestSection />
        )}

        {/* Order Details Modal */}
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[500] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-8 md:p-12 border-b-2 border-gray-50 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">تفاصيل الطلب #{selectedOrder.id.slice(0, 8)}</h3>
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
                      <p className="text-xl font-black text-slate-800">{selectedOrder.customerName || 'عميل VIP'}</p>
                      <p className="text-sm font-bold text-gray-400 mt-1">ID: {selectedOrder.customerId}</p>
                      <p className="text-sm font-bold text-primary mt-2">طريقة الدفع: {selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">حالة الطلب والفرع</h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400">الحالة الحالية:</span>
                        <span className={`px-4 py-1 rounded-full font-black text-[10px] uppercase ${
                          selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400">الفرع المسؤول:</span>
                        <span className="font-black text-primary text-sm">
                          {BRANCH_LOCATIONS.find(b => b.id === selectedOrder.branchId)?.name_ar || 'غير محدد'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">أصناف الطلب</h4>
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
                        {selectedOrder.items?.map((item: any, idx: number) => (
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
                          <td colSpan={3} className="p-6 text-left font-black text-slate-400 uppercase tracking-widest">المبلغ الإجمالي</td>
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
                  onClick={() => window.print()}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:bg-secondary transition-all"
                >
                  طباعة الفاتورة
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounting' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AccountingManagement />
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <QualityManagement />
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ComplaintsManagement />
          </div>
        )}

        {activeTab === 'shipments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ShipmentManagement />
          </div>
        )}

        {activeTab === 'delegates' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DelegatesManagement />
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ShippingManagementSection />
          </div>
        )}

        {activeTab === 'branch_orders' && (
          <BranchOrdersView 
            branchId={user.assignedBranchId || BRANCH_LOCATIONS[0].id} 
            onBack={() => setActiveTab('overview')} 
          />
        )}

        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SecuritySection />
          </div>
        )}

        {activeTab === 'developer' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DeveloperDashboard onBack={() => setActiveTab('stats')} />
          </div>
        )}
      </main>
    </div>
  );
}
