'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Layers, Sun, Moon, Menu, X, Zap,
    CreditCard, CalendarCheck, MessageSquare, PieChart, BarChart3,
    ClipboardList, Globe, Lock, Bell, FileSpreadsheet, School,
    ShieldCheck, Check,
    Twitter, Linkedin, Instagram, Building
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function ForAdminsPage() {
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
        { feature: "Fee Collection", traditional: "Manual registers, bank visits", learnivo: "Auto UPI/Bank Integration" },
        { feature: "Attendance", traditional: "Paper roll-call, proxies", learnivo: "QR + Biometric + AI Geo-fence" },
        { feature: "Parent Updates", traditional: "Written circulars", learnivo: "Auto WhatsApp & App Alerts" },
        { feature: "Report Generation", traditional: "Manual Excel entry", learnivo: "One-Click AI Analytics" },
        { feature: "Compliance", traditional: "Manual documentation", learnivo: "Auto NEP 2020 Compliance" },
    ];

    const features = [
        { icon: CreditCard, title: "Fee Automation", desc: "End-to-end fee lifecycle — from generation to collection to reconciliation. UPI, bank transfer, and installment support.", color: "from-emerald-500 to-teal-400" },
        { icon: CalendarCheck, title: "Smart Attendance", desc: "Multi-modal attendance (QR scan, biometric, geo-fence). Real-time dashboards with absence pattern detection.", color: "from-blue-500 to-cyan-400" },
        { icon: MessageSquare, title: "Parent Connect", desc: "Automated parent communication via WhatsApp, SMS, and in-app notifications. Custom broadcast groups.", color: "from-amber-500 to-orange-400" },
        { icon: PieChart, title: "Deep Analytics", desc: "Institutional dashboards with 360° visibility. Track teacher performance, student outcomes, and resource utilization.", color: "from-rose-500 to-pink-400" },
    ];

    const detailedFeatures = [
        { icon: CreditCard, title: "Fee Management", desc: "Auto fee generation, UPI/NEFT collection, installment plans, late-fee calculation, and receipt generation." },
        { icon: CalendarCheck, title: "Attendance System", desc: "Multi-modal attendance with QR codes, facial recognition, and geo-fencing. Absence alerts to parents in real-time." },
        { icon: MessageSquare, title: "Parent Communication", desc: "WhatsApp integration, broadcast groups, exam alerts, PTM scheduling, and automated progress reports." },
        { icon: BarChart3, title: "Analytics Dashboard", desc: "360° institutional analytics — student performance trends, teacher effectiveness, revenue insights." },
        { icon: ClipboardList, title: "UDISE+ Compliance", desc: "Auto-generated compliance reports, NEP 2020 tracking, audit-ready documentation, and portal integration." },
        { icon: Globe, title: "Multi-Campus", desc: "Manage multiple branches from one dashboard. Unified data with branch-level permissions and custom configs." },
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
                            <Link href="/for-students" className="lp-capsule-link">For Students</Link>
                            <Link href="/for-admins" className="lp-capsule-link lp-capsule-active">For Admins</Link>
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                            <Building className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">School Management OS</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            Run<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Smarter.</span>
                        </h1>
                        <p className="text-lg opacity-50 leading-relaxed max-w-lg">
                            Learnivo transforms school administration with AI-powered fee management, automated attendance, and real-time parent communication. <span className="font-bold opacity-100">Built for Indian schools.</span>
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register" className="lp-btn-primary px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
                                Schedule Demo <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="lp-glass px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest inline-flex items-center gap-3">
                                <Zap className="w-5 h-5" /> Watch Demo
                            </button>
                        </div>
                        <div className="flex gap-12 pt-8 border-t border-white/10">
                            <div><div className="text-3xl font-bold">500+</div><div className="text-xs opacity-40 uppercase tracking-widest">Schools</div></div>
                            <div><div className="text-3xl font-bold">98%</div><div className="text-xs opacity-40 uppercase tracking-widest">Fee Recovery</div></div>
                            <div><div className="text-3xl font-bold">60%</div><div className="text-xs opacity-40 uppercase tracking-widest">Time Saved</div></div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative group">
                        <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="relative lp-glass p-6 rounded-3xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="lp-glass p-6 rounded-2xl flex flex-col justify-between h-40">
                                    <CreditCard className="w-8 h-8 opacity-40" />
                                    <div>
                                        <div className="text-2xl font-bold">₹12.4L</div>
                                        <div className="text-xs font-mono opacity-30 uppercase">Fee Collected</div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-400 p-6 rounded-2xl flex flex-col justify-between h-40 text-black">
                                    <BarChart3 className="w-8 h-8" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Live Analytics</span>
                                    </div>
                                </div>
                                <div className="col-span-2 lp-glass p-6 rounded-2xl flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <span className="text-sm font-bold">94.2% Attendance Today</span>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-[94%] bg-gradient-to-r from-emerald-500 to-[#ccff00] rounded-full" />
                                        </div>
                                    </div>
                                    <div className="ml-4 w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <CalendarCheck className="w-7 h-7" />
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

            {/* Bento Feature Highlights */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <motion.div whileHover={{ scale: 0.99 }} className="lg:col-span-7 lp-glass p-12 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all" />
                            <div className="relative space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
                                    <Lock className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-4xl font-black tracking-tight leading-none">Data<br />Residency</h3>
                                <p className="text-lg opacity-50 max-w-md">100% India-hosted data. DPDPA compliant. No data ever leaves Indian soil. SOC2 + ISO27001 certified infrastructure.</p>
                                <button className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                    View Compliance <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 0.99 }} className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-3xl relative overflow-hidden border border-white/5">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ccff00]/10 blur-3xl rounded-full" />
                            <div className="relative h-full flex flex-col justify-between min-h-[250px]">
                                <Bell className="w-10 h-10 text-[#ccff00]" />
                                <div className="space-y-3 mt-8">
                                    <h3 className="text-3xl font-bold tracking-tight">Parent Alerts</h3>
                                    <p className="opacity-40 leading-relaxed">Automated attendance, fee reminders & exam updates via WhatsApp, SMS, and push notifications.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <motion.div whileHover={{ scale: 0.99 }} className="lg:col-span-5 bg-gradient-to-br from-emerald-600 to-emerald-700 p-12 rounded-3xl text-white relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="relative h-full flex flex-col justify-between min-h-[250px]">
                                <FileSpreadsheet className="w-10 h-10 text-emerald-100" />
                                <div className="space-y-3 mt-8">
                                    <h3 className="text-3xl font-bold tracking-tight">Auto Reports</h3>
                                    <p className="text-white/60 leading-relaxed">One-click generation of UDISE+, NEP compliance, and custom institutional reports.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 0.99 }} className="lg:col-span-7 lp-glass p-12 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] group-hover:bg-amber-500/20 transition-all" />
                            <div className="relative space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
                                    <School className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-4xl font-black tracking-tight leading-none">Multi-Branch<br />Control</h3>
                                <p className="text-lg opacity-50 max-w-md">Manage multiple campuses from a single dashboard. Unified analytics, separate permissions, and branch-level autonomy.</p>
                                <button className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                    See Architecture <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">The Admin Upgrade.</h2>
                        <p className="opacity-40 uppercase text-sm tracking-widest">Why leading schools are switching to AI-powered administration</p>
                    </div>
                    <div className="lp-glass rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest opacity-30">Admin Task</th>
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest opacity-30">Old Way</th>
                                    <th className="p-6 md:p-8 text-xs font-bold uppercase tracking-widest text-emerald-400">Learnivo Way ✅</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {comparison.map((item, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 md:p-8 font-bold text-lg">{item.feature}</td>
                                        <td className="p-6 md:p-8 opacity-40">{item.traditional}</td>
                                        <td className="p-6 md:p-8 font-bold text-emerald-400">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
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

            {/* Detailed Feature Grid */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">Complete Admin OS.</h2>
                        <p className="opacity-40 max-w-xl mx-auto">Everything you need to run a modern Indian school — from fees to compliance, all in one platform.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {detailedFeatures.map((f, i) => (
                            <motion.div key={i} whileHover={{ y: -6 }} className="lp-glass p-8 rounded-3xl group cursor-default border border-white/5 hover:border-emerald-500/20 transition-colors">
                                <f.icon className="w-10 h-10 opacity-40 mb-6 group-hover:text-emerald-400 transition-colors" />
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm opacity-50 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(5,150,105,0.08),transparent)]" />
                    <div className="relative space-y-10">
                        <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                            "Learnivo cut our administrative overhead by <span className="text-emerald-400">60%</span>. Fee recovery went from 72% to 98%. Our teachers can finally focus on teaching."
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminPrincipal" className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 p-0.5" alt="Principal" />
                            <div className="text-left">
                                <p className="font-bold">Mrs. Sunita Sharma</p>
                                <p className="text-xs opacity-40 uppercase tracking-widest">Principal, DPS Network</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-6xl mx-auto lp-glass rounded-[3rem] p-12 md:p-20 grid md:grid-cols-2 gap-12 items-center border border-white/5">
                    <div className="space-y-6">
                        <ShieldCheck className="w-14 h-14 text-emerald-400" />
                        <h2 className="text-4xl font-black tracking-tight">Enterprise-Grade<br />Security</h2>
                        <p className="text-lg opacity-40 leading-relaxed">Your school's data is protected by military-grade encryption, Indian data residency, and continuous compliance monitoring.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "DPDPA", sub: "Compliant" },
                            { label: "SOC2", sub: "Type II" },
                            { label: "ISO", sub: "27001" },
                            { label: "India", sub: "Data Only" },
                        ].map((badge, i) => (
                            <div key={i} className="lp-glass p-6 rounded-2xl text-center border border-white/5 hover:border-emerald-500/20 transition-colors">
                                <div className="text-2xl font-black tracking-tight text-emerald-400">{badge.label}</div>
                                <div className="text-xs opacity-40 uppercase tracking-widest mt-1">{badge.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="lp-reveal py-20 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden group">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative">
                        <h3 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">Modernize Your<br />School Today.</h3>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-10">Join 500+ schools running on Learnivo's intelligent admin platform.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-emerald-700 font-bold uppercase text-sm tracking-widest rounded-2xl shadow-2xl hover:bg-white/90 transition-all">
                                Schedule Free Demo <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="inline-flex items-center gap-2 px-10 py-5 border border-white/30 text-white font-bold uppercase text-sm tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                                Contact Sales
                            </button>
                        </div>
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
