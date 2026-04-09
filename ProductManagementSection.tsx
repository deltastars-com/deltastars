
import React, { useState } from 'react';
import { Product, CategoryConfig, ProductUnit } from '../types';
import { useI18n, useToast, useFirebase } from './lib/contexts';
import { PlusIcon, TrashIcon, PencilIcon, SearchIcon, FilterIcon } from './lib/contexts/Icons';

export const ProductManagementSection: React.FC = () => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const { products, categories, units, addProduct, updateProduct, deleteProduct } = useFirebase();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name_ar: '', name_en: '', category: 'vegetables', price: 0, image: '', unit_ar: 'ريال للكيلو', unit_en: 'kg', stock_quantity: 1000, min_threshold: 50
    });

    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.name_ar + p.name_en).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, editingProduct);
                setEditingProduct(null);
                addToast(language === 'ar' ? 'تم تحديث المنتج' : 'Product updated', 'success');
            } else {
                await addProduct(newProduct as Omit<Product, 'id'>);
                setIsAdding(false);
                setNewProduct({ name_ar: '', name_en: '', category: 'vegetables', price: 0, image: '', unit_ar: 'ريال للكيلو', unit_en: 'kg', stock_quantity: 1000, min_threshold: 50 });
                addToast(language === 'ar' ? 'تم إضافة المنتج' : 'Product added', 'success');
            }
        } catch (err) {
            addToast(language === 'ar' ? 'فشل في الحفظ' : 'Failed to save', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                    <PlusIcon className="w-10 h-10 text-primary" />
                    {language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
                </h2>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                >
                    <PlusIcon className="w-6 h-6" />
                    {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input 
                        type="text"
                        placeholder={language === 'ar' ? 'بحث عن منتج...' : 'Search products...'}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-6 pr-16 bg-white border-2 border-gray-100 rounded-3xl font-bold outline-none focus:border-primary transition-all"
                    />
                </div>
                <div className="relative">
                    <FilterIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <select 
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full p-6 pr-16 bg-white border-2 border-gray-100 rounded-3xl font-bold outline-none focus:border-primary appearance-none transition-all"
                    >
                        <option value="all">{language === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
                        {categories.map(c => (
                            <option key={c.key} value={c.key}>{language === 'ar' ? c.label_ar : c.label_en}</option>
                        ))}
                    </select>
                </div>
            </div>

            {(isAdding || editingProduct) && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-sovereign overflow-hidden animate-scale-in">
                        <div className="p-12 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-3xl font-black text-primary uppercase">
                                {editingProduct ? (language === 'ar' ? 'تعديل منتج' : 'Edit Product') : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
                            </h3>
                            <button onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="p-4 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-all">
                                <PlusIcon className="w-8 h-8 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-12 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الاسم (عربي)</label>
                                    <input 
                                        type="text" required
                                        value={editingProduct ? editingProduct.name_ar : newProduct.name_ar}
                                        onChange={e => editingProduct ? setEditingProduct({...editingProduct, name_ar: e.target.value}) : setNewProduct({...newProduct, name_ar: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Name (English)</label>
                                    <input 
                                        type="text" required
                                        value={editingProduct ? editingProduct.name_en : newProduct.name_en}
                                        onChange={e => editingProduct ? setEditingProduct({...editingProduct, name_en: e.target.value}) : setNewProduct({...newProduct, name_en: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">التصنيف</label>
                                    <select 
                                        value={editingProduct ? editingProduct.category : newProduct.category}
                                        onChange={e => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value as any}) : setNewProduct({...newProduct, category: e.target.value as any})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    >
                                        {categories.map(c => (
                                            <option key={c.key} value={c.key}>{language === 'ar' ? c.label_ar : c.label_en}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">السعر (ريال)</label>
                                    <input 
                                        type="number" required step="0.01"
                                        value={editingProduct ? editingProduct.price : newProduct.price}
                                        onChange={e => editingProduct ? setEditingProduct({...editingProduct, price: Number(e.target.value)}) : setNewProduct({...newProduct, price: Number(e.target.value)})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">رابط الصورة</label>
                                    <input 
                                        type="text" required
                                        value={editingProduct ? editingProduct.image : newProduct.image}
                                        onChange={e => editingProduct ? setEditingProduct({...editingProduct, image: e.target.value}) : setNewProduct({...newProduct, image: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الكمية المتوفرة</label>
                                    <input 
                                        type="number" required
                                        value={editingProduct ? editingProduct.stock_quantity : newProduct.stock_quantity}
                                        onChange={e => editingProduct ? setEditingProduct({...editingProduct, stock_quantity: Number(e.target.value)}) : setNewProduct({...newProduct, stock_quantity: Number(e.target.value)})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-8 border-t border-gray-100 flex gap-4">
                                <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                    {language === 'ar' ? 'حفظ البيانات' : 'Save Product'}
                                </button>
                                <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="px-12 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-2xl hover:bg-gray-200 transition-all">
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[3rem] border-2 border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b-2 border-gray-100">
                        <tr>
                            <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-widest">المنتج</th>
                            <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-widest">التصنيف</th>
                            <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-widest">السعر</th>
                            <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-widest">المخزون</th>
                            <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-widest">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img src={p.image} alt={p.name_ar} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                                        <div>
                                            <div className="font-black text-slate-800 text-lg">{p.name_ar}</div>
                                            <div className="text-xs text-gray-400 font-bold uppercase">{p.name_en}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {categories.find(c => c.key === p.category)?.label_ar || p.category}
                                    </span>
                                </td>
                                <td className="p-6 font-black text-secondary text-xl">{p.price} ر.س</td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${p.stock_quantity > p.min_threshold ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                                        <span className="font-black text-slate-600">{p.stock_quantity} {p.unit_ar}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex gap-3">
                                        <button onClick={() => setEditingProduct(p)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                            <PencilIcon className="w-6 h-6" />
                                        </button>
                                        <button onClick={() => { if(confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) deleteProduct(p.id); }} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                            <TrashIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
