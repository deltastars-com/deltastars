import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Phone, Lock, Fingerprint, Sparkles, CheckCircle, ArrowLeft, Shield, UserCog } from 'lucide-react';

export const LoginPage: React.FC<{ setPage: (page: any) => void }> = ({ setPage }) => {
  const {
    sendOtp, verifyOtpAndCreateSession, loginWithSavedDevice,
    loginWithPassword, loginWithBiometricForAdmin, registerBiometricForAdmin,
    user, isLoading
  } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState<'client' | 'admin'>('client');

  // --- حالة العميل (OTP) ---
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  // --- حالة الإدارة ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  // محاولة الدخول التلقائي للعميل إذا كان الجهاز مسجلاً مسبقاً
  useEffect(() => {
    const attemptAutoLogin = async () => {
      if (mode === 'client' && !user && !autoLoginAttempted) {
        setAutoLoginAttempted(true);
        const success = await loginWithSavedDevice();
        if (success) {
          addToast('تم تسجيل الدخول تلقائياً', 'success');
          setPage('home');
        }
      }
    };
    attemptAutoLogin();
  }, [mode, user, autoLoginAttempted]);

  // --- دوال العميل ---
  const formatPhone = (v: string) => v.replace(/\D/g, '').slice(0, 10);
  const handleSendOtp = async () => {
    if (phone.length < 10) { addToast('أدخل رقم جوال صحيح', 'error'); return; }
    setIsSending(true);
    try {
      await sendOtp(`966${phone}`);
      setOtpStep('otp');
      setCountdown(60);
      const timer = setInterval(() => setCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }), 1000);
      addToast('تم إرسال رمز التحقق', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل الإرسال', 'error');
    } finally {
      setIsSending(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) { addToast('أدخل رمز مكون من 6 أرقام', 'error'); return; }
    try {
      const result = await verifyOtpAndCreateSession(`966${phone}`, otpCode);
      if (result.needsDeviceSave) {
        addToast('تم تسجيل الدخول. يرجى إتمام أول عملية شراء لحفظ جهازك.', 'info');
        setPage('cart');
      } else {
        addToast('تم تسجيل الدخول بنجاح', 'success');
        setPage('home');
      }
    } catch (err: any) {
      addToast(err.message || 'رمز غير صحيح', 'error');
    }
  };

  // --- دوال الإدارة ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    try {
      const result = await loginWithPassword(email, password);
      if (result.needsPasswordChange) {
        setNeedsPasswordChange(true);
        addToast('يجب تغيير كلمة المرور الافتراضية', 'warning');
      } else {
        addToast('تم تسجيل الدخول بنجاح', 'success');
        setPage('dashboard');
      }
    } catch (err: any) {
      addToast(err.message || 'فشل تسجيل الدخول', 'error');
    } finally {
      setIsAdminLoading(false);
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { addToast('كلمتا المرور غير متطابقتين', 'error'); return; }
    if (newPassword.length < 8) { addToast('كلمة المرور 8 أحرف على الأقل', 'error'); return; }
    setIsAdminLoading(true);
    try {
      await changePassword(newPassword);
      addToast('تم تغيير كلمة المرور بنجاح', 'success');
      setNeedsPasswordChange(false);
      setShowBiometricSetup(true);
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsAdminLoading(false);
    }
  };
  const handleBiometricLogin = async () => {
    const success = await loginWithBiometricForAdmin();
    if (success) {
      addToast('تم الدخول بالبصمة', 'success');
      setPage('dashboard');
    } else {
      addToast('فشل التعرف على البصمة', 'error');
    }
  };
  const handleRegisterBiometric = async () => {
    try {
      await registerBiometricForAdmin();
      addToast('تم تسجيل البصمة/الوجه بنجاح', 'success');
      setShowBiometricSetup(false);
      setPage('dashboard');
    } catch (err: any) {
      addToast(err.message || 'فشل تسجيل البصمة', 'error');
    }
  };

  // شاشة تغيير كلمة المرور الإجبارية (للمسؤول / المطور)
  if (needsPasswordChange) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-black text-primary mb-2">تغيير كلمة المرور</h2>
          <p className="text-gray-500 mb-6">يجب تغيير كلمة المرور الافتراضية</p>
          <input type="password" placeholder="كلمة المرور الجديدة" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-4 border rounded-xl mb-4" />
          <input type="password" placeholder="تأكيد كلمة المرور" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-4 border rounded-xl mb-6" />
          <button onClick={handleChangePassword} className="w-full bg-primary text-white py-4 rounded-xl font-black">تغيير كلمة المرور</button>
        </div>
      </div>
    );
  }

  // شاشة تفعيل البصمة بعد تغيير كلمة المرور (اختياري)
  if (showBiometricSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <Fingerprint className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">تفعيل الدخول بالبصمة / الوجه</h2>
          <p className="text-gray-500 mb-6">يمكنك تسجيل بصمتك للدخول السريع في المرات القادمة</p>
          <button onClick={handleRegisterBiometric} className="w-full bg-primary text-white py-4 rounded-xl font-black mb-3">تسجيل البصمة الآن</button>
          <button onClick={() => { setShowBiometricSetup(false); setPage('dashboard'); }} className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-black">تخطي</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8 border-primary">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-primary">Delta Stars</h1>
          <p className="text-gray-400 text-sm">{mode === 'client' ? 'تسجيل العملاء' : 'لوحة التحكم'}</p>
        </div>

        {/* أزرار التبديل بين وضع العميل والإدارة */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
          <button onClick={() => setMode('client')} className={`flex-1 py-2 rounded-full font-bold transition ${mode === 'client' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>
            <Phone className="w-4 h-4 inline ml-1" /> عميل
          </button>
          <button onClick={() => setMode('admin')} className={`flex-1 py-2 rounded-full font-bold transition ${mode === 'admin' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>
            <UserCog className="w-4 h-4 inline ml-1" /> إدارة
          </button>
        </div>

        {/* ========== وضع العميل ========== */}
        {mode === 'client' && (
          <div>
            {otpStep === 'phone' && (
              <div className="space-y-6">
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 rounded-r-2xl text-gray-500 font-bold">+966</span>
                  <input type="tel" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="5XXXXXXXX" className="flex-1 px-4 py-4 border rounded-l-2xl focus:ring-2 focus:ring-primary outline-none text-lg" maxLength={10} autoFocus />
                </div>
                <button onClick={handleSendOtp} disabled={isSending || phone.length < 10} className="w-full bg-primary text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles className="w-5 h-5" /> إرسال رمز التحقق</>}
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

        {/* ========== وضع الإدارة ========== */}
        {mode === 'admin' && (
          <div>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" required />
              </div>
              <button type="submit" disabled={isAdminLoading} className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2">
                {isAdminLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'تسجيل الدخول'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={handleBiometricLogin} className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
                <Fingerprint className="w-4 h-4" /> الدخول بالبصمة / الوجه
              </button>
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-gray-400">
          <p>📧 للتواصل العام: info@deltastars.ksa.com</p>
          {mode === 'admin' && <p className="mt-1">🔐 المسؤول: deltastars90@gmail.com | المطور: deltastars@zoho.com</p>}
          {mode === 'client' && <p className="mt-1">✅ بعد أول عملية شراء، سيتم حفظ جهازك للدخول التلقائي لاحقاً</p>}
        </div>
      </div>
    </div>
  );
};
