
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
    ShieldCheck,
    GraduationCap,
    Presentation,
    School,
    BookMarked,
    ChevronLeft
} from 'lucide-react';

type Role = 'teacher' | 'student' | null;

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(null);

    const containerVariants = {
        hidden: { opacity: 0, x: 10 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -10 }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative bg-dot-pro">
            <div className="w-full max-w-[640px] z-10">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white border border-slate-200 p-10 lg:p-14 rounded-xl shadow-pro-lg relative"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-lime-600"></div>

                            <div className="flex flex-col mb-12">
                                <Link href="/" className="mb-8 inline-flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                                        <BookOpen className="text-lime-400" size={18} />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-slate-900 font-display uppercase">LEARNIVO</span>
                                </Link>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-pro">Create your account</h1>
                                <p className="text-sm text-slate-500 font-medium mt-1">Start your journey with Learnivo AI toolkit.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Teacher Option */}
                                <button
                                    onClick={() => setRole('teacher')}
                                    className={`p-6 rounded-lg border-2 text-left transition-pro flex flex-col gap-4 group ${role === 'teacher'
                                            ? 'border-lime-600 bg-lime-50/20'
                                            : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${role === 'teacher' ? 'bg-lime-600 text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'
                                        }`}>
                                        <Presentation size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">I'm a Teacher</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">I want to manage classes and create content.</p>
                                    </div>
                                    <div className={`mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-opacity ${role === 'teacher' ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-lime-600"></div> Selective
                                    </div>
                                </button>

                                {/* Student Option */}
                                <button
                                    onClick={() => setRole('student')}
                                    className={`p-6 rounded-lg border-2 text-left transition-pro flex flex-col gap-4 group ${role === 'student'
                                            ? 'border-slate-900 bg-slate-50'
                                            : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${role === 'student' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'
                                        }`}>
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">I'm a Student</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">I want to learn and complete my assignments.</p>
                                    </div>
                                    <div className={`mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-opacity ${role === 'student' ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div> Selective
                                    </div>
                                </button>
                            </div>

                            <div className="mt-10 space-y-4">
                                <button
                                    onClick={() => role && setStep(2)}
                                    className={`w-full h-12 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-pro ${role
                                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                        }`}
                                >
                                    Continue Registration
                                    <ArrowRight size={16} />
                                </button>
                                <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Already have an account? <Link href="/login" className="text-lime-600 hover:text-lime-700">Log in</Link>
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
                            className="bg-white border border-slate-200 p-10 lg:p-14 rounded-xl shadow-pro-lg relative"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-lime-600"></div>

                            <button
                                onClick={() => setStep(1)}
                                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Change Selection
                            </button>

                            <div className="mb-10">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-pro">
                                    Complete your {role} profile
                                </h1>
                                <p className="text-sm text-slate-500 font-medium mt-1">Almost there! Just a few more details.</p>
                            </div>

                            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-1.5 sm:col-span-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                    <input type="text" placeholder="Rahul Kumar" className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm" />
                                </div>
                                <div className="space-y-1.5 sm:col-span-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                                    <input type="email" placeholder="rahul@school.com" className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm" />
                                </div>

                                {role === 'teacher' ? (
                                    <>
                                        <div className="space-y-1.5 sm:col-span-1">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">School Name</label>
                                            <input type="text" placeholder="Green Valley High" className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm" />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-1">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Primary Subject</label>
                                            <select className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm appearance-none">
                                                <option>Mathematics</option><option>Science</option><option>English</option><option>Other</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1.5 sm:col-span-1">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Grade</label>
                                            <select className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm appearance-none">
                                                {[6, 7, 8, 9, 10, 11, 12].map(g => <option key={g}>Class {g}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-1">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Student ID (Opt)</label>
                                            <input type="text" placeholder="L-2026-01" className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm" />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-1.5 sm:col-span-2 pt-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Set Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro text-sm" />
                                </div>

                                <div className="sm:col-span-2 pt-4">
                                    <button className="w-full h-12 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-pro flex items-center justify-center gap-2">
                                        Create My Account
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
