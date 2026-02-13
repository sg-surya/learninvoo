'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    MapPin,
    BookOpen,
    UserCheck,
    FileText,
    MessageCircle,
    AlertCircle,
    CheckCircle2,
    Calendar,
    ArrowRight,
    TrendingUp,
    FileCheck,
    GraduationCap,
    Send,
    Sparkles,
    Wand2,
    BrainCircuit,
    Zap,
    Timer,
    ChevronRight,
    Search,
    Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getAllGeneratedContent, getWorkspaceSummary, WorkspaceItem, getTypeColor } from '@/lib/storage';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-white/10 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Score</p>
                <p className="text-lg font-black text-lime-400">{payload[0].value}/100</p>
            </div>
        );
    }
    return null;
};

const DashboardView: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [projects, setProjects] = useState<WorkspaceItem[]>([]);
    const [stats, setStats] = useState({ savedHours: '0', engagement: 0, modules: 0, score: '0%' });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }

        const fetchData = async () => {
            const allContent = await getAllGeneratedContent();
            const summary = getWorkspaceSummary();
            setProjects(summary.slice(0, 4));

            // Calculate mock stats based on real content count
            const contentLen = allContent.length;
            setStats({
                savedHours: (contentLen * 0.8).toFixed(1),
                engagement: 65 + (contentLen % 30),
                modules: contentLen,
                score: `${70 + (contentLen % 25)}%`
            });

            // Generate chart data based on weekly activity
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const data = days.map((day, i) => ({
                name: day,
                value: 40 + (Math.sin(i) * 20) + (contentLen % 20)
            }));
            setChartData(data);
        };

        fetchData();
    }, [router]);

    if (!mounted) return null;

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

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
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 pb-20 w-full min-h-screen bg-transparent text-foreground overflow-y-auto no-scrollbar"
        >
            {/* --- HERO SECTION --- */}
            <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-3">
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-lime-500/10 text-lime-600 rounded-full border border-lime-500/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm shadow-lime-500/5">
                            <Sparkles size={12} className="animate-pulse" />
                            Live Workspace Sync
                        </div>
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-5xl font-display font-black text-foreground tracking-tight leading-tight">
                        {getTimeBasedGreeting()}, <span className="bg-gradient-to-r from-lime-600 to-lime-400 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || 'Educator'}</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-[15px] font-medium text-muted-foreground flex items-center gap-2">
                        System active. You've saved <span className="text-foreground font-black">{stats.savedHours} hours</span> so far. You have <span className="text-foreground font-black">{projects.length}</span> active projects.
                    </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex items-center gap-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-border p-2 rounded-[1.5rem] shadow-sm">
                    <div className="px-6 py-3 bg-white dark:bg-white/10 rounded-xl shadow-sm text-xs font-black text-foreground tracking-widest uppercase flex items-center gap-2">
                        <Calendar size={14} className="text-lime-500" />
                        {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </motion.div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* --- LEFT COLUMN (MAIN) --- */}
                <div className="col-span-12 lg:col-span-8 space-y-10">

                    {/* Performance & Analytics Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-card-bg/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-border/60 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xs font-black text-lime-600 uppercase tracking-[0.3em] mb-1">Impact Analytics</h3>
                                    <p className="text-3xl font-black text-foreground leading-none">Class Engagement</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-500 hover:text-white transition-all">Today</button>
                                    <button className="px-4 py-2 bg-white/80 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Weekly</button>
                                </div>
                            </div>

                            <div className="h-[280px] w-full -ml-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888815" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                            dy={10}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#84cc16', strokeWidth: 2, strokeDasharray: '5 5' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#84cc16"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Stats Overlay Strip */}
                        <div className="grid grid-cols-3 gap-1 mt-8 pt-8 border-t border-border/40">
                            {[
                                { label: 'Avg Engagement', val: `${stats.engagement}%`, change: '+4%' },
                                { label: 'Generated Assets', val: stats.modules.toString(), change: 'Live' },
                                { label: 'Syllabus Comp.', val: stats.score, change: '+2%' }
                            ].map((stat, i) => (
                                <div key={i} className="text-center group-hover:transform group-hover:translate-y-[-5px] transition-transform duration-500">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xl font-black text-foreground">{stat.val}</span>
                                        <span className="text-[10px] font-black text-lime-500 bg-lime-500/10 px-1.5 py-0.5 rounded-lg">{stat.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Magic Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Lesson Planner', icon: Wand2, color: 'text-lime-500', bg: 'bg-lime-500/10', shadow: 'shadow-lime-500/20', href: '/tools/lesson-planner' },
                            { label: 'Quiz Engine', icon: BrainCircuit, color: 'text-sky-500', bg: 'bg-sky-500/10', shadow: 'shadow-sky-500/20', href: '/tools/quiz-exam-generator' },
                            { label: 'Digitize', icon: FileCheck, color: 'text-orange-500', bg: 'bg-orange-500/10', shadow: 'shadow-orange-500/20', href: '/tools/paper-digitizer' },
                            { label: 'Hyper-Local', icon: MapPin, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', shadow: 'shadow-fuchsia-500/20', href: '/tools/hyper-local-content' }
                        ].map((item, i) => (
                            <Link key={i} href={item.href}>
                                <motion.button
                                    variants={itemVariants}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="w-full bg-card-bg/60 backdrop-blur-xl p-8 rounded-[2.2rem] border border-border/40 shadow-sm hover:shadow-2xl hover:bg-white transition-all flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
                                >
                                    <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${item.shadow} group-hover:shadow-lg focus:ring-0 outline-none`}>
                                        <item.icon size={28} />
                                    </div>
                                    <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] leading-tight">{item.label}</span>
                                    <Plus size={14} className="mt-4 text-muted-foreground group-hover:text-lime-500 transition-colors" />
                                </motion.button>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Workspaces Card */}
                    <motion.div variants={itemVariants} className="bg-card-bg/40 backdrop-blur-md rounded-[2.2rem] p-10 border border-border/60">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em]">Ongoing Projects</h3>
                            <Link href="/workspace">
                                <button className="text-[10px] font-black text-lime-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">Workspace <ChevronRight size={14} /></button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {projects.length > 0 ? (
                                projects.map((proj, i) => {
                                    const { text: colorText } = getTypeColor(proj.type);
                                    return (
                                        <Link key={i} href={`/workspace?id=${proj.id}`}>
                                            <div className="bg-white/50 dark:bg-white/5 p-6 rounded-2xl border border-border group hover:border-lime-500/30 transition-all cursor-pointer h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${colorText}`}>{proj.type.replace('-', ' ')}</p>
                                                        <h4 className="text-[15px] font-black text-foreground leading-tight line-clamp-2">{proj.title}</h4>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-muted-foreground italic shrink-0">{new Date(proj.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
                                                </div>
                                                <div className="space-y-2 mt-auto">
                                                    <div className="flex justify-between text-[10px] font-black">
                                                        <span className="text-muted-foreground uppercase tracking-widest">Storage Status</span>
                                                        <span className="text-lime-600">Saved</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            className="h-full bg-lime-500 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="col-span-2 py-12 text-center bg-white/30 rounded-2xl border border-dashed border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No projects found. Use a tool above to start!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* --- RIGHT COLUMN (SIDEBAR) --- */}
                <div className="col-span-12 lg:col-span-4 space-y-10">

                    {/* Schedule / Time Bar */}
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-card-bg rounded-[2rem] p-10 border border-border shadow-xl shadow-gray-200/20 dark:shadow-none">
                        <div className="flex items-center gap-2 mb-8 text-lime-600">
                            <Timer size={18} />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em]">Day Overview</h3>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[3.5px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-lime-500 via-lime-500/20 to-transparent" />

                            {[
                                { time: 'Session Active', class: 'Live Lab Session', color: 'bg-lime-500', active: true },
                                { time: 'Later Today', class: 'Grade 10 Math Exam Prep', color: 'bg-muted-foreground/30', active: false },
                                { time: 'Upcoming', class: 'Curriculum Review', color: 'bg-muted-foreground/30', active: false }
                            ].map((session, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full z-10 ${session.active ? 'bg-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.6)] animate-pulse' : 'bg-border'}`} />
                                    <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${session.active ? 'text-lime-600' : 'text-muted-foreground'}`}>{session.time}</p>
                                    <h4 className={`text-[16px] font-black tracking-tight leading-tight ${session.active ? 'text-foreground' : 'text-muted-foreground/80'}`}>{session.class}</h4>
                                    {session.active && (
                                        <button className="mt-3 flex items-center gap-1.5 text-[9px] font-black text-lime-600 uppercase tracking-widest hover:gap-2 transition-all">
                                            Manage Session <ArrowRight size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Attention Required Panel */}
                    <motion.div variants={itemVariants} className="bg-card-bg border border-border/80 rounded-[2.2rem] p-10 relative overflow-hidden shadow-sm">
                        <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-rose-500/10 rounded-full blur-[80px]" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 mb-8 flex items-center gap-2">
                            <AlertCircle size={18} /> Attention List
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Pending Marks', sub: `${stats.modules} assets to review`, priority: 'High', color: 'bg-rose-500' },
                                { title: 'Content Sync', sub: 'Last sync: Just now', priority: 'Medium', color: 'bg-amber-500' }
                            ].map((notif, i) => (
                                <div key={i} className="p-5 bg-muted/40 rounded-2xl border border-border hover:bg-white transition-all cursor-pointer group flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${notif.color} shadow-sm`} />
                                    <div>
                                        <h4 className="text-[13px] font-black text-foreground uppercase tracking-tight">{notif.title}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground italic mt-0.5">{notif.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Assistant Recommendation Widget */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-10 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group cursor-pointer overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={stats.modules}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                        <Sparkles size={28} className="text-lime-400" />
                                    </div>
                                    <h3 className="text-[11px] font-black text-lime-400 uppercase tracking-[0.4em] mb-3">Learnivo Recommendation</h3>
                                    <p className="text-[15px] font-medium text-white/90 leading-relaxed italic mb-8">
                                        {stats.modules > 0
                                            ? `"I see you've generated ${stats.modules} assets. I can help you compile them into a syllabus-ready workbook for your class."`
                                            : `"You haven't generated any resources yet. Start with a Lesson Plan to see how I can save your time!"`}
                                    </p>
                                    <Link href="/tools/lesson-planner">
                                        <button className="w-full py-4 bg-lime-500 rounded-2xl text-[11px] font-black uppercase tracking-widest text-black shadow-xl shadow-lime-500/30 hover:scale-[1.02] transition-all">
                                            {stats.modules > 0 ? "Generate Workbook" : "Create My First Plan"}
                                        </button>
                                    </Link>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardView;
