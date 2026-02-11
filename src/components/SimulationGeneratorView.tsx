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
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white border-2 
                    ${isOpen ? 'border-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.1)]' : 'border-slate-100'} 
                    px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left hover:border-sky-300 group`}
            >
                <span className={value ? 'text-slate-800' : 'text-slate-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-sky-500' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 max-h-[200px] overflow-y-auto"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className={`w-full px-4 py-2.5 text-left text-sm font-bold transition-all flex items-center justify-between
                                    ${value === option ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span>{option}</span>
                                {value === option && <Check size={14} className="text-sky-600" />}
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
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-8 relative overflow-hidden">
                {/* Tech Grid Background */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-sky-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-200">
                            <Cpu size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Simulation Generator</h1>
                            <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.4em] ml-1">Virtual Lab Engine</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-2xl rounded-[3.5rem] p-16 border border-white shadow-[0_40px_80px_rgba(0,0,0,0.06)]">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] mb-4">Build <span className="text-sky-500 italic">interactive</span> worlds.</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Transform equations into interactive experiences</p>
                        </div>

                        <div className="space-y-12">
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">What concept are we simulating?</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Pendulum Swing, Greenhouse Effect, Supply & Demand..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-sky-500 focus:bg-white rounded-3xl px-10 py-7 text-xl font-bold transition-all outline-none placeholder:text-slate-300"
                                />
                                <div className="absolute right-8 top-[60px] text-sky-200 group-hover:text-sky-400 transition-colors">
                                    <Activity size={32} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <CustomDropdown label="Grade Level" value={grade} onChange={setGrade} options={['Elementary', 'Middle School', 'High School', 'University']} placeholder="Select..." />
                                <CustomDropdown label="Complexity" value={complexity} onChange={setComplexity} options={['Simplified', 'Standard', 'Rigorous Scientific']} placeholder="Select..." />
                                <div className="relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Engine</label>
                                    <div className="w-full px-4 py-3 bg-slate-100 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-500">Learnivo Core 2.0</span>
                                        <Zap size={14} className="text-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 flex justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic}
                                className="group px-14 py-6 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm transition-all hover:bg-sky-600 hover:scale-105 active:scale-95 disabled:opacity-50 shadow-2xl shadow-slate-900/10"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles size={20} className="text-sky-400 group-hover:rotate-12 transition-transform" />
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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <div className="relative w-40 h-40">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-sky-200 rounded-full blur-3xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu size={64} className="text-sky-600 animate-pulse" />
                    </div>
                    <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                        <motion.circle
                            cx="80" cy="80" r="70"
                            fill="none" stroke="currentColor" strokeWidth="8"
                            className="text-sky-100"
                        />
                        <motion.circle
                            cx="80" cy="80" r="70"
                            fill="none" stroke="currentColor" strokeWidth="8"
                            strokeDasharray="440"
                            animate={{ strokeDashoffset: [440, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="text-sky-500"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mt-12 mb-3">Synthesizing Logic...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Calibrating Physics & Interactions</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
            <header className="bg-white border-b border-slate-200 p-4 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('form')} className="p-2 bg-slate-50 text-slate-400 hover:text-sky-600 rounded-xl transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{generatedSim?.title}</h1>
                        <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mt-1">Status: Operational • {complexity}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                        <Share2 size={16} /> Share Link
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sky-500/20'}`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? 'Deployed' : 'Deploy to Class'}
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden">
                {/* Simulation Control Panel */}
                <aside className="col-span-12 lg:col-span-3 space-y-6 overflow-y-auto pr-2">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <Sliders size={20} className="text-sky-500" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Lab Controls</h3>
                        </div>

                        <div className="space-y-10">
                            {generatedSim?.parameters.map((p) => (
                                <div key={p.id}>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-bold text-slate-700">{p.label}</label>
                                        <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-xs font-black">
                                            {paramValues[p.id]} {p.unit}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={p.min}
                                        max={p.max}
                                        step={p.step}
                                        value={paramValues[p.id]}
                                        onChange={(e) => setParamValues({ ...paramValues, [p.id]: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-sky-500"
                                    />
                                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300">
                                        <span>{p.min}</span>
                                        <span>{p.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100">
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all ${isRunning ? 'bg-amber-100 text-amber-600' : 'bg-green-600 text-white shadow-xl shadow-green-100'}`}
                            >
                                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                                {isRunning ? 'Stop Simulation' : 'Run Experiment'}
                            </button>
                            <button className="w-full mt-4 py-4 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:text-slate-600">
                                <RefreshCw size={14} /> Reset defaults
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Live Telemetry</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black">{(paramValues['v'] / paramValues['r']).toFixed(2)}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">Amperes</span>
                            </div>
                            <div className="mt-4 h-12 w-full bg-white/5 rounded-xl flex items-end gap-1 p-2">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isRunning ? [`${Math.random() * 80 + 20}%`, `${Math.random() * 80 + 20}%`] : '20%' }}
                                        className="flex-1 bg-sky-500/40 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Visualization Area */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
                    <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center p-20">
                        {/* Simulated Canvas View */}
                        <div className="relative w-full h-full border-4 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center">
                            <div className="text-center">
                                <motion.div
                                    animate={isRunning ? { scale: [1, 1 + (paramValues['v'] / 40), 1], rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="w-48 h-48 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-[3rem] shadow-2xl flex items-center justify-center text-white mb-8"
                                >
                                    <Zap size={64} style={{ opacity: paramValues['v'] / 24 }} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Simulation Rendering</h3>
                                <p className="text-slate-400 font-medium">Interactive {topic} model active.</p>
                                {isRunning && (
                                    <div className="mt-6 inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                        Processing Real-Time Data
                                    </div>
                                )}
                            </div>

                            {/* HUD Elements */}
                            <div className="absolute top-8 left-8 flex flex-col gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">FPS</p>
                                    <p className="text-sm font-black text-slate-800">60.0</p>
                                </div>
                            </div>

                            <div className="absolute bottom-8 right-8 flex gap-3">
                                <button className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-600 border border-slate-50 transition-all">
                                    <Maximize2 size={20} />
                                </button>
                                <button className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-600 border border-slate-50 transition-all">
                                    <Gauge size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-48 bg-slate-900 rounded-[2.5rem] p-10 flex items-center gap-12 overflow-hidden relative">
                        <div className="flex-1">
                            <h3 className="text-sky-400 text-[10px] font-black uppercase tracking-widest mb-4">Physics Engine Summary</h3>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-xl font-medium">
                                This simulation uses <span className="text-white font-bold">Newtonian Dynamics</span> to calculate real-time interactions. Adjusting Voltage increases electron pressure across the resistive barrier, while Resistance modulates current flow.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Complexity</p>
                                <div className="text-xl font-black text-white">4.2k <span className="text-[10px] text-slate-500">nodes</span></div>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Latency</p>
                                <div className="text-xl font-black text-white">12ms</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SimulationGeneratorView;
