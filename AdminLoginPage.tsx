import React, { useState } from 'react';
import { useAuth } from './src/contexts/AuthContext';
import { useToast } from './src/contexts/ToastContext';
import { LockIcon, KeyRoundIcon, RefreshCwIcon, ArrowLeftIcon } from './lib/contexts/Icons';

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
      }
      onSuccess();
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4 font-tajawal">
      <div className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-md w-full border-t-[12px] border-primary relative">
        <button onClick={onBack} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeftIcon className="w-8 h-8" />
        </button>
        
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <LockIcon className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-black text-primary">لوحة التحكم العامة</h2>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">نظام الإدارة السيادي</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mr-4">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
              placeholder="Delta Stars"
              required
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mr-4">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <KeyRoundIcon className="w-6 h-6" />
            )}
            {isLoading ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>

        <div className="mt-8 text-center">
          {!showResetConfirm ? (
            <button
              onClick={handleResetPassword}
              className="text-sm text-primary font-bold hover:underline flex items-center justify-center gap-2 mx-auto transition-all"
            >
              <RefreshCwIcon className="w-4 h-4" /> نسيت كلمة المرور؟
            </button>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-xs text-red-600 font-bold">سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني المعتمد. هل أنت متأكد؟</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleResetPassword}
                  disabled={isResetting}
                  className="text-sm bg-red-600 text-white px-6 py-2 rounded-xl font-black hover:bg-red-700 transition-all"
                >
                  {isResetting ? 'جاري الإرسال...' : 'نعم، أرسل الرابط'}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-sm bg-white text-gray-400 px-6 py-2 rounded-xl font-black border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <LockIcon className="w-3 h-3 text-primary" />
            <span>بوابة مشفرة خاصة بالإدارة فقط</span>
          </div>
        </div>
      </div>
    </div>
  );
};
