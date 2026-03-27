import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // تأكد أن مسار ملف الاتصال صحيح حسب مجلداتك
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. تسجيل الدخول عبر Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      alert('خطأ في بيانات الدخول، تأكد من الإيميل وكلمة المرور!');
      setLoading(false);
      return;
    }

    // 2. التحقق من رتبة المستخدم
    if (authData.user) {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      setLoading(false);

      // 3. توجيه المستخدم حسب الصلاحية
      if (roleData) {
        if (roleData.role === 'super_admin') {
          alert('مرحباً بك أيها المدير التقني!');
          navigate('/developer-dashboard'); // رابط لوحة المطور (سننشئها لاحقاً)
        } else if (roleData.role === 'admin') {
          alert('مرحباً بك في لوحة الإدارة!');
          navigate('/admin-dashboard'); // رابط لوحة الإدارة
        } else {
          navigate('/'); // المستخدم العادي يذهب للرئيسية
        }
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', direction: 'rtl' }}>
      <h2>تسجيل الدخول - لوحة التحكم</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 40px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' }}>
          {loading ? 'جاري التحقق...' : 'دخول الموظفين'}
        </button>
      </form>
    </div>
  );
}
