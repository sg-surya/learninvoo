'use client';

import React from 'react';
import { Calendar, Users, FileText, Bell, Plus, ArrowRight, Clock, MapPin, TrendingUp, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const DashboardView: React.FC = () => {
    return (
        <div className="p-8 w-full min-h-screen bg-[#f8fafc]">
            {/* Header / Welcome */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Good Morning, <span className="text-lime-600">Jane!</span>
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Here&apos;s what&apos;s happening in your classrooms today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-semibold text-gray-600">
                        <Calendar size={16} className="text-lime-600" />
                        <span>Mon, 12 Feb 2024</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <button className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus size={20} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Create Class</span>
                </button>
                <button className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start group">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Users size={20} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Add Student</span>
                </button>
                <button className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start group">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">New Assignment</span>
                </button>
                <button className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-start group">
                    <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Bell size={20} />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Broadcast Notice</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed: Today's Schedule */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Schedule Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Clock size={20} className="text-lime-600" />
                                Today&apos;s Schedule
                            </h2>
                            <button className="text-sm font-semibold text-lime-600 hover:underline">View Calendar</button>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-white p-4 rounded-2xl border-l-4 border-lime-500 shadow-sm flex items-center justify-between hover:bg-lime-50/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-lime-100 text-lime-700 flex flex-col items-center justify-center font-bold text-xs ring-2 ring-white">
                                        <span>09:00</span>
                                        <span>AM</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Mathematics - Algebra</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Users size={12} /> Class 10-A • Room 302
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-lime-100 text-lime-700 rounded-lg text-xs font-bold hover:bg-lime-200 transition-colors">Start Class</button>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border-l-4 border-blue-500 shadow-sm flex items-center justify-between hover:bg-blue-50/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex flex-col items-center justify-center font-bold text-xs ring-2 ring-white">
                                        <span>11:30</span>
                                        <span>AM</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Physics - Thermodynamics</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Users size={12} /> Class 11-B • Lab 1
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 py-2 text-gray-400 text-xs font-bold">Upcoming</div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border-l-4 border-purple-500 shadow-sm flex items-center justify-between opacity-60">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex flex-col items-center justify-center font-bold text-xs ring-2 ring-white">
                                        <span>02:00</span>
                                        <span>PM</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Staff Meeting</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin size={12} /> Conference Hall
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pending Tasks */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <CheckCircle size={20} className="text-orange-500" />
                            Pending Tasks
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full">Grading</span>
                                    <span className="text-xs text-gray-400">Due Today</span>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">Grade Biology Quizzes</h4>
                                <p className="text-xs text-gray-500 mb-4">Class 9-C • 24 Pending</p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                                    <div className="bg-orange-500 h-1.5 rounded-full w-[30%]"></div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">Planning</span>
                                    <span className="text-xs text-gray-400">Due Tomorrow</span>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">Upload Weekly Syllabus</h4>
                                <p className="text-xs text-gray-500 mb-4">All Classes • Week 5</p>
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                    Start Now <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar: Insights & Notifications */}
                <div className="space-y-6">
                    {/* Attendance Insight */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <h3 className="font-bold text-lg">Weekly Insight</h3>
                        </div>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                            Class 10-A attendance dropped by <span className="font-bold text-white">8%</span> this week. Consider identifying absent students.
                        </p>
                        <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                            View Attendance Report
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">3 New</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 leading-tight">New Policy Update</p>
                                    <p className="text-xs text-gray-500 mt-1">School administration updated the exam policy.</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">2 hours ago</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 leading-tight">Parent Meeting Request</p>
                                    <p className="text-xs text-gray-500 mt-1">Mr. Sharma requested a meeting for student Rahul.</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">Yesterday</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 text-gray-400 text-xs font-bold border border-gray-100 rounded-xl hover:text-gray-600 hover:bg-gray-50 transition-all">
                            View All
                        </button>
                    </div>

                    {/* Quick Stat */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg">12</h4>
                            <p className="text-xs text-gray-500 font-medium">Unread Messages</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
