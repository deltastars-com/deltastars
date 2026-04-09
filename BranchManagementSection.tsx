
import React, { useState } from 'react';
import { Branch } from '../types';
import { useI18n, useToast, useFirebase } from './lib/contexts';
import { PlusIcon, TrashIcon, PencilIcon, MapIcon, XIcon } from './lib/contexts/Icons';

export const BranchManagementSection: React.FC = () => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const { branches, addBranch, updateBranch, deleteBranch } = useFirebase();
    
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newBranch, setNewBranch] = useState<Partial<Branch>>({
        name_ar: '', name_en: '', city: '', address_ar: '', address_en: '', phone: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBranch) {
                await updateBranch(editingBranch.id, editingBranch);
                setEditingBranch(null);
                addToast(language === 'ar' ? 'تم تحديث الفرع' : 'Branch updated', 'success');
            } else {
                await addBranch(newBranch as Omit<Branch, 'id'>);
                setIsAdding(false);
                setNewBranch({ name_ar: '', name_en: '', city: '', address_ar: '', address_en: '', phone: '' });
                addToast(language === 'ar' ? 'تم إضافة الفرع' : 'Branch added', 'success');
            }
        } catch (err) {
            addToast(language === 'ar' ? 'فشل في الحفظ' : 'Failed to save', 'error');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                    <MapIcon className="w-10 h-10 text-primary" />
                    {language === 'ar' ? 'إدارة الفروع والمواقع' : 'Branch Management'}
                </h2>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                >
                    <PlusIcon className="w-6 h-6" />
                    {language === 'ar' ? 'إضافة فرع جديد' : 'Add New Branch'}
                </button>
            </div>

            {(isAdding || editingBranch) && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-sovereign overflow-hidden animate-scale-in">
                        <div className="p-12 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-3xl font-black text-primary uppercase">
                                {editingBranch ? (language === 'ar' ? 'تعديل فرع' : 'Edit Branch') : (language === 'ar' ? 'إضافة فرع جديد' : 'Add New Branch')}
                            </h3>
                            <button onClick={() => { setIsAdding(false); setEditingBranch(null); }} className="p-4 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-all">
                                <XIcon className="w-8 h-8" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-12 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">اسم الفرع (عربي)</label>
                                    <input 
                                        type="text" required
                                        value={editingBranch ? editingBranch.name_ar : newBranch.name_ar}
                                        onChange={e => editingBranch ? setEditingBranch({...editingBranch, name_ar: e.target.value}) : setNewBranch({...newBranch, name_ar: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Branch Name (English)</label>
                                    <input 
                                        type="text" required
                                        value={editingBranch ? editingBranch.name_en : newBranch.name_en}
                                        onChange={e => editingBranch ? setEditingBranch({...editingBranch, name_en: e.target.value}) : setNewBranch({...newBranch, name_en: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">المدينة</label>
                                    <input 
                                        type="text" required
                                        value={editingBranch ? editingBranch.city : newBranch.city}
                                        onChange={e => editingBranch ? setEditingBranch({...editingBranch, city: e.target.value}) : setNewBranch({...newBranch, city: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">رقم الهاتف</label>
                                    <input 
                                        type="text" required
                                        value={editingBranch ? editingBranch.phone : newBranch.phone}
                                        onChange={e => editingBranch ? setEditingBranch({...editingBranch, phone: e.target.value}) : setNewBranch({...newBranch, phone: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">العنوان (عربي)</label>
                                    <textarea 
                                        required
                                        value={editingBranch ? editingBranch.address_ar : newBranch.address_ar}
                                        onChange={e => editingBranch ? setEditingBranch({...editingBranch, address_ar: e.target.value}) : setNewBranch({...newBranch, address_ar: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all h-32"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Address (English)</label>
                                    <textarea 
                                        required
                                        value={editingBranch ? editingBranch.address_en : newBranch.address_en}
                                        onChange={e => editingBranch ? setEditingBranch({...editingBranch, address_en: e.target.value}) : setNewBranch({...newBranch, address_en: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all h-32"
                                    />
                                </div>
                            </div>
                            <div className="pt-8 border-t border-gray-100 flex gap-4">
                                <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                    {language === 'ar' ? 'حفظ الفرع' : 'Save Branch'}
                                </button>
                                <button type="button" onClick={() => { setIsAdding(false); setEditingBranch(null); }} className="px-12 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black text-2xl hover:bg-gray-200 transition-all">
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map(branch => (
                    <div key={branch.id} className="bg-white rounded-[3rem] border-2 border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[8rem] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                                    <MapIcon className="w-8 h-8" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingBranch(branch)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => { if(confirm(language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) deleteBranch(branch.id); }} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-800">{language === 'ar' ? branch.name_ar : branch.name_en}</h4>
                                <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">{branch.city}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 font-bold leading-relaxed">{language === 'ar' ? branch.address_ar : branch.address_en}</p>
                                <p className="text-sm text-slate-800 font-black">{branch.phone}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
