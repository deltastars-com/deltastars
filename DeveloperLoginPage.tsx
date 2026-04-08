import React, { useState } from 'react';
import { useDeveloperAuth } from '../contexts/DeveloperAuthContext';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { Lock, Fingerprint, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

interface DeveloperLoginPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const DeveloperLoginPage: React.FC<DeveloperLoginPageProps> = ({ onSuccess, onBack }) => {
  const { devLogin, devLoginWithBiometric, isDevLoading } = useDeveloperAuth();
  const { addToast } = useToast();
  const { language } = useI18n();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await devLogin(username, password);
    if (result.success) {
      if (result.needsPasswordChange) {
        addToast('⚠️ يجب تغيير كلمة المرور الافتراضية فوراً', 'warning');
        // هنا يمكن توجيه المستخدم إلى صفحة تغيير كلمة المرور الخاصة
      } else {
        addToast('✅ تم تسجيل الدخول إلى قسم المطور بنجاح', 'success');
        onSuccess();
      }
    } else {
      addToast(result.error || 'فشل تسجيل الدخول', 'error');
    }
  };

  const handleBiometricLogin = async () => {
    const success = await devLoginWithBiometric();
    if (success) {
      addToast('✅ تم الدخول بالبصمة', 'success');
      onSuccess();
    } else {
      addToast('❌ فشل التعرف على البصمة', 'error');
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
            <KeyRound className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-primary">قسم المطور</h2>
          <p className="text-gray-400 text-sm mt-1">مدخل آمن ومحمي بالكامل</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
              placeholder="المطور"
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
            disabled={isDevLoading}
            className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2"
          >
            {isDevLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock className="w-5 h-5" />}
            {isDevLoading ? 'جاري التحقق...' : 'دخول إلى قسم المطور'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={handleBiometricLogin} className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
            <Fingerprint className="w-4 h-4" /> الدخول بالبصمة / الوجه
          </button>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-400">
          <p className="text-red-500">⚠️ هذا القسم خاص بالمطور فقط</p>
          <p>لن يتم عرض أي معلومات اتصال هنا</p>
        </div>
      </div>
    </div>
  );
};
