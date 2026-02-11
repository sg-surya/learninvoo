
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BookOpen,
    GraduationCap,
    ArrowRight,
    Sparkles,
    Calculator,
    ImageIcon,
    MessageCircle,
    Database,
    Layout,
    BookMarked,
    Trophy,
    BarChart3,
    Notebook,
    Zap
} from 'lucide-react';

const studentTools = [
    { icon: <Layout className="text-purple-600" />, title: "Lesson Planner", desc: "Craft your personal study schedule and weekly goals with our AI planner." },
    { icon: <Calculator className="text-blue-600" />, title: "Math Helper", desc: "Solve complex math problems with step-by-step logic and concept clarity." },
    { icon: <ImageIcon className="text-green-600" />, title: "Visual Generator", desc: "Turn text into diagrams, charts and visuals to understand concepts faster." },
    { icon: <MessageCircle className="text-pink-600" />, title: "AI Instant Tutor", desc: "Get instant answers to any curriculum query 24/7 with your personal bot." },
    { icon: <BookMarked className="text-orange-600" />, title: "My Library", desc: "Access all your textbooks, notes and curated study materials in one place." },
    { icon: <Database className="text-indigo-600" />, title: "My Workspace", desc: "A creative digital space for your assignments and personal projects." },
    { icon: <Zap className="text-yellow-600" />, title: "Instant Knowledge", desc: "Quick reference for formulas, dates and definitions across all subjects." },
    { icon: <Trophy className="text-red-600" />, title: "Exam Prep", desc: "Simulate board exams with real-time feedback on your performance." },
    { icon: <BarChart3 className="text-cyan-600" />, title: "Grade Tracker", desc: "Visual tracking of your scores across subjects to identify weak spots." },
    { icon: <Notebook className="text-emerald-600" />, title: "Digital Notebook", desc: "Smart note-taking that automatically summarizes and highlights key points." }
];

export default function ForStudentsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-20"></div>

            {/* Top Banner Matching Main Page */}
            <div className="bg-slate-950 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] relative z-[60] px-4">
                Localized AI Power for <span className="text-purple-400">Bharat's Students.</span>
            </div>

            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded-md rotate-[-6deg] shadow-lg">
                            <BookOpen className="text-lime-400" size={18} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter font-display uppercase">LEARNIVO</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Home</Link>
                        <Link href="/register">
                            <button className="px-4 py-2 bg-slate-950 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Join for Free</button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Balanced Sizing */}
            <section className="relative px-6 pt-40 pb-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-widest rounded-md mx-auto lg:mx-0">
                            <Sparkles size={12} /> The Ultimate Student Workspace
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-pro leading-tight font-display uppercase">
                            Study <br />
                            <span className="text-purple-600">Smarter.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                            From solving tough math problems to mastering board exams—Learnivo AI is your personal 24/7 study companion. Built for Bharat's top performers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                            <Link href="/register">
                                <button className="px-8 h-14 bg-purple-600 text-white font-bold rounded-xl text-lg hover:bg-purple-700 transition-pro shadow-xl shadow-purple-600/20 flex items-center gap-2">
                                    Start Learning Now <ArrowRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                    <div className="relative bg-slate-50 border border-slate-200 rounded-[3rem] p-10 flex items-center justify-center aspect-square overflow-hidden">
                        <GraduationCap className="text-purple-500/10" size={240} />
                        <div className="absolute inset-0 flex items-center justify-center p-10">
                            <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
                                <div className="h-6 w-32 bg-purple-50 rounded-lg"></div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                    <div className="h-2 w-[90%] bg-slate-100 rounded-full"></div>
                                    <div className="h-2 w-[80%] bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="h-20 bg-slate-50 rounded-xl"></div>
                                    <div className="h-20 bg-slate-50 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section - Clean & Usable */}
            <section className="py-24 bg-purple-600 text-white rounded-[4rem] mx-4 mb-20 relative overflow-hidden">
                <div className="px-6 max-w-6xl mx-auto space-y-16">
                    <div className="space-y-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight">Your Study <span className="text-slate-900">Powerhouse.</span></h2>
                        <p className="text-purple-100 font-medium max-w-lg mx-auto">10 core features engineered to transform how you learn and succeed.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {studentTools.map((tool, i) => (
                            <div key={i} className="bg-white/10 border border-white/20 p-6 rounded-2xl group hover:bg-white/20 transition-all flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-lg text-slate-950 mb-4 group-hover:scale-110 transition-transform">
                                    {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 20 })}
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-tight mb-2 leading-tight">{tool.title}</h3>
                                <p className="text-[10px] text-purple-100 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                                    {tool.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 text-center space-y-8 bg-white border-t border-slate-50">
                <h2 className="text-4xl md:text-6xl font-black font-display uppercase">Ready to Level Up?</h2>
                <Link href="/register">
                    <button className="px-10 h-16 bg-purple-600 text-white font-black rounded-2xl text-xl hover:bg-purple-700 transition-all shadow-xl active:scale-95">Create Free Profile</button>
                </Link>
            </section>

            <footer className="py-12 border-t border-slate-100 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300">© 2026 Learnivo AI Technologies. Built for Students.</p>
            </footer>
        </div>
    );
}
