'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, BookOpen, ChevronDown, Check } from 'lucide-react';

type PlanMode = 'topic' | 'book';

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

    // Close dropdown when clicking outside
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
            <label className="block text-sm font-bold text-slate-700 mb-2">
                {label}
            </label>

            {/* Dropdown Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-transparent border-0 border-b-2 
                    ${isOpen ? 'border-lime-500' : 'border-slate-200'} 
                    px-0 py-3 text-sm font-medium transition-all cursor-pointer text-left
                    hover:border-lime-400`}
            >
                <span className={value ? 'text-slate-800' : 'text-slate-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 max-h-[240px] overflow-y-auto animate-fadeIn">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all flex items-center justify-between
                                ${value === option
                                    ? 'bg-lime-50 text-lime-700'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <span>{option}</span>
                            {value === option && (
                                <Check size={14} className="text-lime-600" />
                            )}
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

    const handleGenerate = () => {
        console.log('Generating lesson plan...', { mode, topic, grade, duration, days, language, format, objectives });
    };

    const suggestions = ['Quantum Physics', 'Civil War', 'Photosynthesis'];

    // Individual grades 1-12
    const gradeOptions = [
        'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
        'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
    ];

    // Duration options with mins and hours
    const durationOptions = [
        '15 mins', '20 mins', '30 mins', '45 mins',
        '1 hour', '1.5 hours', '2 hours', '3 hours'
    ];

    // Days options
    const daysOptions = [
        '1 day', '2 days', '3 days', '5 days', '7 days',
        '10 days', '14 days', '30 days'
    ];

    // Indian and global languages
    const languageOptions = [
        'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil',
        'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu',
        'Assamese', 'Sanskrit', 'Konkani', 'Manipuri', 'Nepali',
        'Spanish', 'French', 'German', 'Arabic', 'Chinese', 'Japanese'
    ];

    // Indian context lesson formats
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

    return (
        <div className="h-full w-full flex flex-col relative bg-white">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-lime-200 rounded-full blur-[80px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-lime-100 rounded-full blur-[80px] opacity-30" />
                <div className="absolute top-[20%] right-[15%] w-[250px] h-[250px] bg-slate-100 rounded-full blur-[80px] opacity-30" />
            </div>

            {/* Header with Title */}
            <div className="relative z-10 px-8 py-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-200">
                    <BookOpen size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Lesson Planner</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-8 pb-8">
                {/* Mode Toggle & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center p-1 bg-slate-100/80 border border-slate-200/50 rounded-full mb-5">
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
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        What are we teaching today?
                    </h2>
                </div>

                {/* Main Glass Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl shadow-lime-900/5 w-full max-w-4xl">
                    {/* Topic Input - Only bottom border */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={mode === 'topic' ? "Enter your topic here..." : "Enter book title here..."}
                            className="w-full bg-transparent border-0 border-b-2 border-slate-200 
                                focus:border-lime-500 focus:ring-0 focus:outline-none
                                text-2xl md:text-3xl font-medium px-0 py-4 
                                placeholder:text-slate-300 transition-all text-center text-slate-800"
                        />
                        <div className="mt-3 flex flex-wrap justify-center gap-3 items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Suggestions:</span>
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

                    {/* Options Grid - Custom Dropdowns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                        <CustomDropdown
                            label="Grade"
                            value={grade}
                            onChange={setGrade}
                            options={gradeOptions}
                            placeholder="Select grade..."
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
                            placeholder="Total days..."
                        />
                        <CustomDropdown
                            label="Language"
                            value={language}
                            onChange={setLanguage}
                            options={languageOptions}
                            placeholder="Select language..."
                        />
                        <CustomDropdown
                            label="Lesson Format"
                            value={format}
                            onChange={setFormat}
                            options={formatOptions}
                            placeholder="Select format..."
                        />
                    </div>

                    {/* Learning Objectives - Only bottom border */}
                    <div className="mt-8">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Learning Objectives (Optional)
                        </label>
                        <textarea
                            value={objectives}
                            onChange={(e) => setObjectives(e.target.value)}
                            placeholder="Define specific goals or context for this lesson..."
                            className="w-full bg-transparent border-0 border-b-2 border-slate-200 
                                px-0 py-3 text-sm font-medium text-slate-800 
                                placeholder:text-slate-400 
                                focus:border-lime-500 focus:ring-0 focus:outline-none
                                transition-all resize-none min-h-[60px]"
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleGenerate}
                            className="group px-8 py-4 bg-lime-500 hover:bg-lime-600 text-white rounded-full flex items-center justify-center gap-3 shadow-lg shadow-lime-300 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400 hover:scale-105"
                        >
                            <Sparkles size={20} className="group-hover:animate-pulse" />
                            <span className="font-bold text-base">Generate Lesson Plan</span>
                        </button>
                    </div>
                </div>
            </div>

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
