'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Sparkles, BookOpen, FileText, GraduationCap, MapPin, Globe, PartyPopper, Star, Wand2, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ViewState = 'form' | 'generating' | 'result';

const HyperLocalView: React.FC = () => {
    const router = useRouter();
    const [mode, setMode] = useState<'topic' | 'book'>('topic');
    const [viewState, setViewState] = useState<ViewState>('form');
    const [generatedContent, setGeneratedContent] = useState<string>('');

    const handleGenerate = () => {
        setViewState('generating');
        // Simulate API call delay
        setTimeout(() => {
            setGeneratedContent(`Here is a lesson plan on Water Conservation tailored for Mumbai, India:

1. **Introduction (5 mins)**:
   - Discuss the importance of water in Mumbai's daily life.
   - Mention local sources like Tulsi and Vihar lakes.

2. **Activity (15 mins)**:
   - "Monsoon Magic": Students calculate rainwater harvesting potential tailored to a typical Mumbai apartment building.
   - Use local rainfall data (avg 2,500mm).

3. **Discussion (10 mins)**:
   - Topic: "Why do we face water cuts despite heavy rains?"
   - Relate to rapid urbanization and infrastructure challenges.

4. **Cultural Connection**:
   - Reference the significance of water in festivals like Ganesh Chaturthi and the need for eco-friendly practices.

5. **Closing**: 
   - Pledge to save 1 bucket of water daily.`);
            setViewState('result');
        }, 3000);
    };

    const handleBack = () => {
        setViewState('form');
        setGeneratedContent('');
    };

    return (
        <div className="bg-slate-50 h-screen w-full overflow-hidden font-sans text-slate-900 transition-colors duration-300 flex flex-col relative">
            {/* Background Orbs - Persist across views */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bg-lime-500/20 w-[400px] h-[400px] -top-20 -left-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow"></div>
                <div className="absolute bg-lime-500/10 w-[500px] h-[500px] bottom-0 -right-20 rounded-full blur-[80px] opacity-50 animate-pulse-slow delay-1000"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 shrink-0">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => viewState === 'result' ? handleBack() : router.back()}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold tracking-tight">Hyper Local Content</h1>
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-lime-500/10 text-lime-600 border border-lime-500/20 rounded-md">Generation</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">Create content tailored to your students' specific region.</p>
                    </div>
                </div>
                {viewState !== 'generating' && (
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <History size={14} />
                        Recent: 3
                    </button>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-6 min-h-0 w-full max-w-7xl mx-auto">

                {/* FORM VIEW */}
                {viewState === 'form' && (
                    <div className="w-full flex flex-col items-center h-full animate-fadeIn">
                        <div className="text-center mb-6 max-w-2xl shrink-0">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight leading-tight">
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
                    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn">
                        <div className="relative">
                            <div className="w-64 h-64 bg-lime-400 rounded-full blur-[100px] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 mb-8 relative">
                                    <div className="absolute inset-0 bg-lime-500 rounded-full animate-ping opacity-20"></div>
                                    <div className="absolute inset-0 border-4 border-lime-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                    <div className="absolute inset-2 border-4 border-t-lime-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="text-lime-500 animate-pulse" size={32} />
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-emerald-600 mb-4 tracking-tight animate-pulse">
                                    Brewing Local Magic...
                                </h2>
                                <p className="text-slate-500 text-lg font-medium animate-bounce">
                                    Gathering cultural insights tailored just for you.
                                </p>
                            </div>

                            {/* Floating icons */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <Star className="absolute top-[-50px] left-[-40px] text-yellow-400 opacity-60 animate-[float_4s_ease-in-out_infinite] delay-0" fill="currentColor" size={24} />
                                <Wand2 className="absolute bottom-[-20px] right-[-60px] text-purple-400 opacity-60 animate-[float_5s_ease-in-out_infinite] delay-1000" size={32} />
                                <PartyPopper className="absolute top-[-30px] right-[-30px] text-pink-400 opacity-60 animate-[float_3s_ease-in-out_infinite] delay-500" size={28} />
                            </div>
                        </div>
                    </div>
                )}

                {/* RESULT VIEW */}
                {viewState === 'result' && (
                    <div className="w-full max-w-4xl h-full flex flex-col items-center animate-fadeIn">
                        <div className="w-full flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="text-lime-500" size={24} />
                                Content Ready!
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                                    <RefreshCw size={16} />
                                    Regenerate
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-xl text-sm font-semibold hover:bg-lime-600 transition-colors shadow-sm">
                                    <Copy size={16} />
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-xl flex-1 overflow-y-auto custom-scrollbar">
                            <div className="prose prose-slate max-w-none">
                                <div className="p-6 bg-yellow-50/50 border border-yellow-100 rounded-2xl mb-6">
                                    <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                        <Star size={18} fill="currentColor" />
                                        Local Context Applied
                                    </h3>
                                    <p className="text-sm text-yellow-700 m-0">
                                        Adapted for <strong>Mumbai</strong> region with references to <strong>Monsoon season</strong> and <strong>Ganesh Chaturthi</strong>.
                                    </p>
                                </div>
                                <div className="whitespace-pre-wrap font-medium text-slate-700 text-lg leading-relaxed">
                                    {generatedContent}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default HyperLocalView;
