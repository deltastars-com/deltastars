import React from 'react';

export const Home: React.FC<any> = ({ setPage }) => {
    return (                                                                                                            
        <div className="min-h-screen bg-white font-sans">                                
            <section className="h-screen flex items-center justify-center bg-[#1a3a1a] text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80')] bg-cover bg-center animate-pulse"></div>
                <div className="relative z-10 max-w-5xl">
                    <h1 className="text-6xl md:text-[10rem] font-black text-white mb-6 tracking-tighter uppercase">
                        نجوم دلتا
                    </h1>                                                                            
                    <p className="text-2xl md:text-5xl font-bold text-yellow-500 mb-12 italic leading-tight">
                        شريكك الأمثل للخضروات والفواكه والتمور عالية الجودة
                    </p>                                                                            
                    <div className="flex flex-wrap justify-center gap-8">
                        <button onClick={() => setPage('products')} className="px-16 py-6 bg-yellow-600 text-white rounded-full font-black text-3xl shadow-2xl hover:scale-105 transition-all">تسوق الآن 🛒</button>
                        <button onClick={() => setPage('login')} className="px-16 py-6 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-full font-black text-3xl hover:bg-white hover:text-black transition-all">دخول الإدارة 🔒</button>
                    </div>                                                                            
                </div>                                                                            
            </section>                                                                            
        </div>                                                                            
    );                                                                            
};                                                                            
