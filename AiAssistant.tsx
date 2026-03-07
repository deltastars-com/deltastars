
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n, useGeminiAi } from './lib/contexts/I18nContext';
import { Product, ChatMessage } from '../types';
import { COMPANY_INFO, SOCIAL_LINKS } from './constants';
import { SparklesIcon, XIcon, QualityIcon } from './lib/contexts/Icons';
import { GoogleGenAI } from '@google/genai';

export const AiAssistant: React.FC<{ products: Product[], onClose: () => void }> = ({ products, onClose }) => {
  const { formatCurrency, language } = useI18n();
  const { status } = useGeminiAi();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const structuredCatalog = useMemo(() => {
    return products.map(p => 
      `- ${p.name_ar} (${p.name_en}): ${formatCurrency(p.price)} لكل ${p.unit_ar}. المنشأ: ${p.origin_ar}.`
    ).join('\n');
  }, [products, formatCurrency]);

  useEffect(() => {
    if (status === 'ready' && !chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const sysInstruction = `
        أنت "عُدي" (Oday)، المستشار التوريدي الذكي والسيادي لشركة "نجوم دلتا للتجارة" (Delta Stars Trading) في المملكة العربية السعودية.
        تعمل من خلال المنصة الرسمية: deltastars.com
        
        معلومات الشركة:
        - الاسم: ${COMPANY_INFO.name}
        - الموقع الرسمي: ${COMPANY_INFO.website}
        - الشعار: ${COMPANY_INFO.slogan}
        - الهاتف: ${COMPANY_INFO.phone}
        - واتساب: ${COMPANY_INFO.whatsapp}
        - قناة تلجرام: ${SOCIAL_LINKS.telegram_channel}
        - العنوان: ${COMPANY_INFO.address}
        - البنك: ${COMPANY_INFO.bank.name}، آيبان: ${COMPANY_INFO.bank.iban}

        مهمتك:
        1. مساعدة العملاء (خاصة كبار العملاء VIP والشركات) في اختيار أجود الخضروات، الفواكه، التمور، والورقيات.
        2. تقديم معلومات دقيقة عن الأسعار والمنشأ بناءً على الكتالوج الموفر.
        3. الإجابة على استفسارات الجودة ومعايير التوريد (نحن نطبق أعلى معايير الجودة العالمية).
        4. توجيه العملاء دائماً لاستخدام المنصة الرسمية deltastars.com لإتمام طلباتهم.
        5. المنصات الرسمية المعتمدة للردود والدعم الفني هي:
           - مباشرة من داخل المتجر (عبر هذه الدردشة).
           - عبر الواتساب الرسمي: ${COMPANY_INFO.whatsapp}
           - عبر قناتنا الرسمية على تلجرام: ${SOCIAL_LINKS.telegram_channel}

        كتالوج المنتجات (235 صنفاً):
        ${structuredCatalog}
        
        بروتوكول التواصل:
        1. رد بلهجة وطنية محلية مؤسسية، مهنية، وودودة جداً.
        2. ابدأ دائماً بالترحيب الحار (يا هلا، حياك الله في نجوم دلتا).
        3. إذا سأل العميل عن منتج غير موجود، اعتذر بلباقة واقترح بدائل أو اطلب منه التواصل مع المبيعات لطلبات التوريد الخاصة.
        4. شجع دائماً على إتمام الطلب عبر المتجر أو التواصل عبر واتساب (${COMPANY_INFO.whatsapp}) للكميات الكبيرة، أو متابعة العروض عبر تلجرام (${SOCIAL_LINKS.telegram_channel}).
        5. أكد للعميل أننا متواجدون للرد عليه هنا مباشرة، أو عبر الواتساب وتلجرام فقط كقنوات رسمية.
        6. كن سريعاً ومختصراً في الإجابة مع الحفاظ على دقة المعلومة.
        7. التزم بالأسعار المذكورة في الكتالوج بدقة.
      `;
      
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: sysInstruction, temperature: 0.2 }
      });

      const welcome = language === 'ar' 
        ? "يا هلا بك في نجوم دلتا. أنا عُدي، خبيرك في جودة المنتجات الطازجة. كيف يمكنني دعم عمليات توريدكم اليوم؟ 🍏🛡️"
        : "Welcome to Delta Stars. I am Oday, your expert in fresh produce quality. How can I support your supply chain today? 🍏🛡️";

      setMessages([{ role: 'model', text: welcome }]);
    }
  }, [status, structuredCatalog, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      // Add an empty model message to be updated by the stream
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs.length > 0) {
            newMsgs[newMsgs.length - 1].text = fullText;
          }
          return newMsgs;
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: language === 'ar' ? 'عذراً، جاري تحديث بيانات المستودع.. حاول مجدداً.' : 'Warehouse sync in progress.. please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[2000] w-[90vw] max-w-lg h-[80vh] bg-white rounded-[4rem] shadow-sovereign flex flex-col overflow-hidden border-4 border-primary/10 animate-fade-in-up font-cairo">
      <header className="bg-primary text-white p-10 flex justify-between items-center shrink-0 border-b-[10px] border-secondary">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-xl">👨‍🌾</div>
            <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">المستشار عُدي</h3>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Sovereign AI Node v60</p>
            </div>
        </div>
        <button onClick={onClose} className="hover:bg-red-600 p-4 rounded-full transition-all group">
            <XIcon className="w-8 h-8 group-hover:rotate-90 transition-transform" />
        </button>
      </header>
      
      <div className="flex-1 p-10 overflow-y-auto bg-gray-50/50 space-y-8 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-lg font-bold shadow-sm ${
                m.role === 'user' ? 'bg-primary text-white' : 'bg-white text-slate-800 border-2 border-gray-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-gray-200 text-gray-400 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">
                    Delta AI Thinking...
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-8 bg-white border-t border-gray-100 flex gap-4 items-center">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder={language === 'ar' ? 'استفسر عن أي منتج أو معايير الجودة...' : 'Ask about quality or products...'} 
          className="flex-1 p-6 bg-gray-50 border-4 border-transparent rounded-[2rem] font-bold text-xl focus:border-primary/20 outline-none transition-all shadow-inner"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className="bg-secondary text-white p-6 rounded-[2rem] shadow-4xl hover:scale-105 active:scale-95 transition-all">
          <SparklesIcon className="w-8 h-8" />
        </button>
      </form>
    </div>
  );
};
