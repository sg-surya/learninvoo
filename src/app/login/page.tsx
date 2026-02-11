
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, LayoutGrid } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="h-screen w-full bg-slate-950 p-[10px] overflow-hidden">
            <div className="h-full w-full flex overflow-y-auto overflow-x-hidden font-sans selection:bg-lime-600 selection:text-white rounded-[10px] bg-white shadow-2xl">

                {/* 🟢 LEFT SIDE: Login Form */}
                <div className="w-full lg:w-[60%] bg-white flex flex-col relative overflow-hidden">
                    {/* Consistent Header Area - Fixed Jump */}
                    <header className="h-20 flex items-center px-12 md:px-16 lg:px-24 shrink-0 relative z-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                <BookOpen className="text-lime-400 group-hover:text-white" size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">LEARNIVO<span className="text-lime-500">.</span></span>
                        </Link>
                    </header>

                    {/* Decorative Circles */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>

                    <div className="flex-1 flex flex-col justify-center px-12 md:px-16 lg:px-24 py-12 relative z-10">
                        <div className="max-w-md w-full">
                            <h1 className="text-6xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-4">Sign <br /> <span className="text-lime-500">In</span></h1>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Access your personalized teaching workshop.</p>

                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@school.com"
                                        className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm text-slate-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm text-slate-800"
                                    />
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-200 text-lime-600 focus:ring-lime-500" />
                                        <label htmlFor="remember" className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer">Remember me</label>
                                    </div>
                                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-lime-600 hover:underline">Forgot?</Link>
                                </div>

                                <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="h-12 px-10 bg-lime-600 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl shadow-lime-600/20 hover:bg-lime-700 transition-all"
                                    >
                                        Sign In Now
                                    </motion.button>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        New user? <Link href="/register" className="text-lime-600 hover:underline">Register hub</Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="mt-auto pt-20 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                            © 2026 LEARNIVO AI PLATFORM
                        </div>
                    </div>
                </div>

                {/* 🟢 RIGHT SIDE: Creative Visual Sidebar */}
                <div className="hidden lg:flex lg:w-[40%] bg-slate-950 relative flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500 via-lime-600 to-emerald-700"></div>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>

                    <div className="absolute z-10 w-full h-full pointer-events-none">
                        <motion.div
                            initial={{ x: -20, y: -20, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute top-[15%] left-[10%] bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Vasu AI: Planning Lesson...</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, y: 20, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute bottom-[20%] right-[10%] bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl"
                        >
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-1 bg-lime-500/50 rounded-full" />)}
                                </div>
                                <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest">22+ Regional Languages</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="relative z-20 text-center space-y-8 flex flex-col items-center">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white p-4 flex items-center justify-center rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <BookOpen className="text-lime-600" size={40} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">LEARNIVO</span>
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
                                Smart <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic">Educator</span> <br /> Hub
                            </h2>
                            <p className="text-white/70 max-w-[280px] text-[10px] font-medium uppercase tracking-[0.2em] leading-relaxed mx-auto italic">
                                Orchestrate your classroom with Bharat's most advanced AI-Native interface.
                            </p>
                        </div>

                        <div className="pt-8">
                            <div className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                Trusted by 500+ Institutes
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            </div>
        </div>
    );
}
