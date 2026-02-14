'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Image as ImageIcon, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, RefreshCw,
    Send, Mic, Bot, Zap, Brush, PenTool, Frame, ImagePlus, BookOpen, Search, Layers, Maximize2
} from 'lucide-react';
import { saveGeneratedContent, generateId } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

type ViewState = 'form' | 'generating' | 'result';
type SourceMode = 'topic' | 'book';

interface GeneratedVisual {
    id: string;
    url: string;
    style: string;
}

interface Chapter {
    id: string;
    title: string;
    pages: number;
}

interface Book {
    id: string;
    title: string;
    author: string;
    subject: string;
    classLevel: string;
    cover?: string;
    color: string;
    iconColor: string;
    chapters?: Chapter[];
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

    // Book Mode States
    const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
    const [bookSearchQuery, setBookSearchQuery] = useState('');
    const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const chapterDropdownRef = useRef<HTMLDivElement>(null);

    const gradeOptions = ['Elementary School', 'Middle School', 'High School', 'University / Higher Ed'];
    const styleOptions = ['Scientific Diagram', 'Minimalist Illustration', 'Photorealistic Asset', 'Artistic Watercolor', 'Cinematic 3D Render'];

    // Load books from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) setBooks(JSON.parse(saved));
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (chapterDropdownRef.current && !chapterDropdownRef.current.contains(event.target as Node)) {
                setIsChapterDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
    );

    const handleBookSelect = (book: Book) => {
        setSelectedBook(book);
        setSelectedChapters(new Set());
        setBookSearchQuery('');
        setIsDropdownOpen(false);
        setIsBookPickerOpen(false);
        if (book.classLevel) setGrade(book.classLevel);
    };

    const toggleChapter = (chapterId: string) => {
        const newSelected = new Set(selectedChapters);
        if (newSelected.has(chapterId)) newSelected.delete(chapterId);
        else newSelected.add(chapterId);
        setSelectedChapters(newSelected);
    };

    const clearBookSelection = () => {
        setSelectedBook(null);
        setSelectedChapters(new Set());
    };

    const handleGenerate = async () => {
        const canGenerate = sourceMode === 'topic' ? topic.trim() : selectedBook;
        if (!canGenerate) return;
        setViewState('generating');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/visual/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: topic,
                    grade: grade || 'Middle School',
                    visual_style: visualStyle || 'Scientific Diagram',
                    source_mode: sourceMode,
                    book_title: selectedBook?.title,
                    chapters: selectedBook ? Array.from(selectedChapters) : null
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate visuals');
            }

            const data = await response.json();
            setGeneratedVisuals(data.visuals || []);
            setSelectedVisual(0);
            setViewState('result');
        } catch (error) {
            console.error('Visual generation failed:', error);
            alert('Failed to generate visuals. Please try again.');
            setViewState('form');
        }
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

    if (viewState === 'form') {
        return (
            <div className="h-full w-full flex items-center justify-center relative bg-transparent overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-4xl relative z-10 px-6"
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-primary-custom rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary-custom/20">
                            <ImageIcon size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1 uppercase italic">Visuals Studio</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">AI Asset Generator</p>
                        </div>
                    </div>

                    <div className="bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] p-16 border border-border shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex flex-col items-center mb-16 relative z-10">
                            {/* Toggle Mode */}
                            <div className="bg-muted/50 p-1 rounded-full flex items-center mb-8 border border-border shadow-inner">
                                <button
                                    onClick={() => setSourceMode('topic')}
                                    className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${sourceMode === 'topic' ? 'bg-card-bg text-primary-custom shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    By Prompt
                                </button>
                                <button
                                    onClick={() => setSourceMode('book')}
                                    className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${sourceMode === 'book' ? 'bg-card-bg text-primary-custom shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    By Book
                                </button>
                            </div>

                            <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic text-center">
                                {sourceMode === 'topic' ? (
                                    <>What are we <span className="text-primary-custom">visualizing</span> today?</>
                                ) : (
                                    <>Which book are we <span className="text-primary-custom">illustrating</span> today?</>
                                )}
                            </h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] mt-6 text-center text-[10px] opacity-60">
                                {sourceMode === 'topic'
                                    ? 'AI-powered education, rendered with precision.'
                                    : 'Extract precision visuals from your favorite textbooks.'
                                }
                            </p>
                        </div>

                        <div className="space-y-10 relative z-10">
                            {/* Topic Mode - Input */}
                            {sourceMode === 'topic' && (
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                        Topic or Description
                                    </label>
                                    <div className="relative group/input">
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="w-full bg-muted/30 border-2 border-border px-8 py-5 rounded-3xl text-xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary-custom focus:bg-card-bg transition-all shadow-inner"
                                            placeholder="e.g., Water cycle, Solar system, Cell division..."
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-custom/30 group-focus-within/input:text-primary-custom transition-colors">
                                            <PenTool size={20} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Book Mode - Clean Inline Design */}
                            {sourceMode === 'book' && (
                                <div className="space-y-10">
                                    {/* Book Search */}
                                    <div className="relative" ref={dropdownRef}>
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-1">
                                            Book Title or ISBN
                                        </label>
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                value={selectedBook ? selectedBook.title : bookSearchQuery}
                                                onChange={(e) => {
                                                    if (selectedBook) {
                                                        clearBookSelection();
                                                    }
                                                    setBookSearchQuery(e.target.value);
                                                    setIsDropdownOpen(true);
                                                }}
                                                onFocus={() => !selectedBook && setIsDropdownOpen(true)}
                                                placeholder="Search for Campbell Biology, University Physics..."
                                                className={`w-full bg-muted/30 border-2 px-8 py-5 rounded-3xl text-xl font-bold placeholder:text-muted-foreground/30 focus:outline-none transition-all pr-16 shadow-inner ${selectedBook ? 'border-primary-custom text-primary-custom bg-card-bg' : 'border-border text-foreground focus:border-primary-custom focus:bg-card-bg'}`}
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                {selectedBook && (
                                                    <button onClick={clearBookSelection} className="p-2 text-muted-foreground hover:text-destructive transition-all">
                                                        <X size={20} />
                                                    </button>
                                                )}
                                                <Search size={22} className="text-muted-foreground/30" />
                                            </div>
                                        </div>

                                        {/* Book Dropdown */}
                                        <AnimatePresence>
                                            {isDropdownOpen && !selectedBook && filteredBooks.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute z-50 mt-4 w-full bg-card-bg rounded-[2.5rem] shadow-2xl border border-border p-3 max-h-[300px] overflow-y-auto backdrop-blur-xl"
                                                >
                                                    {filteredBooks.slice(0, 5).map((book) => (
                                                        <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary-custom/5 rounded-2xl transition-all text-left group">
                                                            <div className={`w-12 h-16 rounded-xl ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-soft border border-border group-hover:scale-105 transition-transform`}>
                                                                {book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={20} className={book.iconColor} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-black text-sm text-foreground group-hover:text-primary-custom truncate">{book.title}</h4>
                                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{book.author}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Chapter & Topic Dropdowns - Side by Side */}
                                    <div className="grid grid-cols-2 gap-10">
                                        {/* Select Chapter Dropdown */}
                                        <div className="relative" ref={chapterDropdownRef}>
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-1">
                                                Select Chapter
                                            </label>
                                            <button
                                                onClick={() => selectedBook && setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                                                disabled={!selectedBook}
                                                className={`w-full flex items-center justify-between border-2 px-8 py-5 rounded-3xl text-left transition-all shadow-inner ${!selectedBook
                                                    ? 'bg-muted/10 border-border/50 cursor-not-allowed opacity-50'
                                                    : selectedChapters.size > 0
                                                        ? 'bg-card-bg border-primary-custom'
                                                        : 'bg-muted/30 border-border hover:border-primary-custom/50'
                                                    }`}
                                            >
                                                <span className={`text-lg font-bold ${selectedChapters.size > 0 ? 'text-primary-custom' : 'text-muted-foreground/30'}`}>
                                                    {selectedChapters.size > 0
                                                        ? `${selectedChapters.size} selected`
                                                        : 'Choose Chapters'
                                                    }
                                                </span>
                                                <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-300 ${isChapterDropdownOpen ? 'rotate-180 text-primary-custom' : ''}`} />
                                            </button>

                                            {/* Chapter Dropdown List */}
                                            <AnimatePresence>
                                                {isChapterDropdownOpen && selectedBook && selectedBook.chapters && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute z-50 mt-4 w-full bg-card-bg rounded-[2.5rem] shadow-2xl border border-border p-3 max-h-[300px] overflow-y-auto backdrop-blur-xl"
                                                    >
                                                        {selectedBook.chapters.length > 0 ? (
                                                            selectedBook.chapters.map((chapter, idx) => (
                                                                <button
                                                                    key={chapter.id}
                                                                    type="button"
                                                                    onClick={() => toggleChapter(chapter.id)}
                                                                    className={`w-full px-5 py-4 rounded-2xl text-left text-sm font-bold transition-all flex items-center gap-4
                                                                        ${selectedChapters.has(chapter.id) ? 'bg-primary-custom text-white shadow-lg shadow-primary-custom/20' : 'text-foreground hover:bg-primary-custom/5'}`}
                                                                >
                                                                    <span className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${selectedChapters.has(chapter.id) ? 'bg-white/20' : 'bg-muted'}`}>
                                                                        {idx + 1}
                                                                    </span>
                                                                    <span className="flex-1 truncate">{chapter.title}</span>
                                                                    {selectedChapters.has(chapter.id) && <Check size={16} className="shrink-0" />}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="px-5 py-8 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">No chapters found</div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Topic/Concept Dropdown */}
                                        <div className="space-y-4">
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                                Concept to Illustrate
                                            </label>
                                            <div className="relative group/input">
                                                <input
                                                    type="text"
                                                    value={topic}
                                                    onChange={(e) => setTopic(e.target.value)}
                                                    disabled={!selectedBook || selectedChapters.size === 0}
                                                    placeholder="Specify concept..."
                                                    className={`w-full border-2 px-8 py-5 rounded-3xl text-lg font-bold placeholder:text-muted-foreground/30 focus:outline-none transition-all pr-12 shadow-inner ${!selectedBook || selectedChapters.size === 0
                                                        ? 'bg-muted/10 border-border/50 cursor-not-allowed text-muted-foreground/20'
                                                        : topic.trim()
                                                            ? 'bg-card-bg border-primary-custom text-primary-custom'
                                                            : 'bg-muted/30 border-border text-foreground focus:border-primary-custom'
                                                        }`}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-custom/30">
                                                    <Zap size={20} className={topic.trim() ? 'text-primary-custom' : ''} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grade & Style Dropdowns - Only show for Topic mode */}
                            {sourceMode === 'topic' && (
                                <div className="grid grid-cols-2 gap-10">
                                    <CustomDropdown
                                        label="Target Grade"
                                        value={grade}
                                        onChange={setGrade}
                                        options={gradeOptions}
                                        placeholder="Select Grade"
                                    />
                                    <CustomDropdown
                                        label="Artistic Style"
                                        value={visualStyle}
                                        onChange={setVisualStyle}
                                        options={styleOptions}
                                        placeholder="Select Style"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Magic Button */}
                        <div className="mt-16 flex flex-col items-center gap-6 relative z-10">
                            <button
                                onClick={handleGenerate}
                                disabled={sourceMode === 'topic' ? !topic.trim() : (!selectedBook || selectedChapters.size === 0)}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-primary-custom blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-foreground text-background px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-2xl">
                                    {sourceMode === 'topic' ? <Sparkles size={20} /> : <ImageIcon size={20} />}
                                    Generate Assets
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Uses GPT-4o + DALL-E 3</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // GENERATING VIEW - Premium Orbital Design
    if (viewState === 'generating') {
        return (
            <div className="h-full w-full flex items-center justify-center relative bg-transparent overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 w-full flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase italic mb-4">
                            Bringing <span className="text-primary-custom">context</span> to life
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Synthesizing multi-layered visual assets</p>
                    </motion.div>

                    {/* Central Orb Container */}
                    <div className="relative w-[400px] h-[400px] flex items-center justify-center mb-16">
                        {/* Audit Rings */}
                        <div className="absolute inset-0 border-2 border-primary-custom/10 rounded-full animate-spin-slow" />
                        <div className="absolute inset-8 border border-primary-custom/5 rounded-full animate-reverse-spin-slow" />

                        {/* Orbiting Particles */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-custom rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                        </motion.div>

                        {/* Main Glass Orb */}
                        <div className="w-56 h-56 bg-card-bg/40 backdrop-blur-3xl rounded-full border-2 border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-custom/20 to-transparent" />
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-32 h-32 bg-primary-custom/30 rounded-full blur-3xl"
                            />
                            <Sparkles size={64} className="text-primary-custom relative z-10 drop-shadow-2xl" />
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
                        <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                className="absolute left-0 top-0 h-full bg-primary-custom rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                            />
                        </div>

                        <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-widest">
                            <span className="text-primary-custom">Analyzing</span>
                            <span className="animate-pulse text-foreground">Rendering</span>
                            <span className="text-muted-foreground/30">Finalizing</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RESULT VIEW - Premium Workspace Design
    return (
        <div className="h-full w-full flex flex-col relative overflow-hidden bg-transparent">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-primary-custom/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-custom/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="z-20 px-8 py-6 flex items-center justify-between shrink-0 bg-card-bg/40 backdrop-blur-xl border-b border-border">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setViewState('form')}
                        className="p-3 text-muted-foreground hover:text-primary-custom hover:bg-primary-custom/5 rounded-2xl transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-custom rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-custom/20">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-foreground tracking-tight uppercase italic leading-none">Visual Identity</h2>
                            <p className="text-[10px] text-primary-custom font-black uppercase tracking-widest mt-1">Draft v1.0 • {visualStyle}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
                        <div className="w-2 h-2 bg-primary-custom rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Connected to GPT-4o</span>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <button className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center hover:scale-105 transition-all shadow-xl">
                        <Bot size={22} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden p-8 gap-8 relative z-10">
                {/* Left - Image Viewer */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    {/* Glass Image Panel */}
                    <div className="flex-1 bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] border border-border shadow-2xl relative overflow-hidden flex items-center justify-center group/viewer">
                        {/* Image Container */}
                        <div className="relative w-full h-full p-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden"
                            >
                                <img
                                    src={generatedVisuals[selectedVisual]?.url}
                                    alt={topic}
                                    className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover/viewer:scale-[1.02]"
                                    style={{ transform: `scale(${zoom / 100})` }}
                                />

                                {/* Hover Zoom Controls */}
                                <div className="absolute bottom-6 right-6 flex flex-col gap-3 opacity-0 group-hover/viewer:opacity-100 transition-all translate-y-4 group-hover/viewer:translate-y-0">
                                    <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="w-12 h-12 bg-card-bg/90 backdrop-blur-xl border border-border rounded-2xl shadow-xl flex items-center justify-center text-foreground hover:bg-primary-custom hover:text-white transition-all">
                                        <ZoomIn size={20} />
                                    </button>
                                    <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="w-12 h-12 bg-card-bg/90 backdrop-blur-xl border border-border rounded-2xl shadow-xl flex items-center justify-center text-foreground hover:bg-primary-custom hover:text-white transition-all">
                                        <ZoomOut size={20} />
                                    </button>
                                    <button onClick={() => setZoom(100)} className="w-12 h-12 bg-card-bg/90 backdrop-blur-xl border border-border rounded-2xl shadow-xl flex items-center justify-center text-foreground hover:bg-primary-custom hover:text-white transition-all">
                                        <RotateCcw size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between gap-6">
                        {/* Download & Save Buttons */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-foreground text-background rounded-[2rem] overflow-hidden shadow-2xl">
                                <button className="px-8 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white/10 transition-all border-r border-background/10">
                                    <Download size={20} />
                                    Export Asset
                                </button>
                                <select className="bg-transparent border-none text-[10px] font-black uppercase px-4 py-4 focus:ring-0 cursor-pointer hover:bg-white/10">
                                    <option>PNG</option>
                                    <option>SVG</option>
                                    <option>PDF</option>
                                </select>
                            </div>
                            <button
                                onClick={handleSave}
                                className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl transition-all ${isSaved
                                    ? 'bg-primary-custom text-white'
                                    : 'bg-card-bg border-2 border-border text-foreground hover:border-primary-custom/50'
                                    }`}
                            >
                                {isSaved ? <Check size={20} /> : <BookOpen size={20} />}
                                {isSaved ? 'Archived' : 'Archive to Library'}
                            </button>
                        </div>

                        {/* Style Transfer */}
                        <div className="flex items-center gap-4 bg-card-bg/40 backdrop-blur-xl p-2.5 rounded-[2.5rem] border border-border shadow-soft">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-4">Variants</span>
                            <div className="flex gap-2">
                                {generatedVisuals.map((visual, idx) => (
                                    <button
                                        key={visual.id}
                                        onClick={() => setSelectedVisual(idx)}
                                        className={`w-14 h-14 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg border-2 ${selectedVisual === idx ? 'border-primary-custom scale-105 shadow-lg shadow-primary-custom/20' : 'border-transparent'}`}
                                    >
                                        <img src={visual.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                <button className="w-14 h-14 rounded-2xl bg-muted/30 border-2 border-transparent flex items-center justify-center hover:bg-muted/50 transition-colors">
                                    <RefreshCw size={20} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - AI Refinement */}
                <aside className="w-[400px] bg-card-bg/40 backdrop-blur-[40px] rounded-[3.5rem] border border-border flex flex-col overflow-hidden shadow-2xl shrink-0 hidden lg:flex">
                    {/* Sidebar Header */}
                    <div className="p-8 border-b border-border">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary-custom/10 rounded-xl flex items-center justify-center text-primary-custom">
                                <Zap size={22} />
                            </div>
                            <h3 className="font-black text-foreground uppercase tracking-tighter">Asset Refinement</h3>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">Modify labels, shift perspective, or adjust rendering engine.</p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="flex flex-col gap-2 items-end">
                            <div className="bg-primary-custom text-white text-xs font-bold p-5 rounded-[2rem] rounded-tr-none shadow-lg shadow-primary-custom/20 max-w-[90%]">
                                Can you make the labels more technical?
                            </div>
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mr-2">Teacher</span>
                        </div>

                        <div className="flex flex-col gap-2 items-start">
                            <div className="bg-muted/30 text-foreground text-xs font-bold p-5 rounded-[2rem] rounded-tl-none border border-border max-w-[90%] flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary-custom/10 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-primary-custom" />
                                </div>
                                <p className="leading-relaxed">Applying academic nomenclature to components. Regenerating with focus on scientific precision.</p>
                            </div>
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest ml-2">Learnivo AI</span>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-8 bg-card-bg/60 border-t border-border">
                        <div className="relative group/input">
                            <textarea
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="w-full bg-muted/30 border-2 border-border rounded-[2rem] p-6 pr-16 text-sm font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary-custom focus:bg-card-bg transition-all shadow-inner resize-none overflow-hidden"
                                placeholder="Refine visual..."
                                rows={2}
                            />
                            <button className="absolute bottom-4 right-4 w-12 h-12 bg-foreground text-background rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all">
                                <Send size={20} />
                            </button>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {['Add Legend', 'Night Mode', 'Isometric'].map(s => (
                                <button key={s} className="px-4 py-2 rounded-full bg-muted/30 border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:border-primary-custom hover:text-primary-custom transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default VisualGeneratorView;
