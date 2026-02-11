
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
    Sparkles,
    Lightbulb,
    Target,
    Rocket,
    Languages,
    Gamepad2,
    Search
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
        <div className="h-screen w-full bg-slate-950 px-[10px] pb-[10px] overflow-hidden selection:bg-purple-500 selection:text-white">
            <div
                ref={scrollContainerRef}
                className="h-full w-full bg-white rounded-b-[10px] rounded-t-none overflow-y-auto overflow-x-hidden relative text-slate-900 font-sans shadow-2xl"
            >

                {/* HEADER SYSTEM */}
                <header className="sticky top-0 left-0 right-0 z-[999] overflow-hidden">
                    <nav className={`w-full flex items-center px-6 md:px-12 lg:px-20 border-b transition-all duration-300 ${scrolled ? 'h-16 shadow-md' : 'h-20'} bg-white/95 backdrop-blur-md border-slate-100`}>
                        <div className="w-full flex items-center justify-between mx-auto">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-slate-950 flex items-center justify-center rounded group-hover:bg-purple-600 transition-colors">
                                    <BookOpen className="text-lime-400 group-hover:text-white" size={18} />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-slate-950 uppercase italic font-display">LEARNIVO</span>
                            </Link>
                            <div className="hidden lg:flex items-center gap-10">
                                <Link href="/for-teachers" className="text-[10px] font-bold text-slate-400 hover:text-slate-950 uppercase tracking-[0.2em] transition-colors">For Teachers</Link>
                                <Link href="/for-students" className="text-[10px] font-extrabold text-slate-950 uppercase tracking-[0.2em] border-b-2 border-slate-950 pb-1">For Students</Link>
                                <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-950 uppercase tracking-[0.2em] transition-colors">Student Hub</Link>
                            </div>
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-950 text-white text-[10px] font-black rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl">
                                            Open Learning Hub <ArrowRight size={14} />
                                        </Link>
                                        <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden shadow-sm p-0.5 bg-white">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                                                alt={user.fullName}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 uppercase tracking-widest">Sign In</Link>
                                        <Link href="/register">
                                            <motion.button whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-purple-600 text-white text-[10px] font-black rounded-xl hover:bg-purple-700 transition-all uppercase tracking-widest shadow-xl">Join Now</motion.button>
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
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100 shadow-sm"
                            >
                                <Rocket size={14} /> Built for Bharat's Students
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-slate-950 leading-[0.9] tracking-tighter uppercase italic font-display">
                                Learn <br />
                                <span className="text-purple-600 underline decoration-slate-950 underline-offset-8">Faster</span>.
                            </h1>
                            <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
                                Get 24/7 AI tutor help, visual study plans, and infinite practice for your board exams. <span className="text-slate-950 font-bold">Unblock your potential.</span>
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-16 px-12 bg-purple-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl flex items-center gap-3">Register to Start <ArrowRight size={18} /></motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-16 px-10 bg-white border border-slate-200 text-slate-900 font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-sm flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                        <Search size={18} />
                                    </div>
                                    Browse Benefits
                                </motion.button>
                            </div>

                            <div className="pt-10 flex flex-wrap justify-center lg:justify-start gap-8 items-center border-t border-slate-50">
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-black text-slate-950 tracking-tighter italic">50k+</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Students</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-black text-slate-950 tracking-tighter italic">98%</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concept Clarity</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-black text-slate-950 tracking-tighter italic">Zero</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wait Time</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-purple-400/20 rounded-[3rem] blur-3xl group-hover:bg-purple-400/30 transition-all duration-500" />
                            <div className="relative bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                                <div className="w-full h-full bg-slate-50 rounded-[2rem] border border-slate-100 p-8 grid grid-cols-2 grid-rows-2 gap-4">
                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden relative">
                                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                                            <Calculator size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Math Problem</p>
                                            <p className="text-xs font-bold text-slate-900 leading-tight">Solved in 2s</p>
                                        </div>
                                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                            <Check size={8} className="text-green-600" />
                                            <span className="text-[8px] font-black text-green-600 uppercase">Success</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-white">
                                        <div className="w-10 h-10 bg-purple-400 text-slate-950 rounded-xl flex items-center justify-center">
                                            <BrainCircuit size={20} />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Study AI</p>
                                        <p className="text-lg font-black tracking-tighter italic leading-none">Explain DNA replication like a movie.</p>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 col-span-2 flex items-center justify-between gap-6">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex justify-between items-end">
                                                <p className="text-sm font-black text-slate-900 tracking-tight italic uppercase">Rank #42</p>
                                                <p className="text-[10px] font-bold text-lime-600">+12% Growth</p>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full w-2/3 bg-purple-500 rounded-full" />
                                            </div>
                                        </div>
                                        <Trophy className="text-amber-400" size={32} />
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
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className={`w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center mb-6 border border-white shadow-inner group-hover:rotate-12 transition-transform`}>
                                    <b.icon size={26} />
                                </div>
                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter italic mb-3">{b.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{b.desc}</p>
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
                            <h2 className="text-5xl md:text-7xl font-black uppercase text-slate-950 tracking-tighter italic">Student <span className="text-slate-400">Upgrade.</span></h2>
                            <p className="text-slate-500 font-medium tracking-tight uppercase">Why top scorers are abandoning regular coaching for Learnivo</p>
                        </div>

                        <div className="w-full bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Activity</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Legacy Coaching</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.3em] text-purple-600 bg-purple-50/50">Learnivo Method</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comparison.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-10 font-black uppercase tracking-tighter text-slate-950 text-lg">{item.feature}</td>
                                            <td className="p-10 text-slate-400 font-medium">{item.traditional}</td>
                                            <td className="p-10 text-slate-950 font-bold bg-purple-50/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white scale-75 shadow-lg shadow-purple-600/30">
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
                <footer className="py-16 border-t border-slate-100 px-6 md:px-12 lg:px-20 bg-white w-full">
                    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-950 flex items-center justify-center rounded">
                                <BookOpen className="text-lime-400" size={14} />
                            </div>
                            <span className="text-sm font-black text-slate-950 italic uppercase tracking-tighter tracking-widest">Learnivo Hub</span>
                        </div>
                        <div className="flex gap-10">
                            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Privacy</a>
                            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Help</a>
                            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors">Instagram</a>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 LEARNIVO TECH. Empowering Bharat's Scholars.</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ForStudentsPage;
