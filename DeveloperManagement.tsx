import React, { useState } from 'react';

export default function DeveloperManagement() {
  const [logs, setLogs] = useState([
    { id: 1, action: 'تحديث واجهة المستخدم', user: 'المطور الرئيسي', time: 'منذ 10 دقائق', status: 'ناجح' },
    { id: 2, action: 'مزامنة قاعدة البيانات', user: 'النظام الآلي', time: 'منذ ساعة', status: 'ناجح' },
    { id: 3, action: 'فحص أمان دوري', user: 'نظام الحماية', time: 'منذ 3 ساعات', status: 'ناجح' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-[#1a3a1a]">غرفة عمليات المطور</h3>
        <div className="flex gap-2">
          <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg">
            نشر التحديثات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a3a1a] p-8 rounded-[3rem] text-white shadow-2xl">
          <h4 className="text-lg font-black mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            حالة النظام الحالية
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white/60">إصدار التطبيق</span>
              <span className="text-sm font-black">v2.4.0 (Stable)</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white/60">زمن الاستجابة</span>
              <span className="text-sm font-black text-emerald-400">42ms</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white/60">حالة السيرفر</span>
              <span className="text-sm font-black text-emerald-400">متصل (Online)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h4 className="text-lg font-black text-[#1a3a1a] mb-6">سجل العمليات التقنية</h4>
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#1a3a1a]">{log.action}</p>
                    <p className="text-[10px] font-bold text-gray-400">{log.user} • {log.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h4 className="text-xl font-black text-[#1a3a1a] mb-8">أدوات التحكم المتقدمة</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-[#1a3a1a] hover:text-white transition-all group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <p className="text-xs font-black">الإعدادات العميقة</p>
          </button>
          <button className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-[#1a3a1a] hover:text-white transition-all group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🛡️</div>
            <p className="text-xs font-black">جدار الحماية</p>
          </button>
          <button className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-[#1a3a1a] hover:text-white transition-all group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💾</div>
            <p className="text-xs font-black">نسخ احتياطي</p>
          </button>
          <button className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-[#1a3a1a] hover:text-white transition-all group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧹</div>
            <p className="text-xs font-black">تنظيف الكاش</p>
          </button>
        </div>
      </div>
    </div>
  );
}
