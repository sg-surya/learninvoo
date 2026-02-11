'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Feather, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    Book, Music, Image as ImageIcon, Volume2, Save, Share2, Type, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveGeneratedContent, generateId } from '@/lib/storage';

type ViewState = 'form' | 'generating' | 'result';

interface StoryContent {
    title: string;
    chapters: { title: string; content: string }[];
    moral?: string;
    tone: string;
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
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white/50 backdrop-blur-md border-2 
                    ${isOpen ? 'border-orange-500' : 'border-slate-100'} 
                    px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left hover:border-orange-300 group`}
            >
                <span className={value ? 'text-slate-800' : 'text-slate-400'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 max-h-[200px] overflow-y-auto"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className={`w-full px-4 py-2.5 text-left text-sm font-bold transition-all flex items-center justify-between
                                    ${value === option ? 'bg-orange-50 text-orange-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span>{option}</span>
                                {value === option && <Check size={14} className="text-orange-600" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StoryGeneratorView: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('form');
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [genre, setGenre] = useState('');
    const [length, setLength] = useState('Medium');
    const [language, setLanguage] = useState('English');

    // Result states
    const [generatedStory, setGeneratedStory] = useState<StoryContent | null>(null);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [fontSize, setFontSize] = useState(18);

    const gradeOptions = ['Toddler', 'Elementary', 'Middle School', 'High School', 'Adults'];
    const genreOptions = ['Folklore', 'Modern Fable', 'Sci-Fi Adventure', 'Mystery', 'Educational (Fact-based)'];
    const languageOptions = ['English', 'Hindi', 'Bengali', 'Spanish', 'French'];

    const handleGenerate = () => {
        if (!topic) return;
        setViewState('generating');

        setTimeout(() => {
            const mockStory: StoryContent = {
                title: `The ${topic || 'Golden Compass'} Adventure`,
                tone: genre || 'Adventure',
                moral: 'Wisdom is found within curiosity and courage.',
                chapters: [
                    {
                        title: 'The Unfolding Mystery',
                        content: `Deep in the heart of the whispering woods, where the sunlight barely touched the forest floor, lived a young tinkerer named Elara. She didn't have many friends, but she had her curiosity, which was more than enough. One crisp morning, Elara discovered a box buried beneath the roots of an ancient banyan tree. It didn't look like much—just a tarnished copper chest—but when she touched the lid, the air hummed with a low, melodic vibration.`
                    },
                    {
                        title: 'The Call to Journey',
                        content: `Inside the chest lay a single, glowing stone that seemed to pulse with a life of its own. Elara knew she couldn't keep this discovery to herself. The village elders spoke of such artifacts in hushed voices, calling them 'Echo Stones'—remnants of a forgotten age where magic and metallurgy were one and the same. As she held the stone, a map began to manifest in the dust at her feet, showing a path to the Silent Peaks.`
                    },
                    {
                        title: 'Through the Shimmering Gates',
                        content: `The climb was arduous, each step testing Elara's resolve. The air grew thinner and colder, but the Echo Stone provided a gentle warmth against her palm. At the summit, she found not a temple or a treasure, but a gate made entirely of refracting glass. The map had led her to the repository of all lost thoughts, where every idea ever forgotten was stored in shimmering crystals. Elara realized then that she wasn't just a tinkerer; she was a keeper of possibilities.`
                    }
                ]
            };
            setGeneratedStory(mockStory);
            setViewState('result');
        }, 3500);
    };

    const handleSave = async () => {
        if (!generatedStory) return;
        const content = {
            id: generateId(),
            type: 'story' as const,
            title: generatedStory.title,
            description: `${genre} Story for ${grade}`,
            content: JSON.stringify(generatedStory),
            contentType: 'text' as const,
            toolId: 'story-generator',
            formData: { topic, grade, genre, length, language },
            createdAt: Date.now(),
        };
        await saveGeneratedContent(content);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    if (viewState === 'form') {
        return (
            <div className="min-h-screen bg-[#fffcf8] flex flex-col items-center p-8 relative overflow-hidden">
                {/* Background Textures */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b4513 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-orange-100/50 to-transparent blur-[120px]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-[#2d1b0d] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-200">
                            <Feather size={32} className="text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif italic text-slate-900 tracking-tight leading-none mb-2">Story Generator</h1>
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">AI Narrative Engine</p>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-[4rem] p-16 border border-white shadow-[0_30px_100px_rgba(139,69,19,0.08)]">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif italic text-[#2d1b0d] leading-tight mb-4">What <span className="text-orange-600 underline underline-offset-8">world</span> shall we create?</h2>
                            <p className="text-slate-500 font-medium">Define your characters, setting, or moral, and our AI will weave a timeless tale.</p>
                        </div>

                        <div className="space-y-12">
                            <div className="group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Story Prompt or Topic</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Once upon a time, there was a young girl who found a glowing compass in the woods..."
                                    className="w-full bg-[#fcf9f5] border-2 border-slate-100 focus:border-orange-400 rounded-[2.5rem] px-10 py-8 text-xl font-medium transition-all outline-none placeholder:text-slate-300 min-h-[160px] resize-none leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <CustomDropdown label="Audience" value={grade} onChange={setGrade} options={gradeOptions} placeholder="Select..." />
                                <CustomDropdown label="Genre/Tone" value={genre} onChange={setGenre} options={genreOptions} placeholder="Select..." />
                                <CustomDropdown label="Length" value={length} onChange={setLength} options={['Short', 'Medium', 'Long']} placeholder="Select..." />
                                <CustomDropdown label="Language" value={language} onChange={setLanguage} options={languageOptions} placeholder="Select..." />
                            </div>
                        </div>

                        <div className="mt-16 flex justify-center">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic}
                                className="group relative px-14 py-6 bg-[#2d1b0d] text-white rounded-full font-serif italic text-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <Sparkles size={24} className="text-orange-400 group-hover:rotate-12 transition-transform" />
                                    Weave the Story
                                </div>
                                <div className="absolute inset-0 rounded-full bg-orange-600 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (viewState === 'generating') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fcf9f5]">
                <div className="w-24 h-24 relative mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-orange-200 border-dashed rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Feather size={40} className="text-orange-500 animate-bounce" />
                    </div>
                </div>
                <h2 className="text-4xl font-serif italic text-[#2d1b0d] mb-3">Gathering Ink...</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Penning your unique narrative</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf9f5] flex flex-col">
            <header className="bg-white/80 backdrop-blur-xl border-b border-orange-100 p-4 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('form')} className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-serif italic text-[#2d1b0d] leading-none">{generatedStory?.title}</h1>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">{genre} • {grade}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
                        <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-2 text-slate-500 hover:text-slate-900"><Type size={16} /></button>
                        <div className="w-px h-10 bg-slate-200" />
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-2 text-slate-500 hover:text-slate-900"><Type size={20} /></button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-orange-100 text-[#2d1b0d] rounded-2xl font-bold text-sm hover:shadow-lg transition-all">
                        <Volume2 size={18} /> Narrate
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-[#2d1b0d] text-white hover:bg-orange-950 shadow-orange-900/10'}`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? 'Saved' : 'Save Story'}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Chapters Navigation */}
                <aside className="w-80 border-r border-orange-50 bg-[#fdfaf6] p-8 hidden xl:block overflow-y-auto">
                    <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-8">Table of Contents</h3>
                    <div className="space-y-4">
                        {generatedStory?.chapters.map((chapter, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentChapter(i)}
                                className={`w-full p-4 rounded-2xl text-left transition-all ${currentChapter === i ? 'bg-white shadow-xl shadow-orange-900/5 border border-orange-100' : 'hover:bg-white/50'}`}
                            >
                                <span className={`text-[10px] font-black block mb-1 ${currentChapter === i ? 'text-orange-600' : 'text-slate-400'}`}>Chapter {i + 1}</span>
                                <h4 className={`font-serif italic text-sm ${currentChapter === i ? 'text-[#2d1b0d]' : 'text-slate-500'}`}>{chapter.title}</h4>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-orange-100/50 rounded-[2rem] border border-orange-200">
                        <div className="flex items-center gap-2 mb-3 text-orange-800">
                            <Sparkles size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">The Moral</span>
                        </div>
                        <p className="text-sm font-serif italic text-orange-900/70 leading-relaxed">
                            "{generatedStory?.moral}"
                        </p>
                    </div>
                </aside>

                <div className="flex-1 relative bg-white overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-12 py-20">
                        <AnimatePresence mode="wait">
                            <motion.article
                                key={currentChapter}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                                className="prose prose-slate lg:prose-xl"
                            >
                                <div className="mb-12">
                                    <span className="text-orange-600 font-serif italic text-lg block mb-4">Chapter {currentChapter + 1}</span>
                                    <h2 className="text-5xl font-serif italic text-[#2d1b0d] leading-tight" style={{ fontSize: fontSize + 24 }}>{generatedStory?.chapters[currentChapter].title}</h2>
                                </div>
                                <p className="text-[#2d1b0d]/80 leading-relaxed font-serif text-justify whitespace-pre-wrap" style={{ fontSize: fontSize, lineHeight: 1.8 }}>
                                    {generatedStory?.chapters[currentChapter].content}
                                </p>
                            </motion.article>
                        </AnimatePresence>

                        <div className="mt-20 flex items-center justify-between pt-12 border-t border-orange-50">
                            <button
                                onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                                disabled={currentChapter === 0}
                                className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-orange-600 disabled:opacity-0 transition-all"
                            >
                                <ChevronLeft size={20} />
                                Previous Chapter
                            </button>
                            <div className="flex gap-2">
                                {generatedStory?.chapters.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all ${currentChapter === i ? 'w-8 bg-orange-500' : 'w-1.5 bg-orange-200'}`} />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentChapter(Math.min(generatedStory!.chapters.length - 1, currentChapter + 1))}
                                disabled={currentChapter === (generatedStory?.chapters.length || 0) - 1}
                                className="flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-orange-600 disabled:opacity-0 transition-all"
                            >
                                Next Chapter
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Tools Floating Panel */}
                    <div className="fixed bottom-10 right-10 flex flex-col gap-4">
                        <button className="w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-slate-600 hover:text-orange-600 hover:scale-110 transition-all border border-orange-50">
                            <ImageIcon size={22} />
                        </button>
                        <button className="w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center text-slate-600 hover:text-orange-600 hover:scale-110 transition-all border border-orange-50">
                            <Music size={22} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StoryGeneratorView;
