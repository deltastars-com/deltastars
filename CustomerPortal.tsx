/**
 * Delta Stars - بوابة العملاء المميزين
 * حسابات معزولة ومستقلة - تسجيل برقم الهاتف + OTP
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  generateOTP,
  verifyOTP,
  getCustomerByPhone,
  registerCustomer,
  createCustomerSession,
  getCurrentCustomer,
  logoutCustomer,
  getCustomerTransactions,
  type Customer,
  type Transaction,
} from "@/lib/customers";

type PortalStep = "phone" | "otp" | "register" | "dashboard";

export default function CustomerPortal() {
  const [step, setStep] = useState<PortalStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(""); // للعرض في وضع التطوير
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "profile">("overview");

  useEffect(() => {
    const current = getCurrentCustomer();
    if (current) {
      setCustomer(current);
      setTransactions(getCustomerTransactions(current.id));
      setStep("dashboard");
    }
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error("رقم الهاتف غير صحيح");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const existing = getCustomerByPhone(phone);
    const generatedOtp = generateOTP(phone);
    setDevOtp(generatedOtp); // للعرض في وضع التطوير

    if (existing) {
      toast.success("تم إرسال رمز التحقق إلى هاتفك");
      setStep("otp");
    } else {
      toast.info("رقم جديد — يرجى إكمال التسجيل");
      setStep("register");
    }
    setLoading(false);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (verifyOTP(phone, otp)) {
      const existing = getCustomerByPhone(phone);
      if (existing) {
        createCustomerSession(existing.id);
        setCustomer(existing);
        setTransactions(getCustomerTransactions(existing.id));
        setStep("dashboard");
        toast.success(`مرحباً ${existing.name}!`);
      }
    } else {
      toast.error("رمز التحقق غير صحيح");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("يرجى إدخال الاسم");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = registerCustomer(phone, name, company, email);
    if (result.success && result.customer) {
      createCustomerSession(result.customer.id);
      setCustomer(result.customer);
      setTransactions([]);
      setStep("dashboard");
      toast.success("تم إنشاء حسابك بنجاح! مرحباً بك في نجوم دلتا");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    setStep("phone");
    setPhone("");
    setOtp("");
    toast.info("تم تسجيل الخروج");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${Math.abs(amount).toLocaleString("ar-SA")} ر.ي`;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* الهيدر */}
      <header className="bg-green-800 text-white py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_square.jpg" alt="Delta Stars" className="w-10 h-10 rounded-lg object-contain bg-white p-0.5" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Delta Stars</h1>
              <p className="text-green-200 text-xs">بوابة العملاء المميزين</p>
            </div>
          </div>
          {customer && (
            <button onClick={handleLogout} className="text-green-200 hover:text-white text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              خروج
            </button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* خطوة: إدخال رقم الهاتف */}
        {step === "phone" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h2>
                <p className="text-gray-500 mt-2">أدخل رقم هاتفك للدخول أو إنشاء حساب جديد</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <Input
                  type="tel"
                  placeholder="رقم الهاتف (مثال: 7XXXXXXXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="text-center h-14 text-lg border-2 border-gray-200 focus:border-green-500 tracking-wider"
                  maxLength={15}
                  required
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={loading || phone.length < 9}
                  className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-base rounded-xl"
                >
                  {loading ? "جارٍ التحقق..." : "متابعة"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <p className="text-xs text-green-800 text-center">
                  🔒 حسابك معزول وآمن — لا يمكن لأي عميل آخر الاطلاع على بياناتك
                </p>
              </div>
            </div>
          </div>
        )}

        {/* خطوة: رمز التحقق OTP */}
        {step === "otp" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">رمز التحقق</h2>
                <p className="text-gray-500 mt-2">تم إرسال رمز مكون من 6 أرقام إلى</p>
                <p className="text-green-700 font-bold text-lg">{phone}</p>
                {devOtp && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-700">وضع التطوير — الرمز: <strong className="text-amber-900 text-base">{devOtp}</strong></p>
                  </div>
                )}
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <Input
                  type="text"
                  placeholder="أدخل الرمز"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center h-14 text-2xl tracking-[0.5em] border-2 border-gray-200 focus:border-green-500"
                  maxLength={6}
                  required
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl"
                >
                  {loading ? "جارٍ التحقق..." : "تأكيد"}
                </Button>
                <button type="button" onClick={() => setStep("phone")} className="w-full text-center text-gray-500 text-sm hover:text-gray-700">
                  ← تغيير رقم الهاتف
                </button>
              </form>
            </div>
          </div>
        )}

        {/* خطوة: تسجيل عميل جديد */}
        {step === "register" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">إنشاء حساب جديد</h2>
                <p className="text-gray-500 mt-1">مرحباً بك في عائلة نجوم دلتا</p>
                {devOtp && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-700">رمز التحقق: <strong>{devOtp}</strong></p>
                  </div>
                )}
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  placeholder="الاسم الكامل *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                  required
                />
                <Input
                  type="text"
                  placeholder="اسم الشركة / المؤسسة (اختياري)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني (اختياري)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-right h-12 border-2 border-gray-200 focus:border-green-500"
                />
                <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                  رقم الهاتف: <strong>{phone}</strong>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl"
                >
                  {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
                </Button>
                <button type="button" onClick={() => setStep("phone")} className="w-full text-center text-gray-500 text-sm hover:text-gray-700">
                  ← العودة
                </button>
              </form>
            </div>
          </div>
        )}

        {/* لوحة تحكم العميل */}
        {step === "dashboard" && customer && (
          <div className="space-y-6">
            {/* بطاقة الترحيب */}
            <div className="bg-gradient-to-l from-green-700 to-green-900 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">مرحباً،</p>
                  <h2 className="text-2xl font-bold">{customer.name}</h2>
                  {customer.company && <p className="text-green-200 text-sm mt-1">{customer.company}</p>}
                  <p className="text-green-300 text-xs mt-2">📱 {customer.phone}</p>
                </div>
                <div className="text-left">
                  <p className="text-green-200 text-xs">الرصيد الحالي</p>
                  <p className={`text-3xl font-bold ${customer.balance >= 0 ? "text-green-200" : "text-red-300"}`}>
                    {customer.balance >= 0 ? "+" : ""}{formatCurrency(customer.balance)}
                  </p>
                  <p className="text-green-300 text-xs mt-1">
                    {customer.balance >= 0 ? "✅ رصيد دائن" : "⚠️ مديونية"}
                  </p>
                </div>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-green-700">{transactions.length}</p>
                <p className="text-gray-500 text-xs mt-1">إجمالي العمليات</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(customer.totalPurchases)}</p>
                <p className="text-gray-500 text-xs mt-1">إجمالي المشتريات</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-amber-600">
                  {new Date(customer.lastLogin).toLocaleDateString("ar-SA")}
                </p>
                <p className="text-gray-500 text-xs mt-1">آخر دخول</p>
              </div>
            </div>

            {/* التبويبات */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b">
                {[
                  { id: "overview", label: "نظرة عامة" },
                  { id: "transactions", label: "سجل العمليات" },
                  { id: "profile", label: "الملف الشخصي" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-green-700 border-b-2 border-green-700 bg-green-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* نظرة عامة */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-800">آخر العمليات</h3>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p>لا توجد عمليات بعد</p>
                      </div>
                    ) : (
                      transactions.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{t.description}</p>
                            <p className="text-gray-400 text-xs mt-1">{formatDate(t.date)}</p>
                            <p className="text-gray-400 text-xs"># {t.invoiceNumber}</p>
                          </div>
                          <div className="text-left">
                            <p className={`font-bold ${t.type === "purchase" || t.type === "debit" ? "text-red-600" : "text-green-600"}`}>
                              {t.type === "purchase" || t.type === "debit" ? "-" : "+"}{formatCurrency(t.amount)}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              t.type === "purchase" ? "bg-blue-100 text-blue-700" :
                              t.type === "payment" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {t.type === "purchase" ? "مشتريات" : t.type === "payment" ? "دفعة" : t.type === "credit" ? "إضافة" : "خصم"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="text-center mt-4">
                      <a href="https://wa.me/967733691903" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        تواصل مع الإدارة
                      </a>
                    </div>
                  </div>
                )}

                {/* سجل العمليات */}
                {activeTab === "transactions" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800">جميع العمليات</h3>
                    {transactions.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">لا توجد عمليات</p>
                    ) : (
                      transactions.map((t) => (
                        <div key={t.id} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">{t.description}</p>
                              <p className="text-gray-400 text-xs mt-1">{formatDate(t.date)}</p>
                              <p className="text-gray-400 text-xs font-mono">#{t.invoiceNumber}</p>
                              {t.products && t.products.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {t.products.map((p, i) => (
                                    <p key={i} className="text-xs text-gray-500">
                                      • {p.name} × {p.qty} = {formatCurrency(p.price * p.qty)}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-left ml-4">
                              <p className={`font-bold text-lg ${t.type === "purchase" || t.type === "debit" ? "text-red-600" : "text-green-600"}`}>
                                {t.type === "purchase" || t.type === "debit" ? "-" : "+"}{formatCurrency(t.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* الملف الشخصي */}
                {activeTab === "profile" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-800">معلومات الحساب</h3>
                    <div className="space-y-3">
                      {[
                        { label: "الاسم", value: customer.name },
                        { label: "رقم الهاتف", value: customer.phone },
                        { label: "الشركة", value: customer.company || "—" },
                        { label: "البريد الإلكتروني", value: customer.email || "—" },
                        { label: "تاريخ الانضمام", value: new Date(customer.createdAt).toLocaleDateString("ar-SA") },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-500 text-sm">{item.label}</span>
                          <span className="font-medium text-gray-800 text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 mt-4"
                    >
                      تسجيل الخروج
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
