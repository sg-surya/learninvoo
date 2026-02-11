
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Presentation,
    ArrowRight,
    Languages,
    FileText,
    Zap,
    Target,
    Sparkles,
    Image as ImageIcon,
    MapPin,
    MessageSquare,
    ClipboardCheck,
    Cpu,
    ScanLine,
    ExternalLink
} from 'lucide-react';

const teacherTools = [
    { icon: <FileText className="text-lime-600" />, title: "Lesson Planner", desc: "Generate comprehensive weekly lesson plans tailored to your board." },
    { icon: <ImageIcon className="text-blue-600" />, title: "Visual Generator", desc: "Create simple drawings, diagrams or charts for your lessons instantly." },
    { icon: <MapPin className="text-orange-600" />, title: "Hyper Local Content", desc: "Create content tailored to your students' specific region." },
    { icon: <MessageSquare className="text-purple-600" />, title: "Story Generator", desc: "Generate creative stories for any topic or moral lesson in seconds." },
    { icon: <Target className="text-pink-600" />, title: "Quiz/Exam Generator", desc: "Create engaging quizzes and detailed exams tailored to your curriculum." },
    { icon: <ScanLine className="text-cyan-600" />, title: "Paper Digitizer", desc: "Digitize handwritten notes and student papers instantly." },
    { icon: <Cpu className="text-indigo-600" />, title: "Simulation Generator", desc: "Create interactive simulations for complex scientific concepts." },
    { icon: <ClipboardCheck className="text-emerald-600" />, title: "Rubric Generator", desc: "Design detailed grading rubrics for assignments and projects." }
];

export default function ForTeachersPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-lime-500 selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none bg-dot-pro z-0 opacity-20"></div>

            {/* Top Banner Matching Main Page */}
            <div className="bg-slate-950 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] relative z-[60] px-4">
                Localized AI Power for <span className="text-lime-400">Bharat's Educators.</span>
            </div>

            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded-md rotate-[-6deg]">
                            <BookOpen className="text-lime-400" size={18} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter font-display uppercase">LEARNIVO</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-950">Home</Link>
                        <Link href="/register">
                            <button className="px-4 py-2 bg-slate-950 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Get Started</button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Balanced Sizing */}
            <section className="relative px-6 pt-40 pb-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-50 border border-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-widest rounded-md">
                            <Sparkles size={12} /> Indian Educator's Super-Toolkit
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-pro leading-tight font-display uppercase">
                            Powering <br />
                            <span className="text-lime-600">Bharat's Gurus.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                            We've built the most comprehensive AI suite designed specifically for the unique workflows of Indian teachers. Reclaim 15+ hours every week.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/register">
                                <button className="px-8 h-14 bg-slate-950 text-white font-bold rounded-xl hover:bg-slate-800 transition-pro shadow-lg shadow-slate-950/20 flex items-center gap-2">
                                    Launch Teacher Portal <ArrowRight size={18} />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                    <div className="relative bg-slate-50 border border-slate-200 rounded-[2rem] p-10 flex items-center justify-center aspect-video overflow-hidden">
                        <Zap className="text-lime-500/20" size={200} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3/4 h-3/4 bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 translate-y-4">
                                <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                                <div className="h-8 w-full bg-slate-50 rounded-lg"></div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-100/50 rounded-full"></div>
                                    <div className="h-2 w-full bg-slate-100/50 rounded-full"></div>
                                    <div className="h-2 w-[80%] bg-slate-100/50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section - Clean & Usable */}
            <section className="py-24 bg-slate-950 text-white relative">
                <div className="px-6 max-w-6xl mx-auto space-y-16">
                    <div className="space-y-4 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight">AI Command <span className="text-lime-400">Toolkit.</span></h2>
                        <p className="text-slate-400 font-medium max-w-lg">8 tools designed to handle every aspect of your professional career.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teacherTools.map((tool, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl group hover:border-lime-500/50 transition-all">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white mb-6 group-hover:bg-lime-500 group-hover:text-slate-950 transition-colors">
                                    {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 20 })}
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-tight mb-2">{tool.title}</h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">{tool.desc}</p>
                                <div className="text-[10px] font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Launch Tool <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Board Alignment */}
            <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                    <h3 className="text-4xl font-black font-display uppercase tracking-tight">Board & NEP <span className="text-lime-600">Aligned.</span></h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">Curriculum alignment is at our core. We support NCERT, CBSE, ICSE, and various State Boards seamlessly.</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        {["CBSE", "ICSE", "NCERT", "NEP 2020"].map(t => (
                            <span key={t} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 rounded">{t}</span>
                        ))}
                    </div>
                </div>
                <div className="h-64 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
                    <Presentation size={80} className="text-slate-200" />
                </div>
            </section>

            <footer className="py-12 border-t border-slate-100 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300">© 2026 Learnivo AI Technologies. Built for Teachers.</p>
            </footer>
        </div>
    );
}
