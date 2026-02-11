'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Sparkles, BookOpen, FileText, GraduationCap, MapPin, Globe, PartyPopper, Star, Wand2, Copy, RefreshCw, CheckCircle2, Loader2, Languages, Image as ImageIcon, BarChart, Download, Share2, ExternalLink, ThumbsUp, ThumbsDown, Link as LinkIcon, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ViewState = 'form' | 'generating' | 'result';

const HyperLocalView: React.FC = () => {
    const router = useRouter();
    const [mode, setMode] = useState<'topic' | 'book'>('topic');
    const [viewState, setViewState] = useState<ViewState>('form');
    const [loadingStage, setLoadingStage] = useState(0);

    // Simulated loading stages
    useEffect(() => {
        if (viewState === 'generating') {
            const stages = [
                "Analyzing regional context...",
                "Applying cultural nuances...",
                "Generating local examples...",
                "Finalizing content..."
            ];

            let currentStage = 0;
            const interval = setInterval(() => {
                setLoadingStage(prev => {
                    if (prev < stages.length - 1) return prev + 1;
                    return prev;
                });
            }, 800);

            return () => clearInterval(interval);
        } else {
            setLoadingStage(0);
        }
    }, [viewState]);

    const handleGenerate = () => {
        setViewState('generating');
        // Simulate API call delay
        setTimeout(() => {
            setViewState('result');
        }, 3500);
    };

    const handleBack = () => {
        setViewState('form');
    };

    return (
        <div className="bg-slate-50 h-screen w-full overflow-hidden font-sans text-slate-900 transition-colors duration-300 flex flex-col relative">
            {/* Background Orbs - Persist across views */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bg-lime-500/20 w-[400px] h-[400px] -top-20 -left-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow"></div>
                <div className="absolute bg-lime-500/10 w-[500px] h-[500px] bottom-0 -right-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow delay-1000"></div>
            </div>

            {/* Navbar - Conditionally rendered based on viewState */}
            <nav className={`relative z-10 flex items-center justify-between px-6 py-4 shrink-0 transition-all duration-500 ${viewState === 'generating' ? 'opacity-0 pointer-events-none absolute w-full' : 'opacity-100'} ${viewState === 'result' ? 'bg-white/50 backdrop-blur-md border-b border-slate-200/50' : ''}`}>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => viewState === 'result' ? handleBack() : router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        {viewState === 'result' ? (
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-lg font-bold tracking-tight font-outfit">Mumbai Water Conservation</h1>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-lime-500/10 text-lime-600 border border-lime-500/20 rounded-md">Result Generated</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Grade 4-6 • Hindi/English Context • Maharashtra, India</p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold tracking-tight font-outfit">Hyper Local Content</h1>
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-lime-500/10 text-lime-600 border border-lime-500/20 rounded-md">Generation</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Create content tailored to your students' specific region.</p>
                            </div>
                        )}
                    </div>
                </div>

                {viewState === 'result' ? (
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 transition-all">
                            <Download size={18} />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-lime-500 text-white shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 transition-all">
                            <Share2 size={18} />
                            Publish
                        </button>
                    </div>
                ) : (
                    viewState !== 'generating' && (
                        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors">
                            <History size={14} />
                            Recent: 3
                        </button>
                    )
                )}
            </nav>

            {/* Main Content Area */}
            <main className={`relative z-10 flex-1 flex flex-col ${viewState === 'result' ? 'overflow-y-auto custom-scrollbar items-start' : 'items-center justify-center overflow-hidden'} px-6 pb-6 min-h-0 w-full`}>

                {/* FORM VIEW */}
                {viewState === 'form' && (
                    <div className="w-full max-w-7xl mx-auto flex flex-col items-center h-full animate-fadeIn justify-center">
                        <div className="text-center mb-6 max-w-2xl shrink-0">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight leading-tight font-outfit">
                                Ready to Create <span className="text-lime-500">Magic?</span>
                            </h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Configure settings to generate <span className="text-lime-600 font-semibold">Hyper Local Content</span> instantly.
                            </p>
                        </div>

                        <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full max-h-[600px]">
                            {/* Form Section */}
                            <div className="lg:col-span-7 h-full flex flex-col justify-center">
                                <div className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.1)] rounded-2xl p-6 relative overflow-visible">
                                    {/* Toggle */}
                                    <div className="flex bg-slate-100/50 p-1 rounded-xl mb-6 w-fit mx-auto lg:mx-0">
                                        <button
                                            onClick={() => setMode('topic')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-all ${mode === 'topic' ? 'bg-white shadow-sm text-lime-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-700'}`}
                                        >
                                            <Sparkles size={14} />
                                            By Topic
                                        </button>
                                        <button
                                            onClick={() => setMode('book')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-all ${mode === 'book' ? 'bg-white shadow-sm text-lime-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-700'}`}
                                        >
                                            <BookOpen size={14} />
                                            From Book
                                        </button>
                                    </div>

                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Topic</label>
                                                <div className="relative group">
                                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime-500 transition-colors" size={16} />
                                                    <input
                                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-lime-500/50 text-slate-800 placeholder:text-slate-400 transition-all outline-none text-sm"
                                                        placeholder="e.g., Water Conservation"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Grade Level</label>
                                                <div className="relative group">
                                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime-500 transition-colors" size={16} />
                                                    <select className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-lime-500/50 text-slate-800 appearance-none transition-all outline-none text-sm">
                                                        <option>Select an option</option>
                                                        <option>Grade 1-3</option>
                                                        <option>Grade 4-6</option>
                                                        <option>Grade 7-9</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Region / Location</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime-500 transition-colors" size={16} />
                                                    <input
                                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-lime-500/50 text-slate-800 placeholder:text-slate-400 transition-all outline-none text-sm"
                                                        placeholder="e.g., Mumbai, India"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Language</label>
                                                <div className="relative group">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime-500 transition-colors" size={16} />
                                                    <select className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-lime-500/50 text-slate-800 appearance-none transition-all outline-none text-sm">
                                                        <option>English</option>
                                                        <option>Spanish</option>
                                                        <option>Hindi</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Cultural Context</label>
                                            <div className="relative group">
                                                <PartyPopper className="absolute left-3 top-3 text-slate-400 group-focus-within:text-lime-500 transition-colors" size={16} />
                                                <textarea
                                                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border-none rounded-xl focus:ring-1 focus:ring-lime-500/50 text-slate-800 placeholder:text-slate-400 transition-all resize-none outline-none text-sm"
                                                    placeholder="Local festivals, landmarks..."
                                                    rows={2}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </form>

                                    <button
                                        onClick={handleGenerate}
                                        className="absolute -bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-lime-500 text-white font-bold text-sm rounded-full shadow-[0_10px_20px_rgba(132,204,22,0.3)] hover:shadow-[0_15px_30px_rgba(132,204,22,0.4)] transform hover:-translate-y-0.5 transition-all active:scale-95 group"
                                    >
                                        <Sparkles className="group-hover:rotate-12 transition-transform" size={18} />
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Illustration Section */}
                            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 relative h-full">
                                <div className="relative animation-float" style={{ animation: 'float 6s ease-in-out infinite' }}>
                                    <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/30">
                                        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/30 to-transparent rounded-[2.5rem]"></div>
                                        <svg className="drop-shadow-xl scale-75" fill="none" height="200" viewBox="0 0 24 24" width="200" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.5 2.5L21.5 5.5M2 22L11 13M21.5 2.5L18.5 5.5M16 3L17 5M21 8L19 7M15.5 10.5L13.5 12.5L5.5 20.5C4.67157 21.3284 3.32843 21.3284 2.5 20.5C1.67157 19.6716 1.67157 18.3284 2.5 17.5L10.5 9.5L12.5 7.5L15.5 10.5Z" stroke="url(#paint0_linear)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                            <defs>
                                                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="2" x2="21.5" y1="22" y2="2.5">
                                                    <stop stopColor="#84cc16"></stop>
                                                    <stop offset="1" stopColor="#bef264"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute top-6 right-6 text-lime-500 animate-pulse">
                                            <Star size={24} fill="currentColor" />
                                        </div>
                                        <div className="absolute bottom-10 left-8 text-lime-500/50 animate-bounce">
                                            <Wand2 size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-500 shadow-sm flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-lime-500"></span>
                                        AI Powered
                                    </div>
                                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-500 shadow-sm flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-lime-500"></span>
                                        Instant
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GENERATING VIEW */}
                {viewState === 'generating' && (
                    <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto animate-fadeIn absolute inset-0 z-50 bg-slate-50/90 backdrop-blur-sm">
                        <div className="relative mb-12 transform scale-125">
                            <div className="absolute inset-0 bg-lime-500/20 blur-[120px] rounded-full scale-150 animate-pulse"></div>

                            {/* Wand Icon Animation */}
                            <div className="relative z-10 w-64 h-64 flex items-center justify-center animate-wiggle">
                                <Wand2 className="w-48 h-48 text-lime-500 drop-shadow-[0_0_30px_rgba(132,204,22,0.6)]" strokeWidth={1.5} />

                                {/* Floating Particles */}
                                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-lime-500 rounded-full blur-[2px] opacity-70 animate-[ping_2s_linear_infinite]"></div>
                                <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-lime-300 rounded-full blur-[3px] opacity-60 animate-[bounce_3s_infinite]"></div>
                                <div className="absolute top-10 left-1/2 w-2 h-2 bg-lime-400 rounded-full blur-[2px] opacity-50 animate-pulse"></div>

                                <div className="absolute -top-4 right-10 text-lime-500 animate-bounce delay-100">
                                    <Star size={32} fill="currentColor" />
                                </div>
                                <div className="absolute bottom-6 -left-4 text-lime-400 opacity-60 animate-bounce delay-300">
                                    <Sparkles size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-md space-y-8 text-center relative z-20">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-outfit">
                                    Crafting Your <span className="text-lime-500">Content</span>
                                </h2>

                                {/* Progress Bar */}
                                <div className="relative h-3 w-64 mx-auto bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                    <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-lime-400 to-lime-600 rounded-full animate-[progress_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(132,204,22,0.5)]"></div>
                                </div>
                            </div>

                            <div className="space-y-3 min-h-[80px]">
                                <div className="flex items-center justify-center gap-3 text-slate-500 font-medium animate-fadeIn">
                                    <Loader2 className="animate-spin text-lime-500" size={20} />
                                    <span className="text-lg">
                                        {loadingStage === 0 && "Analyzing regional context..."}
                                        {loadingStage === 1 && "Applying cultural nuances..."}
                                        {loadingStage === 2 && "Generating local examples..."}
                                        {loadingStage === 3 && "Finalizing content..."}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 items-center">
                                    {loadingStage > 0 && (
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 opacity-60 animate-slideUp">
                                            Region Identified
                                        </p>
                                    )}
                                    {loadingStage > 1 && (
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 opacity-40 animate-slideUp">
                                            Adding Local Flavor
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 shadow-sm">
                            <p className="text-sm text-slate-500">
                                This usually takes about <span className="font-bold text-slate-700">few seconds</span>...
                            </p>
                        </div>
                    </div>
                )}

                {/* RESULT VIEW */}
                {viewState === 'result' && (
                    <div className="w-full max-w-[1600px] mx-auto animate-fadeIn pt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Sidebar */}
                            <aside className="lg:col-span-3 space-y-6">
                                <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/50 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-4 text-lime-600">
                                        <Languages className="font-bold" size={20} />
                                        <h3 className="font-bold text-sm uppercase tracking-wider">Local Vocabulary</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex flex-col p-3 rounded-xl bg-lime-50 border border-lime-100">
                                            <span className="text-sm font-bold text-slate-800">Paani (पानी)</span>
                                            <span className="text-xs text-slate-500">Marathi/Hindi for Water. Used in daily local slogans.</span>
                                        </li>
                                        <li className="flex flex-col p-3 rounded-xl bg-white border border-slate-100">
                                            <span className="text-sm font-bold text-slate-800">Bawdi</span>
                                            <span className="text-xs text-slate-500">Traditional stepwell structures.</span>
                                        </li>
                                        <li className="flex flex-col p-3 rounded-xl bg-white border border-slate-100">
                                            <span className="text-sm font-bold text-slate-800">Monsoon Prep</span>
                                            <span className="text-xs text-slate-500">Local term for the rainy season infrastructure.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-4 py-2 text-xs font-bold text-lime-600 hover:underline">View All 12 Terms</button>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/50 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-4 text-lime-600">
                                        <Map className="font-bold" size={20} />
                                        <h3 className="font-bold text-sm uppercase tracking-wider">Nearby Landmarks</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                                                <img alt="Powai Lake" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYHKyIQg5ZJHj9wgluVH4ZmT3xCLIag-qfHZOpfixRkTobpeQil1U221FmTDochcflOXmTflh5sCMvAy40EVbHMbnyleuCTAxSDh37J7ozLQhTMjyWcq0GWoScbT_QmgPKqPdE8l9YFvJh5IFkJMD_DAfIbgZZCp8sfcmCtK7lgFvISSEalwwobv6jasIoLEqzbL_h2P11fDkn0a7q0H_pJDctHZWtqPDxTz-OXwrmnF1BedFoTxcnzA4W72hlki1I6BVM1p6mBKKY" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold">Powai Lake</h4>
                                                <p className="text-[10px] text-slate-500">2.4km from school. Example of urban water body.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                                                <img alt="Vihar Lake" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-NSB9VUwemyUW9MLUGgVlJFByhVNYupAgTG4m-ZK0ev-Gnf7S7IrIl-yJNbZ7rIuXmq5FL-WrOyL0niaMXrQcxEaqeOl0nZ4o2xKYVC-KnzSDbikrkcNSiR1Iz_bUok01aZhV803VmTnn8k2_RgPqHsie6s8inJUmwmkOGtgXuka9IbmQFdbYXwfDEVKqeqhLjBTUZTFC7xFUc4IoBZe4mCPG8dSLvr_cTDPWKCtJCFroaQ_DtdYkj2sT9i3cIm6OWjpM11T4dR4c" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold">Vihar Lake</h4>
                                                <p className="text-[10px] text-slate-500">Main source of drinking water for the city.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Content */}
                            <section className="lg:col-span-6">
                                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 min-h-[800px] shadow-2xl shadow-slate-200/50 relative">
                                    <article className="prose prose-slate max-w-none">
                                        <h1 className="text-4xl font-extrabold mb-8 text-slate-900 font-outfit">The Journey of a Raindrop in Mumbai</h1>
                                        <p className="text-xl text-slate-600 leading-relaxed mb-6">Imagine you are a small raindrop falling over the Gateway of India during the heavy July Monsoons...</p>

                                        <div className="my-8 p-6 rounded-2xl bg-lime-50 border-l-4 border-lime-500">
                                            <h4 className="mt-0 text-lime-600 font-bold text-lg mb-2">Interactive Prompt:</h4>
                                            <p className="mb-0 italic text-slate-700">"Look outside your classroom window. If a raindrop falls on the playground right now, where does it go? Does it reach the Arabian Sea or the Mithi River?"</p>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Understanding the Local Watershed</h3>
                                        <p className="text-slate-600 mb-6">In our city, water doesn't just come from the tap. It travels from the Tansa and Bhatsa dams, located in the lush Western Ghats, through massive pipelines that stretch across the Thane creek...</p>

                                        <div className="grid grid-cols-2 gap-4 my-8">
                                            <div className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                                                <ImageIcon className="text-slate-300" size={40} />
                                            </div>
                                            <div className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                                                <BarChart className="text-slate-300" size={40} />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Saving 'Paani' at Home</h3>
                                        <p className="text-slate-600 mb-4">During the Ganesh Chaturthi festival, we see how important our water bodies are. Just like we take care of our idols, we must take care of our lakes. Here are three ways to save water in your chawl or apartment...</p>
                                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                            <li>Fixing leaky taps immediately (a single drop per second wastes 20 liters a day).</li>
                                            <li>Using a bucket for bathing instead of a shower during 'Water Cut' days.</li>
                                            <li>Reuse water used for washing rice to water your balcony plants.</li>
                                        </ul>
                                    </article>

                                    <div className="absolute bottom-8 right-8 group">
                                        <button className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-all">
                                            <Wand2 className="animate-pulse" size={20} />
                                            <span>Magic Edit</span>
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 bg-white p-3 rounded-xl shadow-xl border border-slate-100 text-xs text-slate-600">
                                            Tweak the tone, length, or focus of this content instantly using AI.
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Right Sidebar */}
                            <aside className="lg:col-span-3 space-y-6">
                                <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/50 hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-lime-500">
                                    <div className="flex items-center gap-3 mb-4 text-lime-600">
                                        <PartyPopper className="font-bold" size={20} />
                                        <h3 className="font-bold text-sm uppercase tracking-wider">Cultural Activities</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-3 rounded-xl bg-slate-50">
                                            <h4 className="text-xs font-bold mb-1 text-slate-800">The Monsoon Diary</h4>
                                            <p className="text-[11px] text-slate-500">Ask students to interview their grandparents about how the Monsoons in Mumbai have changed since the 1970s.</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50">
                                            <h4 className="text-xs font-bold mb-1 text-slate-800">Water Song Contest</h4>
                                            <p className="text-[11px] text-slate-500">Create a short rap or 'powada' (local ballad) about water conservation in Marathi or Hindi.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/60 border border-slate-200/50 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-4 text-lime-600">
                                        <LinkIcon className="font-bold" size={20} />
                                        <h3 className="font-bold text-sm uppercase tracking-wider">Community Links</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <a className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-xs transition-colors" href="#">
                                            <span className="text-slate-600">MCGM Water Dept</span>
                                            <ExternalLink size={14} />
                                        </a>
                                        <a className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-xs transition-colors" href="#">
                                            <span className="text-slate-600">Save Powai Lake Org</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg">
                                    <h4 className="font-bold text-sm mb-2">Help AI Improve?</h4>
                                    <p className="text-[10px] opacity-90 mb-4">Was this content hyper-local enough for your classroom?</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                            <ThumbsUp size={16} />
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                            <ThumbsDown size={16} />
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                )}

            </main>


        </div>
    );
};

export default HyperLocalView;
