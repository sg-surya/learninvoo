'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Wand2, GraduationCap, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    const items = [
        { name: 'Hyper Local Gen', category: 'Tools', icon: Wand2, url: '/tools/hyper-local' },
        { name: 'Lesson Planner', category: 'Tools', icon: Wand2, url: '/tools/lesson-planner' },
        { name: 'Class 9-B hub', category: 'Classes', icon: GraduationCap, url: '/classes/9b' },
        { name: 'Neural Library', category: 'Library', icon: GraduationCap, url: '/library' },
        { name: 'My Profile Hub', category: 'User', icon: Command, url: '/profile' },
        { name: 'Dashboard Home', category: 'Navigation', icon: Command, url: '/dashboard' },
    ];

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = (url: string) => {
        router.push(url);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                            <Search className="text-lime-500" size={24} />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Neural Search: Find tools, classes, or students..."
                                className="flex-1 bg-transparent text-xl font-bold text-slate-900 outline-none placeholder:text-slate-300 placeholder:italic"
                            />
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400">ESC</span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                            {filteredItems.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Categories would go here, simplified list for now */}
                                    <div className="grid grid-cols-1 gap-2">
                                        {filteredItems.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSelect(item.url)}
                                                className="w-full flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-lime-50 group transition-all text-left"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                                        <item.icon size={22} className="text-slate-400 group-hover:text-lime-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">{item.name}</h4>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-200 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <X size={24} className="text-slate-200" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase italic">No Matches Found</h3>
                                        <p className="text-xs text-slate-400 font-bold">Try searching for Classes or AI Tools</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 shadow-sm">
                                        <ArrowRight size={10} className="rotate-180" />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Navigate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 shadow-sm">
                                        ENTER
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-lime-600 uppercase tracking-[0.2em]">Learnivo Command Hub</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
