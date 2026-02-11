
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative bg-dot-pro">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="bg-white border border-slate-200 p-10 lg:p-12 rounded-xl shadow-pro-lg relative overflow-hidden">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-lime-600"></div>

                    <div className="flex flex-col mb-10">
                        <Link href="/" className="mb-8 inline-flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center tracking-tighter">
                                <BookOpen className="text-lime-400" size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 font-display uppercase">LEARNIVO</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-pro">Log in to your account</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Welcome back! Please enter your details.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro font-medium text-sm text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                                <Link href="#" className="text-xs font-bold text-lime-600 hover:text-lime-700">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500/10 focus:border-lime-600 transition-pro font-medium text-sm text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-lime-600 focus:ring-lime-600" />
                            <label htmlFor="remember" className="text-sm font-semibold text-slate-600 select-none cursor-pointer">Remember for 30 days</label>
                        </div>

                        <button className="w-full h-11 bg-slate-900 text-white font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-pro flex items-center justify-center gap-2 group mt-2">
                            Sign In
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="w-full h-11 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition-pro">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Sign in with Google
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                        New to Learnivo? <Link href="/register" className="text-lime-600 font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
