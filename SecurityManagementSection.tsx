import React from 'react';
import { FingerprintIcon } from 'lucide-react';

interface SecurityManagementSectionProps {
    language: 'ar' | 'en';
    isBiometricEnabled: boolean;
    setIsBiometricEnabled: (val: boolean) => void;
    isFaceIdEnabled: boolean;
    setIsFaceIdEnabled: (val: boolean) => void;
}

export const SecurityManagementSection: React.FC<SecurityManagementSectionProps> = ({
    language,
    isBiometricEnabled,
    setIsBiometricEnabled,
    isFaceIdEnabled,
    setIsFaceIdEnabled,
}) => {
    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                <FingerprintIcon className="w-10 h-10 text-primary" />
                {language === 'ar' ? 'نظام الحماية السيادي' : 'Sovereign Security Protocols'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-gray-100 space-y-8">
                    <h3 className="text-2xl font-black text-primary">
                        {language === 'ar' ? 'تغيير كلمة مرور المطور' : 'Change Developer Password'}
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
                                {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
                                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                            />
                        </div>
                        <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-lg hover:bg-secondary transition-all">
                            {language === 'ar' ? 'تحديث مفتاح الوصول السيادي' : 'Update Sovereign Access Key'}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-gray-100 space-y-8">
                    <h3 className="text-2xl font-black text-primary">
                        {language === 'ar' ? 'المصادقة الثنائية (MFA)' : 'Biometric Authentication'}
                    </h3>
                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100">
                        <div>
                            <p className="font-black text-slate-800">{language === 'ar' ? 'بصمة الإصبع' : 'Fingerprint'}</p>
                            <p className="text-xs text-gray-400 font-bold">
                                {language === 'ar' ? 'تفعيل الدخول عبر البصمة' : 'Enable Biometric Access'}
                            </p>
                        </div>
                        <div
                            onClick={() => setIsBiometricEnabled(!isBiometricEnabled)}
                            className={`w-16 h-8 rounded-full relative cursor-pointer transition-all ${
                                isBiometricEnabled ? 'bg-primary' : 'bg-gray-200'
                            }`}
                        >
                            <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${
                                    isBiometricEnabled ? 'right-1' : 'left-1'
                                }`}
                            ></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100">
                        <div>
                            <p className="font-black text-slate-800">
                                {language === 'ar' ? 'التعرف على الوجه' : 'Face Recognition'}
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                                {language === 'ar' ? 'تفعيل الدخول عبر الوجه' : 'Enable Face ID'}
                            </p>
                        </div>
                        <div
                            onClick={() => setIsFaceIdEnabled(!isFaceIdEnabled)}
                            className={`w-16 h-8 rounded-full relative cursor-pointer transition-all ${
                                isFaceIdEnabled ? 'bg-primary' : 'bg-gray-200'
                            }`}
                        >
                            <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${
                                    isFaceIdEnabled ? 'right-1' : 'left-1'
                                }`}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 p-10 rounded-[3rem] border-2 border-red-100">
                <h3 className="text-2xl font-black text-red-600 mb-6 uppercase tracking-tighter">Emergency Lockdown</h3>
                <p className="text-red-400 font-bold mb-8">
                    {language === 'ar'
                        ? 'في حالة اكتشاف اختراق، سيتم إغلاق كافة قنوات التوريد وتشفير قاعدة البيانات فوراً.'
                        : 'In case of breach detection, all supply channels will be closed and DB encrypted immediately.'}
                </p>
                <button className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all">
                    {language === 'ar' ? 'تفعيل الإغلاق الشامل' : 'Activate Total Lockdown'}
                </button>
            </div>
        </div>
    );
};
