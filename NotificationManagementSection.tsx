
import React, { useState, useEffect } from 'react';
import { useI18n, useToast, useFirebase } from './lib/contexts';
import { BellIcon, TrashIcon } from './lib/contexts/Icons';
import { db, collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, handleFirestoreError, OperationType } from '@/firebase';

export const NotificationManagementSection: React.FC = () => {
    const { language } = useI18n();
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [newNotification, setNewNotification] = useState({ title_ar: '', title_en: '', message_ar: '', message_en: '', type: 'info' });

    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => handleFirestoreError(err, OperationType.GET, 'notifications'));
        return () => unsubscribe();
    }, []);

    const handleSendNotification = async () => {
        if (!newNotification.title_ar || !newNotification.message_ar) return;
        try {
            await addDoc(collection(db, 'notifications'), {
                ...newNotification,
                createdAt: new Date().toISOString(),
                isRead: false
            });
            setNewNotification({ title_ar: '', title_en: '', message_ar: '', message_en: '', type: 'info' });
            addToast(language === 'ar' ? 'تم إرسال الإشعار بنجاح' : 'Notification sent successfully', 'success');
        } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, 'notifications');
            addToast(language === 'ar' ? 'فشل في إرسال الإشعار' : 'Failed to send notification', 'error');
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'notifications', id));
            addToast(language === 'ar' ? 'تم حذف الإشعار' : 'Notification deleted', 'info');
        } catch (err) {
            handleFirestoreError(err, OperationType.DELETE, 'notifications');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <h2 className="text-4xl font-black text-slate-800 uppercase flex items-center gap-4">
                <BellIcon className="w-10 h-10 text-primary" />
                {language === 'ar' ? 'مركز بث الإشعارات' : 'System Broadcast Center'}
            </h2>
            
            <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-gray-100">
                <h3 className="text-2xl font-black mb-8 text-primary">{language === 'ar' ? 'إرسال إشعار جديد' : 'Send New Notification'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">العنوان (عربي)</label>
                        <input 
                            type="text" 
                            value={newNotification.title_ar}
                            onChange={e => setNewNotification({...newNotification, title_ar: e.target.value})}
                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Title (EN)</label>
                        <input 
                            type="text" 
                            value={newNotification.title_en}
                            onChange={e => setNewNotification({...newNotification, title_en: e.target.value})}
                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">الرسالة (عربي)</label>
                        <textarea 
                            value={newNotification.message_ar}
                            onChange={e => setNewNotification({...newNotification, message_ar: e.target.value})}
                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm h-24"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Message (EN)</label>
                        <textarea 
                            value={newNotification.message_en}
                            onChange={e => setNewNotification({...newNotification, message_en: e.target.value})}
                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm h-24"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">نوع الإشعار</label>
                        <select 
                            value={newNotification.type}
                            onChange={e => setNewNotification({...newNotification, type: e.target.value})}
                            className="w-full p-5 bg-white border-2 border-transparent focus:border-primary rounded-2xl font-bold outline-none shadow-sm"
                        >
                            <option value="info">معلومات (Info)</option>
                            <option value="success">نجاح (Success)</option>
                            <option value="warning">تحذير (Warning)</option>
                            <option value="error">خطأ (Error)</option>
                        </select>
                    </div>
                </div>
                <button 
                    onClick={handleSendNotification}
                    className="w-full mt-10 py-6 bg-primary text-white rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-all"
                >
                    {language === 'ar' ? 'بث الإشعار للجميع' : 'Broadcast Notification to All'}
                </button>
            </div>

            <div className="space-y-6">
                {(notifications || []).map(n => (
                    <div key={n.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                n.type === 'success' ? 'bg-green-100 text-green-600' :
                                n.type === 'error' ? 'bg-red-100 text-red-600' :
                                n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                <BellIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl text-primary">{language === 'ar' ? n.title_ar : n.title_en}</h4>
                                <p className="text-sm font-bold text-slate-600">{language === 'ar' ? n.message_ar : n.message_en}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-2">{new Date(n.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDeleteNotification(n.id)}
                            className="p-4 bg-red-50 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                        >
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
