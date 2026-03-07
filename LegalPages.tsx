
import React from 'react';
import { useI18n } from './lib/contexts/I18nContext';
import { ShieldCheckIcon, FileTextIcon, RefreshCcwIcon } from './lib/contexts/Icons';

interface LegalPageProps {
    type: 'privacy' | 'terms' | 'returns';
}

export const LegalPages: React.FC<LegalPageProps> = ({ type }) => {
    const { language } = useI18n();

    const content = {
        privacy: {
            title_ar: 'سياسة الخصوصية',
            title_en: 'Privacy Policy',
            icon: <ShieldCheckIcon className="w-16 h-16 text-primary" />,
            sections_ar: [
                {
                    h: 'جمع المعلومات',
                    p: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو إتمام الطلب، بما في ذلك الاسم، رقم الجوال، والعنوان.'
                },
                {
                    h: 'استخدام البيانات',
                    p: 'تستخدم بياناتك لتحسين تجربة التسوق، معالجة الطلبات، والتواصل معك بشأن تحديثات الخدمة.'
                },
                {
                    h: 'حماية البيانات',
                    p: 'نلتزم بتطبيق أعلى معايير الأمان الرقمي لحماية بياناتك من الوصول غير المصرح به وفقاً لأنظمة المملكة العربية السعودية.'
                }
            ],
            sections_en: [
                {
                    h: 'Information Collection',
                    p: 'We collect information you provide directly to us when registering or placing an order, including name, mobile number, and address.'
                },
                {
                    h: 'Data Usage',
                    p: 'Your data is used to improve your shopping experience, process orders, and communicate with you regarding service updates.'
                },
                {
                    h: 'Data Protection',
                    p: 'We are committed to applying the highest digital security standards to protect your data from unauthorized access in accordance with KSA regulations.'
                }
            ]
        },
        terms: {
            title_ar: 'الشروط والأحكام',
            title_en: 'Terms & Conditions',
            icon: <FileTextIcon className="w-16 h-16 text-primary" />,
            sections_ar: [
                {
                    h: 'قبول الشروط',
                    p: 'باستخدامك لمنصة نجوم دلتا، فإنك توافق على الالتزام بكافة الشروط والأحكام المذكورة هنا.'
                },
                {
                    h: 'الطلبات والأسعار',
                    p: 'نحتفظ بالحق في تعديل الأسعار أو إلغاء الطلبات في حال وجود أخطاء تقنية أو نقص في المخزون.'
                },
                {
                    h: 'قانون التجارة الإلكترونية',
                    p: 'تخضع كافة المعاملات عبر المنصة لقانون التجارة الإلكترونية المعمول به في المملكة العربية السعودية.'
                }
            ],
            sections_en: [
                {
                    h: 'Acceptance of Terms',
                    p: 'By using the Delta Stars platform, you agree to comply with all terms and conditions stated herein.'
                },
                {
                    h: 'Orders & Pricing',
                    p: 'We reserve the right to modify prices or cancel orders in case of technical errors or stock shortages.'
                },
                {
                    h: 'E-commerce Law',
                    p: 'All transactions via the platform are subject to the E-commerce law applicable in the Kingdom of Saudi Arabia.'
                }
            ]
        },
        returns: {
            title_ar: 'سياسة الإرجاع والاستبدال',
            title_en: 'Return & Exchange Policy',
            icon: <RefreshCcwIcon className="w-16 h-16 text-primary" />,
            sections_ar: [
                {
                    h: 'طبيعة المنتجات الطازجة',
                    p: 'نظراً لأن منتجاتنا تشمل الخضروات والفواكه الطازجة، فإن سياسة الإرجاع تخضع لمعايير دقيقة لضمان سلامة الغذاء.'
                },
                {
                    h: 'الفحص عند الاستلام (هام جداً)',
                    p: 'يجب على العميل فحص المنتجات بدقة عند وصول المندوب. في حال عدم مطابقة المنتج للمواصفات المطلوبة، يجب على العميل رفض استلامه فوراً وإعادته مع المندوب في نفس اللحظة.'
                },
                {
                    h: 'بعد الاستلام',
                    p: 'بمجرد قبول العميل للمنتجات واستلامها، لا يمكن إرجاعها أو استبدالها نظراً لطبيعتها الاستهلاكية السريعة التلف، وذلك لضمان عدم تعرضها لظروف تخزين غير ملائمة بعد خروجها من عهدتنا.'
                }
            ],
            sections_en: [
                {
                    h: 'Nature of Fresh Products',
                    p: 'Since our products include fresh vegetables and fruits, the return policy is subject to strict standards to ensure food safety.'
                },
                {
                    h: 'Inspection upon Delivery (Critical)',
                    p: 'The customer must inspect products carefully upon the delivery agent\'s arrival. If a product does not meet the required specifications, the customer must reject it immediately and return it with the agent at that moment.'
                },
                {
                    h: 'After Acceptance',
                    p: 'Once the customer accepts and receives the products, they cannot be returned or exchanged due to their perishable nature, ensuring they are not exposed to improper storage conditions after leaving our custody.'
                }
            ]
        }
    };

    const active = content[type];

    return (
        <div className="container mx-auto px-6 py-32 animate-fade-in max-w-5xl">
            <div className="text-center mb-20">
                <div className="inline-flex p-8 bg-primary/5 rounded-[3rem] mb-8 shadow-inner">
                    {active.icon}
                </div>
                <h1 className="text-6xl font-black text-primary mb-6 tracking-tighter uppercase">
                    {language === 'ar' ? active.title_ar : active.title_en}
                </h1>
                <div className="h-2 w-32 bg-secondary mx-auto rounded-full"></div>
            </div>

            <div className="space-y-12">
                {(language === 'ar' ? active.sections_ar : active.sections_en).map((section, idx) => (
                    <div key={idx} className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100 hover:border-primary/20 transition-all">
                        <h2 className="text-3xl font-black text-primary mb-6 flex items-center gap-4">
                            <span className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center text-xl">{idx + 1}</span>
                            {section.h}
                        </h2>
                        <p className="text-2xl text-gray-500 leading-relaxed font-bold">
                            {section.p}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                <p className="text-xl text-gray-400 font-bold italic">
                    {language === 'ar' 
                        ? 'تم تحديث هذه السياسة لتتوافق مع أنظمة وزارة التجارة وقانون التجارة الإلكترونية في المملكة العربية السعودية.' 
                        : 'This policy has been updated to comply with Ministry of Commerce regulations and E-commerce law in Saudi Arabia.'}
                </p>
            </div>
        </div>
    );
};
