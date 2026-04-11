import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Building, FileText, DollarSign, CreditCard, Bell, Download } from 'lucide-react';

interface CorporateAccount {
  id: string;
  company_name_ar: string;
  credit_limit: number;
  current_balance: number;
  payment_terms: number;
}

export const CorporateDashboard: React.FC<{ corporateId: string }> = ({ corporateId }) => {
  const [account, setAccount] = useState<CorporateAccount | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: acc } = await supabase
        .from('corporate_accounts')
        .select('*')
        .eq('id', corporateId)
        .single();
      setAccount(acc);

      const { data: inv } = await supabase
        .from('corporate_invoices')
        .select('*')
        .eq('corporate_id', corporateId)
        .order('due_date', { ascending: true });
      setInvoices(inv || []);
      setLoading(false);
    };
    loadData();
  }, [corporateId]);

  const handlePrintInvoice = (invoice: any) => {
    window.open(`/api/invoices/${invoice.id}/print`, '_blank');
  };

  if (loading) return <div className="animate-pulse">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      {/* بطاقة الحساب */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black">{account?.company_name_ar}</h2>
            <p className="text-white/70 text-sm">حساب تجاري</p>
          </div>
          <Building className="w-12 h-12 text-white/30" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-white/50 text-xs">الحد الائتماني</p>
            <p className="text-2xl font-bold">{account?.credit_limit?.toLocaleString()} ر.س</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">الرصيد الحالي</p>
            <p className="text-2xl font-bold text-secondary">{account?.current_balance?.toLocaleString()} ر.س</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">فترة السداد</p>
            <p className="font-bold">{account?.payment_terms} يوم</p>
          </div>
        </div>
      </div>

      {/* الفواتير */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> الفواتير</h3>
          <button className="text-primary text-sm font-bold">تصدير PDF</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="p-4 text-right">رقم الفاتورة</th><th>تاريخ الاستحقاق</th><th>المبلغ</th><th>الحالة</th><th></th></tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td className="p-4 font-mono">{inv.invoice_number}</td>
                  <td className="p-4">{new Date(inv.due_date).toLocaleDateString('ar-SA')}</td>
                  <td className="p-4 font-bold">{inv.total_amount.toLocaleString()} ر.س</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {inv.status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handlePrintInvoice(inv)} className="text-primary">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* تذكير بالمدفوعات المستحقة */}
      {invoices.some(i => i.status === 'unpaid' && new Date(i.due_date) < new Date()) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
          <Bell className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-bold text-yellow-800">تنبيه: مدفوعات مستحقة</p>
            <p className="text-sm text-yellow-700">لديك فواتير غير مدفوعة تجاوزت تاريخ الاستحقاق</p>
          </div>
        </div>
      )}
    </div>
  );
};
