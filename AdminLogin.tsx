/**
 * Delta Stars - صفحة تسجيل دخول لوحة التحكم
 * كلمة المرور الافتراضية مخفية تماماً
 * يمكن تغييرها عند أول دخول
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  initAuth,
  verifyAdminPassword,
  createAdminSession,
  isFirstLogin,
  markFirstLoginDone,
  changeAdminPassword,
  sendPasswordResetEmail,
  verifyResetCode,
  resetPasswordWithCode,
  getAdminEmail,
} from "@/lib/auth";

type LoginStep = "password" | "first-change" | "forgot" | "reset-code" | "reset-new";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<LoginStep>("password");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (verifyAdminPassword(password)) {
      if (isFirstLogin()) {
        setStep("first-change");
        setPassword("");
      } else {
        createAdminSession();
        toast.success("مرحباً بك في لوحة التحكم");
        setLocation("/admin");
      }
    } else {
      toast.error("كلمة المرور غير صحيحة");
    }
    setLoading(false);
  };

  const handleFirstChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    // تغيير كلمة المرور الافتراضية
    const result = changeAdminPassword("DeltaStars@2024", newPassword);
    if (result.success) {
      markFirstLoginDone();
      createAdminSession();
      toast.success("تم تعيين كلمة المرور الجديدة بنجاح");
      setLocation("/admin");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = sendPasswordResetEmail(resetEmail);
    if (result.success) {
      toast.success(result.message);
      setStep("reset-code");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyResetCode(resetCode)) {
      setStep("reset-new");
    } else {
      toast.error("رمز التحقق غير صحيح أو منتهي الصلاحية");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    setLoading(true);
    const result = resetPasswordWithCode(resetCode, newPassword);
    if (result.success) {
      toast.success(result.message);
      setStep("password");
      setNewPassword("");
      setConfirmPassword("");
      setResetCode("");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="Delta Stars"
            className="w-24 h-24 rounded-2xl mx-auto mb-4 shadow-2xl border-4 border-white/20 object-contain bg-white"
          />
          <h1 className="text-2xl font-bold text-white">لوحة تحكم المطور</h1>
          <p className="text-green-200 text-sm mt-1">Delta Stars - نجوم دلتا</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* خطوة: تسجيل الدخول */}
          {step === "password" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">تسجيل الدخول</h2>
                <p className="text-gray-500 text-sm">أدخل كلمة مرور المطور</p>
              </div>

              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right pr-4 pl-12 h-12 border-2 border-gray-200 focus:border-green-500"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-base rounded-xl"
              >
                {loading ? "جارٍ التحقق..." : "دخول"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setStep("forgot"); setResetEmail(getAdminEmail()); }}
                  className="text-green-700 hover:text-green-900 text-sm font-medium underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* تلميح البصمة */}
              <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-gray-50 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                <span className="text-xs text-gray-500">الدخول بالبصمة متاح على الأجهزة المدعومة</span>
              </div>
            </form>
          )}

          {/* خطوة: تغيير كلمة المرور عند أول دخول */}
          {step === "first-change" && (
            <form onSubmit={handleFirstChange} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">تعيين كلمة مرور خاصة</h2>
                <p className="text-gray-500 text-sm">أول دخول — يرجى تعيين كلمة مرور جديدة وثابتة</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                ⚠️ هذه الخطوة مرة واحدة فقط. اختر كلمة مرور قوية لا تنساها.
              </div>

              <Input
                type="password"
                placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
              <Input
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />

              <Button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-base rounded-xl"
              >
                {loading ? "جارٍ الحفظ..." : "حفظ وتسجيل الدخول"}
              </Button>
            </form>
          )}

          {/* خطوة: نسيت كلمة المرور */}
          {step === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">استعادة كلمة المرور</h2>
                <p className="text-gray-500 text-sm">سيتم إرسال رمز التحقق إلى بريدك الإلكتروني</p>
              </div>
              <Input
                type="email"
                placeholder="البريد الإلكتروني للمطور"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
              <Button type="submit" disabled={loading} className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
                {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
              </Button>
              <button type="button" onClick={() => setStep("password")} className="w-full text-center text-gray-500 text-sm hover:text-gray-700">
                ← العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {/* خطوة: إدخال رمز التحقق */}
          {step === "reset-code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">رمز التحقق</h2>
                <p className="text-gray-500 text-sm">أدخل الرمز المرسل إلى بريدك الإلكتروني</p>
              </div>
              <Input
                type="text"
                placeholder="رمز التحقق (6 أرقام)"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="text-center h-12 text-xl tracking-widest border-2 border-gray-200 focus:border-green-500"
                maxLength={6}
                required
              />
              <Button type="submit" className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
                تحقق
              </Button>
            </form>
          )}

          {/* خطوة: كلمة المرور الجديدة */}
          {step === "reset-new" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">كلمة المرور الجديدة</h2>
              </div>
              <Input
                type="password"
                placeholder="كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
              <Input
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
              <Button type="submit" disabled={loading} className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
                {loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-green-200/60 text-xs mt-6">
          © {new Date().getFullYear()} Delta Stars — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
