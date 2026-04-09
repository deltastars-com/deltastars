import React, { useState, useMemo } from 'react';
import { useFirebase, useI18n, useToast } from './lib/contexts';
import { 
  ShoppingCartIcon, 
  UserIcon,
  PackageIcon, 
  TrendingUpIcon, 
  DollarSignIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  XIcon,
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  TruckIcon,
  FileTextIcon,
  SparklesIcon
} from './lib/contexts/Icons';

interface VipDashboardPageProps {
  user: any;
  onLogout: () => void;
}

export function VipDashboardPage({ user, onLogout }: VipDashboardPageProps) {
  const { language, formatCurrency } = useI18n();
  const { orders, showroomItems, products } = useFirebase();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Filter orders for this specific VIP user ---
  const userOrders = useMemo(() => {
    return orders?.filter(o => o.customerId === user.id) || [];
  }, [orders, user.id]);

  const stats = useMemo(() => {
    const totalSpent = userOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingCount = userOrders.filter(o => o.status === 'pending').length;
    return { totalSpent, pendingCount };
  }, [userOrders]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-tajawal">
      {/* Sidebar */}
      <aside className="w-80 bg-white p-10 flex flex-col border-l-2 border-slate-100 shadow-2xl relative z-10">
        <div className="mb-16 space-y-4">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl">
            <span className="text-3xl font-black">VIP</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-primary">{user.name}</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{user.company}</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-4">
          {[
            { id: 'orders', label: 'طلباتي', icon: ShoppingCartIcon },
            { id: 'tracking', label: 'تتبع الشحنات', icon: TruckIcon },
            { id: 'invoices', label: 'الفواتير', icon: FileTextIcon },
            { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-sm transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl translate-x-2' : 'hover:bg-slate-50 text-gray-400'}`}
            >
              <tab.icon className="w-6 h-6" />
              {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto bg-red-50 text-red-600 p-5 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all"
        >
          تسجيل الخروج 🚪
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-primary">
            {activeTab === 'orders' ? 'إدارة الطلبات' : 
             activeTab === 'tracking' ? 'تتبع الشحنات اللحظي' : 
             activeTab === 'invoices' ? 'السجل المالي والفواتير' : 'إعدادات الحساب'}
          </h1>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">رصيد الكاش باك</span>
              <span className="text-xl font-black text-emerald-500">{formatCurrency(user.cashbackBalance || 0)}</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <SparklesIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">رصيد المشتريات</span>
              <span className="text-xl font-black text-secondary">{formatCurrency(stats.totalSpent)}</span>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <DollarSignIcon className="w-6 h-6" />
            </div>
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-blue-500 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">طلبات قيد التجهيز</p>
                  <h4 className="text-4xl font-black text-blue-600">{stats.pendingCount} طلب</h4>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
                  <PackageIcon className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-emerald-500 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">إجمالي الطلبات</p>
                  <h4 className="text-4xl font-black text-emerald-600">{userOrders.length} طلب</h4>
                </div>
                <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-primary">توصيات ذكية لك (AI) 🧠</h3>
                <span className="text-[10px] font-black bg-secondary/10 text-secondary px-4 py-2 rounded-full uppercase tracking-widest animate-pulse">توقعات عدي AI</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(products || []).slice(0, 3).map(p => (
                  <div key={p.id} className="bg-slate-50 p-6 rounded-[2.5rem] border border-gray-100 group hover:border-primary transition-all">
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-4 shadow-sm">
                      <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name_ar} />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl font-black text-[10px] text-primary shadow-lg">
                        {p.category_ar}
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 text-lg mb-1">{p.name_ar}</h4>
                    <p className="text-xs font-bold text-gray-400 mb-4 line-clamp-1">{p.description_ar}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-secondary">{formatCurrency(p.price)}</span>
                      <button className="bg-primary text-white p-3 rounded-xl hover:bg-secondary transition-all shadow-lg active:scale-90">
                        <ShoppingCartIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-primary">سجل الطلبات 📦</h3>
                <button 
                  onClick={() => window.location.href = '#showroom'}
                  className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-black transition-all"
                >
                  طلب جديد +
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-gray-400 border-b-2 font-bold text-sm">
                      <th className="py-6">رقم الطلب</th>
                      <th>التاريخ</th>
                      <th>المبلغ</th>
                      <th>الحالة</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(userOrders || []).map(order => (
                      <tr key={order.id} className="border-b hover:bg-slate-50 transition-all group">
                        <td className="py-6 font-black text-primary">#{order.id.slice(0, 8)}</td>
                        <td className="text-gray-400 font-bold text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="font-black text-secondary">{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'delivered' ? 'مكتمل' : order.status === 'pending' ? 'قيد التجهيز' : 'ملغي'}
                          </span>
                        </td>
                        <td>
                          <button className="text-primary font-black text-xs hover:underline">عرض التفاصيل</button>
                        </td>
                      </tr>
                    ))}
                    {userOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-gray-400 font-bold">لا توجد طلبات سابقة حتى الآن.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-10 animate-fade-in">
            {userOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(order => (
              <div key={order.id} className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-primary">تتبع الطلب #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-400 font-bold">تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
                    <span className="text-primary font-black text-sm uppercase tracking-widest">Live Tracking</span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="relative flex justify-between items-center mb-16">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
                    style={{ width: order.status === 'pending' ? '0%' : order.status === 'preparing' ? '25%' : order.status === 'setup' ? '50%' : order.status === 'shipped' ? '75%' : '100%' }}
                  ></div>
                  
                  {[
                    { id: 'pending', label: 'تم الاستلام', icon: '📥' },
                    { id: 'preparing', label: 'قيد التجهيز', icon: '📦' },
                    { id: 'setup', label: 'جاهز للشحن', icon: '✅' },
                    { id: 'shipped', label: 'في الطريق', icon: '🚚' },
                    { id: 'delivered', label: 'تم التسليم', icon: '🏠' }
                  ].map((step, idx) => {
                    const isCompleted = ['pending', 'preparing', 'setup', 'shipped', 'delivered'].indexOf(order.status) >= idx;
                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${isCompleted ? 'bg-primary text-white shadow-xl scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                          {step.icon}
                        </div>
                        <span className={`text-xs font-black ${isCompleted ? 'text-primary' : 'text-gray-300'}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
                    <TruckIcon className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">موقع الشحنة الحالي</p>
                    <p className="text-primary font-black text-lg">الشاحنة المبردة رقم #445 - في طريقها إليكم</p>
                  </div>
                  <button className="bg-white text-primary px-8 py-3 rounded-2xl font-black text-xs shadow-sm border border-gray-100 hover:bg-primary hover:text-white transition-all">
                    عرض على الخريطة 📍
                  </button>
                </div>
              </div>
            ))}

            {userOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length === 0 && (
              <div className="h-[60vh] flex items-center justify-center bg-white rounded-[4rem] shadow-xl border border-gray-100">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <MapPinIcon className="w-16 h-16" />
                  </div>
                  <h3 className="text-3xl font-black text-primary">لا توجد شحنات نشطة حالياً</h3>
                  <p className="text-gray-400 font-bold max-w-md mx-auto">بمجرد قيامك بطلب جديد، ستتمكن من تتبعه هنا لحظة بلحظة.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
