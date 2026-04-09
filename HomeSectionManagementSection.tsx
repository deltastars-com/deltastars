
import React, { useState } from 'react';
import { HomeSection, HomeSectionType } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon, LayoutIcon, XIcon, SaveIcon } from './lib/contexts/Icons';
import { useI18n } from './lib/contexts/I18nContext';

interface HomeSectionManagementSectionProps {
    homeSections: HomeSection[];
    handleSaveSection: (section: HomeSection) => void;
    handleDeleteSection: (id: string) => void;
}

export const HomeSectionManagementSection: React.FC<HomeSectionManagementSectionProps> = ({ 
    homeSections, handleSaveSection, handleDeleteSection 
}) => {
    const { language } = useI18n();
    const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newSection, setNewSection] = useState<Partial<HomeSection>>({
        title_ar: '', title_en: '', type: 'featured', order: 10, isVisible: true, items: []
    });

    const handleSave = () => {
        if (editingSection) {
            handleSaveSection(editingSection);
            setEditingSection(null);
        } else if (isAdding) {
            handleSaveSection(newSection as HomeSection);
            setIsAdding(false);
            setNewSection({ title_ar: '', title_en: '', type: 'featured', order: 10, isVisible: true, items: [] });
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[3rem] border border-gray-100">
                <div>
                    <h2 className="text-4xl font-black text-primary tracking-tighter uppercase">Home Sections</h2>
                    <p className="text-gray-400 font-bold text-sm tracking-widest mt-1 uppercase">Manage Landing Page Layout</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-green-800 transition-all shadow-xl flex items-center gap-4 group"
                >
                    <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    {language === 'ar' ? 'إضافة قسم جديد' : 'Add New Section'}
                </button>
            </div>

            {/* Sections List */}
            <div className="grid grid-cols-1 gap-8">
                {homeSections.sort((a, b) => a.order - b.order).map(section => (
                    <div key={section.id} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-primary transition-all">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                                <LayoutIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">{language === 'ar' ? section.title_ar : section.title_en}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-400 font-black uppercase tracking-widest">{section.type}</span>
                                    <span className="text-[10px] bg-primary/10 px-3 py-1 rounded-full text-primary font-black uppercase tracking-widest">Order: {section.order}</span>
                                    {!section.isVisible && <span className="text-[10px] bg-red-100 px-3 py-1 rounded-full text-red-600 font-black uppercase tracking-widest">Hidden</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setEditingSection(section)}
                                className="p-4 bg-slate-50 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <PencilIcon className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-4 bg-slate-50 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                <TrashIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {(isAdding || editingSection) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-4xl overflow-hidden flex flex-col">
                        <div className="bg-primary text-white p-8 flex justify-between items-center border-b-8 border-secondary">
                            <h2 className="text-3xl font-black tracking-tighter uppercase">
                                {editingSection ? 'Edit Section' : 'New Section'}
                            </h2>
                            <button 
                                onClick={() => { setIsAdding(false); setEditingSection(null); }}
                                className="p-3 bg-white/10 rounded-2xl hover:bg-red-600 transition-all"
                            >
                                <XIcon className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">Title (AR)</label>
                                    <input 
                                        type="text" 
                                        value={editingSection ? editingSection.title_ar : newSection.title_ar}
                                        onChange={e => editingSection ? setEditingSection({...editingSection, title_ar: e.target.value}) : setNewSection({...newSection, title_ar: e.target.value})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">Title (EN)</label>
                                    <input 
                                        type="text" 
                                        value={editingSection ? editingSection.title_en : newSection.title_en}
                                        onChange={e => editingSection ? setEditingSection({...editingSection, title_en: e.target.value}) : setNewSection({...newSection, title_en: e.target.value})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">Type</label>
                                    <select 
                                        value={editingSection ? editingSection.type : newSection.type}
                                        onChange={e => editingSection ? setEditingSection({...editingSection, type: e.target.value as HomeSectionType}) : setNewSection({...newSection, type: e.target.value as HomeSectionType})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold transition-all appearance-none"
                                    >
                                        <option value="featured">Featured Products</option>
                                        <option value="categories">Categories Grid</option>
                                        <option value="banner">Promotional Banner</option>
                                        <option value="ads">Ads Slider</option>
                                        <option value="stats">Stats Counter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">Display Order</label>
                                    <input 
                                        type="number" 
                                        value={editingSection ? editingSection.order : newSection.order}
                                        onChange={e => editingSection ? setEditingSection({...editingSection, order: parseInt(e.target.value)}) : setNewSection({...newSection, order: parseInt(e.target.value)})}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl">
                                <input 
                                    type="checkbox" 
                                    checked={editingSection ? editingSection.isVisible : newSection.isVisible}
                                    onChange={e => editingSection ? setEditingSection({...editingSection, isVisible: e.target.checked}) : setNewSection({...newSection, isVisible: e.target.checked})}
                                    className="w-6 h-6 rounded-lg text-primary focus:ring-primary"
                                />
                                <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Visible on Landing Page</span>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-gray-100 flex justify-end gap-4">
                            <button 
                                onClick={() => { setIsAdding(false); setEditingSection(null); }}
                                className="px-10 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-lg flex items-center gap-4"
                            >
                                <SaveIcon className="w-6 h-6" />
                                Save Section
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
