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
        <div className="bg-transparent h-screen w-full overflow-hidden font-sans text-foreground transition-colors duration-300 flex flex-col relative">
            {/* Background Orbs - Persist across views */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bg-primary-custom/10 w-[400px] h-[400px] -top-20 -left-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow"></div>
                <div className="absolute bg-primary-custom/5 w-[500px] h-[500px] bottom-0 -right-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow delay-1000"></div>
            </div>

            {/* Navbar - Conditionally rendered based on viewState */}
            <nav className={`relative z-10 flex items-center justify-between px-8 py-6 shrink-0 transition-all duration-500 ${viewState === 'generating' ? 'opacity-0 pointer-events-none absolute w-full' : 'opacity-100'} ${viewState === 'result' ? 'bg-card-bg/50 backdrop-blur-xl border-b border-border' : ''}`}>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => viewState === 'result' ? handleBack() : router.back()}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card-bg border border-border shadow-sm text-foreground hover:bg-muted transition-all hover:scale-110 active:scale-90"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        {viewState === 'result' ? (
                            <div>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-xl font-black tracking-tighter uppercase italic text-foreground">Mumbai Water Conservation</h1>
                                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary-custom/10 text-primary-custom border border-primary-custom/20 rounded-full">Result Generated</span>
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Grade 4-6 • Hindi/English Context • Maharashtra, India</p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-black tracking-tighter uppercase italic text-foreground leading-none">Hyper Local Content</h1>
                                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary-custom/10 text-primary-custom border border-primary-custom/20 rounded-md">AI Generation</span>
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Create content tailored to your students' specific region.</p>
                            </div>
                        )}
                    </div>
                </div>

                {viewState === 'result' ? (
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-2xl bg-card-bg border border-border text-foreground hover:bg-muted transition-all">
                            <Download size={18} />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-2xl bg-primary-custom text-white shadow-xl shadow-primary-custom/20 hover:bg-primary-custom/90 transition-all">
                            <Share2 size={18} />
                            Publish
                        </button>
                    </div>
                ) : (
                    viewState !== 'generating' && (
                        <button className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl bg-card-bg border border-border text-muted-foreground hover:text-foreground transition-all">
                            <History size={16} />
                            Recent Generations: 3
                        </button>
                    )
                )}
            </nav>

            {/* Main Content Area */}
            <main className={`relative z-10 flex-1 flex flex-col ${viewState === 'result' ? 'overflow-y-auto custom-scrollbar items-start' : 'items-center justify-center overflow-hidden'} px-6 pb-6 min-h-0 w-full`}>

                {/* FORM VIEW */}
                {viewState === 'form' && (
                    <div className="w-full max-w-7xl mx-auto flex flex-col items-center h-full animate-fadeIn justify-center">
                        <div className="text-center mb-10 max-w-2xl shrink-0">
                            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none uppercase italic text-foreground">
                                Ready to Create <span className="text-primary-custom">Magic?</span>
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
                                Configure settings to generate <span className="text-primary-custom">Hyper Local Content</span> instantly.
                            </p>
                        </div>

                        <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full max-h-[600px]">
                            {/* Form Section */}
                            <div className="lg:col-span-7 h-full flex flex-col justify-center">
                                <div className="backdrop-blur-2xl bg-card-bg/50 border border-border shadow-2xl rounded-[3rem] p-10 relative overflow-visible">
                                    {/* Toggle */}
                                    <div className="flex bg-muted p-1.5 rounded-[1.5rem] mb-10 w-fit mx-auto lg:mx-0 border border-border">
                                        <button
                                            onClick={() => setMode('topic')}
                                            className={`flex items-center gap-3 px-6 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'topic' ? 'bg-primary-custom shadow-lg shadow-primary-custom/20 text-white' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Sparkles size={16} />
                                            By Topic
                                        </button>
                                        <button
                                            onClick={() => setMode('book')}
                                            className={`flex items-center gap-3 px-6 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'book' ? 'bg-primary-custom shadow-lg shadow-primary-custom/20 text-white' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <BookOpen size={16} />
                                            From Book
                                        </button>
                                    </div>

                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Topic / Area of Study</label>
                                                <div className="relative group">
                                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                    <input
                                                        className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[1.5rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground placeholder:text-muted-foreground/30 transition-all outline-none text-sm font-bold"
                                                        placeholder="e.g., Water Conservation"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Grade Level</label>
                                                <div className="relative group">
                                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                    <select className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[1.5rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground appearance-none transition-all outline-none text-sm font-bold">
                                                        <option>Select an option</option>
                                                        <option>Grade 1-3</option>
                                                        <option>Grade 4-6</option>
                                                        <option>Grade 7-9</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Target Region / Location</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                    <input
                                                        className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[1.5rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground placeholder:text-muted-foreground/30 transition-all outline-none text-sm font-bold"
                                                        placeholder="e.g., Mumbai, India"
                                                        type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Primary Language</label>
                                                <div className="relative group">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                    <select className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[1.5rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground appearance-none transition-all outline-none text-sm font-bold">
                                                        <option>English</option>
                                                        <option>Spanish</option>
                                                        <option>Hindi</option>
                                                        <option>Marathi</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Custom Cultural Nuances</label>
                                            <div className="relative group">
                                                <PartyPopper className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                <textarea
                                                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[2rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground placeholder:text-muted-foreground/30 transition-all resize-none outline-none text-sm font-bold"
                                                    placeholder="Add local festivals, landmarks, or regional traditions..."
                                                    rows={3}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </form>

                                    <button
                                        onClick={handleGenerate}
                                        className="absolute -bottom-8 right-10 flex items-center gap-3 px-10 py-5 bg-primary-custom text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-primary-custom/30 hover:shadow-primary-custom/50 transform hover:-translate-y-2 transition-all active:scale-95 group z-20"
                                    >
                                        <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />
                                        Generate Magic
                                    </button>
                                </div>
                            </div>

                            {/* Illustration Section */}
                            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-10 relative h-full">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary-custom/20 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="relative w-64 h-64 md:w-80 md:h-80 bg-card-bg shadow-2xl rounded-[4rem] flex items-center justify-center border border-border overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/20 via-transparent to-transparent"></div>
                                        <div className="relative z-10 p-12 transform group-hover:scale-110 transition-transform duration-700">
                                            <svg className="drop-shadow-2xl opacity-80" fill="none" height="240" viewBox="0 0 24 24" width="240" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.5 2.5L21.5 5.5M2 22L11 13M21.5 2.5L18.5 5.5M16 3L17 5M21 8L19 7M15.5 10.5L13.5 12.5L5.5 20.5C4.67157 21.3284 3.32843 21.3284 2.5 20.5C1.67157 19.6716 1.67157 18.3284 2.5 17.5L10.5 9.5L12.5 7.5L15.5 10.5Z" stroke="currentColor" className="text-primary-custom" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                                            </svg>
                                        </div>
                                        <div className="absolute top-10 right-10 text-primary-custom animate-pulse">
                                            <Star size={32} fill="currentColor" />
                                        </div>
                                        <div className="absolute bottom-12 left-12 text-primary-custom/30 animate-bounce">
                                            <Wand2 size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <div className="px-5 py-2.5 bg-card-bg border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-custom shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>
                                        Context Aware
                                    </div>
                                    <div className="px-5 py-2.5 bg-card-bg border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-custom shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></div>
                                        Hyper Local
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* GENERATING VIEW */}
                {viewState === 'generating' && (
                    <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto animate-fadeIn absolute inset-0 z-50 bg-background/90 backdrop-blur-xl">
                        <div className="relative mb-16 transform scale-150">
                            <div className="absolute inset-0 bg-primary-custom/20 blur-[120px] rounded-full scale-150 animate-pulse"></div>

                            {/* Wand Icon Animation */}
                            <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                                <Wand2 className="w-56 h-56 text-primary-custom drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] animate-wiggle" strokeWidth={1} />

                                {/* Floating Particles */}
                                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-primary-custom rounded-full blur-[2px] opacity-70 animate-[ping_2s_linear_infinite]"></div>
                                <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-primary-custom/40 rounded-full blur-[3px] opacity-60 animate-[bounce_3s_infinite]"></div>
                                <div className="absolute top-10 left-1/2 w-2 h-2 bg-primary-custom/60 rounded-full blur-[2px] opacity-50 animate-pulse"></div>

                                <div className="absolute -top-6 right-12 text-primary-custom animate-bounce delay-100">
                                    <Star size={40} fill="currentColor" />
                                </div>
                                <div className="absolute bottom-8 -left-6 text-primary-custom/40 opacity-60 animate-bounce delay-300">
                                    <Sparkles size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-md space-y-10 text-center relative z-20">
                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground font-outfit uppercase italic leading-none">
                                    Crafting Your <span className="text-primary-custom">Content</span>
                                </h2>

                                {/* Progress Bar */}
                                <div className="relative h-3 w-72 mx-auto bg-muted rounded-full overflow-hidden shadow-inner border border-border">
                                    <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-primary-custom to-primary-custom/60 rounded-full animate-[progress_2.5s_ease-in-out_infinite] shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"></div>
                                </div>
                            </div>

                            <div className="space-y-4 min-h-[100px]">
                                <div className="flex items-center justify-center gap-4 text-foreground/70 font-black uppercase tracking-widest animate-fadeIn text-sm">
                                    <Loader2 className="animate-spin text-primary-custom" size={24} />
                                    <span>
                                        {loadingStage === 0 && "Analyzing regional context..."}
                                        {loadingStage === 1 && "Applying cultural nuances..."}
                                        {loadingStage === 2 && "Generating local examples..."}
                                        {loadingStage === 3 && "Finalizing content..."}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 items-center">
                                    {loadingStage > 0 && (
                                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary-custom animate-slideUp">
                                            Region Identified ✓
                                        </p>
                                    )}
                                    {loadingStage > 1 && (
                                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary-custom animate-slideUp">
                                            Adding Local Flavor ✓
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 bg-card-bg/50 backdrop-blur-3xl px-10 py-5 rounded-[2rem] border border-border shadow-2xl">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                This usually takes about <span className="text-foreground">few seconds</span>...
                            </p>
                        </div>
                    </div>
                )}

                {/* RESULT VIEW */}
                {viewState === 'result' && (
                    <div className="w-full max-w-[1600px] mx-auto animate-fadeIn pt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Sidebar */}
                            <aside className="lg:col-span-3 space-y-8">
                                <div className="p-8 rounded-[2.5rem] bg-card-bg/50 border border-border backdrop-blur-xl hover:shadow-2xl transition-all duration-500 group">
                                    <div className="flex items-center gap-4 mb-6 text-primary-custom">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center shadow-inner">
                                            <Languages className="font-black" size={24} />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">Local Vocabulary</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex flex-col p-5 rounded-[2rem] bg-primary-custom/5 border border-primary-custom/10 hover:bg-primary-custom/10 transition-colors">
                                            <span className="text-sm font-black text-foreground uppercase tracking-tight italic">Paani (पानी)</span>
                                            <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">Marathi/Hindi for Water. Used in daily local slogans.</span>
                                        </li>
                                        <li className="flex flex-col p-5 rounded-[2rem] bg-muted/30 border border-transparent hover:border-border transition-all">
                                            <span className="text-sm font-black text-foreground uppercase tracking-tight italic">Bawdi</span>
                                            <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">Traditional stepwell structures of the region.</span>
                                        </li>
                                        <li className="flex flex-col p-5 rounded-[2rem] bg-muted/30 border border-transparent hover:border-border transition-all">
                                            <span className="text-sm font-black text-foreground uppercase tracking-tight italic">Monsoon Prep</span>
                                            <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">Local term for the rainy season infrastructure.</span>
                                        </li>
                                    </ul>
                                    <button className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary-custom hover:bg-primary-custom/5 rounded-xl transition-all">View All 12 Terms</button>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-card-bg/50 border border-border backdrop-blur-xl hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-6 text-primary-custom">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center shadow-inner">
                                            <Map className="font-black" size={24} />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">Nearby Landmarks</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <button className="w-full flex gap-5 group/item items-center text-left">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-muted shrink-0 overflow-hidden border border-border group-hover/item:border-primary-custom/30 transition-all shadow-sm">
                                                <img alt="Powai Lake" className="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYHKyIQg5ZJHj9wgluVH4ZmT3xCLIag-qfHZOpfixRkTobpeQil1U221FmTDochcflOXmTflh5sCMvAy40EVbHMbnyleuCTAxSDh37J7ozLQhTMjyWcq0GWoScbT_QmgPKqPdE8l9YFvJh5IFkJMD_DAfIbgZZCp8sfcmCtK7lgFvISSEalwwobv6jasIoLEqzbL_h2P11fDkn0a7q0H_pJDctHZWtqPDxTz-OXwrmnF1BedFoTxcnzA4W72hlki1I6BVM1p6mBKKY" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1 group-hover/item:text-primary-custom">Powai Lake</h4>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">2.4km from school.<br />Urban water body example.</p>
                                            </div>
                                        </button>
                                        <button className="w-full flex gap-5 group/item items-center text-left">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-muted shrink-0 overflow-hidden border border-border group-hover/item:border-primary-custom/30 transition-all shadow-sm">
                                                <img alt="Vihar Lake" className="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-NSB9VUwemyUW9MLUGgVlJFByhVNYupAgTG4m-ZK0ev-Gnf7S7IrIl-yJNbZ7rIuXmq5FL-WrOyL0niaMXrQcxEaqeOl0nZ4o2xKYVC-KnzSDbikrkcNSiR1Iz_bUok01aZhV803VmTnn8k2_RgPqHsie6s8inJUmwmkOGtgXuka9IbmQFdbYXwfDEVKqeqhLjBTUZTFC7xFUc4IoBZe4mCPG8dSLvr_cTDPWKCtJCFroaQ_DtdYkj2sT9i3cIm6OWjpM11T4dR4c" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1 group-hover/item:text-primary-custom">Vihar Lake</h4>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">Main source of drinking<br />water for the city.</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </aside>

                            {/* Main Content */}
                            <section className="lg:col-span-6">
                                <div className="bg-card-bg/60 backdrop-blur-[40px] border border-border rounded-[3.5rem] p-16 min-h-[1000px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-custom/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <article className="prose prose-slate prose-invert max-w-none relative z-10">
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="h-0.5 w-12 bg-primary-custom rounded-full" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-custom">Hyper-Local Case Study</span>
                                        </div>

                                        <h1 className="text-5xl md:text-6xl font-black mb-12 text-foreground tracking-tighter leading-none uppercase italic">The Journey of a <br /><span className="text-primary-custom">Raindrop</span> in Mumbai</h1>

                                        <p className="text-2xl font-bold text-foreground/80 leading-relaxed mb-10 italic uppercase tracking-tight">Imagine you are a small raindrop falling over the Gateway of India during the heavy July Monsoons...</p>

                                        <div className="my-16 p-10 rounded-[3rem] bg-primary-custom/5 border border-primary-custom/20 shadow-inner relative overflow-hidden group/prompt">
                                            <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles size={48} className="text-primary-custom" /></div>
                                            <div className="relative z-10">
                                                <h4 className="text-sm font-black text-primary-custom uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                                    <Wand2 size={18} /> Interactive Classroom Prompt
                                                </h4>
                                                <p className="text-2xl font-black text-foreground uppercase tracking-tight leading-snug italic group-hover/prompt:text-primary-custom transition-colors">"Look outside your classroom window. If a raindrop falls on the playground right now, where does it go? Does it reach the Arabian Sea or the Mithi River?"</p>
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter mb-8 bg-muted w-fit px-6 py-2 rounded-2xl">Understanding the Local Watershed</h3>
                                        <p className="text-xl text-muted-foreground font-bold leading-relaxed mb-10">In our city, water doesn't just come from the tap. It travels from the Tansa and Bhatsa dams, located in the lush Western Ghats, through massive pipelines that stretch across the Thane creek...</p>

                                        <div className="grid grid-cols-2 gap-8 my-16">
                                            <div className="aspect-[4/3] rounded-[3rem] bg-muted/50 flex items-center justify-center border border-border group/media hover:border-primary-custom/30 transition-all shadow-inner overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/5 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
                                                <ImageIcon className="text-muted-foreground/30 group-hover/media:scale-125 group-hover/media:text-primary-custom/40 transition-all duration-700" size={64} />
                                            </div>
                                            <div className="aspect-[4/3] rounded-[3rem] bg-muted/50 flex items-center justify-center border border-border group/media hover:border-primary-custom/30 transition-all shadow-inner overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/5 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
                                                <BarChart className="text-muted-foreground/30 group-hover/media:scale-125 group-hover/media:text-primary-custom/40 transition-all duration-700" size={64} />
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter mb-8 bg-muted w-fit px-6 py-2 rounded-2xl">Saving 'Paani' at Home</h3>
                                        <p className="text-xl text-muted-foreground font-bold leading-relaxed mb-8">During the Ganesh Chaturthi festival, we see how important our water bodies are. Just like we take care of our idols, we must take care of our lakes. Here are three ways to save water in your chawl or apartment...</p>

                                        <div className="space-y-6 mb-20">
                                            {[
                                                "Fixing leaky taps immediately (a single drop per second wastes 20 liters a day).",
                                                "Using a bucket for bathing instead of a shower during 'Water Cut' days.",
                                                "Reuse water used for washing rice to water your balcony plants."
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex gap-6 items-start p-6 bg-muted/30 rounded-3xl border border-transparent hover:border-border transition-all">
                                                    <div className="w-8 h-8 rounded-xl bg-primary-custom flex items-center justify-center shrink-0 shadow-lg shadow-primary-custom/20">
                                                        <CheckCircle2 size={16} className="text-white" />
                                                    </div>
                                                    <span className="text-lg font-bold text-foreground/80 uppercase tracking-tight">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </article>

                                    <div className="absolute bottom-12 right-12 group/magic">
                                        <button className="flex items-center gap-4 px-10 py-6 bg-foreground text-background font-black text-xs uppercase tracking-[0.3em] rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary-custom/20 to-transparent translate-x-full group-hover/magic:translate-x-0 transition-transform duration-700" />
                                            <Wand2 className="group-hover/magic:rotate-12 transition-transform" size={24} />
                                            <span className="relative z-10">Magic Assist</span>
                                        </button>
                                        <div className="absolute bottom-full right-0 mb-6 opacity-0 group-hover/magic:opacity-100 transition-all -translate-y-2 group-hover/magic:translate-y-0 pointer-events-none w-72 bg-card-bg p-6 rounded-[2rem] shadow-2xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-relaxed">
                                            Tweak the tone, length, or cultural focus of this content instantly using AI.
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Right Sidebar */}
                            <aside className="lg:col-span-3 space-y-8">
                                <div className="p-8 rounded-[2.5rem] bg-card-bg/50 border border-border backdrop-blur-xl hover:shadow-2xl transition-all duration-500 border-l-[6px] border-l-primary-custom relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700"><PartyPopper size={100} /></div>
                                    <div className="flex items-center gap-4 mb-8 text-primary-custom">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center shadow-inner">
                                            <PartyPopper className="font-black" size={24} />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">Cultural Activities</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-[2rem] bg-muted/40 border border-transparent hover:border-border transition-all group/card">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-primary-custom group-hover/card:tracking-[0.3em] transition-all">The Monsoon Diary</h4>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed">Ask students to interview their grandparents about how the Monsoons in Mumbai have changed since the 1970s.</p>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-muted/40 border border-transparent hover:border-border transition-all group/card">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-primary-custom group-hover/card:tracking-[0.3em] transition-all">Water Song Contest</h4>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed">Create a short rap or 'powada' (local ballad) about water conservation in Marathi or Hindi.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-card-bg/50 border border-border backdrop-blur-xl hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-8 text-primary-custom">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center shadow-inner">
                                            <LinkIcon className="font-black" size={24} />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">Community Links</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            "MCGM Water Dept",
                                            "Save Powai Lake Org",
                                            "Mumbai Sustainability",
                                            "Local Water Heroes"
                                        ].map((link, idx) => (
                                            <a key={idx} className="flex items-center justify-between p-4 bg-muted/20 hover:bg-primary-custom/5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all group/link" href="#">
                                                <span className="text-muted-foreground group-hover/link:text-foreground">{link}</span>
                                                <ExternalLink size={14} className="group-hover/link:text-primary-custom transform group-hover/link:translate-x-1 transition-all" />
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden group/feedback">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-3 relative z-10 text-primary-custom">Feedback Loop</h4>
                                    <p className="text-[11px] font-bold opacity-70 mb-8 uppercase tracking-tight leading-relaxed relative z-10">Was this content hyper-local enough for your classroom?</p>
                                    <div className="flex gap-4 relative z-10 text-background">
                                        <button className="flex-1 py-4 rounded-[1.5rem] bg-background/10 hover:bg-primary-custom transition-all flex items-center justify-center border border-background/10 hover:border-primary-custom text-background hover:text-white group-hover/feedback:scale-105">
                                            <ThumbsUp size={22} />
                                        </button>
                                        <button className="flex-1 py-4 rounded-[1.5rem] bg-background/10 hover:bg-primary-custom transition-all flex items-center justify-center border border-background/10 hover:border-primary-custom text-background hover:text-white group-hover/feedback:scale-105">
                                            <ThumbsDown size={22} />
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
