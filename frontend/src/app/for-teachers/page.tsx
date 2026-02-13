
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    Zap,
    Check,
    FileText,
    BarChart,
    Globe,
    Users,
    Plus,
    ShieldCheck,
    PlayCircle,
    LayoutDashboard,
    School,
    Award,
    Microscope,
    Clock,
    Sparkles
} from 'lucide-react';

const ForTeachersPage = () => {
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
        { feature: "Lesson Planning", traditional: "2-3 Hours / Week", learnivo: "30 Seconds / Instant" },
        { feature: "Question Creation", traditional: "Manual selection", learnivo: "AI-Generated Board Aligned" },
        { feature: "Answer Evaluation", traditional: "Take-home piles", learnivo: "Automated AI Rubrics" },
        { feature: "Language Support", traditional: "English/Hindi only", learnivo: "22+ Indian Languages" },
        { feature: "Student Tracking", traditional: "Subjective / Manual", learnivo: "Deep Analytics Dashboard" },
    ];

    const teacherFeatures = [
        {
            title: "NEP 2020 Aligned",
            desc: "Automatically map your curriculum exactly to the latest Indian education framework guidelines.",
            icon: School,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Dynamic Grading",
            desc: "AI-assisted feedback that goes beyond marks—providing qualitative insights for every student.",
            icon: Award,
            color: "bg-amber-50 text-amber-600"
        },
        {
            title: "Research Engine",
            desc: "Access a worldwide database of teaching resources curated specifically for your subject expertise.",
            icon: Microscope,
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            title: "Time Recovery",
            desc: "Reduce administrative overhead by 70%. Focus more on teaching, less on paperwork.",
            icon: Clock,
            color: "bg-rose-50 text-rose-600"
        }
    ];

    return (
        <div className="h-screen w-full bg-background px-[10px] pb-[10px] overflow-hidden selection:bg-lime-600 selection:text-white transition-colors duration-300">
            <div
                ref={scrollContainerRef}
                className="h-full w-full bg-card-bg rounded-b-[10px] rounded-t-none overflow-y-auto overflow-x-hidden relative text-foreground font-sans shadow-2xl transition-colors duration-300"
            >

                {/* HEADER SYSTEM */}
                <header className="sticky top-0 left-0 right-0 z-[999] overflow-hidden">
                    <nav className={`w-full flex items-center px-6 md:px-12 lg:px-20 border-b transition-all duration-300 ${scrolled ? 'h-16 shadow-md' : 'h-20'} bg-header-bg backdrop-blur-md border-border`}>
                        <div className="w-full flex items-center justify-between mx-auto">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded group-hover:bg-lime-500 transition-colors">
                                    <BookOpen className="text-lime-400 group-hover:text-background" size={18} />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-foreground uppercase italic font-display">LEARNIVO</span>
                            </Link>
                            <div className="hidden lg:flex items-center gap-10">
                                <Link href="/for-teachers" className="text-[10px] font-extrabold text-foreground uppercase tracking-[0.2em] border-b-2 border-foreground pb-1">For Teachers</Link>
                                <Link href="/for-students" className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] transition-colors">For Students</Link>
                                <Link href="#" className="text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-[0.2em] transition-colors">Resources</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-foreground text-background text-[10px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-xl">
                                            Return to Dashboard <ArrowRight size={14} />
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
                                            <motion.button whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-foreground text-background text-[10px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-xl">Start Free</motion.button>
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
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-lime-500/20 shadow-sm"
                            >
                                <Sparkles size={14} /> AI-Powered Teacher Suite
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-foreground leading-[0.9] tracking-tighter uppercase italic font-display">
                                Teach <br />
                                <span className="text-lime-500 underline decoration-foreground underline-offset-8">Better</span>.
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
                                Learnivo empowers Bharat's educators with localized AI tools to automate planning, evaluation, and engagement. <span className="text-foreground font-bold">Built for NEP 2020.</span>
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-16 px-10 bg-foreground text-background font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl flex items-center gap-3">Create Free Account <ArrowRight size={18} /></motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-16 px-10 bg-card-bg border border-border text-foreground font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-sm flex items-center gap-3">
                                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                        <PlayCircle size={18} />
                                    </div>
                                    View Demo
                                </motion.button>
                            </div>

                            <div className="pt-10 flex flex-wrap justify-center lg:justify-start gap-8 items-center border-t border-border/50">
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-black text-foreground tracking-tighter italic">10k+</p>
                                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Active Gurus</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-black text-foreground tracking-tighter italic">22+</p>
                                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Local Languages</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-black text-foreground tracking-tighter italic">15h</p>
                                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Saved Weekly</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-lime-400/20 rounded-[3rem] blur-3xl group-hover:bg-lime-400/30 transition-all duration-500" />
                            <div className="relative bg-card-bg rounded-3xl p-4 border border-border shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                                <div className="w-full h-full bg-muted/30 rounded-[2rem] border border-border p-8 grid grid-cols-2 grid-rows-2 gap-4">
                                    <div className="bg-card-bg rounded-3xl p-6 shadow-sm border border-border flex flex-col justify-between">
                                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full" />
                                        <div className="h-2 w-2/3 bg-muted rounded-full" />
                                        <p className="text-[10px] font-black text-muted-foreground/30 uppercase">Lesson Plan</p>
                                    </div>
                                    <div className="bg-foreground rounded-3xl p-6 shadow-xl flex flex-col justify-between text-background">
                                        <div className="w-10 h-10 bg-lime-400 text-slate-950 rounded-xl flex items-center justify-center">
                                            <Zap size={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-background/20 rounded-full" />
                                            <div className="h-1.5 w-1/2 bg-background/20 rounded-full" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Active AI</p>
                                        </div>
                                    </div>
                                    <div className="bg-card-bg rounded-3xl p-6 shadow-sm border border-border col-span-2 flex items-center justify-between">
                                        <div className="space-y-3 flex-1">
                                            <p className="text-sm font-black text-foreground tracking-tight">Evaluated 45 Papers</p>
                                            <div className="h-3 w-4/5 bg-lime-500 rounded-full" />
                                        </div>
                                        <div className="w-14 h-14 bg-lime-50 rounded-2xl flex items-center justify-center text-lime-600 font-display font-black italic text-xl">
                                            A+
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CORE BENEFITS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                        {teacherFeatures.map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-card-bg p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <f.icon size={26} />
                                </div>
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tighter italic mb-3">{f.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* BENTO FEATURE HIGHLIGHTS */}
                    <div className="space-y-6 mb-32">
                        <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[400px]">
                            <motion.div whileHover={{ scale: 0.99 }} className="flex-1 bg-muted/30 rounded-3xl p-12 border border-border relative overflow-hidden group">
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-card-bg rounded-xl shadow-sm border border-border flex items-center justify-center">
                                            <Globe className="text-blue-600" size={24} />
                                        </div>
                                        <h3 className="text-4xl font-black uppercase text-foreground italic tracking-tighter leading-none">Vernacular <br /> Intelligence</h3>
                                        <p className="text-muted-foreground font-medium max-w-xs">Supports 22+ Indian languages. Talk to the tool in Hindi, Bangla, or Tamil.</p>
                                    </div>
                                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground group-hover:translate-x-2 transition-transform">
                                        View Language Matrix <ArrowRight size={14} />
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-lime-400/10 to-transparent pointer-events-none" />
                            </motion.div>

                            <motion.div whileHover={{ scale: 0.99 }} className="w-full md:w-[400px] bg-foreground rounded-3xl p-12 text-background relative overflow-hidden shadow-2xl">
                                <div className="h-full flex flex-col justify-between relative z-10">
                                    <Users className="text-lime-400" size={40} />
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-bold uppercase tracking-tight italic">Classroom Sync</h3>
                                        <p className="text-background/70 text-sm leading-relaxed">Connect with students in real-time. Share assignments & track progress live.</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl" />
                            </motion.div>
                        </div>
                    </div>

                    {/* COMPARISON - THE "BEFORE VS AFTER" */}
                    <section className="py-20 w-full mb-32">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black uppercase text-foreground tracking-tighter italic">The Guru <span className="text-muted-foreground/30">Factor.</span></h2>
                            <p className="text-muted-foreground font-medium tracking-tight uppercase">Why the best teachers are switching to AI workflows</p>
                        </div>

                        <div className="w-full bg-card-bg border border-border rounded-3xl shadow-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Teacher Task</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Traditional Way</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-lime-600 bg-lime-500/10">Learnivo Evolution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {comparison.map((item, i) => (
                                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-10 font-black uppercase tracking-tighter text-foreground text-lg">{item.feature}</td>
                                            <td className="p-10 text-muted-foreground font-medium text-base">{item.traditional}</td>
                                            <td className="p-10 text-foreground font-bold bg-lime-500/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center text-white scale-75 shadow-lg shadow-lime-500/20">
                                                        <Check size={14} />
                                                    </div>
                                                    {item.learnivo}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* QUOTE SECTION */}
                    <section className="relative px-12 py-24 mb-32 bg-foreground rounded-[3rem] text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(132,204,22,0.15),transparent)] pointer-events-none" />
                        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-background italic leading-tight uppercase tracking-tighter">
                                "Learnivo is no longer just a tool—it's my <span className="text-lime-400 underline decoration-white/20">Teaching Co-pilot</span>. It understands the Indian classroom context better than any generic AI."
                            </h3>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-background/10 p-1">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherProfile" className="w-full h-full object-contain" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-background uppercase tracking-widest text-sm">Dr. Ramesh Verma</p>
                                    <p className="text-[10px] font-bold text-background/50 uppercase tracking-widest">Senior Mathematics Educator, Delhi</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FINAL CALL TO ACTION */}
                    <section className="py-24 bg-lime-500 rounded-[3rem] p-12 text-center text-slate-950 mb-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
                        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none relative z-10">Start Your <br /> Guru Journey.</h3>
                        <p className="max-w-xl mx-auto font-black uppercase tracking-widest text-xs mt-6 mb-10 opacity-80 relative z-10">Join 10,000+ teachers upgrading Bharat's education system.</p>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#020617', color: '#ffffff' }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-white text-slate-950 font-black uppercase text-sm tracking-[0.3em] rounded-2xl shadow-xl transition-all relative z-10"
                        >
                            Claim Your Free Trial
                        </motion.button>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-card-bg/10 rounded-full blur-3xl transition-transform group-hover:scale-125" />
                    </section>
                </main>

                {/* FOOTER */}
                <footer className="py-16 border-t border-border px-6 md:px-12 lg:px-20 bg-card-bg w-full">
                    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-foreground flex items-center justify-center rounded">
                                <BookOpen className="text-lime-400" size={14} />
                            </div>
                            <span className="text-sm font-black text-foreground italic uppercase tracking-tighter">Learnivo Hub</span>
                        </div>
                        <div className="flex gap-10">
                            <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Privacy</a>
                            <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">Safety</a>
                            <a href="#" className="text-[10px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">LinkedIn</a>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">© 2026 LEARNIVO TECH. Made with ♥ for Indian Gurus.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ForTeachersPage;
