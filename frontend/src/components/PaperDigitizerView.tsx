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
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-custom/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[80px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl relative z-10"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex p-5 bg-card-bg/50 backdrop-blur-xl rounded-[2rem] mb-8 border border-border shadow-soft shadow-primary-custom/5"
                        >
                            <div className="w-16 h-16 bg-primary-custom rounded-2xl flex items-center justify-center shadow-lg shadow-primary-custom/20">
                                <Scan size={32} className="text-white" />
                            </div>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black text-foreground mb-4 tracking-tighter uppercase italic leading-none">Paper <br /><span className="text-primary-custom">Digitizer</span></h1>
                        <p className="text-muted-foreground text-lg font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">Convert handwritten notes into digital intelligence instantly.</p>
                    </div>

                    <div className="relative group perspective-1000">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                        />
                        <div className="bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] p-20 border-2 border-dashed border-border group-hover:border-primary-custom/50 transition-all duration-500 flex flex-col items-center justify-center text-center shadow-soft group-hover:shadow-2xl group-hover:scale-[1.02] transform-gpu">
                            <div className="w-28 h-28 bg-muted/50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-custom/10 transition-all duration-500 shadow-inner">
                                <Upload size={40} className="text-muted-foreground group-hover:text-primary-custom transition-colors duration-500" />
                            </div>
                            <h3 className="text-3xl font-black text-foreground mb-4 uppercase italic tracking-tighter">Ready to Scan?</h3>
                            <p className="text-muted-foreground font-bold uppercase tracking-tight max-w-xs mx-auto mb-10 text-sm leading-relaxed">Drag architecture, JPG, PNG or PDF scans of your handwritten notes here.</p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="px-6 py-3 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-3 border border-transparent group-hover:border-border transition-all">
                                    <Camera size={14} className="text-primary-custom" /> Mobile Sync
                                </div>
                                <div className="px-6 py-3 bg-muted rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-3 border border-transparent group-hover:border-border transition-all">
                                    <Languages size={14} className="text-primary-custom" /> 50+ Languages
                                </div>
                            </div>
                        </div>

                        {/* Decorative corner accents */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-custom/30 rounded-tl-[3.5rem] -translate-x-2 -translate-y-2 pointer-events-none group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary-custom/30 rounded-br-[3.5rem] translate-x-2 translate-y-2 pointer-events-none group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                    </div>
                </motion.div>
            </div>
        );
    }

    if (viewState === 'scanning') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-8 overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative w-80 h-[480px] bg-card-bg rounded-[2.5rem] border-4 border-border overflow-hidden shadow-2xl relative">
                    {/* Simulated Paper Image */}
                    {selectedImage && <img src={selectedImage} alt="" className="w-full h-full object-cover opacity-40 grayscale contrast-125" />}

                    {/* Scanning Laser */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1.5 bg-primary-custom shadow-[0_0_25px_rgba(var(--primary-rgb),0.8)] z-10"
                    />

                    {/* Floating OCR Fragments */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-full flex flex-wrap gap-2 p-10 opacity-30">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                    className="bg-primary-custom/20 px-2 py-1 rounded text-[8px] font-black font-mono text-primary-custom"
                                >
                                    {Math.random().toString(36).substring(7).toUpperCase()}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Corner Markers */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary-custom z-20" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary-custom z-20" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary-custom z-20" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary-custom z-20" />
                </div>

                <div className="text-center relative z-20">
                    <h2 className="text-4xl font-black text-foreground mt-12 mb-4 tracking-tight uppercase italic">Digitizing...</h2>
                    <div className="flex items-center justify-center gap-4 text-primary-custom font-black uppercase tracking-[0.4em] text-[10px]">
                        <RefreshCw size={14} className="animate-spin" />
                        Neural Character Recognition
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground">
            <header className="bg-background/80 backdrop-blur-[20px] border-b border-border p-5 px-10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('upload')} className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl text-muted-foreground hover:text-primary-custom hover:bg-primary-custom/10 transition-all border border-transparent hover:border-primary-custom/20 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">Paper Digitized</h1>
                        <p className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                            <CheckCircle2 size={12} /> Found 124 words • 98% Confidence
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-custom/5 hover:text-primary-custom border border-transparent hover:border-primary-custom/20 transition-all">
                        <Sliders size={16} /> Refine OCR
                    </button>
                    <div className="w-px h-8 bg-border mx-2" />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(digitizedResult?.digitizedText || '');
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${isCopied ? 'bg-primary-custom text-white border-primary-custom shadow-lg shadow-primary-custom/20' : 'bg-background text-foreground border-border hover:border-primary-custom hover:text-primary-custom'}`}
                    >
                        {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        {isCopied ? 'Copied' : 'Copy Text'}
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isSaved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-foreground text-background hover:bg-foreground/90 shadow-black/10'}`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? 'Saved' : 'Save to Docs'}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left - Original Image Preview */}
                <div className="w-1/2 p-12 border-r border-border bg-muted/30 overflow-y-auto hidden lg:block">
                    <div className="bg-card-bg rounded-[3rem] p-10 border border-border relative group shadow-soft">
                        <div className="absolute top-6 left-6 z-10 px-5 py-2 bg-foreground text-background backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Original Scan</div>
                        <img
                            src={digitizedResult?.originalImage}
                            alt="Original"
                            className="w-full rounded-3xl shadow-2xl transition-all duration-700 group-hover:scale-[1.01]"
                        />
                        <div className="absolute inset-0 bg-primary-custom/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
                    </div>
                </div>

                {/* Right - Digitized Text Area */}
                <div className="flex-1 p-12 overflow-y-auto bg-background relative">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex gap-2 bg-muted p-1.5 rounded-[1.5rem] border border-border">
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'text' ? 'bg-card-bg text-primary-custom shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Digitized Text
                                </button>
                                <button
                                    onClick={() => setActiveTab('original')}
                                    className={`lg:hidden px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'original' ? 'bg-card-bg text-primary-custom shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Original View
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <FileType size={18} className="text-primary-custom" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Markdown / Text</span>
                            </div>
                        </div>

                        {activeTab === 'text' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative"
                            >
                                <textarea
                                    className="w-full bg-transparent border-0 text-foreground text-2xl font-bold leading-[1.8] focus:ring-0 min-h-[650px] resize-none selection:bg-primary-custom/20 placeholder:text-muted-foreground/30"
                                    defaultValue={digitizedResult?.digitizedText}
                                    spellCheck={false}
                                />

                                {/* Bottom Floating Suggestions */}
                                <div className="mt-16 p-10 bg-primary-custom/5 rounded-[2.5rem] border border-primary-custom/10 relative overflow-hidden group/ai">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/ai:opacity-20 transition-opacity"><Bot size={48} className="text-primary-custom" /></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 text-primary-custom font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                                            <Sparkles size={16} /> AI Intelligence Layer
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { label: "Make this a lesson plan", icon: <BookOpen size={14} /> },
                                                { label: "Generate a quiz from this", icon: <CheckCircle2 size={14} /> },
                                                { label: "Translate to Hindi", icon: <Languages size={14} /> }
                                            ].map((action, i) => (
                                                <button key={i} className="px-6 py-3 bg-card-bg border border-border rounded-2xl text-[10px] font-black text-foreground uppercase tracking-widest hover:border-primary-custom hover:text-primary-custom hover:shadow-lg transition-all flex items-center gap-3 group/btn">
                                                    <span className="text-primary-custom group-hover/btn:scale-110 transition-transform">{action.icon}</span> {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
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
