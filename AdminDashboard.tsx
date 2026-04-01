import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "wouter";
import {
  Plus, Edit2, Trash2, Search, X, Save, Eye, EyeOff,
  Package, BarChart2, LogOut, AlertTriangle, Download,
  RefreshCw, Settings, TrendingUp, Users, ShoppingCart,
  CheckCircle, XCircle, Filter, Star, Phone, Mail
} from "lucide-react";
import { allProducts, categories, type ProductCategory, type Product } from "@/data/products";
import { toast } from "sonner";
import { getAllCustomers, getAllTransactions, getCustomerStats, addTransaction, type Customer, type Transaction } from "@/lib/customers";

const LOGO_URL = "/logo.jpg";

const categoryColors: Record<ProductCategory, string> = {
  "خضروات محلية": "#1A5C2A",
  "خضروات مستوردة": "#2E7D32",
  "فطر": "#6B4226",
  "فواكه محلية": "#E07B39",
  "فواكه مستوردة": "#C0392B",
  "تمور": "#8B4513",
  "أعشاب وورقيات": "#3D8B37",
  "سلال وصناديق": "#1565C0",
};

// ===== Login Screen =====
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    import("@/lib/auth").then(({ verifyAdminPassword, createAdminSession }) => {
      if (verifyAdminPassword(password)) {
        createAdminSession();
        onLogin();
      } else {
        setError("كلمة المرور غير صحيحة");
        setTimeout(() => setError(""), 3000);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f3a18 0%, #1A5C2A 50%, #3D8B37 100%)" }}>
      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl p-3" style={{ backgroundColor: "#f0faf0" }}>
              <img src={LOGO_URL} alt="Delta Stars" className="w-20 h-20 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1A5C2A" }}>لوحة تحكم المطور</h1>
          <p className="text-sm text-gray-500">Delta Stars — إدارة المنتجات</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "#1A5C2A" }}>كلمة المرور</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="أدخل كلمة المرور..."
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{ border: `2px solid ${error ? "#ef4444" : "#d1e7d1"}`, fontFamily: "'Cairo', sans-serif" }}
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={12} />{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl text-white font-black text-base transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A5C2A, #3D8B37)" }}
          >
            دخول
          </button>
        </div>

        <div className="mt-6 p-3 rounded-xl text-xs text-center" style={{ backgroundColor: "#f0faf0", color: "#1A5C2A" }}>
          🔒 للدخول الأول: استخدم كلمة المرور التي أعطاك إياها المطور
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm font-medium" style={{ color: "#6AB04C" }}>
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}

// ===== Product Form Modal =====
function ProductModal({
  product,
  onSave,
  onClose,
}: {
  product: Partial<Product> | null;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const isNew = !product?.id;
  const [form, setForm] = useState<Partial<Product>>(
    product || { inStock: true, category: "خضروات محلية", unit: "كجم", price: 0 }
  );

  const handleSave = () => {
    if (!form.nameAr || !form.nameEn || !form.category) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    onSave({
      id: form.id || Date.now(),
      nameAr: form.nameAr!,
      nameEn: form.nameEn!,
      price: Number(form.price) || 0,
      unit: form.unit || "كجم",
      category: form.category!,
      image: form.image || "/logo.jpg",
      inStock: form.inStock ?? true,
      origin: form.origin,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="p-6 border-b" style={{ borderColor: "#e8f5e9" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black" style={{ color: "#1A5C2A" }}>
              {isNew ? "إضافة منتج جديد" : "تعديل المنتج"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Image preview */}
          {form.image && (
            <div className="flex justify-center">
              <img
                src={form.image}
                alt="preview"
                className="w-24 h-24 object-cover rounded-2xl border-2"
                style={{ borderColor: "#d1e7d1" }}
                onError={e => { (e.target as HTMLImageElement).src = LOGO_URL; }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>الاسم بالعربية *</label>
              <input
                type="text"
                value={form.nameAr || ""}
                onChange={e => setForm({ ...form, nameAr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
                placeholder="مثال: طماطم طازجة"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>الاسم بالإنجليزية *</label>
              <input
                type="text"
                value={form.nameEn || ""}
                onChange={e => setForm({ ...form, nameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "2px solid #d1e7d1" }}
                placeholder="e.g. Fresh Tomatoes"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>السعر (ريال)</label>
              <input
                type="number"
                value={form.price || 0}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "2px solid #d1e7d1" }}
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>الوحدة</label>
              <select
                value={form.unit || "كجم"}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
              >
                {["كجم", "حزمة", "حبة", "صندوق", "سلة", "3 كجم"].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>الفئة *</label>
            <select
              value={form.category || "خضروات محلية"}
              onChange={e => setForm({ ...form, category: e.target.value as ProductCategory })}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>رابط الصورة</label>
            <input
              type="text"
              value={form.image || ""}
              onChange={e => setForm({ ...form, image: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ border: "2px solid #d1e7d1" }}
              placeholder="https://..."
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>المصدر / الأصل</label>
              <input
                type="text"
                value={form.origin || ""}
                onChange={e => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
                placeholder="مثال: محلي، مستورد، القصيم"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>الحالة</label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setForm({ ...form, inStock: true })}
                  className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{
                    backgroundColor: form.inStock ? "#1A5C2A" : "white",
                    color: form.inStock ? "white" : "#1A5C2A",
                    border: "2px solid #1A5C2A"
                  }}
                >
                  متوفر
                </button>
                <button
                  onClick={() => setForm({ ...form, inStock: false })}
                  className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{
                    backgroundColor: !form.inStock ? "#ef4444" : "white",
                    color: !form.inStock ? "white" : "#ef4444",
                    border: "2px solid #ef4444"
                  }}
                >
                  غير متوفر
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex gap-3" style={{ borderColor: "#e8f5e9" }}>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-white font-black flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1A5C2A, #3D8B37)" }}
          >
            <Save size={16} />
            {isNew ? "إضافة المنتج" : "حفظ التعديلات"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold transition-all hover:bg-gray-100"
            style={{ border: "2px solid #e5e7eb", color: "#6b7280" }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Main Dashboard =====
export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productList, setProductList] = useState<Product[]>([...allProducts]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "الكل">("الكل");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "stats" | "customers" | "settings">("products");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<Transaction[]>([]);
  const [addTxModal, setAddTxModal] = useState(false);
  const [txForm, setTxForm] = useState({ type: "purchase" as Transaction["type"], amount: "", description: "" });
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "outOfStock">("all");

  const filtered = useMemo(() => {
    let list = [...productList];
    if (selectedCategory !== "الكل") list = list.filter(p => p.category === selectedCategory);
    if (stockFilter === "inStock") list = list.filter(p => p.inStock);
    if (stockFilter === "outOfStock") list = list.filter(p => !p.inStock);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    }
    return list.sort((a, b) => Number(a.id) - Number(b.id));
  }, [productList, search, selectedCategory, stockFilter]);

  const exportCSV = useCallback(() => {
    const headers = ["#", "الاسم عربي", "الاسم انجليزي", "الفئة", "السعر", "الوحدة", "المصدر", "الحالة"];
    const rows = productList.map(p => [
      p.id, p.nameAr, p.nameEn, p.category, p.price, p.unit, p.origin || "", p.inStock ? "متوفر" : "غير متوفر"
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "DeltaStars-Products.csv"; a.click();
    toast.success("تم تصدير الكتالوج بنجاح!");
  }, [productList]);

  const toggleAllStock = useCallback((inStock: boolean) => {
    setProductList(prev => prev.map(p => ({ ...p, inStock })));
    toast.success(inStock ? "تم تفعيل جميع المنتجات" : "تم إيقاف جميع المنتجات");
  }, []);

  const handleSave = (product: Product) => {
    setProductList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        toast.success(`تم تحديث "${product.nameAr}" بنجاح`);
        return prev.map(p => p.id === product.id ? product : p);
      } else {
        toast.success(`تم إضافة "${product.nameAr}" بنجاح`);
        return [...prev, product];
      }
    });
    setEditingProduct(undefined);
  };

  const handleDelete = (id: number) => {
    const product = productList.find(p => p.id === id);
    setProductList(prev => prev.filter(p => p.id !== id));
    toast.success(`تم حذف "${product?.nameAr}" بنجاح`);
    setDeleteConfirm(null);
  };

  // تحميل بيانات العملاء
  useEffect(() => {
    if (activeTab === "customers") {
      setCustomers(getAllCustomers());
    }
  }, [activeTab]);

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setCustomerTransactions(getAllTransactions().filter(t => t.customerId === c.id));
  };

  const handleAddTransaction = () => {
    if (!selectedCustomer || !txForm.amount || !txForm.description) return;
    addTransaction(selectedCustomer.id, txForm.type, parseFloat(txForm.amount), txForm.description);
    setCustomers(getAllCustomers());
    const updated = getAllCustomers().find(c => c.id === selectedCustomer.id);
    if (updated) {
      setSelectedCustomer(updated);
      setCustomerTransactions(getAllTransactions().filter(t => t.customerId === updated.id));
    }
    setTxForm({ type: "purchase", amount: "", description: "" });
    setAddTxModal(false);
    toast.success("تمت إضافة العملية بنجاح");
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const stats = {
    total: productList.length,
    inStock: productList.filter(p => p.inStock).length,
    outOfStock: productList.filter(p => !p.inStock).length,
    categories: categories.length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0F4F8", fontFamily: "'Cairo', sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: "#1A5C2A" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-1.5">
              <img src={LOGO_URL} alt="DS" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-tight">لوحة تحكم المطور</h1>
              <p className="text-green-200 text-xs">Delta Stars — إدارة شاملة ومتقدمة</p>
            </div>
          </div>
          {/* Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-xl p-1">
            {([
              { id: "products", label: "المنتجات", icon: <Package size={14}/> },
              { id: "customers", label: "العملاء", icon: <Users size={14}/> },
              { id: "stats", label: "إحصائيات", icon: <BarChart2 size={14}/> },
              { id: "settings", label: "إعدادات", icon: <Settings size={14}/> },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  color: activeTab === tab.id ? "#1A5C2A" : "rgba(255,255,255,0.8)"
                }}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-all">
              <Eye size={14} />
              عرض المتجر
            </Link>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-all"
            >
              <Download size={14} />
              تصدير CSV
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/80 text-white text-sm font-bold hover:bg-red-500 transition-all"
            >
              <LogOut size={14} />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "إجمالي المنتجات", value: stats.total, icon: "📦", color: "#1A5C2A" },
            { label: "متوفر", value: stats.inStock, icon: "✅", color: "#16a34a" },
            { label: "غير متوفر", value: stats.outOfStock, icon: "❌", color: "#ef4444" },
            { label: "الفئات", value: stats.categories, icon: "🏷️", color: "#1565C0" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-lg mb-4" style={{ color: "#1A5C2A" }}>توزيع المنتجات حسب الفئة</h3>
              {categories.map(cat => {
                const count = productList.filter(p => p.category === cat).length;
                const pct = Math.round((count / productList.length) * 100);
                return (
                  <div key={cat} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: "#1A5C2A", fontFamily: "'Cairo', sans-serif" }}>{cat}</span>
                      <span className="font-bold" style={{ color: "#3D8B37" }}>{count} منتج ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: "#e8f5e9" }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1A5C2A, #6AB04C)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-lg mb-4" style={{ color: "#1A5C2A" }}>ملخص المتجر</h3>
              <div className="space-y-4">
                {[
                  { label: "إجمالي المنتجات", value: productList.length, icon: "📦" },
                  { label: "متوفر", value: productList.filter(p => p.inStock).length, icon: "✅" },
                  { label: "غير متوفر", value: productList.filter(p => !p.inStock).length, icon: "❌" },
                  { label: "عدد الفئات", value: categories.length, icon: "🏷️" },
                  { label: "متوسط السعر", value: `${(productList.filter(p=>p.price>0).reduce((s,p)=>s+p.price,0)/productList.filter(p=>p.price>0).length).toFixed(1)} ر.س`, icon: "💰" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#f0faf0" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium" style={{ color: "#4a6a4a" }}>{item.label}</span>
                    </div>
                    <span className="font-black text-lg" style={{ color: "#1A5C2A" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* قائمة العملاء */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b" style={{ borderColor: "#e8f5e9" }}>
                <h3 className="font-black text-base" style={{ color: "#1A5C2A" }}>العملاء ({customers.length})</h3>
                <input
                  type="text"
                  placeholder="بحث..."
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
                />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {customers.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">لا يوجد عملاء مسجلين بعد</div>
                ) : (
                  customers
                    .filter(c => !customerSearch || c.name.includes(customerSearch) || c.phone.includes(customerSearch))
                    .map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCustomer(c)}
                      className="w-full text-right p-4 border-b hover:bg-green-50 transition-colors"
                      style={{ borderColor: "#f0f0f0", backgroundColor: selectedCustomer?.id === c.id ? "#f0faf0" : undefined }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm" style={{ color: "#1A5C2A" }}>{c.name}</p>
                          <p className="text-xs text-gray-500">{c.phone}</p>
                          {c.company && <p className="text-xs text-gray-400">{c.company}</p>}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-bold ${c.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {c.balance >= 0 ? "+" : ""}{c.balance.toLocaleString("ar-SA")}
                          </p>
                          <p className="text-xs text-gray-400">ر.ي</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* تفاصيل العميل */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm">
              {!selectedCustomer ? (
                <div className="p-12 text-center text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>اختر عميلاً من القائمة لعرض تفاصيله</p>
                </div>
              ) : (
                <div>
                  {/* رأس بطاقة العميل */}
                  <div className="p-6 border-b" style={{ borderColor: "#e8f5e9", background: "linear-gradient(135deg, #f0faf0, #e8f5e9)" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black" style={{ color: "#1A5C2A" }}>{selectedCustomer.name}</h3>
                        {selectedCustomer.company && <p className="text-gray-600 text-sm">{selectedCustomer.company}</p>}
                        <p className="text-gray-500 text-sm mt-1">هاتف: {selectedCustomer.phone}</p>
                        {selectedCustomer.email && <p className="text-gray-500 text-sm">بريد: {selectedCustomer.email}</p>}
                        <p className="text-gray-400 text-xs mt-2">انضم في: {new Date(selectedCustomer.createdAt).toLocaleDateString("ar-SA")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">الرصيد</p>
                        <p className={`text-3xl font-black ${selectedCustomer.balance >= 0 ? "text-green-700" : "text-red-600"}`}>
                          {selectedCustomer.balance >= 0 ? "+" : ""}{selectedCustomer.balance.toLocaleString("ar-SA")}
                        </p>
                        <p className="text-xs text-gray-400">ر.ي</p>
                        <p className="text-xs mt-1" style={{ color: selectedCustomer.balance >= 0 ? "#16a34a" : "#dc2626" }}>
                          {selectedCustomer.balance >= 0 ? "✅ دائن" : "⚠️ مديونية"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { label: "إجمالي المشتريات", value: `${selectedCustomer.totalPurchases.toLocaleString("ar-SA")} ر.ي` },
                        { label: "عدد العمليات", value: customerTransactions.length },
                        { label: "آخر دخول", value: new Date(selectedCustomer.lastLogin).toLocaleDateString("ar-SA") },
                      ].map(item => (
                        <div key={item.label} className="bg-white rounded-xl p-3 text-center">
                          <p className="font-bold text-sm" style={{ color: "#1A5C2A" }}>{item.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setAddTxModal(true)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #1A5C2A, #3D8B37)" }}
                    >
                      <Plus size={14} />
                      إضافة عملية
                    </button>
                  </div>

                  {/* سجل العمليات */}
                  <div className="p-4 overflow-y-auto" style={{ maxHeight: "40vh" }}>
                    <h4 className="font-bold text-sm mb-3" style={{ color: "#1A5C2A" }}>سجل العمليات</h4>
                    {customerTransactions.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-4">لا توجد عمليات</p>
                    ) : (
                      customerTransactions.map(t => (
                        <div key={t.id} className="flex justify-between items-center p-3 mb-2 rounded-xl" style={{ backgroundColor: "#f8f9fa" }}>
                          <div>
                            <p className="text-sm font-medium">{t.description}</p>
                            <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString("ar-SA")} — #{t.invoiceNumber}</p>
                          </div>
                          <p className={`font-bold text-sm ${t.type === "purchase" || t.type === "debit" ? "text-red-600" : "text-green-600"}`}>
                            {t.type === "purchase" || t.type === "debit" ? "-" : "+"}{t.amount.toLocaleString("ar-SA")} ر.ي
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* نافذة إضافة عملية */}
        {addTxModal && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <h3 className="text-xl font-black mb-4" style={{ color: "#1A5C2A" }}>إضافة عملية لـ {selectedCustomer.name}</h3>
              <div className="space-y-4">
                <select
                  value={txForm.type}
                  onChange={e => setTxForm({ ...txForm, type: e.target.value as Transaction["type"] })}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
                >
                  <option value="purchase">مشتريات (تخصم من الرصيد)</option>
                  <option value="payment">دفعة (يضاف للرصيد)</option>
                  <option value="credit">إضافة رصيد</option>
                  <option value="debit">خصم رصيد</option>
                </select>
                <input
                  type="number"
                  placeholder="المبلغ (ر.ي)"
                  value={txForm.amount}
                  onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "2px solid #d1e7d1" }}
                  min="0"
                />
                <input
                  type="text"
                  placeholder="الوصف / البيان"
                  value={txForm.description}
                  onChange={e => setTxForm({ ...txForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 py-3 rounded-xl text-white font-bold"
                  style={{ background: "linear-gradient(135deg, #1A5C2A, #3D8B37)" }}
                >حفظ</button>
                <button
                  onClick={() => setAddTxModal(false)}
                  className="px-6 py-3 rounded-xl font-bold"
                  style={{ border: "2px solid #e5e7eb", color: "#6b7280" }}
                >إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-lg mb-4" style={{ color: "#1A5C2A" }}>إدارة المخزون</h3>
              <div className="space-y-3">
                <button
                  onClick={() => toggleAllStock(true)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-white font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
                >
                  <CheckCircle size={20} />
                  تفعيل جميع المنتجات (متوفر)
                </button>
                <button
                  onClick={() => toggleAllStock(false)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-white font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ef4444, #f87171)" }}
                >
                  <XCircle size={20} />
                  إيقاف جميع المنتجات (غير متوفر)
                </button>
                <button
                  onClick={exportCSV}
                  className="w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #1565C0, #1976D2)", color: "white" }}
                >
                  <Download size={20} />
                  تصدير الكتالوج كملف CSV
                </button>
                <button
                  onClick={() => { setProductList([...allProducts]); toast.success("تم إعادة تعيين المنتجات للبيانات الأصلية"); }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #92400e, #b45309)", color: "white" }}
                >
                  <RefreshCw size={20} />
                  إعادة تعيين البيانات الأصلية
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-lg mb-4" style={{ color: "#1A5C2A" }}>معلومات التواصل</h3>
              <div className="space-y-3">
                {[
                  { icon: <Phone size={16}/>, label: "واتساب", value: "0558828002", href: "https://wa.me/966558828002" },
                  { icon: <Mail size={16}/>, label: "بريد إلكتروني", value: "info@deltastars.sa", href: "mailto:info@deltastars.sa" },
                ].map(item => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-80"
                    style={{ backgroundColor: "#f0faf0", color: "#1A5C2A" }}
                  >
                    {item.icon}
                    <div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="font-bold text-sm">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "#f0faf0" }}>
                <p className="text-xs font-bold mb-1" style={{ color: "#1A5C2A" }}>🔐 الأمان</p>
                <p className="text-sm" style={{ color: "#4a6a4a" }}>كلمة المرور محمية ومشفرة — لا تظهر في أي مكان</p>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar - Products Tab Only */}
        {activeTab === "products" && (
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث..."
                className="pr-9 pl-3 py-2 rounded-xl text-sm outline-none w-48"
                style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif" }}
              />
            </div>
            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as ProductCategory | "الكل")}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif", color: "#1A5C2A" }}
            >
              <option value="الكل">جميع الفئات</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {/* Stock filter */}
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value as "all" | "inStock" | "outOfStock")}
              className="px-3 py-2 rounded-xl text-sm outline-none"
              style={{ border: "2px solid #d1e7d1", fontFamily: "'Cairo', sans-serif", color: "#1A5C2A" }}
            >
              <option value="all">جميع الحالات</option>
              <option value="inStock">متوفر فقط</option>
              <option value="outOfStock">غير متوفر فقط</option>
            </select>
            <span className="text-sm text-gray-500">{filtered.length} منتج</span>
          </div>

          <button
            onClick={() => setEditingProduct(null)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all hover:opacity-90 shadow-md"
            style={{ background: "linear-gradient(135deg, #1A5C2A, #3D8B37)" }}
          >
            <Plus size={16} />
            إضافة منتج جديد
          </button>
        </div>
        )}

        {/* Products Table - Products Tab Only */}
        {activeTab === "products" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#f0faf0" }}>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>#</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>الصورة</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>الاسم</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>الفئة</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>السعر</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>الوحدة</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>المصدر</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>الحالة</th>
                  <th className="px-4 py-3 text-right font-black text-xs" style={{ color: "#1A5C2A" }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr
                    key={`${product.id}`}
                    className="border-t transition-colors hover:bg-green-50/30"
                    style={{ borderColor: "#f0faf0" }}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{product.id}</td>
                    <td className="px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.nameAr}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = LOGO_URL; }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-black text-sm" style={{ color: "#1A5C2A" }}>{product.nameAr}</div>
                      <div className="text-xs text-gray-400">{product.nameEn}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-lg text-white text-xs font-bold"
                        style={{ backgroundColor: categoryColors[product.category] }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-sm" style={{ color: "#1A5C2A" }}>
                      {product.price > 0 ? `${product.price} ر.س` : <span className="text-gray-400 text-xs">اتصل</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{product.unit}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{product.origin || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: product.inStock ? "#dcfce7" : "#fee2e2",
                          color: product.inStock ? "#16a34a" : "#ef4444"
                        }}
                      >
                        {product.inStock ? "متوفر" : "غير متوفر"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 rounded-xl hover:bg-blue-50 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 size={14} style={{ color: "#2563EB" }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(Number(product.id))}
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={14} style={{ color: "#ef4444" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      {/* Product Modal */}
      {editingProduct !== undefined && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setEditingProduct(undefined)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-black mb-2" style={{ color: "#1A5C2A" }}>تأكيد الحذف</h3>
            <p className="text-gray-500 mb-6" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl text-white font-black bg-red-500 hover:bg-red-600 transition-all"
              >
                نعم، احذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                style={{ border: "2px solid #e5e7eb", color: "#6b7280" }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
