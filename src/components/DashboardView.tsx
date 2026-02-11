'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    MapPin,
    BookOpen,
    UserCheck,
    FileText,
    MessageCircle,
    AlertCircle,
    CheckCircle2,
    MoreVertical,
    Calendar,
    ArrowRight,
    TrendingUp,
    FileCheck,
    GraduationCap,
    Send,
    UserCircle,
    Zap as ZapIcon,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

const DashboardView: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, [router]);

    const calculateCompletion = () => {
        if (!user) return 0;
        const fields = [
            { key: 'fullName', weight: 10 },
            { key: 'username', weight: 10 },
            { key: 'email', weight: 10 },
            { key: 'bio', weight: 15 },
            { key: 'location', weight: 10 },
            { key: 'school', weight: 15 },
            { key: 'class', weight: 10 },
            { key: 'subjects', weight: 10 },
            { key: 'profileImage', weight: 10 },
        ];

        let score = 0;
        fields.forEach(field => {
            if (user[field.key] && user[field.key].toString().trim() !== '') {
                score += field.weight;
            }
        });
        return score;
    };

    const completionPercentage = calculateCompletion();
    const isProfileIncomplete = completionPercentage < 100;

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="p-8 w-full min-h-screen bg-white text-slate-800 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* background patterns */}
            <div className="fixed inset-0 pointer-events-none opacity-40 -z-50">
                <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-lime-50 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-sky-50 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-grid-pro scale-150 opacity-20"></div>
            </div>

            {/* 1. Header (Morning Brief) */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="space-y-1.5">
                    <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic font-display leading-[0.9]">
                        {getTimeBasedGreeting()}, <span className="text-lime-500">{user?.fullName || 'Educator'}!</span>
                    </h1>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                        Status Update: <span className="text-slate-900">5 Classes Scheduled</span> for your session.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-3">
                        <Calendar size={14} className="text-lime-600" />
                        <span>11 FEB 2026</span>
                    </div>
                </div>
            </header>

            {/* Profile Completion Nudge Card */}
            <AnimatePresence>
                {isProfileIncomplete && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-r from-lime-500 via-emerald-500 to-sky-500">
                            <div className="bg-white rounded-[2.3rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-50 rounded-full blur-[80px] -z-0 opacity-40"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-50 rounded-full blur-[60px] -z-0 opacity-40"></div>

                                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-slate-50 flex items-center justify-center bg-slate-50 relative overflow-hidden">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r="42"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="transparent"
                                                    className="text-slate-100"
                                                />
                                                <motion.circle
                                                    initial={{ strokeDasharray: "0, 264" }}
                                                    animate={{ strokeDasharray: `${(completionPercentage / 100) * 264}, 264` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    cx="48"
                                                    cy="48"
                                                    r="42"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    fill="transparent"
                                                    className="text-lime-500"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-xl font-black text-slate-900">{completionPercentage}%</span>
                                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Complete</span>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lime-600 border border-lime-50">
                                            <Sparkles size={16} />
                                        </div>
                                    </div>

                                    <div className="text-center md:text-left space-y-1">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                                            Claim your <span className="text-lime-600">Digital Identity.</span>
                                        </h2>
                                        <p className="text-slate-500 text-sm font-medium">
                                            Your professional profile is <span className="text-slate-900 font-bold text-lg">{completionPercentage}% complete</span>. Finish the setup to unlock premium AI tools & rewards.
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user?.profileImage ? 'bg-lime-500' : 'bg-slate-200'}`}></div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Media</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user?.bio ? 'bg-lime-500' : 'bg-slate-200'}`}></div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biography</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user?.school ? 'bg-lime-500' : 'bg-slate-200'}`}></div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institute</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/profile/edit" className="relative z-10 w-full md:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full md:w-auto px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-slate-950/20 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                                    >
                                        Complete Profile <ArrowRight size={16} className="text-lime-400" />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT/MAIN COLUMN (2/3 width) */}
                <div className="xl:col-span-2 space-y-8">

                    <motion.section variants={itemVariants}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                                <Clock className="text-lime-500" size={14} />
                                Temporal Awareness <span className="text-slate-200">/</span> Right Now
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase rounded-full animate-pulse ml-2">Live Sync</span>
                            </h2>
                        </div>

                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white/80 relative overflow-hidden group">
                            {/* Decorative Background Blob */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-lime-100/30 rounded-full blur-[100px] -z-0 opacity-50 group-hover:opacity-100 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
                                <div className="space-y-6 flex-1">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-700 bg-lime-50 px-3 py-1.5 rounded-full border border-lime-100/50">Period 3 • 10:30 AM - 11:15 AM</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full">
                                                <MapPin size={10} className="text-lime-500" /> Neural Hub Room 302
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic font-display">Class 9-B <span className="text-lime-500 font-light">⁕</span> Mathematics</h3>
                                        <div className="flex items-center gap-2 text-slate-500 mt-2 font-bold text-[10px] uppercase tracking-widest italic opacity-80">
                                            <BookOpen size={14} className="text-lime-500" />
                                            Active Pedagogy: Quadratic Equations (Ex 4.2)
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <button className="flex items-center gap-3 px-8 py-4 bg-lime-600 hover:bg-lime-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-lime-600/20 transition-all active:scale-95 group">
                                            <FileText size={18} className="group-hover:rotate-6 transition-transform" />
                                            Initialize Plan
                                        </button>
                                        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                                            <UserCheck size={18} className="text-slate-400" />
                                            Log Presence
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden lg:block w-px h-32 bg-slate-100"></div>

                                <div className="flex-shrink-0 bg-slate-50/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white shadow-sm text-center w-full lg:w-48">
                                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Neural Linkage</div>
                                    <div className="text-4xl font-black text-slate-950 tracking-tighter">42<span className="text-lg text-slate-300 font-light italic">/45</span></div>
                                    <div className="text-[9px] text-lime-600 font-black uppercase tracking-widest bg-lime-50 px-3 py-1 rounded-full inline-block mt-3 border border-lime-100/50">93% Synchronized</div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 3. Middle Section - Quick Actions Grid */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Pedagogical Accelerators</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Create Homework', icon: BookOpen, color: 'bg-lime-50 text-lime-600 shadow-lime-500/5', sub: 'Neural Gen v2' },
                                { label: 'Question Paper', icon: FileCheck, color: 'bg-sky-50 text-sky-600 shadow-sky-500/5', sub: 'CBSE Optimized' },
                                { label: 'Send Remark', icon: MessageCircle, color: 'bg-amber-50 text-amber-600 shadow-amber-500/5', sub: 'Guardian Uplink' },
                                { label: 'Student Logs', icon: AlertCircle, color: 'bg-rose-50 text-rose-600 shadow-rose-500/5', sub: 'Integrity Scan' }
                            ].map((action, i) => (
                                <button key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all text-left group">
                                    <div className={`w-14 h-14 ${action.color} rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 shadow-lg transition-all duration-500`}>
                                        <action.icon size={26} />
                                    </div>
                                    <h4 className="font-black text-slate-950 text-xs uppercase tracking-tight leading-tight mb-1">{action.label}</h4>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-60">{action.sub}</p>
                                </button>
                            ))}
                        </div>
                    </motion.section>

                    {/* 5. Bottom Section - Syllabus Tracker */}
                    <motion.section variants={itemVariants}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Syllabus Tracker</h2>
                            <button className="text-xs font-bold text-lime-600 hover:underline">View Detailed Plan</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Class 9-B Math */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded-lg">
                                            <GraduationCap size={20} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Class 9-B (Physics)</h4>
                                            <p className="text-[11px] text-slate-500">Proposed: Chapter 4 - Force</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">On Track</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>Term 1 Progress</span>
                                        <span>65%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-lime-500 h-full w-[65%] rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Next: Newton's Laws of Motion</p>
                                </div>
                            </div>

                            {/* Class 10-A Math */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded-lg">
                                            <GraduationCap size={20} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Class 10-A (Math)</h4>
                                            <p className="text-[11px] text-slate-500">Proposed: Chapter 6 - Triangles</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">Lagging</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>Term 1 Progress</span>
                                        <span>42%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-amber-400 h-full w-[42%] rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Alert: 2 Classes behind schedule.</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* RIGHT COLUMN (1/3 width) - Pending Tasks & Extras */}
                <div className="xl:col-span-1 space-y-8">

                    {/* 4. Pending Tasks Panel */}
                    <motion.section variants={itemVariants} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="text-lime-600" size={20} />
                                Pending Tasks
                            </h2>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">4 Left</span>
                        </div>

                        <div className="space-y-4">
                            {/* Task 1 */}
                            <div className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="mt-1">
                                    <div className="w-5 h-5 rounded-full border-2 border-orange-400 flex items-center justify-center group-hover:bg-orange-400 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-transparent group-hover:bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">Submit marks for Class 8A Unit Test</h4>
                                    <p className="text-[11px] text-slate-500 mt-1">Deadline: Today, 5 PM</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">High Priority</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 w-full"></div>

                            {/* Task 2 */}
                            <div className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="mt-1">
                                    <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-transparent group-hover:bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">Approve leave request for Amit (10C)</h4>
                                    <p className="text-[11px] text-slate-500 mt-1">Reason: Sister's Wedding</p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 w-full"></div>

                            {/* Task 3 */}
                            <div className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="mt-1">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:bg-slate-400 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-transparent group-hover:bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-slate-600 transition-colors">Read 3 Unread Circulars</h4>
                                    <p className="text-[11px] text-slate-500 mt-1">From: Principal's Desk</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl text-sm hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            View All Tasks
                        </button>
                    </motion.section>

                    {/* Mini Timetable Summary */}
                    <motion.section variants={itemVariants} className="bg-lime-900 rounded-[2rem] p-6 text-white shadow-xl shadow-lime-900/20 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/30 rounded-full blur-[40px]"></div>

                        <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400 mb-4 relative z-10">Up Next</h3>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                <Clock size={24} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Free Period</h4>
                                <p className="text-sm text-lime-200">11:15 AM - 12:00 PM</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                            <p className="text-xs text-lime-300 font-medium mb-2">Suggestion</p>
                            <p className="text-sm leading-relaxed">Use this time to correct Class 8A Unit Test papers. You have 24 pending.</p>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardView;
