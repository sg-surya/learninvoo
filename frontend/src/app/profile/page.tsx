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
            {/* Minimal High-Tech Banner */}
            <div className="h-[260px] w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
                {/* Modern subtle gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary-custom)_0%,_transparent_40%),radial-gradient(circle_at_bottom_left,_#4f46e5_0%,_transparent_40%)] opacity-20"></div>

                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Floating Academic Info - Clean Tags */}
                <div className="relative z-10 flex flex-col items-center gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3"
                    >
                        <School size={14} className="text-primary-custom" />
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-none">
                            {user?.school || 'Learnivo Institute of Tech'}
                        </span>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-[1300px] mx-auto px-6 md:px-10">
                {/* Profile Header Block */}
                <div className="relative z-10 -mt-20">
                    <div className="bg-card-bg/80 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/10">
                        <div className="flex flex-col lg:flex-row gap-8 lg:items-end lg:justify-between">

                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                                {/* Refined Profile Image - Less Rounded */}
                                <div className="relative shrink-0">
                                    <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] rounded-2xl border-4 border-card-bg shadow-xl overflow-hidden bg-muted group">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt={user.fullName} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 border-4 border-card-bg rounded-lg shadow-lg"></div>
                                </div>

                                {/* Name and Bio Section */}
                                <div className="space-y-4 text-center md:text-left flex-1">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-4 justify-center md:justify-start">
                                            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{user.fullName}</h1>
                                            <div className="px-2.5 py-1 bg-primary-custom/10 text-primary-custom rounded-lg text-[10px] font-bold border border-primary-custom/20 uppercase tracking-tighter">
                                                Verified Mentor
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider opacity-80">
                                            Senior Educator • {user.subjects || 'Science & Tech'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 justify-center md:justify-start text-xs font-semibold text-muted-foreground/60">
                                        <div className="flex items-center gap-1.5"><MapPin size={14} /> {user.location || 'New Delhi, India'}</div>
                                        <div className="flex items-center gap-1.5"><Calendar size={14} /> Joined Feb 2024</div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
                                        <Link href="/profile/edit" className="px-6 py-2.5 bg-primary-custom text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-primary-custom/20 active:scale-95">
                                            Edit Profile
                                        </Link>
                                        <button className="px-6 py-2.5 bg-muted/50 border border-border text-foreground/80 rounded-xl text-xs font-bold hover:bg-muted transition-all active:scale-95 flex items-center gap-2">
                                            <Share2 size={14} /> Share
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid - Clean and Boxy */}
                            <div className="grid grid-cols-3 gap-4 lg:gap-8 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-10">
                                {[
                                    { label: 'Learners', value: '12.4k', icon: Users, color: 'text-indigo-500' },
                                    { label: 'Content', value: '132', icon: BookOpen, color: 'text-primary-custom' },
                                    { label: 'Rating', value: '4.9', icon: Star, color: 'text-orange-500' }
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center lg:text-left space-y-1">
                                        <div className="flex items-center gap-2 justify-center lg:justify-start mb-1 text-muted-foreground/40">
                                            <stat.icon size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        <p className="text-2xl font-black text-foreground tracking-tighter leading-none">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Tabs Section - Clean Underline */}
                <div className="flex items-center gap-8 mt-10 mb-8 border-b border-border/50 sticky top-[72px] md:top-[80px] bg-background/80 backdrop-blur-md z-20">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center gap-2 py-4 relative transition-all group ${activeTab === tab.name ? 'text-primary-custom' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-xs font-bold tracking-widest uppercase">
                                {tab.name}
                                {tab.count !== null && <span className="text-[10px] ml-1.5 opacity-40">{tab.count}</span>}
                            </span>
                            {activeTab === tab.name && (
                                <motion.div
                                    layoutId="tabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-custom"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Grid - Modern SaaS Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    <AnimatePresence mode="wait">
                        {activeTab === 'CLASSES' && classes.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-card-bg/40 border border-border/50 rounded-2xl overflow-hidden hover:border-primary-custom/30 hover:shadow-2xl hover:shadow-primary-custom/5 transition-all duration-300"
                            >
                                <div className="aspect-[1.6/1] overflow-hidden relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-[9px] font-bold text-white rounded-md uppercase tracking-tighter">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <button className="w-full py-2 bg-white text-black text-[10px] font-bold rounded-lg uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-custom hover:text-white transition-colors">
                                            View Content <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div className="space-y-1">
                                        <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary-custom transition-colors leading-tight">{item.title}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{item.category}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/60"><ThumbsUp size={13} /> {item.likes}</div>
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/60"><Eye size={13} /> {item.views}</div>
                                        </div>
                                        <button className="text-muted-foreground/40 hover:text-primary-custom transition-colors"><MoreHorizontal size={18} /></button>
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
