
import React, { useState, useMemo } from 'react';
import { useI18n } from './lib/contexts/I18nContext';
import { useToast } from './ToastContext';
import { User, Product, VipTransaction, Invoice, Page } from '../types';
import { COMPANY_INFO } from './constants';
import { PrintIcon, LocationMarkerIcon, DocumentTextIcon, ChartBarIcon, LogoutIcon, SparklesIcon } from './lib/contexts/Icons';

interface VipDashboardPageProps {
  user: User | null;
  onLogout: () => void;
  products: Product[];
  addToCart: (p: Product, q: number) => void;
  invoices: Invoice[];
  transactions: VipTransaction[];
  setPage: (page: Page) => void;
}

export const VipDashboardPage: React.FC<VipDashboardPageProps> = ({ user, onLogout, invoices, transactions, setPage }) => {
    const { language, formatCurrency, t } = useI18n();

    if (!user || user.type !== 'vip') return <div className="p-20 text-center font-black text-4xl">403: Access Denied</div>;

    const myInvoices = useMemo(() => invoices.filter(i => i.clientId === user.phone), [invoices, user.phone]);
    const outstandingBalance = user.creditLimit - (user.currentBalance || 0);

    return (
        <div className="container mx-auto px-6 py-16 animate-fade-in text-black">
            {/* VIP Sovereign Header */}
            <div className="bg-white p-12 rounded-[5rem] shadow-3xl mb-12 flex flex-col md:flex-row justify-between items-center gap-8 border-b-[20px] border-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex items-center gap-10">
                    <div className="w-32 h-32 bg-primary rounded-[3rem] flex items-center justify-center text-6xl shadow-inner border-b-8 border-primary-dark">🏢</div>
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-secondary text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em]">Institutional Partner</div>
                            <span className="text-gray-400 font-bold text-sm">Account: #{user.phone}</span>
                        </div>
                        <h1 className="text-6xl font-black text-primary leading-none uppercase tracking-tighter">{user.name}</h1>
                    </div>
                </div>
                <div className="flex gap-6 relative z-10">
                    <button onClick={() => setPage('products')} className="bg-primary text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl hover:scale-105 transition-all shadow-4xl border-b-8 border-primary-dark active:translate-y-2 active:border-b-0">
                        🛒 {t('home.hero.button')}
                    </button>
                    <button onClick={onLogout} className="bg-red-50 text-red-600 p-6 rounded-[2rem] hover:bg-red-600 hover:text-white transition-all shadow-xl group border-2 border-red-100">
                        <LogoutIcon className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Account Details & Statement */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Financial KPI Grid for Client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-3xl border-b-[15px] border-secondary relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
                            <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-4">رصيد المديونية الحالي</p>
                            <p className="text-6xl font-black">{formatCurrency(Math.abs(user.currentBalance || 0))}</p>
                            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-white/40">
                                <SparklesIcon className="w-4 h-4" /> يتم التحديث فور صدور الفواتير
                            </div>
                        </div>
                        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-2 border-gray-100 flex flex-col justify-between">
                            <div>
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4">الائتمان المتبقي</p>
                                <p className="text-5xl font-black text-slate-800">{formatCurrency(outstandingBalance)}</p>
                            </div>
                            <div className="mt-8">
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                                        style={{ width: `${(outstandingBalance / user.creditLimit) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="mt-3 text-[10px] font-black text-gray-400 text-right uppercase">Credit Usage Security Check</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Statement Table */}
                    <div className="bg-white p-12 rounded-[4.5rem] shadow-3xl border border-gray-100">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b">
                            <h3 className="text-3xl font-black flex items-center gap-4 text-slate-800">
                                <DocumentTextIcon className="w-10 h-10 text-primary" />
                                كشف الحساب التفصيلي
                            </h3>
                            <button className="bg-slate-100 p-4 rounded-2xl hover:bg-primary hover:text-white transition-all">
                                <PrintIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {transactions.length === 0 ? (
                                <div className="py-20 text-center opacity-20">
                                    <DocumentTextIcon className="w-24 h-24 mx-auto mb-6" />
                                    <p className="text-2xl font-black">لا توجد حركات مالية مسجلة</p>
                                </div>
                            ) : (
                                transactions.map(trn => (
                                    <div key={trn.id} className="flex justify-between items-center p-8 bg-gray-50 rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary/10 group">
                                        <div className="flex items-center gap-8">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-sm ${trn.debit > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {trn.debit > 0 ? '↙' : '↗'}
                                            </div>
                                            <div>
                                                <p className="font-black text-2xl text-slate-800 mb-1">{language === 'ar' ? trn.description_ar : trn.description_en}</p>
                                                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">{trn.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-3xl font-black ${trn.debit > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {trn.debit > 0 ? `-${formatCurrency(trn.debit)}` : `+${formatCurrency(trn.credit)}`}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-2">Balance: {formatCurrency(trn.balance)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-primary text-white p-12 rounded-[4rem] shadow-4xl relative overflow-hidden border-b-[20px] border-secondary group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
                        <h3 className="text-2xl font-black mb-10 border-b border-white/10 pb-4 flex items-center gap-3">
                            <SparklesIcon className="w-6 h-6 text-secondary" />
                            بوابة الدعم المالي
                        </h3>
                        <div className="space-y-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Account Manager</span>
                                <span className="text-2xl font-black">أ/ عبد الرحمن الغامدي</span>
                            </div>
                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <p className="text-sm font-bold text-white/60 leading-relaxed italic">"نحن هنا لضمان سلاسة التدفق المالي لعملياتكم التوريدية في كافة فروع المملكة."</p>
                                <a 
                                    href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Inquiry%20from%20VIP%20Account%20${user.phone}`} 
                                    target="_blank" rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-4 py-6 bg-white text-primary rounded-[2rem] font-black text-xl hover:bg-secondary hover:text-white transition-all shadow-2xl"
                                >
                                    💬 تواصل مع الحسابات
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100">
                        <h3 className="text-2xl font-black mb-8 text-slate-800">تحميل المستندات الرسمية</h3>
                        <div className="space-y-4">
                            {['شهادة ضريبة القيمة المضافة', 'السجل التجاري للشركة', 'شهادة الحساب البنكي'].map((doc, idx) => (
                                <button key={idx} className="w-full p-6 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-slate-900 hover:text-white transition-all group font-black">
                                    <span className="text-sm">{doc}</span>
                                    <DocumentTextIcon className="w-5 h-5 text-gray-300 group-hover:text-secondary" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
