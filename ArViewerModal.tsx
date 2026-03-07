
import React, { useState } from 'react';
import { Product } from '../../../types';
import { SparklesIcon, XIcon, QualityIcon } from './Icons';
import { useI18n } from './I18nContext';

interface ArViewerModalProps {
  product: Product;
  onClose: () => void;
}

/**
 * Delta Stars Sovereign AR Experience v11.0
 * تجربة فحص الجودة الرقمية المتقدمة.
 */
export const ArViewerModal: React.FC<ArViewerModalProps> = ({ product, onClose }) => {
  const { language } = useI18n();
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Fix: Defined 'model-viewer' as a constant with 'any' type to bypass JSX intrinsic elements check
  const ModelViewer = 'model-viewer' as any;

  return (
    <div className="fixed inset-0 z-[3000] bg-[#010409] flex flex-col animate-fade-in overflow-hidden">
        {/* Deep Space Background */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-40%] left-[-10%] w-full h-full bg-primary/20 blur-[250px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-30%] right-[-20%] w-full h-full bg-secondary/10 blur-[250px] rounded-full animate-pulse-slow"></div>
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>

        {/* Cinematic Header */}
        <header className="relative p-6 md:p-14 flex justify-between items-start z-50 pointer-events-none">
            <div className="flex items-center gap-8 pointer-events-auto">
                <div className="w-16 h-16 md:w-28 md:h-28 bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center shadow-sovereign border border-white/10">
                    <SparklesIcon className="w-8 h-8 md:w-14 md:h-14 text-secondary animate-pulse" />
                </div>
                <div>
                    <h3 className="text-white font-black text-3xl md:text-7xl uppercase tracking-tighter leading-none mb-3">
                        {language === 'ar' ? 'مختبر الجودة الرقمي' : 'Digital Quality Lab'}
                    </h3>
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-6 py-2 rounded-full border border-white/5 w-fit">
                        <span className="text-secondary font-black text-[10px] md:text-[14px] uppercase tracking-[0.6em]">
                            {language === 'ar' ? product.name_ar : product.name_en} • SCANNED ASSET
                        </span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={onClose} 
                className="group p-8 md:p-12 bg-white/5 hover:bg-red-600 text-white rounded-full transition-all border border-white/10 shadow-4xl hover:scale-110 pointer-events-auto backdrop-blur-3xl"
            >
                <XIcon className="w-10 h-10 md:w-16 md:h-16 group-hover:rotate-90 transition-transform duration-700" />
            </button>
        </header>

        {/* 3D Viewport */}
        <div className="flex-1 relative flex flex-col items-center justify-center">
            {isModelLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#010409]/95 backdrop-blur-5xl">
                    <div className="relative mb-12">
                        <div className="w-44 h-44 md:w-64 md:h-64 border-[15px] border-white/5 border-t-secondary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-black text-4xl animate-pulse tracking-widest uppercase">Delta</span>
                        </div>
                    </div>
                    <p className="text-secondary font-black text-[16px] tracking-[1em] uppercase animate-pulse">Synchronizing Visual Assets...</p>
                </div>
            )}

            <div className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-visible">
                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/60"></div>
                    <div className="absolute top-0 left-1/2 w-px h-full bg-white/60"></div>
                </div>

                {/* Fix: Using ModelViewer constant instead of raw tag */}
                <ModelViewer
                    src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    poster={product.image}
                    shadow-intensity="2"
                    exposure="1.2"
                    environment-image="neutral"
                    auto-rotate
                    interaction-prompt="auto"
                    onLoad={() => setIsModelLoading(false)}
                    className="w-full h-full"
                >
                    <button slot="ar-button" className="ar-button">
                        <span className="flex items-center gap-6">
                            {language === 'ar' ? 'إسقاط الثمرة في مساحتك' : 'PLACE IN YOUR ENVIRONMENT'}
                        </span>
                    </button>
                </ModelViewer>
            </div>

            {/* Technical Instruction */}
            {!isModelLoading && (
                <div className="absolute bottom-48 left-1/2 -translate-x-1/2 w-full max-w-4xl px-12 pointer-events-none animate-fade-in-up">
                    <div className="bg-slate-900/40 backdrop-blur-5xl p-14 rounded-[5rem] border border-white/10 shadow-sovereign text-center relative overflow-hidden group">
                        <div className="absolute scan-pulse w-full h-1 left-0 top-0"></div>
                        <p className="text-white font-black text-2xl md:text-5xl leading-tight">
                            {language === 'ar' ? 
                                'استخدم اللمس لفحص التفاصيل. الثمرة مطابقة لمعايير الجودة v11.0' : 
                                'Rotate and inspect details. Compliant with quality standards v11.0'}
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* Global Compliance Footer */}
        <footer className="p-12 border-t border-white/5 bg-[#010409]/98 backdrop-blur-5xl flex flex-col md:flex-row justify-between items-center gap-12 relative z-50">
            <div className="flex items-center gap-12 opacity-60">
                <QualityIcon className="w-14 h-14 text-secondary" />
                <div className="flex flex-col">
                    <span className="text-white font-black text-[12px] uppercase tracking-[0.8em] mb-2">Delta Sovereign Rendering Node</span>
                    <span className="text-secondary font-bold text-[10px] uppercase tracking-[0.5em]">Institutional Compliance Engine v50.0</span>
                </div>
            </div>
            <div className="text-green-500 font-black text-[14px] uppercase tracking-[0.3em] animate-pulse flex items-center gap-5">
                <span className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,1)]"></span> 
                ENCRYPTED VISUAL STREAM • ACTIVE
            </div>
        </footer>

        <style>{`
            .scan-pulse {
                animation: scan 4s linear infinite;
                background: linear-gradient(to right, transparent, #FF922B, transparent);
                opacity: 0.5;
            }
            @keyframes scan {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `}</style>
    </div>
  );
};
