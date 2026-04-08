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
        // يمكن توجيه المستخدم إلى صفحة تغيير كلمة المرور
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
      await resetAdminPassword();
      addToast('📧 تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
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
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
              placeholder="Delta Stars"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <KeyRound className="w-5 h-5" />}
            {isLoading ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {!showResetConfirm ? (
            <button
              onClick={handleResetPassword}
              className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> نسيت كلمة المرور؟
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني. هل أنت متأكد؟</p>
              <button
                onClick={handleResetPassword}
                disabled={isResetting}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-xl font-bold"
              >
                {isResetting ? 'جاري الإرسال...' : 'نعم، أرسل الرابط'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-400">
          <p>🔒 هذه البوابة خاصة بالإدارة فقط</p>
        </div>
      </div>
    </div>
  );
};
