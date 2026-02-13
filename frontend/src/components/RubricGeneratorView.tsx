'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, ClipboardList, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    Table, Layout, Edit3, Trash2, Copy, Save, Share2, Filter, MoreHorizontal, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type ViewState = 'form' | 'generating' | 'result';

interface RubricLevel {
    label: string;
    points: number;
}

interface RubricCriterion {
    id: string;
    category: string;
    descriptions: string[]; // Matches length of levels
}

interface RubricContent {
    id: string;
    title: string;
    levels: RubricLevel[];
    criteria: RubricCriterion[];
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

const RubricGeneratorView: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('form');
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [scale, setScale] = useState('4-Point Scale');

    // Result States
    const [generatedRubric, setGeneratedRubric] = useState<RubricContent | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleGenerate = () => {
        if (!topic) return;
        setViewState('generating');

        setTimeout(() => {
            const mockRubric: RubricContent = {
                id: generateId(),
                title: `${topic || 'Creative Writing'} Rubric`,
                levels: [
                    { label: 'Exemplary', points: 4 },
                    { label: 'Proficient', points: 3 },
                    { label: 'Developing', points: 2 },
                    { label: 'Beginning', points: 1 }
                ],
                criteria: [
                    {
                        id: '1',
                        category: 'Content & Research',
                        descriptions: [
                            'In-depth exploration of the topic with multiple high-quality sources.',
                            'Clear understanding of the topic with adequate source support.',
                            'Basic understanding shown, but lacks depth or sufficient evidence.',
                            'Minimal understanding with significant factual gaps.'
                        ]
                    },
                    {
                        id: '2',
                        category: 'Organization',
                        descriptions: [
                            'Seamless transitions and highly logical flow of ideas.',
                            'Clear structure and logical progression for the most part.',
                            'Loosely organized; some parts feel disjointed or repetitive.',
                            'Lacks clear structure; very difficult to follow the main argument.'
                        ]
                    },
                    {
                        id: '3',
                        category: 'Creativity & Voice',
                        descriptions: [
                            'Unique perspective that engages the reader throughout.',
                            'Original voice is present and consistent.',
                            'Standard approach with occasional original insights.',
                            'Formulaic approach; voice is detached or inconsistent.'
                        ]
                    }
                ]
            };
            setGeneratedRubric(mockRubric);
            setViewState('result');
        }, 3000);
    };

    const handleSave = async () => {
        if (!generatedRubric) return;
        const content = {
            id: generateId(),
            type: 'rubric' as const,
            title: generatedRubric.title,
            description: `Grading rubric for ${topic}`,
            content: JSON.stringify(generatedRubric),
            contentType: 'text' as const,
            toolId: 'rubric-generator',
            formData: { topic, grade, scale },
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
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-primary-custom rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary-custom/20">
                            <ClipboardList size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1 uppercase italic">Rubric Generator</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Grading Transparency Model</p>
                        </div>
                    </div>

                    <div className="bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] p-16 border border-border shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="text-center mb-16 relative z-10">
                            <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic mb-4">Design <span className="text-primary-custom">fair</span> assessments.</h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Generate detailed criteria for any assignment, project, or exam.</p>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="relative group/input">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 ml-1">Assignment or Project Title</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Victorian Poetry Essay, Solar Car Project, History Presentation..."
                                        className="w-full bg-muted/30 border-2 border-border focus:border-primary-custom focus:bg-card-bg rounded-[2.5rem] px-10 py-6 text-xl font-bold transition-all outline-none placeholder:text-muted-foreground/30 text-foreground shadow-soft"
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-primary-custom/20 group-hover/input:text-primary-custom group-hover/input:rotate-12 transition-all">
                                        <Sparkles size={28} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CustomDropdown label="Grade Level" value={grade} onChange={setGrade} options={['Elementary', 'Middle School', 'High School', 'University']} placeholder="Select..." />
                                <CustomDropdown label="Scaling Model" value={scale} onChange={setScale} options={['3-Point Scale', '4-Point Scale', '5-Point Scale', 'Percentage-based']} placeholder="Select..." />
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
                                    Construct Rubric
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

                <div className="w-80 h-3 bg-muted rounded-full overflow-hidden relative mb-12 shadow-inner">
                    <motion.div
                        animate={{ x: [-320, 320] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-primary-custom to-transparent"
                    />
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4 uppercase italic tracking-tighter">Defining Metrics...</h2>
                <div className="flex items-center gap-4 text-primary-custom font-black uppercase tracking-[0.4em] text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-primary-custom animate-ping" />
                    Benchmarking Across Educational Standards
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
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">{generatedRubric?.title}</h1>
                        <p className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                            Status: Draft Verified • {scale}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${isEditing ? 'bg-primary-custom text-white border-primary-custom shadow-lg shadow-primary-custom/20' : 'bg-background text-foreground border-border hover:border-primary-custom hover:text-primary-custom'}`}
                    >
                        <Edit3 size={16} /> {isEditing ? 'Finish Editing' : 'Customize Cells'}
                    </button>
                    <div className="w-px h-8 bg-border mx-2" />
                    <button className="flex items-center gap-3 px-6 py-3 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-custom/5 hover:text-primary-custom border border-transparent hover:border-primary-custom/20 transition-all group">
                        <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
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

            <main className="flex-1 p-12 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-card-bg rounded-[3.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.1)] border border-border overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-custom/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        {/* Table Header Section */}
                        <div className="grid grid-cols-5 border-b border-border bg-muted/30 relative z-10">
                            <div className="p-10 border-r border-border bg-card-bg/40 backdrop-blur-md">
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Criterion</h3>
                            </div>
                            {generatedRubric?.levels.map((level, i) => (
                                <div key={i} className={`p-10 ${i < 3 ? 'border-r border-border' : ''} text-center group/lvl`}>
                                    <div className="text-[10px] font-black text-primary-custom uppercase tracking-[0.4em] mb-3 group-hover/lvl:translate-y-[-2px] transition-transform">Level {4 - i}</div>
                                    <h4 className="text-xl font-black text-foreground uppercase italic tracking-tighter mb-1">{level.label}</h4>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{level.points} Points</span>
                                </div>
                            ))}
                        </div>

                        {/* Table Body Section */}
                        <div className="divide-y divide-border relative z-10">
                            {generatedRubric?.criteria.map((criterion, idx) => (
                                <motion.div
                                    key={criterion.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="grid grid-cols-5 group/row hover:bg-primary-custom/[0.02] transition-all duration-500"
                                >
                                    <div className="p-10 border-r border-border bg-muted/10 flex items-center justify-between group-hover/row:bg-primary-custom/[0.05] transition-colors">
                                        <h5 className="font-black text-foreground leading-tight uppercase italic tracking-tight">{criterion.category}</h5>
                                        {isEditing && <Trash2 size={16} className="text-muted-foreground hover:text-red-500 cursor-pointer transition-colors" />}
                                    </div>
                                    {criterion.descriptions.map((desc, i) => (
                                        <div key={i} className={`p-10 ${i < 3 ? 'border-r border-border' : ''} relative`}>
                                            <div className="text-sm font-bold text-muted-foreground leading-relaxed group-hover/row:text-foreground transition-colors">
                                                {isEditing ? (
                                                    <textarea
                                                        defaultValue={desc}
                                                        className="w-full bg-muted/30 border-2 border-transparent focus:border-primary-custom/30 rounded-2xl p-4 focus:bg-card-bg text-sm font-bold resize-none text-foreground leading-relaxed outline-none transition-all"
                                                        rows={5}
                                                    />
                                                ) : desc}
                                            </div>
                                            {isEditing && (
                                                <div className="absolute top-4 right-4 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                    <Settings size={14} className="text-primary-custom/30" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>

                        {/* Add Row Button */}
                        {isEditing && (
                            <div className="p-8 bg-muted/10 flex justify-center border-t border-border">
                                <button className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary-custom hover:text-primary-custom/80 transition-all bg-card-bg px-10 py-5 rounded-2xl border border-primary-custom/20 hover:border-primary-custom shadow-soft hover:shadow-lg hover:shadow-primary-custom/10">
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Criterion Row
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 flex flex-col md:flex-row items-center justify-between px-10 gap-10">
                        <div className="flex items-center gap-12">
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-2.5 bg-primary-custom rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Fairness Audit Passed</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Alignment: Common Core</span>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            {[
                                { icon: <Layout size={18} />, label: "Layout" },
                                { icon: <Filter size={18} />, label: "Template" }
                            ].map((btn, i) => (
                                <button key={i} className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-primary-custom transition-all group">
                                    <span className="group-hover:rotate-12 transition-transform">{btn.icon}</span>
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RubricGeneratorView;
