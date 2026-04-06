import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../contexts/I18nContext';
import { Mail, Lock, Phone, Fingerprint, AlertCircle, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const LoginPage: React.FC<{ setPage: (page: any) => void }> = ({ setPage }) => {
  const { loginWithPassword, changePassword, user, loginWithOtp, verifyOtpAndLogin } = useAuth();
  const { addToast } = useToast();
  const { t, language } = useI18n();

  // وضع الدخول: 'admin' أو 'client'
  const [mode, setMode] = useState<'admin' | 'client'>('admin');

  // --- حالة وضع الإدارة ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsChange, setNeedsChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- حالة وضع العميل (OTP) ---
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // --- دالة تسجيل دخول الإدارة ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await loginWithPassword(email, password);
      if (result?.needsPasswordChange) {
        setNeedsChange(true);
        addToast('يرجى تغيير كلمة المرور الافتراضية', 'warning');
      } else {
        addToast('تم تسجيل الدخول بنجاح', 'success');
        setPage('dashboard');
      }
    } catch (err: any) {
      addToast(err.message || 'فشل تسجيل الدخول', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- دالة تغيير كلمة المرور بعد أول دخول ---
  const handleChangePassword = async () => {
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
      await changePassword(user!.id, newPassword);
      addToast('تم تغيير كلمة المرور بنجاح', 'success');
      setNeedsChange(false);
      setPage('dashboard');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- دوال وضع العميل (OTP) ---
  const formatPhone = (v: string) => v.replace(/\D/g, '').slice(0, 10);
  const handleSendOtp = async () => {
    if (phone.length < 10) { addToast('أدخل رقم جوال صحيح', 'error'); return; }
    setIsSendingOtp(true);
    try {
      await loginWithOtp(`966${phone}`);
      setOtpStep('otp');
      setCountdown(60);
      const timer = setInterval(() => setCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }), 1000);
      addToast('تم إرسال رمز التحقق', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل الإرسال', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) { addToast('أدخل رمز مكون من 6 أرقام', 'error'); return; }
    setIsLoading(true);
    try {
      await verifyOtpAndLogin(`966${phone}`, otpCode);
      addToast('تم تسجيل الدخول بنجاح', 'success');
      setPage('dashboard');
    } catch (err: any) {
      addToast(err.message || 'رمز غير صحيح', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- المصادقة الحيوية (WebAuthn) ستُضاف لاحقاً ---
  const handleBiometric = async () => {
    addToast('سيتم تفعيل البصمة/الوجه في الإصدار القادم', 'info');
  };

  // --- شاشة تغيير كلمة المرور الإجبارية ---
  if (needsChange) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-black text-primary mb-2">تغيير كلمة المرور</h2>
          <p className="text-gray-500 mb-6">يجب تغيير كلمة المرور الافتراضية قبل الاستمرار</p>
          <input type="password" placeholder="كلمة المرور الجديدة" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-4 border rounded-xl mb-4" />
          <input type="password" placeholder="تأكيد كلمة المرور" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-4 border rounded-xl mb-6" />
          <button onClick={handleChangePassword} className="w-full bg-primary text-white py-4 rounded-xl font-black">تغيير كلمة المرور</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8 border-primary">
        {/* رأس الصفحة */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-primary">Delta Stars</h1>
          <p className="text-gray-400 text-sm">{mode === 'admin' ? 'لوحة التحكم المركزية' : 'تسجيل دخول العملاء'}</p>
        </div>

        {/* أزرار التبديل بين الوضعين */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
          <button onClick={() => setMode('admin')} className={`flex-1 py-2 rounded-full font-bold transition ${mode === 'admin' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>إدارة</button>
          <button onClick={() => setMode('client')} className={`flex-1 py-2 rounded-full font-bold transition ${mode === 'client' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>عميل</button>
        </div>

        {/* وضع الإدارة */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-12 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="example@domain.com" required />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-12 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" required />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'تسجيل الدخول'}
            </button>
          </form>
        )}

        {/* وضع العميل (OTP) */}
        {mode === 'client' && (
          <div>
            {otpStep === 'phone' && (
              <div className="space-y-6">
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 rounded-r-2xl text-gray-500 font-bold">+966</span>
                  <input type="tel" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="5XXXXXXXX" className="flex-1 px-4 py-4 border rounded-l-2xl focus:ring-2 focus:ring-primary outline-none text-lg" maxLength={10} autoFocus />
                </div>
                <button onClick={handleSendOtp} disabled={isSendingOtp || phone.length < 10} className="w-full bg-primary text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSendingOtp ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles className="w-5 h-5" /> إرسال رمز التحقق</>}
                </button>
              </div>
            )}
            {otpStep === 'otp' && (
              <div className="space-y-6">
                <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="أدخل الرمز" className="w-full px-4 py-4 border rounded-2xl text-center text-2xl font-mono tracking-widest" maxLength={6} autoFocus />
                <button onClick={handleVerifyOtp} disabled={isLoading || otpCode.length !== 6} className="w-full bg-primary text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5" /> تأكيد وتسجيل الدخول</>}
                </button>
                <div className="text-center">
                  <button onClick={handleSendOtp} disabled={countdown > 0} className="text-sm text-primary font-bold disabled:opacity-50">
                    {countdown > 0 ? `إعادة الإرسال خلال ${countdown} ثانية` : 'إعادة إرسال الرمز'}
                  </button>
                </div>
                <button onClick={() => { setOtpStep('phone'); setOtpCode(''); }} className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> تغيير رقم الجوال</button>
              </div>
            )}
          </div>
        )}

        {/* خيار المصادقة الحيوية (يظهر في وضع الإدارة فقط) */}
        {mode === 'admin' && (
          <div className="mt-6 text-center">
            <button onClick={handleBiometric} className="text-sm text-gray-500 hover:text-primary transition flex items-center justify-center gap-2 mx-auto">
              <Fingerprint className="w-4 h-4" /> دخول بالبصمة / الوجه
            </button>
          </div>
        )}

        {/* معلومات إضافية (للإدارة) */}
        {mode === 'admin' && (
          <div className="mt-8 pt-6 border-t text-center text-xs text-gray-400">
            <p>📧 البريد الرسمي للتواصل: info@deltastars.ksa.com</p>
            <p className="mt-1">🔐 للمسؤول: deltastars90@gmail.com</p>
            <p>👨‍💻 للمطور: deltastars@zoho.com</p>
          </div>
        )}
      </div>
    </div>
  );
};
