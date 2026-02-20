'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Check, X, Search, Layers, Maximize2,
    ArrowLeft, Save, Copy, Download, Clock, Target, Users, BookMarked,
    CheckCircle2, Lightbulb, ListChecks, MessageSquare, RefreshCw,
    FileText, Presentation, Info, Package, Activity, ClipboardCheck,
    Send, Mic, Paperclip, History, Bot, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type PlanMode = 'topic' | 'book';
type ViewState = 'form' | 'generating' | 'result';

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

interface LessonPlanContent {
    title: string;
    subtitle: string;
    overview: string;
    objectives: string[];
    duration: string;
    materials: { name: string; icon: string; color: string }[];
    activities: { title: string; duration: string; description: string }[];
    assessment: string[];
    homework: string;
    tips: string[];
}

// Simple Dropdown Component - Original Style
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
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-transparent border-0 border-b-2 
                    ${isOpen ? 'border-primary-custom' : 'border-border'} 
                    px-0 py-2 text-sm font-medium transition-all cursor-pointer text-left hover:border-primary-custom/60`}
            >
                <span className={value ? 'text-foreground text-xs font-bold' : 'text-muted-foreground text-xs'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-card-bg rounded-xl shadow-xl border border-border py-1 max-h-[200px] overflow-y-auto animate-fadeIn backdrop-blur-xl">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => { onChange(option); setIsOpen(false); }}
                            className={`w-full px-3 py-2 text-left text-xs font-bold transition-all flex items-center justify-between
                                ${value === option ? 'bg-primary-custom/10 text-primary-custom' : 'text-foreground hover:bg-muted'}`}
                        >
                            <span>{option}</span>
                            {value === option && <Check size={12} className="text-primary-custom" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const LessonPlannerView: React.FC = () => {
    const [mode, setMode] = useState<PlanMode>('topic');
    const [viewState, setViewState] = useState<ViewState>('form');
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [duration, setDuration] = useState('');
    const [days, setDays] = useState('');
    const [language, setLanguage] = useState('');
    const [format, setFormat] = useState('');
    const [objectives, setObjectives] = useState('');
    const [activeSection, setActiveSection] = useState('overview');
    const [documentMode, setDocumentMode] = useState<'document' | 'slides'>('document');

    // Book Mode States
    const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
    const [bookSearchQuery, setBookSearchQuery] = useState('');

    // Generated Content
    const [generatedPlan, setGeneratedPlan] = useState<LessonPlanContent | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [assistantMessages, setAssistantMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isAssistantLoading, setIsAssistantLoading] = useState(false);
    const [checkedObjectives, setCheckedObjectives] = useState<Set<number>>(new Set());
    const [currentSlide, setCurrentSlide] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleAssistantSend = async () => {
        if (!chatMessage.trim() || isAssistantLoading) return;

        const userMsg = chatMessage;
        setChatMessage('');
        setAssistantMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsAssistantLoading(true);

        try {
            const api = await import('@/lib/api');
            const response = await api.generateContent('/chat/send', {
                message: userMsg,
                history: assistantMessages,
                context: {
                    tool: 'lesson-planner',
                    topic: mode === 'book' ? selectedBook?.title : topic,
                    current_lesson: generatedPlan
                }
            });
            setAssistantMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
        } catch (error) {
            console.error('Assistant failed:', error);
            setAssistantMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please check your internet or API key." }]);
        } finally {
            setIsAssistantLoading(false);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) setBooks(JSON.parse(saved));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const suggestions = ['Quantum Physics', 'Civil War', 'Photosynthesis'];
    const gradeOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    const durationOptions = ['15 mins', '20 mins', '30 mins', '45 mins', '1 hour', '1.5 hours', '2 hours'];
    const daysOptions = ['1 day', '2 days', '3 days', '5 days', '7 days', '10 days', '14 days'];
    const languageOptions = ['English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Sanskrit'];
    const formatOptions = ['Interactive Lecture', 'Activity Based', 'Group Discussion', 'Project Based', 'Storytelling', 'Demonstration', 'Flipped Classroom', 'Quiz Based'];

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
        setGrade('');
    };

    const toggleObjective = (idx: number) => {
        const newChecked = new Set(checkedObjectives);
        if (newChecked.has(idx)) newChecked.delete(idx);
        else newChecked.add(idx);
        setCheckedObjectives(newChecked);
    };

    const handleGenerate = async () => {
        setViewState('generating');

        try {
            const api = await import('@/lib/api');
            const topicName = mode === 'book' ? selectedBook?.title : topic;

            const response = await api.generateLesson({
                topic: topicName || 'General',
                grade: grade || 'Grade 6',
                duration: parseInt(duration?.replace(/\D/g, '') || '45'),
                days: days || '1',
                language: language || 'English',
                format: format || 'Standard',
                details: objectives || '',
                bookId: mode === 'book' && selectedBook?.id ? String(selectedBook.id) : undefined,
                chapterIds: mode === 'book' && selectedChapters.size > 0 ? Array.from(selectedChapters) : undefined
            });

            // The backend now returns the structured object directly
            setGeneratedPlan(response.content);
            setViewState('result');
            setIsSaved(false);
            setCheckedObjectives(new Set());
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate lesson plan. Please try again.');
            setViewState('form');
        }
    };

    const handleSave = async () => {
        if (!generatedPlan) return;
        try {
            await saveGeneratedContent({
                id: generateId(),
                type: 'lesson-plan',
                title: generatedPlan.title,
                description: generatedPlan.overview,
                content: JSON.stringify(generatedPlan),
                contentType: 'text',
                bookId: selectedBook?.id,
                bookTitle: selectedBook?.title,
                toolId: 'lesson-planner',
                formData: { mode, topic, grade, duration, days, language, format, objectives },
                createdAt: Date.now()
            });
            setIsSaved(true);
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleCopy = () => {
        if (!generatedPlan) return;
        const textContent = `${generatedPlan.title}\n\n${generatedPlan.overview}\n\nObjectives:\n${generatedPlan.objectives.join('\n')}\n\nActivities:\n${generatedPlan.activities.map(a => `${a.title} (${a.duration}): ${a.description}`).join('\n')}`;
        navigator.clipboard.writeText(textContent);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const sidebarLinks = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'objectives', label: 'Objectives', icon: Target },
        { id: 'materials', label: 'Materials', icon: Package },
        { id: 'activities', label: 'Activities', icon: Activity },
        { id: 'assessment', label: 'Assessment', icon: ClipboardCheck }
    ];

    // FORM VIEW - Original Layout
    if (viewState === 'form') {
        return (
            <div className="h-full w-full flex flex-col relative bg-transparent overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-custom/10 rounded-full blur-[80px] opacity-30" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[80px] opacity-30" />
                </div>

                <div className="relative z-10 px-6 py-4 flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 bg-primary-custom rounded-xl flex items-center justify-center shadow-lg shadow-primary-custom/20">
                        <BookOpen size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight italic">Lesson Planner</h1>
                </div>

                <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 pb-6 overflow-y-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center p-1 bg-muted rounded-full mb-4">
                            <button onClick={() => setMode('topic')} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === 'topic' ? 'bg-primary-custom text-white shadow-md shadow-primary-custom/20' : 'text-muted-foreground hover:text-foreground'}`}>By Topic</button>
                            <button onClick={() => setMode('book')} className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === 'book' ? 'bg-primary-custom text-white shadow-md shadow-primary-custom/20' : 'text-muted-foreground hover:text-foreground'}`}>By Book</button>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight uppercase italic tracking-tighter">What are we teaching today?</h2>
                    </div>

                    <div className="bg-card-bg/50 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-xl shadow-black/5 w-full max-w-3xl">
                        {mode === 'topic' && (
                            <div className="relative mb-4">
                                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic here..." className="w-full bg-transparent border-0 border-b-2 border-border focus:border-primary-custom focus:ring-0 focus:outline-none text-xl md:text-2xl font-black px-0 py-3 placeholder:text-muted-foreground/30 transition-all text-center text-foreground uppercase italic tracking-tighter" />
                                <div className="mt-2 flex flex-wrap justify-center gap-2 items-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Suggestions:</span>
                                    {suggestions.map((s, i) => (<button key={i} onClick={() => setTopic(s)} className="text-xs font-black text-primary-custom hover:underline transition-all uppercase tracking-tight">{s}</button>))}
                                </div>
                            </div>
                        )}

                        {mode === 'book' && (
                            <div className="mb-4">
                                {!selectedBook ? (
                                    <div className="relative" ref={dropdownRef}>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 relative">
                                                <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <input type="text" value={bookSearchQuery} onChange={(e) => { setBookSearchQuery(e.target.value); setIsDropdownOpen(true); }} onFocus={() => setIsDropdownOpen(true)} placeholder="Search your library..." className="w-full bg-transparent border-0 border-b-2 border-border focus:border-primary-custom focus:ring-0 focus:outline-none text-xl font-black pl-7 pr-2 py-3 placeholder:text-muted-foreground/30 transition-all text-center text-foreground uppercase italic tracking-tighter" />
                                            </div>
                                            <button onClick={() => setIsBookPickerOpen(true)} className="p-3 bg-muted hover:bg-primary-custom/10 rounded-xl text-muted-foreground hover:text-primary-custom transition-all"><Maximize2 size={18} /></button>
                                        </div>
                                        {isDropdownOpen && filteredBooks.length > 0 && (
                                            <div className="absolute z-50 mt-2 w-full bg-card-bg rounded-2xl shadow-xl border border-border py-2 max-h-[250px] overflow-y-auto animate-fadeIn backdrop-blur-xl">
                                                {filteredBooks.slice(0, 5).map((book) => (
                                                    <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-custom/5 transition-all text-left group">
                                                        <div className={`w-10 h-12 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>{book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={16} className={book.iconColor} />}</div>
                                                        <div className="flex-1"><h4 className="font-black text-sm text-foreground group-hover:text-primary-custom uppercase tracking-tight italic">{book.title}</h4><p className="text-[10px] font-bold text-muted-foreground uppercase">{book.author} • {book.classLevel}</p></div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 bg-primary-custom/5 rounded-2xl p-4 border border-primary-custom/20">
                                            <div className={`w-12 h-14 rounded-lg ${selectedBook.cover ? '' : selectedBook.color} flex items-center justify-center overflow-hidden shadow-sm shrink-0`}>{selectedBook.cover ? <img src={selectedBook.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={20} className={selectedBook.iconColor} />}</div>
                                            <div className="flex-1 min-w-0"><h3 className="text-base font-black text-foreground truncate uppercase italic tracking-tight">{selectedBook.title}</h3><p className="text-[10px] font-bold text-muted-foreground uppercase">by {selectedBook.author}</p></div>
                                            <button onClick={clearBookSelection} className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors"><X size={16} /></button>
                                        </div>
                                        {selectedBook.chapters && selectedBook.chapters.length > 0 && (
                                            <div><label className="block text-xs font-black text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-widest"><Layers size={14} className="text-primary-custom" />Select Chapters {selectedChapters.size > 0 && <span className="text-primary-custom">({selectedChapters.size})</span>}</label><div className="flex flex-wrap gap-2">{selectedBook.chapters.map((chapter, idx) => (<button key={chapter.id} onClick={() => toggleChapter(chapter.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedChapters.has(chapter.id) ? 'bg-primary-custom border-primary-custom text-white shadow-md' : 'bg-card-bg text-foreground hover:bg-muted border-border'}`}><span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center ${selectedChapters.has(chapter.id) ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</span><span className="max-w-[120px] truncate">{chapter.title}</span>{selectedChapters.has(chapter.id) && <Check size={10} />}</button>))}</div></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Options Grid - 5 Columns Original Layout */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
                            <CustomDropdown label="Grade" value={grade} onChange={setGrade} options={gradeOptions} placeholder="Select..." />
                            <CustomDropdown label="Duration" value={duration} onChange={setDuration} options={durationOptions} placeholder="Per session..." />
                            <CustomDropdown label="Days" value={days} onChange={setDays} options={daysOptions} placeholder="Total..." />
                            <CustomDropdown label="Language" value={language} onChange={setLanguage} options={languageOptions} placeholder="Select..." />
                            <CustomDropdown label="Format" value={format} onChange={setFormat} options={formatOptions} placeholder="Select..." />
                        </div>

                        <div className="mt-8">
                            <label className="block text-[10px] font-black text-muted-foreground mb-2 uppercase tracking-[0.2em]">Learning Objectives (Optional)</label>
                            <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="Define specific goals for this lesson..." className="w-full bg-transparent border-0 border-b-2 border-border px-0 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground/40 focus:border-primary-custom focus:ring-0 focus:outline-none transition-all resize-none h-[60px]" />
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button onClick={handleGenerate} disabled={mode === 'topic' ? !topic : !selectedBook} className="group px-8 py-4 bg-primary-custom hover:bg-primary-custom/90 disabled:bg-muted text-white rounded-[2rem] flex items-center gap-3 shadow-xl shadow-primary-custom/20 disabled:shadow-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                                <Sparkles size={18} className="group-hover:animate-pulse" />
                                <span className="font-black text-xs uppercase tracking-[0.2em]">Generate Lesson Plan</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Book Picker Modal */}
                {isBookPickerOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[70vh] overflow-hidden animate-fadeIn">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-800">Select Book</h3><button onClick={() => setIsBookPickerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><X size={18} /></button></div>
                            <div className="p-3 border-b border-slate-100"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" value={bookSearchQuery} onChange={(e) => setBookSearchQuery(e.target.value)} placeholder="Search..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none" autoFocus /></div></div>
                            <div className="overflow-y-auto max-h-[400px] divide-y divide-slate-100">{filteredBooks.map((book) => (<button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-3 p-3 hover:bg-lime-50 text-left group"><div className={`w-10 h-12 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>{book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={16} className={book.iconColor} />}</div><div className="flex-1"><h4 className="font-bold text-sm text-slate-800 group-hover:text-lime-700">{book.title}</h4><p className="text-xs text-slate-500">{book.author} • {book.classLevel}</p></div></button>))}</div>
                        </div>
                    </div>
                )}

                <style jsx>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.2s ease-out; }`}</style>
            </div>
        );
    }

    // GENERATING VIEW
    if (viewState === 'generating') {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-transparent">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-primary-custom rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-custom/20 animate-bounce">
                        <Sparkles size={40} className="text-white animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground mb-3 uppercase italic tracking-tighter">AI is crafting...</h2>
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.4em]">Generating your personalized lesson plan</p>
                    <div className="mt-8 flex justify-center gap-2">
                        {[0, 1, 2].map((i) => (<div key={i} className="w-2.5 h-2.5 bg-primary-custom rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />))}
                    </div>
                </div>
            </div>
        );
    }

    // Slides data for slide mode
    const slides = [
        { id: 'title', label: 'Overview', type: 'Title', icon: Info },
        { id: 'objectives', label: 'Objectives', type: 'Points', icon: Target },
        { id: 'materials', label: 'Materials', type: 'Grid', icon: Package },
        ...(generatedPlan?.activities.map((a, i) => ({ id: `activity-${i}`, label: a.title, type: 'Activity', icon: Activity })) || []),
        { id: 'assessment', label: 'Assessment', type: 'List', icon: ClipboardCheck }
    ];
    const totalSlides = slides.length;
    const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

    // RESULT VIEW - Premium 3-Panel Layout
    if (documentMode === 'document') {
        return (
            <div className="h-full w-full flex flex-col bg-transparent overflow-hidden">
                <header className="h-20 bg-card-bg/80 backdrop-blur-xl border-b border-border px-8 flex items-center justify-between shrink-0 z-50">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setViewState('form')} className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"><ArrowLeft size={20} /></button>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-custom rounded-2xl flex items-center justify-center shadow-lg shadow-primary-custom/20"><Sparkles size={20} className="text-white" /></div>
                            <div><h1 className="text-lg font-black text-foreground leading-none uppercase italic tracking-tighter">{mode === 'book' ? selectedBook?.title : topic}</h1><span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">{grade} • {format || 'Interactive'}</span></div>
                        </div>
                        <div className="hidden md:flex bg-muted p-1 rounded-2xl gap-1 ml-6 border border-border">
                            <button onClick={() => setDocumentMode('document')} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-card-bg shadow-sm text-foreground"><FileText size={16} /> Document</button>
                            <button onClick={() => setDocumentMode('slides')} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"><Presentation size={16} /> Slide Mode</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleCopy} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-border hover:bg-muted text-xs font-black uppercase tracking-widest text-foreground transition-all">{isCopied ? <CheckCircle2 size={16} className="text-primary-custom" /> : <Download size={16} />}{isCopied ? 'Copied!' : 'Export'}</button>
                        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-primary-custom hover:bg-primary-custom/90 text-white shadow-primary-custom/20'}`}>{isSaved ? <CheckCircle2 size={16} /> : <Zap size={16} />}{isSaved ? 'Saved!' : 'Save'}</button>
                    </div>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-64 border-r border-border bg-card-bg shrink-0 hidden lg:block overflow-y-auto">
                        <div className="p-6">
                            <h3 className="mb-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Lesson Index</h3>
                            <nav className="flex flex-col gap-2">
                                {sidebarLinks.map((link) => (
                                    <button key={link.id} onClick={() => setActiveSection(link.id)} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left group ${activeSection === link.id ? 'bg-primary-custom/10 text-primary-custom border-r-4 border-primary-custom' : 'text-muted-foreground hover:bg-muted'}`}>
                                        <link.icon size={18} className={activeSection === link.id ? 'text-primary-custom' : 'text-muted-foreground group-hover:text-foreground'} />
                                        {link.label}
                                    </button>
                                ))}
                            </nav>
                            <div className="mt-12 pt-8 border-t border-border">
                                <div className="bg-muted rounded-[2rem] p-6 border border-border">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Duration</span>
                                    <div className="text-3xl font-black text-foreground mt-1 italic tracking-tighter">{generatedPlan?.duration}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1 bg-muted/30 overflow-y-auto custom-scrollbar">
                        <div className="max-w-4xl mx-auto p-12">
                            <div className="bg-card-bg rounded-[3rem] p-12 shadow-2xl shadow-black/5 border border-border">
                                <div className="border-b border-border pb-10 mb-10 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-custom/10 text-primary-custom text-[10px] font-black uppercase tracking-[0.2em] mb-6"><Sparkles size={14} className="fill-primary-custom" /> Premium AI Content</div>
                                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 uppercase italic tracking-tighter leading-[0.9]">{generatedPlan?.title}</h2>
                                    <p className="text-lg text-muted-foreground font-bold tracking-tight uppercase opacity-80">{generatedPlan?.subtitle}</p>
                                </div>
                                <section className="mb-14 scroll-mt-24" id="overview">
                                    <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border"><Info size={24} className="text-primary-custom" /></div><h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Lesson Overview</h3></div>
                                    <p className="text-foreground/80 leading-relaxed text-lg font-medium">{generatedPlan?.overview}</p>
                                </section>
                                <section className="mb-14 scroll-mt-24" id="objectives">
                                    <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border"><Target size={24} className="text-primary-custom" /></div><h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Learning Objectives</h3></div>
                                    <div className="space-y-4">{generatedPlan?.objectives.map((obj, i) => (<label key={i} onClick={() => toggleObjective(i)} className={`flex items-start gap-5 p-5 rounded-[2rem] cursor-pointer border-2 transition-all ${checkedObjectives.has(i) ? 'bg-primary-custom/5 border-primary-custom shadow-md' : 'hover:bg-muted border-transparent'}`}><div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${checkedObjectives.has(i) ? 'bg-primary-custom border-primary-custom' : 'border-border'}`}>{checkedObjectives.has(i) && <Check size={14} className="text-white" />}</div><span className={`text-lg font-bold ${checkedObjectives.has(i) ? 'text-foreground' : 'text-foreground/70'}`}>{obj}</span></label>))}</div>
                                </section>
                                <section className="mb-14 scroll-mt-24" id="materials">
                                    <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border"><Package size={24} className="text-primary-custom" /></div><h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Required Materials</h3></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{generatedPlan?.materials.map((m, i) => (<div key={i} className="flex items-center gap-4 p-5 bg-muted/50 border border-border rounded-[2rem] group hover:bg-card-bg hover:shadow-lg transition-all"><div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform"><Lightbulb size={22} className="text-amber-500" /></div><span className="text-foreground font-black text-sm uppercase tracking-tight">{m.name}</span></div>))}</div>
                                </section>
                                <section className="mb-14 scroll-mt-24" id="activities">
                                    <div className="flex items-center gap-4 mb-8"><div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border"><Activity size={24} className="text-primary-custom" /></div><h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Execution Activities</h3></div>
                                    <div className="space-y-6">{generatedPlan?.activities.map((a, i) => (<div key={i} className={`p-8 rounded-[2.5rem] relative overflow-hidden transition-all ${i === 1 ? 'border-2 border-primary-custom bg-primary-custom/5 shadow-xl shadow-primary-custom/5' : 'border border-border bg-muted/40 hover:bg-muted/60'}`}><div className="flex justify-between items-start mb-6 relative z-10"><h4 className="font-black text-foreground text-xl uppercase italic tracking-tight leading-none">{i + 1}. {a.title}</h4><span className="text-[10px] font-black text-primary-custom bg-primary-custom/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary-custom/20">{a.duration}</span></div><p className="text-foreground/70 text-base font-medium leading-relaxed relative z-10">{a.description}</p>{i === 1 && <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>}</div>))}</div>
                                </section>
                                <section className="scroll-mt-24" id="assessment">
                                    <div className="flex items-center gap-4 mb-6"><div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center border border-border"><ClipboardCheck size={24} className="text-primary-custom" /></div><h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">Assessment & Rubrics</h3></div>
                                    <div className="grid grid-cols-1 gap-3">{generatedPlan?.assessment.map((a, i) => (<div key={i} className="flex items-start gap-4 p-5 bg-muted/30 border border-border rounded-2xl hover:bg-muted/50 transition-all"><div className="w-2.5 h-2.5 bg-primary-custom rounded-full mt-2.5 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" /><span className="text-foreground/80 font-bold uppercase text-xs tracking-tight">{a}</span></div>))}</div>
                                </section>
                            </div>
                        </div>
                    </main>
                    <aside className="w-80 border-l border-border bg-card-bg flex flex-col shrink-0 hidden xl:flex">
                        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center"><Zap size={18} className="text-background" /></div>
                                <span className="font-black text-foreground text-xs uppercase tracking-[0.2em]">AI Assistant</span>
                            </div>
                            <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary-custom/10 flex items-center justify-center shrink-0 border border-primary-custom/20">
                                    <Bot size={20} className="text-primary-custom" />
                                </div>
                                <div className="bg-muted rounded-[2rem] rounded-tl-none p-6 text-sm font-bold text-foreground/80 leading-relaxed border border-border">
                                    I've drafted your plan! How can I refine it further?
                                    <div className="mt-6 flex flex-col gap-2.5">
                                        <button className="text-left w-full px-5 py-3 bg-card-bg border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-custom hover:text-primary-custom transition-all shadow-sm">"Add more activities"</button>
                                        <button className="text-left w-full px-5 py-3 bg-card-bg border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-custom hover:text-primary-custom transition-all shadow-sm">"Generate a quiz"</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border bg-muted/20">
                            <div className="relative group">
                                <textarea value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} className="w-full bg-card-bg border border-border rounded-[2rem] pr-14 py-4 px-6 text-sm font-bold text-foreground placeholder:text-muted-foreground/30 focus:border-primary-custom focus:ring-0 focus:outline-none transition-all resize-none shadow-sm hover:border-primary-custom/50" placeholder="Type your request..." rows={2} />
                                <button className="absolute right-3 bottom-3 w-10 h-10 bg-foreground text-background rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"><Send size={18} /></button>
                            </div>
                            <div className="mt-4 flex items-center justify-between px-2">
                                <div className="flex gap-4">
                                    <button className="text-muted-foreground hover:text-primary-custom transition-all"><Mic size={20} /></button>
                                    <button className="text-muted-foreground hover:text-primary-custom transition-all"><Paperclip size={20} /></button>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    AI Online
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>);
    }

    // SLIDE MODE VIEW
    return (
        <div className="h-full w-full flex flex-col bg-transparent overflow-hidden">
            <header className="h-20 bg-card-bg/80 backdrop-blur-xl border-b border-border px-8 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('form')} className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"><ArrowLeft size={20} /></button>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-custom rounded-2xl flex items-center justify-center shadow-lg shadow-primary-custom/20"><Sparkles size={20} className="text-white" /></div>
                        <div><h1 className="text-lg font-black text-foreground leading-none uppercase italic tracking-tighter">{mode === 'book' ? selectedBook?.title : topic}</h1><span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">{grade} • {format || 'Interactive'}</span></div>
                    </div>
                    <div className="hidden md:flex bg-muted p-1 rounded-2xl gap-1 ml-6 border border-border">
                        <button onClick={() => setDocumentMode('document')} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"><FileText size={16} /> Document</button>
                        <button onClick={() => setDocumentMode('slides')} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-card-bg shadow-sm text-foreground"><Presentation size={16} /> Slide Mode</button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border border-border hover:bg-muted text-xs font-black uppercase tracking-widest text-foreground transition-all"><Download size={16} /> Export</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-primary-custom hover:bg-primary-custom/90 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-custom/20">Refine</button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                {/* Slide Thumbnails */}
                <aside className="w-64 border-r border-border bg-card-bg shrink-0 hidden lg:flex flex-col">
                    <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Slide Preview</h3>
                        <span className="text-[10px] bg-primary-custom/10 text-primary-custom px-2 py-0.5 rounded font-black">{totalSlides}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {slides.map((slide, idx) => (
                            <button key={slide.id} onClick={() => setCurrentSlide(idx)} className={`w-full p-2.5 rounded-2xl cursor-pointer transition-all border-2 text-left group ${currentSlide === idx ? 'border-primary-custom bg-primary-custom/5 shadow-lg shadow-primary-custom/5' : 'border-transparent hover:border-border hover:bg-muted'}`}>
                                <div className={`aspect-video rounded-xl flex items-center justify-center mb-3 overflow-hidden ${currentSlide === idx ? 'bg-foreground' : 'bg-muted border border-border'}`}>
                                    <slide.icon size={24} className={currentSlide === idx ? 'text-background/40' : 'text-muted-foreground'} />
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className={`text-[10px] font-black uppercase tracking-tight truncate ${currentSlide === idx ? 'text-foreground' : 'text-muted-foreground'}`}>{String(idx + 1).padStart(2, '0')} {slide.label}</span>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${currentSlide === idx ? 'bg-primary-custom text-white' : 'bg-muted text-muted-foreground'}`}>{slide.type}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
                <main className="flex-1 bg-muted/30 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/5 rounded-full blur-[120px]" />
                    </div>

                    <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} className="absolute left-10 w-14 h-14 rounded-full bg-card-bg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary-custom transition-all shadow-xl hover:scale-110 active:scale-90 z-20"><ChevronLeft size={28} /></button>
                    <button onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))} className="absolute right-10 w-14 h-14 rounded-full bg-card-bg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary-custom transition-all shadow-xl hover:scale-110 active:scale-90 z-20"><ChevronRight size={28} /></button>

                    <div className="w-full max-w-5xl aspect-[16/9] bg-card-bg rounded-[4rem] shadow-2xl shadow-black/10 p-16 flex flex-col justify-center relative overflow-hidden border border-border animate-in fade-in zoom-in duration-500">
                        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[120px]" />
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            {currentSlide === 0 && (<div className="animate-in slide-in-from-bottom-8 duration-700">
                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary-custom/10 text-primary-custom text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary-custom/20"><Sparkles size={18} className="fill-primary-custom" /> Lesson Introduction</div>
                                <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter leading-[0.95] uppercase italic">{generatedPlan?.title?.split(' ').slice(0, 2).join(' ')}<br /><span className="text-primary-custom">{generatedPlan?.title?.split(' ').slice(2).join(' ')}</span></h2>
                                <p className="text-lg md:text-xl text-muted-foreground font-bold max-w-3xl leading-snug mb-12 uppercase opacity-80">{generatedPlan?.subtitle}</p>
                                <div className="flex items-center gap-12">
                                    <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-[2rem] bg-foreground flex items-center justify-center text-background shadow-lg"><Clock size={28} /></div><div><div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Duration</div><div className="text-2xl font-black text-foreground italic">{generatedPlan?.duration}</div></div></div>
                                    <div className="w-px h-12 bg-border" />
                                    <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-[2rem] bg-primary-custom/10 flex items-center justify-center text-primary-custom shadow-sm border border-primary-custom/10"><Users size={28} /></div><div><div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Grade Level</div><div className="text-2xl font-black text-foreground italic">{grade}</div></div></div>
                                </div>
                            </div>)}
                            {currentSlide === 1 && (<div className="animate-in fade-in duration-500">
                                <div className="flex items-center gap-4 mb-8"><div className="w-14 h-14 rounded-3xl bg-muted flex items-center justify-center border border-border"><Target size={28} className="text-primary-custom" /></div><h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Learning Objectives</h3></div>
                                <div className="grid grid-cols-1 gap-3 max-w-4xl">{generatedPlan?.objectives.map((obj, i) => (<div key={i} className="flex items-start gap-5 p-5 bg-muted/40 rounded-[2rem] border border-border/50 group hover:border-primary-custom/30 transition-all"><div className="w-8 h-8 rounded-xl bg-primary-custom text-white flex items-center justify-center font-black text-base shadow-lg shadow-primary-custom/20">{i + 1}</div><span className="text-foreground/90 font-black text-lg leading-tight uppercase tracking-tight">{obj}</span></div>))}</div>
                            </div>)}
                            {currentSlide === 2 && (<div className="animate-in fade-in duration-500">
                                <div className="flex items-center gap-4 mb-8"><div className="w-14 h-14 rounded-3xl bg-muted flex items-center justify-center border border-border"><Package size={28} className="text-primary-custom" /></div><h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Required Materials</h3></div>
                                <div className="grid grid-cols-2 gap-4">{generatedPlan?.materials.map((m, i) => (<div key={i} className="flex items-center gap-5 p-6 bg-muted/40 rounded-[2.5rem] border border-border/50 group hover:bg-card-bg hover:shadow-xl transition-all"><div className="w-12 h-12 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20"><Lightbulb size={24} className="text-amber-500" /></div><span className="text-foreground font-black text-lg uppercase tracking-tighter leading-none">{m.name}</span></div>))}</div>
                            </div>)}
                            {currentSlide > 2 && currentSlide < totalSlides - 1 && (<div className="animate-in slide-in-from-right-12 duration-500">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-[1.5rem] bg-primary-custom flex items-center justify-center text-white shadow-xl shadow-primary-custom/20 font-black text-xl">{currentSlide - 2}</div>
                                        <h3 className="text-4xl font-black text-foreground uppercase italic tracking-tighter leading-none">{generatedPlan?.activities[currentSlide - 3]?.title}</h3>
                                    </div>
                                    <span className="text-[10px] font-black text-primary-custom bg-primary-custom/10 px-5 py-2.5 rounded-full uppercase tracking-widest border border-primary-custom/20">{generatedPlan?.activities[currentSlide - 3]?.duration}</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-primary-custom rounded-full" />
                                    <p className="text-xl md:text-2xl text-foreground font-bold leading-relaxed italic opacity-90">{generatedPlan?.activities[currentSlide - 3]?.description}</p>
                                </div>
                            </div>)}
                            {currentSlide === totalSlides - 1 && (<div className="animate-in fade-in duration-500">
                                <div className="flex items-center gap-4 mb-8"><div className="w-14 h-14 rounded-3xl bg-muted flex items-center justify-center border border-border"><ClipboardCheck size={28} className="text-primary-custom" /></div><h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Assessment & Success</h3></div>
                                <div className="grid grid-cols-1 gap-4">{generatedPlan?.assessment.map((a, i) => (<div key={i} className="flex items-center gap-5 p-5 bg-muted/40 rounded-[2rem] border border-border/50 hover:bg-card-bg transition-all shadow-sm"><div className="w-3 h-3 bg-primary-custom rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.6)] shrink-0" /><span className="text-foreground/80 font-black text-lg uppercase tracking-tight italic">{a}</span></div>))}</div>
                            </div>)}
                        </div>
                    </div>
                    {/* Progress Bar Area */}
                    <div className="w-full max-w-5xl mt-12 px-4 relative z-10">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Section {currentSlide + 1} of {totalSlides}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-primary-custom uppercase tracking-widest">{Math.round(progressPercent)}% Explored</span>
                                <div className="flex gap-1">
                                    {slides.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= currentSlide ? 'bg-primary-custom w-4' : 'bg-border w-1'}`} />))}
                                </div>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border shadow-inner p-0.5">
                            <div className="h-full bg-primary-custom rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </main>
                {/* AI Chat Sidebar */}
                <aside className="w-80 border-l border-border bg-card-bg flex flex-col shrink-0 hidden xl:flex">
                    <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center"><Zap size={18} className="text-background" /></div>
                            <span className="font-black text-foreground text-xs uppercase tracking-[0.2em]">Slide Assistant</span>
                        </div>
                        <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {assistantMessages.length === 0 ? (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary-custom/10 flex items-center justify-center shrink-0 border border-primary-custom/20">
                                    <Bot size={20} className="text-primary-custom" />
                                </div>
                                <div className="bg-muted rounded-[2rem] rounded-tl-none p-6 text-sm font-bold text-foreground/80 leading-relaxed border border-border relative overflow-hidden">
                                    Namaste! I'm Vasu AI. I can help you refine these slides or explain concepts.
                                    <div className="mt-6 flex flex-col gap-2.5">
                                        <button onClick={() => setChatMessage("Suggest more activities for this lesson")} className="text-left w-full px-5 py-3 bg-card-bg border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-custom hover:text-primary-custom transition-all shadow-sm">"More activities"</button>
                                        <button onClick={() => setChatMessage("Write an exciting intro script")} className="text-left w-full px-5 py-3 bg-card-bg border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary-custom hover:text-primary-custom transition-all shadow-sm">"Intro script"</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            assistantMessages.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-custom' : 'bg-foreground'}`}>
                                        {msg.role === 'user' ? <Users size={14} className="text-white" /> : <Bot size={14} className="text-background" />}
                                    </div>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold leading-relaxed markdown-container ${msg.role === 'user' ? 'bg-primary-custom/10 text-primary-custom rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none border border-border'}`}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))
                        )}
                        {isAssistantLoading && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-xl bg-muted" />
                                <div className="w-24 h-8 bg-muted rounded-2xl" />
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t border-border bg-muted/20">
                        <div className="relative group">
                            <textarea
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAssistantSend(); } }}
                                className="w-full bg-card-bg border border-border rounded-[2rem] pr-14 py-4 px-6 text-sm font-bold text-foreground placeholder:text-muted-foreground/30 focus:border-primary-custom focus:ring-0 focus:outline-none transition-all resize-none shadow-sm hover:border-primary-custom/50"
                                placeholder="Type your request..."
                                rows={2}
                            />
                            <button
                                onClick={handleAssistantSend}
                                disabled={isAssistantLoading || !chatMessage.trim()}
                                className="absolute right-3 bottom-3 w-10 h-10 bg-foreground text-background rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between px-2">
                            <div className="flex gap-4">
                                <button className="text-muted-foreground hover:text-primary-custom transition-all"><Mic size={20} /></button>
                                <button className="text-muted-foreground hover:text-primary-custom transition-all"><Paperclip size={20} /></button>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2 italic">
                                Syncing Active
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LessonPlannerView;
