
import React, { useState, useEffect } from 'react';
import { Product, Promotion, ShowroomItem, HomeSection, HomeSectionType } from '../types';
import { useI18n } from './lib/contexts/I18nContext';
import { useToast } from './ToastContext';
import { 
    PlusIcon, TrashIcon, PencilIcon, SparklesIcon, 
    ChartBarIcon, FingerprintIcon, LogoutIcon, DocumentTextIcon 
} from './lib/contexts/Icons';
import api from './lib/api';

interface DeveloperDashboardProps {
    products: Product[];
    promotions: Promotion[];
    showroomItems: ShowroomItem[];
    homeSections: HomeSection[];
    onUpdateProducts: (p: Product[]) => void;
    onUpdatePromos: (pr: Promotion[]) => void;
    onUpdateShowroom: (s: ShowroomItem[]) => void;
    onUpdateSections: (s: HomeSection[]) => void;
    onBack: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ 
    products, promotions, showroomItems, homeSections,
    onUpdateProducts, onUpdatePromos, onUpdateShowroom, onUpdateSections, onBack 
}) => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const [tab, setTab] = useState<'products' | 'server' | 'database' | 'security' | 'sections'>('products');
    const [logs, setLogs] = useState<any[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name_ar: '', name_en: '', category: 'vegetables', price: 0, image: '', unit_ar: 'ريال للكيلو', unit_en: 'kg', stock_quantity: 1000, min_threshold: 50
    });

    const handleSaveProduct = () => {
        if (editingProduct) {
            onUpdateProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
            setEditingProduct(null);
            addToast('تم تحديث المنتج بنجاح', 'success');
        } else {
            const id = Math.max(0, ...products.map(p => p.id)) + 1;
            onUpdateProducts([{ ...newProduct, id } as Product, ...products]);
            setNewProduct({ name_ar: '', name_en: '', category: 'vegetables', price: 0, image: '', unit_ar: 'ريال للكيلو', unit_en: 'kg', stock_quantity: 1000, min_threshold: 50 });
            addToast('تم إضافة المنتج بنجاح', 'success');
        }
    };

    const handleDeleteProduct = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            onUpdateProducts(products.filter(p => p.id !== id));
            addToast('تم حذف المنتج', 'info');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(api.getSystemLogs());
        }, 1500);
        return () => clearInterval(interval);
    }, []);

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
                <button onClick={onBack} className="relative z-10 bg-white/10 hover:bg-red-600 px-10 py-4 rounded-2xl font-black text-xl transition-all">إغلاق المحطة</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <aside className="lg:col-span-3 space-y-4">
                    {[
                        { id: 'server', label: 'رادار العمليات', icon: '📡' },
                        { id: 'database', label: 'قاعدة البيانات SQL', icon: '🗄️' },
                        { id: 'security', label: 'الدرع الحيوي', icon: '🛡️' },
                        { id: 'products', label: 'إدارة المنتجات', icon: '🛒' },
                        { id: 'sections', label: 'إدارة الأقسام', icon: '🏗️' }
                    ].map(t => (
                        <button 
                            key={t.id} onClick={() => setTab(t.id as any)}
                            className={`w-full p-8 rounded-[2.5rem] font-black text-2xl flex items-center gap-5 transition-all ${tab === t.id ? 'bg-primary text-white scale-105 shadow-xl' : 'bg-white text-slate-400 border border-gray-100'}`}
                        >
                            <span className="text-4xl">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </aside>

                <main className="lg:col-span-9 bg-white rounded-[4rem] shadow-2xl p-12 border border-gray-100 min-h-[700px]">
                    {tab === 'products' && (
                        <div className="space-y-12 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-black text-slate-800 uppercase">Product Inventory Engine</h2>
                                <button 
                                    onClick={() => setEditingProduct(null)}
                                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-secondary transition-all"
                                >
                                    <PlusIcon className="w-6 h-6" /> إضافة منتج جديد
                                </button>
                            </div>

                            <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-gray-100">
                                <h3 className="text-2xl font-black mb-8 text-primary">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">الاسم بالعربي</label>
                                        <input 
                                            type="text" 
                                            value={editingProduct ? editingProduct.name_ar : newProduct.name_ar}
                                            onChange={e => editingProduct ? setEditingProduct({...editingProduct, name_ar: e.target.value}) : setNewProduct({...newProduct, name_ar: e.target.value})}
                                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Name in English</label>
                                        <input 
                                            type="text" 
                                            value={editingProduct ? editingProduct.name_en : newProduct.name_en}
                                            onChange={e => editingProduct ? setEditingProduct({...editingProduct, name_en: e.target.value}) : setNewProduct({...newProduct, name_en: e.target.value})}
                                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">السعر</label>
                                        <input 
                                            type="number" 
                                            value={editingProduct ? editingProduct.price : newProduct.price}
                                            onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)}) : setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">رابط الصورة (Drive ID)</label>
                                        <input 
                                            type="text" 
                                            value={editingProduct ? editingProduct.image : newProduct.image}
                                            onChange={e => editingProduct ? setEditingProduct({...editingProduct, image: e.target.value}) : setNewProduct({...newProduct, image: e.target.value})}
                                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSaveProduct}
                                    className="w-full mt-10 py-6 bg-secondary text-white rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    {editingProduct ? 'حفظ التغييرات' : 'إضافة للمخزون السيادي'}
                                </button>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Current Inventory ({products.length})</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {products.slice(0, 10).map(p => (
                                        <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                                            <div className="flex items-center gap-6">
                                                <img src={p.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                                                <div>
                                                    <h4 className="font-black text-xl text-primary">{p.name_ar}</h4>
                                                    <p className="text-xs font-bold text-gray-400">{p.name_en} • {p.price} SAR</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingProduct(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><PencilIcon className="w-5 h-5" /></button>
                                                <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {products.length > 10 && <p className="text-center text-gray-400 font-bold py-4 italic">... and {products.length - 10} more items</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'sections' && (
                        <div className="space-y-12 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-black text-slate-800 uppercase">Home Section Orchestrator</h2>
                                <button 
                                    onClick={() => {
                                        const id = `section-${Date.now()}`;
                                        onUpdateSections([...homeSections, { id, type: 'hero', title_ar: 'قسم جديد', title_en: 'New Section', isVisible: true, order: homeSections.length + 1 }]);
                                    }}
                                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-secondary transition-all"
                                >
                                    <PlusIcon className="w-6 h-6" /> إضافة قسم جديد
                                </button>
                            </div>

                            <div className="space-y-6">
                                {homeSections.sort((a, b) => a.order - b.order).map((section, index) => (
                                    <div key={section.id} className="bg-slate-50 p-8 rounded-[3rem] border-2 border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">نوع القسم</label>
                                                <select 
                                                    value={section.type}
                                                    onChange={e => onUpdateSections(homeSections.map(s => s.id === section.id ? { ...s, type: e.target.value as HomeSectionType } : s))}
                                                    className="w-full p-4 bg-white border-2 border-transparent focus:border-primary rounded-xl font-bold outline-none shadow-sm"
                                                >
                                                    <option value="hero">Hero Banner</option>
                                                    <option value="categories">Categories</option>
                                                    <option value="partners">Partners</option>
                                                    <option value="trust">Trust & Verification</option>
                                                    <option value="channels">Channels</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">العنوان (عربي)</label>
                                                <input 
                                                    type="text"
                                                    value={section.title_ar}
                                                    onChange={e => onUpdateSections(homeSections.map(s => s.id === section.id ? { ...s, title_ar: e.target.value } : s))}
                                                    className="w-full p-4 bg-white border-2 border-transparent focus:border-primary rounded-xl font-bold outline-none shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Title (EN)</label>
                                                <input 
                                                    type="text"
                                                    value={section.title_en}
                                                    onChange={e => onUpdateSections(homeSections.map(s => s.id === section.id ? { ...s, title_en: e.target.value } : s))}
                                                    className="w-full p-4 bg-white border-2 border-transparent focus:border-primary rounded-xl font-bold outline-none shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => onUpdateSections(homeSections.map(s => s.id === section.id ? { ...s, isVisible: !s.isVisible } : s))}
                                                className={`p-4 rounded-xl font-black transition-all ${section.isVisible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                            >
                                                {section.isVisible ? 'ظاهر' : 'مخفي'}
                                            </button>
                                            <div className="flex flex-col gap-2">
                                                <button 
                                                    disabled={index === 0}
                                                    onClick={() => {
                                                        const newSections = [...homeSections];
                                                        const prev = newSections.find(s => s.order === section.order - 1);
                                                        if (prev) {
                                                            prev.order += 1;
                                                            section.order -= 1;
                                                            onUpdateSections(newSections);
                                                        }
                                                    }}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-primary hover:text-white disabled:opacity-30"
                                                >
                                                    ▲
                                                </button>
                                                <button 
                                                    disabled={index === homeSections.length - 1}
                                                    onClick={() => {
                                                        const newSections = [...homeSections];
                                                        const next = newSections.find(s => s.order === section.order + 1);
                                                        if (next) {
                                                            next.order -= 1;
                                                            section.order += 1;
                                                            onUpdateSections(newSections);
                                                        }
                                                    }}
                                                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-primary hover:text-white disabled:opacity-30"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm('حذف هذا القسم؟')) {
                                                        onUpdateSections(homeSections.filter(s => s.id !== section.id));
                                                    }
                                                }}
                                                className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                            >
                                                <TrashIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'server' && (
                        <div className="flex flex-col h-full animate-fade-in">
                            <h2 className="text-3xl font-black text-slate-800 mb-8 uppercase">Live Rocket Node Radar</h2>
                            <div className="bg-slate-950 rounded-3xl p-8 font-mono text-sm overflow-y-auto flex-1 h-[500px] border-4 border-slate-900 shadow-inner">
                                {logs.length === 0 ? <p className="text-slate-600 italic">Listening for requests...</p> : logs.map(log => (
                                    <div key={log.id} className="mb-4 border-b border-slate-900 pb-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-green-400 font-black">[{log.level}] {log.action}</span>
                                            <span className="text-slate-500">{log.timestamp}</span>
                                        </div>
                                        <p className="text-blue-300">{log.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'database' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <h2 className="text-3xl font-black text-slate-800 uppercase">Sovereign SQL Schema Explorer</h2>
                            <div className="bg-slate-50 p-10 rounded-3xl border-2 border-gray-100 font-mono text-sm overflow-x-auto text-primary">
                                <pre className="leading-loose">
{`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE,
  phone_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE otp_requests (
  id UUID PRIMARY KEY,
  otp_hash TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE
);`}
                                </pre>
                            </div>
                            <div className="bg-secondary/10 p-6 rounded-2xl border-2 border-secondary/20 flex items-center gap-4">
                                <div className="w-4 h-4 bg-secondary rounded-full animate-ping"></div>
                                <p className="text-secondary font-black text-sm uppercase tracking-widest">Active Migration: v50.0_initial_sovereign</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
