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
        password: '',
        school: '',
        class: '',
        subjects: ''
    });
    const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false);

    const generateUsername = (name: string) => {
        const base = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
        if (!base) return '';

        const users = JSON.parse(localStorage.getItem('learnivo_users') || '[]');
        let username = base;
        let counter = 1;

        while (users.some((u: any) => u.username === username)) {
            username = `${base}${counter}`;
            counter++;
        }
        return username;
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => {
            const newUsername = !isUsernameManuallyEdited ? generateUsername(name) : prev.username;
            return { ...prev, fullName: name, username: newUsername };
        });
    };

    React.useEffect(() => {
        if (localStorage.getItem('learnivo_current_user')) {
            router.push('/dashboard');
        }
    }, [router]);

    const validateUsername = (username: string) => {
        const regex = /^[a-zA-Z0-9.]+$/;
        return regex.test(username);
    };

    const handleRegister = async (e: React.FormEvent) => {
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

        try {
            const api = await import('@/lib/api');
            const newUser = {
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName,
                role: role
            };

            await api.signup(newUser);

            // Auto login after signup
            const loginData = new FormData();
            loginData.append('username', formData.email);
            loginData.append('password', formData.password);

            const loginResponse = await api.login(loginData);
            if (loginResponse.access_token) {
                localStorage.setItem('access_token', loginResponse.access_token);
                const user = await api.getMe();
                // Store minimal user info
                localStorage.setItem('learnivo_current_user', JSON.stringify(user));

                router.push('/dashboard');
            }

        } catch (error: any) {
            console.error('Registration failed:', error);
            alert(error.message || 'Registration failed. Please try again.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
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
                                        <div className="w-full max-w-sm space-y-10">
                                            <div className="space-y-4">
                                                <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Choose Your <br /> Path<span className="text-lime-500">.</span></h2>
                                                <p className="text-muted-foreground font-medium text-sm italic">Are you ready to transform Bharat's education system?</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setRole('teacher')}
                                                    className={`p-6 rounded-3xl border-2 text-left transition-all ${role === 'teacher' ? 'border-lime-500 bg-lime-500/5' : 'border-border bg-muted/20 hover:border-lime-500/50'}`}
                                                >
                                                    <Presentation className={role === 'teacher' ? 'text-lime-500' : 'text-muted-foreground'} size={32} />
                                                    <p className="mt-4 font-black uppercase text-[10px] tracking-widest text-foreground">Teacher</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">AI Workshop</p>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setRole('student')}
                                                    className={`p-6 rounded-3xl border-2 text-left transition-all ${role === 'student' ? 'border-lime-500 bg-lime-500/5' : 'border-border bg-muted/20 hover:border-lime-500/50'}`}
                                                >
                                                    <GraduationCap className={role === 'student' ? 'text-lime-500' : 'text-muted-foreground'} size={32} />
                                                    <p className="mt-4 font-black uppercase text-[10px] tracking-widest text-foreground">Student</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Study Portal</p>
                                                </motion.button>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={!role}
                                                onClick={() => setStep(2)}
                                                className="w-full h-14 bg-foreground text-background font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                            >
                                                Continue to Profile <ArrowRight size={18} />
                                            </motion.button>

                                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                Already registered? <Link href="/login" className="text-lime-600 hover:text-lime-500">Sign In instead</Link>
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
                                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-black text-[10px] uppercase tracking-widest transition-colors"
                                        >
                                            <ChevronLeft size={16} /> Change Selection
                                        </button>

                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Complete <br /> Profile<span className="text-lime-500">.</span></h2>
                                            <p className="text-muted-foreground font-medium text-sm italic">Designing your identity as a {role === 'teacher' ? 'Guru' : 'Scholar'}.</p>
                                        </div>

                                        <form className="space-y-5" onSubmit={handleRegister}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={16} />
                                                        <input
                                                            type="text"
                                                            value={formData.fullName}
                                                            onChange={(e) => handleNameChange(e.target.value)}
                                                            className="w-full h-12 pl-10 pr-4 bg-muted/30 border border-border rounded-xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-xs text-foreground"
                                                            placeholder="Arjun Singh"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={16} />
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full h-12 pl-10 pr-4 bg-muted/30 border border-border rounded-xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-xs text-foreground"
                                                            placeholder="arjun@example.com"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                                                    <div className="relative group">
                                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={16} />
                                                        <input
                                                            type="text"
                                                            value={formData.username}
                                                            onChange={(e) => {
                                                                setFormData({ ...formData, username: e.target.value });
                                                                setIsUsernameManuallyEdited(true);
                                                            }}
                                                            className="w-full h-12 pl-10 pr-4 bg-muted/30 border border-border rounded-xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-xs text-foreground"
                                                            placeholder="arjun.singh"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lock Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={16} />
                                                        <input
                                                            type="password"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            className="w-full h-12 pl-10 pr-4 bg-muted/30 border border-border rounded-xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-xs text-foreground"
                                                            placeholder="••••••••"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 sm:col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{role === 'teacher' ? 'School/Institution' : 'Current School/Class'}</label>
                                                    <div className="relative group">
                                                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-lime-500 transition-colors" size={16} />
                                                        <input
                                                            type="text"
                                                            value={formData.school}
                                                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                                            className="w-full h-12 pl-10 pr-4 bg-muted/30 border border-border rounded-xl outline-none focus:border-lime-500 focus:bg-card-bg transition-all font-medium text-xs text-foreground"
                                                            placeholder={role === 'teacher' ? "Delhi Public School" : "10th Grade, VPS"}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="submit"
                                                className="w-full h-14 bg-foreground text-background font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 mt-6"
                                            >
                                                Finalize Registration <Activity size={18} />
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="mt-auto pt-20 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
                            © 2026 LEARNIVO SECURE REGISTRATION
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
                        <h2 className="text-5xl font-black text-background leading-[0.9] tracking-tighter uppercase italic">Redefining <br /> Bharat's <br /> Education.</h2>
                        <div className="h-1 w-24 bg-lime-500 rounded-full"></div>
                        <p className="text-background/60 text-sm font-medium leading-relaxed max-w-xs uppercase tracking-widest">Join the movement that's empowering millions of Indian classrooms.</p>
                    </div>

                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
