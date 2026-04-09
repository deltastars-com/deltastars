
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n, useGeminiAi } from './I18nContext';
import { Product, ChatMessage } from './types';
import { COMPANY_INFO, SOCIAL_LINKS } from './constants';
import { SparklesIcon, XIcon, QualityIcon, BotIcon, SettingsIcon, CheckCircleIcon } from './lib/contexts/Icons';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export const AiAssistant: React.FC<{ products: Product[], onClose: () => void }> = ({ products, onClose }) => {
  const { formatCurrency, language, t } = useI18n();
  const { status, hasKey, openSelectKey } = useGeminiAi();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [persona, setPersona] = useState<'classic' | 'friendly' | 'expert' | 'concise'>('classic');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const structuredCatalog = useMemo(() => {
    return products.map(p => 
      `- ${p.name_ar} (${p.name_en}): ${formatCurrency(p.price)} لكل ${p.unit_ar}. المنشأ: ${p.origin_ar}. الوصف: ${p.description_ar || '---'}. المميزات: ${p.features_ar || '---'}.`
    ).join('\n');
  }, [products, formatCurrency]);

  const personaInstructions = {
    classic: `
      أنت "عُدي" (Oday)، المستشار التوريدي الذكي والسيادي لشركة "delta stars".
      أسلوبك: مهني، كلاسيكي راقٍ، سريع جداً، ودقيق بنسبة 100%.
      رد بلهجة وطنية محلية مؤسسية.
    `,
    friendly: `
      أنت "عُدي" (Oday)، صديق العملاء في "delta stars".
      أسلوبك: ودود جداً، مرح، ترحيبي للغاية، وتستخدم الكثير من الرموز التعبيرية (Emojis).
      اجعل العميل يشعر وكأنه يتحدث مع صديق مقرب يهتم بجودة مائدته.
    `,
    expert: `
      أنت "عُدي" (Oday)، الخبير التقني ومسؤول الجودة في "delta stars".
      أسلوبك: تحليلي، مفصل، يركز على المعايير الفنية، شهادات الجودة، وتفاصيل المنشأ.
      استخدم لغة احترافية دقيقة تشرح لماذا منتجاتنا هي الأفضل تقنياً.
    `,
    concise: `
      أنت "عُدي" (Oday)، المساعد السريع لـ "delta stars".
      أسلوبك: مباشر جداً، مختصر لأقصى درجة، تعطي الإجابة فوراً دون مقدمات طويلة.
      وقت العميل ثمين، لذا كن دقيقاً وموجزاً.
    `
  };

  const sysInstruction = useMemo(() => `
    ${personaInstructions[persona]}
    
    مهمتك: تقديم تجربة عملاء استثنائية لشركة "delta stars" (شركة نجوم دلتا للتجارة).
    
    معلومات الشركة السيادية:
    - الاسم: ${COMPANY_INFO.name} (شركة نجوم دلتا للتجارة)
    - الموقع الرسمي: ${COMPANY_INFO.website}
    - الشعار: ${COMPANY_INFO.slogan}
    - الهاتف الأرضي: ${COMPANY_INFO.phone}
    - واتساب الرسمي: ${COMPANY_INFO.whatsapp}
    - البريد الإلكتروني العام: ${COMPANY_INFO.email}
    - بريد الإدارة: ${COMPANY_INFO.admin_email}
    - بريد التسويق: ${COMPANY_INFO.marketing_email}
    - بريد الدعم التقني: ${COMPANY_INFO.developer_email}
    - العنوان: ${COMPANY_INFO.address}
    - الفروع: جدة (الرئيسي)، مكة، المدينة المنورة، الرياض، الدمام، أبها.
    - الحساب البنكي (ANB): ${COMPANY_INFO.bank.iban}
    - رقم الحساب: ${COMPANY_INFO.bank.account_number}
    - رقم الآيبان: ${COMPANY_INFO.bank.iban}

    مهمتك السيادية والمقدسة:
    1. مساعدة العملاء (خاصة كبار العملاء VIP والشركات) في اختيار أجود الخضروات، الفواكه، التمور، والورقيات.
    2. تقديم معلومات دقيقة عن الأسعار والمنشأ بناءً على الكتالوج الموفر.
    3. نحن ندعم الطلب بالوزن (كيلو، جرام) وبالعبوة (باكت) وبالحزمة. 
       - إذا طلب العميل "نصف كيلو"، أخبره أن بإمكانه اختيار 0.5 من خلال زر التحكم في كمية المنتج.
    4. الإجابة على استفسارات الجودة ومعايير التوريد (نحن نطبق أعلى معايير الجودة العالمية).
    5. توجيه العملاء دائماً لاستخدام المنصة الرسمية deltastars.store لإتمام طلباتهم.
    6. المنصات الرسمية المعتمدة للردود والدعم الفني هي:
       - مباشرة من داخل المتجر (عبر هذه الدردشة).
       - عبر الواتساب الرسمي: ${COMPANY_INFO.whatsapp}
       - عبر قناتنا الرسمية على تلجرام: ${SOCIAL_LINKS.telegram_channel}
    7. تتبع الطلبات: أخبر العملاء أن بإمكانهم تتبع طلباتهم في الوقت الفعلي عبر الخريطة التفاعلية في قسم "تتبع الطلب".
    8. **هام جداً**: نحن نخدم جميع مناطق المملكة عبر فروعنا الستة (جدة، مكة، المدينة، الرياض، الدمام، أبها).

    كتالوج المنتجات (91 صنفاً أساسياً):
    ${structuredCatalog}
    
    بروتوكول التواصل السيادي:
    1. ابدأ دائماً بالترحيب الحار (يا هلا، حياك الله في delta stars - شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة).
    2. التزم بالأسعار المذكورة في الكتالوج بدقة متناهية.
    3. إذا سأل العميل عن منتج غير موجود، اعتذر بلباقة واقترح بدائل قريبة.
    4. في حالة الاستفسارات المالية، وجههم لقسم "حسابي" أو التواصل مع المحاسب عبر القنوات الرسمية.
    5. تذكر دائماً أنك تمثل "نجوم دلتا"، رمز الجودة في المملكة.
  `, [structuredCatalog, persona]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcome = language === 'ar' 
        ? "يا هلا بك في delta stars. أنا عُدي، خبيرك في جودة المنتجات الطازجة. كيف يمكنني دعم عمليات توريدكم اليوم؟ 🍏🛡️"
        : "Welcome to delta stars. I am Oday, your expert in fresh produce quality. How can I support your supply chain today? 🍏🛡️";
      setMessages([{ role: 'model', text: welcome }]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    // Reset welcome message when persona changes to reflect new style
    if (messages.length > 0) {
        let welcome = "";
        if (persona === 'classic') {
            welcome = language === 'ar' ? "تم تفعيل النمط الكلاسيكي. كيف أخدمكم؟" : "Classic style activated. How can I serve you?";
        } else if (persona === 'friendly') {
            welcome = language === 'ar' ? "يا هلا والله! أنا عُدي بأسلوبي الودود الجديد، كلي آذان صاغية لطلباتكم 🍎✨" : "Hey there! I'm Oday with my new friendly style, all ears for your requests 🍎✨";
        } else if (persona === 'expert') {
            welcome = language === 'ar' ? "تم تفعيل نمط الخبير التقني. جاهز لتحليل معايير الجودة والتوريد." : "Technical expert mode activated. Ready to analyze quality and supply standards.";
        } else {
            welcome = language === 'ar' ? "نمط الإجابة المختصرة مفعّل. تفضل بسؤالك." : "Concise mode active. Ask away.";
        }
        setMessages(prev => [...prev, { role: 'model', text: welcome }]);
    }
  }, [persona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!hasKey) {
      await openSelectKey();
      return;
    }
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: { 
          systemInstruction: sysInstruction, 
          temperature: persona === 'friendly' ? 0.7 : 0.2,
          tools: [{ googleMaps: {} }]
        },
        history: history
      });

      const stream = await chat.sendMessageStream({ message: userMsg });
      let fullText = '';
      let groundingLinks: { title: string, uri: string }[] = [];
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        fullText += chunkText;

        // Extract grounding links if available
        const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((c: any) => {
            if (c.maps) {
              groundingLinks.push({ title: c.maps.title, uri: c.maps.uri });
            }
          });
        }

        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs.length > 0) {
            let displayText = fullText;
            if (groundingLinks.length > 0) {
              displayText += '\n\n**روابط مفيدة:**\n' + groundingLinks.map(l => `- [${l.title}](${l.uri})`).join('\n');
            }
            newMsgs[newMsgs.length - 1].text = displayText;
          }
          return newMsgs;
        });
      }
    } catch (err: any) {
      console.error("Gemini Error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setMessages(prev => [...prev, { role: 'model', text: language === 'ar' ? 'عذراً، انتهت صلاحية مفتاح الربط. يرجى إعادة الاتصال.' : 'API Key expired. Please reconnect.' }]);
        await openSelectKey();
      } else {
        setMessages(prev => [...prev, { role: 'model', text: language === 'ar' ? 'عذراً، جاري تحديث بيانات المستودع.. حاول مجدداً.' : 'Warehouse sync in progress.. please try again.' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const personas: { id: typeof persona, label: string, icon: string }[] = [
    { id: 'classic', label: t('oday.settings.classic'), icon: '👨‍💼' },
    { id: 'friendly', label: t('oday.settings.friendly'), icon: '🤝' },
    { id: 'expert', label: t('oday.settings.expert'), icon: '🔬' },
    { id: 'concise', label: t('oday.settings.concise'), icon: '⚡' },
  ];

  return (
    <div className="fixed bottom-10 right-10 z-[2000] w-[90vw] max-w-lg h-[80vh] bg-white rounded-[4rem] shadow-sovereign flex flex-col overflow-hidden border-4 border-primary/10 animate-fade-in-up font-cairo">
      <header className="bg-primary text-white p-10 flex justify-between items-center shrink-0 border-b-[10px] border-secondary">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                {personas.find(p => p.id === persona)?.icon || '👨‍🌾'}
            </div>
            <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{language === 'ar' ? 'المستشار عُدي' : 'Oday AI Advisor'}</h3>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em]">Sovereign AI Node v62.0</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`p-4 rounded-full transition-all ${showSettings ? 'bg-secondary text-white' : 'hover:bg-white/10'}`}
            >
                <SettingsIcon className="w-8 h-8" />
            </button>
            <button onClick={onClose} className="hover:bg-red-600 p-4 rounded-full transition-all group">
                <XIcon className="w-8 h-8 group-hover:rotate-90 transition-transform" />
            </button>
        </div>
      </header>
      
      <div className="flex-1 relative overflow-hidden">
        {/* Settings Overlay */}
        {showSettings && (
            <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-10 animate-fade-in flex flex-col">
                <div className="flex justify-between items-center mb-10">
                    <h4 className="text-3xl font-black text-primary uppercase tracking-tight">{t('oday.settings.title')}</h4>
                    <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-primary">
                        <XIcon className="w-8 h-8" />
                    </button>
                </div>

                <div className="space-y-6 flex-1">
                    <p className="text-xl font-bold text-slate-500 mb-4">{t('oday.settings.persona')}</p>
                    <div className="grid grid-cols-1 gap-4">
                        {personas.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPersona(p.id)}
                                className={`flex items-center justify-between p-8 rounded-3xl border-4 transition-all ${
                                    persona === p.id 
                                    ? 'border-secondary bg-secondary/5 shadow-lg' 
                                    : 'border-gray-100 hover:border-primary/20'
                                }`}
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-5xl">{p.icon}</span>
                                    <span className="text-2xl font-black text-primary">{p.label}</span>
                                </div>
                                {persona === p.id && <CheckCircleIcon className="w-8 h-8 text-secondary" />}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => setShowSettings(false)}
                    className="w-full bg-primary text-white py-8 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-10"
                >
                    {t('oday.settings.save')}
                </button>
            </div>
        )}

        <div className="h-full p-10 overflow-y-auto bg-gray-50/50 space-y-8 custom-scrollbar">
            {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-lg font-bold shadow-sm ${
                    m.role === 'user' ? 'bg-primary text-white' : 'bg-white text-slate-800 border-2 border-gray-100'
                }`}>
                <div className="markdown-body prose prose-slate max-w-none">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
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
      </div>

      {!hasKey && (
        <div className="p-10 bg-secondary/10 border-t border-secondary/20 flex flex-col items-center gap-4">
          <p className="text-center font-bold text-primary">
            {language === 'ar' ? 'يرجى تفعيل مفتاح الذكاء الاصطناعي للدردشة مع عُدي' : 'Please activate AI key to chat with Oday'}
          </p>
          <button 
            onClick={openSelectKey}
            className="bg-secondary text-white px-10 py-4 rounded-full font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
          >
            {language === 'ar' ? 'تفعيل الاتصال' : 'Activate Connection'}
          </button>
        </div>
      )}

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
