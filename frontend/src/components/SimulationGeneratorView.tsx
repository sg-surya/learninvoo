'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Gamepad2, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    Play, Pause, Activity, Cpu, Sliders, Save, Share2, Layers, Minimize2, Maximize2, Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type ViewState = 'form' | 'generating' | 'result';

interface SimulationParam {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    defaultValue: number;
}

interface SimulationContent {
    id: string;
    title: string;
    topic: string;
    parameters: SimulationParam[];
    logic: string;
    visualData: { x: number; y: number }[];
}

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
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-card-bg border-2 
                    ${isOpen ? 'border-primary-custom shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)]' : 'border-border'} 
                    px-5 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left hover:border-primary-custom group shadow-soft`}
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground/50'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-custom' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 mt-2 w-full bg-card-bg rounded-2xl shadow-2xl border border-border py-2 max-h-[250px] overflow-y-auto backdrop-blur-xl"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className={`w-full px-5 py-3 text-left text-sm font-bold transition-all flex items-center justify-between
                                    ${value === option ? 'bg-primary-custom/10 text-primary-custom' : 'text-foreground hover:bg-primary-custom/5'}`}
                            >
                                <span>{option}</span>
                                {value === option && <Check size={14} className="text-primary-custom" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SimulationGeneratorView: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('form');
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [complexity, setComplexity] = useState('Standard');

    // Simulation Runtime States
    const [generatedSim, setGeneratedSim] = useState<SimulationContent | null>(null);
    const [paramValues, setParamValues] = useState<{ [key: string]: number }>({});
    const [isRunning, setIsRunning] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleGenerate = () => {
        if (!topic) return;
        setViewState('generating');

        setTimeout(() => {
            const mockSim: SimulationContent = {
                id: generateId(),
                title: `${topic || 'Electric Circuit'} Lab`,
                topic: topic,
                parameters: [
                    { id: 'v', label: 'Voltage', min: 0, max: 24, step: 0.5, unit: 'V', defaultValue: 12 },
                    { id: 'r', label: 'Resistance', min: 1, max: 100, step: 1, unit: 'Ω', defaultValue: 10 },
                    { id: 't', label: 'Time Scale', min: 1, max: 10, step: 0.1, unit: 's', defaultValue: 1 }
                ],
                logic: 'I = V / R',
                visualData: [] // Would be calculated in real time
            };
            setGeneratedSim(mockSim);
            const initialValues: any = {};
            mockSim.parameters.forEach(p => initialValues[p.id] = p.defaultValue);
            setParamValues(initialValues);
            setViewState('result');
        }, 3000);
    };

    const handleSave = async () => {
        if (!generatedSim) return;
        const content = {
            id: generateId(),
            type: 'simulation' as const,
            title: generatedSim.title,
            description: `Interactive simulation for ${topic}`,
            content: JSON.stringify(generatedSim),
            contentType: 'text' as const,
            toolId: 'simulation-generator',
            formData: { topic, grade, complexity },
            createdAt: Date.now(),
        };
        await saveGeneratedContent(content);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    if (viewState === 'form') {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center p-8 relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-primary-custom rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary-custom/20">
                            <Cpu size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1 uppercase italic">Simulation Engine</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Interactive World Builder</p>
                        </div>
                    </div>

                    <div className="bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] p-16 border border-border shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="text-center mb-16 relative z-10">
                            <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic mb-4">Build <span className="text-primary-custom">interactive</span> worlds.</h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Transform equations into immersive virtual laboratory experiences</p>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="relative group/input">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 ml-1">What concept are we simulating?</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Pendulum Swing, Greenhouse Effect, Supply & Demand..."
                                        className="w-full bg-muted/30 border-2 border-border focus:border-primary-custom focus:bg-card-bg rounded-[2.5rem] px-10 py-6 text-xl font-bold transition-all outline-none placeholder:text-muted-foreground/30 text-foreground shadow-soft"
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-primary-custom/20 group-hover/input:text-primary-custom group-hover/input:rotate-12 transition-all">
                                        <Activity size={28} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <CustomDropdown label="Grade Level" value={grade} onChange={setGrade} options={['Elementary', 'Middle School', 'High School', 'University']} placeholder="Select..." />
                                <CustomDropdown label="Complexity" value={complexity} onChange={setComplexity} options={['Simplified', 'Standard', 'Rigorous Scientific']} placeholder="Select..." />
                                <div className="relative">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Engine Core</label>
                                    <div className="w-full px-5 py-3.5 bg-muted/50 rounded-2xl flex items-center justify-between border border-border">
                                        <span className="text-xs font-black text-foreground uppercase tracking-tight">Learnivo 2.0</span>
                                        <Zap size={14} className="text-orange-500 fill-orange-500/20" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex justify-center relative z-10">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic}
                                className="group px-14 py-6 bg-foreground text-background rounded-full font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-custom/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform text-primary-custom" />
                                    Launch Virtual Lab
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (viewState === 'generating') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-8 overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative w-48 h-48">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary-custom/20 rounded-full blur-3xl shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu size={80} className="text-primary-custom animate-pulse drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
                    </div>
                    <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                        <motion.circle
                            cx="96" cy="96" r="86"
                            fill="none" stroke="currentColor" strokeWidth="6"
                            className="text-muted/30"
                        />
                        <motion.circle
                            cx="96" cy="96" r="86"
                            fill="none" stroke="currentColor" strokeWidth="6"
                            strokeDasharray="540"
                            animate={{ strokeDashoffset: [540, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="text-primary-custom"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-foreground mt-16 mb-4 uppercase italic tracking-tighter">Synthesizing Logic...</h2>
                <div className="flex items-center gap-4 text-primary-custom font-black uppercase tracking-[0.4em] text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-primary-custom animate-ping" />
                    Calibrating Physics & Interactions
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col text-foreground">
            <header className="bg-background/80 backdrop-blur-[20px] border-b border-border p-5 px-10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('form')} className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl text-muted-foreground hover:text-primary-custom hover:bg-primary-custom/10 transition-all border border-transparent hover:border-primary-custom/20 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">{generatedSim?.title}</h1>
                        <p className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mt-1.5">Status: Operational • {complexity}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-3 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-custom/5 hover:text-primary-custom border border-transparent hover:border-primary-custom/20 transition-all group">
                        <Share2 size={16} className="group-hover:rotate-12 transition-transform" /> Share Link
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isSaved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-foreground text-background hover:bg-foreground/90 shadow-black/10'}`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? 'Deployed' : 'Deploy to Class'}
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 grid grid-cols-12 gap-10 overflow-hidden">
                {/* Simulation Control Panel */}
                <aside className="col-span-12 lg:col-span-3 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-card-bg rounded-[2.5rem] p-10 border border-border shadow-soft relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="p-2.5 bg-primary-custom/10 rounded-xl text-primary-custom">
                                <Sliders size={20} />
                            </div>
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Lab Controls</h3>
                        </div>

                        <div className="space-y-12 relative z-10">
                            {generatedSim?.parameters.map((p) => (
                                <div key={p.id}>
                                    <div className="flex justify-between items-center mb-5">
                                        <label className="text-xs font-black text-foreground uppercase tracking-tight italic">{p.label}</label>
                                        <span className="px-4 py-1.5 bg-primary-custom/10 text-primary-custom rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {paramValues[p.id]} {p.unit}
                                        </span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min={p.min}
                                            max={p.max}
                                            step={p.step}
                                            value={paramValues[p.id]}
                                            onChange={(e) => setParamValues({ ...paramValues, [p.id]: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary-custom"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                        <span>{p.min}</span>
                                        <span>{p.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-14 pt-10 border-t border-border relative z-10">
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.3em] transition-all hover:-translate-y-1 active:scale-95 shadow-xl ${isRunning ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-green-500 text-white shadow-green-500/20'}`}
                            >
                                {isRunning ? <motion.div animate={{ rotate: 90 }}><Pause size={20} /></motion.div> : <Play size={20} />}
                                {isRunning ? 'Stop Sim' : 'Launch Experiment'}
                            </button>
                            <button className="w-full mt-6 py-4 text-muted-foreground font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:text-primary-custom transition-colors group">
                                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Reset defaults
                            </button>
                        </div>
                    </div>

                    <div className="bg-foreground rounded-[2.5rem] p-10 text-background relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/20 rounded-full blur-[60px] pointer-events-none" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mb-4">Live Telemetry</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black italic tracking-tighter">{(paramValues['v'] / paramValues['r']).toFixed(2)}</span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amperes</span>
                            </div>
                            <div className="mt-8 h-16 w-full bg-background/5 rounded-2xl flex items-end gap-1.5 p-3 overflow-hidden border border-background/10">
                                {[...Array(24)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isRunning ? [`${Math.random() * 80 + 20}%`, `${Math.random() * 80 + 20}%`] : '15%' }}
                                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                        className="flex-1 bg-primary-custom/40 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Visualization Area */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
                    <div className="flex-1 bg-card-bg rounded-[3.5rem] border border-border shadow-soft relative overflow-hidden group">
                        {/* Simulation Background FX */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                        />

                        {/* Simulated Canvas View */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-20">
                            <div className="text-center relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-custom/10 rounded-full blur-[80px]" />

                                <motion.div
                                    animate={isRunning ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative w-64 h-64 bg-foreground rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex items-center justify-center text-primary-custom mb-12 border border-white/10 group-hover:border-primary-custom/50 transition-colors"
                                >
                                    <div className="absolute inset-4 rounded-[3rem] border border-primary-custom/20" />
                                    <Zap
                                        size={96}
                                        className="relative z-10 transition-all duration-700"
                                        style={{
                                            opacity: 0.2 + (paramValues['v'] / 24) * 0.8,
                                            filter: `drop-shadow(0 0 ${paramValues['v']}px rgba(var(--primary-rgb), 0.5))`
                                        }}
                                    />
                                </motion.div>
                                <h3 className="text-4xl font-black text-foreground mb-4 uppercase italic tracking-tighter leading-none">Simulation Environment</h3>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Interactive {topic} model active v2.4</p>

                                {isRunning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-10 inline-flex items-center gap-4 px-8 py-3 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-green-500/20"
                                    >
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                                        Computing Real-Time Interactions
                                    </motion.div>
                                )}
                            </div>

                            {/* HUD Elements */}
                            <div className="absolute top-12 left-12 flex flex-col gap-6">
                                {[
                                    { label: "Stability", value: "99.2%", icon: <Activity size={14} /> },
                                    { label: "Sync-Rate", value: "60.0 Hz", icon: <RefreshCw size={14} /> }
                                ].map((hud, i) => (
                                    <div key={i} className="px-6 py-4 bg-muted/30 backdrop-blur-md rounded-2xl border border-border shadow-sm flex items-center gap-4">
                                        <div className="text-primary-custom">{hud.icon}</div>
                                        <div>
                                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{hud.label}</p>
                                            <p className="text-xs font-black text-foreground">{hud.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-12 right-12 flex gap-4">
                                {[<Maximize2 size={20} />, <Gauge size={20} />, <Layers size={20} />].map((icon, i) => (
                                    <button key={i} className="w-14 h-14 bg-card-bg/60 backdrop-blur-lg shadow-xl rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary-custom border border-border transition-all hover:-translate-y-1">
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-56 bg-foreground rounded-[3.5rem] p-12 flex items-center gap-16 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-primary-custom/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex-1">
                            <h3 className="text-primary-custom text-[10px] font-black uppercase tracking-[0.4em] mb-5">Scientific Methodology Summary</h3>
                            <p className="text-muted-foreground/80 text-base leading-relaxed max-w-2xl font-bold italic uppercase tracking-tight">
                                This environment leverages <span className="text-white">Precision Physics Engine 4.0</span> to model real-world interactions. Adjusting parameters modulates the <span className="text-primary-custom">dynamic flow state</span>, ensuring rigorous curriculum alignment with scientific accuracy.
                            </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-10">
                            {[
                                { label: "Complexity", value: "4.2k", unit: "nodes" },
                                { label: "Latency", value: "12", unit: "ms" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                                    <div className="text-3xl font-black text-white italic tracking-tighter">
                                        {stat.value}<span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-widest font-black non-italic">{stat.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SimulationGeneratorView;
