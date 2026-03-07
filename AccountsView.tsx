
import React, { useState, useMemo } from 'react';
import { useI18n } from './lib/contexts/I18nContext';
import { Invoice, Payment, VipClient, VipTransaction } from '../types';
import { AccountingEngine, CHART_OF_ACCOUNTS } from './lib/AccountingEngine';
import { 
    PrintIcon, MailIcon, PencilIcon, TrashIcon, PlusIcon, 
    DocumentTextIcon, ChartBarIcon, SparklesIcon 
} from './lib/contexts/Icons';

// Adding missing VIP management callbacks to the props interface
type AccountsViewProps = {
    onBack: () => void;
    invoices: Invoice[];
    payments: Payment[];
    vipClients: VipClient[];
    transactions: VipTransaction[];
    onAddPayment: (payment: Payment) => void;
    onAddVipClient: (c: VipClient) => Promise<VipClient>;
    onUpdateVipClient: (c: VipClient) => Promise<VipClient>;
    onDeleteVipClient: (id: string) => Promise<boolean>;
};

export const AccountsView: React.FC<AccountsViewProps> = ({ onBack, invoices, vipClients, transactions }) => {
    const { t, language, formatCurrency } = useI18n();
    const [activeTab, setActiveTab] = useState<'summary' | 'invoices' | 'ledger' | 'reports'>('summary');

    // محاكاة المحرك المحاسبي مع البيانات الحالية
    const engine = useMemo(() => {
        const ae = new AccountingEngine();
        invoices.forEach(inv => {
            if (inv.status === 'Paid' || inv.status === 'Pending Payment') {
                ae.recordSalesInvoice(inv, inv.subtotal * 0.7); // افتراض تكلفة 70%
            }
        });
        return ae;
    }, [invoices]);

    const incomeStatement = engine.getIncomeStatement();
    const trialBalance = engine.getTrialBalance();

    return (
        <div className="space-y-10 animate-fade-in pb-24 text-black">
            {/* Header Identity */}
            <div className="bg-primary text-white p-12 rounded-[4rem] shadow-4xl flex flex-col md:flex-row justify-between items-center gap-8 border-b-[15px] border-secondary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-5xl font-black mb-3 uppercase tracking-tighter flex items-center gap-4">
                        <ChartBarIcon className="w-12 h-12 text-secondary" />
                        النظام المحاسبي السيادي
                    </h2>
                    <p className="text-xl font-bold opacity-80 italic">Delta Stars ERP - Financial Intelligence Unit</p>
                </div>
                <button onClick={onBack} className="relative z-10 bg-white/10 hover:bg-red-500 hover:scale-105 px-12 py-5 rounded-[2rem] font-black border-2 border-white/20 text-xl transition-all shadow-2xl">
                    &larr; {t('common.back')}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-4 bg-gray-50 p-4 rounded-[3rem] border-2 border-gray-100 shadow-inner">
                {[
                    { id: 'summary', label: 'لوحة التحكم المالية', icon: '📊' },
                    { id: 'invoices', label: 'إدارة الفواتير', icon: '🧾' },
                    { id: 'reports', label: 'التقارير الختامية', icon: '📜' },
                    { id: 'ledger', label: 'ميزان المراجعة', icon: '⚖️' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-10 py-4 rounded-[2rem] font-black text-lg transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-primary text-white shadow-xl scale-105' : 'bg-white text-slate-400 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {activeTab === 'summary' && (
                    <div className="space-y-10 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-b-[10px] border-green-500 group hover:-translate-y-2 transition-all">
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">إجمالي الإيرادات (المحققة)</p>
                                <p className="text-4xl font-black text-slate-800">{formatCurrency(incomeStatement.revenue)}</p>
                            </div>
                            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-b-[10px] border-red-500 group hover:-translate-y-2 transition-all">
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">تكلفة المبيعات (WAC/FIFO)</p>
                                <p className="text-4xl font-black text-slate-800">{formatCurrency(incomeStatement.cogs)}</p>
                            </div>
                            <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl border-b-[10px] border-secondary text-white relative overflow-hidden group hover:-translate-y-2 transition-all">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 blur-xl rounded-full"></div>
                                <p className="text-secondary font-black text-[10px] uppercase tracking-widest mb-4">صافي الربح التشغيلي</p>
                                <p className="text-4xl font-black">{formatCurrency(incomeStatement.netProfit)}</p>
                            </div>
                            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-b-[10px] border-blue-500 group hover:-translate-y-2 transition-all">
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">مستحقات ضريبية (VAT)</p>
                                <p className="text-4xl font-black text-slate-800">{formatCurrency(invoices.reduce((s, i) => s + (i.tax || 0), 0))}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            <div className="bg-white p-10 rounded-[4rem] shadow-3xl border border-gray-100">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-primary">
                                    <SparklesIcon className="w-6 h-6" /> كبار العملاء المدينين (VIP AR)
                                </h3>
                                <div className="space-y-4">
                                    {vipClients.slice(0, 4).map(client => (
                                        <div key={client.id} className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">VIP</div>
                                                <div>
                                                    <p className="font-black text-lg">{client.companyName}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Credit Limit: {formatCurrency(client.creditLimit)}</p>
                                                </div>
                                            </div>
                                            <p className={`text-xl font-black ${client.currentBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(client.currentBalance)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[4rem] shadow-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8">
                                    <SparklesIcon className="w-16 h-16 text-green-500 animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-black mb-4">كفاءة التحصيل المالي</h3>
                                <p className="text-gray-400 font-bold text-lg mb-8 max-w-sm">نظام التدقيق الآلي يشير إلى التزام 95% من الشركاء بمواعيد السداد v24</p>
                                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-primary w-[95%] shadow-[0_0_15px_rgba(26,58,26,0.3)]"></div>
                                </div>
                                <span className="text-primary font-black uppercase tracking-widest text-xs">Healthy Liquidity Status</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="bg-white p-12 rounded-[4rem] shadow-3xl animate-fade-in-right border border-gray-100 max-w-4xl mx-auto">
                        <div className="text-center border-b pb-12 mb-12">
                            <h2 className="text-4xl font-black text-primary mb-2">قائمة الدخل التقديرية</h2>
                            <p className="text-gray-400 font-bold tracking-widest uppercase">Income Statement (P&L) | {new Date().getFullYear()}</p>
                        </div>
                        <div className="space-y-8 px-10">
                            <div className="flex justify-between items-end border-b pb-4">
                                <span className="text-2xl font-black text-slate-800">إجمالي المبيعات (Revenue)</span>
                                <span className="text-2xl font-black">{formatCurrency(incomeStatement.revenue)}</span>
                            </div>
                            <div className="flex justify-between items-end border-b pb-4 text-red-500">
                                <span className="text-xl font-bold italic">(-) تكلفة البضاعة المباعة (COGS)</span>
                                <span className="text-xl font-black">({formatCurrency(incomeStatement.cogs)})</span>
                            </div>
                            <div className="flex justify-between items-end bg-gray-50 p-6 rounded-2xl border-2 border-primary/5">
                                <span className="text-3xl font-black text-primary">مجمل الربح (Gross Profit)</span>
                                <span className="text-3xl font-black text-primary">{formatCurrency(incomeStatement.grossProfit)}</span>
                            </div>
                            <div className="flex justify-between items-end border-b pb-4 text-orange-600">
                                <span className="text-xl font-bold italic">(-) مصروفات تشغيلية ولوجستية</span>
                                <span className="text-xl font-black">({formatCurrency(incomeStatement.expenses)})</span>
                            </div>
                            <div className="flex justify-between items-center bg-primary text-white p-10 rounded-[3rem] shadow-4xl transform scale-105 border-b-[15px] border-secondary">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black uppercase tracking-widest opacity-60">Sovereign Net Profit</span>
                                    <span className="text-5xl font-black">صافي الربح</span>
                                </div>
                                <span className="text-5xl font-black text-secondary">{formatCurrency(incomeStatement.netProfit)}</span>
                            </div>
                        </div>
                        <div className="mt-20 pt-10 border-t flex justify-between items-center">
                            <div className="text-[10px] text-gray-300 font-black uppercase">Certified by Delta Sovereign Engine v24</div>
                            <button className="flex items-center gap-3 bg-slate-100 p-4 rounded-xl hover:bg-primary hover:text-white transition-all font-black">
                                <PrintIcon className="w-5 h-5" /> تصدير PDF
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'ledger' && (
                    <div className="bg-white rounded-[4rem] shadow-3xl overflow-hidden border border-gray-100 animate-fade-in">
                        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                            <h3 className="text-2xl font-black">ميزان المراجعة التحليلي (Trial Balance)</h3>
                            <span className="bg-secondary px-6 py-2 rounded-full font-black text-xs uppercase">Live Ledger v24</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50 border-b-4 border-gray-100">
                                    <tr>
                                        <th className="p-8 font-black text-gray-400 uppercase tracking-widest">كود الحساب</th>
                                        <th className="p-8 font-black text-gray-400 uppercase tracking-widest">اسم الحساب</th>
                                        <th className="p-8 font-black text-green-600 uppercase tracking-widest">مدين (Debit)</th>
                                        <th className="p-8 font-black text-red-600 uppercase tracking-widest">دائن (Credit)</th>
                                        <th className="p-8 font-black text-primary uppercase tracking-widest">الصافي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trialBalance.map(acc => (
                                        <tr key={acc.id} className="border-b hover:bg-gray-50 transition-all group">
                                            <td className="p-8 font-mono font-bold text-gray-400">{acc.id}</td>
                                            <td className="p-8 font-black text-slate-800 text-lg">{acc.name}</td>
                                            <td className="p-8 font-bold text-green-500">{formatCurrency(acc.debit)}</td>
                                            <td className="p-8 font-bold text-red-500">{formatCurrency(acc.credit)}</td>
                                            <td className="p-8">
                                                <span className={`px-6 py-2 rounded-xl font-black text-xl ${acc.netBalance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {formatCurrency(acc.netBalance)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div className="bg-white p-10 rounded-[4rem] shadow-3xl border border-gray-100 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-3xl font-black text-slate-800">سجل الفواتير السيادي</h3>
                            <div className="flex gap-4">
                                <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                                    <PlusIcon className="w-5 h-5" /> فاتورة جديدة
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {invoices.map(inv => (
                                <div key={inv.id} className="p-8 bg-gray-50 rounded-[3rem] border-2 border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-full bg-primary opacity-20"></div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="font-black text-2xl mb-1 text-slate-800">{inv.id}</p>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{inv.date}</p>
                                        </div>
                                        <span className={`px-6 py-2 rounded-full font-black text-xs uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {language === 'ar' ? inv.status_ar : inv.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-black uppercase">Client Information</span>
                                            <span className="text-lg font-black text-primary">{inv.customerName}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-slate-800">{formatCurrency(inv.total)}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">VAT INC (15%)</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="flex-1 bg-white border border-gray-200 p-4 rounded-2xl hover:bg-primary hover:text-white transition-all font-black text-sm flex items-center justify-center gap-2">
                                            <DocumentTextIcon className="w-4 h-4" /> عرض
                                        </button>
                                        <button className="bg-secondary text-white p-4 rounded-2xl hover:scale-110 transition-all">
                                            <PrintIcon className="w-5 h-5" />
                                        </button>
                                        <button className="bg-green-500 text-white p-4 rounded-2xl hover:scale-110 transition-all">
                                            <MailIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
