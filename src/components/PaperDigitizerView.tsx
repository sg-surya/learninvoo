'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Scan, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    Upload, FileText, Camera, Maximize2, Copy, Save, ScanLine, FileType, Languages, CheckCircle2, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type ViewState = 'upload' | 'scanning' | 'result';

interface DigitizedContent {
    id: string;
    originalImage: string;
    digitizedText: string;
    wordCount: number;
    format: string;
}

const PaperDigitizerView: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('upload');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [digitizedResult, setDigitizedResult] = useState<DigitizedContent | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'text' | 'original'>('text');

    // OCR Processing Simulation
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target?.result as string);
                processOCR();
            };
            reader.readAsDataURL(file);
        }
    };

    const processOCR = () => {
        setViewState('scanning');
        setTimeout(() => {
            const mockDigitized: DigitizedContent = {
                id: generateId(),
                originalImage: selectedImage || '',
                digitizedText: `## The Cell: Fundamental Unit of Life\n\nAll living organisms are composed of cells. Some are single-celled, while others are multi-cellular. The cell is the basic structural and functional unit of life.\n\n### Key Components Detected:\n1. **Nucleus**: The control center containing genetic material.\n2. **Mitochondria**: The powerhouse of the cell, generating energy.\n3. **Cell Membrane**: The protective outer layer.\n\n[Equation Detected]\n$P_{tot} = P_1 + P_2 + ... + P_n$\n\nScan complete with 98.4% accuracy. Handwritten notes recognized.`,
                wordCount: 124,
                format: 'Markdown'
            };
            setDigitizedResult(mockDigitized);
            setViewState('result');
        }, 4000);
    };

    const handleSave = async () => {
        if (!digitizedResult) return;
        const content = {
            id: generateId(),
            type: 'digitized' as const,
            title: `Digitized Paper: ${new Date().toLocaleDateString()}`,
            description: `OCR result of scanned notes`,
            content: digitizedResult.digitizedText,
            contentType: 'text' as const,
            toolId: 'paper-digitizer',
            formData: {},
            createdAt: Date.now(),
        };
        await saveGeneratedContent(content);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    if (viewState === 'upload') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Cyberpunk Grid Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl relative z-10"
                >
                    <div className="text-center mb-12">
                        <div className="inline-flex p-4 bg-cyan-500/10 rounded-3xl mb-6 border border-cyan-500/20">
                            <Scan size={48} className="text-cyan-400" />
                        </div>
                        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Paper <span className="text-cyan-400">Digitizer</span></h1>
                        <p className="text-slate-400 text-lg font-medium">Convert your handwritten notes into editable digital formats instantly.</p>
                    </div>

                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] p-16 border-2 border-dashed border-slate-800 group-hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload size={32} className="text-slate-400 group-hover:text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop or Click</h3>
                            <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8">Supports images (JPG, PNG) and PDF scans of handwritten or printed papers.</p>

                            <div className="flex gap-4">
                                <div className="px-6 py-2 bg-slate-800 rounded-full text-xs font-bold text-slate-400 flex items-center gap-2">
                                    <Camera size={14} /> Mobile Sync
                                </div>
                                <div className="px-6 py-2 bg-slate-800 rounded-full text-xs font-bold text-slate-400 flex items-center gap-2">
                                    <Languages size={14} /> 50+ Languages
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (viewState === 'scanning') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-8 overflow-hidden">
                <div className="relative w-80 h-[480px] bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 overflow-hidden shadow-2xl">
                    {/* Simulated Paper Image */}
                    {selectedImage && <img src={selectedImage} alt="" className="w-full h-full object-cover opacity-60 grayscale" />}

                    {/* Scanning Laser */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-10"
                    />

                    {/* Floating OCR Fragments */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-full flex flex-wrap gap-2 p-10 opacity-40">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                    className="bg-cyan-500/20 px-2 py-1 rounded text-[8px] font-mono text-cyan-400"
                                >
                                    {Math.random().toString(36).substring(7).toUpperCase()}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl font-black text-white mt-12 mb-2 tracking-tight">Digitizing...</h2>
                <div className="flex items-center gap-4 text-cyan-400/70 font-bold uppercase tracking-[0.3em] text-xs">
                    <RefreshCw size={14} className="animate-spin" />
                    Neural Character Recognition
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col text-white">
            <header className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5 p-4 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('upload')} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-lg font-black leading-none">Paper Digitized</h1>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mt-1">Found 124 words • 98% Confidence</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-700 transition-all">
                        <Sliders size={16} /> Refine OCR
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(digitizedResult?.digitizedText || '');
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${isCopied ? 'bg-cyan-500 text-white' : 'bg-white text-slate-950 hover:bg-slate-200'}`}
                    >
                        {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        {isCopied ? 'Copied' : 'Copy Text'}
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-xs shadow-xl transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-cyan-500/20'}`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? 'Saved' : 'Save to Docs'}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left - Original Image Preview */}
                <div className="w-1/2 p-10 border-r border-white/5 bg-slate-950 overflow-y-auto hidden lg:block">
                    <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/5 relative group">
                        <div className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-slate-400 uppercase">Original Scan</div>
                        <img
                            src={digitizedResult?.originalImage}
                            alt="Original"
                            className="w-full rounded-2xl shadow-2xl opacity-80"
                        />
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    </div>
                </div>

                {/* Right - Digitized Text Area */}
                <div className="flex-1 p-10 overflow-y-auto bg-[#020617]">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-1 bg-slate-900 p-1 rounded-2xl border border-white/5">
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'text' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Digitized Text
                                </button>
                                <button
                                    onClick={() => setActiveTab('original')}
                                    className={`lg:hidden px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'original' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Original View
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500">
                                <FileType size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Format: Markdown / Text</span>
                            </div>
                        </div>

                        {activeTab === 'text' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative"
                            >
                                <textarea
                                    className="w-full bg-transparent border-0 text-slate-200 text-xl font-medium leading-[2] focus:ring-0 min-h-[600px] resize-none selection:bg-cyan-500/30"
                                    defaultValue={digitizedResult?.digitizedText}
                                    spellCheck={false}
                                />
                                {/* Bottom Floating Suggestions */}
                                <div className="mt-12 p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                                    <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                        <Bot size={14} /> AI Context Suggestions
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">"Make this a lesson plan"</button>
                                        <button className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">"Generate a quiz from this"</button>
                                        <button className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-xs text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">"Translate to Hindi"</button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="rounded-2xl overflow-hidden border border-white/10">
                                <img src={digitizedResult?.originalImage} alt="" className="w-full" />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaperDigitizerView;
