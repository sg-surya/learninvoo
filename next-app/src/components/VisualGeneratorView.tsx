'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Image as ImageIcon, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, RefreshCw,
    Send, Mic, Bot, Zap, Brush, PenTool, Frame, ImagePlus, BookOpen
} from 'lucide-react';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type ViewState = 'form' | 'generating' | 'result';
type SourceMode = 'topic' | 'book';

interface GeneratedVisual {
    id: string;
    url: string;
    style: string;
}

// Custom Dropdown Component - Underline Style like LessonPlanner
const CustomDropdown = ({
    label, value, onChange, options, placeholder
}: {
    label: string; value: string; onChange: (val: string) => void; options: string[]; placeholder: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-transparent border-0 border-b-2 
                    ${isOpen ? 'border-emerald-500' : 'border-slate-200'} 
                    px-0 py-2.5 text-sm font-medium transition-all cursor-pointer text-left hover:border-emerald-400`}
            >
                <span className={value ? 'text-slate-800 text-sm font-semibold' : 'text-slate-400 text-sm'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-[200px] overflow-y-auto animate-fadeIn">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => { onChange(option); setIsOpen(false); }}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all flex items-center justify-between
                                ${value === option ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                            <span>{option}</span>
                            {value === option && <Check size={14} className="text-emerald-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


const VisualGeneratorView: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('form');
    const [sourceMode, setSourceMode] = useState<SourceMode>('topic');
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('Middle School');
    const [visualStyle, setVisualStyle] = useState('Scientific Diagram');

    // Result states
    const [generatedVisuals, setGeneratedVisuals] = useState<GeneratedVisual[]>([]);
    const [selectedVisual, setSelectedVisual] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [isSaved, setIsSaved] = useState(false);
    const [chatMessage, setChatMessage] = useState('');

    const gradeOptions = ['Elementary School', 'Middle School', 'High School', 'University / Higher Ed'];
    const styleOptions = ['Scientific Diagram', 'Minimalist Illustration', 'Photorealistic Asset', 'Artistic Watercolor', 'Cinematic 3D Render'];

    const handleGenerate = () => {
        if (!topic.trim()) return;
        setViewState('generating');
        setTimeout(() => {
            setGeneratedVisuals([
                { id: '1', url: 'https://picsum.photos/seed/visual1/800/600', style: 'Colorful' },
                { id: '2', url: 'https://picsum.photos/seed/visual2/800/600', style: 'Minimal' },
                { id: '3', url: 'https://picsum.photos/seed/visual3/800/600', style: 'Hand-drawn' },
                { id: '4', url: 'https://picsum.photos/seed/visual4/800/600', style: '3D' },
            ]);
            setSelectedVisual(0);
            setViewState('result');
        }, 2500);
    };

    const handleSave = async () => {
        const content = {
            id: generateId(),
            type: 'visual' as const,
            title: `Visual: ${topic}`,
            description: `${visualStyle} for ${grade}`,
            content: generatedVisuals[selectedVisual]?.url || '',
            contentType: 'image' as const,
            imageUrl: generatedVisuals[selectedVisual]?.url,
            toolId: 'visual-generator',
            formData: { topic, grade, visualStyle },
            createdAt: Date.now(),
        };
        await saveGeneratedContent(content);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    // FORM VIEW - Premium Glass Design
    if (viewState === 'form') {
        return (
            <div className="h-full w-full flex items-center justify-center relative bg-slate-50 overflow-hidden">
                {/* Floating Orbs */}
                <div className="absolute w-[500px] h-[500px] bg-lime-300 rounded-full blur-[100px] top-[-10%] left-[-5%] opacity-50 pointer-events-none" />
                <div className="absolute w-[600px] h-[600px] bg-emerald-200 rounded-full blur-[100px] bottom-[-15%] right-[-5%] opacity-50 pointer-events-none" />
                <div className="absolute w-[400px] h-[400px] bg-teal-100 rounded-full blur-[100px] top-[20%] right-[10%] opacity-50 pointer-events-none" />

                {/* Tool Name - Top Left */}
                <div className="absolute top-4 left-6 flex items-center gap-2 z-20">
                    <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
                        <ImageIcon size={16} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-slate-800">Visuals Generator</h2>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">AI Powered</p>
                    </div>
                </div>

                {/* Main Content - Vertically Centered */}
                <main className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center justify-center">
                    {/* Toggle */}
                    <div className="relative bg-slate-200/50 backdrop-blur-md p-1 rounded-full w-56 flex items-center mb-6 border border-white/50">
                        <div
                            className={`absolute h-[calc(100%-8px)] top-1 bg-white rounded-full shadow-lg transition-all duration-300 ease-out ${sourceMode === 'topic' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                                }`}
                        />
                        <button
                            onClick={() => setSourceMode('topic')}
                            className={`relative z-10 flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sourceMode === 'topic' ? 'text-slate-800' : 'text-slate-400'
                                }`}
                        >
                            By Topic
                        </button>
                        <button
                            onClick={() => setSourceMode('book')}
                            className={`relative z-10 flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sourceMode === 'book' ? 'text-slate-800' : 'text-slate-400'
                                }`}
                        >
                            By Book
                        </button>
                    </div>

                    {/* Heading - Single Line */}
                    <h1 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-3 text-center whitespace-nowrap" style={{ fontFamily: "'Georgia', serif" }}>
                        What are we <span className="text-emerald-600">visualizing</span> today?
                    </h1>
                    <p className="text-slate-500 font-light text-base tracking-tight mb-8">AI-powered education, rendered with precision.</p>

                    {/* Glass Panel - Compact */}
                    <div className="w-full bg-white/45 backdrop-blur-[20px] rounded-[40px] p-8 md:p-10 relative border border-white/60 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05),0_40px_80px_-20px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.4)]">
                        <div className="space-y-8">
                            {/* Topic Input - Underline Style */}
                            <div>
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                    Topic or Description
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b-2 border-slate-200 px-0 py-3 text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
                                    placeholder="e.g., Water cycle, Solar system, Cell division..."
                                />
                            </div>

                            {/* Custom Dropdowns Grid */}
                            <div className="grid grid-cols-2 gap-8">
                                <CustomDropdown
                                    label="Grade Level"
                                    value={grade}
                                    onChange={setGrade}
                                    options={gradeOptions}
                                    placeholder="Select grade"
                                />
                                <CustomDropdown
                                    label="Visual Style"
                                    value={visualStyle}
                                    onChange={setVisualStyle}
                                    options={styleOptions}
                                    placeholder="Select style"
                                />
                            </div>
                        </div>

                        {/* Magic Button */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic.trim()}
                                className="w-20 h-20 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full flex items-center justify-center text-white relative group transition-all duration-400 hover:scale-110 hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                <Sparkles size={32} className="drop-shadow-md" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity -z-10" />
                            </button>
                        </div>
                    </div>

                    {/* Engine Status */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 text-slate-400 text-[9px] uppercase tracking-widest font-bold bg-white/50 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Engine Ready v3.1
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // GENERATING VIEW
    if (viewState === 'generating') {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
                {/* Orbs */}
                <div className="absolute w-[500px] h-[500px] bg-lime-300 rounded-full blur-[100px] top-[-10%] left-[-5%] opacity-50 pointer-events-none animate-pulse" />
                <div className="absolute w-[600px] h-[600px] bg-emerald-200 rounded-full blur-[100px] bottom-[-15%] right-[-5%] opacity-50 pointer-events-none animate-pulse" />

                <div className="text-center z-10">
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-200 animate-pulse">
                            <Sparkles size={48} className="text-white" />
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-[2rem] blur-2xl opacity-30 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-serif italic text-slate-900 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                        Creating your <span className="text-emerald-600">visuals</span>...
                    </h2>
                    <p className="text-slate-500 text-lg mb-8">AI is generating 4 unique variations</p>
                    <div className="flex justify-center gap-3">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg animate-pulse"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // RESULT VIEW - Premium Layout
    return (
        <div className="h-full w-full flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setViewState('form')} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                            <ImageIcon size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900 leading-none">{topic}</h1>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{visualStyle} • {grade}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-700">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white shadow-emerald-200 hover:shadow-xl'}`}>
                        {isSaved ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                        {isSaved ? 'Saved!' : 'Save'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Variations */}
                <aside className="w-56 border-r border-slate-200 bg-white shrink-0 hidden lg:flex flex-col">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Variations</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {generatedVisuals.map((visual, idx) => (
                            <button
                                key={visual.id}
                                onClick={() => setSelectedVisual(idx)}
                                className={`w-full p-2 rounded-xl cursor-pointer transition-all ${selectedVisual === idx
                                    ? 'ring-3 ring-emerald-500 bg-white shadow-lg shadow-emerald-100'
                                    : 'border border-transparent hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="aspect-video rounded-lg overflow-hidden mb-2 bg-slate-100">
                                    <img src={visual.url} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className={`text-[10px] font-bold ${selectedVisual === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {String(idx + 1).padStart(2, '0')} {visual.style}
                                    </span>
                                    {selectedVisual === idx && <Check size={12} className="text-emerald-500" />}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-100">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 rounded-xl text-sm font-bold transition-all">
                            <RefreshCw size={16} />
                            Regenerate All
                        </button>
                    </div>
                </aside>

                {/* Main Visual Area */}
                <main className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-8 relative">
                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                        <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <ZoomOut size={18} />
                        </button>
                        <span className="text-xs font-bold text-slate-600 w-12 text-center">{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <ZoomIn size={18} />
                        </button>
                        <div className="w-px h-6 bg-slate-200" />
                        <button onClick={() => setZoom(100)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Image Preview */}
                    <div
                        className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-4 overflow-hidden transition-transform duration-300"
                        style={{ transform: `scale(${zoom / 100})` }}
                    >
                        <img
                            src={generatedVisuals[selectedVisual]?.url}
                            alt={topic}
                            className="max-w-full max-h-[60vh] rounded-2xl object-contain"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-emerald-300 transition-all">
                            <Brush size={16} /> Edit Colors
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-emerald-300 transition-all">
                            <PenTool size={16} /> Add Labels
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-emerald-300 transition-all">
                            <Frame size={16} /> Resize
                        </button>
                    </div>
                </main>

                {/* Right Sidebar - AI Chat */}
                <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 hidden xl:flex">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                <Zap size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-slate-800 text-sm">AI Visual Assistant</span>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-emerald-700" />
                            </div>
                            <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm text-slate-700">
                                I've created 4 variations for your visual. Want me to refine any of them?
                                <div className="mt-4 flex flex-col gap-2">
                                    <button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all">
                                        "Make it more colorful"
                                    </button>
                                    <button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all">
                                        "Add more labels"
                                    </button>
                                    <button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-all">
                                        "Simplify the design"
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <div className="relative">
                            <textarea
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="w-full border border-slate-200 rounded-2xl pr-12 py-3 px-4 text-sm resize-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Describe changes..."
                                rows={2}
                            />
                            <button className="absolute right-3 bottom-3 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                                <Send size={16} />
                            </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between px-1">
                            <div className="flex gap-2">
                                <Mic size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                                <ImagePlus size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Ready
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default VisualGeneratorView;
