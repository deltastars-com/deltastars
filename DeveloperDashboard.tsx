
import React, { useState, useEffect } from 'react';
import { Product, Promotion, ShowroomItem, HomeSection, HomeSectionType, CategoryConfig, CategoryKey, ProductUnit, Branch, Order, Coupon, Ad, User } from '../types';
import { useI18n } from './lib/contexts/I18nContext';
import { useToast } from './ToastContext';
import { 
    PlusIcon, TrashIcon, PencilIcon, SparklesIcon, 
    ChartBarIcon, FingerprintIcon, LogoutIcon, DocumentTextIcon,
    SettingsIcon, MapIcon, ShoppingBagIcon, EyeIcon, XIcon,
    DatabaseIcon as Database, BellIcon, MegaphoneIcon, TicketIcon, ShieldCheckIcon,
    LayoutIcon, StarIcon, BotIcon, TrendingUpIcon
} from './lib/contexts/Icons';
import api from './lib/api';
import { db, setDoc, doc, deleteDoc, collection, updateDoc, handleFirestoreError, OperationType, query, onSnapshot, orderBy, addDoc, getDocs } from '@/firebase';
import { useFirebase } from './lib/contexts/FirebaseContext';
import { REAL_PRODUCTS } from '../src/data/products';
import { COMPANY_INFO } from './constants';
import { ProductManagementSection } from './ProductManagementSection';
import { UserManagementSection } from './UserManagementSection';
import { AdManagementSection } from './AdManagementSection';
import { CouponManagementSection } from './CouponManagementSection';
import { BranchManagementSection } from './BranchManagementSection';
import { PriceUpdateRequestSection } from './PriceUpdateRequestSection';
import { LegalManagementSection } from './LegalManagementSection';
import { NotificationManagementSection } from './NotificationManagementSection';
import { ShowroomManagementSection } from './ShowroomManagementSection';
import { CategoryManagementSection } from './CategoryManagementSection';
import { UnitManagementSection } from './UnitManagementSection';
import { OrderManagementSection } from './OrderManagementSection';
import { ServerManagementSection } from './ServerManagementSection';
import { DatabaseManagementSection } from './DatabaseManagementSection';
import { SecurityManagementSection } from './SecurityManagementSection';
import { AIInsightsSection } from './AIInsightsSection';
import { AccountingSection } from './AccountingSection';
import { SupportManagementSection } from './SupportManagementSection';
import { HomeSectionManagementSection } from './HomeSectionManagementSection';
import { OrderDetailsModal } from './OrderDetailsModal';
import { BranchOrdersView } from './BranchOrdersView';

interface DeveloperDashboardProps {
    onBack: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ onBack }) => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const { 
        user, products, categories, units, homeSections, orders, branches, 
        coupons, ads, legalPages, notifications, unreadCount,
        updateUserPermissions, updateOrder, updateHomeSection, markNotificationAsRead 
    } = useFirebase();
    const [tab, setTab] = useState<'products' | 'server' | 'database' | 'security' | 'sections' | 'categories' | 'units' | 'branches' | 'orders' | 'ai_insights' | 'accounting' | 'users' | 'notifications' | 'ads' | 'coupons' | 'legal' | 'showroom_mgmt' | 'support' | 'price_requests' | 'branch_console'>('products');
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    
    const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
    const [newCategory, setNewCategory] = useState<Partial<CategoryConfig>>({
        key: 'custom', label_ar: '', label_en: '', icon: '📦', order: 10, isVisible: true
    });

    const [editingUnit, setEditingUnit] = useState<ProductUnit | null>(null);
    const [newUnit, setNewUnit] = useState<Partial<ProductUnit>>({
        code: '', name_ar: '', name_en: '', base_factor: 1
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, 'users'));
            setAllUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));
        };
        fetchUsers();
    }, []);

    // Auto-save drafts to prevent data loss
    useEffect(() => {
        const draft = localStorage.getItem('dev_dashboard_drafts');
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                if (parsed.newCategory) setNewCategory(parsed.newCategory);
                if (parsed.editingCategory) setEditingCategory(parsed.editingCategory);
                if (parsed.newUnit) setNewUnit(parsed.newUnit);
                if (parsed.editingUnit) setEditingUnit(parsed.editingUnit);
            } catch (e) {
                console.error('Failed to load drafts', e);
            }
        }
    }, []);

    useEffect(() => {
        const drafts = {
            newCategory,
            editingCategory,
            newUnit,
            editingUnit
        };
        localStorage.setItem('dev_dashboard_drafts', JSON.stringify(drafts));
    }, [newCategory, editingCategory, newUnit, editingUnit]);

    const handleSaveSection = async (section: HomeSection) => {
        try {
            await updateHomeSection(section.id, section);
            addToast('تم تحديث القسم', 'success');
        } catch (err) { addToast('فشل في تحديث القسم', 'error'); }
    };

    const togglePermission = async (userId: string, permission: string) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return;
        const currentPermissions = user.permissions || [];
        const newPermissions = currentPermissions.includes(permission)
            ? currentPermissions.filter(p => p !== permission)
            : [...currentPermissions, permission];
        
        await updateUserPermissions(userId, newPermissions);
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions: newPermissions } : u));
        addToast('تم تحديث الصلاحيات بنجاح', 'success');
    };

    const handleSyncProducts = async () => {
        if (!window.confirm('هل أنت متأكد من مزامنة كافة المنتجات من البيانات الثابتة؟ سيؤدي هذا إلى تحديث أو إضافة 250 منتجاً.')) return;
        
        setIsSyncing(true);
        try {
            let count = 0;
            for (const product of REAL_PRODUCTS) {
                await setDoc(doc(db, 'products', product.id.toString()), {
                    ...product,
                    stock_quantity: product.stock_available || 1000,
                    min_threshold: 50,
                    updatedAt: new Date().toISOString()
                });
                count++;
            }
            addToast(`تمت مزامنة ${count} منتجاً بنجاح`, 'success');
        } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, 'products_sync');
            addToast('فشل في مزامنة المنتجات', 'error');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSaveCategory = async () => {
        try {
            if (editingCategory) {
                await setDoc(doc(db, 'categories', editingCategory.key), editingCategory);
                setEditingCategory(null);
                addToast('تم تحديث الصنف', 'success');
            } else {
                await setDoc(doc(db, 'categories', newCategory.key!), newCategory as CategoryConfig);
                setNewCategory({ key: 'custom', label_ar: '', label_en: '', icon: '📦', order: 10, isVisible: true });
                addToast('تم إضافة الصنف', 'success');
            }
        } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, 'categories');
            addToast('فشل في حفظ الصنف', 'error');
        }
    };

    const handleSaveUnit = async () => {
        try {
            if (editingUnit) {
                await setDoc(doc(db, 'units', editingUnit.code), editingUnit);
                setEditingUnit(null);
                addToast('تم تحديث الوحدة', 'success');
            } else {
                await setDoc(doc(db, 'units', newUnit.code!), newUnit as ProductUnit);
                setNewUnit({ code: '', name_ar: '', name_en: '', base_factor: 1 });
                addToast('تم إضافة الوحدة', 'success');
            }
        } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, 'units');
            addToast('فشل في حفظ الوحدة', 'error');
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (window.confirm('حذف هذا القسم؟')) {
            try {
                await deleteDoc(doc(db, 'homeSections', id));
                addToast('تم حذف القسم', 'info');
            } catch (err) {
                handleFirestoreError(err, OperationType.DELETE, 'homeSections');
                addToast('فشل في حذف القسم', 'error');
            }
        }
    };

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

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

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(api.getSystemLogs());
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const canAccessTab = (tabId: string) => {
        if (!user) return false;
        if (user.type === 'developer' || user.type === 'admin' || user.type === 'gm') return true;
        
        const permissions = user.permissions || [];
        
        switch (tabId) {
            case 'server':
            case 'database':
            case 'security':
                return false; // Already handled by the admin/developer check above
            case 'products':
            case 'categories':
            case 'units':
            case 'sections':
            case 'showroom_mgmt':
                return permissions.includes('manage_products') || user.type === 'ops' || user.type === 'marketing';
            case 'branches':
                return permissions.includes('manage_branches') || user.type === 'ops';
            case 'orders':
                return permissions.includes('manage_orders') || user.type === 'ops' || user.type === 'accountant' || user.type === 'sales';
            case 'users':
                return permissions.includes('manage_users');
            case 'ads':
            case 'coupons':
            case 'notifications':
                return permissions.includes('manage_marketing') || user.type === 'marketing';
            case 'accounting':
                return permissions.includes('manage_accounting') || user.type === 'accountant';
            case 'price_requests':
                return permissions.includes('manage_prices') || user.type === 'marketing' || user.type === 'ops';
            case 'legal':
                return false; // Already handled by the admin/developer check above
            case 'support':
            case 'ai_insights':
                return ['admin', 'developer', 'gm', 'ops', 'marketing', 'accountant'].includes(user.type);
            default:
                return false;
        }
    };

    const navItems = [
        { id: 'server', label: 'رادار العمليات', icon: '📡' },
        { id: 'database', label: 'قاعدة البيانات SQL', icon: '🗄️' },
        { id: 'security', label: 'الدرع الحيوي', icon: '🛡️' },
        { id: 'ai_insights', label: language === 'ar' ? 'توقعات عدي AI' : 'Oday AI Insights', icon: '🧠' },
        { id: 'accounting', label: language === 'ar' ? 'النظام المحاسبي' : 'Accounting System', icon: '📊' },
        { id: 'categories', label: 'إدارة الأصناف', icon: '🏷️' },
        { id: 'units', label: 'إدارة الوحدات', icon: '⚖️' },
        { id: 'products', label: 'إدارة المنتجات', icon: '🛒' },
        { id: 'sections', label: 'إدارة الأقسام', icon: '🏗️' },
        { id: 'branches', label: 'إدارة الفروع', icon: '📍' },
        { id: 'orders', label: 'إدارة الطلبات', icon: '📦' },
        { id: 'users', label: 'إدارة المستخدمين', icon: '👥' },
        { id: 'ads', label: 'إدارة الإعلانات', icon: '📢' },
        { id: 'coupons', label: 'الكوبونات والعروض', icon: '🎫' },
        { id: 'price_requests', label: 'طلبات الأسعار', icon: '📈' },
        { id: 'branch_console', label: 'كونسول الفروع', icon: '🏪' },
        { id: 'showroom_mgmt', label: 'إدارة صالة العرض', icon: '🖼️' },
        { id: 'legal', label: 'الصفحات القانونية', icon: '⚖️' },
        { id: 'support', label: 'الدعم الفني المباشر', icon: '👨‍💻' },
        { id: 'notifications', label: 'الإشعارات', icon: '🔔' }
    ].filter(item => canAccessTab(item.id));

    return (
        <div className="container mx-auto px-6 py-12 text-black animate-fade-in">
            <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-4xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8 border-b-[20px] border-secondary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 bg-secondary/20 rounded-[2rem] flex items-center justify-center border border-white/20">
                        <SparklesIcon className="w-10 h-10 text-secondary" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase">Delta Sovereign Hub</h1>
                        <p className="text-secondary font-bold text-[10px] tracking-[0.4em]">SYSTEM CORE v50.0 [RUST_ROCKET_NODE]</p>
                    </div>
                </div>
                <div className="relative z-10 flex items-center gap-8">
                    <div className="relative group">
                        <button className="p-5 bg-white/10 rounded-3xl hover:bg-secondary hover:text-white transition-all relative">
                            <BellIcon className="w-8 h-8" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        
                        {/* Notification Dropdown */}
                        <div className="absolute top-full left-0 mt-4 w-96 bg-white rounded-[3rem] shadow-4xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-8 text-slate-800">
                            <h4 className="font-black text-primary mb-6 flex items-center justify-between text-xl">
                                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                                <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase tracking-widest">Live Radar</span>
                            </h4>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <p className="text-center text-gray-400 py-12 italic text-lg">{language === 'ar' ? 'لا توجد إشعارات حالياً' : 'No notifications'}</p>
                                ) : (notifications || []).map(n => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => markNotificationAsRead(n.id)}
                                        className="p-6 bg-slate-50 rounded-3xl border border-gray-100 hover:border-primary transition-all cursor-pointer group/item"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-black text-lg text-slate-800 group-hover/item:text-primary transition-colors">{language === 'ar' ? n.title_ar : n.title_en}</p>
                                            <span className={`w-3 h-3 rounded-full ${n.isRead ? 'bg-gray-300' : 'bg-red-500 animate-pulse'}`}></span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{language === 'ar' ? n.message_ar : n.message_en}</p>
                                        <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">{new Date(n.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={onBack} className="relative z-10 bg-white/10 hover:bg-red-600 px-10 py-4 rounded-2xl font-black text-xl transition-all">إغلاق المحطة</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <aside className="lg:col-span-3 space-y-4">
                    {navItems.map(t => (
                        <button 
                            key={t.id} onClick={() => setTab(t.id as any)}
                            className={`w-full p-8 rounded-[2.5rem] font-black text-2xl flex items-center gap-5 transition-all ${tab === (t.id as any) ? 'bg-primary text-white scale-105 shadow-xl' : 'bg-white text-slate-400 border border-gray-100'}`}
                        >
                            <span className="text-4xl">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </aside>

                <main className="lg:col-span-9 bg-white rounded-[4rem] shadow-2xl p-12 border border-gray-100 min-h-[700px]">
                    {tab === 'products' && (
                        <ProductManagementSection />
                    )}
                    {tab === 'sections' && (
                        <HomeSectionManagementSection 
                            homeSections={homeSections} 
                            handleSaveSection={handleSaveSection} 
                            handleDeleteSection={handleDeleteSection} 
                        />
                    )}

                    {tab === 'categories' && (
                        <CategoryManagementSection categories={categories} />
                    )}

                    {tab === 'units' && (
                        <UnitManagementSection units={units} />
                    )}

                    {tab === 'branches' && (
                        <BranchManagementSection />
                    )}

                    {tab === 'orders' && (
                        <OrderManagementSection 
                            orders={orders} 
                            branches={branches} 
                            onViewOrder={handleViewOrder} 
                        />
                    )}

                    {tab === 'users' && (
                        <UserManagementSection />
                    )}

                    {tab === 'ads' && (
                        <AdManagementSection />
                    )}

                    {tab === 'coupons' && (
                        <CouponManagementSection />
                    )}

                    {tab === 'legal' && (
                        <LegalManagementSection />
                    )}

                    {tab === 'notifications' && (
                        <NotificationManagementSection />
                    )}

                    {tab === 'showroom_mgmt' && (
                        <ShowroomManagementSection />
                    )}

                    {tab === 'support' && (
                        <SupportManagementSection language={language} />
                    )}

                    {tab === 'price_requests' && (
                        <PriceUpdateRequestSection />
                    )}

                    {tab === 'branch_console' && (
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-primary">كونسول استقبال الطلبات</h3>
                                    <p className="text-gray-400 font-bold">اختر الفرع لعرض شاشة الاستقبال الخاصة به</p>
                                </div>
                                <select 
                                    value={selectedBranchId}
                                    onChange={(e) => setSelectedBranchId(e.target.value)}
                                    className="bg-white p-4 rounded-2xl border border-gray-200 font-black outline-none min-w-[200px]"
                                >
                                    <option value="">اختر الفرع...</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name_ar}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {selectedBranchId ? (
                                <BranchOrdersView branchId={selectedBranchId} onBack={() => setSelectedBranchId('')} />
                            ) : (
                                <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-[4rem]">
                                    <p className="text-gray-300 font-black text-xl uppercase tracking-widest">الرجاء اختيار فرع للمتابعة</p>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'server' && (
                        <ServerManagementSection logs={logs} />
                    )}

                    {tab === 'database' && (
                        <DatabaseManagementSection 
                            isSyncing={isSyncing} 
                            handleSyncProducts={handleSyncProducts} 
                            language={language} 
                        />
                    )}

                    {tab === 'security' && (
                        <SecurityManagementSection 
                            language={language}
                            isBiometricEnabled={isBiometricEnabled}
                            setIsBiometricEnabled={setIsBiometricEnabled}
                            isFaceIdEnabled={isFaceIdEnabled}
                            setIsFaceIdEnabled={setIsFaceIdEnabled}
                        />
                    )}

                    {tab === 'ai_insights' && (
                        <AIInsightsSection 
                            language={language}
                            orders={orders}
                            products={products}
                            branches={branches}
                        />
                    )}

                    {tab === 'accounting' && (
                        <AccountingSection 
                            language={language}
                            orders={orders}
                            products={products}
                            handleUpdateOrder={updateOrder}
                            addToast={addToast}
                        />
                    )}
                </main>
            </div>

            {/* Order Details Modal */}
            {isOrderModalOpen && selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    branches={branches} 
                    onClose={() => setIsOrderModalOpen(false)} 
                />
            )}
        </div>
    );
};
