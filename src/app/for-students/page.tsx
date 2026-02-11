
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
    GraduationCap,
    Trophy,
    BarChart,
    BrainCircuit,
    MessageCircle,
    Clock,
    Layout,
    LayoutGrid,
    Calculator,
    ImageIcon
} from 'lucide-react';

const ForStudentsPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const comparison = [
        { feature: "Homework Help", traditional: "Searching 10+ websites", learnivo: "Instant AI Tutor 24/7" },
        { feature: "Concept Clarity", traditional: "Passive reading", learnivo: "Interactive Visuals" },
        { feature: "Exam Preparation", traditional: "Random Guesswork", learnivo: "Board-specific Mocks" },
        { feature: "Note Taking", traditional: "Manual copying", learnivo: "Auto-Summarized AI Notes" },
        { feature: "Doubt Clearing", traditional: "Waiting for classes", learnivo: "Native Language Support" },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-500 selection:text-white w-full overflow-x-hidden">

            {/* HEADER SYSTEM */}
            <header className="fixed top-0 left-0 right-0 z-[999] w-full">
                <div className={`bg-slate-950 text-white transition-all duration-300 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] px-4 ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                    Bharat's Smartest Students <span className="text-purple-400 ml-1">Learn Better</span>
                </div>
                <nav className={`w-full transition-all duration-300 bg-white border-b border-slate-100 flex items-center px-6 md:px-12 lg:px-20 ${scrolled ? 'h-16 shadow-md' : 'h-20'}`}>
                    <div className="w-full flex items-center justify-between mx-auto">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 bg-slate-950 flex items-center justify-center rounded group-hover:bg-purple-600 transition-colors">
                                <BookOpen className="text-lime-400" size={16} />
                            </div>
                            <span className="text-lg font-black tracking-tighter text-slate-950 uppercase">LEARNIVO</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-10">
                            <Link href="/for-teachers" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest transition-colors">For Teachers</Link>
                            <Link href="/for-students" className="text-[10px] font-extrabold text-slate-950 uppercase tracking-widest border-b-2 border-slate-950 pb-1">For Students</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest">Sign In</Link>
                            <button className="px-5 py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg">Join Hub</button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* HERO SECTION */}
            <main className="pt-44 md:pt-56 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
                <div className="space-y-8 text-center lg:text-left mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest rounded transition-colors group">
                        <Sparkles size={12} className="text-purple-600" /> Dominate Your Board Exams
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-none tracking-tight uppercase">
                        Study Smarter. <br />
                        <span className="text-purple-600">Level up.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                        Ditch the generic help. Get a personal AI tutor that speaks your language and knows your board's syllabus better than anyone. <span className="text-slate-950 font-bold border-b-2 border-purple-400">Total Academic Clarity.</span>
                    </p>
                </div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-32">
                    {/* Large Card: AI Tutor */}
                    <div className="md:col-span-4 lg:col-span-4 bg-purple-50 rounded-3xl p-10 border border-purple-100 relative overflow-hidden group">
                        <div className="relative z-10 w-full md:w-2/3 space-y-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-purple-100">
                                <BrainCircuit className="text-purple-600" size={24} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-950">24/7 Instant Mentor</h3>
                            <p className="text-slate-500 font-medium">Get step-by-step solutions for Math, Science, and Social Studies in your mother tongue. No more waiting for the next class to clear doubts.</p>
                            <div className="flex items-center gap-3 pt-4">
                                <div className="px-3 py-1 bg-white border border-purple-100 rounded-full text-[9px] font-black text-purple-600 uppercase">JE/NEET Aligned</div>
                                <div className="px-3 py-1 bg-white border border-purple-100 rounded-full text-[9px] font-black text-purple-600 uppercase">CBSE/UPB</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
                    </div>

                    {/* Medium Card: Math Solver */}
                    <div className="md:col-span-4 lg:col-span-2 bg-slate-950 rounded-3xl p-10 text-white relative flex flex-col justify-between group overflow-hidden">
                        <div className="absolute inset-0 bg-dot-white opacity-5" />
                        <div className="relative z-10 space-y-4">
                            <Calculator className="text-purple-400" size={32} />
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Equation Master</h3>
                            <p className="text-slate-400 text-sm">Upload a photo of any tough math problem. Get a full logic breakdown instantly.</p>
                        </div>
                        <div className="mt-8 relative h-10 w-full bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                            <div className="h-1 w-full bg-purple-500/30 rounded-full overflow-hidden">
                                <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* Small Card: Visualizer */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between hover:border-purple-300 transition-colors">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100"><ImageIcon size={20} className="text-purple-500" /></div>
                        <div className="mt-8">
                            <h4 className="text-lg font-bold uppercase text-slate-900 tracking-tight">Concept Graphics</h4>
                            <p className="text-xs text-slate-500 mt-2">Text-to-Diagram AI to help you visualize complex biology or physics.</p>
                        </div>
                    </div>

                    {/* Small Card: Exam Hub */}
                    <div className="md:col-span-2 lg:col-span-2 bg-purple-600 rounded-3xl p-8 text-white flex flex-col justify-between">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><Trophy size={20} className="text-white" /></div>
                        <div className="mt-8">
                            <h4 className="text-lg font-bold uppercase tracking-tight">Exam Prep Hub</h4>
                            <p className="text-xs text-purple-100 mt-2">Personalized mock tests based on your previous scores.</p>
                        </div>
                    </div>

                    {/* Medium Card: Schedule */}
                    <div className="md:col-span-4 lg:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <LayoutGrid className="text-slate-950" size={32} />
                            <h3 className="text-xl font-bold uppercase">Personal Planner</h3>
                            <p className="text-slate-500 text-sm">AI creates your study schedule based on upcoming exams.</p>
                        </div>
                        <div className="flex gap-2 mt-8">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm" />)}
                        </div>
                    </div>
                </div>

                {/* COMPARISON SECTION */}
                <section className="py-32">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-950 tracking-tighter">The Upgrade <span className="text-slate-400">Path.</span></h2>
                        <p className="text-slate-500 font-medium">Why Bharat's toppers are leaving traditional methods behind.</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[2rem] shadow-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Comparison</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Traditional Routine</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-purple-600">The Learnivo Way</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {comparison.map((item, i) => (
                                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-8 font-black uppercase tracking-tighter text-slate-950 text-sm">{item.feature}</td>
                                        <td className="p-8 text-slate-400 font-medium text-sm">
                                            <div className="flex items-center gap-2 underline decoration-slate-200 underline-offset-4">{item.traditional}</div>
                                        </td>
                                        <td className="p-8 text-slate-950 font-bold text-sm bg-purple-400/5 group-hover:bg-purple-400/10 transition-colors">
                                            <div className="flex items-center gap-2"><Check className="text-purple-600" size={16} /> {item.learnivo}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-20 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
                    <div>
                        <h3 className="text-2xl font-black text-slate-950 uppercase">Ready to dominate your board?</h3>
                        <p className="text-slate-500 mt-2">Join 1M+ students building the future of Bharat.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-14 px-10 bg-purple-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xl shadow-purple-200">Start Learning Free <ArrowRight size={18} /></button>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="py-12 border-t border-slate-100 px-6 md:px-12 lg:px-20 flex justify-between items-center bg-white">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">© 2026 Learnivo AI Technologies.</span>
                <div className="flex gap-6">
                    <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Tutor Support</Link>
                    <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Privacy Hub</Link>
                </div>
            </footer>
        </div>
    );
};

export default ForStudentsPage;
