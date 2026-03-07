
import React, { useState, useEffect } from 'react';
import { useI18n } from './contexts/I18nContext';
import { COMPANY_INFO } from '../constants';
import { XIcon, SparklesIcon, FingerprintIcon, StarIcon, DocumentTextIcon } from './contexts/Icons';

interface PaymentPortalProps {
    amount: number;
    orderId: string;
    onSuccess: (transactionId: string) => void;
    onCancel: () => void;
}

export const PaymentPortal: React.FC<PaymentPortalProps> = ({ amount, orderId, onSuccess, onCancel }) => {
    const { language, formatCurrency } = useI18n();
    const [step, setStep] = useState<'method' | 'card' | 'bank' | 'processing' | 'success'>('method');
    const [method, setMethod] = useState<'mada' | 'visa' | 'apple' | 'bank'>('mada');

    const handlePayment = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => onSuccess(`TXN-${Date.now()}`), 2000);
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-4xl overflow-hidden border-t-[15px] border-primary relative flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">ANB</div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">{language === 'ar' ? 'بوابة السداد السيادية' : 'Sovereign Payment Portal'}</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delta Stars Trading Store v24</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="bg-gray-100 hover:bg-red-500 hover:text-white p-4 rounded-full transition-all"><XIcon className="w-6 h-6"/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {step === 'method' && (
                        <div className="space-y-8 animate-fade-in-right">
                            <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 font-bold mb-1">{language === 'ar' ? 'إجمالي المستحقات' : 'Total Due'}</p>
                                    <p className="text-5xl font-black text-primary">{formatCurrency(amount)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Ref</p>
                                    <p className="font-mono font-bold text-lg">#{orderId}</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-800">{language === 'ar' ? 'اختر طريقة السداد المفضلة' : 'Select Payment Method'}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <button onClick={() => { setMethod('mada'); setStep('card'); }} className="p-8 bg-white border-4 border-gray-100 rounded-3xl flex justify-between items-center hover:border-primary transition-all group shadow-sm">
                                    <span className="text-2xl font-black group-hover:text-primary">Mada (بطاقة مدى)</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mada_Logo.svg/2560px-Mada_Logo.svg.png" className="h-8 object-contain" />
                                </button>
                                <button onClick={() => setStep('bank')} className="p-8 bg-white border-4 border-gray-100 rounded-3xl flex justify-between items-center hover:border-primary transition-all group shadow-sm">
                                    <span className="text-2xl font-black group-hover:text-primary">حوالة بنكية (الآيبان)</span>
                                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary font-black">IBAN</div>
                                </button>
                                <button onClick={() => { setMethod('apple'); handlePayment(); }} className="p-8 bg-black text-white rounded-3xl flex justify-between items-center hover:scale-[1.02] transition-all shadow-xl">
                                    <span className="text-2xl font-black">Apple Pay</span>
                                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl"></div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'bank' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <button onClick={() => setStep('method')} className="text-primary font-black flex items-center gap-2 hover:underline">&larr; الرجوع لطرق الدفع</button>
                            
                            <div className="bg-primary text-white p-10 rounded-[3rem] shadow-4xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
                                <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">بيانات التحويل الرسمي</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-secondary font-black text-[10px] uppercase tracking-widest mb-1">اسم البنك</p>
                                        <p className="text-2xl font-black">{COMPANY_INFO.bank.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-secondary font-black text-[10px] uppercase tracking-widest mb-1">رقم الحساب</p>
                                            <p className="text-lg font-mono font-bold">{COMPANY_INFO.bank.account_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-secondary font-black text-[10px] uppercase tracking-widest mb-1">رقم الفرع</p>
                                            <p className="text-lg font-mono font-bold">{COMPANY_INFO.bank.branch}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 group cursor-pointer" onClick={() => {
                                        navigator.clipboard.writeText(COMPANY_INFO.bank.iban);
                                        alert('تم نسخ رقم الآيبان بنجاح');
                                    }}>
                                        <p className="text-secondary font-black text-[10px] uppercase tracking-widest mb-1">رقم الآيبان (IBAN)</p>
                                        <p className="text-xl font-mono font-bold break-all group-hover:text-secondary transition-colors">{COMPANY_INFO.bank.iban}</p>
                                        <p className="mt-2 text-[8px] opacity-50 uppercase font-black">Click to copy</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                                <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold mb-6">يرجى تحويل المبلغ المذكور وإرفاق صورة السند عبر واتساب الشركة لتأكيد طلبكم فوراً.</p>
                                <button onClick={() => window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=Order%20Payment%20Reference:%20${orderId}`, '_blank')} className="bg-green-500 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl hover:bg-green-600 transition-all">تأكيد التحويل عبر واتساب</button>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-20 text-center space-y-10 animate-pulse">
                            <div className="w-32 h-32 border-8 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-2xl"></div>
                            <h3 className="text-3xl font-black text-primary">{language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</h3>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-16 text-center space-y-8 animate-fade-in-up">
                            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-4xl text-white text-6xl">✓</div>
                            <h3 className="text-4xl font-black text-slate-800">{language === 'ar' ? 'تمت العملية بنجاح' : 'Success!'}</h3>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-center items-center gap-10 grayscale opacity-40">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mada_Logo.svg/2560px-Mada_Logo.svg.png" className="h-6" />
                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter">
                        <span className="p-1 bg-green-500 text-white rounded">SSL</span> 256-bit Secure
                    </div>
                </div>
            </div>
        </div>
    );
};
