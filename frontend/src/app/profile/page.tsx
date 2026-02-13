'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    AtSign,
    Calendar,
    ShieldCheck,
    MapPin,
    Award,
    Briefcase,
    ChevronLeft,
    Edit3,
    Camera,
    Share2,
    CheckCircle2,
    Star,
    Zap,
    BookOpen,
    School,
    GraduationCap,
    Users,
    Clock,
    Heart,
    FileText,
    ArrowRight,
    MessageCircle,
    Eye,
    ThumbsUp,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('CLASSES');

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, [router]);

    if (!user) return null;

    const tabs = [
        { name: 'CLASSES', count: 12 },
        { name: 'RESOURCES', count: 45 },
        { name: 'BADGES', count: 8 },
        { name: 'ABOUT', count: null }
    ];

    const classes = [
        {
            title: 'Mathematics Hub - 9B',
            category: 'Trigonometry & Algebra',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
            likes: '1.2k',
            views: '8.4k',
            tags: ['MATH', '9B']
        },
        {
            title: 'Physics Lab - Grade 10',
            category: 'Quantum Mechanics Intro',
            image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60',
            likes: '850',
            views: '4.2k',
            tags: ['PHY']
        },
        {
            title: 'Digital Literacy 101',
            category: 'Computer Science',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
            likes: '2.4k',
            views: '12k',
            tags: ['CS', 'IT']
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary-custom selection:text-white pb-20 transition-colors duration-300">
            {/* Dynamic Illustrative Banner */}
            <div className="h-[320px] w-full bg-muted/30 dark:bg-card-bg/20 relative overflow-hidden flex items-center justify-center border-b border-border/50">
                {/* Premium Abstract Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%),radial-gradient(circle_at_bottom_left,_var(--tw-gradient-to)_0%,_transparent_50%)] from-indigo-500/10 to-rose-500/10 dark:from-indigo-900/20 dark:to-rose-900/20"></div>
                <div className="absolute inset-0 bg-grid-slate-500/[0.05] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

                {/* Floating Meta Badges */}
                <div className="relative z-0 flex flex-col items-center gap-3 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-6 py-2.5 bg-card-bg/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex items-center gap-3 group hover:scale-105 transition-transform"
                    >
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <School size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Academic Hub</span>
                            <span className="text-xs font-black text-foreground uppercase italic tracking-tighter">{user?.school || 'Learnivo Institute of Tech'}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="px-5 py-2 bg-card-bg/40 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-2xl flex items-center gap-3 group hover:scale-105 transition-transform"
                    >
                        <div className="w-6 h-6 rounded-lg bg-white/10 text-muted-foreground flex items-center justify-center">
                            <GraduationCap size={13} />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{user?.class || 'Grade 11-C'} • {user?.subjects || 'Science & Math'}</span>
                    </motion.div>
                </div>

                {/* Decorative floating icons */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-[15%] opacity-10 dark:opacity-20"><BookOpen size={40} className="text-indigo-400" /></motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-20 right-[15%] opacity-10 dark:opacity-20"><Award size={40} className="text-rose-400" /></motion.div>
            </div>

            <main className="max-w-[1400px] mx-auto px-12">
                {/* Profile Header Block - Adjusted Overlap */}
                <div className="flex flex-col md:flex-row items-center gap-12 -mt-24 relative z-10 pb-12 border-b border-border/50">
                    {/* Large Rounded Profile Image */}
                    <div className="relative shrink-0">
                        <div className="w-[180px] h-[180px] md:w-[210px] md:h-[210px] rounded-[3.5rem] border-[8px] border-card-bg shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden bg-muted">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt={user.fullName} className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>

                    {/* Name and Stats Bar */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8 md:pt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-[36px] md:text-[42px] font-black text-foreground tracking-tighter font-display leading-none">{user.fullName}</h1>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-custom text-white rounded-lg text-[10px] font-black italic tracking-tighter shadow-lg shadow-primary-custom/20 uppercase">
                                    PRO+ <Zap size={10} fill="currentColor" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-bold text-muted-foreground">Senior Educator & Content Designer</p>
                                <p className="text-xs font-medium text-muted-foreground/60">based in {user.location || 'New Delhi, India'}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-3">
                                <Link href="/profile/edit" className="px-10 py-3.5 bg-foreground text-background rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95">
                                    Edit Profile
                                </Link>
                                <button className="px-8 py-3.5 bg-card-bg border border-border text-foreground rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm active:scale-95 flex items-center gap-2">
                                    <MessageCircle size={14} className="text-muted-foreground" /> Get in touch
                                </button>
                            </div>
                        </div>

                        {/* Right Side Stats & Badges */}
                        <div className="flex flex-col items-center md:items-end gap-10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-orange-500/20">26</div>
                                <div className="w-9 h-9 rounded-full bg-indigo-500 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-indigo-500/20">6</div>
                                <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-slate-900/20">12</div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 leading-none">STUDENTS</p>
                                    <p className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-none">12,450</p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 leading-none">RESOURCES</p>
                                    <p className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-none">132</p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 leading-none">LIKES</p>
                                    <p className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-none">548</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="flex items-center gap-10 py-10 sticky top-[72px] md:top-[80px] bg-background/80 backdrop-blur-xl z-20 transition-all duration-300">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center gap-2 py-2 relative transition-all ${activeTab === tab.name ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-xs font-black tracking-[0.1em] uppercase">
                                {tab.name}
                                {tab.count !== null && <span className="text-[10px] ml-1.5 opacity-40 font-bold">{tab.count}</span>}
                            </span>
                            {activeTab === tab.name && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary-custom rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-4 pb-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'CLASSES' && classes.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[1.4/1] rounded-[2.8rem] overflow-hidden mb-5 relative border border-border shadow-sm group-hover:shadow-xl transition-all duration-500">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-5 right-5 flex gap-2">
                                        {item.tags.map(tag => (
                                            <div key={tag} className="px-3 py-1 bg-card-bg/90 backdrop-blur-md text-[10px] font-black rounded-lg shadow-sm tracking-tighter uppercase border border-white/10">
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-colors"></div>
                                </div>
                                <div className="flex items-start justify-between px-2">
                                    <div className="space-y-1">
                                        <h3 className="text-[15px] font-black text-foreground group-hover:text-primary-custom transition-colors leading-tight">{item.title}</h3>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.category}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-black text-muted-foreground">
                                            <ThumbsUp size={14} className="group-hover:text-primary-custom transition-colors" /> {item.likes}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-black text-muted-foreground">
                                            <Eye size={14} className="group-hover:text-sky-500 transition-colors" /> {item.views}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
