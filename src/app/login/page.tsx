'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, ChevronLeft, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetStep, setResetStep] = useState(1);

    useEffect(() => {
        // Auth check
        if (localStorage.getItem('learnivo_current_user')) {
            router.push('/dashboard');
        }

        // Remember me check
        const rememberedEmail = localStorage.getItem('learnivo_remembered_email');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user) {
            if (rememberMe) {
                localStorage.setItem('learnivo_remembered_email', email);
            } else {
                localStorage.removeItem('learnivo_remembered_email');
            }
            localStorage.setItem('learnivo_current_user', JSON.stringify(user));
            router.push('/dashboard');
        } else {
            alert('Invalid email or password');
        }
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        const userExists = users.find((u: any) => u.email === resetEmail);

        if (userExists) {
            setResetStep(2);
        } else {
            alert('This email is not registered with us.');
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === resetEmail);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('learnivo_users', JSON.stringify(users));
            alert('Password successfully reset! Please login with your new credentials.');
            setView('login');
            setResetStep(1);
            setResetEmail('');
            setNewPassword('');
        }
    };

    return (
        <div className="h-screen w-full bg-slate-950 px-[10px] pb-[10px] overflow-hidden">
            <div className="h-full w-full flex overflow-y-auto overflow-x-hidden font-sans selection:bg-lime-600 selection:text-white rounded-b-[10px] rounded-t-none bg-white shadow-2xl">

                {/* 🟢 LEFT SIDE: Form Area */}
                <div className="w-full lg:w-[60%] bg-white flex flex-col relative overflow-hidden">
                    <header className="h-20 flex items-center px-12 md:px-16 lg:px-24 shrink-0 relative z-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                <BookOpen className="text-lime-400 group-hover:text-white" size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">LEARNIVO<span className="text-lime-500">.</span></span>
                        </Link>
                    </header>

                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>

                    <div className="flex-1 flex flex-col justify-center items-center px-12 md:px-16 lg:px-24 py-12 relative z-10">
                        <AnimatePresence mode="wait">
                            {view === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="max-w-md w-full"
                                >
                                    <h1 className="text-6xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-4">Sign <br /> <span className="text-lime-500">In</span></h1>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Access your personalized teaching workshop.</p>

                                    <form className="space-y-6" onSubmit={handleLogin}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="name@school.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm text-slate-800"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm text-slate-800"
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="remember"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-200 text-lime-600 focus:ring-lime-500 cursor-pointer"
                                                />
                                                <label htmlFor="remember" className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none">Remember me</label>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setView('forgot')}
                                                className="text-[10px] font-black uppercase tracking-widest text-lime-600 hover:underline"
                                            >
                                                Forgot?
                                            </button>
                                        </div>

                                        <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                className="h-12 px-10 bg-lime-600 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl shadow-lime-600/20 hover:bg-lime-700 transition-all"
                                            >
                                                Sign In Now
                                            </motion.button>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                New user? <Link href="/register" className="text-lime-600 hover:underline">Register hub</Link>
                                            </p>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="forgot"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-md w-full"
                                >
                                    <button
                                        onClick={() => { setView('login'); setResetStep(1); }}
                                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 group"
                                    >
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
                                    </button>

                                    <h1 className="text-6xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-4">Reset <br /> <span className="text-sky-500">Access</span></h1>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Recover your credentials securely.</p>

                                    {resetStep === 1 ? (
                                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Registered Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="name@school.com"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-sky-500 transition-all font-bold text-sm text-slate-800"
                                                    required
                                                />
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                className="w-full h-12 bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                            >
                                                Verify Email <ArrowRight size={14} />
                                            </motion.button>
                                        </form>
                                    ) : (
                                        <form className="space-y-6" onSubmit={handleResetPassword}>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-sky-500 transition-all font-bold text-sm text-slate-800"
                                                    required
                                                />
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                type="submit"
                                                className="w-full h-12 bg-sky-600 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                Update Credentials <KeyRound size={14} />
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-auto pt-20 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                            © 2026 LEARNIVO SECURE ACCESS
                        </div>
                    </div>
                </div>

                {/* 🟢 RIGHT SIDE: Visual Sidebar */}
                <div className="hidden lg:flex lg:w-[40%] bg-slate-950 relative flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500 via-lime-600 to-emerald-700"></div>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>

                    <div className="relative z-20 text-center space-y-8 flex flex-col items-center">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white p-4 flex items-center justify-center rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <BookOpen className="text-lime-600" size={40} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">LEARNIVO</span>
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-5xl xl:text-6xl font-black text-white uppercase tracking-tight leading-[0.9] drop-shadow-2xl">
                                Smart <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic pr-1">Educator</span> <br /> Hub
                            </h2>
                            <p className="text-white/70 max-w-[280px] text-[10px] font-medium uppercase tracking-[0.2em] leading-relaxed mx-auto italic">
                                Orchestrate your classroom with Bharat's most advanced AI-Native interface.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
