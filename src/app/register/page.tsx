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
    LayoutGrid,
    Activity,
    Sparkles,
    AtSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Role = 'teacher' | 'student' | null;

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: ''
    });

    React.useEffect(() => {
        if (localStorage.getItem('learnivo_current_user')) {
            router.push('/dashboard');
        }
    }, [router]);

    const validateUsername = (username: string) => {
        const regex = /^[a-zA-Z0-9.]+$/;
        return regex.test(username);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.username || !role) {
            alert('Please fill all fields');
            return;
        }

        if (!validateUsername(formData.username)) {
            alert('Username can only contain letters, numbers, and dots (.)');
            return;
        }

        // Save to LocalStorage
        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');

        // Check if email already exists
        if (users.find((u: any) => u.email === formData.email)) {
            alert('Email already registered');
            return;
        }

        // Check if username already exists
        if (users.find((u: any) => u.username === formData.username)) {
            alert('Username already taken. Please try another one.');
            return;
        }

        const newUser = { ...formData, role, id: Date.now(), createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('learnivo_users', JSON.stringify(users));
        localStorage.setItem('learnivo_current_user', JSON.stringify(newUser));

        // Redirect to Dashboard
        router.push('/dashboard');
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="h-screen w-full bg-slate-950 px-[10px] pb-[10px] overflow-hidden">
            <div className="h-full w-full flex overflow-y-auto overflow-x-hidden font-sans selection:bg-lime-600 selection:text-white rounded-b-[10px] rounded-t-none bg-white shadow-2xl">

                {/* 🟢 LEFT SIDE: Registration Form Side */}
                <div className="w-full lg:w-[60%] bg-white flex flex-col relative overflow-hidden text-slate-950">
                    <header className="h-20 flex items-center px-12 md:px-16 lg:px-24 shrink-0 relative z-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                <BookOpen className="text-lime-400 group-hover:text-white" size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">LEARNIVO<span className="text-lime-500">.</span></span>
                        </Link>
                    </header>

                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-lime-50 rounded-full opacity-50 pointer-events-none"></div>

                    <div className="flex-1 flex flex-col justify-center items-center px-12 md:px-16 lg:px-24 py-12 relative z-10">
                        <div className="max-w-xl w-full">
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
                                            <h1 className="text-6xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9]">Sign <br /> <span className="text-lime-500">Up</span></h1>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Select your identity to initialize your portal.</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            <h1 className="text-6xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9]">Profile <br /> <span className="text-lime-500">Data</span></h1>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Finalize your digital identity for {role}.</p>
                                        </div>

                                        <form className="grid gap-6 sm:grid-cols-2" onSubmit={handleRegister}>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Rahul Kumar"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="rahul@school.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Unique Username</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><AtSign size={14} /></span>
                                                    <input
                                                        type="text"
                                                        placeholder="rahul.ai"
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                                        className="w-full pl-10 pr-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm"
                                                        required
                                                    />
                                                </div>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Letters, numbers, and dots only</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Set Access Key</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded focus:outline-none focus:border-lime-500 transition-all font-bold text-sm"
                                                    required
                                                />
                                            </div>

                                            <div className="sm:col-span-2 pt-6">
                                                <button type="submit" className="h-12 px-12 bg-lime-600 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl shadow-lime-600/20 hover:bg-lime-700 transition-all flex items-center justify-center gap-2">
                                                    Register Identity <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="mt-auto pt-20 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                            © 2026 LEARNIVO SECURE REGISTRATION
                        </div>
                    </div>
                </div>

                {/* 🟢 RIGHT SIDE: Branding Sidebar */}
                <div className="hidden lg:flex lg:w-[40%] bg-slate-950 relative flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500 via-lime-600 to-emerald-700"></div>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>

                    <div className="relative z-20 text-center space-y-8 flex flex-col items-center">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white p-4 flex items-center justify-center rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <BookOpen className="text-lime-600" size={40} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">LEARNIVO</span>
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-5xl xl:text-6xl font-black text-white uppercase tracking-tight leading-[0.9] drop-shadow-2xl">
                                Future <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic pr-1">Starts</span> <br /> Here
                            </h2>
                            <p className="text-white/70 max-w-[280px] text-[10px] font-medium uppercase tracking-[0.2em] leading-relaxed mx-auto italic">
                                Join Bharat's elite educational network and leverage the power of Vasu AI.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
