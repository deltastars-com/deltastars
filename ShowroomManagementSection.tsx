
import React from 'react';
import { useI18n, useToast, useFirebase } from './lib/contexts';
import { LayoutIcon, StarIcon } from './lib/contexts/Icons';
import { COMPANY_INFO } from './constants';

export const ShowroomManagementSection: React.FC = () => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const { products, updateProduct } = useFirebase();

    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                <LayoutIcon className="w-10 h-10 text-primary" />
                {language === 'ar' ? 'إدارة صالة العروض' : 'Showroom Management'}
            </h2>

            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-8">
                <h3 className="text-2xl font-black text-primary border-b pb-4">{language === 'ar' ? 'إعدادات الواجهة الرئيسية' : 'Main Interface Settings'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{language === 'ar' ? 'رابط بنر الصالة الرئيسي' : 'Main Showroom Banner URL'}</label>
                        <input 
                            type="text" 
                            value={COMPANY_INFO.wide_banner_url}
                            className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                            readOnly
                        />
                        <p className="text-[10px] text-gray-400 px-4 italic">{language === 'ar' ? 'يتم تحديث البنر من ملف الثوابت السيادية (constants.ts)' : 'Banner is updated from sovereign constants (constants.ts)'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">{language === 'ar' ? 'عدد المنتجات المميزة' : 'Featured Products Count'}</label>
                        <input 
                            type="number" 
                            value={products.filter(p => p.is_featured).length}
                            className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-8">
                <h3 className="text-2xl font-black text-primary border-b pb-4">{language === 'ar' ? 'تخصيص المنتجات المميزة' : 'Customize Featured Products'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(products || []).map(product => (
                        <div key={product.id} className="bg-slate-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-primary transition-all">
                            <div className="flex items-center gap-4">
                                <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={product.name_ar} />
                                <div>
                                    <p className="font-black text-sm text-slate-800">{language === 'ar' ? product.name_ar : product.name_en}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{product.category}</p>
                                </div>
                            </div>
                            <button 
                                onClick={async () => {
                                    try {
                                        await updateProduct(product.id, { is_featured: !product.is_featured });
                                        addToast(language === 'ar' ? 'تم تحديث حالة التمييز' : 'Featured status updated', 'success');
                                    } catch (err) { addToast(language === 'ar' ? 'فشل التحديث' : 'Update failed', 'error'); }
                                }}
                                className={`p-3 rounded-xl transition-all ${product.is_featured ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-300 hover:text-primary'}`}
                            >
                                <StarIcon className="w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
