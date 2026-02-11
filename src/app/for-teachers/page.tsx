
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Zap,
    Check,
    X,
    FileText,
    Target,
    BarChart,
    Globe,
    Users,
    Clock,
    ExternalLink,
    Plus
} from 'lucide-react';

const ForTeachersPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const comparison = [
        { feature: "Lesson Planning", traditional: "2-3 Hours / Week", learnivo: "30 Seconds / Instant" },
        { feature: "Question Creation", traditional: "Manual selection", learnivo: "AI-Generated Board Aligned" },
        { feature: "Answer Evaluation", traditional: "Take-home piles", learnivo: "Automated AI Rubrics" },
        { feature: "Language Support", traditional: "English/Hindi only", learnivo: "22+ Indian Languages" },
        { feature: "Student Tracking", traditional: "Subjective / Manual", learnivo: "Deep Analytics Dashboard" },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-500 selection:text-white w-full overflow-x-hidden">

            {/* HEADER SYSTEM */}
            <header className="fixed top-0 left-0 right-0 z-[999] w-full">
                <div className={`bg-slate-950 text-white transition-all duration-300 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] px-4 ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                    The Future of Indian <span className="text-lime-400 ml-1">Teaching is Here</span>
                </div>
                <nav className={`w-full transition-all duration-300 bg-white border-b border-slate-100 flex items-center px-6 md:px-12 lg:px-20 ${scrolled ? 'h-16 shadow-md' : 'h-20'}`}>
                    <div className="w-full flex items-center justify-between mx-auto">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                <BookOpen className="text-lime-400 group-hover:text-slate-950" size={16} />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-slate-950 uppercase">LEARNIVO</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-10">
                            <Link href="/for-teachers" className="text-[10px] font-extrabold text-slate-950 uppercase tracking-widest border-b-2 border-slate-950 pb-1">For Teachers</Link>
                            <Link href="/for-students" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest transition-colors">For Students</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest">Sign In</Link>
                            <button className="px-5 py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg">Start Free</button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* HERO SECTION */}
            <main className="pt-44 md:pt-56 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
                <div className="space-y-8 text-center lg:text-left mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded transition-colors group">
                        <Zap size={12} className="text-lime-600" /> Save 15+ Hours Every Week
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-none tracking-tight uppercase">
                        Built for the <br />
                        <span className="text-lime-600">Modern Guru.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                        A precise AI toolset engineered to handle high-volume administrative tasks, so you can focus back on what matters most: <span className="text-slate-950 font-bold border-b-2 border-lime-400">Your Students.</span>
                    </p>
                </div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-32">
                    {/* Large Card: Lesson Planner */}
                    <div className="md:col-span-4 lg:col-span-4 bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden group">
                        <div className="relative z-10 w-full md:w-2/3 space-y-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                <FileText className="text-lime-600" size={24} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-950">AI Lesson Architect</h3>
                            <p className="text-slate-500 font-medium">Generate NEP-synced weekly plans, pedagogical activities, and learning outcomes in any board format (CBSE, ICSE, UPB) in 30 seconds.</p>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950 pt-4 group-hover:gap-4 transition-all">Try Architect <ArrowRight size={14} /></button>
                        </div>
                        <div className="absolute top-10 right-10 hidden md:block w-32 h-32 bg-lime-200/20 rounded-full blur-3xl group-hover:bg-lime-300/30 transition-colors"></div>
                    </div>

                    {/* Medium Card: Question Gen */}
                    <div className="md:col-span-4 lg:col-span-2 bg-slate-950 rounded-3xl p-10 text-white relative flex flex-col justify-between group">
                        <div className="space-y-4">
                            <Plus className="text-lime-400 animate-spin-slow" size={32} />
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Rapid Quiz Generator</h3>
                            <p className="text-slate-400 text-sm">Convert any PDF or textbook chapter into a balanced board-style mock paper instantly.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-1 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: i + 1, repeat: Infinity }} className="h-full bg-lime-500" /></div>)}
                        </div>
                    </div>

                    {/* Small Card: Language */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><Globe size={20} className="text-slate-400" /></div>
                        <div className="mt-8">
                            <h4 className="text-lg font-bold uppercase text-slate-900 tracking-tight">Regional AI</h4>
                            <p className="text-xs text-slate-500 mt-2">Create content in Marathi, Tamil, Bengali and 19+ more languages.</p>
                        </div>
                    </div>

                    {/* Small Card: Analytics */}
                    <div className="md:col-span-2 lg:col-span-2 bg-lime-50 rounded-3xl p-8 border border-lime-100 flex flex-col justify-between">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm"><BarChart size={20} className="text-lime-600" /></div>
                        <div className="mt-8">
                            <h4 className="text-lg font-bold uppercase text-slate-900 tracking-tight">Smart Tracking</h4>
                            <p className="text-xs text-slate-600 mt-2">Identify weak topics for your whole class with heatmaps.</p>
                        </div>
                    </div>

                    {/* Large Card: Student Hub Connector */}
                    <div className="md:col-span-4 lg:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <Users className="text-slate-950" size={32} />
                            <h3 className="text-xl font-bold uppercase">Hybrid Sync</h3>
                            <p className="text-slate-500 text-sm">Automatic sync between your dashboard and student apps.</p>
                        </div>
                        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100 scale-90 -mb-2">
                            <div className="h-2 w-1/2 bg-slate-100 rounded-full mb-3" />
                            <div className="h-2 w-full bg-lime-100 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* COMPARISON SECTION */}
                <section className="py-32">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-950 tracking-tighter">The Efficiency <span className="text-slate-400">Gap.</span></h2>
                        <p className="text-slate-500 font-medium">Why Bharat's top educators are switching to Learnivo AI.</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[2rem] shadow-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Feature</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Traditional Method</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-lime-600">Learnivo AI Mode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {comparison.map((item, i) => (
                                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-8 font-black uppercase tracking-tighter text-slate-950 text-sm">{item.feature}</td>
                                        <td className="p-8 text-slate-400 font-medium text-sm">
                                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-200" /> {item.traditional}</div>
                                        </td>
                                        <td className="p-8 text-slate-950 font-bold text-sm bg-lime-400/5 group-hover:bg-lime-400/10 transition-colors">
                                            <div className="flex items-center gap-2"><Check className="text-lime-600" size={16} /> {item.learnivo}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* HUMAN DEVELOPER FOOTER CTA */}
                <section className="py-20 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
                    <div>
                        <h3 className="text-2xl font-black text-slate-950 uppercase">Ready to reclaim your time?</h3>
                        <p className="text-slate-500 mt-2">No credit card required. Bharat-ready infrastructure.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-14 px-8 bg-slate-950 text-white font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2">Get Started <ArrowRight size={18} /></button>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="py-12 border-t border-slate-100 px-6 md:px-12 lg:px-20 flex justify-between items-center bg-white">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">© 2026 Learnivo AI Technologies.</span>
                <div className="flex gap-6">
                    <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Support</Link>
                    <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Legal</Link>
                </div>
            </footer>
        </div>
    );
};

export default ForTeachersPage;
