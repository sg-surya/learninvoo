'use client';

import React, { useState } from 'react';
import { Sparkles, BookOpen, ChevronDown } from 'lucide-react';

type PlanMode = 'topic' | 'book';

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

    // Custom Select Component
    const CustomSelect = ({
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
    }) => (
        <div className="relative">
            <label className="block text-sm font-bold text-slate-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-transparent border-0 border-b-2 border-slate-200 
                        px-0 py-3 pr-8 text-sm font-medium text-slate-800 
                        focus:border-lime-500 focus:ring-0 focus:outline-none
                        transition-all cursor-pointer"
                >
                    <option value="" className="text-slate-400">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option} value={option} className="text-slate-800 py-2">{option}</option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
            </div>
        </div>
    );

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

                    {/* Options Grid - All separate fields with underline style */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                        <CustomSelect
                            label="Grade"
                            value={grade}
                            onChange={setGrade}
                            options={gradeOptions}
                            placeholder="Select grade..."
                        />
                        <CustomSelect
                            label="Duration"
                            value={duration}
                            onChange={setDuration}
                            options={durationOptions}
                            placeholder="Per session..."
                        />
                        <CustomSelect
                            label="Days"
                            value={days}
                            onChange={setDays}
                            options={daysOptions}
                            placeholder="Total days..."
                        />
                        <CustomSelect
                            label="Language"
                            value={language}
                            onChange={setLanguage}
                            options={languageOptions}
                            placeholder="Select language..."
                        />
                        <CustomSelect
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

            {/* Custom styles for select dropdown */}
            <style jsx global>{`
                select option {
                    padding: 12px 16px;
                    background: white;
                    color: #1e293b;
                }
                select option:hover {
                    background: #f0fdf4;
                }
                select:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}</style>
        </div>
    );
};

export default LessonPlannerView;
