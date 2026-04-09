// @ts-nocheck
/**
 * Delta Stars Sovereign Constants v75.0
 * يتم تخزين كافة الروابط الثابتة للهوية البصرية هنا لضمان ديمومتها.
 */

const getThumb = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

export const COMPANY_INFO = {
    name: "نجوم دلتا للتجارة",
    name_en: "Delta Stars Trading",
    slogan: "شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة",
    slogan_en: "Your Ideal Partner for High-Quality Vegetables, Fruits & Dates",
    phone: "00966920023204",
    whatsapp: "00966558828009",
    email: "INFO@DELTASTARS-KSA.COM",
    website: "https://deltastars.store",
    admin_email: "deltastars777@gmail.com",
    marketing_email: "marketing@deltastars-ksa.com",
    developer_email: "vipservicesyemen@outlook.sa",
    address: "المملكة العربية السعودية، جدة، شارع المنار",
    map_url: "https://maps.app.goo.gl/ZHoiZKmkuj4no2vg8",
    logo_url: getThumb("1NNENjClCwzrb-xxUdDyT2W7hH22NG3C1"), 
    wide_banner_url: getThumb("1wK2o57aJXCLzoZtLMzDME7BQbJm4-Z8e"),
    partners_url: getThumb("1CRZwMRmKNFx9GtNhWYYGxmRkZ8dZPXJk"), // صورة نحن نقدر ثقتكم (المعدلة والدائمة)
    bank: {
        name: "البنك العربي الوطني",
        branch: "الرحاب",
        branch_code: "0202",
        account_name: "شركة نجوم دلتا للتجارة",
        account_number: "0108095516770029",
        iban: "SA4730400108095516770029"
    }
};

export const SOCIAL_LINKS = {
    whatsapp_community: "https://chat.whatsapp.com/J1mZCFjYprmFHveSyTjpMw",
    instagram: "https://www.instagram.com/deltastars7",
    tiktok: "https://vm.tiktok.com/ZSH7p6tYpvBof-1se5K/",
    twitter_x: "https://x.com/DeltaStars4352",
    facebook: "https://www.facebook.com/share/1DNx4PiyLU/",
    youtube: "https://youtube.com/@deltastars1",
    linktree: "https://linktr.ee/deltastar6",
    snapchat: "https://www.snapchat.com/add/deltastars25",
    telegram_channel: "https://t.me/deltastars1"
};

// الأيقونات المتخصصة المرفوعة من العميل - ثابتة ودائمة
export const CATEGORY_ICONS = {
    vegetables: getThumb("1X7Dx44sE2u9sg6Y7JRiF-Lysde0Po3aw"),
    fruits: getThumb("1Z6Z9j4LDb-AO7Oht434f51OdtSd-Pr7C"),
    herbs: getThumb("1L1xtlAZBq1zAoeMCvPciBHWn1iq-XmK7"),
    dates: getThumb("1ybK8hgqbsTa3nEeABVMPu_CghlR4LlCq"),
    qassim: getThumb("1ygHtcN_IZZn9h5bWxkcgUYFx2NKBwV8O"),
    packages: getThumb("1TMRsT2A59Cf2R-DMiQKSdbHpjGTywlO5"),
    seasonal: getThumb("1cltZrcmcrfoSujfLxttvbw_WGOhokH1s"),
    nuts: getThumb("198nfibYeKNTz3q1ndTdnOh0uw8etRn12"),
    flowers: getThumb("1hOA1amN2-KnX24zrAj09Ldt8gnf563k0"),
    custom: getThumb("1ybK8hgqbsTa3nEeABVMPu_CghlR4LlCq")
};

export const INSTITUTIONAL_VERIFICATION = [
    { title_ar: "رقم الفرع", title_en: "Branch No", number: "0202", icon: getThumb("1U7xsX4hQ0S9Zm3ufKZboOUtK0_yUeiQI") },
    { title_ar: "رقم الهوية", title_en: "ID No", number: "4030457293", icon: getThumb("1qcymBEeKErTZTCejW_A2EvaOoc0-XPx8") },
    { title_ar: "رقم الحساب", title_en: "Account No", number: "0108095516770029", icon: getThumb("1lJTkTukmIvpmGFgu9m6JCNwfSgztLGbW") },
    { title_ar: "رقم الآيبان", title_en: "IBAN", number: "SA4730400108095516770029", icon: getThumb("1BtHReESbyrDpZyrGswslwGVRJp0ywDc-") }
];

export const PRODUCT_UNITS: ProductUnit[] = [
    { code: 'G', name_ar: 'جرام', name_en: 'Gram', base_factor: 1 },
    { code: 'KG', name_ar: 'كيلو', name_en: 'Kilogram', base_factor: 1000 },
    { code: '500G', name_ar: '500 جرام', name_en: '500 Grams', base_factor: 500 },
    { code: 'BUNCH', name_ar: 'حزمة', name_en: 'Bunch', base_factor: 250 },
    { code: 'PACK', name_ar: 'باكت', name_en: 'Pack', base_factor: 1000 }
];

export const COMPANY_DOCS = [
    { id: 'doc1', title_ar: 'السجل التجاري', title_en: 'Commercial Register', drive_id: '1ZhiuIawZC6SPEf91tXR2lfZM4jo10JDY', icon_url: 'https://cdn-icons-png.flaticon.com/512/3503/3503827.png' },
    { id: 'doc2', title_ar: 'شهادة ضريبية', title_en: 'VAT Certificate', drive_id: '12mBYsWHZuQgHLu0DF6ddQnK4Tkwm60ON', icon_url: 'https://cdn-icons-png.flaticon.com/512/3503/3503827.png' }
];

export const BRANCH_LOCATIONS = [
    { 
        id: 1, 
        name_ar: "فرع جدة الرئيسي", 
        name_en: "Jeddah Main Branch", 
        lat: 21.5678, 
        lng: 39.2238,
        address_ar: "شارع المنار، جدة",
        address_en: "Al Manar St, Jeddah"
    },
    { 
        id: 2, 
        name_ar: "فرع الرياض", 
        name_en: "Riyadh Branch", 
        lat: 24.7136, 
        lng: 46.6753,
        address_ar: "طريق الملك فهد، الرياض",
        address_en: "King Fahd Rd, Riyadh"
    },
    { 
        id: 3, 
        name_ar: "فرع مكة المكرمة", 
        name_en: "Makkah Branch", 
        lat: 21.3891, 
        lng: 39.8579,
        address_ar: "حي العزيزية، مكة",
        address_en: "Al Aziziyah, Makkah"
    },
    { 
        id: 4, 
        name_ar: "فرع المدينة المنورة", 
        name_en: "Madinah Branch", 
        lat: 24.4672, 
        lng: 39.6068,
        address_ar: "المدينة المنورة",
        address_en: "Madinah"
    },
    { 
        id: 5, 
        name_ar: "فرع الدمام", 
        name_en: "Dammam Branch", 
        lat: 26.4207, 
        lng: 50.0888,
        address_ar: "الدمام",
        address_en: "Dammam"
    },
    { 
        id: 6, 
        name_ar: "فرع أبها", 
        name_en: "Abha Branch", 
        lat: 18.2164, 
        lng: 42.5053,
        address_ar: "أبها",
        address_en: "Abha"
    }
];