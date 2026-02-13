'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, ChevronLeft, KeyRound, Check } from 'lucide-react';
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
        <div className="h-screen w-full bg-background px-[10px] pb-[10px] overflow-hidden selection:bg-lime-600 selection:text-white transition-colors duration-300">
            <div className="h-full w-full flex overflow-y-auto overflow-x-hidden font-sans rounded-b-[10px] rounded-t-none bg-card-bg shadow-2xl transition-colors duration-300">

                {/* 🟢 LEFT SIDE: Form Area */}
                <div className="w-full lg:w-[60%] bg-card-bg flex flex-col relative overflow-hidden transition-colors">
                    <header className="h-20 flex items-center px-12 md:px-16 lg:px-24 shrink-0 relative z-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                <BookOpen className="text-lime-400 group-hover:text-background" size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-foreground uppercase italic font-display">LEARNIVO<span className="text-lime-500">.</span></span>
                        </Link>
                    </header>

                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-lime-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex-1 flex flex-col justify-center items-center px-12 md:px-16 lg:px-24 py-12 relative z-10">
                        <AnimatePresence mode="wait">
                            {view === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <div className="w-full max-w-sm space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Welcome <br /> Back<span className="text-lime-500">.</span></h2>
                                            <p className="text-muted-foreground font-medium text-sm">Empowering the next generation of Indian educators.</p>
                                        </div>

                                        <form className="space-y-6" onSubmit={handleLogin}>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={18} />
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full h-14 pl-12 pr-6 bg-muted/30 border border-border rounded-2xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-sm text-foreground"
                                                            placeholder="arjun@school.com"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center ml-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setView('forgot')}
                                                            className="text-[10px] font-black uppercase tracking-widest text-lime-600 hover:text-lime-500"
                                                        >
                                                            Forgot?
                                                        </button>
                                                    </div>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={18} />
                                                        <input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="w-full h-14 pl-12 pr-6 bg-muted/30 border border-border rounded-2xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-sm text-foreground"
                                                            placeholder="••••••••"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setRememberMe(!rememberMe)}
                                                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-lime-500 border-lime-500' : 'border-border bg-muted/50'}`}
                                                >
                                                    {rememberMe && <Check size={12} className="text-background" />}
                                                </button>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Keep me signed in</span>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="submit"
                                                className="w-full h-14 bg-foreground text-background font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3"
                                            >
                                                Sign In Now <ArrowRight size={18} />
                                            </motion.button>
                                        </form>

                                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            New to Learnivo? <Link href="/register" className="text-lime-600 hover:text-lime-500">Create Account</Link>
                                        </p>
                                    </div>
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
                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                                    >
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
                                    </button>

                                    <h1 className="text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.9] mb-4">Reset <br /> <span className="text-lime-500">Access</span></h1>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mb-12">Recover your credentials securely.</p>

                                    {resetStep === 1 ? (
                                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Registered Email</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={18} />
                                                        <input
                                                            type="email"
                                                            value={resetEmail}
                                                            onChange={(e) => setResetEmail(e.target.value)}
                                                            className="w-full h-14 pl-12 pr-6 bg-muted/30 border border-border rounded-2xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-sm text-foreground"
                                                            placeholder="arjun@school.com"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="submit"
                                                className="w-full h-14 bg-foreground text-background font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                            >
                                                Verify Email <ArrowRight size={14} />
                                            </motion.button>
                                        </form>
                                    ) : (
                                        <form className="space-y-6" onSubmit={handleResetPassword}>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                                                    <div className="relative group">
                                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={18} />
                                                        <input
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="w-full h-14 pl-12 pr-6 bg-muted/30 border border-border rounded-2xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-sm text-foreground"
                                                            placeholder="••••••••"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="submit"
                                                className="w-full h-14 bg-lime-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                            >
                                                Update Credentials <Check size={14} />
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-auto pt-20 text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.4em]">
                            © 2026 LEARNIVO SECURE ACCESS
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex lg:w-[40%] bg-foreground relative overflow-hidden flex-col justify-end p-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-2xl">
                            <BookOpen className="text-lime-500" size={24} />
                        </div>
                        <h2 className="text-5xl font-black text-background leading-[0.9] tracking-tighter uppercase italic">Mastering <br /> the Art of <br /> Teaching.</h2>
                        <div className="h-1 w-24 bg-lime-500 rounded-full"></div>
                        <p className="text-background/60 text-sm font-medium leading-relaxed max-w-xs uppercase tracking-widest">Everything you need to run a modern AI-powered classroom in Bharat.</p>
                    </div>

                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
