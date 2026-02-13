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

const LineChart = () => (
    <div className="w-full h-32 relative mt-4">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-custom)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary-custom)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d="M 0 80 Q 50 20, 100 60 T 200 40 T 300 70 T 400 30 V 100 H 0 Z"
                fill="url(#gradient)"
            />
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 0 80 Q 50 20, 100 60 T 200 40 T 300 70 T 400 30"
                fill="none"
                stroke="var(--primary-custom)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            {/* Markers */}
            {[0, 100, 200, 300, 400].map((x, i) => (
                <circle key={i} cx={x} cy={[80, 60, 40, 70, 30][i]} r="4" fill="var(--primary-custom)" />
            ))}
        </svg>
    </div>
);

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

    return (
        <motion.div
            className="p-8 w-full bg-transparent text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header Area */}
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-foreground tracking-tight">
                        {getTimeBasedGreeting()}, <span className="text-primary-custom">{user?.fullName?.split(' ')[0] || 'Educator'}</span>
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-custom animate-pulse" />
                        5 Classes scheduled for today
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-card-bg/60 backdrop-blur-xl border border-border px-5 py-2.5 rounded-2xl shadow-sm text-xs font-black text-muted-foreground tracking-widest uppercase">
                        {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="col-span-12 lg:col-span-8 space-y-8">

                    {/* Active Session & Quick Graph */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Session Card */}
                        <div className="bg-card-bg/80 backdrop-blur-2xl p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden group hover:bg-card-bg transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="px-3 py-1 bg-primary-custom/10 text-primary-custom text-[10px] font-black rounded-full border border-primary-custom/20 uppercase tracking-widest">In Session</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Current Module</p>
                                <h3 className="text-2xl font-black text-foreground mb-1">Class 9-B Mathematics</h3>
                                <p className="text-sm font-bold text-muted-foreground mb-6 italic">Quadratic Equations (Ex 4.2)</p>

                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 bg-primary-custom text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-colors shadow-lg shadow-primary-custom/20">
                                        Open Lab
                                    </button>
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-card-bg bg-muted overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="student" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-card-bg bg-primary-custom text-white flex items-center justify-center text-[10px] font-black">+38</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Graph Card */}
                        <div className="bg-card-bg/80 backdrop-blur-2xl p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Class Performance</p>
                                    <TrendingUp size={16} className="text-primary-custom" />
                                </div>
                                <h4 className="text-xl font-black text-foreground">+12% <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-1">avg growth</span></h4>
                            </div>
                            <LineChart />
                        </div>
                    </div>

                    {/* Quick Action Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Homework', icon: BookOpen, color: 'text-primary-custom', bg: 'bg-primary-custom/10' },
                            { label: 'Exams', icon: FileCheck, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                            { label: 'Remarks', icon: MessageCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { label: 'Logs', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' }
                        ].map((item, i) => (
                            <button key={i} className="bg-card-bg/60 backdrop-blur-lg p-6 rounded-[2rem] border border-border/40 shadow-sm hover:shadow-xl hover:bg-card-bg transition-all flex flex-col items-center text-center group">
                                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    <item.icon size={22} />
                                </div>
                                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Minimalist Progress Section */}
                    <div className="bg-card-bg/40 backdrop-blur-md rounded-3xl p-8 border border-border/60">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-8">Syllabus Milestones</h3>
                        <div className="space-y-8">
                            {[
                                { title: 'Physics (Grade 9)', sub: 'Forces and Laws of Motion', progress: 65, color: 'bg-primary-custom' },
                                { title: 'Mathematics (Grade 10)', sub: 'Arithmetic Progressions', progress: 42, color: 'bg-sky-500' }
                            ].map((topic, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{topic.title}</h4>
                                            <p className="text-[10px] font-bold text-muted-foreground italic">Current: {topic.sub}</p>
                                        </div>
                                        <span className="text-xl font-black text-foreground">{topic.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${topic.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${topic.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Tasks Panel */}
                    <div className="bg-card-bg border border-border rounded-3xl p-8 relative overflow-hidden shadow-sm">
                        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary-custom/10 rounded-full blur-[40px]" />
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-custom mb-6 flex items-center gap-2">
                                <CheckCircle2 size={16} /> Attention Required
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Grade 8-A Oral Test', sub: 'Marks due in 2 hours', priority: 'High' },
                                    { title: 'Leave Application', sub: 'Amit (10-C) pending approval', priority: 'Normal' },
                                    { title: 'Staff Meeting', sub: 'Today at 3:30 PM', priority: 'Low' }
                                ].map((task, i) => (
                                    <div key={i} className="p-4 bg-muted rounded-2xl border border-border hover:bg-muted/80 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : 'bg-muted-foreground'} group-hover:scale-150 transition-transform`} />
                                            <div>
                                                <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{task.title}</h4>
                                                <p className="text-[10px] text-muted-foreground italic mt-0.5">{task.sub}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-4 bg-primary-custom rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary-custom/20 hover:opacity-90 transition-all">
                                View Full Agenda
                            </button>
                        </div>
                    </div>

                    {/* Up Next / AI Suggestion */}
                    <div className="bg-card-bg/80 backdrop-blur-2xl p-8 rounded-3xl border border-border shadow-sm flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Next Break</p>
                                <h3 className="text-xl font-black text-foreground">Tea Break (15m)</h3>
                            </div>
                        </div>
                        <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                            <p className="text-[11px] text-sky-500 font-bold leading-relaxed italic">
                                "Suggesting: Use this break to review the Physics lesson plan I generated earlier. It's ready for Class 9-B tomorrow."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardView;
