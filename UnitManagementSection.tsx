
import React, { useState } from 'react';
import { ProductUnit } from '../types';
import { useI18n } from './lib/contexts/I18nContext';
import { useToast } from './ToastContext';
import { db, setDoc, doc, deleteDoc, handleFirestoreError, OperationType } from '@/firebase';
import { PlusIcon, TrashIcon, PencilIcon, XIcon } from './lib/contexts/Icons';

interface UnitManagementSectionProps {
    units: ProductUnit[];
}

export const UnitManagementSection: React.FC<UnitManagementSectionProps> = ({ units }) => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const [editingUnit, setEditingUnit] = useState<ProductUnit | null>(null);
    const [newUnit, setNewUnit] = useState<Partial<ProductUnit>>({
        code: '', name_ar: '', name_en: '', base_factor: 1
    });

    const handleSaveUnit = async () => {
        try {
            if (editingUnit) {
                await setDoc(doc(db, 'units', editingUnit.code), editingUnit);
                setEditingUnit(null);
                addToast('تم تحديث الوحدة بنجاح', 'success');
            } else {
                if (!newUnit.code) {
                    addToast('يرجى تحديد كود الوحدة', 'error');
                    return;
                }
                await setDoc(doc(db, 'units', newUnit.code), newUnit as ProductUnit);
                setNewUnit({ code: '', name_ar: '', name_en: '', base_factor: 1 });
                addToast('تم إضافة الوحدة بنجاح', 'success');
            }
        } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, 'units');
            addToast('فشل في حفظ الوحدة', 'error');
        }
    };

    const handleDeleteUnit = async (code: string) => {
        if (window.confirm('حذف هذه الوحدة؟')) {
            try {
                await deleteDoc(doc(db, 'units', code));
                addToast('تم حذف الوحدة', 'info');
            } catch (err) {
                handleFirestoreError(err, OperationType.DELETE, 'units');
                addToast('فشل في حذف الوحدة', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 text-primary" />
                    {editingUnit ? 'تعديل وحدة' : 'إضافة وحدة جديدة'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="الكود (e.g. kg)"
                        className="p-2 border rounded-lg"
                        value={editingUnit ? editingUnit.code : newUnit.code}
                        onChange={e => editingUnit ? setEditingUnit({ ...editingUnit, code: e.target.value }) : setNewUnit({ ...newUnit, code: e.target.value })}
                        disabled={!!editingUnit}
                    />
                    <input
                        type="text"
                        placeholder="الاسم بالعربية"
                        className="p-2 border rounded-lg"
                        value={editingUnit ? editingUnit.name_ar : newUnit.name_ar}
                        onChange={e => editingUnit ? setEditingUnit({ ...editingUnit, name_ar: e.target.value }) : setNewUnit({ ...newUnit, name_ar: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="الاسم بالإنجليزية"
                        className="p-2 border rounded-lg"
                        value={editingUnit ? editingUnit.name_en : newUnit.name_en}
                        onChange={e => editingUnit ? setEditingUnit({ ...editingUnit, name_en: e.target.value }) : setNewUnit({ ...newUnit, name_en: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="عامل الأساس"
                        className="p-2 border rounded-lg"
                        value={editingUnit ? editingUnit.base_factor : newUnit.base_factor}
                        onChange={e => editingUnit ? setEditingUnit({ ...editingUnit, base_factor: parseFloat(e.target.value) }) : setNewUnit({ ...newUnit, base_factor: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="mt-4 flex gap-2">
                    <button onClick={handleSaveUnit} className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                        {editingUnit ? 'تحديث' : 'إضافة'}
                    </button>
                    {editingUnit && (
                        <button onClick={() => setEditingUnit(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                            إلغاء
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold">الكود</th>
                            <th className="p-4 font-bold">الاسم (AR)</th>
                            <th className="p-4 font-bold">الاسم (EN)</th>
                            <th className="p-4 font-bold">عامل الأساس</th>
                            <th className="p-4 font-bold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units.map(unit => (
                            <tr key={unit.code} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-mono text-sm text-gray-500">{unit.code}</td>
                                <td className="p-4 font-bold">{unit.name_ar}</td>
                                <td className="p-4">{unit.name_en}</td>
                                <td className="p-4">{unit.base_factor}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingUnit(unit)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteUnit(unit.code)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <TrashIcon className="w-4 h-4" />
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
