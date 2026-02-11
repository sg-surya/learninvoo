'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-10 right-10 z-[200] space-y-4 flex flex-col items-end pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className="relative group p-0.5 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-500 shadow-2xl">
                                <div className="bg-white rounded-[0.9rem] py-3 px-5 flex items-center gap-4 min-w-[300px] border border-white/40">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-lime-50 text-lime-500' :
                                            toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {toast.type === 'success' ? <CheckCircle2 size={20} /> :
                                            toast.type === 'error' ? <AlertCircle size={20} /> : <Sparkles size={20} />}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                            {toast.type === 'success' ? 'Synchronized' : 'Neural Error'}
                                        </p>
                                        <p className="text-xs font-bold text-slate-800 tracking-tight">{toast.message}</p>
                                    </div>

                                    <button
                                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                        className="text-slate-200 hover:text-slate-400 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
