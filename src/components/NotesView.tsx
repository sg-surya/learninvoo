'use client';

import React, { useState, useEffect } from 'react';
import {
    FileText,
    Folder,
    MoreVertical,
    Plus,
    Search,
    Star,
    Trash2,
    Edit3,
    Hash,
    Clock,
    Archive,
    Maximize2,
    Sparkles,
    Tag,
    X,
    Filter,
    FolderPlus,
    Layout,
    Minimize2,
    Zap,
    Download,
    Share2,
    BrainCircuit,
    Bold,
    Italic,
    List,
    Heading2,
    Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Types
interface Note {
    id: string;
    title: string;
    content: string;
    folder: string;
    tags: string[];
    isPinned: boolean;
    updatedAt: number;
    category: string;
}

interface FolderType {
    name: string;
    count: number;
    color: string;
    bg: string;
}

const DEFAULT_FOLDERS: FolderType[] = [
    { name: 'Lecture Materials', count: 0, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Personal Drafts', count: 0, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { name: 'Research Paper', count: 0, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Student Feedback', count: 0, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const NotesView: React.FC = () => {
    // State
    const [notes, setNotes] = useState<Note[]>([]);
    const [folders, setFolders] = useState<FolderType[]>(DEFAULT_FOLDERS);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [activeFolder, setActiveFolder] = useState<string>('Lecture Materials');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isListViewOpen, setIsListViewOpen] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Load from LocalStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem('learnivo_notes_v2');
        const savedFolders = localStorage.getItem('learnivo_folders');
        if (savedNotes) {
            const parsedNotes: Note[] = JSON.parse(savedNotes);
            setNotes(parsedNotes);
            if (parsedNotes.length > 0) {
                setSelectedNoteId(parsedNotes[0].id);
            }
        }
        else {
            const seed: Note[] = [{
                id: '1',
                title: 'Advanced Statistics & Probability Course Outline',
                content: 'This note covers the primary learning objectives for the upcoming semester. We will focus on data visualization, normal distribution patterns, and hypothesis testing.\n\nKey Reading:\n- Chapter 1: The Nature of Data\n- Chapter 2: Descriptive Statistics',
                folder: 'Lecture Materials',
                tags: ['Academic', '2024Term'],
                isPinned: true,
                updatedAt: Date.now(),
                category: 'Math'
            }];
            setNotes(seed);
            setSelectedNoteId(seed[0].id);
        }
        if (savedFolders) setFolders(JSON.parse(savedFolders));
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('learnivo_notes_v2', JSON.stringify(notes));
        localStorage.setItem('learnivo_folders', JSON.stringify(folders));
    }, [notes, folders]);

    // Folder Form State
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const activeNote = notes.find(n => n.id === selectedNoteId) || null;

    // Tiptap Editor Initialization
    const editor = useEditor({
        extensions: [StarterKit],
        content: '', // Initial content will be set by useEffect
        onUpdate: ({ editor: updatedEditor }) => {
            if (activeNote) {
                updateNote(activeNote.id, { content: updatedEditor.getHTML() });
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-base focus:outline-none max-w-none text-base font-medium text-foreground/80 leading-relaxed min-h-[50vh] w-full',
            },
        },
        immediatelyRender: false,
    });

    // Update editor content when activeNote changes
    useEffect(() => {
        if (editor && activeNote && editor.getHTML() !== activeNote.content) {
            editor.commands.setContent(activeNote.content);
        }
    }, [activeNote?.id, editor, activeNote?.content]);

    // Derived Data
    const filteredNotes = notes
        .filter(n => n.folder === activeFolder)
        .filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updatedAt - a.updatedAt);

    if (!mounted) return null;


    // Actions
    const createNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            folder: activeFolder,
            tags: [],
            isPinned: false,
            updatedAt: Date.now(),
            category: 'General'
        };
        setNotes([newNote, ...notes]);
        setSelectedNoteId(newNote.id);
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        if (selectedNoteId === id) setSelectedNoteId(null);
    };

    const handleAddFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFolderName.trim() && !folders.find(f => f.name === newFolderName.trim())) {
            const newFolder: FolderType = {
                name: newFolderName.trim(),
                count: 0,
                color: 'text-primary-custom',
                bg: 'bg-primary-custom/10'
            };
            setFolders([...folders, newFolder]);
            setNewFolderName('');
            setIsFolderModalOpen(false);
        }
    };

    const runAiMagic = async () => {
        if (!activeNote || !editor) return;
        setIsAiLoading(true);
        // Simulate AI thinking
        await new Promise(r => setTimeout(r, 2000));
        const improvedContent = editor.getHTML() + "<br/><br/><p><strong>VASU ENHANCEMENT:</strong> Summary of statistical core methods completed.</p>";
        editor.commands.setContent(improvedContent);
        updateNote(activeNote.id, { content: improvedContent });
        setIsAiLoading(false);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTagName.trim() && activeNote) {
            if (!activeNote.tags.includes(newTagName.trim())) {
                updateNote(activeNote.id, { tags: [...activeNote.tags, newTagName.trim()] });
            }
            setNewTagName('');
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden bg-transparent select-none">
            {/* Custom Folder Modal */}
            <AnimatePresence>
                {isFolderModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFolderModalOpen(false)}
                            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-card-bg border border-border rounded-3xl p-8 z-[110] shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-custom/10 text-primary-custom rounded-xl flex items-center justify-center">
                                        <FolderPlus size={20} />
                                    </div>
                                    <h3 className="text-xl font-black font-display italic uppercase tracking-tight">New <span className="text-primary-custom">Collection</span></h3>
                                </div>
                                <button onClick={() => setIsFolderModalOpen(false)} className="w-8 h-8 hover:bg-muted rounded-lg flex items-center justify-center transition-all">
                                    <X size={18} className="text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleAddFolder} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Collection Name</label>
                                    <input
                                        required
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. Exam Templates"
                                        className="w-full bg-muted border-none p-4 rounded-xl text-sm font-bold placeholder:text-muted-foreground/30 focus:ring-2 focus:ring-primary-custom/20 outline-none"
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-primary-custom text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-primary-custom/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Establish Sector
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* 1. Collections Sidebar (Folder Vault) */}
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-r border-border/40 bg-card-bg/50 backdrop-blur-2xl flex flex-col overflow-hidden h-full"
                    >
                        <div className="p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary-custom/10 text-primary-custom rounded-lg flex items-center justify-center border border-primary-custom/20">
                                        <Archive size={14} />
                                    </div>
                                    <h2 className="text-sm font-black text-foreground font-display italic uppercase tracking-tighter">The Vault</h2>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => setIsFolderModalOpen(true)} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground transition-all">
                                        <FolderPlus size={12} />
                                    </button>
                                    <button onClick={createNote} className="w-6 h-6 bg-primary-custom text-white rounded-md flex items-center justify-center shadow-lg shadow-primary-custom/20 hover:scale-110 active:scale-95 transition-all">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={10} />
                                <input
                                    type="text"
                                    placeholder="Find sector..."
                                    className="w-full bg-muted/20 border border-border/50 rounded-lg py-2 pl-8 pr-3 text-[9px] font-bold focus:ring-1 focus:ring-primary-custom/20 transition-all placeholder:text-muted-foreground/20 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar pr-1">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] mb-2 ml-1">Archive</p>
                                {folders.map((folder, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveFolder(folder.name)}
                                        className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 group
                                            ${activeFolder === folder.name
                                                ? 'bg-primary-custom text-white shadow-sm ring-1 ring-primary-custom/20'
                                                : 'hover:bg-card-bg text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Folder size={14} className={`${activeFolder === folder.name ? 'text-white' : folder.color} group-hover:scale-110 transition-transform`} />
                                            <span className="text-[11px] font-semibold tracking-tight">{folder.name}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${activeFolder === folder.name ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                                            {notes.filter(n => n.folder === folder.name).length}
                                        </span>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-6 p-4 bg-primary-custom/5 border border-primary-custom/10 rounded-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:rotate-12 transition-transform">
                                    <BrainCircuit size={30} />
                                </div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Sparkles size={10} className="text-primary-custom" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary-custom italic">Vasu Tip</span>
                                </div>
                                <p className="text-[9px] font-bold text-foreground/60 leading-relaxed italic">
                                    Establish a new module for better organization.
                                </p>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="flex items-center gap-1.5 text-[7px] font-black text-muted-foreground hover:text-primary-custom transition-all uppercase tracking-widest italic"
                                >
                                    <Minimize2 size={10} /> Lock Vault
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Note Picker Pane (Strict One-View) */}
            <AnimatePresence initial={false}>
                {isListViewOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-r border-border/40 bg-card-bg/10 backdrop-blur-md overflow-hidden flex flex-col h-full"
                    >
                        <div className="p-4 flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/10">
                                <div>
                                    <h3 className="text-[9px] font-black text-foreground uppercase tracking-widest italic">{activeFolder}</h3>
                                    <p className="text-[7px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">{filteredNotes.length} Units</p>
                                </div>
                                <div className="flex gap-0.5">
                                    <button className="p-1 text-muted-foreground hover:text-primary-custom"><Filter size={10} /></button>
                                    {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-muted-foreground hover:text-primary-custom"><Layout size={10} /></button>}
                                </div>
                            </div>

                            <div className="space-y-1 overflow-y-auto no-scrollbar flex-1 pb-4">
                                {filteredNotes.map(note => (
                                    <motion.div
                                        layout
                                        key={note.id}
                                        onClick={() => setSelectedNoteId(note.id)}
                                        className={`p-2.5 border rounded-lg transition-all duration-300 cursor-pointer relative group
                                            ${selectedNoteId === note.id
                                                ? 'border-primary-custom/30 bg-white shadow-lg ring-1 ring-primary-custom/5'
                                                : 'border-border/20 hover:border-primary-custom/10 bg-card-bg/30 hover:bg-white'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${folders.find(f => f.name === note.folder)?.color.replace('text', 'bg') || 'bg-primary-custom'}`} />
                                                <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                                                    {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            {note.isPinned && <Star size={9} className="text-amber-500 fill-amber-500" />}
                                        </div>
                                        <h4 className={`text-[13px] font-bold tracking-tight mb-1 line-clamp-1 transition-colors ${selectedNoteId === note.id ? 'text-primary-custom' : 'text-foreground group-hover:text-primary-custom'}`}>
                                            {note.title || 'Untitled Vision'}
                                        </h4>
                                        <p className="text-[11px] font-medium text-muted-foreground/60 line-clamp-2 leading-relaxed">
                                            {note.content.replace(/<[^>]*>/g, '').substring(0, 80) || 'Module void...'}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Integrated Infinite Editor Surface (Strict View) */}
            <div className="flex-1 overflow-hidden flex flex-col h-full relative">
                <AnimatePresence mode="wait">
                    {activeNote ? (
                        <motion.div
                            key={activeNote.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col overflow-hidden"
                        >
                            {/* Toolbar Blocked to Top */}
                            <div className="flex-none px-8 py-3.5 border-b border-border/20 bg-white/40 backdrop-blur-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg">
                                        <button
                                            onClick={() => updateNote(activeNote.id, { isPinned: !activeNote.isPinned })}
                                            className={`p-1.5 rounded-md transition-all ${activeNote.isPinned ? 'text-amber-500 bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Star size={12} fill={activeNote.isPinned ? "currentColor" : "none"} />
                                        </button>
                                        <button onClick={() => deleteNote(activeNote.id)} className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    <div className="w-px h-3 bg-border/30" />
                                    {/* Rich Text Toolbar Integration */}
                                    <div className="flex items-center gap-0.5 p-1 bg-muted/30 rounded-lg">
                                        <button
                                            onClick={() => editor?.chain().focus().toggleBold().run()}
                                            className={`p-1.5 rounded-md transition-all ${editor?.isActive('bold') ? 'bg-white shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Bold size={11} />
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                                            className={`p-1.5 rounded-md transition-all ${editor?.isActive('italic') ? 'bg-white shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Italic size={11} />
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                            className={`p-1.5 rounded-md transition-all ${editor?.isActive('bulletList') ? 'bg-white shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <List size={11} />
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                            className={`p-1.5 rounded-md transition-all ${editor?.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Heading2 size={11} />
                                        </button>
                                        <button
                                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                            className={`p-1.5 rounded-md transition-all ${editor?.isActive('blockquote') ? 'bg-white shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Quote size={11} />
                                        </button>
                                    </div>
                                    <div className="w-px h-3 bg-border/30" />
                                    <div className="flex items-center gap-1.5">
                                        {activeNote.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-primary-custom/5 rounded-full text-[7px] font-black text-primary-custom tracking-[0.1em] border border-primary-custom/10 flex items-center gap-1 group">
                                                #{tag}
                                                <X size={7} className="cursor-pointer opacity-30 group-hover:opacity-100" onClick={() => updateNote(activeNote.id, { tags: activeNote.tags.filter(t => t !== tag) })} />
                                            </span>
                                        ))}
                                        <div className="relative flex items-center">
                                            <Hash size={8} className="absolute left-2 text-muted-foreground/40" />
                                            <input
                                                type="text"
                                                placeholder="TAG"
                                                className="bg-muted/20 border-none rounded-full py-0.5 pl-5 pr-2 text-[7px] font-black w-12 focus:w-20 transition-all focus:ring-0 outline-none uppercase tracking-widest placeholder:text-muted-foreground/20"
                                                value={newTagName}
                                                onChange={e => setNewTagName(e.target.value)}
                                                onKeyDown={handleAddTag}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg">
                                        <button
                                            onClick={() => setIsListViewOpen(!isListViewOpen)}
                                            className={`p-1.5 rounded-md transition-all ${!isListViewOpen ? 'text-primary-custom bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Maximize2 size={12} />
                                        </button>
                                        <button onClick={runAiMagic} disabled={isAiLoading} className="px-2 py-1 text-muted-foreground hover:text-primary-custom rounded-md flex items-center gap-1.5 transition-all">
                                            <BrainCircuit size={12} className={isAiLoading ? 'animate-spin text-primary-custom' : ''} />
                                            <span className="text-[8px] font-black uppercase tracking-widest italic">{isAiLoading ? 'Wait...' : 'Vasu Mind'}</span>
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all">
                                        <Share2 size={12} /> Export
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Editor Paned strictly */}
                            <div className="flex-1 overflow-y-auto no-scrollbar px-10 py-8 lg:px-14 w-full h-full flex flex-col bg-white/5">
                                <input
                                    className="w-full text-4xl font-bold tracking-tight text-foreground bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/10 leading-tight mb-6 outline-none"
                                    placeholder="Untitled Vision..."
                                    value={activeNote.title}
                                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                                />

                                <div className="flex items-center gap-5 mb-10 opacity-50 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest border-b border-border/10 pb-6">
                                    <span className="flex items-center gap-2"><Clock size={12} /> {new Date(activeNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-2"><Layout size={12} /> {activeNote.folder}</span>
                                    <span className="flex items-center gap-2"><Zap size={12} /> {activeNote.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(w => w.length > 0).length} Words</span>
                                </div>

                                {/* Tiptap Rich Text Editor Content */}
                                <div className="flex-1 w-full rich-text-editor-container">
                                    <EditorContent editor={editor} />
                                </div>
                            </div>

                            {/* Frozen Status Bar */}
                            <div className="flex-none px-8 py-2 border-t border-border/10 flex justify-between items-center text-[7px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md">
                                <div className="flex gap-4 items-center">
                                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-primary-custom" /> Sync: Optimized</span>
                                    <span className="opacity-50">Local Vault v2.5</span>
                                </div>
                                <span>Learnivo Neural Engine</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-10">
                            <BrainCircuit size={40} className="text-muted-foreground mb-6" />
                            <h2 className="text-2xl font-black font-display italic uppercase tracking-tighter text-foreground">Awaiting Input</h2>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default NotesView;
