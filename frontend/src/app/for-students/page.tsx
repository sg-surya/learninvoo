
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    Check,
    Trophy,
    BrainCircuit,
    Calculator,
    ImageIcon,
    LayoutGrid,
    ShieldCheck,
    PlayCircle,
    QrCode,
    Rocket,
    Languages,
    Gamepad2,
    Search,
    Zap,
    Brain,
    MessageCircle,
    Shield,
    Target,
    Lightbulb,
    Sparkles
} from 'lucide-react';

const ForStudentsPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const handleScroll = () => setScrolled(container.scrollTop > 20);
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const comparison = [
        { feature: "Doubt Clearing", traditional: "Asking teacher next day", learnivo: "Instant AI Response 24/7" },
        { feature: "Personalization", traditional: "Same for everyone", learnivo: "Your Pace, Your Style" },
        { feature: "Practice Tests", traditional: "Limited resources", learnivo: "Infinite Mock Papers" },
        { feature: "Language Support", traditional: "English only", learnivo: "Native Tongue Support" },
        { feature: "Memorization", traditional: "Rote learning", learnivo: "Visual Interactive Graphs" },
    ];

    const studentBenefits = [
        {
            title: "Board Exam Mastery",
            desc: "Specific practice materials for CBSE, ICSE, and State Boards with previous year analysis.",
            icon: Target,
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "AI Study Buddy",
            desc: "A personal tutor that explains complex concepts like a friend, simplified for your level.",
            icon: Lightbulb,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Smart Summaries",
            desc: "Turn 20-page chapters into 5-minute key points with one click using our Chapter Reader.",
            icon: BrainCircuit,
            color: "bg-purple-50 text-purple-600"
        },
        {
            title: "Quest Mode",
            desc: "Gamified learning experience where every solved problem earns you rewards and rankings.",
            icon: Gamepad2,
            color: "bg-emerald-50 text-emerald-600"
        }
    ];

    return (
        <div className="h-screen w-full bg-background px-[10px] pb-[10px] overflow-hidden selection:bg-purple-600 selection:text-white transition-colors duration-300">
            <div
                ref={scrollContainerRef}
                className="h-full w-full bg-card-bg rounded-b-[10px] rounded-t-none overflow-y-auto overflow-x-hidden relative text-foreground font-sans shadow-2xl transition-colors duration-300"
            >

                {/* HEADER SYSTEM */}
                <header className="sticky top-0 left-0 right-0 z-[999] overflow-hidden">
                    <nav className={`w-full flex items-center px-6 md:px-12 lg:px-20 border-b transition-all duration-300 ${scrolled ? 'h-16 shadow-md' : 'h-20'} bg-header-bg backdrop-blur-md border-border`}>
                        <div className="w-full flex items-center justify-between mx-auto">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded group-hover:bg-purple-500 transition-colors">
                                    <BookOpen className="text-purple-400 group-hover:text-background" size={18} />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-foreground uppercase italic font-display">LEARNIVO</span>
                            </Link>
                            <div className="hidden lg:flex items-center gap-10">
                                <Link href="/for-teachers" className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] transition-colors">For Teachers</Link>
                                <Link href="/for-students" className="text-[10px] font-extrabold text-foreground uppercase tracking-[0.2em] border-b-2 border-foreground pb-1">For Students</Link>
                                <Link href="#" className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] transition-colors">Course Finder</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-foreground text-background text-[10px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-xl">
                                            Open Portal <ArrowRight size={14} />
                                        </Link>
                                        <div className="w-10 h-10 rounded-xl border border-border overflow-hidden shadow-sm p-0.5 bg-card-bg">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                                                alt={user.fullName}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest">Sign In</Link>
                                        <Link href="/register">
                                            <motion.button whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-foreground text-background text-[10px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-xl">Join Now</motion.button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>

                {/* HERO SECTION */}
                <main className="relative pt-10 md:pt-16 pb-20 px-6 md:px-12 lg:px-20 w-full max-w-[1440px] mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                        <div className="space-y-8 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold uppercase tracking-tighter rounded-xl border border-purple-500/20 shadow-sm"
                            >
                                <Zap size={14} fill="currentColor" /> Study 2x Faster with Vasu AI
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-foreground leading-[0.85] tracking-tighter uppercase italic font-display">
                                Learn <br />
                                <span className="text-purple-600 bg-purple-500/10 px-4">Faster</span>.
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
                                Don't just study—conquer. Learnivo works with your curriculum, speaks your language, and clears every doubt in seconds.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-16 px-10 bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-2xl flex items-center gap-3">Start Free Learning <ArrowRight size={18} /></motion.button>
                                <div className="h-16 flex items-center gap-4 px-6 bg-card-bg border border-border rounded-2xl shadow-sm">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-card-bg bg-muted overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">500k+ Students Joined</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
                            <div className="relative bg-card-bg rounded-3xl p-6 border border-border shadow-2xl overflow-hidden aspect-[4/5] flex flex-col gap-6">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center animate-bounce">
                                            <Brain size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground/50 uppercase">Current Quest</p>
                                            <p className="text-sm font-black text-foreground uppercase tracking-tighter">Organic Chem</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full">85% XP</span>
                                </div>

                                <div className="flex-1 bg-muted/20 rounded-2xl border border-border/50 p-6 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-[10px] font-black">AI</div>
                                        <div className="flex-1 bg-card-bg rounded-2xl p-4 shadow-sm border border-border text-xs font-medium leading-relaxed text-foreground">
                                            "A covalent bond is formed by the sharing of electron pairs..."
                                        </div>
                                    </div>
                                    <div className="flex gap-4 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center text-[10px] font-black italic">SM</div>
                                        <div className="flex-1 bg-purple-600 rounded-2xl p-4 shadow-xl text-white text-xs font-medium leading-relaxed text-right">
                                            "Can you explain that with a daily life example?"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BENEFITS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                        {studentBenefits.map((b, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-card-bg p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
                            >
                                <div className={`w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                    <b.icon size={26} />
                                </div>
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tighter italic mb-3">{b.title}</h3>
                                <p className="text-sm text-muted-foreground font-semibold leading-relaxed relative z-10">{b.desc}</p>
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-muted/30 rounded-full blur-2xl group-hover:bg-purple-500/10" />
                            </motion.div>
                        ))}
                    </div>

                    {/* VERNACULAR HIGHLIGHT */}
                    <div className="bg-slate-950 rounded-3xl p-12 md:p-20 text-white flex flex-col lg:flex-row items-center gap-16 mb-32 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(147,51,234,0.1),transparent)] pointer-events-none" />
                        <div className="flex-1 space-y-8 relative z-10">
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Languages size={32} />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">English, Hindi, <br /> <span className="text-purple-400 underline decoration-white/20">Anything</span>.</h2>
                            <p className="text-xl text-slate-400 max-w-xl font-medium">Don't let language be a barrier. Ask questions in your native tongue and get explained in a way that feels natural.</p>
                            <div className="flex flex-wrap gap-3">
                                {['Hinglish', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati'].map(lang => (
                                    <span key={lang} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{lang}</span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-[450px] aspect-square bg-white/5 rounded-3xl border border-white/10 p-10 flex items-center justify-center backdrop-blur-3xl relative">
                            <div className="absolute -inset-10 bg-purple-500/20 blur-3xl rounded-full" />
                            <div className="relative text-center space-y-4">
                                <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
                                    <BrainCircuit size={40} />
                                </div>
                                <p className="text-2xl font-black italic uppercase tracking-tighter">Bharat's Smartest Tutor</p>
                            </div>
                        </div>
                    </div>

                    {/* STUDY COMPARISON */}
                    <section className="py-20 w-full mb-32">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-5xl md:text-8xl font-black uppercase text-foreground tracking-tighter italic">Join the <span className="text-muted-foreground/30">Evolution.</span></h2>
                            <p className="text-muted-foreground font-black tracking-tight uppercase text-xs">Why smart students never use traditional coaching again</p>
                        </div>

                        <div className="w-full bg-card-bg border border-border rounded-[3rem] shadow-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/30">
                                        <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Feature</th>
                                        <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Traditional Coaching</th>
                                        <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 bg-purple-500/10 underline">Learnivo AI Advantage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {comparison.map((item: any, i: number) => (
                                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-10 font-bold uppercase tracking-tighter text-foreground text-lg italic">{item.feature}</td>
                                            <td className="p-10 text-muted-foreground font-semibold text-sm">{item.traditional}</td>
                                            <td className="p-10 text-foreground font-black bg-purple-500/5">
                                                <div className="flex items-center gap-3">
                                                    <Check size={18} className="text-purple-600" />
                                                    {item.learnivo}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* QR DOWNLOAD SECTION */}
                    <section className="py-24 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-16 mb-20 w-full">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]">
                                <Sparkles size={14} className="text-amber-500" /> Beta Mobile Access
                            </div>
                            <h3 className="text-5xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">Your Campus <br /> in your Pocket.</h3>
                            <p className="text-lg text-slate-500 max-w-md font-medium">Download the mobile hub to study on the go, scan textbook problems with your camera, and get instant voice solutions.</p>
                            <div className="flex gap-4">
                                <motion.div whileHover={{ y: -5 }} className="px-6 py-4 bg-slate-950 rounded-2xl flex items-center gap-3 cursor-pointer shadow-xl">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xl"></span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] font-bold text-white/50 uppercase">App Store</p>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Coming Soon</p>
                                    </div>
                                </motion.div>
                                <motion.div whileHover={{ y: -5 }} className="px-6 py-4 bg-slate-950 rounded-2xl flex items-center gap-3 cursor-pointer shadow-xl">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xl">▶</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] font-bold text-white/50 uppercase">Play Store</p>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Get Hub App</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        <div className="p-10 bg-slate-50 border border-slate-200 rounded-[3rem] flex flex-col items-center gap-8 shadow-inner">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-2xl scale-110">
                                <QrCode size={120} className="text-slate-950" />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-black uppercase text-slate-950 tracking-[0.4em]">Scan for Pro Pass</p>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Limited to first 5,000 students</p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="py-16 border-t border-border px-6 md:px-12 lg:px-20 bg-card-bg w-full">
                    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-foreground flex items-center justify-center rounded">
                                <BookOpen className="text-purple-400" size={14} />
                            </div>
                            <span className="text-sm font-black text-foreground italic uppercase tracking-tighter">Learnivo Scholar Hub</span>
                        </div>
                        <div className="flex gap-10">
                            <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Privacy</a>
                            <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Terms</a>
                            <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Instagram</a>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">© 2026 LEARNIVO TECH. Bharat's AI Study Buddy.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ForStudentsPage;
