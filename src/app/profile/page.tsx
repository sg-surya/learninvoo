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
    BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, [router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-lime-500 selection:text-white pb-20">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 group text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-lime-600 transition-colors">
                        <Share2 size={18} />
                    </button>
                    <Link href="/profile/edit">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">
                            <Edit3 size={14} /> Edit Profile
                        </button>
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-12">
                {/* Header Profile Section */}
                <div className="relative mb-12">
                    {/* Cover Image Placeholder */}
                    <div className="h-48 w-full bg-gradient-to-r from-lime-500 via-lime-600 to-emerald-700 rounded-3xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    </div>

                    <div className="px-8 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-6">
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-white">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                                    alt={user.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-lime-600 transition-all opacity-0 group-hover:opacity-100">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic">{user.fullName}</h1>
                                <CheckCircle2 className="text-lime-500 fill-lime-50" size={20} />
                                <div className="px-3 py-1 bg-lime-100 text-lime-700 text-[9px] font-black uppercase tracking-widest rounded-full">
                                    {user.role}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                                    <AtSign size={14} className="text-slate-300" /> {user.username || 'username'}
                                </div>
                                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                                    <MapPin size={14} className="text-slate-300" /> New Delhi, IN
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info Cards */}
                    <div className="space-y-6">
                        {/* bio */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                <User size={14} className="text-lime-500" /> About Identity
                            </h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                Dedicated {user.role} passionate about leveraging AI to bridge the gap between complex pedagogy and student understanding. Mastering {user.role === 'teacher' ? 'classrooms' : 'knowledge'} since {new Date(user.createdAt).getFullYear()}.
                            </p>
                            <div className="pt-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Calendar size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-slate-950 p-6 rounded-3xl space-y-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                                <Award size={14} className="text-lime-400" /> Milestone Hub
                            </h3>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
                                    <div className="text-2xl font-black text-lime-400 mb-1">12</div>
                                    <div className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-none">AI Tools mastered</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
                                    <div className="text-2xl font-black text-sky-400 mb-1">98%</div>
                                    <div className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-none">Hub rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle/Right Column: Activity Hub */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 group-hover:bg-lime-600 group-hover:text-white transition-all">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-950 uppercase tracking-tight">Vasu Score</div>
                                    <div className="text-xs font-bold text-lime-600 uppercase tracking-widest">Top 5% Globally</div>
                                </div>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-all">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-950 uppercase tracking-tight">Member Tier</div>
                                    <div className="text-xs font-bold text-sky-600 uppercase tracking-widest">Platinum Badge</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <BookOpen size={14} className="text-lime-500" /> Intelligence Feed
                                </h3>
                                <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-lime-600">View All Trace</button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="px-8 py-6 hover:bg-slate-50 transition-colors flex items-start justify-between group">
                                        <div className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5"></div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-950 uppercase tracking-tight mb-1 group-hover:text-lime-600 transition-colors">
                                                    {i === 1 ? 'Initialized Hyper Local Lesson Plan' : i === 2 ? 'Mastered Bloom\'s Taxonomy Tool' : 'Generated NCERT Assessment'}
                                                </h4>
                                                <p className="text-xs text-slate-400 font-medium">Recorded via {user.fullName}'s Secure Hub • {i * 2}h ago</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-100 rounded text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            Success
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Integration Badges */}
                        <div className="bg-lime-50 p-6 rounded-3xl border border-lime-100">
                            <div className="flex items-center gap-6 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700 overflow-x-auto pb-2 scrollbar-hide">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] shrink-0">Official Verified</span>
                                <div className="h-4 w-px bg-lime-200 shrink-0"></div>
                                <span className="text-xs font-black tracking-tighter shrink-0 italic">NEP 2020</span>
                                <span className="text-xs font-black tracking-tighter shrink-0 italic">NCERT</span>
                                <span className="text-xs font-black tracking-tighter shrink-0 italic">CBSE ALIGNED</span>
                                <span className="text-xs font-black tracking-tighter shrink-0 italic">VASU AI-NATIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
