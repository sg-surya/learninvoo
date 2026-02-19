'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Feather, ChevronDown, ChevronLeft, ChevronRight, Check, X,
    ArrowLeft, Download, RefreshCw, Send, Bot, Zap, Plus, BookOpen, Search,
    Book, Music, Image as ImageIcon, Volume2, Save, Share2, Type, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-card-bg border-2 
                    ${isOpen ? 'border-primary-custom shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)]' : 'border-border'} 
                    px-5 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left hover:border-primary-custom group shadow-soft`}
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground/50'}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-custom' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 mt-2 w-full bg-card-bg rounded-2xl shadow-2xl border border-border py-2 max-h-[250px] overflow-y-auto backdrop-blur-xl"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className={`w-full px-5 py-3 text-left text-sm font-bold transition-all flex items-center justify-between
                                    ${value === option ? 'bg-primary-custom/10 text-primary-custom' : 'text-foreground hover:bg-primary-custom/5'}`}
                            >
                                <span>{option}</span>
                                {value === option && <Check size={14} className="text-primary-custom" />}
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

    const handleGenerate = async () => {
        if (!topic) return;
        setViewState('generating');

        try {
            const { generateStory } = await import('@/lib/api');
            const response = await generateStory({
                topic: topic,
                grade: grade || 'Elementary',
                genre: genre || 'Adventure',
                length: length || 'Medium',
                language: language || 'English'
            });

            // Parse the AI-generated content into chapters
            const content = response.content || '';

            // Try to extract chapters from markdown headers
            const chapterMatches = content.split(/#{1,3}\s+(?:Chapter\s+\d+:|.*)/gi);
            const chapters: { title: string; content: string; }[] = [];

            // If we have structured chapter content
            if (chapterMatches.length > 1) {
                const titleMatches = content.match(/#{1,3}\s+(Chapter\s+\d+:.*|.*)/gi) || [];
                for (let i = 0; i < titleMatches.length && i < chapterMatches.length - 1; i++) {
                    chapters.push({
                        title: titleMatches[i].replace(/^#{1,3}\s+/, '').replace(/Chapter\s+\d+:\s*/i, '').trim(),
                        content: chapterMatches[i + 1].trim()
                    });
                }
            }

            // Fallback: if no chapters detected, create a single chapter
            if (chapters.length === 0) {
                chapters.push({
                    title: 'The Story',
                    content: content
                });
            }

            const story: StoryContent = {
                title: topic || 'Generated Story',
                tone: genre || 'Adventure',
                moral: 'Every adventure teaches us something new.',
                chapters: chapters.slice(0, 5) // Limit to 5 chapters
            };

            setGeneratedStory(story);
            setViewState('result');
        } catch (error) {
            console.error('Story generation failed:', error);
            alert('Failed to generate story. Please try again.');
            setViewState('form');
        }
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
            <div className="min-h-screen bg-transparent flex flex-col items-center p-8 relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-custom/5 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-primary-custom rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary-custom/20">
                            <Feather size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1 uppercase italic">Narrative Engine</h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">AI Story Weaver</p>
                        </div>
                    </div>

                    <div className="bg-card-bg/60 backdrop-blur-[40px] rounded-[3.5rem] p-16 border border-border shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="text-center mb-16 relative z-10">
                            <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic mb-4">What <span className="text-primary-custom">world</span> shall we create?</h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Define your characters and settings, and our AI will weave a timeless tale.</p>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="relative group/input">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 ml-1">Story Prompt or Topic</label>
                                <div className="relative">
                                    <textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Once upon a time, there was a young girl who found a glowing compass in the woods..."
                                        className="w-full bg-muted/30 border-2 border-border focus:border-primary-custom focus:bg-card-bg rounded-[2.5rem] px-10 py-8 text-xl font-bold transition-all outline-none placeholder:text-muted-foreground/30 text-foreground shadow-soft min-h-[180px] resize-none leading-relaxed"
                                    />
                                    <div className="absolute right-8 bottom-8 text-primary-custom/20 group-hover/input:text-primary-custom group-hover/input:rotate-12 transition-all">
                                        <BookOpen size={32} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <CustomDropdown label="Audience" value={grade} onChange={setGrade} options={gradeOptions} placeholder="Select..." />
                                <CustomDropdown label="Genre/Tone" value={genre} onChange={setGenre} options={genreOptions} placeholder="Select..." />
                                <CustomDropdown label="Length" value={length} onChange={setLength} options={['Short', 'Medium', 'Long']} placeholder="Select..." />
                                <CustomDropdown label="Language" value={language} onChange={setLanguage} options={languageOptions} placeholder="Select..." />
                            </div>
                        </div>

                        <div className="mt-16 flex justify-center relative z-10">
                            <button
                                onClick={handleGenerate}
                                disabled={!topic}
                                className="group px-14 py-6 bg-foreground text-background rounded-full font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-custom/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform text-primary-custom" />
                                    Weave the Story
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (viewState === 'generating') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-8 overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-custom/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-24 h-24 relative mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-primary-custom/20 border-dashed rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Feather size={40} className="text-primary-custom animate-bounce" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4 uppercase italic tracking-tighter text-center">Gathering Ink...</h2>
                <div className="flex items-center gap-4 text-primary-custom font-black uppercase tracking-[0.4em] text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-primary-custom animate-ping" />
                    Penning Your Unique Narrative
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col text-foreground">
            <header className="bg-background/80 backdrop-blur-[20px] border-b border-border p-5 px-10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewState('form')} className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl text-muted-foreground hover:text-primary-custom hover:bg-primary-custom/10 transition-all border border-transparent hover:border-primary-custom/20 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">{generatedStory?.title}</h1>
                        <p className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mt-1.5">{genre} • {grade}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-muted p-1 rounded-2xl mr-4 border border-border">
                        <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-background rounded-xl">
                            <Type size={14} />
                        </button>
                        <div className="w-px h-6 bg-border self-center mx-1" />
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-background rounded-xl">
                            <Type size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-muted text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-custom/5 hover:text-primary-custom border border-transparent hover:border-primary-custom/20 transition-all group">
                        <Volume2 size={16} className="group-hover:scale-110 transition-transform" /> Narrate
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isSaved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-foreground text-background hover:bg-foreground/90 shadow-black/10'}`}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />}
                        {isSaved ? 'Saved' : 'Save Story'}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Chapters Navigation */}
                <aside className="w-96 border-r border-border bg-muted/30 p-10 hidden xl:flex flex-col overflow-y-auto custom-scrollbar relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <h3 className="text-[10px] font-black text-primary-custom uppercase tracking-[0.3em] mb-10 pl-2">Table of Contents</h3>
                    <div className="space-y-4 flex-1">
                        {generatedStory?.chapters.map((chapter, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentChapter(i)}
                                className={`w-full p-6 rounded-[2rem] text-left transition-all relative group/chapter ${currentChapter === i ? 'bg-card-bg shadow-soft border border-border shadow-lg shadow-primary-custom/5' : 'hover:bg-primary-custom/5'}`}
                            >
                                <span className={`text-[9px] font-black block mb-2 uppercase tracking-widest ${currentChapter === i ? 'text-primary-custom' : 'text-muted-foreground/60'}`}>Chapter {i + 1}</span>
                                <h4 className={`text-sm font-black uppercase italic tracking-tighter ${currentChapter === i ? 'text-foreground' : 'text-muted-foreground group-hover/chapter:text-foreground'} transition-colors`}>{chapter.title}</h4>
                                {currentChapter === i && <motion.div layoutId="chapter-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-custom rounded-r-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-card-bg/40 backdrop-blur-md rounded-[2.5rem] border border-border relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-custom/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="flex items-center gap-3 mb-4 text-primary-custom relative z-10">
                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Moral</span>
                        </div>
                        <p className="text-sm font-bold indent-2 text-foreground/80 leading-relaxed relative z-10 italic uppercase tracking-tight">
                            "{generatedStory?.moral}"
                        </p>
                    </div>
                </aside>

                <div className="flex-1 relative bg-background overflow-y-auto custom-scrollbar">
                    <div className="max-w-3xl mx-auto px-12 py-24 relative">
                        {/* Decorative Book Element */}
                        <div className="absolute top-10 left-[-40px] text-primary-custom/5 pointer-events-none">
                            <BookOpen size={200} />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.article
                                key={currentChapter}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="relative z-10"
                            >
                                <div className="mb-16">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-1 bg-primary-custom rounded-full" />
                                        <span className="text-primary-custom font-black uppercase italic tracking-[0.3em] text-xs">Chapter {currentChapter + 1}</span>
                                    </div>
                                    <h2 className="text-6xl font-black text-foreground leading-[1.1] uppercase italic tracking-tighter" style={{ fontSize: fontSize + 28 }}>{generatedStory?.chapters[currentChapter].title}</h2>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-[-40px] top-0 bottom-0 w-px bg-gradient-to-b from-primary-custom/20 via-primary-custom/5 to-transparent" />
                                    <div className="text-foreground/90 leading-relaxed font-bold markdown-container" style={{ fontSize: fontSize, lineHeight: 1.8 }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {generatedStory?.chapters[currentChapter].content || ''}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </motion.article>
                        </AnimatePresence>

                        <div className="mt-24 pt-16 border-t border-border flex items-center justify-between">
                            <button
                                onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                                disabled={currentChapter === 0}
                                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary-custom disabled:opacity-0 transition-all"
                            >
                                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl group-hover:-translate-x-1 transition-transform">
                                    <ChevronLeft size={18} />
                                </div>
                                Previous Chapter
                            </button>

                            <div className="flex gap-3">
                                {generatedStory?.chapters.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentChapter(i)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${currentChapter === i ? 'w-12 bg-primary-custom' : 'w-2 bg-muted hover:bg-muted-foreground/30'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentChapter(Math.min(generatedStory!.chapters.length - 1, currentChapter + 1))}
                                disabled={currentChapter === (generatedStory?.chapters.length || 0) - 1}
                                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary-custom disabled:opacity-0 transition-all text-right"
                            >
                                Next Chapter
                                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl group-hover:translate-x-1 transition-transform">
                                    <ChevronRight size={18} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Quick Tools Floating Panel */}
                    <div className="fixed bottom-12 right-12 flex flex-col gap-5 relative z-50">
                        {[
                            { icon: <ImageIcon size={22} />, label: "Illustrate" },
                            { icon: <Music size={22} />, label: "Atmosphere" },
                            { icon: <Languages size={22} />, label: "Translate" }
                        ].map((tool, i) => (
                            <button key={i} className="w-16 h-16 bg-card-bg/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[1.5rem] flex items-center justify-center text-muted-foreground hover:text-primary-custom hover:scale-110 transition-all border border-border group relative">
                                {tool.icon}
                                <span className="absolute right-full mr-4 px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                    {tool.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StoryGeneratorView;
