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
    if (window.confirm('Are you sure you want to delete this branch?')) {
      await supabase.from('branches').delete().eq('id', id);
      loadBranches();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفروع</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>إضافة فرع</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربية</label>
              <input
                required
                type="text"
                value={formData.name_ar}
                onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزية</label>
              <input
                required
                type="text"
                value={formData.name_en}
                onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
              <input
                required
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                required
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">خط العرض (Latitude)</label>
              <input
                required
                type="number"
                step="any"
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">خط الطول (Longitude)</label>
              <input
                required
                type="number"
                step="any"
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingBranch(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingBranch ? 'تحديث' : 'حفظ'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{branch.name_ar}</h3>
                <p className="text-gray-500 text-sm">{branch.name_en}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
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
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(branch.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{branch.city}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5 text-gray-400" />
                <span>{branch.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
