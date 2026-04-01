# دليل النشر والتشغيل الشامل — Delta Stars Store v4.0

## معلومات التطبيق
- **الاسم:** Delta Stars Store — نجوم دلتا للفواكه والخضروات
- **الإصدار:** 4.0
- **Package:** com.deltastars.store
- **كلمة مرور لوحة التحكم:** DeltaStars@2024

---

## 1. الوصول للوحة تحكم المطور

### من الموقع/التطبيق:
- انقر على زر **"لوحة التحكم"** في الهيدر العلوي (أيقونة ⚙️)
- أو اذهب مباشرة إلى: `https://your-domain.com/admin`

### الصلاحيات المتاحة في لوحة التحكم:
| الصلاحية | الوصف |
|---|---|
| إضافة منتجات | إضافة منتجات جديدة مع صورة وسعر وفئة |
| تعديل المنتجات | تعديل أي بيانات لأي منتج موجود |
| حذف المنتجات | حذف منتجات مع تأكيد |
| فلترة المخزون | تفعيل/إيقاف المنتجات بشكل جماعي |
| تصدير CSV | تصدير كتالوج المنتجات كملف Excel |
| إحصائيات | عرض توزيع المنتجات والإحصائيات |
| إعدادات | إدارة المخزون الجماعي وإعادة التعيين |

---

## 2. تشغيل الموقع على الكمبيوتر (Windows/Mac/Linux)

### المتطلبات:
- Node.js 18+ 
- pnpm

### خطوات التشغيل:
```bash
# 1. فك ضغط الكود المصدري
unzip DeltaStars-FullSource-v4.0.zip -d deltastars-store

# 2. الدخول للمجلد
cd deltastars-store

# 3. تثبيت المكتبات
pnpm install

# 4. تشغيل وضع التطوير
pnpm dev

# 5. أو بناء للإنتاج
pnpm build
```

### للنشر على استضافة:
```bash
pnpm build
# ارفع محتوى مجلد dist/public/ إلى استضافتك
```

---

## 3. تثبيت تطبيق Android (APK)

### خطوات التثبيت:
1. انقل ملف `DeltaStars-Store-v4.0.apk` إلى هاتفك
2. افتح **الإعدادات** → **الأمان** → فعّل **"مصادر غير معروفة"**
3. افتح ملف APK من مدير الملفات
4. اضغط **"تثبيت"**
5. بعد التثبيت اضغط **"فتح"**

### الحد الأدنى:
- Android 7.0 (API 24) أو أحدث
- مساحة تخزين: ~20 MB

---

## 4. تطبيق iOS

### المتطلبات للبناء:
- جهاز Mac مع macOS 12+
- Xcode 14+
- حساب Apple Developer (99$/سنة)

### خطوات البناء:
```bash
# 1. تثبيت المكتبات
pnpm install

# 2. بناء الموقع
pnpm build

# 3. مزامنة Capacitor
npx cap sync ios

# 4. فتح في Xcode
npx cap open ios

# 5. في Xcode: Product → Archive → Distribute App
```

---

## 5. تطبيق Windows (Electron)

### خطوات البناء:
```bash
# 1. الدخول لمجلد electron
cd electron-app

# 2. تثبيت المكتبات
npm install

# 3. بناء التطبيق
npm run build-win

# ملف الإخراج: dist/DeltaStars-Store-Setup.exe
```

---

## 6. هيكل الملفات المهمة

```
deltastars-store/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          ← الصفحة الرئيسية
│   │   │   ├── Products.tsx      ← صفحة المنتجات (235 منتج)
│   │   │   ├── About.tsx         ← من نحن
│   │   │   ├── Contact.tsx       ← تواصل معنا
│   │   │   └── AdminDashboard.tsx ← لوحة تحكم المطور
│   │   ├── components/
│   │   │   ├── Header.tsx        ← الهيدر مع زر لوحة التحكم
│   │   │   ├── Footer.tsx        ← الفوتر
│   │   │   ├── AdiAssistant.tsx  ← المساعد الذكي عدي
│   │   │   └── ProductCard.tsx   ← بطاقة المنتج
│   │   └── data/
│   │       └── products.ts       ← قاعدة بيانات 235 منتج
│   └── public/
│       ├── logo.jpg              ← شعار Delta Stars
│       ├── sw.js                 ← Service Worker
│       └── manifest.json         ← PWA Manifest
├── android/                      ← مشروع Android (Capacitor)
├── ios/                          ← مشروع iOS (Capacitor)
└── capacitor.config.ts           ← إعدادات Capacitor
```

---

## 7. التحديثات التلقائية

تم تفعيل **Service Worker** الذي يقوم بـ:
- تخزين الموقع مؤقتاً للعمل بدون إنترنت
- تحديث المحتوى تلقائياً عند توفر إصدار جديد
- إشعار المستخدم بوجود تحديث جديد

---

## 8. معلومات التواصل

- **واتساب:** 0558828002
- **البريد الإلكتروني:** info@deltastars.sa
- **الموقع:** deltastars-niq9iih3.manus.space
