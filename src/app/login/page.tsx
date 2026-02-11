
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, Facebook, Twitter, Chrome, Linkedin } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="h-screen w-full bg-slate-950 p-[10px] overflow-hidden">
            <div className="h-full w-full flex overflow-y-auto overflow-x-hidden font-sans selection:bg-lime-600 selection:text-white rounded-[10px] bg-white shadow-2xl">

                {/* 🟢 LEFT SIDE: Login Form */}
                <div className="w-full lg:w-[60%] bg-white p-8 md:p-16 lg:p-24 flex flex-col relative overflow-hidden">

                    {/* Decorative Circles (Inspired by image) */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>

                    {/* Brand Header */}
                    <Link href="/" className="mb-20 inline-flex items-center gap-2 relative z-10 group">
                        <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                            <BookOpen className="text-lime-400 group-hover:text-slate-950" size={18} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">LEARNIVO<span className="text-lime-500">.</span></span>
                    </Link>

                    <div className="max-w-md w-full relative z-10">
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight mb-2">Sign In</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Access your personalized teaching workshop.</p>

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

                    <div className="mt-auto pt-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        © 2026 LEARNIVO AI PLATFORM
                    </div>
                </div>

                {/* 🟢 RIGHT SIDE: Branding / Accent (Inspired by image) */}
                <div className="hidden lg:flex lg:w-[40%] bg-lime-600 relative flex-col items-center justify-center p-12 overflow-hidden">
                    {/* Texture / Pattern overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clothe.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500 to-lime-700"></div>

                    {/* Decorative Shapes */}
                    <div className="absolute top-1/4 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl"></div>

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
                                Hello, <br /> Educator!
                            </h2>
                            <p className="text-white/80 max-w-xs text-xs font-bold uppercase tracking-widest leading-relaxed">
                                Join the revolution of localized AI education. Manage, teach, and scale with Bharat's smartest toolset.
                            </p>
                        </div>

                        {/* Social Links (Like the image) */}
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
