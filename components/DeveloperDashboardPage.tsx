import React, { useState, useEffect } from 'react';
import { useDeveloperAuth } from '../contexts/DeveloperAuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabaseClient';
import { User, Shield, Key, Fingerprint, Database, Terminal, Trash2, RefreshCw, Save, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface DeveloperDashboardPageProps {
  onLogout: () => void;
}

export const DeveloperDashboardPage: React.FC<DeveloperDashboardPageProps> = ({ onLogout }) => {
  const { devUser, devChangePassword, devRegisterBiometric, devLogout } = useDeveloperAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('id, email, phone, role, force_password_change, biometric_enabled');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      addToast('كلمتا المرور غير متطابقتين', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
      return;
    }
    try {
      await devChangePassword(newPassword);
      addToast('تم تغيير كلمة المرور بنجاح', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addToast('فشل تغيير كلمة المرور', 'error');
    }
  };

  const handleRegisterBiometric = async () => {
    try {
      await devRegisterBiometric();
      addToast('تم تسجيل البصمة/الوجه بنجاح', 'success');
    } catch (error) {
      addToast('فشل تسجيل البصمة', 'error');
    }
  };

  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) {
      addToast('الرجاء إدخال استعلام SQL', 'error');
      return;
    }
    try {
      const { data, error } = await supabase.rpc('exec_sql', { query: sqlQuery });
      if (error) throw error;
      setSqlResult(data);
      addToast('تم تنفيذ الاستعلام بنجاح', 'success');
    } catch (error: any) {
      addToast(`خطأ: ${error.message}`, 'error');
      setSqlResult({ error: error.message });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
    if (error) {
      addToast('فشل تحديث الدور', 'error');
    } else {
      addToast('تم تحديث الدور بنجاح', 'success');
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع.')) {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        addToast('فشل حذف المستخدم', 'error');
      } else {
        addToast('تم حذف المستخدم بنجاح', 'success');
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
    addToast('تم مسح سجل الأحداث', 'info');
  };

  const handleRefreshCache = () => {
    addToast('تم تحديث ذاكرة التخزين المؤقت', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-2xl font-black text-primary">🔧 قسم المطور – صلاحيات كاملة</h1>
        <button onClick={() => { devLogout(); onLogout(); }} className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700">تسجيل خروج</button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4 border-r border-gray-700">
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('users')} className={`w-full text-right px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}><User className="w-4 h-4" /> إدارة المستخدمين</button>
            <button onClick={() => setActiveTab('security')} className={`w-full text-right px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'security' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}><Shield className="w-4 h-4" /> الأمان وكلمات المرور</button>
            <button onClick={() => setActiveTab('biometric')} className={`w-full text-right px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'biometric' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}><Fingerprint className="w-4 h-4" /> البصمة / الوجه</button>
            <button onClick={() => setActiveTab('sql')} className={`w-full text-right px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'sql' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}><Database className="w-4 h-4" /> SQL Console</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full text-right px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'logs' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}><Terminal className="w-4 h-4" /> سجل النظام</button>
            <button onClick={() => setActiveTab('system')} className={`w-full text-right px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'system' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}><RefreshCw className="w-4 h-4" /> صيانة النظام</button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">إدارة المستخدمين والأدوار</h2>
              <div className="overflow-x-auto bg-gray-800 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-700">
                    <tr><th className="p-3 text-right">البريد/الهاتف</th><th>الدور</th><th>تغيير القسري</th><th>بصمة</th><th>الإجراءات</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-700">
                        <td className="p-3">{u.email || u.phone}</td>
                        <td>
                          <select value={u.role} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)} className="bg-gray-700 p-1 rounded">
                            <option value="admin">admin</option><option value="developer">developer</option><option value="ops">ops</option><option value="client">client</option>
                          </select>
                        </td>
                        <td>{u.force_password_change ? 'نعم' : 'لا'}</td>
                        <td>{u.biometric_enabled ? '✅' : '❌'}</td>
                        <td><button onClick={() => handleDeleteUser(u.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">تغيير كلمة مرور المطور</h2>
              <div className="bg-gray-800 p-6 rounded-xl max-w-md">
                <div className="relative mb-4">
                  <input type={showNewPassword ? 'text' : 'password'} placeholder="كلمة المرور الجديدة" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg pr-10" />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3 top-3 text-gray-400"><EyeOff className="w-5 h-5" /></button>
                </div>
                <div className="relative mb-4">
                  <input type={showConfirmPassword ? 'text' : 'password'} placeholder="تأكيد كلمة المرور" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg pr-10" />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-3 text-gray-400"><EyeOff className="w-5 h-5" /></button>
                </div>
                <button onClick={handleChangePassword} className="bg-primary px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> تغيير كلمة المرور</button>
              </div>
            </div>
          )}

          {activeTab === 'biometric' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">تسجيل البصمة / الوجه</h2>
              <button onClick={handleRegisterBiometric} className="bg-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Fingerprint className="w-5 h-5" /> تسجيل البصمة الآن</button>
              <p className="text-gray-400 mt-4 text-sm">بعد التسجيل، يمكنك الدخول إلى قسم المطور باستخدام بصمتك مباشرة.</p>
            </div>
          )}

          {activeTab === 'sql' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">SQL Console (صلاحية كاملة)</h2>
              <textarea rows={8} value={sqlQuery} onChange={e => setSqlQuery(e.target.value)} placeholder="SELECT * FROM users LIMIT 10;" className="w-full p-4 bg-gray-800 rounded-xl font-mono text-sm" />
              <button onClick={handleExecuteSql} className="mt-4 bg-green-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Database className="w-4 h-4" /> تنفيذ الاستعلام</button>
              {sqlResult && (
                <pre className="mt-6 p-4 bg-gray-800 rounded-xl overflow-auto text-xs">{JSON.stringify(sqlResult, null, 2)}</pre>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">سجل النظام والأحداث</h2>
              <button onClick={handleClearLogs} className="mb-4 bg-red-600 px-4 py-2 rounded-lg text-sm">مسح السجل</button>
              <div className="bg-gray-800 p-4 rounded-xl h-96 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? <p className="text-gray-500">لا توجد أحداث مسجلة</p> : logs.map((log, i) => <div key={i} className="border-b border-gray-700 py-1">{log}</div>)}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">صيانة النظام</h2>
              <button onClick={handleRefreshCache} className="bg-yellow-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4" /> تحديث ذاكرة التخزين المؤقت</button>
              <div className="mt-8 p-4 bg-gray-800 rounded-xl">
                <h3 className="font-bold mb-2">معلومات النظام</h3>
                <p>إصدار النظام: 1.0.0</p>
                <p>قاعدة البيانات: Supabase PostgreSQL</p>
                <p>بيئة التشغيل: Netlify + GitHub Actions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
