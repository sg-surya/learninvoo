'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, BookOpen, ChevronDown, Check, X, Search, Layers, Maximize2 } from 'lucide-react';

type PlanMode = 'topic' | 'book';

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

// Custom Dropdown Component
const CustomDropdown = ({
    label,
    value,
    onChange,
    options,
    placeholder
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
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

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-transparent border-0 border-b-2 
                    ${isOpen ? 'border-lime-500' : 'border-slate-200'} 
                    px-0 py-2 text-sm font-medium transition-all cursor-pointer text-left
                    hover:border-lime-400`}
            >
                <span className={value ? 'text-slate-800 text-xs' : 'text-slate-400 text-xs'}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-1 max-h-[200px] overflow-y-auto animate-fadeIn">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full px-3 py-2 text-left text-xs font-medium transition-all flex items-center justify-between
                                ${value === option
                                    ? 'bg-lime-50 text-lime-700'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
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
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [duration, setDuration] = useState('');
    const [days, setDays] = useState('');
    const [language, setLanguage] = useState('');
    const [format, setFormat] = useState('');
    const [objectives, setObjectives] = useState('');

    // Book Mode States
    const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
    const [bookSearchQuery, setBookSearchQuery] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load books from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) {
            setBooks(JSON.parse(saved));
        }
    }, []);

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

    const handleGenerate = () => {
        console.log('Generating lesson plan...', {
            mode,
            topic: mode === 'book' ? selectedBook?.title : topic,
            grade, duration, days, language, format, objectives,
            selectedChapters: Array.from(selectedChapters)
        });
    };

    const suggestions = ['Quantum Physics', 'Civil War', 'Photosynthesis'];

    const gradeOptions = [
        'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
        'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
    ];

    const durationOptions = [
        '15 mins', '20 mins', '30 mins', '45 mins',
        '1 hour', '1.5 hours', '2 hours', '3 hours'
    ];

    const daysOptions = [
        '1 day', '2 days', '3 days', '5 days', '7 days',
        '10 days', '14 days', '30 days'
    ];

    const languageOptions = [
        'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil',
        'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu',
        'Assamese', 'Sanskrit', 'Konkani', 'Manipuri', 'Nepali',
        'Spanish', 'French', 'German', 'Arabic', 'Chinese', 'Japanese'
    ];

    const formatOptions = [
        'Lecture (Vyakhyan)',
        'Activity Based Learning',
        'Group Discussion',
        'Project Based',
        'Storytelling (Katha)',
        'Demonstration',
        'Experiential Learning',
        'Flipped Classroom',
        'Quiz & Assessment',
        'Peer Learning',
        'Audio-Visual',
        'Field Visit Based'
    ];

    // Filter books by search
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
        book.subject.toLowerCase().includes(bookSearchQuery.toLowerCase())
    );

    // Handle book selection
    const handleBookSelect = (book: Book) => {
        setSelectedBook(book);
        setSelectedChapters(new Set());
        setBookSearchQuery('');
        setIsDropdownOpen(false);
        setIsBookPickerOpen(false);

        if (book.classLevel) {
            setGrade(book.classLevel);
        }
    };

    // Toggle chapter selection
    const toggleChapter = (chapterId: string) => {
        const newSelected = new Set(selectedChapters);
        if (newSelected.has(chapterId)) {
            newSelected.delete(chapterId);
        } else {
            newSelected.add(chapterId);
        }
        setSelectedChapters(newSelected);
    };

    // Clear book selection
    const clearBookSelection = () => {
        setSelectedBook(null);
        setSelectedChapters(new Set());
        setGrade('');
        setBookSearchQuery('');
    };

    return (
        <div className="h-full w-full flex flex-col relative bg-white overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-lime-200 rounded-full blur-[80px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-lime-100 rounded-full blur-[80px] opacity-30" />
            </div>

            {/* Header with Title */}
            <div className="relative z-10 px-6 py-4 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-200">
                    <BookOpen size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Lesson Planner</h1>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 relative z-10 flex flex-col items-center px-6 pb-6 overflow-y-auto">
                {/* Mode Toggle & Title */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center p-1 bg-slate-100/80 border border-slate-200/50 rounded-full mb-4">
                        <button
                            onClick={() => setMode('topic')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                                ${mode === 'topic'
                                    ? 'bg-lime-500 text-white shadow-md shadow-lime-200'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            By Topic
                        </button>
                        <button
                            onClick={() => setMode('book')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                                ${mode === 'book'
                                    ? 'bg-lime-500 text-white shadow-md shadow-lime-200'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            By Book
                        </button>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                        What are we teaching today?
                    </h2>
                </div>

                {/* Main Glass Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-lime-900/5 w-full max-w-3xl">

                    {/* TOPIC MODE */}
                    {mode === 'topic' && (
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter your topic here..."
                                className="w-full bg-transparent border-0 border-b-2 border-slate-200 
                                    focus:border-lime-500 focus:ring-0 focus:outline-none
                                    text-xl md:text-2xl font-medium px-0 py-3 
                                    placeholder:text-slate-300 transition-all text-center text-slate-800"
                            />
                            <div className="mt-2 flex flex-wrap justify-center gap-2 items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suggestions:</span>
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setTopic(suggestion)}
                                        className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BOOK MODE - Inline Search with Dropdown */}
                    {mode === 'book' && (
                        <div className="mb-4">
                            {!selectedBook ? (
                                <div className="relative" ref={dropdownRef}>
                                    {/* Search Input with Expand Button */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 relative">
                                            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={bookSearchQuery}
                                                onChange={(e) => {
                                                    setBookSearchQuery(e.target.value);
                                                    setIsDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsDropdownOpen(true)}
                                                placeholder="Search your library..."
                                                className="w-full bg-transparent border-0 border-b-2 border-slate-200 
                                                    focus:border-lime-500 focus:ring-0 focus:outline-none
                                                    text-xl font-medium pl-7 pr-2 py-3 
                                                    placeholder:text-slate-300 transition-all text-center text-slate-800"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setIsBookPickerOpen(true)}
                                            className="p-3 bg-slate-100 hover:bg-lime-100 rounded-xl text-slate-500 hover:text-lime-600 transition-all"
                                            title="Expand search"
                                        >
                                            <Maximize2 size={18} />
                                        </button>
                                    </div>

                                    {/* Inline Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 max-h-[250px] overflow-y-auto animate-fadeIn">
                                            {filteredBooks.length === 0 ? (
                                                <div className="text-center py-6">
                                                    <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                                                    <p className="text-sm text-slate-500 font-medium">
                                                        {books.length === 0 ? 'No books in library' : 'No matching books'}
                                                    </p>
                                                </div>
                                            ) : (
                                                filteredBooks.slice(0, 5).map((book) => (
                                                    <button
                                                        key={book.id}
                                                        onClick={() => handleBookSelect(book)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-lime-50 transition-all text-left group"
                                                    >
                                                        <div className={`w-10 h-12 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>
                                                            {book.cover ? (
                                                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <BookOpen size={16} className={book.iconColor} />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-sm text-slate-800 truncate group-hover:text-lime-700">{book.title}</h4>
                                                            <p className="text-xs text-slate-500 truncate">{book.author} • {book.classLevel}</p>
                                                        </div>
                                                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                            {book.chapters?.length || 0} Ch
                                                        </span>
                                                    </button>
                                                ))
                                            )}
                                            {filteredBooks.length > 5 && (
                                                <button
                                                    onClick={() => setIsBookPickerOpen(true)}
                                                    className="w-full py-2 text-xs font-bold text-lime-600 hover:bg-lime-50 transition-all"
                                                >
                                                    View all {filteredBooks.length} books →
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Selected Book - Compact */}
                                    <div className="flex items-center gap-3 bg-lime-50 rounded-xl p-3 border border-lime-200">
                                        <div className={`w-12 h-14 rounded-lg ${selectedBook.cover ? '' : selectedBook.color} flex items-center justify-center overflow-hidden shadow-sm shrink-0`}>
                                            {selectedBook.cover ? (
                                                <img src={selectedBook.cover} alt={selectedBook.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen size={20} className={selectedBook.iconColor} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-slate-800 truncate">{selectedBook.title}</h3>
                                            <p className="text-xs text-slate-500 truncate">by {selectedBook.author}</p>
                                            <div className="flex gap-1.5 mt-1 flex-wrap">
                                                <span className="text-[10px] font-bold bg-lime-100 text-lime-700 px-1.5 py-0.5 rounded">
                                                    {selectedBook.subject}
                                                </span>
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                    {selectedBook.classLevel}
                                                </span>
                                                <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">
                                                    {selectedBook.chapters?.length || 0} Chapters
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={clearBookSelection}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Chapter Selection - Compact */}
                                    {selectedBook.chapters && selectedBook.chapters.length > 0 && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                                                <Layers size={12} />
                                                Select Chapters
                                                {selectedChapters.size > 0 && (
                                                    <span className="text-lime-600 ml-2">({selectedChapters.size} selected)</span>
                                                )}
                                            </label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedBook.chapters.map((chapter, idx) => (
                                                    <button
                                                        key={chapter.id}
                                                        onClick={() => toggleChapter(chapter.id)}
                                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                                                            ${selectedChapters.has(chapter.id)
                                                                ? 'bg-lime-500 text-white shadow-sm'
                                                                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                                            }`}
                                                    >
                                                        <span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center
                                                            ${selectedChapters.has(chapter.id) ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                            {idx + 1}
                                                        </span>
                                                        <span className="max-w-[100px] truncate">{chapter.title}</span>
                                                        {selectedChapters.has(chapter.id) && <Check size={10} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Options Grid - Compact */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        <CustomDropdown
                            label="Grade"
                            value={grade}
                            onChange={setGrade}
                            options={gradeOptions}
                            placeholder="Select..."
                        />
                        <CustomDropdown
                            label="Duration"
                            value={duration}
                            onChange={setDuration}
                            options={durationOptions}
                            placeholder="Per session..."
                        />
                        <CustomDropdown
                            label="Days"
                            value={days}
                            onChange={setDays}
                            options={daysOptions}
                            placeholder="Total..."
                        />
                        <CustomDropdown
                            label="Language"
                            value={language}
                            onChange={setLanguage}
                            options={languageOptions}
                            placeholder="Select..."
                        />
                        <CustomDropdown
                            label="Format"
                            value={format}
                            onChange={setFormat}
                            options={formatOptions}
                            placeholder="Select..."
                        />
                    </div>

                    {/* Learning Objectives - Compact */}
                    <div className="mt-5">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">
                            Learning Objectives (Optional)
                        </label>
                        <textarea
                            value={objectives}
                            onChange={(e) => setObjectives(e.target.value)}
                            placeholder="Define specific goals for this lesson..."
                            className="w-full bg-transparent border-0 border-b-2 border-slate-200 
                                px-0 py-2 text-sm font-medium text-slate-800 
                                placeholder:text-slate-400 
                                focus:border-lime-500 focus:ring-0 focus:outline-none
                                transition-all resize-none h-[50px]"
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGenerate}
                            className="group px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-full flex items-center justify-center gap-2 shadow-lg shadow-lime-300 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400 hover:scale-105"
                        >
                            <Sparkles size={18} className="group-hover:animate-pulse" />
                            <span className="font-bold text-sm">Generate Lesson Plan</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Book Picker Modal */}
            {isBookPickerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[70vh] overflow-hidden animate-fadeIn">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Select Book</h3>
                                <p className="text-xs text-slate-500">{books.length} books in library</p>
                            </div>
                            <button
                                onClick={() => setIsBookPickerOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={bookSearchQuery}
                                    onChange={(e) => setBookSearchQuery(e.target.value)}
                                    placeholder="Search books..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Books List */}
                        <div className="overflow-y-auto max-h-[400px]">
                            {filteredBooks.length === 0 ? (
                                <div className="text-center py-10">
                                    <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-500 font-medium">No books found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredBooks.map((book) => (
                                        <button
                                            key={book.id}
                                            onClick={() => handleBookSelect(book)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-lime-50 transition-all text-left group"
                                        >
                                            <div className={`w-10 h-12 rounded-lg ${book.cover ? '' : book.color} flex items-center justify-center overflow-hidden shadow-sm`}>
                                                {book.cover ? (
                                                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen size={16} className={book.iconColor} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 truncate group-hover:text-lime-700">{book.title}</h4>
                                                <p className="text-xs text-slate-500 truncate">{book.author}</p>
                                                <div className="flex gap-1 mt-1">
                                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{book.subject}</span>
                                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{book.classLevel}</span>
                                                    <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">{book.chapters?.length || 0} Ch</span>
                                                </div>
                                            </div>
                                            <ChevronDown size={16} className="text-slate-300 -rotate-90 group-hover:text-lime-500" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Animation styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default LessonPlannerView;
