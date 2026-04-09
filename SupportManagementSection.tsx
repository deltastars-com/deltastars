
import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, handleFirestoreError, OperationType } from '@/firebase';
import { useFirebase } from './lib/contexts/FirebaseContext';
import { MessageCircleIcon, SendIcon, UserIcon, ClockIcon, ShieldCheckIcon, XIcon, CheckCircleIcon } from './lib/contexts/Icons';

interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    status: 'open' | 'in-progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    lastMessageAt: string;
    messages: {
        senderId: string;
        senderName: string;
        text: string;
        createdAt: string;
        isAdmin: boolean;
    }[];
}

export const SupportManagementSection: React.FC<{ language: string }> = ({ language }) => {
    const { user } = useFirebase();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'support_tickets'), orderBy('lastMessageAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket)));
            setIsLoading(false);
        }, (err) => {
            handleFirestoreError(err, OperationType.GET, 'support_tickets');
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSendMessage = async () => {
        if (!selectedTicket || !newMessage.trim() || !user) return;

        const message = {
            senderId: user.id || 'admin',
            senderName: user.name || 'Admin',
            text: newMessage,
            createdAt: new Date().toISOString(),
            isAdmin: true
        };

        try {
            await updateDoc(doc(db, 'support_tickets', selectedTicket.id), {
                messages: [...selectedTicket.messages, message],
                lastMessageAt: message.createdAt,
                status: 'in-progress'
            });
            setNewMessage('');
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, 'support_tickets');
        }
    };

    const handleCloseTicket = async (ticketId: string) => {
        try {
            await updateDoc(doc(db, 'support_tickets', ticketId), {
                status: 'closed'
            });
        } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, 'support_tickets');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[800px] animate-fade-in">
            {/* Tickets List */}
            <div className="lg:col-span-4 bg-slate-50 rounded-[3rem] border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-8 bg-white border-b border-gray-100">
                    <h2 className="text-3xl font-black text-primary tracking-tighter uppercase">Support Tickets</h2>
                    <p className="text-gray-400 font-bold text-[10px] tracking-widest mt-1 uppercase">Live Customer Assistance</p>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-24 bg-white rounded-3xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 italic">No active tickets</div>
                    ) : tickets.map(ticket => (
                        <button 
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`w-full p-6 rounded-3xl text-right transition-all border-2 ${selectedTicket?.id === ticket.id ? 'bg-primary text-white border-primary shadow-xl scale-[1.02]' : 'bg-white text-slate-800 border-transparent hover:border-primary/20'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                                    ticket.status === 'open' ? 'bg-green-500 text-white' :
                                    ticket.status === 'closed' ? 'bg-gray-400 text-white' :
                                    'bg-blue-500 text-white'
                                }`}>
                                    {ticket.status}
                                </span>
                                <span className="text-[10px] font-black opacity-60 uppercase">{new Date(ticket.lastMessageAt).toLocaleTimeString()}</span>
                            </div>
                            <h4 className="font-black text-lg mb-1 line-clamp-1">{ticket.subject}</h4>
                            <p className={`text-xs font-bold ${selectedTicket?.id === ticket.id ? 'text-white/80' : 'text-gray-400'}`}>{ticket.userName}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-2xl flex flex-col overflow-hidden relative">
                {selectedTicket ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <UserIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primary tracking-tighter">{selectedTicket.userName}</h3>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{selectedTicket.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedTicket.status !== 'closed' && (
                                    <button 
                                        onClick={() => handleCloseTicket(selectedTicket.id)}
                                        className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                    >
                                        Close Ticket
                                    </button>
                                )}
                                <button onClick={() => setSelectedTicket(null)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-10 space-y-6 custom-scrollbar bg-slate-50/30">
                            {selectedTicket.messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-sm ${msg.isAdmin ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-gray-100'}`}>
                                        <div className="flex items-center gap-3 mb-2 opacity-60">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{msg.senderName}</span>
                                            <span className="text-[8px] font-bold">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="font-bold leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 border-t border-gray-100 bg-white">
                            {selectedTicket.status === 'closed' ? (
                                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-black uppercase tracking-widest text-xs">
                                    This ticket is closed and cannot be replied to
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your response here..."
                                        className="flex-grow p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-primary outline-none font-bold transition-all"
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        className="p-6 bg-primary text-white rounded-3xl hover:bg-green-800 transition-all shadow-xl group"
                                    >
                                        <SendIcon className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-20 text-center space-y-8">
                        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200 border-4 border-dashed border-slate-100">
                            <MessageCircleIcon className="w-16 h-16" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-300 uppercase tracking-tighter">Select a ticket to begin</h3>
                            <p className="text-gray-400 font-bold max-w-xs mx-auto mt-2">Real-time customer support station. Respond to inquiries and resolve issues instantly.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
