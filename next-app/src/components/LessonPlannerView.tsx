'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Check, X, Search, Layers, Maximize2,
    ArrowLeft, Save, Copy, Download, Clock, Target, Users, BookMarked,
    CheckCircle2, Lightbulb, ListChecks, MessageSquare, RefreshCw,
    FileText, Presentation, Info, Package, Activity, ClipboardCheck,
    Send, Mic, Paperclip, History, Bot, Zap
} from 'lucide-react';
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
            <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-transparent border-0 border-b-2 
                    ${isOpen ? 'border-lime-500' : 'border-slate-200'} 
                    px-0 py-2 text-sm font-medium transition-all cursor-pointer text-left hover:border-lime-400`}
            >
                <span className={value ? 'text-slate-800 text-xs' : 'text-slate-400 text-xs'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-1 max-h-[200px] overflow-y-auto animate-fadeIn">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => { onChange(option); setIsOpen(false); }}
                            className={`w-full px-3 py-2 text-left text-xs font-medium transition-all flex items-center justify-between
                                ${value === option ? 'bg-lime-50 text-lime-700' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                            <span>{option}</span>
                            {value === option && <Check size={12} className="text-lime-600" />}
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
    const [checkedObjectives, setCheckedObjectives] = useState<Set<number>>(new Set());
    const [currentSlide, setCurrentSlide] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleGenerate = () => {
        setViewState('generating');

        setTimeout(() => {
            const topicName = mode === 'book' ? selectedBook?.title : topic;

            const mockPlan: LessonPlanContent = {
                title: `Introduction to ${topicName}`,
                subtitle: `Conceptual exploration for ${grade || 'middle school'} students.`,
                overview: `This lesson bridges foundational concepts with advanced understanding of ${topicName}. Students will move from basic models to embrace deeper concepts through thought experiments and hands-on demonstrations. The session is designed to be interactive and engaging.`,
                objectives: [
                    `Distinguish between basic and advanced concepts using everyday analogies.`,
                    `Identify key patterns and principles in ${topicName}.`,
                    `Demonstrate understanding through practical application.`,
                    `Collaborate effectively in group discussions and activities.`
                ],
                duration: duration || '45 mins',
                materials: [
                    { name: 'Visual presentation slides', icon: 'presentation', color: 'amber' },
                    { name: 'Worksheet handouts', icon: 'file', color: 'blue' },
                    { name: 'Interactive simulation', icon: 'play', color: 'purple' },
                    { name: 'Assessment rubric', icon: 'clipboard', color: 'green' }
                ],
                activities: [
                    {
                        title: 'Warm-up Discussion',
                        duration: '10 MIN',
                        description: `Begin with an engaging question about ${topicName}. Students share prior knowledge and experiences. Teacher facilitates discussion to assess baseline understanding.`
                    },
                    {
                        title: 'Core Concept Exploration',
                        duration: '20 MIN',
                        description: `Live demonstration using visual aids. Discussion focuses on key principles and real-world applications. Students take notes and ask questions.`
                    },
                    {
                        title: 'Hands-on Activity',
                        duration: '15 MIN',
                        description: `Students work in groups to complete a practical exercise. Teacher circulates to provide guidance and feedback.`
                    }
                ],
                assessment: [
                    'Formative: Observation during group activities',
                    'Formative: Question-answer sessions',
                    'Summative: Written quiz at end of unit',
                    'Self-assessment: Student reflection journals'
                ],
                homework: `Complete the practice worksheet. Research and find 3 real-world examples related to ${topicName}. Prepare 2 questions for next class.`,
                tips: [
                    'Adjust pace based on student understanding',
                    'Use local examples to make content relatable',
                    'Prepare extra activities for fast learners',
                    'Have backup plan for technology issues'
                ]
            };

            setGeneratedPlan(mockPlan);
            setViewState('result');
            setIsSaved(false);
            setCheckedObjectives(new Set());
        }, 2000);
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
            <div className="h-full w-full flex flex-col relative bg-white overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-lime-200 rounded-full blur-[80px] opacity-30" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-lime-100 rounded-full blur-[80px] opacity-30" />
                </div>

                <div className="relative z-10 px-6 py-4 flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-200">
                        <BookOpen size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Lesson Planner</h1>
                </div>

                <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 pb-6 overflow-y-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center p-1 bg-slate-100/80 border border-slate-200/50 rounded-full mb-4">
                            <button onClick={() => setMode('topic')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'topic' ? 'bg-lime-500 text-white shadow-md shadow-lime-200' : 'text-slate-500 hover:text-slate-700'}`}>By Topic</button>
                            <button onClick={() => setMode('book')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === 'book' ? 'bg-lime-500 text-white shadow-md shadow-lime-200' : 'text-slate-500 hover:text-slate-700'}`}>By Book</button>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">What are we teaching today?</h2>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-lime-900/5 w-full max-w-3xl">
                        {mode === 'topic' && (
                            <div className="relative mb-4">
                                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic here..." className="w-full bg-transparent border-0 border-b-2 border-slate-200 focus:border-lime-500 focus:ring-0 focus:outline-none text-xl md:text-2xl font-medium px-0 py-3 placeholder:text-slate-300 transition-all text-center text-slate-800" />
                                <div className="mt-2 flex flex-wrap justify-center gap-2 items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suggestions:</span>
                                    {suggestions.map((s, i) => (<button key={i} onClick={() => setTopic(s)} className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline transition-all">{s}</button>))}
                                </div>
                            </div>
                        )}

                        {mode === 'book' && (
                            <div className="mb-4">
                                {!selectedBook ? (
                                    <div className="relative" ref={dropdownRef}>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 relative">
                                                <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input type="text" value={bookSearchQuery} onChange={(e) => { setBookSearchQuery(e.target.value); setIsDropdownOpen(true); }} onFocus={() => setIsDropdownOpen(true)} placeholder="Search your library..." className="w-full bg-transparent border-0 border-b-2 border-slate-200 focus:border-lime-500 focus:ring-0 focus:outline-none text-xl font-medium pl-7 pr-2 py-3 placeholder:text-slate-300 transition-all text-center text-slate-800" />
                                            </div>
                                            <button onClick={() => setIsBookPickerOpen(true)} className="p-3 bg-slate-100 hover:bg-lime-100 rounded-xl text-slate-500 hover:text-lime-600 transition-all"><Maximize2 size={18} /></button>
                                        </div>
                                        {isDropdownOpen && filteredBooks.length > 0 && (
                                            <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-2 max-h-[250px] overflow-y-auto animate-fadeIn">
                                                {filteredBooks.slice(0, 5).map((book) => (
                                                    <button key={book.id} onClick={() => handleBookSelect(book)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-all text-left group">
                                                        <div className={`w-10 h-12 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>{book.cover ? <img src={book.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={16} className={book.iconColor} />}</div>
                                                        <div className="flex-1"><h4 className="font-bold text-sm text-slate-800 group-hover:text-lime-700">{book.title}</h4><p className="text-xs text-slate-500">{book.author} • {book.classLevel}</p></div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 bg-lime-50 rounded-xl p-3 border border-lime-200">
                                            <div className={`w-12 h-14 rounded-lg ${selectedBook.cover ? '' : selectedBook.color} flex items-center justify-center overflow-hidden shadow-sm shrink-0`}>{selectedBook.cover ? <img src={selectedBook.cover} alt="" className="w-full h-full object-cover" /> : <BookOpen size={20} className={selectedBook.iconColor} />}</div>
                                            <div className="flex-1 min-w-0"><h3 className="text-base font-bold text-slate-800 truncate">{selectedBook.title}</h3><p className="text-xs text-slate-500 truncate">by {selectedBook.author}</p></div>
                                            <button onClick={clearBookSelection} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"><X size={16} /></button>
                                        </div>
                                        {selectedBook.chapters && selectedBook.chapters.length > 0 && (
                                            <div><label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5"><Layers size={12} />Select Chapters {selectedChapters.size > 0 && <span className="text-lime-600">({selectedChapters.size})</span>}</label><div className="flex flex-wrap gap-1.5">{selectedBook.chapters.map((chapter, idx) => (<button key={chapter.id} onClick={() => toggleChapter(chapter.id)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedChapters.has(chapter.id) ? 'bg-lime-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}`}><span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center ${selectedChapters.has(chapter.id) ? 'bg-white/20' : 'bg-slate-100'}`}>{idx + 1}</span><span className="max-w-[100px] truncate">{chapter.title}</span>{selectedChapters.has(chapter.id) && <Check size={10} />}</button>))}</div></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Options Grid - 5 Columns Original Layout */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                            <CustomDropdown label="Grade" value={grade} onChange={setGrade} options={gradeOptions} placeholder="Select..." />
                            <CustomDropdown label="Duration" value={duration} onChange={setDuration} options={durationOptions} placeholder="Per session..." />
                            <CustomDropdown label="Days" value={days} onChange={setDays} options={daysOptions} placeholder="Total..." />
                            <CustomDropdown label="Language" value={language} onChange={setLanguage} options={languageOptions} placeholder="Select..." />
                            <CustomDropdown label="Format" value={format} onChange={setFormat} options={formatOptions} placeholder="Select..." />
                        </div>

                        <div className="mt-5">
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">Learning Objectives (Optional)</label>
                            <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="Define specific goals for this lesson..." className="w-full bg-transparent border-0 border-b-2 border-slate-200 px-0 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-lime-500 focus:ring-0 focus:outline-none transition-all resize-none h-[50px]" />
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button onClick={handleGenerate} disabled={mode === 'topic' ? !topic : !selectedBook} className="group px-6 py-3 bg-lime-500 hover:bg-lime-600 disabled:bg-slate-300 text-white rounded-full flex items-center gap-2 shadow-lg shadow-lime-300 disabled:shadow-slate-200 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:hover:scale-100">
                                <Sparkles size={18} className="group-hover:animate-pulse" />
                                <span className="font-bold text-sm">Generate Lesson Plan</span>
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
            <div className="h-full w-full flex flex-col items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-20 h-20 bg-lime-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-lime-200 animate-bounce">
                        <Sparkles size={32} className="text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Generating Lesson Plan</h2>
                    <p className="text-slate-500">AI is crafting your personalized lesson...</p>
                    <div className="mt-6 flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (<div key={i} className="w-3 h-3 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />))}
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
            <div className="h-full w-full flex flex-col bg-white overflow-hidden">
                <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewState('form')} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"><ArrowLeft size={20} /></button>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center shadow-md shadow-lime-200"><Sparkles size={18} className="text-white" /></div>
                            <div><h1 className="text-sm font-bold text-slate-900 leading-none">{mode === 'book' ? selectedBook?.title : topic}</h1><span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{grade} • {format || 'Interactive'}</span></div>
                        </div>
                        <div className="hidden md:flex bg-slate-100 p-1 rounded-xl gap-1 ml-4">
                            <button onClick={() => setDocumentMode('document')} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold bg-white shadow-sm text-slate-900"><FileText size={16} /> Document</button>
                            <button onClick={() => setDocumentMode('slides')} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-slate-500"><Presentation size={16} /> Slide Mode</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-700">{isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Download size={16} />}{isCopied ? 'Copied!' : 'Export'}</button>
                        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-lime-500 hover:bg-lime-600 text-white shadow-lime-200'}`}>{isSaved ? <CheckCircle2 size={16} /> : <Zap size={16} />}{isSaved ? 'Saved!' : 'Save'}</button>
                    </div>
                </header>
                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-56 border-r border-slate-200 bg-white shrink-0 hidden lg:block overflow-y-auto">
                        <div className="p-5"><h3 className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lesson Index</h3><nav className="flex flex-col gap-1">{sidebarLinks.map((link) => (<button key={link.id} onClick={() => setActiveSection(link.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeSection === link.id ? 'bg-lime-100 text-lime-700 border-r-4 border-lime-500' : 'text-slate-500 hover:bg-slate-50'}`}><link.icon size={18} />{link.label}</button>))}</nav><div className="mt-10 pt-6 border-t border-slate-100"><div className="bg-slate-50 rounded-2xl p-4"><span className="text-[10px] font-bold text-slate-400 uppercase">Time</span><div className="text-2xl font-bold text-slate-800">{generatedPlan?.duration}</div></div></div></div>
                    </aside>
                    <main className="flex-1 bg-slate-50/50 overflow-y-auto">
                        <div className="max-w-3xl mx-auto p-8"><div className="bg-white/95 backdrop-blur-sm rounded-[32px] p-10 shadow-sm border border-slate-100">
                            <div className="border-b border-slate-100 pb-8 mb-8"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-[10px] font-black uppercase tracking-wider mb-5"><CheckCircle2 size={12} />Premium AI</div><h2 className="text-4xl font-extrabold text-slate-900 mb-3">{generatedPlan?.title}</h2><p className="text-lg text-slate-500">{generatedPlan?.subtitle}</p></div>
                            <section className="mb-12"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Info size={20} className="text-slate-600" /></div><h3 className="text-xl font-bold text-slate-800">Lesson Overview</h3></div><p className="text-slate-600 leading-relaxed">{generatedPlan?.overview}</p></section>
                            <section className="mb-12"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Target size={20} className="text-slate-600" /></div><h3 className="text-xl font-bold text-slate-800">Objectives</h3></div><div className="space-y-3">{generatedPlan?.objectives.map((obj, i) => (<label key={i} onClick={() => toggleObjective(i)} className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer border ${checkedObjectives.has(i) ? 'bg-lime-50 border-lime-200' : 'hover:bg-slate-50 border-transparent'}`}><div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${checkedObjectives.has(i) ? 'bg-lime-500 border-lime-500' : 'border-slate-300'}`}>{checkedObjectives.has(i) && <Check size={14} className="text-white" />}</div><span className={checkedObjectives.has(i) ? 'text-lime-800' : 'text-slate-700'}>{obj}</span></label>))}</div></section>
                            <section className="mb-12"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Package size={20} className="text-slate-600" /></div><h3 className="text-xl font-bold text-slate-800">Materials</h3></div><div className="grid grid-cols-2 gap-3">{generatedPlan?.materials.map((m, i) => (<div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Lightbulb size={18} className="text-amber-500" /></div><span className="text-slate-700 font-medium text-sm">{m.name}</span></div>))}</div></section>
                            <section className="mb-12"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Activity size={20} className="text-slate-600" /></div><h3 className="text-xl font-bold text-slate-800">Activities</h3></div><div className="space-y-4">{generatedPlan?.activities.map((a, i) => (<div key={i} className={`p-6 rounded-3xl ${i === 1 ? 'border-2 border-lime-200 bg-white shadow-sm' : 'border border-slate-100 bg-slate-50/50'}`}><div className="flex justify-between items-start mb-3"><h4 className="font-bold text-slate-800 text-lg">{i + 1}. {a.title}</h4><span className="text-xs font-black text-lime-700 bg-lime-100 px-3 py-1 rounded-full">{a.duration}</span></div><p className="text-slate-600">{a.description}</p></div>))}</div></section>
                            <section><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><ClipboardCheck size={20} className="text-slate-600" /></div><h3 className="text-xl font-bold text-slate-800">Assessment</h3></div><ul className="space-y-2">{generatedPlan?.assessment.map((a, i) => (<li key={i} className="flex items-start gap-3 text-slate-600"><div className="w-2 h-2 bg-lime-400 rounded-full mt-2" /><span>{a}</span></li>))}</ul></section>
                        </div></div>
                    </main>
                    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 hidden xl:flex">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center"><Zap size={16} className="text-white" /></div><span className="font-bold text-slate-800 text-sm">AI Assistant</span></div><button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"><X size={18} /></button></div>
                        <div className="flex-1 overflow-y-auto p-4"><div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shrink-0"><Bot size={16} className="text-lime-700" /></div><div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm text-slate-700">I've drafted your plan! How can I refine it?<div className="mt-4 flex flex-col gap-2"><button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-lime-500">"Add more activities"</button><button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-lime-500">"Generate a quiz"</button></div></div></div></div>
                        <div className="p-4 border-t border-slate-100"><div className="relative"><textarea value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} className="w-full border border-slate-200 rounded-2xl pr-12 py-3 px-4 text-sm resize-none" placeholder="Ask AI..." rows={2} /><button className="absolute right-3 bottom-3 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center"><Send size={16} /></button></div><div className="mt-3 flex items-center justify-between px-1"><div className="flex gap-2"><Mic size={18} className="text-slate-400" /><Paperclip size={18} className="text-slate-400" /></div><span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Online</span></div></div>
                    </aside>
                </div>
            </div>
        );
    }

    // SLIDE MODE VIEW
    return (
        <div className="h-full w-full flex flex-col bg-white overflow-hidden">
            <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setViewState('form')} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"><ArrowLeft size={20} /></button>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center shadow-md shadow-lime-200"><Sparkles size={18} className="text-white" /></div>
                        <div><h1 className="text-sm font-bold text-slate-900 leading-none">{mode === 'book' ? selectedBook?.title : topic}</h1><span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{grade} • {format || 'Interactive'}</span></div>
                    </div>
                    <div className="hidden md:flex bg-slate-100 p-1 rounded-xl gap-1 ml-4">
                        <button onClick={() => setDocumentMode('document')} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-slate-500"><FileText size={16} /> Document</button>
                        <button onClick={() => setDocumentMode('slides')} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold bg-white shadow-sm text-slate-900"><Presentation size={16} /> Slide Mode</button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-700"><Download size={16} /> Export</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-sm font-bold shadow-lg shadow-lime-200"><Zap size={16} /> Refine</button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                {/* Slide Thumbnails */}
                <aside className="w-56 border-r border-slate-200 bg-white shrink-0 hidden lg:flex flex-col">
                    <div className="p-4 border-b border-slate-100"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slide Preview</h3></div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {slides.map((slide, idx) => (
                            <button key={slide.id} onClick={() => setCurrentSlide(idx)} className={`w-full p-2 rounded-xl cursor-pointer transition-all ${currentSlide === idx ? 'border-3 border-lime-500 bg-white shadow-lg shadow-lime-100' : 'border border-transparent hover:border-slate-200'}`}>
                                <div className={`aspect-video rounded-lg flex items-center justify-center mb-2 ${currentSlide === idx ? 'bg-slate-900' : 'bg-slate-100 border border-slate-200'}`}>
                                    <slide.icon size={20} className={currentSlide === idx ? 'text-white/40' : 'text-slate-300'} />
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className={`text-[10px] font-bold ${currentSlide === idx ? 'text-slate-900' : 'text-slate-500'}`}>{String(idx + 1).padStart(2, '0')} {slide.label}</span>
                                    <span className="text-[10px] text-slate-400">{slide.type}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
                {/* Main Slide Area */}
                <main className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-8 relative">
                    <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} className="absolute left-4 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"><ChevronLeft size={24} /></button>
                    <button onClick={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))} className="absolute right-4 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"><ChevronRight size={24} /></button>

                    <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-12 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-lime-50 rounded-full blur-3xl opacity-60" />
                        <div className="relative z-10">
                            {currentSlide === 0 && (<>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 text-lime-700 text-xs font-black uppercase tracking-widest mb-8"><Sparkles size={16} /> Lesson Introduction</div>
                                <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">{generatedPlan?.title?.split(' ').slice(0, 2).join(' ')}<br /><span className="text-lime-500">{generatedPlan?.title?.split(' ').slice(2).join(' ')}</span></h2>
                                <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed mb-10">{generatedPlan?.subtitle}</p>
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white"><Clock size={20} /></div><div><div className="text-xs text-slate-400 font-bold uppercase">Duration</div><div className="text-lg font-bold text-slate-900">{generatedPlan?.duration}</div></div></div>
                                    <div className="w-px h-10 bg-slate-200" />
                                    <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-700"><Users size={20} /></div><div><div className="text-xs text-slate-400 font-bold uppercase">Level</div><div className="text-lg font-bold text-slate-900">{grade}</div></div></div>
                                </div>
                            </>)}
                            {currentSlide === 1 && (<>
                                <div className="flex items-center gap-3 mb-8"><Target size={28} className="text-lime-500" /><h3 className="text-3xl font-bold text-slate-900">Learning Objectives</h3></div>
                                <div className="space-y-4">{generatedPlan?.objectives.map((obj, i) => (<div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl"><div className="w-8 h-8 rounded-lg bg-lime-500 text-white flex items-center justify-center font-bold text-sm">{i + 1}</div><span className="text-slate-700 font-medium text-lg">{obj}</span></div>))}</div>
                            </>)}
                            {currentSlide === 2 && (<>
                                <div className="flex items-center gap-3 mb-8"><Package size={28} className="text-lime-500" /><h3 className="text-3xl font-bold text-slate-900">Required Materials</h3></div>
                                <div className="grid grid-cols-2 gap-4">{generatedPlan?.materials.map((m, i) => (<div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl"><div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Lightbulb size={24} className="text-amber-600" /></div><span className="text-slate-800 font-semibold">{m.name}</span></div>))}</div>
                            </>)}
                            {currentSlide > 2 && currentSlide < totalSlides - 1 && (<>
                                <div className="flex justify-between items-start mb-6"><h3 className="text-3xl font-bold text-slate-900">{generatedPlan?.activities[currentSlide - 3]?.title}</h3><span className="text-sm font-black text-lime-700 bg-lime-100 px-4 py-2 rounded-full uppercase">{generatedPlan?.activities[currentSlide - 3]?.duration}</span></div>
                                <p className="text-xl text-slate-600 leading-relaxed">{generatedPlan?.activities[currentSlide - 3]?.description}</p>
                            </>)}
                            {currentSlide === totalSlides - 1 && (<>
                                <div className="flex items-center gap-3 mb-8"><ClipboardCheck size={28} className="text-lime-500" /><h3 className="text-3xl font-bold text-slate-900">Assessment Methods</h3></div>
                                <ul className="space-y-4">{generatedPlan?.assessment.map((a, i) => (<li key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl"><div className="w-3 h-3 bg-lime-500 rounded-full mt-2 shrink-0" /><span className="text-slate-700 font-medium text-lg">{a}</span></li>))}</ul>
                            </>)}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full max-w-4xl mt-8">
                        <div className="flex justify-between items-center mb-3 px-2"><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slide {currentSlide + 1} of {totalSlides}</span><span className="text-xs font-bold text-slate-900">{Math.round(progressPercent)}% Complete</span></div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-lime-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} /></div>
                    </div>
                </main>
                {/* AI Chat Sidebar */}
                <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 hidden xl:flex">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center"><Zap size={16} className="text-white" /></div><span className="font-bold text-slate-800 text-sm">AI Slide Assistant</span></div><button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"><X size={18} /></button></div>
                    <div className="flex-1 overflow-y-auto p-4"><div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shrink-0"><Bot size={16} className="text-lime-700" /></div><div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm text-slate-700">Ready to refine this slide!<div className="mt-4 flex flex-col gap-2"><button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-lime-500">"Add more imagery"</button><button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-lime-500">"Make intro more exciting"</button><button className="text-left w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:border-lime-500">"Give me a script"</button></div></div></div></div>
                    <div className="p-4 border-t border-slate-100"><div className="relative"><textarea className="w-full border border-slate-200 rounded-2xl pr-12 py-3 px-4 text-sm resize-none" placeholder="Ask AI to adjust slide..." rows={2} /><button className="absolute right-3 bottom-3 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center"><Send size={16} /></button></div><div className="mt-3 flex items-center justify-between px-1"><div className="flex gap-2"><Mic size={18} className="text-slate-400" /><Paperclip size={18} className="text-slate-400" /></div><span className="text-[10px] text-slate-400 font-bold uppercase">Assistant Syncing</span></div></div>
                </aside>
            </div>
        </div>
    );
};

export default LessonPlannerView;
