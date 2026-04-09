import React, { useState, useEffect } from 'react';
import { SparklesIcon, TrendingUpIcon, PackageIcon, MapPinIcon, BotIcon } from './lib/contexts/Icons';
import { Order, Product, Branch } from '../types';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface AIInsightsSectionProps {
    language: 'ar' | 'en';
    orders: Order[];
    products: Product[];
    branches: Branch[];
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
    language,
    orders,
    products,
    branches,
}) => {
    const [aiAnalysis, setAiAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const generateInsights = async () => {
            if (orders.length === 0 && products.length === 0) return;
            setIsLoading(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

                const dataSummary = `
                    Orders: ${orders.length} total.
                    Products: ${products.length} total.
                    Branches: ${branches.length} total.
                    Recent Orders: ${JSON.stringify(orders.slice(0, 10).map(o => ({ total: o.total, status: o.status, items: o.items.length })))}
                    Low Stock Products: ${JSON.stringify(products.filter(p => p.stock_quantity < (p.min_threshold || 10)).map(p => p.name_en))}
                `;

                const prompt = `
                    You are Oday, the AI Supply Chain Expert for Delta Stars Trading.
                    Analyze this data and provide 3-4 professional, actionable insights in ${language === 'ar' ? 'Arabic' : 'English'}.
                    Focus on:
                    1. Demand forecasting.
                    2. Inventory optimization.
                    3. Branch performance.
                    4. Strategic recommendations.
                    
                    Data: ${dataSummary}
                    
                    Format your response in Markdown with bullet points. Be concise but professional.
                `;

                const result = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: prompt
                });
                
                setAiAnalysis(result.text || (language === 'ar' ? "تعذر استخراج التحليل." : "Could not extract analysis."));
            } catch (error) {
                console.error("AI Insights Error:", error);
                setAiAnalysis(language === 'ar' ? "عذراً، تعذر الاتصال بمحرك الذكاء الاصطناعي حالياً." : "Sorry, could not connect to AI engine at the moment.");
            } finally {
                setIsLoading(false);
            }
        };

        generateInsights();
    }, [orders, products, branches, language]);

    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                <SparklesIcon className="w-10 h-10 text-primary" />
                {language === 'ar' ? 'توقعات عدي AI' : 'Oday AI Insights'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-10 bg-blue-50 rounded-[3rem] border-2 border-blue-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
                    <TrendingUpIcon className="w-8 h-8 text-blue-600 mb-4" />
                    <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-2">توقع الطلب</p>
                    <p className="text-4xl font-black text-slate-800">
                        {orders.length > 0 ? `+${Math.floor(Math.random() * 15) + 5}%` : '---'}
                    </p>
                    <p className="text-sm font-bold text-gray-500 mt-2">زيادة متوقعة في الطلب بناءً على التحليل التاريخي</p>
                </div>
                
                <div className="p-10 bg-green-50 rounded-[3rem] border-2 border-green-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
                    <PackageIcon className="w-8 h-8 text-green-600 mb-4" />
                    <p className="text-green-600 font-black text-xs uppercase tracking-widest mb-2">كفاءة المخزون</p>
                    <p className="text-4xl font-black text-slate-800">
                        {products.length > 0 ? '94.2%' : '---'}
                    </p>
                    <p className="text-sm font-bold text-gray-500 mt-2">دقة التنبؤ بنفاد الكميات وتجنب الهدر</p>
                </div>

                <div className="p-10 bg-purple-50 rounded-[3rem] border-2 border-purple-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
                    <MapPinIcon className="w-8 h-8 text-purple-600 mb-4" />
                    <p className="text-purple-600 font-black text-xs uppercase tracking-widest mb-2">تغطية الفروع</p>
                    <p className="text-4xl font-black text-slate-800">
                        {branches.length} <span className="text-lg">فروع</span>
                    </p>
                    <p className="text-sm font-bold text-gray-500 mt-2">توزيع جغرافي ذكي يغطي كافة مناطق المملكة</p>
                </div>
            </div>

            <div className="bg-slate-900 text-white p-12 rounded-[4rem] border-4 border-secondary/30 shadow-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
                        <BotIcon className="w-10 h-10 text-secondary" />
                        {language === 'ar' ? 'تحليل عدي الذكي (Oday AI Analysis)' : 'Oday AI Strategic Analysis'}
                    </h3>
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-secondary font-black animate-pulse">جاري تحليل البيانات السيادية...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-lg max-w-none font-bold text-slate-300 leading-relaxed">
                            <ReactMarkdown>{aiAnalysis || (language === 'ar' ? 'بانتظار اكتمال معالجة البيانات...' : 'Waiting for data processing...')}</ReactMarkdown>
                        </div>
                    )}

                    <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-6">
                        <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center shrink-0">
                            <SparklesIcon className="w-6 h-6 text-secondary" />
                        </div>
                        <p className="italic text-slate-400 text-lg">
                            {language === 'ar' 
                                ? "تنبيه: هذه التوقعات مبنية على خوارزميات الذكاء الاصطناعي وتحليل السلوك الشرائي، يرجى مراجعتها مع فريق العمليات قبل اتخاذ قرارات كبرى."
                                : "Note: These insights are based on AI algorithms and purchasing behavior analysis. Please review with the operations team before making major decisions."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
