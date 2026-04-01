import { Link } from "wouter";
import { Phone, Mail, MapPin, Globe } from "lucide-react";

const LOGO_URL = "/logo.jpg";

const branches = [
  { city: "جدة", phone: "0507204443 / 0565618377" },
  { city: "مكة المكرمة", phone: "0567494146" },
  { city: "الرياض", phone: "0546936055" },
  { city: "الدمام", phone: "0546936055" },
  { city: "المدينة المنورة", phone: "0500881295" },
  { city: "أبها", phone: "0503605199" },
];

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: "#0F3A18" }}>
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column with official logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <img
                  src={LOGO_URL}
                  alt="Delta Stars Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div>
                <div
                  className="font-black text-xl text-white leading-tight"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  نجوم دلتا
                </div>
                <div
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ fontFamily: "'Lato', sans-serif", color: "#6AB04C" }}
                >
                  Delta Stars
                </div>
              </div>
            </div>
            <p
              className="text-white/70 text-sm leading-relaxed mb-6"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              شريّكك الأمثل لتوريد وتوزيع الفواكه والخضروات عالية الجودة في المملكة العربية السعودية.
            </p>
            {/* ISO badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold mb-5"
              style={{ backgroundColor: "rgba(106,176,76,0.2)", border: "1px solid rgba(106,176,76,0.4)", color: "#a8e063" }}
            >
              ✓ ISO 22000:2018 Certified
            </div>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/966558828002"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="mailto:info@deltastars-ksa.com"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#3D8B37" }}
              >
                <Mail size={16} />
              </a>
              <a
                href="tel:+966232049200"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "#1A5C2A" }}
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/products", label: "منتجاتنا" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#6AB04C" }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
              معلومات التواصل
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0" style={{ color: "#6AB04C" }} />
                <div>
                  <p className="text-white/60 text-xs mb-0.5" style={{ fontFamily: "'Tajawal', sans-serif" }}>الأرضي</p>
                  <a href="tel:+966232049200" className="text-white text-sm hover:text-green-300 transition-colors" dir="ltr">+966 23204 9200</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0" style={{ color: "#6AB04C" }} />
                <div>
                  <p className="text-white/60 text-xs mb-0.5" style={{ fontFamily: "'Tajawal', sans-serif" }}>المبيعات / واتساب</p>
                  <a href="tel:+966558828002" className="text-white text-sm hover:text-green-300 transition-colors" dir="ltr">+966 55882 8002</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0" style={{ color: "#6AB04C" }} />
                <div>
                  <p className="text-white/60 text-xs mb-0.5" style={{ fontFamily: "'Tajawal', sans-serif" }}>البريد الإلكتروني</p>
                  <a href="mailto:info@deltastars-ksa.com" className="text-white text-sm hover:text-green-300 transition-colors">info@deltastars-ksa.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={15} className="mt-0.5 shrink-0" style={{ color: "#6AB04C" }} />
                <div>
                  <p className="text-white/60 text-xs mb-0.5" style={{ fontFamily: "'Tajawal', sans-serif" }}>الموقع الإلكتروني</p>
                  <a href="https://deltastars-ksa.com" target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-green-300 transition-colors">deltastars-ksa.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Branches */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
              فروعنا في المملكة
            </h3>
            <div className="space-y-3">
              {branches.map((branch) => (
                <div key={branch.city} className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "#6AB04C" }} />
                  <div>
                    <span className="text-white text-sm font-semibold" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {branch.city}
                    </span>
                    <p className="text-white/55 text-xs" dir="ltr">{branch.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="DS" className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5" />
            <p className="text-white/50 text-xs" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              © {new Date().getFullYear()} شركة نجوم دلتا للتجارة — جميع الحقوق محفوظة
            </p>
          </div>
          <p className="text-white/40 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
            ISO 22000:2018 | Saudi Arabia
          </p>
        </div>
      </div>
    </footer>
  );
}
