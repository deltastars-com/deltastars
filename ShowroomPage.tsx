import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from './lib/contexts/I18nContext';
import { ShowroomItem, ShowroomAsset, Page } from '../types';
import { COMPANY_INFO } from './constants';
// Removed non-existent ArrowRightIcon import as it is not exported by the Icons module
import { PlayIcon, SparklesIcon, XIcon, EyeIcon, PlusIcon } from './lib/contexts/Icons';

interface ShowroomPageProps {
  items: ShowroomItem[];
  showroomBanner: string;
  setPage: (page: Page) => void;
}

const TheaterAssetView: React.FC<{ asset: ShowroomAsset; active: boolean }> = ({ asset, active }) => {
    const isVideo = asset.type === 'video';
    const [isLoading, setIsLoading] = useState(true);

    if (!active) return null;

    return (
        <div className="w-full h-full flex items-center justify-center bg-black/40 relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/20 backdrop-blur-md">
                     <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {isVideo ? (
                <iframe 
                    src={`https://drive.google.com/file/d/${asset.url}/preview?autoplay=1`}
                    className="w-full h-full border-none shadow-2xl" 
                    allow="autoplay; fullscreen"
                    onLoad={() => setIsLoading(false)}
                ></iframe>
            ) : (
                <img 
                    src={`https://lh3.googleusercontent.com/d/${asset.url}`} 
                    className="max-w-full max-h-full object-contain drop-shadow-4xl animate-fade-in" 
                    alt={asset.title_en}
                    onLoad={() => setIsLoading(false)}
                />
            )}
        </div>
    );
};

export const ShowroomPage: React.FC<ShowroomPageProps> = ({ items, showroomBanner, setPage }) => {
  const { t, language } = useI18n();
  const [activeSection, setActiveSection] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ShowroomItem | null>(null);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  const sections = useMemo(() => {
    const s = Array.from(new Set(items.map(item => language === 'ar' ? item.section_ar : item.section_en)));
    return ['all', ...s.filter(Boolean) as string[]];
  }, [items, language]);

  const filteredItems = useMemo(() => {
    if (activeSection === 'all') return items;
    return items.filter(item => (language === 'ar' ? item.section_ar : item.section_en) === activeSection);
  }, [items, activeSection, language]);

  const openTheater = (item: ShowroomItem) => {
      setSelectedItem(item);
      setActiveAssetIndex(0);
  };

  return (
    <div className="animate-fade-in pb-40 selection:bg-secondary selection:text-white bg-white overflow-x-hidden">
        {/* Cinematic Header */}
        <section className="bg-primary-dark pt-32 pb-40 px-6 text-center relative overflow-hidden border-b-[20px] border-secondary/10">
            <div className="absolute top-0 right-0 w-[80rem] h-[80rem] bg-secondary/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="inline-flex items-center gap-5 bg-white/5 backdrop-blur-3xl px-12 py-4 rounded-full border border-white/10 text-secondary font-black text-sm mb-12 uppercase tracking-[0.5em] shadow-2xl">
                    <SparklesIcon className="w-6 h-6" />
                    {language === 'ar' ? 'بوابة المحتوى السيادي' : 'Sovereign Content Hub'}
                </div>
                
                <h1 className="text-7xl md:text-[10rem] font-black text-white mb-8 leading-none tracking-tighter uppercase drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {language === 'ar' ? 'صالة العرض' : 'Showroom'}
                </h1>
                
                <p className="text-3xl md:text-5xl font-bold text-secondary italic opacity-80 max-w-4xl mx-auto leading-tight">
                    {language === 'ar' ? 'رحلة مرئية عبر معايير الجودة واللوجستيات' : 'A Visual Journey through Quality & Logistics'}
                </p>
            </div>
        </section>

        {/* Discovery Navigation */}
        <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-3xl border-b border-gray-100 shadow-xl py-8">
            <div className="container mx-auto px-6">
                <div className="flex justify-center gap-6 overflow-x-auto pb-2 no-scrollbar items-center">
                    {sections.map(sec => (
                        <button
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-12 py-4 rounded-[2.5rem] font-black transition-all border-4 text-xl whitespace-nowrap shadow-md ${activeSection === sec ? 'bg-primary text-white border-primary scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-primary/20'}`}
                        >
                            {sec === 'all' ? (language === 'ar' ? 'كل المحتوى' : 'All Stories') : sec}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Dynamic Gallery Grid */}
        <section className="container mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {filteredItems.map(item => (
                    <div 
                        key={item.id} 
                        className="bg-white rounded-[4rem] shadow-3xl overflow-hidden group border border-gray-50 hover:-translate-y-4 transition-all duration-500 relative cursor-pointer"
                        onClick={() => openTheater(item)}
                    >
                        <div className="relative h-[500px] overflow-hidden">
                            <img src={item.image} alt={item.title_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-80"></div>
                            
                            {/* Asset Count Badge */}
                            <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-white font-black text-xs flex items-center gap-3">
                                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                {item.assets.length} {language === 'ar' ? 'أصول مرئية' : 'Visual Assets'}
                            </div>

                            <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                <span className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-4 block">{item.section_ar}</span>
                                <h3 className="text-4xl font-black text-white leading-tight mb-4 group-hover:text-secondary transition-colors">
                                    {language === 'ar' ? item.title_ar : item.title_en}
                                </h3>
                                <p className="text-white/70 font-bold text-lg leading-relaxed line-clamp-2">
                                    {language === 'ar' ? item.description_ar : item.description_en}
                                </p>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/30 scale-50 group-hover:scale-100 transition-transform">
                                    <PlayIcon className="w-10 h-10 text-white" />
                                 </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Cinematic theater Lightbox */}
        {selectedItem && (
            <div className="fixed inset-0 bg-slate-950 z-[1000] flex flex-col md:flex-row animate-fade-in">
                {/* Close Control */}
                <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-10 left-10 z-[1010] bg-white/10 hover:bg-red-600 text-white p-6 rounded-full backdrop-blur-xl transition-all border border-white/10"
                >
                    <XIcon className="w-10 h-10" />
                </button>

                {/* Main Theater View */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-16 relative">
                    <div className="w-full max-w-7xl aspect-video rounded-[3rem] md:rounded-[5rem] overflow-hidden bg-black shadow-[0_0_150px_rgba(0,0,0,0.8)] border-[12px] border-white/5 relative">
                        <TheaterAssetView 
                            asset={selectedItem.assets[activeAssetIndex]} 
                            active={true}
                        />
                    </div>
                    
                    <div className="mt-12 text-center max-w-4xl px-6">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-2xl">
                            {language === 'ar' ? selectedItem.title_ar : selectedItem.title_en}
                        </h2>
                        <p className="text-xl md:text-2xl font-bold text-white/50 leading-relaxed italic">
                            {language === 'ar' ? selectedItem.description_ar : selectedItem.description_en}
                        </p>
                    </div>
                </div>

                {/* Asset Navigator Sidebar */}
                <div className="w-full md:w-[30%] lg:w-[25%] bg-slate-900/50 backdrop-blur-4xl border-s border-white/10 p-10 flex flex-col overflow-y-auto">
                    <h4 className="text-secondary font-black text-xs uppercase tracking-[0.4em] mb-10 text-center">Asset Navigator</h4>
                    <div className="space-y-8">
                        {selectedItem.assets.map((asset, index) => (
                            <button 
                                key={asset.id}
                                onClick={() => setActiveAssetIndex(index)}
                                className={`w-full text-start group transition-all ${activeAssetIndex === index ? 'scale-105' : 'opacity-40 hover:opacity-100'}`}
                            >
                                <div className={`relative aspect-video rounded-[2.5rem] overflow-hidden mb-4 border-4 transition-colors ${activeAssetIndex === index ? 'border-secondary' : 'border-white/5'}`}>
                                    {asset.type === 'video' ? (
                                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                            <PlayIcon className="w-8 h-8 text-white/30" />
                                        </div>
                                    ) : (
                                        <img src={`https://lh3.googleusercontent.com/d/${asset.url}`} className="w-full h-full object-cover" alt="" />
                                    )}
                                    {activeAssetIndex === index && (
                                        <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary font-black text-xl">✓</div>
                                        </div>
                                    )}
                                </div>
                                <p className={`font-black text-sm px-4 ${activeAssetIndex === index ? 'text-secondary' : 'text-white'}`}>
                                    {asset.title_ar || `Asset #${index + 1}`}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-12 text-center">
                         <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-4">Inquiry about this story?</p>
                            <button 
                                onClick={() => window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(selectedItem.title_en)}`, '_blank')}
                                className="bg-secondary text-white w-full py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all"
                            >
                                Contact Sales
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
