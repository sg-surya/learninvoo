
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
    ExternalLink,
    BrainCircuit,
    Rocket,
    Layout,
    Calculator,
    ImageIcon,
    MessageCircle,
    BookMarked,
    Database,
    Trophy,
    BarChart3,
    Notebook
} from 'lucide-react';

const studentTools = [
    { icon: <Layout className="text-purple-500" />, title: "Study Planner", desc: "Craft your personal study schedule and weekly goals with our AI engine." },
    { icon: <Calculator className="text-blue-500" />, title: "Math Solver", desc: "Solve complex problems with step-by-step logic and native explanations." },
    { icon: <ImageIcon className="text-green-500" />, title: "Visualizer AI", desc: "Turn hard-to-understand text into diagrams and charts instantly." },
    { icon: <MessageCircle className="text-pink-500" />, title: "24/7 AI Tutor", desc: "Instant answers to any curriculum query, anytime, in 22+ languages." },
    { icon: <BookMarked className="text-orange-500" />, title: "Resource Library", desc: "Access all your textbooks, notes and curated study materials in one place." },
    { icon: <Database className="text-indigo-500" />, title: "Smart Workspace", desc: "A creative digital space for your assignments and personal projects." },
    { icon: <Trophy className="text-red-500" />, title: "Board Mocks", desc: "Simulate board exams with real-time feedback on your weak spots." },
    { icon: <BarChart3 className="text-cyan-500" />, title: "Progress Tracker", desc: "Visual tracking of your scores across subjects to master your goals." }
];

const ForStudentsPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-500 selection:text-white w-full overflow-x-hidden">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-30"></div>

            {/* SHARED HEADER SYSTEM */}
            <header className="fixed top-0 left-0 right-0 z-[999] w-full">
                {/* Top Banner */}
                <div
                    className={`bg-slate-950 text-white transition-all duration-500 ease-in-out overflow-hidden flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] px-4 ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
                        }`}
                >
                    India's First AI Platform for <span className="text-lime-400 ml-1">Education (NEP 2020)</span>
                </div>

                {/* Navbar */}
                <nav
                    className={`w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center px-6 md:px-12 lg:px-20 ${scrolled ? 'h-16 shadow-lg' : 'h-20 shadow-sm'
                        }`}
                >
                    <div className="w-full flex items-center justify-between mx-auto">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded-lg rotate-[-6deg] shadow-lg group-hover:rotate-0 transition-transform">
                                <BookOpen className="text-lime-400" size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-950 font-display uppercase">
                                LEARNIVO<span className="text-lime-500">.</span>
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-10">
                            <Link href="/for-teachers" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                                For Teachers <ExternalLink size={10} />
                            </Link>
                            <Link href="/for-students" className="text-[10px] font-extrabold text-slate-950 uppercase tracking-widest flex items-center gap-1.5 transition-colors border-b-2 border-purple-500 pb-1">
                                For Students <ExternalLink size={10} />
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest px-2">
                                Sign In
                            </Link>
                            <Link href="/register">
                                <button className="px-5 py-2.5 bg-slate-950 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="relative pt-44 md:pt-56 pb-20 px-6 md:px-12 lg:px-20 w-full">
                <div className="w-full grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mx-auto">

                    <div className="space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-black uppercase tracking-[0.2em] rounded-full mx-auto lg:mx-0"
                        >
                            <Sparkles size={14} /> The Ultimate Student Operating System
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-pro leading-[0.95] text-slate-950 font-display uppercase"
                        >
                            Study <br />
                            Faster. <br />
                            <span className="text-purple-600">Smarter.</span>
                        </motion.h1>

                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed uppercase tracking-tighter">
                            From board exam prep to complex math solving. <span className="text-slate-950 border-b-4 border-purple-400 font-black">Learnivo AI is your 24/7 personal tutor.</span> Built for Bharat's top scholars.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link href="/register">
                                <button className="px-10 h-16 bg-purple-600 text-white font-black rounded-2xl text-[12px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-2xl shadow-purple-600/20 flex items-center gap-3 group">
                                    Join The Hub Now <Rocket size={20} className="group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Student Visual Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative hidden lg:block"
                    >
                        <div className="bg-slate-50 rounded-[4rem] p-12 border border-slate-100 shadow-inner relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-purple-400/20"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Trophy className="text-yellow-500" size={20} />
                                        </div>
                                        <div className="h-1.5 w-24 bg-slate-200 rounded-full"></div>
                                    </div>
                                    <Sparkles className="text-purple-500 animate-pulse" size={20} />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-24 w-full bg-white rounded-3xl shadow-sm border border-slate-50 flex items-center justify-center relative">
                                        <BrainCircuit className="text-purple-500/10" size={80} />
                                        <div className="absolute inset-0 flex items-center px-8">
                                            <div className="w-full space-y-3">
                                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 w-[65%]"></div>
                                                </div>
                                                <div className="h-1.5 w-[40%] bg-slate-50 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-white rounded-3xl shadow-sm border border-slate-50 p-6 flex flex-col justify-end gap-2 group-hover:bg-purple-600 transition-colors">
                                            <div className="h-1 w-12 bg-purple-100/50 rounded-full group-hover:bg-white/50"></div>
                                            <div className="h-1 w-full bg-purple-100/50 rounded-full group-hover:bg-white/50"></div>
                                        </div>
                                        <div className="h-32 bg-slate-950 rounded-3xl shadow-xl p-6 flex flex-col justify-end gap-2">
                                            <div className="h-1 w-12 bg-white/20 rounded-full"></div>
                                            <div className="h-1 w-full bg-white/20 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Panoramic Toolkit Grid */}
            <section className="py-32 px-6 md:px-12 lg:px-20 w-full bg-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-white opacity-5"></div>
                <div className="relative z-10 space-y-24">
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl md:text-7xl font-black font-display text-white uppercase tracking-tighter">
                            Academic <span className="text-slate-950 italic">Edge.</span>
                        </h2>
                        <p className="text-purple-100 font-bold uppercase tracking-widest text-[12px]">8 core features to dominate your curriculum</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {studentTools.map((tool, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white/10 border border-white/20 p-10 rounded-[3rem] group hover:bg-white transition-all duration-500"
                            >
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-slate-950 group-hover:text-white transition-all">
                                    {React.cloneElement(tool.icon as React.ReactElement, { size: 28 })}
                                </div>
                                <h3 className="text-xl font-black text-white group-hover:text-slate-950 uppercase tracking-tight mb-4">{tool.title}</h3>
                                <p className="text-purple-100 group-hover:text-slate-500 font-medium text-sm leading-relaxed mb-8 opacity-70 group-hover:opacity-100">
                                    {tool.desc}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-slate-950">
                                    Join Portal <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learning Hub Intro */}
            <section className="py-40 px-6 md:px-12 lg:px-20 w-full bg-white">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="order-2 lg:order-1 h-[400px] bg-slate-50 rounded-[4rem] border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <GraduationCap className="text-slate-200 group-hover:text-purple-500/20 group-hover:scale-125 transition-all duration-700" size={200} />
                    </div>
                    <div className="order-1 lg:order-2 space-y-12">
                        <div className="w-16 h-1.5 bg-purple-500 rounded-full"></div>
                        <h2 className="text-5xl md:text-7xl font-black font-display uppercase text-slate-950 leading-tight tracking-tight">
                            Native <br />
                            <span className="text-slate-400 italic">Excellence.</span>
                        </h2>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">
                            We understand the pressure of Indian exams. From <span className="text-slate-950 font-black">JEE to NEET and State Boards</span>, our AI is trained to explain concepts just like your favorite teacher.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {["JEE", "NEET", "CBSE", "ICSE", "CUET", "CLAT"].map(board => (
                                <span key={board} className="px-5 py-2 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-xl">{board}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 border-t border-slate-100 bg-white">
                <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-slate-950 flex items-center justify-center rounded-xl rotate-[-6deg]">
                            <BookOpen className="text-lime-400" size={20} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-950 font-display uppercase">LEARNIVO</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">© 2026 Learnivo AI Technologies. For the Scholars of Bharat.</p>
                </div>
            </footer>
        </div>
    );
};

export default ForStudentsPage;
