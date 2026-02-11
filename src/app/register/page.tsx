
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Mail,
    Lock,
    User,
    ArrowRight,
    Presentation,
    GraduationCap,
    ChevronLeft,
    Facebook,
    Twitter,
    Chrome,
    Linkedin
} from 'lucide-react';

type Role = 'teacher' | 'student' | null;

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(null);

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 p-[10px]">
            <div className="min-h-[calc(100vh-20px)] w-full flex overflow-hidden font-sans selection:bg-lime-500 selection:text-white rounded-[10px] bg-white">

                {/* 🟢 LEFT SIDE: Registration Form Side */}
                <div className="w-full lg:w-[60%] bg-white p-8 md:p-16 lg:px-24 flex flex-col relative overflow-hidden">

                    {/* Decorative Circles */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>

                    {/* Brand Header */}
                    <Link href="/" className="mb-12 inline-flex items-center gap-2 relative z-10 group">
                        <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                            <BookOpen className="text-lime-400 group-hover:text-slate-950" size={18} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">LEARNIVO<span className="text-lime-500">.</span></span>
                    </Link>

                    <div className="max-w-xl w-full relative z-10 flex-1 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Sign Up</h1>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Select your identity to initialize your portal.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Role Options */}
                                        <button
                                            onClick={() => setRole('teacher')}
                                            className={`p-6 rounded border-2 text-left transition-all flex flex-col gap-4 ${role === 'teacher' ? 'border-lime-500 bg-lime-50/30' : 'border-slate-50 bg-slate-50 hover:border-slate-100'}`}
                                        >
                                            <div className={`w-10 h-10 rounded flex items-center justify-center ${role === 'teacher' ? 'bg-slate-950 text-lime-400' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                                <Presentation size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tighter">Educator</h3>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Workspace</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setRole('student')}
                                            className={`p-6 rounded border-2 text-left transition-all flex flex-col gap-4 ${role === 'student' ? 'border-slate-950 bg-slate-50' : 'border-slate-50 bg-slate-50 hover:border-slate-100'}`}
                                        >
                                            <div className={`w-10 h-10 rounded flex items-center justify-center ${role === 'student' ? 'bg-slate-950 text-purple-400' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                                <GraduationCap size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tighter">Scholar</h3>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personal Learning</p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="pt-6 flex items-center gap-6">
                                        <button
                                            disabled={!role}
                                            onClick={() => setStep(2)}
                                            className={`h-12 px-10 font-black uppercase text-[10px] tracking-widest rounded shadow-xl transition-all ${role ? 'bg-lime-600 text-white shadow-lime-600/20 hover:bg-lime-700' : 'bg-slate-100 text-slate-300'}`}
                                        >
                                            Continue Step
                                        </button>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            Already joined? <Link href="/login" className="text-lime-600 hover:underline">Log in portal</Link>
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="space-y-10"
                                >
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 text-slate-400 hover:text-slate-950 font-black text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        <ChevronLeft size={16} /> Change Selection
                                    </button>

                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Profile Data</h1>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Finalize your digital identity for {role}.</p>
                                    </div>

                                    <form className="grid gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                            <input type="text" placeholder="Rahul Kumar" className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                                            <input type="email" placeholder="rahul@school.com" className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm" />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Set Access Key</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm" />
                                        </div>

                                        <div className="sm:col-span-2 pt-6">
                                            <button className="h-12 px-12 bg-lime-600 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl shadow-lime-600/20 hover:bg-lime-700 transition-all flex items-center justify-center gap-2">
                                                Register Identity <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-auto pt-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        © 2026 LEARNIVO SECURE REGISTRATION
                    </div>
                </div>

                {/* 🟢 RIGHT SIDE: Branding Sidebar */}
                <div className="hidden lg:flex lg:w-[40%] bg-lime-600 relative flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clothe.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500 to-lime-700"></div>

                    <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 text-center space-y-8 flex flex-col items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white flex items-center justify-center rounded shadow-2xl">
                                <BookOpen className="text-lime-600" size={28} />
                            </div>
                            <span className="text-4xl font-black tracking-tighter text-white uppercase italic">LEARNIVO</span>
                        </div>

                        <div className="h-px w-20 bg-white/20"></div>

                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                Welcome, <br /> Guest!
                            </h2>
                            <p className="text-white/80 max-w-xs text-xs font-bold uppercase tracking-widest leading-relaxed">
                                Start your journey with Bharat's most advanced AI platform. Experience content generation like never before.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            {[Facebook, Twitter, Chrome, Linkedin].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 border border-white/30 rounded flex items-center justify-center text-white hover:bg-white hover:text-lime-600 transition-all">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
