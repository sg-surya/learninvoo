'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Sparkles, Copy, RefreshCw, Wand2, Download, Send, Upload,
    FileText, Image as ImageIcon, Play, CheckCircle, BookOpen, Layers,
    Globe, History, Languages, ScanLine, FileType, CheckSquare, Maximize2,
    Save, FolderOpen, Search, Plus
} from 'lucide-react';
import Link from 'next/link';
import { saveGeneratedContent, generateId, GeneratedContent } from '@/lib/storage';
import { generateLesson, generateQuiz, generateStory } from '@/lib/api';



interface ToolInput {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'file' | 'book-select' | 'checkbox' | 'duration-preset';
    label: string;
    placeholder?: string;
    options?: string[];
    readOnly?: boolean;
    defaultValue?: string;
    icon?: string;
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
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., Photosynthesis', icon: 'sparkles' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6-8', 'High School'], icon: 'users' },
                { id: 'lessonType', type: 'select', label: 'Lesson Type', options: ['Introduction', 'Deep Dive', 'Revision', 'Lab/Practical', 'Assessment', 'Project Based'], icon: 'layers' },
                { id: 'duration', type: 'duration-preset', label: 'Duration', options: ['30 mins', '45 mins', '60 mins', '90 mins', '2 hours'], icon: 'clock' },
                { id: 'objectives', type: 'textarea', label: 'Learning Objectives', placeholder: 'What should students learn by the end?', icon: 'target' },
                { id: 'notes', type: 'textarea', label: 'Additional Notes', placeholder: 'Any specific standards, activities, or resources to include...', icon: 'file-text' }
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...', icon: 'book' },
                { id: 'lessonType', type: 'select', label: 'Lesson Type', options: ['Introduction', 'Deep Dive', 'Revision', 'Lab/Practical', 'Assessment', 'Project Based'], icon: 'layers' },
                { id: 'duration', type: 'duration-preset', label: 'Duration', options: ['30 mins', '45 mins', '60 mins', '90 mins', '2 hours'], icon: 'clock' },
                { id: 'objectives', type: 'textarea', label: 'Learning Objectives', placeholder: 'What should students learn by the end?', icon: 'target' }
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `## Weekly Lesson Plan: Photosynthesis\n\n**Grade Level:** 5th Grade\n**Subject:** Science\n**Duration:** 45 minutes per session\n\n---\n\n### 📚 Learning Objectives\n- Define photosynthesis and identify key components\n- Explain the role of sunlight, water, and CO₂\n- Observe and document the process\n\n---\n\n### 📅 Day 1: Introduction to Photosynthesis\n**Duration:** 45 mins\n\n| Time | Activity | Resources |\n|------|----------|-----------|\n| 0-10 min | Hook: Show plant time-lapse video | Projector |\n| 10-25 min | Interactive lecture with diagram | Whiteboard |\n| 25-40 min | Pair-share: "What do plants need?" | Worksheets |\n| 40-45 min | Exit ticket | Index cards |\n\n**Assessment:** Verbal check-in, Exit ticket review\n\n---\n\n### 📅 Day 2: The Process Deep Dive\n**Duration:** 45 mins\n\n| Time | Activity | Resources |\n|------|----------|-----------|\n| 0-5 min | Recap Day 1 | - |\n| 5-20 min | Chemical equation breakdown | Chart |\n| 20-35 min | Leaf diagram coloring | Worksheets |\n| 35-45 min | Group discussion | - |\n\n---\n\n### 📅 Day 3: Experiment Day 🧪\n**Duration:** 45 mins\n\n| Time | Activity | Resources |\n|------|----------|-----------|\n| 0-10 min | Safety briefing | Lab coats |\n| 10-35 min | Leaf in water experiment | Beakers, leaves |\n| 35-45 min | Record observations | Lab notebooks |\n\n---\n\n### ✅ Assessment Rubric\n| Criteria | Excellent (4) | Good (3) | Needs Work (2) |\n|----------|--------------|----------|----------------|\n| Understanding | Clear explanation | Partial | Confused |\n| Participation | Active | Moderate | Minimal |`
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
    },
    'simulation-generator': {
        title: 'Simulation Generator',
        desc: 'Create interactive simulations and virtual experiments for complex concepts.',
        type: 'simulation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Topic', placeholder: 'e.g., Electric Circuits' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Middle School', 'High School', 'University'] },
                { id: 'variables', type: 'text', label: 'Key Variables', placeholder: 'e.g., Voltage, Current, Resistance' },
                { id: 'objectives', type: 'textarea', label: 'Learning Goals', placeholder: 'What should students explore?' }
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Chapter 12' },
                { id: 'grade', type: 'text', label: 'Grade Level (Auto-fetched)', readOnly: true },
                { id: 'objectives', type: 'textarea', label: 'Learning Goals', placeholder: 'What should students explore?' }
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `## Simulation: Ohm's Law Virtual Lab\n\n**Concept:** Exploring the relationship between Voltage, Current, and Resistance.\n\n### 🎮 Interactive Elements:\n- **Slider 1:** Voltage (0V - 12V)\n- **Slider 2:** Resistance (1Ω - 100Ω)\n- **Visual:** A real-time graph showing the linear relationship.\n- **Animation:** Speed of electrons flowing in a wire.\n\n### 📋 Activity Steps:\n1. Set Resistance to a constant 10Ω.\n2. Increase Voltage from 0V to 10V in steps of 2V.\n3. Record the Current readings from the virtual ammeter.\n4. Observe how the brightness of the virtual bulb changes.`
        }
    },
    'rubric-generator': {
        title: 'Rubric Generator',
        desc: 'Design detailed and fair grading rubrics for any assignment or project.',
        type: 'generation',
        hasSourceToggle: true,
        inputs: {
            topic: [
                { id: 'topic', type: 'text', label: 'Assignment Title', placeholder: 'e.g., Science Fair Project' },
                { id: 'grade', type: 'select', label: 'Grade Level', options: ['Elementary', 'Middle School', 'High School'] },
                { id: 'criteria', type: 'textarea', label: 'Key Criteria', placeholder: 'e.g., Research, Presentation, Creativity, Accuracy' },
                { id: 'pts', type: 'select', label: 'Points Scale', options: ['4-Point Scale', '5-Point Scale', 'Percentage'] }
            ],
            book: [
                { id: 'book', type: 'book-select', label: 'Book / Source', placeholder: 'Select a book...' },
                { id: 'chapter', type: 'text', label: 'Chapter / Unit', placeholder: 'e.g., Project at end of unit' },
                { id: 'criteria', type: 'textarea', label: 'Key Criteria', placeholder: 'e.g., Following chapter concepts, accuracy' }
            ]
        },
        dummyOutput: {
            type: 'text',
            content: `## Rubric: Science Fair Project\n\n| Criteria | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |\n|----------|---------------|----------|------------------|-----------------------|\n| **Research** | In-depth research with multiple sources | Good research with 2+ sources | Basic research | Minimal research |\n| **Methodology** | Scientific method followed perfectly | Clear steps followed | Some steps missing | Unclear method |\n| **Presentation** | Exceptional visual & verbal delivery | Clear & organized | Hard to follow at times | Disorganized |\n| **Innovation** | Highly creative approach | Original idea | Standard approach | Lacks originality |`
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
    const [generatedId, setGeneratedId] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sourceMode, setSourceMode] = useState<'topic' | 'book'>('topic');
    const [formData, setFormData] = useState<FormDataInfo>({});

    // Book selection state
    const [books, setBooks] = useState<any[]>([]);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [searchBookQuery, setSearchBookQuery] = useState('');

    // Chapter selection state
    const [selectedBookInModal, setSelectedBookInModal] = useState<any>(null);
    const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());

    // Load books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const api = await import('@/lib/api');
                const backendBooks = await api.getBooks();
                if (backendBooks && backendBooks.length > 0) {
                    setBooks(backendBooks);
                } else {
                    setBooks([]); // Or MOCK_BOOKS if we want fallback, but user said remove mock data
                }
            } catch (error) {
                console.error("Failed to load books:", error);
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);

    // Filter books for modal
    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchBookQuery.toLowerCase()) ||
        b.subject?.toLowerCase().includes(searchBookQuery.toLowerCase())
    );

    // Helper to map toolId to content type
    const getContentType = (toolId: string): GeneratedContent['type'] => {
        const mapping: Record<string, GeneratedContent['type']> = {
            'lesson-planner': 'lesson-plan',
            'quiz-exam-generator': 'quiz',
            'visual-generator': 'visual',
            'story-generator': 'story',
            'hyper-local-content': 'hyper-local',
            'paper-digitizer': 'other',
            'simulation-generator': 'simulation',
            'rubric-generator': 'rubric',
        };
        return mapping[toolId] || 'other';
    };

    // Reset when tool changes
    useEffect(() => {
        setSourceMode('topic');
        setFormData({});
        setGeneratedContent(null);
        setGeneratedId(null);
        setIsSaved(false);
    }, [toolId]);

    // Handle form changes
    const handleInputChange = (id: string, value: string | boolean) => {
        setFormData(prev => {
            const newData = { ...prev, [id]: value };

            // Auto-fetch logic for Books
            if (id === 'book' && typeof value === 'string' && sourceMode === 'book') {
                const book = books.find(b => b.title === value);
                if (book) {
                    // Try to map various grade formats or specific fields
                    newData['grade'] = book.grade || book.level || '';
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

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedContent(null);
        setIsSaved(false);
        setGeneratedId(null);

        try {
            let result: any = null;

            if (toolId === 'lesson-planner') {
                const response = await generateLesson({
                    topic: (formData.topic as string) || 'General',
                    grade: (formData.grade as string) || 'Grade 6',
                    duration: parseInt((formData.duration as string)?.replace(/\D/g, '') || '45'),
                    details: (formData.notes as string) || (formData.objectives as string) || '',
                    bookId: sourceMode === 'book' ? (formData.book as string) : undefined,
                    chapterIds: sourceMode === 'book' ? ((formData.chapters as string)?.split(',') || []) : undefined
                });
                result = { type: 'text', content: response.content };
            } else if (toolId === 'quiz-exam-generator') {
                const response = await generateQuiz({
                    topic: (formData.topic as string) || 'General Knowledge',
                    grade: (formData.grade as string) || 'Grade 6',
                    difficulty: (formData.difficulty as string) || 'Medium',
                    questionCount: parseInt((formData.numQuestions as string) || '5'),
                    type: (formData.questionTypes as string) || 'Multiple Choice'
                });
                result = { type: 'text', content: response.content };
            } else if (toolId === 'story-generator') {
                const response = await generateStory({
                    topic: (formData.topic as string) || 'Friendship',
                    grade: (formData.grade as string) || 'Grade 3',
                    genre: (formData.genre as string) || 'Adventure',
                    length: 'Short',
                    language: 'English'
                });
                result = { type: 'text', content: response.content };
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000));
                result = config.dummyOutput;
            }

            setGeneratedContent(result);
            setGeneratedId(generateId());
        } catch (error) {
            console.error("Generation failed:", error);
            alert("Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveToWorkspace = async () => {
        if (!generatedContent || !generatedId) return;

        setIsSaving(true);
        try {
            const topic = (formData.topic as string) || (formData.book as string) || config.title;
            const chapter = formData.chapter as string;
            const title = chapter ? `${topic} - ${chapter}` : topic;

            const contentToSave = {
                title: title,
                description: config.desc,
                type: getContentType(toolId),
                content_data: typeof generatedContent.content === 'string' ? generatedContent.content : JSON.stringify(generatedContent.content),
                content_type: generatedContent.type,
                tool_id: toolId,
                book_id: sourceMode === 'book' ? (formData.book ? parseInt(formData.book as string) : undefined) : undefined,
            };

            const api = await import('@/lib/api');
            await api.saveContent(contentToSave);

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save to workspace.');
        } finally {
            setIsSaving(false);
        }
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
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-600">
                                    <ScanLine size={16} />
                                </div>
                                <h2 className="font-bold text-gray-800 flex-1">Configuration</h2>
                                {/* Progress Indicator */}
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, (Object.values(formData).filter(v => v && v !== '').length / currentInputs.length) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500">
                                        {Object.values(formData).filter(v => v && v !== '').length}/{currentInputs.length}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Templates - Only for Lesson Planner */}
                            {toolId === 'lesson-planner' && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quick Templates</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: '📚 Introduction', topic: 'Introduction Lesson', lessonType: 'Introduction', duration: '45 mins' },
                                            { label: '🔬 Lab Class', topic: 'Practical Lab Session', lessonType: 'Lab/Practical', duration: '90 mins' },
                                            { label: '📝 Revision', topic: 'Revision Session', lessonType: 'Revision', duration: '45 mins' },
                                            { label: '🎯 Assessment', topic: 'Assessment Class', lessonType: 'Assessment', duration: '60 mins' },
                                        ].map((template, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    handleInputChange('lessonType', template.lessonType);
                                                    handleInputChange('duration', template.duration);
                                                    if (!formData['topic']) {
                                                        handleInputChange('topic', template.topic);
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-lime-300 hover:bg-lime-50 hover:text-lime-700 transition-all shadow-sm"
                                            >
                                                {template.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 max-h-[calc(100vh-350px)] lg:max-h-none">
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
                                            <div
                                                onClick={() => setIsBookModalOpen(true)}
                                                className={`w-full rounded-xl px-4 py-3 text-sm transition-all font-medium cursor-pointer flex items-center gap-3 ${formData['book']
                                                    ? 'bg-gradient-to-r from-lime-50 to-green-50 border-2 border-lime-200 hover:border-lime-300 shadow-sm'
                                                    : 'bg-gray-100 border-2 border-transparent hover:border-gray-200'
                                                    }`}
                                            >
                                                {formData['book'] ? (
                                                    <>
                                                        <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                                            <BookOpen size={18} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-gray-900 font-bold block truncate text-sm">{formData['book'] as string}</span>
                                                            {formData['chapterTitles'] ? (
                                                                <span className="text-xs text-lime-600 mt-0.5 block truncate">
                                                                    📖 {formData['chapterTitles'] as string}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">Click to select chapters</span>
                                                            )}
                                                        </div>
                                                        <div className="bg-lime-100 text-lime-700 text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
                                                            {(formData['chapters'] as string)?.split(',').filter(Boolean).length || 0} CH
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                                            <BookOpen size={18} />
                                                        </div>
                                                        <span className="text-gray-400 flex-1">{input.placeholder}</span>
                                                    </>
                                                )}
                                            </div>
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
                                    ) : input.type === 'duration-preset' ? (
                                        <div className="flex flex-wrap gap-2">
                                            {(input.options || []).map((duration, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleInputChange(input.id, duration)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${formData[input.id] === duration
                                                        ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-md shadow-lime-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                        }`}
                                                >
                                                    {duration}
                                                </button>
                                            ))}
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

                        {/* Sticky Generate Button */}
                        <div className="p-4 bg-gradient-to-t from-white via-white to-white/90 border-t border-gray-100 sticky bottom-0 z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-300"
                                        style={{ width: `${Math.min(100, (Object.values(formData).filter(v => v && v !== '').length / Math.max(currentInputs.length, 1)) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {Object.values(formData).filter(v => v && v !== '').length === currentInputs.length
                                        ? '✓ Ready!'
                                        : `${currentInputs.length - Object.values(formData).filter(v => v && v !== '').length} fields left`}
                                </span>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className={`w-full bg-gradient-to-r from-lime-600 via-lime-500 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-lime-300/40 flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-lime-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-80 disabled:cursor-not-allowed group`}
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin" />
                                        <span>Generating magic...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} className="fill-white/20 group-hover:rotate-12 transition-transform" />
                                        <span>Generate Result</span>
                                        <span className="ml-1 text-lime-200">✨</span>
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
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            {isSaved ? 'Saved to Workspace' : 'Ready for review'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shadow-sm">
                                        <Copy size={16} />
                                        Copy
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shadow-sm">
                                        <Download size={16} />
                                        Export
                                    </button>
                                    <button
                                        onClick={handleSaveToWorkspace}
                                        disabled={isSaving || isSaved}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isSaved
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                                            : 'bg-gradient-to-r from-lime-600 to-emerald-600 text-white hover:shadow-md disabled:opacity-70'
                                            }`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : isSaved ? (
                                            <>
                                                <CheckCircle size={16} />
                                                Saved to Workspace
                                            </>
                                        ) : (
                                            <>
                                                <FolderOpen size={16} />
                                                Save to Workspace
                                            </>
                                        )}
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

            {/* Book & Chapter Selection Modal - Portal */}
            {isBookModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-gray-100">

                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-lime-50 to-green-50">
                            <div className="flex items-center gap-3">
                                {selectedBookInModal && (
                                    <button
                                        onClick={() => {
                                            setSelectedBookInModal(null);
                                            setSelectedChapters(new Set());
                                        }}
                                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {selectedBookInModal ? 'Select Chapters' : 'Select Source Book'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {selectedBookInModal
                                            ? `From: ${selectedBookInModal.title}`
                                            : 'Choose a book from your library'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsBookModalOpen(false);
                                    setSelectedBookInModal(null);
                                    setSelectedChapters(new Set());
                                    setSearchBookQuery('');
                                }}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Step 1: Book Selection */}
                        {!selectedBookInModal ? (
                            <>
                                {/* Search Bar */}
                                <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search books..."
                                            value={searchBookQuery}
                                            onChange={(e) => setSearchBookQuery(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-200 transition-all"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Book List */}
                                <div className="overflow-y-auto p-4 grid grid-cols-1 gap-2 custom-scrollbar flex-1">
                                    {filteredBooks.length > 0 ? (
                                        filteredBooks.map((book, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedBookInModal(book)}
                                                className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-lime-200 hover:bg-lime-50/50 cursor-pointer group transition-all"
                                            >
                                                <div className={`w-11 h-14 rounded-lg shadow-sm flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden ${['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'][idx % 5]}`}>
                                                    {book.cover ? (
                                                        <img src={book.cover} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen size={18} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-gray-800 truncate group-hover:text-lime-700">{book.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{book.subject || 'General'}</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500">{(book.chapters || []).length} chapters</span>
                                                    </div>
                                                </div>
                                                <div className="text-gray-300 group-hover:text-lime-500 transition-colors">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 flex flex-col items-center justify-center h-full text-gray-400">
                                            <BookOpen size={32} className="opacity-20 mb-3" />
                                            <p className="font-medium text-gray-600">No books found</p>
                                            <Link href="/library" className="flex items-center gap-2 px-4 py-2 bg-lime-50 text-lime-700 rounded-lg text-xs font-bold hover:bg-lime-100 transition-colors mt-4">
                                                <Plus size={14} /> Add New Book
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Step 2: Chapter Selection */
                            <>
                                {/* Chapter Controls */}
                                <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-12 rounded-lg shadow-sm flex items-center justify-center text-white overflow-hidden ${selectedBookInModal.cover ? '' : 'bg-lime-500'}`}>
                                            {selectedBookInModal.cover ? (
                                                <img src={selectedBookInModal.cover} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen size={16} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Selected Book</p>
                                            <p className="font-bold text-sm text-gray-800">{selectedBookInModal.title}</p>
                                        </div>
                                    </div>

                                    {/* Select All Toggle */}
                                    {(selectedBookInModal.chapters || []).length > 0 && (
                                        <button
                                            onClick={() => {
                                                const allChapterIds = (selectedBookInModal.chapters || []).map((ch: any) => ch.id);
                                                if (selectedChapters.size === allChapterIds.length) {
                                                    setSelectedChapters(new Set());
                                                } else {
                                                    setSelectedChapters(new Set(allChapterIds));
                                                }
                                            }}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${selectedChapters.size === (selectedBookInModal.chapters || []).length
                                                ? 'bg-lime-100 text-lime-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {selectedChapters.size === (selectedBookInModal.chapters || []).length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    )}
                                </div>

                                {/* Chapter List */}
                                <div className="overflow-y-auto p-4 grid grid-cols-1 gap-2 custom-scrollbar flex-1">
                                    {(selectedBookInModal.chapters || []).length > 0 ? (
                                        (selectedBookInModal.chapters || []).map((chapter: any, idx: number) => (
                                            <div
                                                key={chapter.id}
                                                onClick={() => {
                                                    const newSelected = new Set(selectedChapters);
                                                    if (newSelected.has(chapter.id)) {
                                                        newSelected.delete(chapter.id);
                                                    } else {
                                                        newSelected.add(chapter.id);
                                                    }
                                                    setSelectedChapters(newSelected);
                                                }}
                                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedChapters.has(chapter.id)
                                                    ? 'border-lime-400 bg-lime-50 shadow-sm'
                                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                                    }`}
                                            >
                                                {/* Checkbox */}
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${selectedChapters.has(chapter.id)
                                                    ? 'bg-lime-500 border-lime-500 text-white'
                                                    : 'border-gray-300 bg-white'
                                                    }`}>
                                                    {selectedChapters.has(chapter.id) && <CheckCircle size={14} />}
                                                </div>

                                                {/* Chapter Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-lime-600 bg-lime-100 px-2 py-0.5 rounded">
                                                            CH {idx + 1}
                                                        </span>
                                                        <h4 className="font-bold text-sm text-gray-800 truncate">{chapter.title}</h4>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{chapter.pages || 0} pages</p>
                                                </div>

                                                {/* Page Icon */}
                                                <FileText size={16} className={selectedChapters.has(chapter.id) ? 'text-lime-500' : 'text-gray-300'} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 flex flex-col items-center justify-center h-full text-gray-400">
                                            <FileText size={32} className="opacity-20 mb-3" />
                                            <p className="font-medium text-gray-600">No chapters in this book</p>
                                            <p className="text-xs mt-1">Add chapters from the Library → Manage page</p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Button */}
                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            // Save selection to formData
                                            handleInputChange('book', selectedBookInModal.title);
                                            handleInputChange('bookId', selectedBookInModal.id);

                                            // Get selected chapter titles
                                            const selectedChapterTitles = (selectedBookInModal.chapters || [])
                                                .filter((ch: any) => selectedChapters.has(ch.id))
                                                .map((ch: any) => ch.title);

                                            handleInputChange('chapters', Array.from(selectedChapters).join(','));
                                            handleInputChange('chapterTitles', selectedChapterTitles.join(', '));

                                            // Close modal
                                            setIsBookModalOpen(false);
                                            setSelectedBookInModal(null);
                                            setSelectedChapters(new Set());
                                            setSearchBookQuery('');
                                        }}
                                        disabled={selectedChapters.size === 0}
                                        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${selectedChapters.size > 0
                                            ? 'bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <CheckCircle size={18} />
                                        Confirm Selection ({selectedChapters.size} chapter{selectedChapters.size !== 1 ? 's' : ''})
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Footer - only show in book selection step */}
                        {!selectedBookInModal && (
                            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                <Link href="/library" className="text-xs font-bold text-gray-500 hover:text-lime-600 flex items-center justify-center gap-1.5 transition-colors py-1">
                                    <Plus size={14} /> Add more books to library
                                </Link>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ToolPage;
