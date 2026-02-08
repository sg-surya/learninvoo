'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Sparkles, Copy, RefreshCw, Wand2, Download, Send, Upload,
    FileText, Image as ImageIcon, Play, CheckCircle, BookOpen, Layers,
    Globe, History, Languages, ScanLine, FileType, CheckSquare, Maximize2
} from 'lucide-react';
import Link from 'next/link';

// Mock Books Data for 'Book' mode
const MOCK_BOOKS = [
    { id: 'b1', title: 'Science Explorer - Grade 9', grade: 'Grade 9', subject: 'Science' },
    { id: 'b2', title: 'History Alive! - Grade 10', grade: 'Grade 10', subject: 'History' },
    { id: 'b3', title: 'Mathematics Principles - Grade 11', grade: 'Grade 11', subject: 'Mathematics' },
    { id: 'b4', title: 'Literature Common Core - Grade 12', grade: 'Grade 12', subject: 'Literature' },
    { id: 'b5', title: 'Physics Fundamentals - Grade 11', grade: 'Grade 11', subject: 'Physics' },
];

interface ToolInput {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'file' | 'book-select' | 'checkbox';
    label: string;
    placeholder?: string;
    options?: string[];
    readOnly?: boolean;
    defaultValue?: string;
}

interface ToolConfigItem {
    title: string;
    desc: string;
    type: 'generation' | 'digitizer' | 'simulation';
    hasSourceToggle?: boolean;
    inputs: ToolInput[] | { topic: ToolInput[]; book: ToolInput[] };
    dummyOutput: any;
}

// Tool Configuration Mapping
const TOOLS_CONFIG: Record<string, ToolConfigItem> = {
    'lesson-planner': {
        title: 'Lesson Planner',
        desc: 'Generate comprehensive weekly lesson plans tailored to your curriculum.',
        type: 'generation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., Photosynthesis' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6-8', 'High School'] },
                { id: 'duration', type: 'text', label: 'Duration', placeholder: 'e.g., 45 mins' },
                { id: 'notes', type: 'textarea', label: 'Specific Objectives / Notes', placeholder: 'Any specific standards or activities to include...' }
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Chapter 4' },
                { id: 'grade', type: 'text', label: 'Grade Level (Auto-fetched)', readOnly: true, placeholder: 'Select a book first...' },
                { id: 'duration', type: 'text', label: 'Duration', placeholder: 'e.g., 45 mins' }
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `## Weekly Lesson Plan: Photosynthesis\n\n**Grade Level:** 5th Grade\n**Subject:** Science\n\n### Monday: Introduction to Photosynthesis\n- **Objective:** Students will define photosynthesis and identify the necessary components (sunlight, water, carbon dioxide).\n- **Activity:** "Plant needs" interactive discussion and diagram labeling.\n\n### Tuesday: The Process\n- **Objective:** detailed breakdown of the chemical process (simplified).\n- **Activity:** Leaf diagram coloring sheet showing inputs and outputs.\n\n### Wednesday: Experiment Day\n- **Objective:** Observe photosynthesis in action.\n- **Activity:** Leaf in water experiment to see oxygen bubbles.\n\n### Thursday: Role of Chlorophyll\n- **Objective:** Understand why plants are green.\n- **Activity:** Chromatography experiment with spinach leaves.\n\n### Friday: Review and Quiz\n- **Objective:** Assess understanding.\n- **Activity:** Group presentation and short quiz.`
        }
    },
    'quiz-exam-generator': {
        title: 'Quiz & Exam Generator',
        desc: 'Create engaging quizzes and exams tailored to your curriculum.',
        type: 'generation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., World War II' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Grade 6-8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] },
                { id: 'difficulty', type: 'select', label: 'Difficulty', options: ['Easy', 'Medium', 'Hard'] },
                { id: 'numQuestions', type: 'number', label: 'Number of Questions', placeholder: '10' },
                { id: 'questionTypes', type: 'select', label: 'Types of Questions', options: ['Multiple Choice', 'True/False', 'Short Answer', 'Mixed'] },
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Chapter 4' },
                { id: 'grade', type: 'text', label: 'Grade Level (Auto-fetched)', readOnly: true, placeholder: 'Select a book first...' },
                { id: 'difficulty', type: 'select', label: 'Difficulty', options: ['Easy', 'Medium', 'Hard'] },
                { id: 'numQuestions', type: 'number', label: 'Number of Questions', placeholder: '10' },
                { id: 'questionTypes', type: 'select', label: 'Types of Questions', options: ['Multiple Choice', 'True/False', 'Short Answer', 'Mixed'] },
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `## Quiz: World War II (Medium Difficulty)\n\n**1. Which event is generally considered the start of World War II?**\n    a) Attack on Pearl Harbor\n    b) Invasion of Poland\n    c) Battle of Britain\n    d) D-Day\n\n**2. Who was the Prime Minister of the United Kingdom for most of WWII?**\n    a) Neville Chamberlain\n    b) Clement Attlee\n    c) Winston Churchill\n    d) Anthony Eden\n\n**3. In which year did the war end in Europe?**\n    a) 1943\n    b) 1944\n    c) 1945\n    d) 1946`
        }
    },
    'visual-generator': {
        title: 'Visuals Generator',
        desc: 'Create simple drawings, charts, or diagrams for your lessons.',
        type: 'generation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., Solar System' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Elementary', 'Middle School', 'High School'] },
                { id: 'details', type: 'textarea', label: 'Detailed Description', placeholder: 'Describe the image you want to generate...' }
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Chapter 4' },
                { id: 'topics', type: 'text', label: 'Specific Topics', placeholder: 'e.g., The planets' },
                { id: 'grade', type: 'text', label: 'Grade Level (Auto-fetched)', readOnly: true, placeholder: 'Select a book first...' },
                { id: 'details', type: 'textarea', label: 'Detailed Description', placeholder: 'Any specific visual requirements...' }
            ]
        },
        dummyOutput: {
            type: 'image',
            content: 'https://picsum.photos/seed/visual-gen/800/600',
            alt: 'Generated Visual'
        }
    },
    'story-generator': {
        title: 'Story Generator',
        desc: 'Generate creative stories for any topic, moral, or character.',
        type: 'generation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., Friendship' },
                { id: 'characters', type: 'text', label: 'Characters', placeholder: 'e.g., A brave squirrel named Nutty' },
                { id: 'environment', type: 'text', label: 'Environment/Setting', placeholder: 'e.g., The Whispering Woods' },
                { id: 'details', type: 'textarea', label: 'Additional Details', placeholder: 'Any specific plot points...' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Grade 1-3', 'Grade 4-6', 'Grade 7+'] },
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Chapter 4' },
                { id: 'topics', type: 'text', label: 'Specific Topics', placeholder: 'e.g., Main theme' },
                { id: 'grade', type: 'text', label: 'Grade Level (Auto-fetched)', readOnly: true, placeholder: 'Select a book first...' },
                { id: 'details', type: 'textarea', label: 'Additional Details', placeholder: 'Any specific plot points...' },
                { id: 'characters', type: 'text', label: 'Characters', placeholder: 'e.g., Use book characters' },
                { id: 'environment', type: 'text', label: 'Environment/Setting', placeholder: 'e.g., Set in book world' },
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `**Title: The Squirrel Who Shared the Sun**\n\nOnce upon a time, in the heart of the Whispering Woods, lived a brave squirrel named Nutty. Unlike other squirrels who hoarded their nuts for winter, Nutty loved to explore the high canopy.\n\nOne day, he found a magical glowing acorn that radiated warmth like the sun. "This could keep everyone warm during the blizzard!" he thought. But a greedy hawk named Talon swooped down. "Give me the sun-nut!" screeched Talon.\n\nNutty, remembering his grandmother's lesson about sharing, said, "We can share its warmth, Talon. It's too heavy for just one of us." Talon successfully paused...`
        }
    },
    'hyper-local-content': {
        title: 'Hyper Local Content',
        desc: 'Create content tailored to your students\' specific region, language, and culture.',
        type: 'generation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., Water Conservation' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Grade 1-5', 'Grade 6-8', 'Grade 9-12'] },
                { id: 'region', type: 'text', label: 'Region / Location', placeholder: 'e.g., Mumbai, India' },
                { id: 'language', type: 'select', label: 'Language Preference', options: ['English', 'Hindi', 'Spanish', 'French', 'Local Dialect'] },
                { id: 'context', type: 'textarea', label: 'Cultural Context', placeholder: 'Local festivals, landmarks, or common issues...' }
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Chapter 4' },
                { id: 'topics', type: 'text', label: 'Specific Topics', placeholder: 'e.g., Main theme' },
                { id: 'grade', type: 'text', label: 'Grade Level (Auto-fetched)', readOnly: true, placeholder: 'Select a book first...' },
                { id: 'region', type: 'text', label: 'Region / Location', placeholder: 'e.g., Mumbai, India' },
                { id: 'language', type: 'select', label: 'Language Preference', options: ['English', 'Hindi', 'Spanish', 'French', 'Local Dialect'] },
                { id: 'context', type: 'textarea', label: 'Cultural Context', placeholder: 'Local festivals, landmarks, or common issues...' }
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `## Topic: Water Conservation in Mumbai\n\n**Context:** Integrating local challenges with science curriculum.\n\n### Discussion Points:\n1. **The Monsoon Season:** Discuss how Mumbai relies on lakes like Vihar and Tulsi significantly during the monsoon. Why is water conservation still important despite heavy rains?\n2. **Local Case Study:** Analyze the water usage in a typical Mumbai housing society vs. a rural village in Maharashtra.\n3. **Activity:** Students calculate their family's water usage and propose local solutions (e.g., rainwater harvesting in buildings).\n\n### Local Relevance:\n- Mention the Mithi River rehabilitation project.\n- Discuss the history of the Victorian-era pipeline system.`
        }
    },
    'paper-digitizer': {
        title: 'Paper Digitizer',
        desc: 'Digitize handwritten notes, documents, and exam papers instantly using OCR.',
        type: 'digitizer',
        hasSourceToggle: false,
        inputs: [
            { id: 'file', type: 'file', label: 'Upload Paper/Document', placeholder: 'Select a file...' },
            { id: 'docType', type: 'select', label: 'Document Type', options: ['Notes', 'Assignment', 'Worksheet', 'Exam Paper', 'Other'] },
            { id: 'grade', type: 'select', label: 'Grade / Class', options: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University'] },
            { id: 'subject', type: 'select', label: 'Subject', options: ['Mathematics', 'Science', 'History', 'English', 'Other'] },
            { id: 'language', type: 'select', label: 'Language (for OCR)', options: ['English', 'Hindi', 'Spanish', 'French', 'Mixed'] },
            { id: 'enhancement', type: 'checkbox', label: 'Quality Enhancement (Auto-correct & Recognition)' }
        ],
        dummyOutput: {
            type: 'ocr-preview',
            content: 'Digitized content will appear here after processing...',
            scannedText: "## Chapter 1: The Cell\n\nThe cell is the basic structural and functional unit of life forms. Every cell consists of a cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids.\n\n### Key Concepts:\n- **Prokaryotes vs Eukaryotes**: Differences in nucleus structure.\n- **Organelles**: Mitochondria, Ribosomes, etc.\n\n[Diagram: Animal Cell Structure detected]\n\n### Equation:\n$$ E = mc^2 $$"
        }
    }
};

// State interface for form data
interface FormDataInfo {
    [key: string]: string | boolean;
}

const ToolPage = () => {
    const params = useParams();
    const toolId = params.toolId as string;
    const config = TOOLS_CONFIG[toolId];

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [sourceMode, setSourceMode] = useState<'topic' | 'book'>('topic');
    const [formData, setFormData] = useState<FormDataInfo>({});

    // Reset when tool changes
    useEffect(() => {
        setSourceMode('topic');
        setFormData({});
        setGeneratedContent(null);
    }, [toolId]);

    // Handle form changes
    const handleInputChange = (id: string, value: string | boolean) => {
        setFormData(prev => {
            const newData = { ...prev, [id]: value };

            // Auto-fetch logic for Books
            if (id === 'book' && typeof value === 'string' && sourceMode === 'book') {
                const book = MOCK_BOOKS.find(b => b.title === value);
                if (book) {
                    newData['grade'] = book.grade; // Auto-fill grade
                }
            }
            return newData;
        });
    };

    // Determine current inputs based on mode
    const currentInputs = React.useMemo(() => {
        if (!config) return [];
        if (config.hasSourceToggle && !Array.isArray(config.inputs)) {
            return config.inputs[sourceMode];
        }
        return Array.isArray(config.inputs) ? config.inputs : [];
    }, [config, sourceMode]);

    // If config not found, show error or generic
    if (!config) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tool Not Found</h2>
                    <p className="text-gray-500 mb-6">The tool you are looking for does not exist or is under maintenance.</p>
                    <Link href="/" className="bg-lime-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-lime-700 transition">
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    const handleGenerate = () => {
        setIsGenerating(true);
        setGeneratedContent(null);
        // Simulate AI delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedContent(config.dummyOutput);
        }, 2000);
    };

    return (
        <div className="min-h-full bg-[#f8f9fa] flex flex-col font-sans">

            {/* Sticky Header - Glassmorphism */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm shrink-0">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Link href="/tools" className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-lime-50 text-gray-500 hover:text-lime-600 rounded-full transition-all border border-gray-200 hover:border-lime-200 group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                                {config.title}
                                <span className="px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider border border-lime-200">
                                    {config.type}
                                </span>
                            </h1>
                            <p className="text-xs font-medium text-gray-400 mt-0.5">{config.desc}</p>
                        </div>
                    </div>

                    {/* Quick Stats or Actions for Header */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-500">
                            <History size={14} />
                            Recent: 3
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Split View */}
            <main className="flex-1 flex flex-col lg:flex-row w-full gap-6 p-6 max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Left Pane: Configuration */}
                <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col shrink-0 gap-6">

                    {/* Source Toggle (if applicable) */}
                    {config.hasSourceToggle && (
                        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex gap-2">
                            <button
                                onClick={() => setSourceMode('topic')}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${sourceMode === 'topic'
                                        ? 'bg-lime-50 text-lime-700 shadow-sm ring-1 ring-lime-200'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Sparkles size={16} />
                                By Topic
                            </button>
                            <button
                                onClick={() => setSourceMode('book')}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${sourceMode === 'book'
                                        ? 'bg-lime-50 text-lime-700 shadow-sm ring-1 ring-lime-200'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <BookOpen size={16} />
                                From Book
                            </button>
                        </div>
                    )}

                    {/* Input Card */}
                    <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-600">
                                <ScanLine size={16} />
                            </div>
                            <h2 className="font-bold text-gray-800">Configuration</h2>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 max-h-[calc(100vh-300px)] lg:max-h-none">
                            {currentInputs.map((input: ToolInput, idx: number) => (
                                <div key={idx} className="space-y-2 group">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1 group-focus-within:text-lime-700 transition-colors">
                                        {input.label}
                                    </label>

                                    {input.type === 'textarea' ? (
                                        <textarea
                                            className="w-full bg-gray-100 border-transparent hover:border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 focus:bg-white transition-all min-h-[140px] resize-none text-gray-900 placeholder-gray-500 font-medium"
                                            placeholder={input.placeholder}
                                            value={formData[input.id] as string || ''}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        />
                                    ) : input.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                className="w-full bg-gray-100 border-transparent hover:border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 focus:bg-white appearance-none transition-all font-medium text-gray-900 cursor-pointer icon-dark"
                                                value={formData[input.id] as string || ''}
                                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                            >
                                                <option value="" disabled>Select an option</option>
                                                {input.options?.map((opt, i) => (
                                                    <option key={i} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1" /></svg>
                                            </div>
                                        </div>
                                    ) : input.type === 'book-select' ? (
                                        <div className="relative">
                                            <select
                                                className="w-full bg-gray-100 border-transparent hover:border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 focus:bg-white appearance-none transition-all font-medium text-gray-900 cursor-pointer"
                                                value={formData[input.id] as string || ''}
                                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                            >
                                                <option value="" disabled>Select your book source</option>
                                                {MOCK_BOOKS.map((book) => (
                                                    <option key={book.id} value={book.title}>{book.title}</option>
                                                ))}
                                            </select>
                                            <BookOpen size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                                        </div>
                                    ) : input.type === 'file' ? (
                                        <div className="border-2 border-dashed border-gray-300 hover:border-lime-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white hover:bg-lime-50/10 group/file">
                                            <div className="w-14 h-14 bg-gray-50 shadow-sm text-lime-600 rounded-full flex items-center justify-center mb-3 group-hover/file:scale-110 transition-transform border border-gray-200">
                                                <Upload size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-gray-800">Click to upload document</p>
                                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG supported</p>
                                        </div>
                                    ) : input.type === 'checkbox' ? (
                                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transaction-all" onClick={() => handleInputChange(input.id, !formData[input.id])}>
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${formData[input.id] ? 'bg-lime-500 border-lime-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                {formData[input.id] && <CheckSquare size={14} />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 select-none">{input.label}</span>
                                        </div>
                                    ) : (
                                        <input
                                            type={input.type}
                                            className={`w-full bg-gray-100 border-transparent hover:border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 font-medium ${input.readOnly ? 'opacity-70 cursor-not-allowed select-none bg-gray-200' : ''}`}
                                            placeholder={input.placeholder}
                                            value={formData[input.id] as string || ''}
                                            readOnly={input.readOnly}
                                            onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-6 pt-4 bg-white border-t border-gray-100">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className={`w-full bg-gradient-to-r from-lime-600 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-lime-200 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-80 disabled:cursor-not-allowed`}
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} className="fill-white/20" />
                                        <span>Generate Result</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Output / Preview */}
                <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col min-h-[600px] relative overflow-hidden">
                    {!generatedContent && !isGenerating ? (
                        // REDESIGNED EMPTY STATE
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-white animate-in fade-in zoom-in duration-500">
                            <div className="relative mb-8 group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-lime-200 to-emerald-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                <div className="w-40 h-40 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-xl flex items-center justify-center relative transform group-hover:scale-105 transition-transform duration-500 border border-white/60">
                                    <Sparkles size={64} className="text-lime-500 drop-shadow-sm" />

                                    {/* Floating Decor Items */}
                                    <div className="absolute -right-6 top-6 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce delay-700">
                                        <Wand2 size={24} className="text-purple-400" />
                                    </div>
                                    <div className="absolute -left-4 bottom-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce delay-1000">
                                        <FileText size={20} className="text-sky-400" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Ready to Create Magic?</h2>
                            <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed mb-8">
                                Configure the settings on the left panel to generate <span className="text-lime-600 font-bold">{config.title}</span> content instantly.
                            </p>

                            <div className="flex gap-3">
                                <div className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
                                    AI Powered
                                </div>
                                <div className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
                                    Instant Drafts
                                </div>
                                <div className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-400 border border-gray-100">
                                    Fully Editable
                                </div>
                            </div>
                        </div>
                    ) : isGenerating ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 transition-all">
                            <div className="relative w-28 h-28 mb-8">
                                <span className="absolute inset-0 rounded-full border-4 border-gray-100"></span>
                                <span className="absolute inset-0 rounded-full border-4 border-lime-500 border-t-transparent animate-spin"></span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Wand2 size={32} className="text-lime-600 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 animate-pulse">Designing your content...</h3>
                            <p className="text-gray-500 text-base mt-2 font-medium">Please wait while our AI works its magic</p>
                        </div>
                    ) : (
                        // RESULT VIEW
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {/* Result Header */}
                            <div className="p-4 px-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight">Generation Complete</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ready for review</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shadow-sm">
                                        <Copy size={16} />
                                        Copy
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-lime-50 hover:bg-lime-100 hover:text-lime-800 border border-lime-200 text-lime-700 rounded-xl text-xs font-bold transition-all shadow-sm">
                                        <Download size={16} />
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Result Content - IMPROVED MARKDOWN STYLING */}
                            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white">
                                {generatedContent.type === 'image' ? (
                                    <div className="flex flex-col items-center h-full justify-center">
                                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-gray-100 w-full max-w-2xl group">
                                            <img src={generatedContent.content} alt={generatedContent.alt} className="w-full h-auto object-contain max-h-[600px]" />
                                            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                                                AI Generated
                                            </div>
                                        </div>
                                    </div>
                                ) : generatedContent.type === 'ocr-preview' ? (
                                    <div className="max-w-4xl mx-auto w-full">
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 flex gap-4 text-amber-900 shadow-sm">
                                            <div className="p-2 bg-amber-100 rounded-lg h-fit">
                                                <FileType size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">Digitization Successful</h4>
                                                <p className="text-sm opacity-90 leading-relaxed">This document has been digitized and saved to your library. You can now edit, search, or copy this text.</p>
                                            </div>
                                        </div>
                                        <div className="bg-white shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl p-10 min-h-[600px]">
                                            <div className="prose prose-slate max-w-none font-serif">
                                                <div className="whitespace-pre-wrap leading-loose text-lg text-gray-800">{generatedContent.scannedText}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-4xl mx-auto w-full bg-white min-h-[600px] shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl p-10 sm:p-14">
                                        <div className="prose prose-lg prose-lime max-w-none">
                                            <div className="whitespace-pre-wrap font-medium text-gray-600 leading-8 font-sans">
                                                {generatedContent.content.split('\n').map((line: string, i: number) => (
                                                    <React.Fragment key={i}>
                                                        {line.startsWith('# ') ?
                                                            <div className="mb-8 pb-4 border-b-2 border-lime-100">
                                                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{line.replace('# ', '')}</h1>
                                                            </div>
                                                            : line.startsWith('## ') ?
                                                                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 flex items-center gap-2">
                                                                    <div className="w-2 h-8 bg-lime-500 rounded-full"></div>
                                                                    {line.replace('## ', '')}
                                                                </h2>
                                                                : line.startsWith('### ') ?
                                                                    <h3 className="text-lg font-bold text-lime-700 mt-6 mb-2 uppercase tracking-wide flex items-center gap-2">
                                                                        <Maximize2 size={12} />
                                                                        {line.replace('### ', '')}
                                                                    </h3>
                                                                    : line.startsWith('- ') ?
                                                                        <li className="ml-6 list-disc text-gray-700 mb-2 pl-2 marker:text-lime-500">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
                                                                        : line.startsWith('|') ?
                                                                            <div className="overflow-x-auto my-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                                                                                <div className="p-4 min-w-full font-mono text-xs leading-relaxed whitespace-pre">{line}</div>
                                                                            </div>
                                                                            :
                                                                            <p className="mb-4 text-gray-600" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ToolPage;
