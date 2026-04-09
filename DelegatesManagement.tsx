import React, { useState, useEffect } from 'react';
import { useFirebase, useI18n, useToast } from './lib/contexts';
import { TruckIcon, UserIcon, MapPinIcon, PlusIcon, SearchIcon } from './lib/contexts/Icons';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function DelegatesManagement() {
  const { db } = useFirebase();
  const { language } = useI18n();
  const { addToast } = useToast();
  const [delegates, setDelegates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDelegates = async () => {
    if (!db) return;
    try {
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const delegateUsers = allUsers.filter((u: any) => u.type === 'delegate' || u.role === 'delegate');
      setDelegates(delegateUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelegates();
  }, [db]);

  const handleStatusChange = async (delegateId: string, status: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', delegateId), { delegateStatus: status });
      addToast(language === 'ar' ? 'تم تحديث حالة المندوب' : 'Delegate status updated', 'success');
      fetchDelegates();
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  const filteredDelegates = delegates.filter(d => 
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.phone || '').includes(searchTerm)
  );

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary mb-2">إدارة المندوبين والموزعين 🚚</h2>
          <p className="text-gray-400 font-bold">متابعة أداء المندوبين وحالة التوصيل الميداني</p>
        </div>
        <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
          <PlusIcon className="w-6 h-6" /> إضافة مندوب جديد
        </button>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative flex-1 w-full">
            <input 
              type="text" 
              placeholder="بحث عن مندوب..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary/20" 
            />
            <SearchIcon className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">المندوب</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">رقم الهاتف</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الفرع</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الطلبات الحالية</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center font-black text-gray-300 animate-pulse">جاري التحميل...</td></tr>
              ) : filteredDelegates.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center font-black text-gray-300">لا يوجد مندوبين مسجلين</td></tr>
              ) : filteredDelegates.map(delegate => (
                <tr key={delegate.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <span className="font-black text-slate-800">{delegate.name || 'غير معروف'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-500">{delegate.phone || '---'}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                      <MapPinIcon className="w-4 h-4 text-primary" />
                      {delegate.assignedBranchId || 'غير معين'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                      delegate.delegateStatus === 'active' ? 'bg-emerald-100 text-emerald-600' : 
                      delegate.delegateStatus === 'busy' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {delegate.delegateStatus === 'active' ? 'متاح' : delegate.delegateStatus === 'busy' ? 'مشغول' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-primary">0</td>
                  <td className="px-8 py-6">
                    <select 
                      value={delegate.delegateStatus || 'inactive'}
                      onChange={(e) => handleStatusChange(delegate.id, e.target.value)}
                      className="bg-slate-100 p-2 rounded-xl text-xs font-bold outline-none border-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">متاح</option>
                      <option value="busy">مشغول</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
