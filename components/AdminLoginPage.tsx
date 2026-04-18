import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Lock, KeyRound, RefreshCw, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBack }) => {
  const { loginToAdminDashboard, resetAdminPassword, isLoading } = useAuth();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginToAdminDashboard(username, password);
    if (result.success) {
      if (result.needsPasswordChange) {
        addToast('⚠️ يجب تغيير كلمة المرور الافتراضية فوراً', 'warning');
      } else {
        addToast('✅ تم تسجيل الدخول إلى لوحة التحكم', 'success');
        onSuccess();
      }
    } else {
      addToast(result.error || 'فشل تسجيل الدخول', 'error');
    }
  };

  const handleResetPassword = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    setIsResetting(true);
    try {
      await resetAdminPassword('deltastars777@gmail.com');
      addToast('📧 تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني الخاص بالإدارة', 'success');
      setShowResetConfirm(false);
    } catch (error) {
      addToast('فشل إرسال رابط إعادة التعيين', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8 border-primary relative">
        <button onClick={onBack} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-primary">لوحة التحكم العامة</h2>
          <p className="text-gray-400 text-sm mt-1">مدير النظام</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">اسم المستخدم</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
            <div className="relative">
              <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all font-bold"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={handleResetPassword}
            disabled={isResetting}
            className="text-sm text-gray-500 hover:text-primary font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            {showResetConfirm ? 'تأكيد إرسال الرابط؟' : 'نسيت كلمة المرور؟'}
          </button>
        </div>
      </div>
    </div>
  );
};
