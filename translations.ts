
export type Translation = { [key: string]: any };

export const translations: { [key: string]: Translation } = {
  ar: {
    common: {
      currency: "ر.س",
      loading: "جاري التحميل...",
      error: "حدث خطأ ما، يرجى المحاولة لاحقاً",
      save: "حفظ الإعدادات",
      cancel: "إلغاء العملية",
      delete: "حذف نهائي",
      confirm: "تأكيد الطلب",
      back: "الرجوع",
      search: "ابحث عن منتجك المفضل...",
      id: "رقم المرجع",
      status: "الحالة الحالية",
      date: "تاريخ العملية",
      amount: "القيمة الإجمالية",
      actions: "خيارات التحكم",
      view: "استعراض التفاصيل",
      edit: "تحديث البيانات",
      all: "كافة الأصناف",
      ok: "موافق",
      close: "إغلاق النافذة",
      add: "إضافة صنف",
      update: "تحديث المخزون",
      unit: "الوحدة",
      price: "السعر",
      total: "الإجمالي"
    },
    header: {
      storeName: "نجوم دلتا",
      storeTitle: "نجوم دلتا | الجودة من المزرعة للمائدة",
      utility: {
        install: "تثبيت التطبيق",
        version: "إصدار التوريد المتميز v31.0"
      },
      navLinks: {
        home: "الرئيسية",
        products: "سوق المنتجات",
        showroom: "صالة العرض",
        wishlist: "المفضلة",
        dashboard: "لوحة التحكم",
        vipPortal: "بوابة الشركات",
        trackOrder: "تتبع شحنتك",
        oday: "مساعد عُدي",
        privacy: "سياسة الخصوصية",
        terms: "الشروط والأحكام",
        returns: "سياسة الإرجاع",
        driverDashboard: "لوحة المندوب"
      }
    },
    checkout: {
      minOrderError: "عذراً، الحد الأدنى للطلب هو 50 ريال لضمان كفاءة التوريد والجودة.",
      phoneStep: "التحقق من رقم الجوال",
      phonePlaceholder: "05XXXXXXXX",
      sendCode: "إرسال كود التحقق",
      otpStep: "تأكيد الهوية الرقمية",
      otpPlaceholder: "أدخل الكود",
      verifyCode: "تأكيد والتحقق",
      addressStep: "بيانات الموقع والتسليم التفصيلية",
      city: "المدينة / المنطقة",
      district: "الحي السكني",
      street: "اسم الشارع الرئيسي / الفرعي",
      locationType: "نوع السكن / المقر",
      house: "منزل / فيلا مستقلة",
      mall: "مركز تجاري / مول",
      market: "سوق / محل تجاري",
      buildingName: "اسم العمارة / رقم المبنى",
      unitNumber: "رقم الشقة / المكتب / المعرض",
      paymentStep: "خيار السداد والتحصيل المالي",
      onlinePayment: "بطاقة ائتمانية (فيزا / مدى / ماستركارد)",
      cod: "الدفع عند الاستلام (نقدي للمندوب)",
      completeOrder: "إتمام الطلب النهائي",
      securityNote: "✓ نظام حماية المشتري مفعّل - طلب حقيقي موثق رقمياً"
    },
    home: {
      hero: {
        quality_badge: "الجودة العالمية في متناول يدك",
        button: "دخول المتجر",
        vipButton: "بوابة الشركات",
        slogan: "شريكك الأمثل"
      },
      categories: {
        title: "أقسامنا المتخصصة",
        subtitle: "وحدات استراتيجية متخصصة لضمان أعلى معايير التوريد"
      },
      partners: {
        title: "( نحن نقدر ثقتكم )",
        badge: "شركاء الجودة والتميز المؤسسي",
        subtitle: "نفخر بخدمة نخبة من كبرى المنشآت الوطنية والعالمية في المملكة"
      },
      lounges: {
        title: "مجتمعات نجوم دلتا",
        subtitle: "تواصل مباشر وحصري لأحدث العروض اليومية",
        whatsapp: {
          title: "مجتمع واتساب",
          desc: "كن أول من يعلم عن وصول الشحنات الجديدة والعروض الحصرية مباشرة على جوالك.",
          button: "انضم الآن"
        },
        telegram: {
          title: "قناة تيليجرام",
          desc: "تغطية مرئية يومية للمنتجات الطازجة ومعايير الجودة من قلب المستودعات.",
          button: "متابعة القناة"
        }
      }
    },
    dashboard: {
      title: "نظام التحكم القيادي",
      subtitle: "شركة نجوم دلتا للتجارة",
      stats: {
        sales: "إجمالي المبيعات المحققة",
        lowStock: "أصناف تحتاج إعادة توريد",
        pending: "طلبات بانتظار الاعتماد"
      },
      sections: {
        admin: { title: "الإدارة العامة والمحاسبة", desc: "التقارير المالية والقرارات السيادية" },
        marketing: { title: "قسم التسويق والأسعار", desc: "العروض والمنتجات وإدارة الأسعار" },
        ops: { title: "العمليات واللوجستيات", desc: "تتبع الأسطول والمخزون الحي" },
        dev: { title: "ركن المطور", desc: "تعديل الأكواد والأنظمة الأمنية" }
      }
    },
    categories: {
      fruits: "فواكة",
      vegetables: "خضروات",
      herbs: "ورقيات",
      qassim: "منتجات القصيم",
      dates: "تمور",
      packages: "مغلفات",
      seasonal: "منتجات موسمية",
      nuts: "مكسرات",
      flowers: "الورود والهدايا"
    },
    products: {
      title: "سوق المنتجات الطازجة",
      subtitle: "نختار لك الأجود من المزارع الوطنية والعالمية بعناية فائقة",
      searchPlaceholder: "ما الذي تبحث عنه اليوم؟",
      noResults: "لم نجد نتائج مطابقة لطلبك",
      allCategories: "كافة الأقسام",
      sort: {
        default: "الترتيب الافتراضي",
        priceAsc: "السعر: من الأقل للأعلى",
        priceDesc: "السعر: من الأعلى للأقل"
      }
    },
    cart: {
      title: "سلة المشتريات",
      empty: "سلتك فارغة حالياً، ابدأ بالتسوق الآن",
      clear: "تفريغ السلة",
      continueShopping: "مواصلة التسوق",
      summary: "ملخص الطلبية والمحاسبة",
      items_value: "قيمة المنتجات",
      vat: "ضريبة القيمة المضافة (15%)",
      checkout_online: "دفع إلكتروني آمن",
      checkout_bank: "تحويل بنكي رسمي",
      checkout: {
          successTitle: "تم استلام طلبك بنجاح",
          successSubtitle: "فريقنا اللوجستي يقوم الآن بتجهيز طلبك بأعلى معايير الجودة",
          orderId: "رقم طلبك المرجعي",
          whatsappConfirmation: "تأكيد عبر واتساب",
          backToStore: "العودة للمتجر",
          whatsappConfirmationMessage: "مرحباً نجوم دلتا، أود تأكيد طلبي رقم {{orderId}} بقيمة {{formattedTotal}}."
      }
    },
    auth: {
      otp: {
        sentToEmail: "تم إرسال كود التحقق إلى <b>{{email}}</b>",
        placeholder: "أدخل الكود هنا",
        verify: "التحقق من الهوية",
        generatingCode: "جاري توليد الكود الآمن...",
        invalidCode: "الكود غير صحيح",
        successTitle: "تم تحديث كلمة المرور",
        successSubtitle: "يمكنك الآن استخدام كلمة المرور الجديدة للدخول للنظام",
        passwordLengthError: "كلمة المرور قصيرة جداً"
      },
      createNewPassword: "إنشاء كلمة مرور جديدة",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      changePasswordButton: "حفظ وتعديل",
      passwordMismatch: "كلمات المرور غير متطابقة"
    }
  },
  en: {
    common: {
      currency: "SAR",
      loading: "Processing...",
      error: "An error occurred, please try again",
      save: "Save Changes",
      cancel: "Cancel",
      delete: "Delete",
      confirm: "Confirm",
      back: "Go Back",
      search: "Search for premium products...",
      id: "Reference ID",
      status: "Current Status",
      date: "Process Date",
      amount: "Total Amount",
      actions: "Control Options",
      view: "View Details",
      edit: "Edit Data",
      all: "All Categories",
      ok: "OK",
      close: "Close Window",
      add: "Add Item",
      update: "Update Inventory",
      unit: "Unit",
      price: "Price",
      total: "Total"
    },
    header: {
      storeName: "Deltastars",
      storeTitle: "Delta Stars | Quality from Farm to Table",
      utility: {
        install: "Install App",
        version: "Elite Supply Node v31.0"
      },
      navLinks: {
        home: "Home",
        products: "Market",
        showroom: "Showroom",
        wishlist: "Wishlist",
        dashboard: "Command Center",
        vipPortal: "B2B Portal",
        trackOrder: "Track Order",
        oday: "Oday AI",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions",
        returns: "Return Policy",
        driverDashboard: "Driver Portal"
      }
    },
    checkout: {
      minOrderError: "Sorry, minimum order is 50 SAR to ensure supply quality and integrity.",
      phoneStep: "Phone Verification",
      phonePlaceholder: "05XXXXXXXX",
      sendCode: "Send Verification Code",
      otpStep: "Digital Identity Confirmation",
      otpPlaceholder: "Enter Code",
      verifyCode: "Verify & Confirm",
      addressStep: "Detailed Location & Delivery Info",
      city: "City / Region",
      district: "District",
      street: "Main / Sub Street Name",
      locationType: "Location Type",
      house: "House / Private Villa",
      mall: "Shopping Mall",
      market: "Public Market / Shop",
      buildingName: "Building Name / No.",
      unitNumber: "Apt / Office / Shop No.",
      paymentStep: "Payment & Financial Collection",
      onlinePayment: "Credit Card (Visa / Mada / MC)",
      cod: "Cash on Delivery (Cash to Agent)",
      completeOrder: "Finalize Order",
      securityNote: "✓ Buyer Protection Active - Digitally Verified Real Order"
    },
    home: {
      hero: {
        quality_badge: "Global Quality at Your Fingertips",
        button: "Enter Market",
        vipButton: "Corporate Portal",
        slogan: "Your Perfect Partner"
      },
      categories: {
        title: "Specialized Units",
        subtitle: "Strategic Supply Modules Ensuring Highest Standards"
      },
      partners: {
        title: "( We Value Your Trust )",
        badge: "Quality & Institutional Excellence Partners",
        subtitle: "Proudly serving elite national and international establishments in KSA"
      },
      lounges: {
        title: "Delta Stars Communities",
        subtitle: "Direct and Exclusive Access to Daily Offers",
        whatsapp: {
          title: "WhatsApp Community",
          desc: "Be the first to know about new shipments and exclusive offers directly on your phone.",
          button: "Join Now"
        },
        telegram: {
          title: "Telegram Channel",
          desc: "Daily visual coverage of fresh products and quality standards from the heart of our warehouses.",
          button: "Follow Channel"
        }
      }
    },
    dashboard: {
      title: "Command Center",
      subtitle: "Delta Stars Trading Co.",
      stats: {
        sales: "Total Realized Sales",
        lowStock: "Items Needing Restock",
        pending: "Orders Awaiting Approval"
      },
      sections: {
        admin: { title: "Admin & Accounting", desc: "Financial Reports & Sovereign Decisions" },
        marketing: { title: "Marketing & Pricing", desc: "Promotions, Products & Price Management" },
        ops: { title: "Operations & Logistics", desc: "Fleet Tracking & Live Inventory" },
        dev: { title: "Developer Console", desc: "Code Updates & Security Systems" }
      }
    },
    categories: {
      fruits: "Fruits",
      vegetables: "Vegetables",
      herbs: "Herbs",
      qassim: "Qassim Products",
      dates: "Dates",
      packages: "Packages",
      seasonal: "Seasonal Products",
      nuts: "Nuts",
      flowers: "Flowers & Gifts"
    },
    products: {
      title: "Fresh Products Market",
      subtitle: "We select the best from national and international farms with extreme care",
      searchPlaceholder: "What are you looking for today?",
      noResults: "No results matching your request",
      allCategories: "All Categories",
      sort: {
        default: "Default Sort",
        priceAsc: "Price: Low to High",
        priceDesc: "Price: High to Low"
      }
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty, start shopping now",
      clear: "Clear Cart",
      continueShopping: "Continue Shopping",
      summary: "Order & Accounting Summary",
      items_value: "Products Value",
      vat: "VAT (15%)",
      checkout_online: "Secure Online Payment",
      checkout_bank: "Official Bank Transfer",
      checkout: {
          successTitle: "Order Received Successfully",
          successSubtitle: "Our logistics team is now preparing your order with the highest quality standards",
          orderId: "Your Order Reference",
          whatsappConfirmation: "Confirm via WhatsApp",
          backToStore: "Back to Market",
          whatsappConfirmationMessage: "Hello Delta Stars, I want to confirm my order #{{orderId}} with total {{formattedTotal}}."
      }
    },
    auth: {
      otp: {
        sentToEmail: "Verification code sent to <b>{{email}}</b>",
        placeholder: "Enter code here",
        verify: "Verify Identity",
        generatingCode: "Generating secure code...",
        invalidCode: "Invalid code provided",
        successTitle: "Password Updated",
        successSubtitle: "You can now use your new password to access the system",
        passwordLengthError: "Password is too short"
      },
      createNewPassword: "Create New Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      changePasswordButton: "Save & Apply",
      passwordMismatch: "Passwords do not match"
    }
  }
};
