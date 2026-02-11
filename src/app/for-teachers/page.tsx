
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    Zap,
    Check,
    FileText,
    BarChart,
    Globe,
    Users,
    Plus,
    ShieldCheck,
    PlayCircle
} from 'lucide-react';

const ForTeachersPage = () => {
    const [scrolled, setScrolled] = useState(false);

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const handleScroll = () => setScrolled(container.scrollTop > 20);
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const comparison = [
        { feature: "Lesson Planning", traditional: "2-3 Hours / Week", learnivo: "30 Seconds / Instant" },
        { feature: "Question Creation", traditional: "Manual selection", learnivo: "AI-Generated Board Aligned" },
        { feature: "Answer Evaluation", traditional: "Take-home piles", learnivo: "Automated AI Rubrics" },
        { feature: "Language Support", traditional: "English/Hindi only", learnivo: "22+ Indian Languages" },
        { feature: "Student Tracking", traditional: "Subjective / Manual", learnivo: "Deep Analytics Dashboard" },
    ];

    return (
        <div className="h-screen w-full bg-slate-950 px-[10px] pb-[10px] overflow-hidden selection:bg-lime-600 selection:text-white">
            <div
                ref={scrollContainerRef}
                className="h-full w-full bg-white rounded-b-[10px] rounded-t-none overflow-y-auto overflow-x-hidden relative text-slate-900 font-sans shadow-2xl"
            >

                {/* HEADER SYSTEM */}
                <header className="sticky top-0 left-0 right-0 z-[999] overflow-hidden">
                    <nav className={`w-full flex items-center px-6 md:px-12 lg:px-20 border-b transition-all duration-300 ${scrolled ? 'h-16 shadow-md' : 'h-20'} bg-white/95 backdrop-blur-md border-slate-100`}>
                        <div className="w-full flex items-center justify-between mx-auto">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                    <BookOpen className="text-lime-400 group-hover:text-slate-950" size={18} />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-slate-950 uppercase">LEARNIVO</span>
                            </Link>
                            <div className="hidden lg:flex items-center gap-10">
                                <Link href="/for-teachers" className="text-[10px] font-extrabold text-slate-950 uppercase tracking-widest border-b-2 border-slate-950 pb-1">For Teachers</Link>
                                <Link href="/for-students" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest transition-colors">For Students</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest">Sign In</Link>
                                <motion.button whileTap={{ scale: 0.95 }} className="px-5 py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg">Start Free</motion.button>
                            </div>
                        </div>
                    </nav>
                </header>

                {/* HERO SECTION */}
                <main className="relative pt-44 md:pt-56 pb-20 px-6 md:px-12 lg:px-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 w-full">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded group">
                                <ShieldCheck size={14} className="text-lime-600" /> Save 15+ Hours Every Week
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-slate-950 leading-none tracking-tight uppercase">
                                AI for the <br />
                                <span className="text-lime-600">Modern Guru.</span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                                Handle administration instantly. <span className="text-slate-950 font-bold border-b-2 border-lime-400">Master your classroom.</span>
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <motion.button whileTap={{ scale: 0.95 }} className="h-16 px-8 bg-slate-950 text-white font-black uppercase text-xs tracking-widest rounded shadow-xl flex items-center gap-2">Start Designing <ArrowRight size={18} /></motion.button>
                                <div className="h-16 px-8 bg-white border border-slate-100 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 rounded">
                                    <PlayCircle size={20} /> Impact Hub
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner overflow-hidden aspect-video flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 w-full p-8">
                                    <div className="h-32 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm">
                                        <FileText className="text-lime-500" size={32} />
                                    </div>
                                    <div className="h-32 bg-slate-950 rounded-xl flex items-center justify-center">
                                        <Zap className="text-lime-400" size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BENTO GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-32 w-full">
                        <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-4 bg-slate-50 rounded-xl p-10 border border-slate-100 relative overflow-hidden group">
                            <div className="relative z-10 w-full md:w-2/3 space-y-4">
                                <div className="w-12 h-12 bg-white rounded shadow-sm flex items-center justify-center border border-slate-100">
                                    <FileText className="text-lime-600" size={24} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-950">AI Lesson Architect</h3>
                                <p className="text-slate-500 font-medium tracking-tight">Generate NEP-synced weekly plans instantly.</p>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950 pt-4">Explore Tool <ArrowRight size={14} /></button>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-2 bg-slate-950 rounded-xl p-10 text-white relative flex flex-col justify-between group">
                            <Plus className="text-lime-400" size={32} />
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Quiz Generator</h3>
                            <p className="text-slate-400 text-sm">Convert PDFs into balanced mock papers.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-2 bg-white rounded-xl p-8 border border-slate-100 flex flex-col justify-between transition-colors">
                            <Globe size={20} className="text-slate-400" />
                            <h4 className="text-lg font-bold uppercase text-slate-900 tracking-tight mt-10">22+ Languages</h4>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-2 bg-lime-50 rounded-xl p-8 border border-lime-100 flex flex-col justify-between">
                            <BarChart size={20} className="text-lime-600" />
                            <h4 className="text-lg font-bold uppercase text-slate-900 tracking-tight mt-10">Analytics</h4>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-2 bg-slate-50 rounded-xl p-8 border border-slate-100 flex flex-col justify-between">
                            <Users className="text-slate-950" size={32} />
                            <h3 className="text-xl font-bold uppercase mt-10">Hybrid Sync</h3>
                        </motion.div>
                    </div>

                    {/* COMPARISON SECTION */}
                    <section className="py-32 w-full">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-950 tracking-tighter">Efficiency <span className="text-slate-400">Metrics.</span></h2>
                        </div>

                        <div className="w-full bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Task</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Manual</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-lime-600">Learnivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comparison.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="p-8 font-black uppercase tracking-tighter text-slate-950 text-sm">{item.feature}</td>
                                            <td className="p-8 text-slate-400 font-medium text-sm">{item.traditional}</td>
                                            <td className="p-8 text-slate-950 font-bold text-sm bg-lime-400/5 transition-colors">
                                                <div className="flex items-center gap-2"><Check className="text-lime-600" size={16} /> {item.learnivo}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* REFERRAL HOOK */}
                    <section className="py-20 bg-lime-500 rounded-2xl p-12 text-center text-slate-950 mb-32 w-full">
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Community Power.</h3>
                        <p className="max-w-xl mx-auto font-bold uppercase tracking-tight text-sm mt-4">Refer a teacher and get <span className="bg-slate-950 text-white px-2 py-1 rounded">1 Month Pro Free</span>.</p>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="py-12 border-t border-slate-100 px-6 md:px-12 lg:px-20 flex justify-between items-center bg-white w-full">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 LEARNIVO. Built for gurus.</span>
                </footer>
            </div>
        </div>
    );
};

export default ForTeachersPage;
