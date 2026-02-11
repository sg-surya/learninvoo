
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    Check,
    Trophy,
    BrainCircuit,
    Calculator,
    ImageIcon,
    LayoutGrid,
    ShieldCheck,
    PlayCircle,
    QrCode
} from 'lucide-react';

const ForStudentsPage = () => {
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
        { feature: "Homework Help", traditional: "Searching 10+ websites", learnivo: "Instant AI Tutor 24/7" },
        { feature: "Concept Clarity", traditional: "Passive reading", learnivo: "Interactive Visuals" },
        { feature: "Exam Preparation", traditional: "Random Guesswork", learnivo: "Board-specific Mocks" },
        { feature: "Note Taking", traditional: "Manual copying", learnivo: "Auto-Summarized AI Notes" },
        { feature: "Doubt Clearing", traditional: "Waiting for classes", learnivo: "Native Language Support" },
    ];

    return (
        <div className="h-screen w-full bg-slate-950 p-[10px] overflow-hidden selection:bg-purple-500 selection:text-white">
            <div
                ref={scrollContainerRef}
                className="h-full w-full bg-white rounded-[10px] overflow-y-auto overflow-x-hidden relative text-slate-900 font-sans shadow-2xl"
            >

                {/* HEADER SYSTEM */}
                <header className="sticky top-0 left-0 right-0 z-[999] overflow-hidden">
                    <div className={`bg-slate-950 text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] px-4 transition-all duration-300 ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                        Bharat's Smartest Students <span className="text-purple-400 ml-1">Learn Better</span>
                    </div>
                    <nav className={`w-full flex items-center px-6 md:px-12 lg:px-20 border-b transition-all duration-300 ${scrolled ? 'h-16 shadow-md' : 'h-20'} bg-white/95 backdrop-blur-md border-slate-100`}>
                        <div className="w-full flex items-center justify-between mx-auto">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-purple-600 transition-colors">
                                    <BookOpen className="text-lime-400" size={18} />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-slate-950 uppercase">LEARNIVO</span>
                            </Link>
                            <div className="hidden lg:flex items-center gap-10">
                                <Link href="/for-teachers" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest transition-colors">For Teachers</Link>
                                <Link href="/for-students" className="text-[10px] font-extrabold text-slate-950 uppercase tracking-widest border-b-2 border-slate-950 pb-1">For Students</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest">Sign In</Link>
                                <motion.button whileTap={{ scale: 0.95 }} className="px-5 py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg">Join Hub</motion.button>
                            </div>
                        </div>
                    </nav>
                </header>

                {/* HERO SECTION */}
                <main className="relative pt-44 md:pt-56 pb-20 px-6 md:px-12 lg:px-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 w-full">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest rounded group">
                                <ShieldCheck size={14} className="text-purple-600" /> Dominate Your Board Exams
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-slate-950 leading-none tracking-tight uppercase">
                                Study Smarter. <br />
                                <span className="text-purple-600">Level up.</span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                                Localized AI for <span className="text-slate-950 font-bold border-b-2 border-purple-400">Total Academic Clarity.</span>
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <motion.button whileTap={{ scale: 0.95 }} className="h-16 px-10 bg-purple-600 text-white font-black uppercase text-xs tracking-widest rounded shadow-xl">Pro Access</motion.button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-purple-50 rounded-2xl p-10 border border-purple-100 shadow-inner overflow-hidden aspect-video flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="h-32 bg-white rounded-xl shadow-sm border border-purple-100 flex items-center justify-center">
                                        <Calculator className="text-purple-500" size={32} />
                                    </div>
                                    <div className="h-32 bg-slate-950 rounded-xl flex items-center justify-center">
                                        <BrainCircuit className="text-purple-400" size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BENTO GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-32 w-full">
                        <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-4 bg-purple-50 rounded-xl p-10 border border-purple-100 relative overflow-hidden group">
                            <div className="relative z-10 w-full md:w-2/3 space-y-4">
                                <div className="w-12 h-12 bg-white rounded shadow-sm flex items-center justify-center border border-purple-100">
                                    <BrainCircuit className="text-purple-600" size={24} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-950">24/7 Mentor</h3>
                                <p className="text-slate-500 font-medium">Get solutions in your mother tongue instantly.</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-2 bg-slate-950 rounded-xl p-10 text-white relative flex flex-col justify-between group overflow-hidden">
                            <Calculator className="text-purple-400" size={32} />
                            <h3 className="text-2xl font-bold uppercase mt-10">Equation Master</h3>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-2 bg-white rounded-xl p-8 border border-slate-100 flex flex-col justify-between hover:border-purple-300 transition-colors">
                            <ImageIcon size={20} className="text-purple-500" />
                            <h4 className="text-lg font-bold uppercase text-slate-900 tracking-tight mt-10">Visualizer</h4>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-2 bg-purple-600 rounded-xl p-8 text-white flex flex-col justify-between">
                            <Trophy size={20} className="text-white" />
                            <h4 className="text-lg font-bold uppercase mt-10">Exam Prep</h4>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="md:col-span-4 lg:col-span-2 bg-slate-50 rounded-xl p-8 border border-slate-100 flex flex-col justify-between">
                            <LayoutGrid className="text-slate-950" size={32} />
                            <h3 className="text-xl font-bold uppercase mt-10">Planner</h3>
                        </motion.div>
                    </div>

                    {/* COMPARISON SECTION */}
                    <section className="py-32 w-full">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-950 tracking-tighter">Student <span className="text-slate-400">Upgrade.</span></h2>
                        </div>

                        <div className="w-full bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Task</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Manual</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-purple-600">The Learnivo Way</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comparison.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="p-8 font-black uppercase tracking-tighter text-slate-950 text-sm">{item.feature}</td>
                                            <td className="p-8 text-slate-400 font-medium text-sm">{item.traditional}</td>
                                            <td className="p-8 text-slate-950 font-bold text-sm bg-purple-400/5 transition-colors">
                                                <div className="flex items-center gap-2"><Check className="text-purple-600" size={16} /> {item.learnivo}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* FINAL CTA WITH QR */}
                    <section className="py-20 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-black text-slate-950 uppercase">Carry AI in your pocket.</h3>
                            <motion.button whileTap={{ scale: 0.95 }} className="h-14 px-10 bg-purple-600 text-white font-black uppercase tracking-widest rounded shadow-xl">Start Free Trial</motion.button>
                        </div>
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-8">
                            <QrCode size={80} className="text-slate-950" />
                            <div className="text-left text-[10px] font-black uppercase text-slate-400">Scan to Download</div>
                        </div>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="py-12 border-t border-slate-100 px-6 md:px-12 lg:px-20 flex justify-between items-center bg-white w-full">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 LEARNIVO. Building Bharat's scholars.</span>
                </footer>
            </div>
        </div>
    );
};

export default ForStudentsPage;
