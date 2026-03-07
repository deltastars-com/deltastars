import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from './lib/contexts/I18nContext';
import { DeliveryAgent } from '../types';
import { useToast } from './ToastContext';
import { PhoneIcon, DeliveryIcon, PlusIcon, TrashIcon, SparklesIcon, PencilIcon, UserIcon } from './lib/contexts/Icons';

declare var L: any;

export const OperationsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const mapRef = useRef<any>(null);
    const markersRef = useRef<{ [key: string]: any }>({});
    
    const [agents, setAgents] = useState<DeliveryAgent[]>(() => {
        const saved = localStorage.getItem('delta-fleet-data-v15');
        return saved ? JSON.parse(saved) : [
            { id: 'DS-701', name: 'سعد القحطاني', phone: '0558828009', vehicle_type: 'truck', status: 'delivering', rating: 4.9, completed_orders: 1540, location: { lat: 21.5424, lng: 39.2201 } },
            { id: 'DS-702', name: 'محمد الزهراني', phone: '0551122334', vehicle_type: 'car', status: 'online', rating: 5.0, completed_orders: 980, location: { lat: 21.5600, lng: 39.2400 } }
        ];
    });

    const [showAgentForm, setShowAgentForm] = useState(false);
    const [editingAgent, setEditingAgent] = useState<DeliveryAgent | null>(null);

    useEffect(() => {
        localStorage.setItem('delta-fleet-data-v15', JSON.stringify(agents));
    }, [agents]);

    // Map Initialization with enhanced safety to prevent duplicate initialization
    useEffect(() => {
        const containerId = 'ops-map';
        const container = document.getElementById(containerId);
        
        if (container && !mapRef.current) {
            // Check if Leaflet already initialized this container
            if (L.DomUtil.get(containerId)?._leaflet_id) {
                return;
            }

            mapRef.current = L.map(containerId, { 
                zoomControl: false,
                fadeAnimation: true 
            }).setView([21.5424, 39.2201], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapRef.current);
            
            L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                // Clear all managed markers explicitly
                // Fix: Casting marker values to any to resolve 'unknown' type error when calling .remove()
                Object.values(markersRef.current).forEach((m: any) => m.remove());
                markersRef.current = {};
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Incremental Marker Syncing - Avoids re-drawing everything
    useEffect(() => {
        if (!mapRef.current) return;

        const currentAgentIds = new Set(agents.map(a => a.id));

        // 1. Remove markers for agents that no longer exist
        Object.keys(markersRef.current).forEach(id => {
            if (!currentAgentIds.has(id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

        // 2. Update or Add markers
        agents.forEach(agent => {
            const markerColor = agent.status === 'delivering' ? 'bg-secondary' : (agent.status === 'online' ? 'bg-green-500' : 'bg-gray-500');
            const iconHtml = `
                <div class="relative group" id="marker-${agent.id}">
                    <div class="${markerColor} p-2.5 rounded-full border-4 border-white shadow-2xl animate-fade-in text-xl flex items-center justify-center transition-all hover:scale-125">
                        ${agent.vehicle_type === 'truck' ? '🚛' : '🚗'}
                    </div>
                    <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap font-black border border-white/20 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        ${agent.name}
                    </div>
                </div>`;

            const icon = L.divIcon({
                html: iconHtml,
                className: 'custom-ops-marker',
                iconSize: [45, 45],
                iconAnchor: [22, 22]
            });

            if (markersRef.current[agent.id]) {
                // Update position smoothly if already exists
                markersRef.current[agent.id].setLatLng([agent.location.lat, agent.location.lng]);
                // Update icon if needed (status changes etc)
                markersRef.current[agent.id].setIcon(icon);
            } else {
                // Create new marker
                const marker = L.marker([agent.location.lat, agent.location.lng], { 
                    icon,
                    riseOnHover: true 
                }).addTo(mapRef.current);
                markersRef.current[agent.id] = marker;
            }
        });
    }, [agents]);

    const handleAddAgent = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const vehicle = formData.get('vehicle') as any;

        const newAgent: DeliveryAgent = {
            id: editingAgent?.id || `DS-AGT-${Date.now().toString().slice(-4)}`,
            name, phone, vehicle_type: vehicle,
            status: 'online', rating: 5.0,
            completed_orders: editingAgent?.completed_orders || 0,
            location: editingAgent?.location || { lat: 21.5424 + (Math.random() - 0.5) * 0.01, lng: 39.2201 + (Math.random() - 0.5) * 0.01 }
        };

        if (editingAgent) setAgents(agents.map(a => a.id === editingAgent.id ? newAgent : a));
        else setAgents([...agents, newAgent]);

        addToast(language === 'ar' ? 'تم تحديث الأسطول بنجاح' : 'Fleet Updated Successfully', 'success');
        setShowAgentForm(false);
        setEditingAgent(null);
    };

    return (
        <div className="min-h-[85vh] bg-slate-950 text-white rounded-[4rem] p-6 flex flex-col gap-6 shadow-3xl border border-white/10 overflow-hidden relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/10 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center border-2 border-secondary">
                        <DeliveryIcon className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Delta Fleet Radar</h2>
                        <p className="text-secondary font-bold text-[10px] tracking-widest">إدارة التتبع الجغرافي للأسطول</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setShowAgentForm(true)} className="bg-primary hover:bg-primary-light px-8 py-3 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-3">
                        <PlusIcon className="w-5 h-5" /> إضافة مندوب
                    </button>
                    <button onClick={onBack} className="bg-white/10 px-6 py-3 rounded-2xl hover:bg-red-600 transition-all font-black shadow-lg">إغلاق</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 relative z-10 h-full min-h-0">
                <div className="lg:col-span-8 relative bg-gray-900 rounded-[3.5rem] border-4 border-white/5 overflow-hidden shadow-inner">
                    <div id="ops-map" className="w-full h-full min-h-[500px]"></div>
                    {/* Floating Map Legend */}
                    <div className="absolute bottom-6 left-6 z-[400] bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest space-y-2">
                        <div className="flex items-center gap-3"><span className="w-3 h-3 bg-secondary rounded-full animate-pulse"></span> جاري التوصيل</div>
                        <div className="flex items-center gap-3"><span className="w-3 h-3 bg-green-500 rounded-full"></span> متصل / متاح</div>
                        <div className="flex items-center gap-3"><span className="w-3 h-3 bg-gray-500 rounded-full"></span> غير متصل</div>
                    </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[3.5rem] p-8 border border-white/10 flex-1 overflow-y-auto custom-scrollbar shadow-2xl">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-secondary">
                            <SparklesIcon className="w-6 h-6" /> حالة الأسطول النشط
                        </h3>
                        <div className="space-y-4">
                            {agents.length === 0 ? (
                                <div className="text-center py-12 opacity-20 italic">لا توجد مركبات نشطة حالياً</div>
                            ) : (
                                agents.map(agent => (
                                    <div key={agent.id} className="p-6 rounded-[2rem] bg-white/5 border border-transparent hover:border-secondary transition-all flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl filter drop-shadow-lg">{agent.vehicle_type === 'truck' ? '🚛' : '🚗'}</span>
                                            <div>
                                                <p className="font-black text-xl leading-none">{agent.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500 animate-pulse' : (agent.status === 'delivering' ? 'bg-secondary animate-pulse' : 'bg-gray-500')}`}></span>
                                                    <p className="text-[10px] opacity-40 font-mono tracking-widest uppercase">{agent.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setAgents(agents.filter(a => a.id !== agent.id))} 
                                            className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            title="حذف من الرادار"
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAgentForm && (
                <div className="fixed inset-0 bg-slate-950/98 z-[1100] flex justify-center items-center p-4 backdrop-blur-4xl animate-fade-in">
                    <div className="bg-white p-12 rounded-[4rem] w-full max-w-xl relative border-t-[20px] border-primary text-black shadow-sovereign">
                        <button onClick={() => setShowAgentForm(false)} className="absolute top-8 end-10 text-4xl text-gray-200 hover:text-red-500 font-black transition-all">&times;</button>
                        <h3 className="text-3xl font-black uppercase text-slate-800 mb-2">تسجيل مركبة</h3>
                        <p className="text-gray-400 font-bold mb-8">إضافة وحدة توصيل جديدة لنظام التتبع الجغرافي</p>
                        <form onSubmit={handleAddAgent} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">اسم المندوب</label>
                                <input name="name" type="text" placeholder="مثال: فهد السبيعي" className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-2xl focus:border-primary outline-none transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">رقم الاتصال</label>
                                <input name="phone" type="tel" placeholder="05XXXXXXXX" className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-2xl focus:border-primary outline-none transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">نوع المركبة</label>
                                <select name="vehicle" className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-xl outline-none focus:border-primary transition-all">
                                    <option value="truck">شاحنة تبريد (Frozen/Chilled)</option>
                                    <option value="car">سيارة توزيع سريعة</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-6 rounded-2xl font-black text-3xl shadow-xl hover:scale-[1.02] transition-all border-b-8 border-primary-dark active:border-b-0 active:translate-y-2">
                                تنشيط الوحدة الآن
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};