'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Image as ImageIcon, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, RefreshCw,
    Send, Mic, Bot, Zap, Brush, PenTool, Frame, ImagePlus, BookOpen, Search, Layers, Maximize2
} from 'lucide-react';
import { saveGeneratedContent, generateId } from '@/lib/storage';

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

    const handleGenerate = () => {
        const canGenerate = sourceMode === 'topic' ? topic.trim() : selectedBook;
        if (!canGenerate) return;
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
                <div className="absolute top-6 left-8 flex items-center gap-3 z-20">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <ImageIcon size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Visuals Generator</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">AI Powered</p>
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

                    {/* Heading - Changes based on mode */}
                    <h1 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-3 text-center whitespace-nowrap" style={{ fontFamily: "'Georgia', serif" }}>
                        {sourceMode === 'topic' ? (
                            <>What are we <span className="text-emerald-600">visualizing</span> today?</>
                        ) : (
                            <>Which book are we <span className="text-emerald-600">illustrating</span> today?</>
                        )}
                    </h1>
                    <p className="text-slate-500 font-light text-base tracking-tight mb-8">
                        {sourceMode === 'topic'
                            ? 'AI-powered education, rendered with precision.'
                            : 'Extract precision visuals from your favorite textbooks.'
                        }
                    </p>

                    {/* Glass Panel - Compact */}
                    <div className="w-full bg-white/45 backdrop-blur-[20px] rounded-[40px] p-8 md:p-10 relative border border-white/60 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05),0_40px_80px_-20px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.4)]">
                        <div className="space-y-6">
                            {/* Topic Mode - Input */}
                            {sourceMode === 'topic' && (
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
                            )}

                            {/* Book Mode - Clean Inline Design */}
                            {sourceMode === 'book' && (
                                <div className="space-y-6">
                                    {/* Book Search */}
                                    <div className="relative" ref={dropdownRef}>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                            Book Title or ISBN
                                        </label>
                                        <div className="relative">
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
                                                className={`w-full bg-transparent border-0 border-b-2 px-0 py-3 text-lg font-medium placeholder:text-slate-400 focus:outline-none transition-all pr-10 ${selectedBook ? 'border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-800 focus:border-emerald-500'
                                                    }`}
                                            />
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {selectedBook && (
                                                    <button onClick={clearBookSelection} className="p-1 text-slate-400 hover:text-red-500 transition-all">
                                                        <X size={16} />
                                                    </button>
                                                )}
                                                <Search size={18} className="text-slate-400" />
                                            </div>
                                        </div>

                                        {/* Book Dropdown */}
                                        {isDropdownOpen && !selectedBook && filteredBooks.length > 0 && (
                                            <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-2 max-h-[200px] overflow-y-auto">
                                                {filteredBooks.slice(0, 5).map((book) => (
                                                    <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-all text-left group">
                                                        <div className={`w-8 h-10 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>
                                                            {book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={14} className={book.iconColor} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 truncate">{book.title}</h4>
                                                            <p className="text-[10px] text-slate-500">{book.author}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Chapter & Topic Dropdowns - Side by Side */}
                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Select Chapter Dropdown */}
                                        <div className="relative" ref={chapterDropdownRef}>
                                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                                Select Chapter
                                            </label>
                                            <button
                                                onClick={() => selectedBook && setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                                                disabled={!selectedBook}
                                                className={`w-full flex items-center justify-between border-0 border-b-2 px-0 py-3 text-left transition-all ${!selectedBook
                                                    ? 'border-slate-200 cursor-not-allowed'
                                                    : selectedChapters.size > 0
                                                        ? 'border-emerald-500'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <span className={`text-lg font-medium ${selectedChapters.size > 0 ? 'text-emerald-700' : 'text-slate-400'
                                                    }`}>
                                                    {selectedChapters.size > 0
                                                        ? `${selectedChapters.size} chapter${selectedChapters.size > 1 ? 's' : ''} selected`
                                                        : 'Select a chapter...'
                                                    }
                                                </span>
                                                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {/* Chapter Dropdown List */}
                                            {isChapterDropdownOpen && selectedBook && selectedBook.chapters && (
                                                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-[200px] overflow-y-auto animate-fadeIn">
                                                    {selectedBook.chapters.length > 0 ? (
                                                        selectedBook.chapters.map((chapter, idx) => (
                                                            <button
                                                                key={chapter.id}
                                                                type="button"
                                                                onClick={() => toggleChapter(chapter.id)}
                                                                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all flex items-center gap-3
                                                                    ${selectedChapters.has(chapter.id) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                                            >
                                                                <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${selectedChapters.has(chapter.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                                                                    }`}>
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="flex-1 truncate">{chapter.title}</span>
                                                                {selectedChapters.has(chapter.id) && <Check size={14} className="text-emerald-600 shrink-0" />}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-sm text-slate-400 text-center">No chapters available</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Topic/Concept Dropdown */}
                                        <div>
                                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                                Topic/Concept
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={topic}
                                                    onChange={(e) => setTopic(e.target.value)}
                                                    disabled={!selectedBook || selectedChapters.size === 0}
                                                    placeholder="Choose a concept..."
                                                    className={`w-full bg-transparent border-0 border-b-2 px-0 py-3 text-lg font-medium placeholder:text-slate-400 focus:outline-none transition-all pr-8 ${!selectedBook || selectedChapters.size === 0
                                                        ? 'border-slate-200 cursor-not-allowed text-slate-300'
                                                        : topic.trim()
                                                            ? 'border-emerald-500 text-emerald-700'
                                                            : 'border-slate-200 text-slate-800 focus:border-emerald-500'
                                                        }`}
                                                />
                                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded ${selectedBook && selectedChapters.size > 0 ? 'bg-emerald-100' : 'bg-slate-100'
                                                    }`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grade & Style Dropdowns - Only show for Topic mode */}
                            {sourceMode === 'topic' && (
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
                            )}
                        </div>

                        {/* Magic Button */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                            <button
                                onClick={handleGenerate}
                                disabled={sourceMode === 'topic' ? !topic.trim() : !selectedBook}
                                className="w-20 h-20 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full flex items-center justify-center text-white relative group transition-all duration-400 hover:scale-110 hover:shadow-[0_20px_40px_-5px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                <Sparkles size={32} className="drop-shadow-md" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity -z-10" />
                            </button>
                        </div>
                    </div>


                </main>

                {/* Chapter/Book Picker Modal */}
                {isBookPickerOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[70vh] overflow-hidden animate-fadeIn">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {selectedBook ? 'Select Chapters' : 'Select Book'}
                                </h3>
                                <button onClick={() => setIsBookPickerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Show chapters if book is selected */}
                            {selectedBook ? (
                                <div className="p-4">
                                    {/* Selected Book Info */}
                                    <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3 mb-4 border border-emerald-200">
                                        <div className={`w-10 h-12 rounded-lg ${selectedBook.cover ? '' : selectedBook.color} flex items-center justify-center overflow-hidden shadow-sm`}>
                                            {selectedBook.cover ? <img src={selectedBook.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={16} className={selectedBook.iconColor} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-slate-800">{selectedBook.title}</h4>
                                            <p className="text-xs text-slate-500">{selectedBook.author}</p>
                                        </div>
                                    </div>

                                    {/* Chapters Grid */}
                                    {selectedBook.chapters && selectedBook.chapters.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                                            {selectedBook.chapters.map((chapter, idx) => (
                                                <button
                                                    key={chapter.id}
                                                    onClick={() => toggleChapter(chapter.id)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${selectedChapters.has(chapter.id)
                                                        ? 'bg-emerald-500 text-white shadow-md'
                                                        : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 border border-slate-200'
                                                        }`}
                                                >
                                                    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${selectedChapters.has(chapter.id) ? 'bg-white/20' : 'bg-white'
                                                        }`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="flex-1">{chapter.title}</span>
                                                    {selectedChapters.has(chapter.id) && <Check size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-400">
                                            <Layers size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No chapters available</p>
                                        </div>
                                    )}

                                    {/* Done Button */}
                                    <button
                                        onClick={() => setIsBookPickerOpen(false)}
                                        className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all"
                                    >
                                        Done ({selectedChapters.size} selected)
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-3 border-b border-slate-100">
                                        <div className="relative">
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={bookSearchQuery}
                                                onChange={(e) => setBookSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto max-h-[400px] divide-y divide-slate-100">
                                        {filteredBooks.length > 0 ? (
                                            filteredBooks.map((book) => (
                                                <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 text-left group">
                                                    <div className={`w-10 h-12 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>
                                                        {book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={16} className={book.iconColor} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700">{book.title}</h4>
                                                        <p className="text-xs text-slate-500">{book.author} • {book.classLevel}</p>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-slate-400">
                                                <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No books found in library</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    // GENERATING VIEW - Premium Orbital Design
    if (viewState === 'generating') {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
                {/* Background Orbs */}
                <div className="absolute w-[600px] h-[600px] bg-lime-200/40 rounded-full blur-[100px] top-[-10%] left-[-5%] pointer-events-none" />
                <div className="absolute w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-[100px] bottom-[-15%] right-[-5%] pointer-events-none" />
                <div className="absolute w-[500px] h-[500px] bg-teal-50 rounded-full blur-[100px] top-[20%] right-[10%] pointer-events-none" />

                <main className="relative z-10 w-full flex flex-col items-center">
                    {/* Heading */}
                    <div className="text-center mb-12 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-4 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                            Bringing your <span className="text-emerald-600">vision</span> to life...
                        </h1>
                        <p className="text-slate-400 font-light text-lg tracking-wide">Synthesizing multi-layered visual context</p>
                    </div>

                    {/* Central Orb Container */}
                    <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-10">
                        {/* Orbit Ring */}
                        <div className="absolute w-full h-full border border-emerald-500/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />

                        {/* Orbiting Particles */}
                        <div className="absolute top-[8%] left-[18%] text-emerald-600/50 text-lg font-light animate-pulse">∫</div>
                        <div className="absolute top-[0%] left-[48%] text-emerald-600/50 animate-pulse" style={{ animationDelay: '0.2s' }}>
                            <Sparkles size={14} />
                        </div>
                        <div className="absolute top-[12%] right-[12%] text-emerald-600/50 text-lg font-light animate-pulse" style={{ animationDelay: '0.4s' }}>φ</div>
                        <div className="absolute bottom-[18%] right-[8%] text-emerald-600/50 text-lg font-light animate-pulse" style={{ animationDelay: '0.6s' }}>π</div>
                        <div className="absolute bottom-[0%] left-[45%] text-emerald-600/50 animate-pulse" style={{ animationDelay: '0.8s' }}>
                            <Zap size={14} />
                        </div>
                        <div className="absolute bottom-[22%] left-[5%] text-emerald-600/50 text-lg font-light animate-pulse" style={{ animationDelay: '1s' }}>√</div>

                        {/* Main Glass Orb */}
                        <div
                            className="w-[200px] h-[200px] rounded-full flex items-center justify-center relative z-20"
                            style={{
                                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.2))',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                boxShadow: '0 0 80px rgba(190, 242, 100, 0.6), inset 0 0 40px rgba(16, 185, 129, 0.2), 0 20px 50px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {/* Internal Glow */}
                            <div
                                className="w-[100px] h-[100px] rounded-full animate-pulse"
                                style={{
                                    background: 'radial-gradient(circle, #bef264 0%, #10b981 100%)',
                                    filter: 'blur(30px)',
                                    opacity: 0.6
                                }}
                            />
                            {/* Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={48} className="text-emerald-600/30" />
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="flex flex-col items-center space-y-5 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                        {/* Progress Bar */}
                        <div className="w-72 h-0.5 bg-emerald-500/10 rounded-full overflow-hidden relative">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full animate-progress"
                                style={{
                                    boxShadow: '0 0 10px #bef264',
                                    animation: 'progressFill 2.5s ease-in-out forwards'
                                }}
                            />
                        </div>

                        {/* Status Steps */}
                        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] font-bold">
                            <div className="flex items-center gap-2 text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>Analyzing</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span>Generating</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Finalizing</span>
                            </div>
                        </div>
                    </div>

                    {/* Neural Processor Badge */}
                    <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/60 text-slate-500 text-[9px] uppercase tracking-widest font-bold bg-white/30 backdrop-blur-md shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
                            Neural Processor Active
                        </div>
                    </div>
                </main>

                {/* CSS Keyframes */}
                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes progressFill {
                        0% { width: 0%; }
                        30% { width: 30%; }
                        60% { width: 65%; }
                        100% { width: 100%; }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 1s ease-out forwards;
                    }
                    .animate-progress {
                        animation: progressFill 2.5s ease-in-out forwards;
                    }
                `}</style>
            </div>
        );
    }

    // RESULT VIEW - Premium Workspace Design
    return (
        <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ background: 'radial-gradient(circle at top left, #f0fdf4, #dcfce7, #f8fafc)' }}>
            {/* Background Orbs */}
            <div className="absolute w-[800px] h-[800px] bg-lime-200/40 rounded-full blur-[120px] top-[-20%] left-[-10%] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute w-[700px] h-[700px] bg-emerald-100/50 rounded-full blur-[120px] bottom-[-10%] right-[-5%] pointer-events-none" />

            {/* Header */}
            <header className="z-20 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setViewState('form')} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-tr from-lime-400 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Workspace</h2>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Draft v1.0 • {visualStyle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/80 text-xs font-semibold text-slate-600 hover:bg-white transition-all">
                        <RefreshCw size={14} />
                        Version History
                        <ChevronDown size={14} />
                    </button>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">
                {/* Left - Image Viewer */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Glass Image Panel */}
                    <div
                        className="flex-1 rounded-[32px] relative overflow-hidden flex items-center justify-center group"
                        style={{
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255, 255, 255, 0.7)',
                            boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.04), 0 40px 80px -20px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5), 0 0 40px rgba(190, 242, 100, 0.1)'
                        }}
                    >
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                        {/* Image Container */}
                        <div className="relative w-full h-full p-6">
                            <div className="w-full h-full rounded-2xl bg-white/40 shadow-inner flex items-center justify-center relative overflow-hidden">
                                <img
                                    src={generatedVisuals[selectedVisual]?.url}
                                    alt={topic}
                                    className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
                                    style={{ transform: `scale(${zoom / 100})` }}
                                />

                                {/* Hover Zoom Controls */}
                                <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white">
                                        <ZoomIn size={18} />
                                    </button>
                                    <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white">
                                        <ZoomOut size={18} />
                                    </button>
                                    <button onClick={() => setZoom(100)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:bg-white">
                                        <RotateCcw size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Download & Save Buttons */}
                        <div className="flex items-center gap-3">
                            <div className="flex rounded-2xl overflow-hidden shadow-sm border border-emerald-100">
                                <button className="bg-emerald-600 text-white px-5 py-3 text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all">
                                    <Download size={18} />
                                    Download High-Res
                                </button>
                                <div className="bg-emerald-700 w-px" />
                                <select className="bg-emerald-600 text-white border-none text-xs font-bold px-3 focus:ring-0 cursor-pointer hover:bg-emerald-700">
                                    <option>PNG</option>
                                    <option>SVG</option>
                                    <option>PDF</option>
                                </select>
                            </div>
                            <button
                                onClick={handleSave}
                                className={`px-5 py-3 border rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${isSaved
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                                    }`}
                            >
                                {isSaved ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                                {isSaved ? 'Saved!' : 'Save to Workspace'}
                            </button>
                        </div>

                        {/* Style Transfer */}
                        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/60">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">Style Transfer</span>
                            <div className="flex gap-2">
                                {generatedVisuals.map((visual, idx) => (
                                    <button
                                        key={visual.id}
                                        onClick={() => setSelectedVisual(idx)}
                                        className={`w-11 h-11 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${selectedVisual === idx ? 'ring-2 ring-emerald-500 ring-offset-2' : 'border-2 border-transparent'
                                            }`}
                                    >
                                        <img src={visual.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                <button className="w-11 h-11 rounded-xl bg-white border-2 border-transparent flex items-center justify-center hover:bg-slate-50">
                                    <ChevronRight size={16} className="text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - AI Refinement */}
                <aside
                    className="w-[340px] rounded-[32px] flex flex-col overflow-hidden shadow-2xl shrink-0 hidden lg:flex"
                    style={{
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(16px)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.7)'
                    }}
                >
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-white/40">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap size={20} className="text-emerald-600" />
                            <h3 className="font-bold text-slate-800">AI Refinement</h3>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">Modify labels, colors, or add specific details to your visual.</p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* User Message */}
                        <div className="flex flex-col gap-1 items-end">
                            <div className="bg-emerald-600 text-white text-sm p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[90%]">
                                Can you make the colors more vibrant and add labels?
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Just now</span>
                        </div>

                        {/* AI Response */}
                        <div className="flex flex-col gap-1 items-start">
                            <div className="bg-white/80 border border-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <Bot size={12} className="text-emerald-600" />
                                </div>
                                <p className="text-sm text-slate-700">Of course! I'm enhancing the colors and adding descriptive labels. Version 2 will be ready in seconds.</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-5 bg-white/30 backdrop-blur-xl border-t border-white/50">
                        <div className="relative">
                            <textarea
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 pr-14 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                                placeholder="Describe your changes..."
                                rows={2}
                            />
                            <button className="absolute bottom-4 right-4 w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors">
                                <Send size={16} />
                            </button>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button className="px-3 py-1.5 rounded-full bg-white/60 border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-white transition-all">Add Legend</button>
                            <button className="px-3 py-1.5 rounded-full bg-white/60 border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-white transition-all">Change Palette</button>
                            <button className="px-3 py-1.5 rounded-full bg-white/60 border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-white transition-all">More Detailed</button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default VisualGeneratorView;
