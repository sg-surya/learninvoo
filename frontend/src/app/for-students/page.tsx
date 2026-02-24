'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Layers, Sun, Moon, Menu, X, Zap,
    Target, Lightbulb, BrainCircuit, Gamepad2, Brain,
    Languages, Check, ShieldCheck,
    Twitter, Linkedin, Instagram, MessageCircle, Sparkles
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function ForStudentsPage() {
    const [user, setUser] = useState<any>(null);
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        setIsDark(root.classList.contains('dark'));
        const obs = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
        obs.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, [theme]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('lp-visible'); }),
            { threshold: 0.1 }
        );
        document.querySelectorAll('.lp-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => setTheme(isDark ? 'Light' : 'Dark');

    const comparison = [
        { feature: "Doubt Clearing", traditional: "Asking teacher next day", learnivo: "Instant AI Response 24/7" },
        { feature: "Personalization", traditional: "Same for everyone", learnivo: "Your Pace, Your Style" },
        { feature: "Practice Tests", traditional: "Limited resources", learnivo: "Infinite Mock Papers" },
        { feature: "Language Support", traditional: "English only", learnivo: "Native Tongue Support" },
        { feature: "Memorization", traditional: "Rote learning", learnivo: "Visual Interactive Graphs" },
    ];

    const features = [
        { icon: Target, title: "Board Exam Mastery", desc: "Specific practice materials for CBSE, ICSE, and State Boards with previous year analysis.", color: "from-orange-500 to-amber-400" },
        { icon: Lightbulb, title: "AI Study Buddy", desc: "A personal tutor that explains complex concepts like a friend, simplified for your level.", color: "from-blue-500 to-indigo-400" },
        { icon: BrainCircuit, title: "Smart Summaries", desc: "Turn 20-page chapters into 5-minute key points with one click using our Chapter Reader.", color: "from-purple-500 to-violet-400" },
        { icon: Gamepad2, title: "Quest Mode", desc: "Gamified learning experience where every solved problem earns you rewards and rankings.", color: "from-emerald-500 to-teal-400" },
    ];

    return (
        <div className="lp-root" data-theme={isDark ? 'dark' : 'light'}>
            <div className="lp-bio-bg">
                <div className="lp-orb lp-orb-blue" />
                <div className="lp-orb lp-orb-lime" />
            </div>

            {/* Navigation — Same as Landing Page */}
            <nav className="lp-nav fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link href="/" className="lp-logo-link flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#007BFF] to-[#a3e635] rounded-xl flex items-center justify-center shadow-lg shadow-[#007BFF]/20 group-hover:shadow-[#a3e635]/30 transition-shadow duration-500">
                            <Layers className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tighter">LEARNIVO<span className="lp-dot">.AI</span></span>
                    </Link>

                    <div className="lp-nav-capsule-wrap items-center">
                        <div className="lp-nav-capsule">
                            <Link href="/for-teachers" className="lp-capsule-link">For Teachers</Link>
                            <Link href="/for-students" className="lp-capsule-link lp-capsule-active">For Students</Link>
                            <Link href="/for-admins" className="lp-capsule-link">For Admins</Link>
                            <Link href="/#pricing" className="lp-capsule-link">Pricing</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="lp-icon-btn" aria-label="Toggle theme">
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        {user ? (
                            <Link href="/dashboard" className="lp-btn-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold">Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="lp-login-btn hidden sm:flex">Login</Link>
                                <Link href="/register" className="lp-cta-btn">
                                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </>
                        )}
                        <button onClick={() => setMobileMenu(!mobileMenu)} className="lp-icon-btn lp-hamburger" aria-label="Menu">
                            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenu && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="lp-mobile-menu">
                            <div className="px-6 py-6 space-y-1">
                                <Link href="/for-teachers" onClick={() => setMobileMenu(false)} className="lp-mobile-link">For Teachers</Link>
                                <Link href="/for-students" onClick={() => setMobileMenu(false)} className="lp-mobile-link">For Students</Link>
                                <Link href="/for-admins" onClick={() => setMobileMenu(false)} className="lp-mobile-link">For Admins</Link>
                                <Link href="/#pricing" onClick={() => setMobileMenu(false)} className="lp-mobile-link">Pricing</Link>
                                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
                                    {user ? (
                                        <Link href="/dashboard" className="lp-btn-primary py-3 rounded-xl text-center text-sm uppercase tracking-widest font-bold">Dashboard</Link>
                                    ) : (
                                        <>
                                            <Link href="/login" className="lp-mobile-link">Login</Link>
                                            <Link href="/register" className="lp-cta-btn justify-center py-3 w-full">Get Started <ArrowRight className="w-3.5 h-3.5" /></Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5">
                            <Zap className="w-4 h-4 text-purple-400" fill="currentColor" />
                            <span className="text-xs font-semibold tracking-widest uppercase text-purple-400">Study 2x Faster with Vasu AI</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            Learn<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500">Faster.</span>
                        </h1>
                        <p className="text-lg opacity-50 leading-relaxed max-w-lg">
                            Don't just study—conquer. Learnivo works with your curriculum, speaks your language, and clears every doubt in seconds.
                        </p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="/register" className="lp-btn-primary px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
                                Start Free Learning <ArrowRight className="w-4 h-4" />
                            </Link>
                            <div className="flex items-center gap-3 px-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i}`} className="w-10 h-10 rounded-full border-2 border-black/80 bg-white/5" alt="" />
                                    ))}
                                </div>
                                <span className="text-xs font-bold opacity-50 uppercase tracking-widest">500k+ Joined</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                        <div className="absolute -inset-10 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="relative lp-glass p-6 rounded-3xl">
                            <div className="flex items-center justify-between p-4 lp-glass rounded-2xl mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center animate-bounce">
                                        <Brain className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold opacity-30 uppercase">Current Quest</div>
                                        <div className="text-sm font-bold">Organic Chem</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">85% XP</span>
                            </div>
                            <div className="space-y-4 p-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                                    <div className="lp-glass rounded-2xl p-4 text-xs leading-relaxed opacity-70">
                                        "A covalent bond is formed by the sharing of electron pairs between atoms..."
                                    </div>
                                </div>
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-bold shrink-0">SM</div>
                                    <div className="bg-purple-600 text-white rounded-2xl p-4 text-xs leading-relaxed text-right">
                                        "Can you explain that with a daily life example?"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Features */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }} className="lp-glass p-8 rounded-3xl group cursor-default">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                            <p className="text-sm opacity-50 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Vernacular Bento Section */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 grid md:grid-cols-2 gap-16 items-center relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_10%_10%,rgba(147,51,234,0.1),transparent)]" />
                    <div className="relative space-y-8">
                        <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-2xl">
                            <Languages className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tight leading-none">
                            English, Hindi,<br /><span className="text-purple-400">Anything.</span>
                        </h2>
                        <p className="text-lg opacity-40 max-w-md">Don't let language be a barrier. Ask questions in your native tongue and get explained in a way that feels natural.</p>
                        <div className="flex flex-wrap gap-2">
                            {['Hinglish', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati'].map(lang => (
                                <span key={lang} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest">{lang}</span>
                            ))}
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                        <div className="relative text-center space-y-4">
                            <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto flex items-center justify-center animate-bounce shadow-2xl shadow-purple-500/30">
                                <BrainCircuit className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-2xl font-black tracking-tight">Bharat's Smartest Tutor</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">Join the Evolution.</h2>
                        <p className="opacity-40 uppercase text-sm tracking-widest">Why smart students never use traditional coaching again</p>
                    </div>
                    <div className="lp-glass rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest opacity-30">Feature</th>
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest opacity-30">Traditional Coaching</th>
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest text-purple-400">Learnivo AI ✅</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {comparison.map((item, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 md:p-8 font-bold text-lg">{item.feature}</td>
                                        <td className="p-6 md:p-8 opacity-40">{item.traditional}</td>
                                        <td className="p-6 md:p-8 font-bold text-purple-400">
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-purple-400" />
                                                {item.learnivo}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(147,51,234,0.08),transparent)]" />
                    <div className="relative space-y-10">
                        <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                            "I used to spend hours on organic chemistry. Now, Vasu AI explains it like a <span className="text-purple-400">friend</span>, using examples I actually get."
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=StudentProfile" className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 p-0.5" alt="Student" />
                            <div className="text-left">
                                <p className="font-bold">Ananya Iyer</p>
                                <p className="text-xs opacity-40 uppercase tracking-widest">Class 12 Student, Bengaluru</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden group">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative">
                        <h3 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">Become a<br />Top Scorer.</h3>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-10">Join 500,000+ students learning Bharat's smartest way.</p>
                        <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-700 font-bold uppercase text-sm tracking-widest rounded-2xl shadow-2xl hover:bg-white/90 transition-all">
                            Start Free Learning <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#007BFF] to-[#a3e635] rounded-lg" />
                            <span className="text-xl font-extrabold tracking-tighter">LEARNIVO<span className="lp-dot">.AI</span></span>
                        </div>
                        <p className="opacity-40 max-w-xs">Building the intelligent infrastructure for the next billion students.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm opacity-50">
                            <li><Link href="/for-teachers" className="hover:text-[#ccff00] transition">Teacher OS</Link></li>
                            <li><Link href="/for-students" className="hover:text-[#ccff00] transition">Student Portal</Link></li>
                            <li><Link href="/for-admins" className="hover:text-[#ccff00] transition">Admin Panel</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm opacity-50">
                            <li><a href="#" className="hover:text-[#ccff00] transition">About Us</a></li>
                            <li><a href="#" className="hover:text-[#ccff00] transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#ccff00] transition">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm opacity-50">
                            <li><a href="#" className="hover:text-[#ccff00] transition">Documentation</a></li>
                            <li><a href="#" className="hover:text-[#ccff00] transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-[#ccff00] transition">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-30">
                    <p>© 2026 Learnivo AI Technologies Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#"><Twitter className="w-5 h-5" /></a>
                        <a href="#"><Linkedin className="w-5 h-5" /></a>
                        <a href="#"><Instagram className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
