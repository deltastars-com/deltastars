
import React, { useState } from 'react';
import { Product } from '../types';
import { useI18n } from './lib/contexts/I18nContext';
import { useToast } from './ToastContext';
import { PlusIcon, PencilIcon, SparklesIcon, TrashIcon } from './lib/contexts/Icons';

interface MarketingViewProps {
    products: Product[];
    onUpdateProduct: (p: Product) => Promise<Product>;
    onAddProduct: (p: Product) => Promise<Product>;
    onBack: () => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ products, onUpdateProduct, onAddProduct, onBack }) => {
    const { language, formatCurrency } = useI18n();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = products.filter(p => (language === 'ar' ? p.name_ar : p.name_en).toLowerCase().includes(searchTerm.toLowerCase()));

    const handlePriceUpdate = async (product: Product) => {
        const promptMsg = language === 'ar' ? `أدخل السعر الجديد لـ ${product.name_ar}:` : `Enter new price for ${product.name_en}:`;
        const input = window.prompt(promptMsg, product.price.toString());
        
        if (input === null) return; // تم إلغاء العملية
        
        const newPrice = parseFloat(input);
        if (isNaN(newPrice) || newPrice < 0) {
            addToast(language === 'ar' ? 'خطأ: يرجى إدخال رقم صحيح' : 'Error: Please enter a valid number', 'error');
            return;
        }

        try {
            await onUpdateProduct({ ...product, price: newPrice });
            addToast(language === 'ar' ? 'تم تحديث السعر بنجاح' : 'Price updated successfully', 'success');
        } catch (e) {
            addToast('Error updating price', 'error');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-24 text-black">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[4rem] shadow-xl border border-gray-100 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-primary mb-2">إدارة الماركتنج والأسعار</h2>
                    <p className="text-gray-400 font-bold">التحكم في العروض الموسمية والأسعار المؤسسية</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 bg-primary text-white px-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all">
                        <PlusIcon className="w-6 h-6" /> إضافة صنف جديد
                    </button>
                    <button onClick={onBack} className="bg-gray-100 text-gray-500 px-10 py-5 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all">الرجوع</button>
                </div>
            </div>

            <div className="bg-white p-12 rounded-[5rem] shadow-sovereign border border-gray-100">
                <div className="flex gap-6 mb-16">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="ابحث عن منتج لتعديل سعره..." 
                            className="w-full p-8 bg-gray-50 border-none rounded-[2.5rem] font-black text-2xl outline-none focus:ring-8 focus:ring-primary/5 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl opacity-10">🔍</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.slice(0, 18).map(p => (
                        <div key={p.id} className="bg-gray-50 p-10 rounded-[3.5rem] border-2 border-transparent hover:border-primary/20 hover:bg-white hover:shadow-3xl transition-all group flex flex-col">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl group-hover:scale-110 transition-transform">
                                    <img src={p.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{language === 'ar' ? p.name_ar : p.name_en}</h3>
                                    <span className="bg-primary/5 text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                                </div>
                            </div>
                            
                            <div className="mt-auto space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-inner">
                                    <span className="text-gray-400 font-bold text-sm">السعر المعتمد:</span>
                                    <span className="text-3xl font-black text-primary">{formatCurrency(p.price)}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handlePriceUpdate(p)} 
                                        className="flex-1 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-primary transition-all shadow-xl active:scale-95"
                                    >
                                        تعديل السعر اللحظي
                                    </button>
                                    <button className="p-5 bg-white rounded-[1.5rem] text-gray-200 hover:text-red-500 border border-gray-100 hover:shadow-xl transition-all">
                                        <TrashIcon className="w-8 h-8"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
