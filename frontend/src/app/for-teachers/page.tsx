'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Layers, Sun, Moon, Menu, X, Sparkles,
    BookOpen, Zap, Check, FileText, BarChart, Globe, Users,
    ShieldCheck, School, Award, Microscope, Clock,
    Twitter, Linkedin, Instagram, GraduationCap, PlayCircle
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function ForTeachersPage() {
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
        { feature: "Lesson Planning", traditional: "2-3 Hours / Week", learnivo: "30 Seconds / Instant" },
        { feature: "Question Creation", traditional: "Manual selection", learnivo: "AI-Generated Board Aligned" },
        { feature: "Answer Evaluation", traditional: "Take-home piles", learnivo: "Automated AI Rubrics" },
        { feature: "Language Support", traditional: "English/Hindi only", learnivo: "22+ Indian Languages" },
        { feature: "Student Tracking", traditional: "Subjective / Manual", learnivo: "Deep Analytics Dashboard" },
    ];

    const features = [
        { icon: School, title: "NEP 2020 Aligned", desc: "Automatically map your curriculum to the latest Indian education framework guidelines.", color: "from-blue-500 to-cyan-400" },
        { icon: Award, title: "Dynamic Grading", desc: "AI-assisted feedback that goes beyond marks—providing qualitative insights for every student.", color: "from-amber-500 to-orange-400" },
        { icon: Microscope, title: "Research Engine", desc: "Access a worldwide database of teaching resources curated specifically for your subject expertise.", color: "from-emerald-500 to-teal-400" },
        { icon: Clock, title: "Time Recovery", desc: "Reduce administrative overhead by 70%. Focus more on teaching, less on paperwork.", color: "from-rose-500 to-pink-400" },
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
                            <Link href="/for-teachers" className="lp-capsule-link lp-capsule-active">For Teachers</Link>
                            <Link href="/for-students" className="lp-capsule-link">For Students</Link>
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/5">
                            <Sparkles className="w-4 h-4 text-[#ccff00]" />
                            <span className="text-xs font-semibold tracking-widest uppercase text-[#ccff00]">AI-Powered Teacher Suite</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            Teach<br />
                            <span className="lp-text-gradient">Better.</span>
                        </h1>
                        <p className="text-lg opacity-50 leading-relaxed max-w-lg">
                            Learnivo empowers Bharat's educators with localized AI tools to automate planning, evaluation, and engagement. <span className="font-bold opacity-100">Built for NEP 2020.</span>
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register" className="lp-btn-primary px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
                                Create Free Account <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="lp-glass px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest inline-flex items-center gap-3">
                                <PlayCircle className="w-5 h-5" /> View Demo
                            </button>
                        </div>
                        <div className="flex gap-12 pt-8 border-t border-white/10">
                            <div><div className="text-3xl font-bold">10k+</div><div className="text-xs opacity-40 uppercase tracking-widest">Active Gurus</div></div>
                            <div><div className="text-3xl font-bold">22+</div><div className="text-xs opacity-40 uppercase tracking-widest">Languages</div></div>
                            <div><div className="text-3xl font-bold">15h</div><div className="text-xs opacity-40 uppercase tracking-widest">Saved Weekly</div></div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative group">
                        <div className="absolute -inset-6 bg-gradient-to-br from-[#007BFF]/20 to-[#ccff00]/20 blur-3xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="relative lp-glass p-6 rounded-3xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="lp-glass p-6 rounded-2xl flex flex-col justify-between h-40">
                                    <FileText className="w-8 h-8 opacity-40" />
                                    <div>
                                        <div className="h-2 w-20 bg-current opacity-10 rounded mb-2" />
                                        <div className="text-xs font-mono opacity-30 uppercase">Lesson Plan</div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#007BFF] to-[#a3e635] p-6 rounded-2xl flex flex-col justify-between h-40 text-black">
                                    <Zap className="w-8 h-8" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Active AI</span>
                                    </div>
                                </div>
                                <div className="col-span-2 lp-glass p-6 rounded-2xl flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <span className="text-sm font-bold">Evaluated 45 Papers</span>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-4/5 bg-gradient-to-r from-[#007BFF] to-[#ccff00] rounded-full" />
                                        </div>
                                    </div>
                                    <div className="ml-4 w-14 h-14 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] font-black text-xl">A+</div>
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

            {/* Bento Feature Highlights */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div whileHover={{ scale: 0.99 }} className="lg:col-span-7 lp-glass p-12 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#007BFF]/10 blur-[80px] group-hover:bg-[#007BFF]/20 transition-all" />
                        <div className="relative space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-4xl font-black tracking-tight leading-none">Vernacular<br />Intelligence</h3>
                            <p className="text-lg opacity-50 max-w-md">Supports 22+ Indian languages. Talk to the tool in Hindi, Bangla, or Tamil. The first AI that truly understands Bharat.</p>
                            <button className="flex items-center gap-2 text-[#ccff00] font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                View Language Matrix <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 0.99 }} className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-3xl relative overflow-hidden border border-white/5">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ccff00]/10 blur-3xl rounded-full" />
                        <div className="relative h-full flex flex-col justify-between min-h-[250px]">
                            <Users className="w-10 h-10 text-[#ccff00]" />
                            <div className="space-y-3 mt-8">
                                <h3 className="text-3xl font-bold tracking-tight">Classroom Sync</h3>
                                <p className="opacity-40 leading-relaxed">Connect with students in real-time. Share assignments, track progress, and provide instant guided learning.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">The Guru Factor.</h2>
                        <p className="opacity-40 uppercase text-sm tracking-widest">Why the best teachers are switching to AI workflows</p>
                    </div>
                    <div className="lp-glass rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest opacity-30">Teacher Task</th>
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest opacity-30">Traditional Way</th>
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest text-[#ccff00]">Learnivo Way ✅</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {comparison.map((item, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 md:p-8 font-bold text-lg">{item.feature}</td>
                                        <td className="p-6 md:p-8 opacity-40">{item.traditional}</td>
                                        <td className="p-6 md:p-8 font-bold text-[#ccff00]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-[#ccff00] flex items-center justify-center"><Check className="w-3 h-3 text-black" /></div>
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
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(204,255,0,0.08),transparent)]" />
                    <div className="relative space-y-10">
                        <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                            "Learnivo is no longer just a tool—it's my <span className="text-[#ccff00]">Teaching Co-pilot</span>. It understands the Indian classroom better than any generic AI."
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherProfile" className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 p-0.5" alt="Teacher" />
                            <div className="text-left">
                                <p className="font-bold">Dr. Ramesh Verma</p>
                                <p className="text-xs opacity-40 uppercase tracking-widest">Senior Mathematics Educator, Delhi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#ccff00] to-[#a3e635] rounded-[3rem] p-12 md:p-20 text-center text-black relative overflow-hidden group">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-pulse" />
                    <div className="relative">
                        <h3 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">Start Your<br />Guru Journey.</h3>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-10">Join 10,000+ teachers upgrading Bharat's education system.</p>
                        <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-black text-white font-bold uppercase text-sm tracking-widest rounded-2xl shadow-2xl hover:bg-black/80 transition-all">
                            Claim Your Free Trial <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer — Same as Landing */}
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
