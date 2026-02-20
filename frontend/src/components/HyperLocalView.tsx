'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Sparkles, BookOpen, FileText, GraduationCap, MapPin, Globe, PartyPopper, Star, Wand2, Copy, RefreshCw, CheckCircle2, Loader2, Languages, Image as ImageIcon, BarChart, Download, Share2, ExternalLink, ThumbsUp, ThumbsDown, Link as LinkIcon, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateToolContent } from '@/lib/api';

type ViewState = 'form' | 'generating' | 'result';

interface HyperLocalResult {
    title: string;
    subtitle: string;
    vocabulary: Array<{ term: string; definition: string }>;
    landmarks: Array<{ name: string; distance: string; description: string; image_url?: string }>;
    case_study: {
        title: string;
        intro: string;
        prompt: string;
        watershed_text: string;
        conservation_tips: string[];
    };
    activities: Array<{ title: string; description: string }>;
    links: string[];
}

const HyperLocalView: React.FC = () => {
    const router = useRouter();
    const [mode, setMode] = useState<'topic' | 'book'>('topic');
    const [viewState, setViewState] = useState<ViewState>('form');
    const [loadingStage, setLoadingStage] = useState(0);

    // Form State
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [region, setRegion] = useState('');
    const [language, setLanguage] = useState('English');
    const [customNuances, setCustomNuances] = useState('');

    // Result State
    const [result, setResult] = useState<HyperLocalResult | null>(null);

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

    const handleGenerate = async () => {
        if (!topic || !region) {
            alert("Please enter a topic and region.");
            return;
        }

        setViewState('generating');
        try {
            const response = await generateToolContent('hyper_local_content', {
                topic,
                grade,
                region,
                language,
                custom_nuances: customNuances
            });

            console.log("Hyper Local Response:", response);
            if (response.content) {
                setResult(response.content);
                setViewState('result');
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Generation failed:", error);
            alert("Failed to generate content. Please try again.");
            setViewState('form');
        }
    };

    const handleBack = () => {
        setViewState('form');
        setResult(null);
    };

    return (
        <div className="bg-transparent h-screen w-full overflow-hidden font-sans text-foreground transition-colors duration-300 flex flex-col relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bg-primary-custom/10 w-[400px] h-[400px] -top-20 -left-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow"></div>
                <div className="absolute bg-primary-custom/5 w-[500px] h-[500px] bottom-0 -right-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow delay-1000"></div>
            </div>

            {/* Navbar */}
            <nav className={`relative z-10 flex items-center justify-between px-8 py-6 shrink-0 transition-all duration-500 ${viewState === 'generating' ? 'opacity-0 pointer-events-none absolute w-full' : 'opacity-100'} ${viewState === 'result' ? 'bg-card-bg/50 backdrop-blur-xl border-b border-border' : ''}`}>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => viewState === 'result' ? handleBack() : router.back()}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card-bg border border-border shadow-sm text-foreground hover:bg-muted transition-all hover:scale-110 active:scale-90"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        {viewState === 'result' && result ? (
                            <div>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-xl font-black tracking-tighter uppercase italic text-foreground truncate max-w-md">{result.title}</h1>
                                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-primary-custom/10 text-primary-custom border border-primary-custom/20 rounded-full">Result Generated</span>
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{result.subtitle}</p>
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

            {/* Main Content */}
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
                                    <div className="flex bg-muted p-1.5 rounded-[1.5rem] mb-10 w-fit mx-auto lg:mx-0 border border-border">
                                        <button onClick={() => setMode('topic')} className={`flex items-center gap-3 px-6 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'topic' ? 'bg-primary-custom shadow-lg shadow-primary-custom/20 text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                                            <Sparkles size={16} /> By Topic
                                        </button>
                                        <button onClick={() => setMode('book')} className={`flex items-center gap-3 px-6 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'book' ? 'bg-primary-custom shadow-lg shadow-primary-custom/20 text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                                            <BookOpen size={16} /> From Book
                                        </button>
                                    </div>

                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Topic / Area of Study</label>
                                                <div className="relative group">
                                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                    <input
                                                        value={topic}
                                                        onChange={(e) => setTopic(e.target.value)}
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
                                                    <select
                                                        value={grade}
                                                        onChange={(e) => setGrade(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[1.5rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground appearance-none transition-all outline-none text-sm font-bold"
                                                    >
                                                        <option value="">Select an option</option>
                                                        <option>Grade 1-3</option>
                                                        <option>Grade 4-6</option>
                                                        <option>Grade 7-9</option>
                                                        <option>Grade 10-12</option>
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
                                                        value={region}
                                                        onChange={(e) => setRegion(e.target.value)}
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
                                                    <select
                                                        value={language}
                                                        onChange={(e) => setLanguage(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[1.5rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground appearance-none transition-all outline-none text-sm font-bold"
                                                    >
                                                        <option>English</option>
                                                        <option>Hindi</option>
                                                        <option>Marathi</option>
                                                        <option>Bengali</option>
                                                        <option>Tamil</option>
                                                        <option>Telugu</option>
                                                        <option>Kannada</option>
                                                        <option>Gujarati</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Custom Cultural Nuances</label>
                                            <div className="relative group">
                                                <PartyPopper className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary-custom transition-colors" size={18} />
                                                <textarea
                                                    value={customNuances}
                                                    onChange={(e) => setCustomNuances(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent focus:border-primary-custom/30 rounded-[2rem] focus:ring-4 focus:ring-primary-custom/5 text-foreground placeholder:text-muted-foreground/30 transition-all resize-none outline-none text-sm font-bold"
                                                    placeholder="Add local festivals, landmarks, or regional traditions..."
                                                    rows={3}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </form>

                                    <button
                                        onClick={handleGenerate}
                                        disabled={!topic || !region}
                                        className="absolute -bottom-8 right-10 flex items-center gap-3 px-10 py-5 bg-primary-custom text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-primary-custom/30 hover:shadow-primary-custom/50 transform hover:-translate-y-2 transition-all active:scale-95 group z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />
                                        Generate Magic
                                    </button>
                                </div>
                            </div>

                            {/* Illustration Section Mockup (Static for visual appeal) */}
                            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-10 relative h-full">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary-custom/20 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="relative w-64 h-64 md:w-80 md:h-80 bg-card-bg shadow-2xl rounded-[4rem] flex items-center justify-center border border-border overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/20 via-transparent to-transparent"></div>
                                        <div className="relative z-10 p-12 transform group-hover:scale-110 transition-transform duration-700">
                                            <Wand2 size={80} className="text-primary-custom drop-shadow-lg" />
                                        </div>
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
                            <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                                <Wand2 className="w-56 h-56 text-primary-custom drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] animate-wiggle" strokeWidth={1} />
                            </div>
                        </div>
                        <div className="w-full max-w-md space-y-10 text-center relative z-20">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground font-display uppercase italic leading-none">
                                Crafting Your <span className="text-primary-custom">Content</span>
                            </h2>
                            <div className="flex items-center justify-center gap-4 text-foreground/70 font-black uppercase tracking-widest animate-fadeIn text-sm">
                                <Loader2 className="animate-spin text-primary-custom" size={24} />
                                <span>
                                    {loadingStage === 0 && "Analyzing regional context..."}
                                    {loadingStage === 1 && "Applying cultural nuances..."}
                                    {loadingStage === 2 && "Generating local examples..."}
                                    {loadingStage === 3 && "Finalizing content..."}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESULT VIEW - DYNAMIC */}
                {viewState === 'result' && result && (
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
                                        {result.vocabulary.map((vocab, idx) => (
                                            <li key={idx} className="flex flex-col p-5 rounded-[2rem] bg-primary-custom/5 border border-primary-custom/10 hover:bg-primary-custom/10 transition-colors">
                                                <span className="text-sm font-black text-foreground uppercase tracking-tight italic">{vocab.term}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">{vocab.definition}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-card-bg/50 border border-border backdrop-blur-xl hover:shadow-2xl transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-6 text-primary-custom">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center shadow-inner">
                                            <Map className="font-black" size={24} />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">Nearby Landmarks</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {result.landmarks.map((landmark, idx) => (
                                            <button key={idx} className="w-full flex gap-5 group/item items-center text-left">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-muted shrink-0 overflow-hidden border border-border group-hover/item:border-primary-custom/30 transition-all shadow-sm">
                                                    {landmark.image_url ? (
                                                        <img alt={landmark.name} className="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500" src={landmark.image_url} />
                                                    ) : (
                                                        <MapPin className="w-full h-full p-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1 group-hover/item:text-primary-custom">{landmark.name}</h4>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">{landmark.distance}<br />{landmark.description}</p>
                                                </div>
                                            </button>
                                        ))}
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

                                        <h1 className="text-4xl md:text-5xl font-black mb-12 text-foreground tracking-tighter leading-none uppercase italic">{result.case_study.title}</h1>

                                        <p className="text-xl font-bold text-foreground/80 leading-relaxed mb-10 italic uppercase tracking-tight">{result.case_study.intro}</p>

                                        <div className="my-16 p-10 rounded-[3rem] bg-primary-custom/5 border border-primary-custom/20 shadow-inner relative overflow-hidden group/prompt">
                                            <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles size={48} className="text-primary-custom" /></div>
                                            <div className="relative z-10">
                                                <h4 className="text-sm font-black text-primary-custom uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                                    <Wand2 size={18} /> Interactive Classroom Prompt
                                                </h4>
                                                <p className="text-xl font-black text-foreground uppercase tracking-tight leading-snug italic group-hover/prompt:text-primary-custom transition-colors">"{result.case_study.prompt}"</p>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter mb-8 bg-muted w-fit px-6 py-2 rounded-2xl">Local Geography Context</h3>
                                        <p className="text-lg text-muted-foreground font-bold leading-relaxed mb-10">{result.case_study.watershed_text}</p>

                                        <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter mb-8 bg-muted w-fit px-6 py-2 rounded-2xl">Conservation Tips</h3>
                                        <div className="space-y-6 mb-20">
                                            {result.case_study.conservation_tips.map((item, idx) => (
                                                <div key={idx} className="flex gap-6 items-start p-6 bg-muted/30 rounded-3xl border border-transparent hover:border-border transition-all">
                                                    <div className="w-8 h-8 rounded-xl bg-primary-custom flex items-center justify-center shrink-0 shadow-lg shadow-primary-custom/20">
                                                        <CheckCircle2 size={16} className="text-white" />
                                                    </div>
                                                    <span className="text-md font-bold text-foreground/80 uppercase tracking-tight">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                </div>
                            </section>

                            {/* Right Sidebar */}
                            <aside className="lg:col-span-3 space-y-8">
                                <div className="p-8 rounded-[2.5rem] bg-card-bg/50 border border-border backdrop-blur-xl hover:shadow-2xl transition-all duration-500 border-l-[6px] border-l-primary-custom relative overflow-hidden group">
                                    <div className="flex items-center gap-4 mb-8 text-primary-custom">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-custom/10 flex items-center justify-center shadow-inner">
                                            <PartyPopper className="font-black" size={24} />
                                        </div>
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-foreground">Cultural Activities</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {result.activities.map((activity, idx) => (
                                            <div key={idx} className="p-6 rounded-[2rem] bg-muted/40 border border-transparent hover:border-border transition-all group/card">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-primary-custom group-hover/card:tracking-[0.3em] transition-all">{activity.title}</h4>
                                                <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed">{activity.description}</p>
                                            </div>
                                        ))}
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
                                        {result.links.map((link, idx) => (
                                            <a key={idx} className="flex items-center justify-between p-4 bg-muted/20 hover:bg-primary-custom/5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all group/link" href="#">
                                                <span className="text-muted-foreground group-hover/link:text-foreground">{link}</span>
                                                <ExternalLink size={14} className="group-hover/link:text-primary-custom transform group-hover/link:translate-x-1 transition-all" />
                                            </a>
                                        ))}
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
