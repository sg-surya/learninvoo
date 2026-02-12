'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, CheckSquare, Image as ImageIcon, Feather, MapPin, Scan, Brain, Sparkles, Wand2, Calculator, MessageSquare, ArrowRight, Layout, Library, Gamepad2, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllGeneratedContent } from '@/lib/storage';

const TOOLS = [
    { label: 'Lesson Planner', desc: 'Generate comprehensive weekly lesson plans.', icon: BookOpen, color: 'text-primary-custom', bg: 'bg-primary-custom/10' },
    { label: 'Visual Generator', desc: 'Create simple drawings or charts for your lessons.', icon: ImageIcon, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Hyper Local Content', desc: 'Create content tailored to your students\' region.', icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Story Generator', desc: 'Generate creative stories for any topic or moral.', icon: Feather, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Quiz/Exam Generator', desc: 'Create engaging quizzes tailored to your curriculum.', icon: CheckSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Paper Digitizer', desc: 'Digitize handwritten notes and papers instantly.', icon: Scan, color: 'text-muted-foreground', bg: 'bg-muted' },
    { label: 'Simulation Generator', desc: 'Create interactive simulations for complex concepts.', icon: Gamepad2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Rubric Generator', desc: 'Design detailed grading rubrics for assignments.', icon: ClipboardList, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

const ToolsView: React.FC = () => {
    const router = useRouter();
    const [stats, setStats] = useState({ topics: 0, assets: 0, thisWeek: 0 });

    useEffect(() => {
        async function loadStats() {
            try {
                // Fetch generated assets from IndexedDB
                const generated = await getAllGeneratedContent();

                // Fetch books/topics from localStorage
                const libraryStr = localStorage.getItem('library_resources');
                const library = libraryStr ? JSON.parse(libraryStr) : [];

                const now = Date.now();
                const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
                const thisWeekCount = generated.filter(item => item.createdAt > oneWeekAgo).length;

                setStats({
                    topics: library.length,
                    assets: generated.length,
                    thisWeek: thisWeekCount
                });
            } catch (error) {
                console.error("Failed to load tools stats:", error);
            }
        }
        loadStats();
    }, []);

    return (
        <div className="p-8 w-full bg-transparent min-h-screen">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-custom/10 to-emerald-500/10 rounded-[2.5rem] p-10 mb-12 relative overflow-hidden border border-primary-custom/10">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-card-bg/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-primary-custom text-xs font-bold mb-4 border border-primary-custom/20 shadow-sm">
                        <Sparkles size={14} className="fill-primary-custom text-primary-custom" />
                        AI Power Tools
                    </div>
                    <h1 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                        What would you like to create?
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg opacity-90 leading-relaxed">
                        Select a tool below to get started with your content generation.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-primary-custom/20 to-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary-custom rounded-r-full"></div>
                    <div className="ml-4">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <BookOpen size={14} className="text-primary-custom" />
                            Total Topics
                        </p>
                        <h3 className="text-4xl font-extrabold text-foreground">{stats.topics}</h3>
                    </div>
                </div>
                <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-sky-500 rounded-r-full"></div>
                    <div className="ml-4">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Layout size={14} className="text-sky-500" />
                            Total Assets
                        </p>
                        <h3 className="text-4xl font-extrabold text-foreground">{stats.assets}</h3>
                    </div>
                </div>
                <div className="bg-card-bg rounded-2xl p-6 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-purple-500 rounded-r-full"></div>
                    <div className="ml-4">
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles size={14} className="text-purple-500" />
                            This Week
                        </p>
                        <h3 className="text-4xl font-extrabold text-foreground">{stats.thisWeek}</h3>
                    </div>
                </div>
            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
                {TOOLS.map((tool, idx) => {
                    const slug = tool.label.toLowerCase().replace(/[\/\s]+/g, '-');
                    return (
                        <div
                            key={idx}
                            onClick={() => router.push(`/tools/${slug}`)}
                            className="bg-card-bg rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-border hover:shadow-xl hover:shadow-primary-custom/10 hover:border-primary-custom/50 transition-all duration-300 cursor-pointer flex flex-col items-start group relative h-64 overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 w-full flex flex-col h-full">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bg} ${tool.color} mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <tool.icon size={26} />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary-custom transition-colors">{tool.label}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{tool.desc}</p>

                                <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-border group-hover:border-primary-custom/20 transition-colors">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary-custom transition-colors">Launch Tool</span>
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary-custom group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ToolsView;
