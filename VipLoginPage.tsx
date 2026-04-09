import React, { useState } from 'react';
import { useToast, useI18n } from './lib/contexts';
import { useAuth } from './src/contexts/AuthContext';
import { ShieldCheckIcon, UserIcon, LockIcon, ArrowRightIcon } from './lib/contexts/Icons';

interface VipLoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export function VipLoginPage({ onLoginSuccess }: VipLoginPageProps) {
  const { language } = useI18n();
  const { addToast } = useToast();
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginWithEmail(email, password);
      addToast(language === 'ar' ? 'مرحباً بك في بوابة دلتا ستارز' : 'Welcome to Delta Stars Portal', 'success');
      // AuthContext will update, and App will handle navigation
    } catch (error: any) {
      addToast(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid login credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 font-tajawal">
      <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-4xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* Left Side: Info */}
        <div className="flex-1 bg-primary p-16 md:p-24 text-white space-y-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80')] bg-cover"></div>
          <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-secondary rounded-[2rem] flex items-center justify-center shadow-2xl">
              <ShieldCheckIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">بوابة العملاء VIP</h2>
            <p className="text-xl text-gray-400 font-bold leading-relaxed">
              تمكن كل عميل VIP من فتح حساب خاص به، منه يدير طلبياته وحسابه ومشترياته بسهولة وسرية تامة وبدون إطلاع أحد سوى الإدارة.
            </p>
            <ul className="space-y-4 font-bold text-secondary">
              <li className="flex items-center gap-3"><div className="w-2 h-2 bg-secondary rounded-full"></div> تتبع لحظي للشحنات</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 bg-secondary rounded-full"></div> أسعار خاصة وحصرية</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 bg-secondary rounded-full"></div> تقارير مالية مفصلة</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-16 md:p-24 bg-white space-y-12">
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-primary">تسجيل الدخول 🔑</h3>
            <p className="text-gray-400 font-bold">أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">البريد الإلكتروني</label>
              <div className="relative">
                <UserIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input 
                  type="email" 
                  required
                  placeholder="vip@deltastars.com" 
                  className="w-full p-6 pr-16 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-3xl outline-none font-bold transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">كلمة المرور</label>
              <div className="relative">
                <LockIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full p-6 pr-16 bg-slate-50 border-2 border-transparent focus:border-secondary rounded-3xl outline-none font-bold transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-6 rounded-3xl font-black text-2xl shadow-sovereign hover:bg-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {isLoading ? 'جاري التحقق...' : 'تفعيل الدخول السيادي'}
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="pt-10 border-t border-slate-100 text-center">
            <p className="text-gray-400 font-bold text-sm">ليس لديك حساب؟ <button className="text-secondary font-black underline">تواصل مع الإدارة لطلب الانضمام</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
