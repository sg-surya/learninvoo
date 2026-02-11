
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
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const handleContinue = () => {
        if (role) setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setRole(null);
    };

    return (
        <div className="min-h-screen bg-[#fcfdfa] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-lime-100 rounded-full blur-[100px] opacity-40"></div>

            <div className="w-full max-w-2xl z-10">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white/70 backdrop-blur-2xl border border-white p-10 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
                        >
                            <div className="flex flex-col items-center mb-12 text-center">
                                <Link href="/" className="mb-8">
                                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
                                        <BookOpen className="text-lime-400" size={28} />
                                    </div>
                                </Link>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Join Learnivo AI</h1>
                                <p className="text-slate-500 font-medium text-lg">Select how you'll be using the platform</p>
                            </div>

                            <div className="space-y-4">
                                {/* Teacher Option */}
                                <button
                                    onClick={() => setRole('teacher')}
                                    className={`w-full p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-6 group ${role === 'teacher'
                                            ? 'border-lime-500 bg-lime-50/50 shadow-lg shadow-lime-500/10'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${role === 'teacher' ? 'bg-lime-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                        }`}>
                                        <Presentation size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">I'm a Teacher</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-1">I'm here to create lesson plans and manage my classes.</p>
                                    </div>
                                    <div className={`ml-auto w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${role === 'teacher' ? 'border-lime-500 bg-lime-500' : 'border-slate-200 group-hover:border-slate-300'
                                        }`}>
                                        {role === 'teacher' && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                    </div>
                                </button>

                                {/* Student Option */}
                                <button
                                    onClick={() => setRole('student')}
                                    className={`w-full p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-6 group ${role === 'student'
                                            ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${role === 'student' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                        }`}>
                                        <GraduationCap size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">I'm a Student</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-1">I'm here to learn, complete assignments and track progress.</p>
                                    </div>
                                    <div className={`ml-auto w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${role === 'student' ? 'border-blue-500 bg-blue-500' : 'border-slate-200 group-hover:border-slate-300'
                                        }`}>
                                        {role === 'student' && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                    </div>
                                </button>
                            </div>

                            <div className="mt-10">
                                <button
                                    onClick={handleContinue}
                                    disabled={!role}
                                    className={`w-full h-16 rounded-[1.25rem] font-black text-xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${role
                                            ? 'bg-black text-white hover:bg-slate-800 shadow-black/10'
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        }`}
                                >
                                    Continue
                                    <ArrowRight size={20} />
                                </button>
                                <p className="mt-8 text-center text-sm font-medium text-slate-500 uppercase tracking-widest">
                                    Already have an account? <Link href="/login" className="text-lime-600 font-bold hover:underline">Log in</Link>
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
                            className="bg-white/70 backdrop-blur-2xl border border-white p-10 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
                        >
                            <button
                                onClick={handleBack}
                                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Change Role
                            </button>

                            <div className="mb-10 text-left">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                                    Complete your {role === 'teacher' ? 'Teacher' : 'Student'} Profile
                                </h1>
                                <p className="text-slate-500 font-medium">Final step to get started with Learnivo AI</p>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Jane Cooper"
                                            className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="jane@school.com"
                                            className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                        />
                                    </div>
                                </div>

                                {role === 'teacher' ? (
                                    <>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">School Name</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                                    <School size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Green Valley High"
                                                    className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Primary Subject</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                                    <BookMarked size={18} />
                                                </div>
                                                <select className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800 appearance-none">
                                                    <option>Mathematics</option>
                                                    <option>Science</option>
                                                    <option>Social Studies</option>
                                                    <option>English</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Grade / Class</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                                    <GraduationCap size={18} />
                                                </div>
                                                <select className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800 appearance-none">
                                                    {[6, 7, 8, 9, 10, 11, 12].map(g => <option key={g}>Class {g}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Student ID (Optional)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                                    <School size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="L-2026-99"
                                                    className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button className="w-full h-16 bg-black text-white font-black rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
                                        Create {role === 'teacher' ? 'Teacher' : 'Student'} Account
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
