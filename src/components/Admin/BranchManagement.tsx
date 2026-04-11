import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PlusCircle, Edit, Trash2, MapPin, Users } from 'lucide-react';

interface Branch {
  id: string;
  name_ar: string;
  name_en: string;
  city: string;
  phone: string;
  is_active: boolean;
  location: { lat: number; lng: number };
}

export const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    city: '',
    phone: '',
    lat: 21.5424,
    lng: 39.2201
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    const { data } = await supabase.from('branches').select('*').order('created_at');
    if (data) setBranches(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      await supabase
        .from('branches')
        .update({
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          city: formData.city,
          phone: formData.phone,
          location: { lat: formData.lat, lng: formData.lng }
        })
        .eq('id', editingBranch.id);
    } else {
      await supabase.from('branches').insert({
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        city: formData.city,
        phone: formData.phone,
        location: { lat: formData.lat, lng: formData.lng },
        is_active: true
      });
    }
    loadBranches();
    setShowForm(false);
    setEditingBranch(null);
    setFormData({ name_ar: '', name_en: '', city: '', phone: '', lat: 21.5424, lng: 39.2201 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
      await supabase.from('branches').delete().eq('id', id);
      loadBranches();
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name_ar: branch.name_ar,
      name_en: branch.name_en,
      city: branch.city,
      phone: branch.phone,
      lat: branch.location?.lat || 21.5424,
      lng: branch.location?.lng || 39.2201
    });
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          إدارة الفروع
        </h2>
        <button
          onClick={() => { setShowForm(true); setEditingBranch(null); setFormData({ name_ar: '', name_en: '', city: '', phone: '', lat: 21.5424, lng: 39.2201 }); }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> إضافة فرع جديد
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-bold mb-4">{editingBranch ? 'تعديل فرع' : 'إضافة فرع جديد'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="الاسم بالعربية" value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="text" placeholder="الاسم بالإنجليزية" value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="text" placeholder="المدينة" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="text" placeholder="رقم الهاتف" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="p-2 border rounded-lg" required />
            <input type="text" placeholder="خط الطول" value={formData.lat} onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="p-2 border rounded-lg" />
            <input type="text" placeholder="خط العرض" value={formData.lng} onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="p-2 border rounded-lg" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold">حفظ</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingBranch(null); }} className="bg-gray-300 px-4 py-2 rounded-lg">إلغاء</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="p-3 text-right">الاسم</th><th>المدينة</th><th>الهاتف</th><th>الحالة</th><th></th></tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id} className="border-b">
                <td className="p-3">{branch.name_ar} <br /><span className="text-xs text-gray-400">{branch.name_en}</span></td>
                <td className="p-3">{branch.city}</td>
                <td className="p-3">{branch.phone}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${branch.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{branch.is_active ? 'نشط' : 'غير نشط'}</span></td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(branch)} className="text-blue-500"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(branch.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
