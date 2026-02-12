'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    FileText, HelpCircle, List, Clock, ShieldCheck, Share2, Copy, Save, Eye, EyeOff, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white border-2 
                    ${isOpen ? 'border-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.1)]' : 'border-slate-100'} 
                    px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left hover:border-purple-300 group`}
            >
                <span className={value ? 'text-slate-800' : 'text-slate-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-500' : ''}`} />
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
                                    ${value === option ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span>{option}</span>
                                {value === option && <Check size={14} className="text-purple-600" />}
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
            <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] -ml-48 -mb-48" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-purple-200">
                            <CheckSquare size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Quiz Generator</h1>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">AI Assessment Tool</p>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-12 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col items-center mb-10">
                            <div className="inline-flex bg-slate-100 p-1.5 rounded-full mb-8">
                                <button
                                    onClick={() => setSourceMode('topic')}
                                    className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${sourceMode === 'topic' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Topic Mode
                                </button>
                                <button
                                    onClick={() => setSourceMode('book')}
                                    className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${sourceMode === 'book' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Library Mode
                                </button>
                            </div>
                            <h2 className="text-4xl font-extrabold text-slate-900 text-center leading-tight">Create engaging <span className="text-purple-600 italic font-serif">assessments</span> in seconds.</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Topic or Curriculum Area</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Ancient Greek Mythology, Quantum Mechanics, Algebra..."
                                    className="w-full bg-white border-2 border-slate-100 focus:border-purple-500 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.1)] rounded-[2rem] px-8 py-5 text-lg font-bold transition-all outline-none placeholder:text-slate-300"
                                />
                                <div className="absolute right-6 top-[54px] text-slate-300">
                                    <Sparkles size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <CustomDropdown label="Grade Level" value={grade} onChange={setGrade} options={gradeOptions} placeholder="Select..." />
                                <CustomDropdown label="Difficulty" value={difficulty} onChange={setDifficulty} options={difficultyOptions} placeholder="Select..." />
                                <div className="relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-100 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm font-bold transition-all outline-none"
                                    />
                                </div>
                                <CustomDropdown label="Quiz Style" value={quizType} onChange={setQuizType} options={typeOptions} placeholder="Select..." />
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic}
                                className="group px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-300/40 hover:shadow-purple-400/50 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                            >
                                <div className="flex items-center gap-3">
                                    <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-8">
                <div className="relative w-32 h-32 mb-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-[2.5rem] border-4 border-purple-500/20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-[1.5rem] border-4 border-indigo-500/30 border-t-indigo-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-purple-600">
                        <Sparkles size={40} className="animate-pulse" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">Analyzing Curriculum...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">Designing rigorous questions</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setViewState('form')}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 leading-tight">{generatedQuiz?.title}</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{grade} • {difficulty} • {quizType}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${showAnswers ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {showAnswers ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showAnswers ? 'Hide Key' : 'Answer Key'}
                    </button>
                    <div className="w-px h-8 bg-slate-100 mx-2" />
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 shadow-sm">
                        <Download size={16} /> Export PDF
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                    >
                        {isSaved ? <Check size={16} /> : <Save size={16} />}
                        {isSaved ? 'Saved!' : 'Save to Library'}
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-10">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-16 border border-white">
                    <div className="text-center mb-16 pb-12 border-b-2 border-slate-50">
                        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">{generatedQuiz?.title}</h1>
                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade Level</span>
                                <span className="text-sm font-bold text-slate-800">{grade}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Questions</span>
                                <span className="text-sm font-bold text-slate-800">{generatedQuiz?.questions.length} Total</span>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Limit</span>
                                <span className="text-sm font-bold text-slate-800">30 Mins</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {generatedQuiz?.questions.map((q, idx) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 font-black flex items-center justify-center shrink-0 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 pt-1.5">
                                        <h3 className="text-xl font-bold text-slate-800 leading-snug mb-6">{q.text}</h3>

                                        {q.options && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, i) => (
                                                    <div key={i} className={`px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${showAnswers && opt === q.answer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-transparent text-slate-600'}`}>
                                                        <span className="text-slate-400 mr-3">{String.fromCharCode(65 + i)})</span> {opt}
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
                                                    className="mt-6 pt-6 border-t border-dashed border-green-200 overflow-hidden"
                                                >
                                                    <div className="bg-green-50 p-5 rounded-2xl">
                                                        <div className="flex items-center gap-2 text-green-700 font-black text-[10px] uppercase tracking-widest mb-2">
                                                            <Check size={14} /> Correct Answer: <span className="text-xs">{q.answer}</span>
                                                        </div>
                                                        <p className="text-green-800/70 text-sm font-medium leading-relaxed italic">
                                                            "{q.explanation}"
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 pt-10 border-t-2 border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <Bot size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">Quiz finalized by AI.</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Balanced Difficulty Verified</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all">
                                <Share2 size={20} />
                            </button>
                            <button className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all">
                                <Copy size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizExamGeneratorView;
