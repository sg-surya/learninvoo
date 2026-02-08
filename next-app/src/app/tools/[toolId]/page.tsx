'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, Copy, RefreshCw, Wand2, Download, Send, Upload, FileText, Image as ImageIcon, Play, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Tool Configuration Mapping
const TOOLS_CONFIG: Record<string, any> = {
    'lesson-planner': {
        title: 'Lesson Planner',
        desc: 'Generate comprehensive weekly lesson plans tailored to your curriculum.',
        inputs: [
            { type: 'text', label: 'Topic', placeholder: 'e.g., Photosynthesis' },
            { type: 'select', label: 'Grade Level', options: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6-8', 'High School'] },
            { type: 'textarea', label: 'Specific Objectives / Notes', placeholder: 'Any specific standards or activities to include...' }
        ],
        dummyOutput: {
            type: 'text',
            content: `## Weekly Lesson Plan: Photosynthesis\n\n**Grade Level:** 5th Grade\n**Subject:** Science\n\n### Monday: Introduction to Photosynthesis\n- **Objective:** Students will define photosynthesis and identify the necessary components (sunlight, water, carbon dioxide).\n- **Activity:** "Plant needs" interactive discussion and diagram labeling.\n\n### Tuesday: The Process\n- **Objective:** detailed breakdown of the chemical process (simplified).\n- **Activity:** Leaf diagram coloring sheet showing inputs and outputs.\n\n### Wednesday: Experiment Day\n- **Objective:** Observe photosynthesis in action.\n- **Activity:** Leaf in water experiment to see oxygen bubbles.\n\n### Thursday: Role of Chlorophyll\n- **Objective:** Understand why plants are green.\n- **Activity:** Chromatography experiment with spinach leaves.\n\n### Friday: Review and Quiz\n- **Objective:** Assess understanding.\n- **Activity:** Group presentation and short quiz.`
        }
    },
    'visual-generator': {
        title: 'Visual Generator',
        desc: 'Create simple drawings, charts, or diagrams for your lessons.',
        inputs: [
            { type: 'textarea', label: 'Prompt', placeholder: 'Describe the image you want to generate...' },
            { type: 'select', label: 'Style', options: ['Line Art', 'Cartoon', 'Realistic', 'Diagram', 'Watercolor'] }
        ],
        dummyOutput: {
            type: 'image',
            content: 'https://picsum.photos/seed/visual-gen/800/600',
            alt: 'Generated Visual'
        }
    },
    'library': {
        title: 'Library',
        desc: 'This tool is not configured yet.',
        inputs: [],
        dummyOutput: { type: 'text', content: 'Library access...' }
    },
    'hyper-local-content': {
        title: 'Hyper Local Content',
        desc: 'Create content tailored to your students\' specific region and culture.',
        inputs: [
            { type: 'text', label: 'Topic', placeholder: 'e.g., Water Conservation' },
            { type: 'text', label: 'Region/City', placeholder: 'e.g., Mumbai, India' },
            { type: 'textarea', label: 'Context', placeholder: 'Local festivals, landmarks, or common issues...' }
        ],
        dummyOutput: {
            type: 'text',
            content: `## Topic: Water Conservation in Mumbai\n\n**Context:** Integrating local challenges with science curriculum.\n\n### Discussion Points:\n1. **The Monsoon Season:** Discuss how Mumbai relies on lakes like Vihar and Tulsi significantly during the monsoon. Why is water conservation still important despite heavy rains?\n2. **Local Case Study:** Analyze the water usage in a typical Mumbai housing society vs. a rural village in Maharashtra.\n3. **Activity:** Students calculate their family's water usage and propose local solutions (e.g., rainwater harvesting in buildings).\n\n### Local Relevance:\n- Mention the Mithi River rehabilitation project.\n- Discuss the history of the Victorian-era pipeline system.`
        }
    },
    'story-generator': {
        title: 'Story Generator',
        desc: 'Generate creative stories for any topic, moral, or character.',
        inputs: [
            { type: 'text', label: 'Main Character', placeholder: 'e.g., A brave squirrel named Nutty' },
            { type: 'text', label: 'Theme/Moral', placeholder: 'e.g., The importance of sharing' },
            { type: 'select', label: 'Genre', options: ['Fable', 'Sci-Fi', 'Mystery', 'Adventure', 'Fantasy'] }
        ],
        dummyOutput: {
            type: 'text',
            content: `**Title: The Squirrel Who Shared the Sun**\n\nOnce upon a time, in the heart of the Whispering Woods, lived a brave squirrel named Nutty. Unlike other squirrels who hoarded their nuts for winter, Nutty loved to explore the high canopy.\n\nOne day, he found a magical glowing acorn that radiated warmth like the sun. "This could keep everyone warm during the blizzard!" he thought. But a greedy hawk named Talon swooped down. "Give me the sun-nut!" screeched Talon.\n\nNutty, remembering his grandmother's lesson about sharing, said, "We can share its warmth, Talon. It's too heavy for just one of us." Talon successfully paused...`
        }
    },
    'quiz-exam-generator': {
        title: 'Quiz/Exam Generator',
        desc: 'Create engaging quizzes and exams tailored to your curriculum.',
        inputs: [
            { type: 'text', label: 'Topic', placeholder: 'e.g., World War II' },
            { type: 'select', label: 'Difficulty', options: ['Easy', 'Medium', 'Hard'] },
            { type: 'number', label: 'Number of Questions', placeholder: '10' }
        ],
        dummyOutput: {
            type: 'text',
            content: `## Quiz: World War II (Medium Difficulty)\n\n**1. Which event is generally considered the start of World War II?**\n    a) Attack on Pearl Harbor\n    b) Invasion of Poland\n    c) Battle of Britain\n    d) D-Day\n\n**2. Who was the Prime Minister of the United Kingdom for most of WWII?**\n    a) Neville Chamberlain\n    b) Clement Attlee\n    c) Winston Churchill\n    d) Anthony Eden\n\n**3. In which year did the war end in Europe?**\n    a) 1943\n    b) 1944\n    c) 1945\n    d) 1946`
        }
    },
    'paper-digitizer': {
        title: 'Paper Digitizer',
        desc: 'Digitize handwritten notes and papers instantly using OCR.',
        inputs: [
            { type: 'file', label: 'Upload Image/PDF', placeholder: 'Select a file...' },
            { type: 'select', label: 'Language', options: ['English', 'Hindi', 'Spanish', 'French'] }
        ],
        dummyOutput: {
            type: 'ocr-preview',
            content: 'Digitized content will appear here after processing...',
            scannedText: "Chapter 1: The Cell\n\nThe cell is the basic structural and functional unit of life forms. Every cell consists of a cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids."
        }
    },
    'simulation-generator': {
        title: 'Simulation Generator',
        desc: 'Create interactive simulations and models for complex concepts.',
        inputs: [
            { type: 'text', label: 'Concept to Simulate', placeholder: 'e.g., Solar System, Circuit Board, Economy' },
            { type: 'textarea', label: 'Parameters', placeholder: 'Define variables, rules, or specific scenarios...' }
        ],
        dummyOutput: {
            type: 'simulation',
            content: 'Simulation Loading Check...',
            title: 'Solar System Gravity Simulation'
        }
    },
    'rubric-generator': {
        title: 'Rubric Generator',
        desc: 'Design detailed grading rubrics for any assignment.',
        inputs: [
            { type: 'text', label: 'Assignment Title', placeholder: 'e.g., Science Fair Project' },
            { type: 'textarea', label: 'Criteria', placeholder: 'Research, Presentation, Creativity, Scientific Method...' },
            { type: 'select', label: 'Scale', options: ['1-4 Points', '1-5 Stars', 'Letter Grades', 'Percentage'] }
        ],
        dummyOutput: {
            type: 'text',
            content: `## Rubric: Science Fair Project\n\n| Criteria | 4 Points (Exemplary) | 3 Points (Proficient) | 2 Points (Developing) | 1 Point (Beginning) |\n|---|---|---|---|---|\n| **Scientific Method** | method is clearly defined and followed rigorously. | Method is followed with minor deviations. | Method is unclear or inconsistent. | Method is not followed. |\n| **Presentation** | Visuals are professional, clear, and engaging. | Visuals are clear. | Visuals are somewhat messy. | Visuals are confusing or absent. |\n| **Research** | Extensive background research cited. | Adequate research. | Minimal research. | No research evident. |`
        }
    }
};

const ToolPage = () => {
    const params = useParams();
    const toolId = params.toolId as string;
    const config = TOOLS_CONFIG[toolId];

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);

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
        // Simulate AI delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedContent(config.dummyOutput);
        }, 1500); // 1.5s delay simulates generation
    };

    return (
        <div className="min-h-full bg-gray-50/50 flex flex-col p-6 gap-6">
            {/* Header */}
            <header className="bg-white rounded-2xl border border-gray-200 shadow-sm shrink-0">
                <div className="px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-gray-900 leading-none">{config.title}</h1>
                            <p className="text-xs text-gray-500 mt-1">{config.desc}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Natural Flow */}
            <main className="flex-1 flex flex-col md:flex-row w-full gap-6">

                {/* Left Pane: Input */}
                <div className="w-full md:w-1/3 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm h-fit">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 rounded-t-2xl">
                        <Wand2 size={16} className="text-lime-600" />
                        <h2 className="font-bold text-gray-700 text-sm">Input Parameters</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {config.inputs.map((input: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 block">{input.label}</label>
                                {input.type === 'textarea' ? (
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all min-h-[120px]"
                                        placeholder={input.placeholder}
                                    />
                                ) : input.type === 'select' ? (
                                    <div className="relative">
                                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 appearance-none transition-all">
                                            {input.options.map((opt: string, i: number) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1" /></svg>
                                        </div>
                                    </div>
                                ) : input.type === 'file' ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 bg-lime-50 text-lime-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload size={20} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                                    </div>
                                ) : (
                                    <input
                                        type={input.type}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all"
                                        placeholder={input.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={`w-full bg-gradient-to-r from-lime-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-lime-200 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} className="fill-white/20" />
                                    Generate Content
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Pane: Output */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-[500px] relative">
                    {!generatedContent && !isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-60">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Wand2 size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 mb-2">Ready to Create Magic?</h3>
                            <p className="text-gray-400 max-w-sm">Fill in the parameters on the left and click Generate to see AI-powered results here.</p>
                        </div>
                    ) : isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-10">
                            <div className="relative w-20 h-20 mb-8">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-lime-500 rounded-full border-t-transparent animate-spin"></div>
                                <Sparkles className="absolute inset-0 m-auto text-lime-500 animate-pulse" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 animate-pulse">Designing your content...</h3>
                            <p className="text-gray-400 text-sm mt-2">This may take a few seconds.</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                                <h2 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    Generated Result
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-white hover:text-lime-600 text-gray-500 rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Copy">
                                        <Copy size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white hover:text-lime-600 text-gray-500 rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Download">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 bg-white rounded-b-2xl">
                                {generatedContent.type === 'image' ? (
                                    <div className="flex flex-col items-center">
                                        <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gray-100 w-full max-w-lg aspect-square group">
                                            <img src={generatedContent.content} alt={generatedContent.alt} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                        </div>
                                        <p className="mt-4 text-xs text-gray-400 italic">Generated based on your prompt.</p>
                                    </div>
                                ) : generatedContent.type === 'simulation' ? (
                                    <div className="w-full h-full min-h-[400px] bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                                        <div className="text-center z-10">
                                            <Play size={48} className="text-white mx-auto mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                                            <h3 className="text-white font-bold text-lg">{generatedContent.title}</h3>
                                            <p className="text-white/50 text-xs mt-2">Click to Launch Interactive Mode</p>
                                        </div>
                                    </div>
                                ) : generatedContent.type === 'ocr-preview' ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            Processing Complete. Text extracted successfully.
                                        </div>
                                        <div className="prose prose-sm max-w-none text-gray-700 font-serif leading-relaxed border-l-4 border-gray-200 pl-4">
                                            <h3 className="text-gray-900 font-sans font-bold text-lg mb-4">Extracted Content</h3>
                                            <div className="whitespace-pre-wrap">{generatedContent.scannedText}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose prose-lime max-w-none">
                                        <div className="whitespace-pre-wrap font-medium text-gray-700 leading-relaxed font-sans">
                                            {generatedContent.content.split('\n').map((line: string, i: number) => (
                                                <React.Fragment key={i}>
                                                    {line.startsWith('# ') ? <h1 className="text-2xl font-bold text-gray-900 mb-4">{line.replace('# ', '')}</h1> :
                                                        line.startsWith('## ') ? <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3 border-b pb-2">{line.replace('## ', '')}</h2> :
                                                            line.startsWith('### ') ? <h3 className="text-lg font-bold text-lime-700 mt-4 mb-2">{line.replace('### ', '')}</h3> :
                                                                line.startsWith('- ') ? <li className="ml-4 list-disc text-gray-600 mb-1">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li> :
                                                                    line.startsWith('|') ? <div className="overflow-x-auto my-4 p-2 bg-gray-50 rounded-lg text-xs"><pre>{line}</pre></div> : // Simple table placeholder
                                                                        <p className="mb-3 text-gray-600" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ToolPage;
