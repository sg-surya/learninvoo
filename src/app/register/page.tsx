
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#fcfdfa] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-lime-100 rounded-full blur-[100px] opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl z-10"
            >
                <div className="bg-white/70 backdrop-blur-2xl border border-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <Link href="/" className="mb-6">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                                <BookOpen className="text-lime-400" size={24} />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium">Join 5000+ educators using Learnivo AI</p>
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
                                    placeholder="Rahul Kumar"
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
                                    placeholder="rahul@school.com"
                                    className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>

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
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
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

                        <div className="md:col-span-2 pt-2">
                            <button className="w-full h-14 bg-black text-white font-black rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                Create Account
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Already have an account? <Link href="/login" className="text-lime-600 font-bold hover:underline">Log in here</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
