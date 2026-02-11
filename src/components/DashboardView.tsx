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
    Send
} from 'lucide-react';

const DashboardView: React.FC = () => {
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
            className="p-6 w-full min-h-screen bg-[#f8fafc] text-slate-800"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 1. Header (Morning Brief) */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Good Morning, <span className="text-lime-600">Rahul Sir!</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                        <span className="inline-block w-2 H-2 rounded-full bg-lime-500 animate-pulse"></span>
                        You have <span className="font-bold text-slate-700">5 Classes</span> today (2 Free Periods).
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-2">
                        <Calendar size={16} className="text-lime-600" />
                        <span>10 Feb 2026</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT/MAIN COLUMN (2/3 width) */}
                <div className="xl:col-span-2 space-y-8">

                    {/* 2. Top Section - "Right Now" (Current Class) */}
                    <motion.section variants={itemVariants}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Clock className="text-lime-600" size={20} />
                                Right Now
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-full animate-pulse">Live</span>
                            </h2>
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                            {/* Decorative Background Blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-50 rounded-full blur-[80px] -z-0 opacity-50 group-hover:opacity-80 transition-opacity"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Period 3 • 10:30 AM - 11:15 AM</span>
                                            <span className="text-[10px] font-bold text-lime-600 flex items-center gap-1">
                                                <MapPin size={10} /> Room 302
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-slate-800">Class 9-B <span className="text-slate-400 font-light">|</span> Mathematics</h3>
                                        <div className="flex items-center gap-2 text-slate-600 mt-2">
                                            <BookOpen size={16} className="text-lime-600" />
                                            <span className="font-semibold text-sm">Topic: Quadratic Equations (Exercise 4.2)</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button className="flex items-center gap-2 px-5 py-2.5 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-xl shadow-lg shadow-lime-200 transition-all active:scale-95">
                                            <FileText size={18} />
                                            View Lesson Plan
                                        </button>
                                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95">
                                            <UserCheck size={18} className="text-slate-500" />
                                            Take Attendance
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:block w-px h-32 bg-slate-100"></div>

                                <div className="flex-shrink-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 text-center w-full md:w-auto">
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-2">Class Strength</div>
                                    <div className="text-3xl font-black text-slate-800">42<span className="text-lg text-slate-400 font-medium">/45</span></div>
                                    <div className="text-[10px] text-lime-600 font-bold bg-lime-100 px-2 py-0.5 rounded-full inline-block mt-1">93% Present</div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 3. Middle Section - Quick Actions Grid */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-lg font-bold mb-4 text-slate-800">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Create Homework', icon: BookOpen, color: 'bg-blue-50 text-blue-600', sub: 'Generate via AI' },
                                { label: 'Question Paper', icon: FileCheck, color: 'bg-purple-50 text-purple-600', sub: 'CBSE Pattern' },
                                { label: 'Send Remark', icon: MessageCircle, color: 'bg-orange-50 text-orange-600', sub: 'To Parents' },
                                { label: 'Student Logs', icon: AlertCircle, color: 'bg-pink-50 text-pink-600', sub: 'Discipline' }
                            ].map((action, i) => (
                                <button key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left group">
                                    <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm">{action.label}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{action.sub}</p>
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
