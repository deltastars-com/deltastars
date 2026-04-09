import React, { useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { useToast } from '../src/contexts/ToastContext';
import { LockIcon, ShieldCheckIcon, KeyRoundIcon, RefreshCwIcon } from './lib/contexts/Icons';

export default function SecuritySection() {
  const { changeAdminPassword, resetAdminPassword, user } = useAuth();
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('كلمتا المرور غير متطابقتين', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await changeAdminPassword(newPassword);
      addToast('تم تغيير كلمة المرور بنجاح', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addToast('فشل تغيير كلمة المرور', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRequest = async () => {
    try {
      await resetAdminPassword();
      addToast('📧 تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني', 'success');
    } catch (error) {
      addToast('فشل إرسال الطلب', 'error');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary mb-2">إدارة الحماية والوصول 🔐</h2>
          <p className="text-gray-400 font-bold">تأمين لوحة التحكم وإدارة كلمات المرور السيادية</p>
        </div>
        <div className="flex items-center gap-4 bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
          <ShieldCheckIcon className="w-6 h-6 text-green-600" />
          <span className="text-sm font-black text-green-700 uppercase tracking-widest">نظام حماية نشط</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Change Password */}
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <KeyRoundIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">تغيير كلمة المرور</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">تأكيد كلمة المرور</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور السيادية'}
            </button>
          </form>
        </div>

        {/* Recovery & Security Info */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <RefreshCwIcon className="w-6 h-6 text-secondary" />
              استعادة الوصول
            </h3>
            <p className="text-sm text-gray-400 font-bold mb-6">
              في حالة نسيان كلمة المرور، يمكنك طلب رابط إعادة التعيين الذي سيصل إلى بريدك الإلكتروني المعتمد لدى الإدارة.
            </p>
            <button 
              onClick={handleResetRequest}
              className="w-full py-4 bg-slate-50 text-primary rounded-2xl font-black hover:bg-primary hover:text-white transition-all border-2 border-primary/10"
            >
              إرسال رابط إعادة التعيين 📧
            </button>
          </div>

          <div className="bg-red-50 p-10 rounded-[3rem] border-2 border-red-100">
            <h3 className="text-xl font-black text-red-600 mb-4 flex items-center gap-3">
              <LockIcon className="w-6 h-6" />
              إغلاق الطوارئ
            </h3>
            <p className="text-xs text-red-400 font-bold mb-6 leading-relaxed">
              في حالة الاشتباه في اختراق أمني، يمكنك تفعيل "إغلاق الطوارئ" الذي سيقوم بتسجيل خروج كافة المستخدمين وتعطيل الدخول للوحة التحكم مؤقتاً.
            </p>
            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
              تفعيل إغلاق الطوارئ 🚨
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter">سجل نشاط الحماية (Audit Log)</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-bold text-slate-700">دخول ناجح للوحة التحكم</span>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase">{new Date().toLocaleString('ar-SA')}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-bold text-slate-700">تحديث إعدادات الشحن</span>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(Date.now() - 3600000).toLocaleString('ar-SA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
