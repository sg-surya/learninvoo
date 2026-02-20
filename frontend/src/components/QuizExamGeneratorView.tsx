'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    FileText, HelpCircle, List, Clock, ShieldCheck, Share2, Copy, Save, Eye, EyeOff, Wand2, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { saveGeneratedContent, generateId } from '@/lib/storage';
import * as api from '@/lib/api';

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

interface Chapter {
    id: string;
    title: string;
    sequence_number: number;
    content?: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    subject: string;
    grade: string;
    cover?: string;
    color: string;
    iconColor: string;
    chapters: Chapter[];
    classLevel?: string; // Matching LessonPlannerView structure
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

    // Book Selection State
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
    const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
    const [bookSearchQuery, setBookSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Result states
    const [generatedQuiz, setGeneratedQuiz] = useState<QuizContent | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const gradeOptions = ['Grade 1-3', 'Grade 4-6', 'Grade 7-8', 'Grade 9-10', 'Grade 11-12', 'University'];
    const difficultyOptions = ['Easy', 'Balanced', 'Challenging', 'Rigorous'];
    const typeOptions = ['Multiple Choice', 'True/False', 'Full Exam (Mixed)', 'Short Answer'];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const fetchedBooks = await api.getBooks();
                if (Array.isArray(fetchedBooks)) {
                    // Map generic books to UI books if needed, or use as is
                    // Ensure iconColor exists
                    const uiBooks = fetchedBooks.map(b => ({
                        ...b,
                        iconColor: b.color?.replace('bg-', 'text-').replace('-100', '-500') || 'text-blue-500',
                        color: b.color || 'bg-blue-100'
                    }));
                    setBooks(uiBooks);
                }
            } catch (error) {
                console.error("Failed to fetch books:", error);
            }
        };
        fetchBooks();
    }, []);

    // Filter books for search
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
    );

    const handleBookSelect = (book: Book) => {
        setSelectedBook(book);
        setSelectedChapters(new Set()); // Reset chapters
        setIsBookPickerOpen(false);
        setIsDropdownOpen(false);
        setBookSearchQuery('');
    };

    const toggleChapter = (chapterId: string) => {
        const newChapters = new Set(selectedChapters);
        if (newChapters.has(chapterId)) {
            newChapters.delete(chapterId);
        } else {
            newChapters.add(chapterId);
        }
        setSelectedChapters(newChapters);
    };

    const clearBookSelection = () => {
        setSelectedBook(null);
        setSelectedChapters(new Set());
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleGenerate = async () => {
        if (sourceMode === 'topic' && !topic) return;
        if (sourceMode === 'book' && !selectedBook) return;

        setViewState('generating');

        try {
            const topicName = sourceMode === 'book' ? selectedBook?.title : topic;

            const payload = {
                topic: topicName || 'General',
                grade: grade || 'Grade 10',
                difficulty: difficulty || 'Medium',
                questionCount: parseInt(questionCount) || 10,
                type: quizType,
                bookId: sourceMode === 'book' && selectedBook?.id ? String(selectedBook.id) : undefined,
                chapterIds: sourceMode === 'book' && selectedChapters.size > 0 ? Array.from(selectedChapters) : undefined
            };

            const response = await api.generateQuiz(payload);

            // Backend returns a JSON string, parsed automatically by axios? 
            // The prompt ensures JSON. If it's a string, parse it.
            let quizData: QuizContent;
            if (typeof response === 'string') {
                // Try to find JSON block if mixed with text
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    quizData = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("Invalid response format");
                }
            } else if (response.content) {
                // Some backends return { content: ... }
                if (typeof response.content === 'string') {
                    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                    quizData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response.content);
                } else {
                    quizData = response.content;
                }
            } else {
                quizData = response;
            }

            // Ensure ID exists for React keys
            quizData.questions = quizData.questions.map((q, i) => ({
                ...q,
                id: q.id || `q-${i}`
            }));

            setGeneratedQuiz(quizData);
            setViewState('result');
            setIsSaved(false);

        } catch (error) {
            console.error("Quiz generation failed:", error);
            alert("Failed to generate quiz. Please try again.");
            setViewState('form');
        }
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
                            <h2 className="text-4xl md:text-5xl font-black text-foreground text-center leading-[1.1] tracking-tight uppercase italic font-outfit">
                                Design rigorous <br />
                                <span className="text-primary-custom">assessments</span> in seconds.
                            </h2>
                        </div>

                        <div className="space-y-10 relative z-10">

                            {/* TOPIC INPUT MODE */}
                            {sourceMode === 'topic' && (
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
                            )}

                            {/* BOOK INPUT MODE */}
                            {sourceMode === 'book' && (
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Select Source Material</label>
                                    {!selectedBook ? (
                                        <div className="relative" ref={dropdownRef}>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 relative">
                                                    <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        value={bookSearchQuery}
                                                        onChange={(e) => { setBookSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                                                        onFocus={() => setIsDropdownOpen(true)}
                                                        placeholder="Search your library..."
                                                        className="w-full bg-muted/30 border-2 border-border focus:border-primary-custom focus:bg-card-bg rounded-[2.5rem] pl-14 pr-6 py-6 text-xl font-bold transition-all outline-none placeholder:text-muted-foreground/30 text-foreground"
                                                    />
                                                </div>
                                                <button onClick={() => setIsBookPickerOpen(true)} className="p-6 bg-muted hover:bg-primary-custom/10 rounded-[2rem] text-muted-foreground hover:text-primary-custom transition-all border-2 border-transparent hover:border-primary-custom/20">
                                                    <BookOpen size={24} />
                                                </button>
                                            </div>
                                            {isDropdownOpen && filteredBooks.length > 0 && (
                                                <div className="absolute z-50 mt-4 w-full bg-card-bg rounded-[2rem] shadow-2xl border border-border py-4 max-h-[300px] overflow-y-auto animate-fadeIn backdrop-blur-xl">
                                                    {filteredBooks.slice(0, 5).map((book) => (
                                                        <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-4 px-8 py-4 hover:bg-primary-custom/5 transition-all text-left group">
                                                            <div className={`w-12 h-16 rounded-xl ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>{book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={20} className={book.iconColor} />}</div>
                                                            <div className="flex-1"><h4 className="font-black text-base text-foreground group-hover:text-primary-custom uppercase tracking-tight italic">{book.title}</h4><p className="text-[10px] font-bold text-muted-foreground uppercase">{book.author} • {book.classLevel}</p></div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-card-bg border-2 border-border p-6 rounded-[2rem] shadow-sm">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-14 h-20 rounded-xl ${selectedBook.cover ? '' : selectedBook.color} flex items-center justify-center overflow-hidden shadow-md shrink-0`}>
                                                    {selectedBook.cover ? <img src={selectedBook.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={24} className={selectedBook.iconColor} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-black text-foreground uppercase italic tracking-tight">{selectedBook.title}</h3>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">by {selectedBook.author}</p>
                                                    <button onClick={clearBookSelection} className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Change Book</button>
                                                </div>
                                            </div>
                                            {selectedBook.chapters && selectedBook.chapters.length > 0 && (
                                                <div>
                                                    <label className="block text-[10px] font-black text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-widest"><Layers size={14} className="text-primary-custom" />Select Chapters {selectedChapters.size > 0 && <span className="text-primary-custom">({selectedChapters.size})</span>}</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedBook.chapters.map((chapter, idx) => (
                                                            <button
                                                                key={chapter.id}
                                                                onClick={() => toggleChapter(chapter.id)}
                                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 
                                                                ${selectedChapters.has(chapter.id) ? 'bg-primary-custom border-primary-custom text-white shadow-lg shadow-primary-custom/20' : 'bg-transparent text-foreground hover:bg-muted border-border'}`}
                                                            >
                                                                <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center ${selectedChapters.has(chapter.id) ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</span>
                                                                <span className="max-w-[150px] truncate">{chapter.title}</span>
                                                                {selectedChapters.has(chapter.id) && <Check size={12} />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

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
                                disabled={sourceMode === 'topic' ? !topic : !selectedBook}
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

                {/* Book Picker Modal */}
                {isBookPickerOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fadeIn border border-slate-100/20">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">Select Source Book</h3>
                                <button onClick={() => setIsBookPickerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all"><X size={20} /></button>
                            </div>
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={bookSearchQuery} onChange={(e) => setBookSearchQuery(e.target.value)} placeholder="Search by title, author, or subject..." className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all" autoFocus />
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[500px] divide-y divide-slate-100">
                                {filteredBooks.map((book) => (
                                    <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-5 p-5 hover:bg-lime-50 text-left group transition-all">
                                        <div className={`w-14 h-20 rounded-xl ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all`}>{book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={24} className={book.iconColor} />}</div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-lg text-slate-800 group-hover:text-lime-700 uppercase italic tracking-tight">{book.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">{book.subject}</span>
                                                <span className="text-xs font-bold text-slate-400">•</span>
                                                <p className="text-xs font-bold text-slate-500 uppercase">by {book.author}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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
                        <h1 className="text-lg font-black uppercase italic tracking-tight leading-none font-outfit">{generatedQuiz?.title}</h1>
                        <p className="text-[9px] font-bold text-primary-custom uppercase tracking-[0.4em] mt-2 opacity-70">{grade} • {difficulty} • {quizType}</p>
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

                    <div className="text-center mb-16 pb-12 border-b border-border/40 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight uppercase italic leading-[1.1] font-outfit max-w-3xl mx-auto">
                            {generatedQuiz?.title}
                        </h1>
                        <div className="flex justify-center flex-wrap gap-12">
                            {[
                                { label: "Grade Level", value: grade },
                                { label: "Questions", value: `${generatedQuiz?.questions.length} Total` },
                                { label: "Time Limit", value: "30 Mins" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.4em] mb-2">{stat.label}</span>
                                    <span className="text-xs font-black text-foreground uppercase tracking-wider bg-muted/50 px-3 py-1 rounded-lg border border-border/40">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12 relative z-10 max-w-4xl mx-auto">
                        {generatedQuiz?.questions.map((q, idx) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group/q bg-card-bg/40 hover:bg-card-bg/80 p-8 rounded-[2.5rem] border border-transparent hover:border-border/40 transition-all duration-500"
                            >
                                <div className="flex gap-10">
                                    <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground font-black flex items-center justify-center shrink-0 group-hover/q:bg-primary-custom group-hover/q:text-white transition-all duration-500 shadow-soft text-xs">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xl md:text-2xl font-bold text-foreground leading-[1.4] mb-8 tracking-tight font-outfit markdown-container">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {q.text}
                                            </ReactMarkdown>
                                        </div>

                                        {q.options && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`px-6 py-4 rounded-2xl border-2 font-medium text-sm transition-all duration-500 flex items-center gap-4
                                                            ${showAnswers && opt === q.answer
                                                                ? 'bg-primary-custom/10 border-primary-custom text-primary-custom shadow-[0_8px_30px_rgb(var(--primary-rgb),0.08)]'
                                                                : 'bg-muted/20 border-transparent text-muted-foreground/80 hover:border-border/40'}`}
                                                    >
                                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${showAnswers && opt === q.answer ? 'bg-primary-custom text-white' : 'bg-muted/50 text-muted-foreground/40'}`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </span>
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
                                                    className="mt-8 pt-8 border-t border-dashed border-border/60"
                                                >
                                                    <div className="bg-primary-custom/[0.03] p-8 rounded-[2rem] border border-primary-custom/10 relative overflow-hidden group/ans">
                                                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/ans:opacity-[0.1] transition-opacity"><Zap size={40} className="text-primary-custom" /></div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-3 text-primary-custom font-black text-[10px] uppercase tracking-[0.4em] mb-6">
                                                                <div className="w-8 h-8 rounded-lg bg-primary-custom text-white flex items-center justify-center shadow-lg shadow-primary-custom/20">
                                                                    <Check size={16} />
                                                                </div>
                                                                Correct Insight
                                                            </div>
                                                            <div className="text-foreground/80 text-base font-medium leading-relaxed tracking-tight markdown-container pl-1">
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
