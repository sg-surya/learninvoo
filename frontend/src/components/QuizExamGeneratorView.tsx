'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    FileText, HelpCircle, List, Clock, ShieldCheck, Share2, Copy, Save, Eye, EyeOff, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type ViewState = 'form' | 'generating' | 'result';
type SourceMode = 'topic' | 'book';

interface Question {
    id: string;
    text: string;
    options?: string[];
    answer: string;
    explanation?: string;
}

interface QuizContent {
    title: string;
    subject: string;
    grade: string;
    questions: Question[];
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

const QuizExamGeneratorView: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('form');
    const [sourceMode, setSourceMode] = useState<SourceMode>('topic');
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [questionCount, setQuestionCount] = useState('10');
    const [quizType, setQuizType] = useState('Multiple Choice');

    // Result states
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizContent | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const gradeOptions = ['Grade 1-3', 'Grade 4-6', 'Grade 7-8', 'Grade 9-10', 'Grade 11-12', 'University'];
    const difficultyOptions = ['Easy', 'Balanced', 'Challenging', 'Rigorous'];
    const typeOptions = ['Multiple Choice', 'True/False', 'Full Exam (Mixed)', 'Short Answer'];

    const handleGenerate = () => {
        if (sourceMode === 'topic' && !topic) return;
        setViewState('generating');

        setTimeout(() => {
            const mockQuiz: QuizContent = {
                title: `${topic || 'General Science'} Quiz`,
                subject: 'Science',
                grade: grade || 'Grade 10',
                questions: [
                    {
                        id: '1',
                        text: 'Which of the following describes the primary function of chlorophyll in plants?',
                        options: ['Absorbing sunlight', 'Storing water', 'Producing CO2', 'Regulating temperature'],
                        answer: 'Absorbing sunlight',
                        explanation: 'Chlorophyll is a pigment that absorbs light energy (primarily blue and red wavelengths) for photosynthesis.'
                    },
                    {
                        id: '2',
                        text: 'True or False: Photosynthesis occurs in the mitochondria of the cell.',
                        answer: 'False',
                        explanation: 'Photosynthesis occurs in the chloroplasts. Mitochondria are the site of cellular respiration.'
                    },
                    {
                        id: '3',
                        text: 'What are the two main products of photosynthesis?',
                        options: ['Glucose and Oxygen', 'Water and CO2', 'Sugar and Sunlight', 'Nitrogen and ATP'],
                        answer: 'Glucose and Oxygen',
                        explanation: 'Plants convert sunlight, water, and CO2 into Glucose (chemical energy) and Oxygen (byproduct).'
                    }
                ]
            };
            setGeneratedQuiz(mockQuiz);
            setViewState('result');
        }, 3000);
    };

    const handleSave = async () => {
        if (!generatedQuiz) return;
        const content = {
            id: generateId(),
            type: 'quiz' as const,
            title: generatedQuiz.title,
            description: `Generated ${quizType} for ${grade}`,
            content: JSON.stringify(generatedQuiz),
            contentType: 'text' as const,
            toolId: 'quiz-exam-generator',
            formData: { topic, grade, difficulty, questionCount, quizType },
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
                            <CheckSquare size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1 uppercase italic">Quiz Generator</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">AI Assessment Intelligence</p>
                        </div>
                    </div>

                    <div className="bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] p-16 border border-border shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex flex-col items-center mb-16 relative z-10">
                            <div className="inline-flex bg-muted p-1.5 rounded-full mb-10 border border-border">
                                <button
                                    onClick={() => setSourceMode('topic')}
                                    className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${sourceMode === 'topic' ? 'bg-card-bg text-primary-custom shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Topic Mode
                                </button>
                                <button
                                    onClick={() => setSourceMode('book')}
                                    className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${sourceMode === 'book' ? 'bg-card-bg text-primary-custom shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Library Mode
                                </button>
                            </div>
                            <h2 className="text-5xl font-black text-foreground text-center leading-[1.1] tracking-tighter uppercase italic">
                                Design rigorous <br />
                                <span className="text-primary-custom">assessments</span> in seconds.
                            </h2>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="relative group/input">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 ml-1">Topic or Curriculum Area</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Ancient Greek Mythology, Quantum Mechanics, Algebra..."
                                        className="w-full bg-muted/30 border-2 border-border focus:border-primary-custom focus:bg-card-bg rounded-[2.5rem] px-10 py-6 text-xl font-bold transition-all outline-none placeholder:text-muted-foreground/30 text-foreground"
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-primary-custom/20 group-hover/input:text-primary-custom group-hover/input:rotate-12 transition-all">
                                        <Sparkles size={28} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <CustomDropdown label="Grade Level" value={grade} onChange={setGrade} options={gradeOptions} placeholder="Select..." />
                                <CustomDropdown label="Difficulty" value={difficulty} onChange={setDifficulty} options={difficultyOptions} placeholder="Select..." />
                                <div className="relative">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(e.target.value)}
                                        className="w-full bg-card-bg border-2 border-border focus:border-primary-custom rounded-2xl px-5 py-3.5 text-sm font-bold transition-all outline-none text-foreground shadow-soft"
                                    />
                                </div>
                                <CustomDropdown label="Quiz Style" value={quizType} onChange={setQuizType} options={typeOptions} placeholder="Select..." />
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
                                    <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
                                    Generate Assessment
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

                <div className="relative w-40 h-40 mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-[3rem] border-4 border-primary-custom/10"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-[2rem] border-4 border-primary-custom/30 border-t-primary-custom"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-primary-custom">
                        <Sparkles size={48} className="animate-pulse" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4 uppercase italic tracking-tighter">Analyzing Curriculum...</h2>
                <div className="flex items-center gap-4 text-primary-custom font-black uppercase tracking-[0.4em] text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-primary-custom animate-ping" />
                    Designing Rigorous Questions
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col text-foreground">
            <header className="bg-background/80 backdrop-blur-[20px] border-b border-border p-5 px-10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setViewState('form')}
                        className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl text-muted-foreground hover:text-primary-custom hover:bg-primary-custom/10 transition-all border border-transparent hover:border-primary-custom/20 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">{generatedQuiz?.title}</h1>
                        <p className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mt-1.5">{grade} • {difficulty} • {quizType}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${showAnswers ? 'bg-primary-custom text-white border-primary-custom shadow-lg shadow-primary-custom/20' : 'bg-background text-foreground border-border hover:border-primary-custom hover:text-primary-custom'}`}
                    >
                        {showAnswers ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showAnswers ? 'Hide Key' : 'Answer Key'}
                    </button>
                    <div className="w-px h-8 bg-border mx-2" />
                    <button className="flex items-center gap-3 px-6 py-3 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-custom/5 hover:text-primary-custom border border-transparent hover:border-primary-custom/20 transition-all group">
                        <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export PDF
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

            <main className="flex-1 max-w-5xl mx-auto w-full p-12">
                <div className="bg-card-bg rounded-[3.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.1)] p-16 border border-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-custom/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="text-center mb-20 pb-16 border-b border-border relative z-10">
                        <h1 className="text-5xl md:text-6xl font-black text-foreground mb-8 tracking-tighter uppercase italic leading-none">{generatedQuiz?.title}</h1>
                        <div className="flex justify-center flex-wrap gap-10">
                            {[
                                { label: "Grade Level", value: grade },
                                { label: "Questions", value: `${generatedQuiz?.questions.length} Total` },
                                { label: "Time Limit", value: "30 Mins" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">{stat.label}</span>
                                    <span className="text-sm font-black text-foreground uppercase tracking-tight">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-16 relative z-10">
                        {generatedQuiz?.questions.map((q, idx) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group/q"
                            >
                                <div className="flex gap-8">
                                    <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground font-black flex items-center justify-center shrink-0 group-hover/q:bg-primary-custom group-hover/q:text-white transition-all duration-500 shadow-soft group-hover/q:shadow-lg group-hover/q:shadow-primary-custom/20">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="text-2xl font-black text-foreground leading-snug mb-10 tracking-tight italic markdown-container">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {q.text}
                                            </ReactMarkdown>
                                        </div>

                                        {q.options && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                                {q.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`px-8 py-6 rounded-[2rem] border-2 font-bold text-sm transition-all duration-500
                                                            ${showAnswers && opt === q.answer
                                                                ? 'bg-green-500/10 border-green-500 text-green-600 shadow-lg shadow-green-500/10'
                                                                : 'bg-muted/30 border-transparent text-muted-foreground group-hover/q:border-border'}`}
                                                    >
                                                        <span className="text-primary-custom/40 mr-4 font-black">{String.fromCharCode(65 + i)}</span>
                                                        <span className="tracking-tight markdown-container inline-block">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {opt}
                                                            </ReactMarkdown>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <AnimatePresence>
                                            {showAnswers && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-8 pt-8 border-t border-dashed border-border"
                                                >
                                                    <div className="bg-primary-custom/5 p-8 rounded-[2rem] border border-primary-custom/10 relative overflow-hidden group/ans">
                                                        <div className="absolute top-0 right-0 p-6 opacity-10"><HelpCircle size={32} className="text-primary-custom" /></div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-3 text-primary-custom font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                                                                <Check size={18} /> Correct Answer: <span className="text-xs ml-2 text-foreground">{q.answer}</span>
                                                            </div>
                                                            <div className="text-muted-foreground text-base font-bold leading-relaxed italic tracking-tight markdown-container">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {q.explanation || ''}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-24 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-muted flex items-center justify-center shadow-inner group-hover:bg-primary-custom/5 transition-colors">
                                <Bot size={28} className="text-primary-custom/40 group-hover:text-primary-custom transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-foreground uppercase italic tracking-tighter">Quiz finalized by AI intelligence.</p>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-1">Balanced Difficulty Verified</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { icon: <Share2 size={20} />, label: "Share" },
                                { icon: <Copy size={20} />, label: "Copy" }
                            ].map((action, i) => (
                                <button key={i} className="w-12 h-12 flex items-center justify-center bg-muted hover:bg-primary-custom/10 text-muted-foreground hover:text-primary-custom rounded-xl transition-all border border-transparent hover:border-primary-custom/20 shadow-soft">
                                    {action.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizExamGeneratorView;
