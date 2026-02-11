
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, Github } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#fcfdfa] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-100 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white/70 backdrop-blur-2xl border border-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center mb-10">
                        <Link href="/" className="mb-6">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                                <BookOpen className="text-lime-400" size={24} />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-slate-500 font-medium">Please enter your details to login</p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-lime-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 h-14 bg-white/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                <Link href="#" className="text-xs font-bold text-lime-600 hover:text-lime-700">Forgot Password?</Link>
                            </div>
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

                        <button className="w-full h-14 bg-black text-white font-black rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2">
                            Sign In
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-300">
                                <span className="bg-white px-4">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button className="h-14 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98]">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                Sign in with Google
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm font-medium text-slate-500">
                        Don't have an account? <Link href="/register" className="text-lime-600 font-bold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
