'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { Book, Download, ExternalLink, Search, Plus, X, Image as ImageIcon, Edit2, Layers, Grid, Trash2, SortAsc, BarChart3, Calendar, User, List, Grid3x3, Star, Tag, Upload, Sparkles, Filter, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    author: string;
    subject: string;
    classLevel: string;
    type: string;
    cover?: string;
    color: string;
    iconColor: string;
    dateAdded?: number; // timestamp
    isFavorite?: boolean;
    tags?: string[];
}

const THEMES = [
    { color: 'bg-lime-100', iconColor: 'text-lime-600' },
    { color: 'bg-sky-100', iconColor: 'text-sky-600' },
    { color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { color: 'bg-orange-100', iconColor: 'text-orange-600' },
    { color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { color: 'bg-rose-100', iconColor: 'text-rose-600' },
];

const LibraryView: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter State
    const [filter, setFilter] = useState<{ type: 'all' | 'subject' | 'class'; value: string }>({ type: 'all', value: 'All Books' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'date-new' | 'date-old' | 'author'>('date-new');

    // New Feature States
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
    const [previewBook, setPreviewBook] = useState<Resource | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) {
            setResources(JSON.parse(saved));
        }
    }, []);

    // Community Books (Mock data - public library)
    const communityBooks: Resource[] = [
        {
            id: 'comm-1',
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen',
            subject: 'Computer Science',
            classLevel: 'Grade 12',
            type: 'PDF',
            color: 'bg-blue-100',
            iconColor: 'text-blue-600',
            dateAdded: Date.now() - 1000000,
            isFavorite: false,
        },
        {
            id: 'comm-2',
            title: 'Physics for Scientists',
            author: 'Raymond Serway',
            subject: 'Physics',
            classLevel: 'Grade 11',
            type: 'PDF',
            color: 'bg-purple-100',
            iconColor: 'text-purple-600',
            dateAdded: Date.now() - 2000000,
        },
        {
            id: 'comm-3',
            title: 'Organic Chemistry Basics',
            author: 'Peter Atkins',
            subject: 'Chemistry',
            classLevel: 'Grade 12',
            type: 'PDF',
            color: 'bg-green-100',
            iconColor: 'text-green-600',
            dateAdded: Date.now() - 3000000,
        },
        {
            id: 'comm-4',
            title: 'World History: Medieval Era',
            author: 'John Smith',
            subject: 'History',
            classLevel: 'Grade 10',
            type: 'PDF',
            color: 'bg-orange-100',
            iconColor: 'text-orange-600',
            dateAdded: Date.now() - 4000000,
        },
    ];

    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        subject: '',
        classLevel: '',
        type: 'PDF'
    });

    // Derive unique lists for Sidebar
    const uniqueSubjects = Array.from(new Set(resources.map(r => r.subject).filter(Boolean))).sort();
    const uniqueClasses = Array.from(new Set(resources.map(r => r.classLevel).filter(Boolean))).sort();

    // Default suggestions if empty (to make UI look good initially)
    const displaySubjects = uniqueSubjects.length > 0 ? uniqueSubjects : ['Mathematics', 'Science', 'History', 'Literature', 'Computer Science'];
    const displayClasses = uniqueClasses.length > 0 ? uniqueClasses : ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

    // Filter + Search
    const filteredResources = resources.filter(res => {
        // Apply filter
        let matchesFilter = true;
        if (filter.type === 'subject') matchesFilter = res.subject === filter.value;
        if (filter.type === 'class') matchesFilter = res.classLevel === filter.value;

        // Apply search
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query ||
            res.title.toLowerCase().includes(query) ||
            res.author.toLowerCase().includes(query) ||
            res.subject.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
    });

    // Sort
    const sortedResources = [...filteredResources].sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        if (sortBy === 'date-new') return (b.dateAdded || 0) - (a.dateAdded || 0);
        if (sortBy === 'date-old') return (a.dateAdded || 0) - (b.dateAdded || 0);
        return 0;
    });

    // Group books by class for display
    const groupedByClass = sortedResources.reduce((acc, res) => {
        const classLabel = res.classLevel || 'Uncategorized';
        if (!acc[classLabel]) acc[classLabel] = [];
        acc[classLabel].push(res);
        return acc;
    }, {} as Record<string, Resource[]>);

    const classGroups = Object.keys(groupedByClass).sort();

    // Helper: Check if book is new (added within last 7 days)
    const isNewBook = (dateAdded?: number) => {
        if (!dateAdded) return false;
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return dateAdded > sevenDaysAgo;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for resizing
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Set max dimensions (e.g. 400x600 is enough for a thumbnail)
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 600;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Compress to JPEG with 0.7 quality to save space
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        setCoverPreview(compressedDataUrl);
                    }
                };
                if (event.target?.result) {
                    img.src = event.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBook.title || !newBook.author) return;

        const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
        const newId = Date.now().toString(); // Simple ID generation

        // Auto-format class level: if user enters just a number, prepend "Grade "
        let formattedClassLevel = newBook.classLevel.trim();
        if (formattedClassLevel && !formattedClassLevel.toLowerCase().startsWith('grade')) {
            formattedClassLevel = `Grade ${formattedClassLevel}`;
        }

        const resource: Resource = {
            id: newId,
            ...newBook,
            classLevel: formattedClassLevel,
            cover: coverPreview || undefined,
            color: randomTheme.color,
            iconColor: randomTheme.iconColor,
            dateAdded: Date.now()
        };

        const updatedResources = [resource, ...resources];
        setResources(updatedResources);

        try {
            localStorage.setItem('library_resources', JSON.stringify(updatedResources));
        } catch (error) {
            console.error("Storage limit exceeded:", error);
            // Fallback: Try saving without the cover image if it's too large
            if (resource.cover) {
                alert("Image too large for local storage. Book saved without cover.");
                const resourceWithoutCover = { ...resource, cover: undefined };
                const resourcesFallback = [resourceWithoutCover, ...resources];
                // Update state to match fallback (remove cover from UI too to avoid confusion on refresh)
                setResources(resourcesFallback);
                try {
                    localStorage.setItem('library_resources', JSON.stringify(resourcesFallback));
                } catch (e) {
                    alert("Storage full. changes will be lost on refresh.");
                }
            } else {
                alert("Storage full. Book added temporarily but won't persist.");
            }
        }

        resetForm();
        setIsModalOpen(false);
    };

    const resetForm = () => {
        setNewBook({ title: '', author: '', subject: '', classLevel: '', type: 'PDF' });
        setCoverPreview(null);
    };

    const handleDeleteBook = (bookId: string) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        const updated = resources.filter(r => r.id !== bookId);
        setResources(updated);
        localStorage.setItem('library_resources', JSON.stringify(updated));
    };

    const toggleFavorite = (bookId: string) => {
        const updated = resources.map(r =>
            r.id === bookId ? { ...r, isFavorite: !r.isFavorite } : r
        );
        setResources(updated);
        localStorage.setItem('library_resources', JSON.stringify(updated));
    };

    const addTag = (bookId: string, tag: string) => {
        const updated = resources.map(r => {
            if (r.id === bookId) {
                const existingTags = r.tags || [];
                if (!existingTags.includes(tag)) {
                    return { ...r, tags: [...existingTags, tag] };
                }
            }
            return r;
        });
        setResources(updated);
        localStorage.setItem('library_resources', JSON.stringify(updated));
    };

    const removeTag = (bookId: string, tag: string) => {
        const updated = resources.map(r => {
            if (r.id === bookId) {
                return { ...r, tags: (r.tags || []).filter(t => t !== tag) };
            }
            return r;
        });
        setResources(updated);
        localStorage.setItem('library_resources', JSON.stringify(updated));
    };

    const toggleSelectBook = (bookId: string) => {
        const newSelected = new Set(selectedBooks);
        if (newSelected.has(bookId)) {
            newSelected.delete(bookId);
        } else {
            newSelected.add(bookId);
        }
        setSelectedBooks(newSelected);
    };

    const deleteSelectedBooks = () => {
        if (!confirm(`Delete ${selectedBooks.size} selected books?`)) return;
        const updated = resources.filter(r => !selectedBooks.has(r.id));
        setResources(updated);
        localStorage.setItem('library_resources', JSON.stringify(updated));
        setSelectedBooks(new Set());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCoverPreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Add community book to user's library
    const addToMyLibrary = (book: Resource) => {
        // Check if already in library
        if (resources.some(r => r.id === book.id || r.title === book.title)) {
            alert('This book is already in your library!');
            return;
        }

        // Create new book with unique ID
        const newBook: Resource = {
            ...book,
            id: `my-${Date.now()}`, // New unique ID
            dateAdded: Date.now(),
        };

        const updated = [...resources, newBook];
        setResources(updated);
        localStorage.setItem('library_resources', JSON.stringify(updated));
        alert(`"${book.title}" added to your library!`);
    };

    const toggleSectionCollapse = (sectionLabel: string) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(sectionLabel)) {
            newCollapsed.delete(sectionLabel);
        } else {
            newCollapsed.add(sectionLabel);
        }
        setCollapsedSections(newCollapsed);
    };

    // Tab state
    const [activeTab, setActiveTab] = useState<'my' | 'community'>('my');

    // Statistics
    const totalBooks = resources.length;
    const totalSubjects = uniqueSubjects.length;
    const totalClasses = uniqueClasses.length;

    return (
        <div className="flex flex-col h-full w-full bg-background overflow-hidden font-sans text-foreground">
            {/* 1. Fixed Header with Glassmorphism */}
            <header className="shrink-0 bg-card-bg/70 backdrop-blur-xl border-b border-border/20 px-6 py-4 sticky top-0 z-50 shadow-sm">
                {/* Top Row: Centered Tabs + Right Actions */}
                <div className="flex justify-between items-center mb-3 relative">
                    {/* Left: Logo/Icon */}
                    <div className="flex items-center gap-2 text-primary-custom">
                        <div className="bg-primary-custom/10 p-2 rounded-2xl">
                            <Book size={20} className="shrink-0" />
                        </div>
                    </div>

                    {/* Center: Liquid Glass Tab Menu */}
                    <div className="absolute left-0 right-0 mx-auto w-max p-1.5 rounded-full bg-gradient-to-b from-card-bg/30 to-card-bg/10 backdrop-blur-2xl border border-border/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.07),inset_0_0_0_1px_rgba(255,255,255,0.05)] flex items-center gap-0 relative overflow-hidden group hover:bg-card-bg/20 transition-all duration-500 z-20">
                        {/* The Fluid Morpher - Animated Background Pill */}
                        <div
                            className={`absolute top-1.5 bottom-1.5 rounded-full bg-card-bg shadow-[0_2px_10px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeTab === 'my'
                                ? 'left-1.5 w-[calc(50%-6px)]'
                                : 'left-[50%] w-[calc(50%-6px)]'
                                }`}
                        />

                        {/* Interactive Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                        <button
                            onClick={() => setActiveTab('my')}
                            className={`relative z-10 w-40 py-2.5 rounded-full font-bold text-xs transition-colors duration-300 flex items-center justify-center ${activeTab === 'my' ? 'text-primary-custom' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            My Library
                        </button>
                        <button
                            onClick={() => setActiveTab('community')}
                            className={`relative z-10 w-40 py-2.5 rounded-full font-bold text-xs transition-colors duration-300 flex items-center justify-center whitespace-nowrap ${activeTab === 'community' ? 'text-primary-custom' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Community Library
                        </button>
                    </div>

                    <div className="flex gap-3">


                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-muted border-none rounded-xl py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary-custom/20 cursor-pointer font-medium text-foreground transition-all"
                        >
                            <option value="date-new">Newest First</option>
                            <option value="date-old">Oldest First</option>
                            <option value="name">By Name</option>
                            <option value="author">By Author</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex gap-1 bg-muted rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card-bg shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Grid View"
                            >
                                <Grid3x3 size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card-bg shadow-sm text-primary-custom' : 'text-muted-foreground hover:text-foreground'}`}
                                title="List View"
                            >
                                <List size={16} />
                            </button>
                        </div>

                        {/* Bulk Actions (if any selected) */}
                        {selectedBooks.size > 0 && (
                            <button
                                onClick={deleteSelectedBooks}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-red-600 transition-all"
                            >
                                <Trash2 size={16} />
                                <span>Delete ({selectedBooks.size})</span>
                            </button>
                        )}

                        {/* Add Book Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-primary-custom text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-primary-custom/90 transition-all hover:shadow-lg"
                        >
                            <Plus size={18} />
                            <span>Add Book</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Stats & Search Inline */}
                <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-border/50">
                    {/* Left: Stats Pills */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-primary-custom/10 text-primary-custom px-3 py-1.5 rounded-lg text-xs font-bold border border-primary-custom/10 hover:bg-primary-custom/20 transition-colors cursor-default">
                            <Book size={14} />
                            <span>{resources.length} books</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-sky-500/10 text-sky-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/10 hover:bg-sky-500/20 transition-colors cursor-default">
                            <Grid3x3 size={14} />
                            <span>{new Set(resources.map(r => r.subject)).size} subjects</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-purple-500/10 text-purple-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-500/10 hover:bg-purple-500/20 transition-colors cursor-default">
                            <Layers size={14} />
                            <span>{classGroups.length} classes</span>
                        </div>
                    </div>

                    {/* Right: Compact Search Bar */}
                    <div className="relative group w-64">
                        <div className="absolute inset-0 bg-primary-custom/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative bg-card-bg border border-border rounded-xl shadow-sm flex items-center px-3 py-1.5 transition-all group-hover:border-primary-custom/30 group-focus-within:ring-2 group-focus-within:ring-primary-custom/20 group-focus-within:border-primary-custom">
                            <Search className="text-muted-foreground mr-2 shrink-0 transition-colors group-focus-within:text-primary-custom" size={16} />
                            <input
                                type="text"
                                placeholder="Search library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm w-full placeholder-muted-foreground text-foreground"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Main Content - Conditional based on active tab */}
            {activeTab === 'my' ? (
                // MY LIBRARY VIEW
                <main className="flex-1 flex overflow-hidden w-full items-start animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Left Sidebar - Filters */}
                    <aside className="w-64 shrink-0 h-full bg-card-bg border-r border-border flex flex-col hidden md:flex overflow-y-auto">
                        <div className="p-6 space-y-8">
                            {/* Collections */}
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Collections</h3>
                                <ul className="space-y-1">
                                    <li
                                        onClick={() => setFilter({ type: 'all', value: 'All Books' })}
                                        className={`flex items-center gap-3 text-sm font-bold px-3 py-2.5 rounded-xl cursor-pointer transition-all ${filter.type === 'all' ? 'text-primary-custom bg-primary-custom/10' : 'text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <Book size={18} />
                                        All Books
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:bg-muted px-3 py-2.5 rounded-xl cursor-pointer transition-colors">
                                        <Download size={18} />
                                        Downloads
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:bg-muted px-3 py-2.5 rounded-xl cursor-pointer transition-colors">
                                        <ExternalLink size={18} />
                                        Recent
                                    </li>
                                </ul>
                            </div>

                            {/* Classes / Grades */}
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Classes</h3>
                                <ul className="space-y-1">
                                    {displayClasses.map((cls) => (
                                        <li
                                            key={cls}
                                            onClick={() => setFilter({ type: 'class', value: cls })}
                                            className={`flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-xl cursor-pointer transition-colors ${filter.type === 'class' && filter.value === cls ? 'text-primary-custom bg-primary-custom/10 font-bold' : 'text-muted-foreground hover:bg-muted'}`}
                                        >
                                            <Layers size={16} className={filter.type === 'class' && filter.value === cls ? 'text-primary-custom' : 'text-muted-foreground/50'} />
                                            {cls}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subjects */}
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Subjects</h3>
                                <ul className="space-y-1">
                                    {displaySubjects.map((subject) => (
                                        <li
                                            key={subject}
                                            onClick={() => setFilter({ type: 'subject', value: subject })}
                                            className={`flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-xl cursor-pointer transition-colors ${filter.type === 'subject' && filter.value === subject ? 'text-primary-custom bg-primary-custom/10 font-bold' : 'text-muted-foreground hover:bg-muted'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full transition-colors ${filter.type === 'subject' && filter.value === subject ? 'bg-primary-custom' : 'bg-muted-foreground/30 group-hover:bg-primary-custom'}`} />
                                            {subject}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content - Scrollable Grid */}
                    <section className="flex-1 h-full overflow-y-auto bg-background/50">
                        <div className="p-8 pb-20 max-w-[1920px] mx-auto">



                            {filteredResources.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="relative mb-8 group">
                                        <div className="absolute inset-0 bg-primary-custom/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                        <div className="w-32 h-32 bg-card-bg rounded-3xl shadow-xl flex items-center justify-center relative transform group-hover:scale-105 transition-transform duration-300 border border-border">
                                            <div className="absolute top-0 right-0 p-3 bg-primary-custom/10 rounded-bl-2xl rounded-tr-2xl">
                                                <Sparkles size={20} className="text-primary-custom animate-pulse" />
                                            </div>
                                            <Book size={48} className="text-muted-foreground/50 group-hover:text-primary-custom transition-colors duration-300" />
                                        </div>
                                        {/* Floating Elements */}
                                        <div className="absolute -left-8 top-10 w-12 h-12 bg-card-bg rounded-2xl shadow-lg flex items-center justify-center border border-border transform -rotate-12 animate-bounce delay-100">
                                            <ImageIcon size={20} className="text-sky-400" />
                                        </div>
                                        <div className="absolute -right-6 bottom-4 w-10 h-10 bg-card-bg rounded-xl shadow-lg flex items-center justify-center border border-border transform rotate-12 animate-bounce delay-300">
                                            <Download size={16} className="text-purple-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">
                                        {filter.type === 'all' && !searchQuery ? 'Start Your Collection' : 'No matches found'}
                                    </h3>

                                    <p className="text-muted-foreground max-w-md mx-auto mb-10 text-base leading-relaxed">
                                        {filter.type === 'all' && !searchQuery
                                            ? "Your library is waiting for its first story. Upload your documents, books, or notes to get started."
                                            : `We couldn't find any books matching "${searchQuery || filter.value}". Try adjusting your filters or search terms.`}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="flex items-center gap-2 bg-gradient-to-r from-primary-custom to-primary-custom/80 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:shadow-primary-custom/30 hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <Plus size={18} />
                                            <span>Add Your First Book</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('community')}
                                            className="flex items-center gap-2 bg-card-bg text-foreground border border-border px-8 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-muted hover:border-muted-foreground/30 transition-all duration-300"
                                        >
                                            <Search size={18} />
                                            <span>Browse Community</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {classGroups.map((classLabel) => (
                                        <div key={classLabel} className="animate-in fade-in duration-500">
                                            {/* Class Heading - Redesigned */}
                                            <button
                                                onClick={() => toggleSectionCollapse(classLabel)}
                                                className="w-full flex items-center gap-3 mb-5 pb-3 border-b border-border hover:border-primary-custom transition-colors group cursor-pointer"
                                            >
                                                <div className="p-1.5 bg-muted group-hover:bg-primary-custom/10 rounded-lg transition-colors">
                                                    {collapsedSections.has(classLabel) ? (
                                                        <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary-custom" />
                                                    ) : (
                                                        <ChevronUp size={16} className="text-muted-foreground group-hover:text-primary-custom" />
                                                    )}
                                                </div>
                                                <Layers size={16} className="text-muted-foreground/50 group-hover:text-primary-custom" />
                                                <h4 className="text-base font-bold text-foreground group-hover:text-primary-custom">{classLabel}</h4>
                                                <span className="text-xs font-bold text-muted-foreground bg-muted group-hover:bg-primary-custom/10 group-hover:text-primary-custom px-2.5 py-1 rounded-full transition-colors">
                                                    {groupedByClass[classLabel].length}
                                                </span>
                                                <div className="flex-1"></div>
                                                <span className="text-xs text-muted-foreground group-hover:text-primary-custom font-medium">
                                                    {collapsedSections.has(classLabel) ? 'Click to expand' : 'Click to collapse'}
                                                </span>
                                            </button>

                                            {/* Books Grid or List */}
                                            {!collapsedSections.has(classLabel) && (
                                                viewMode === 'grid' ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                                        {groupedByClass[classLabel].map((res, i) => (
                                                            <div key={i} className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-card-bg ring-1 ring-border hover:ring-2 hover:ring-primary-custom/50">

                                                                {/* Full Cover Image Area */}
                                                                <div className="absolute inset-0 w-full h-full bg-muted">
                                                                    {res.cover ? (
                                                                        <img src={res.cover} alt={res.title} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className={`w-full h-full ${res.color} flex flex-col items-center justify-center p-6 text-center`}>
                                                                            <Book className={`${res.iconColor} opacity-50 mb-3`} size={40} />
                                                                            <span className={`text-[10px] font-bold ${res.iconColor} uppercase tracking-wider opacity-60`}>{res.subject}</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* NEW Badge (top-left, only if new) */}
                                                                {isNewBook(res.dateAdded) && (
                                                                    <div className="absolute top-2 left-2 z-10">
                                                                        <span className="bg-gradient-to-r from-primary-custom to-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                                                                            <Sparkles size={10} />
                                                                            NEW
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {/* Favorite Star (bottom-right, only if favorited) */}
                                                                {res.isFavorite && (
                                                                    <div className="absolute bottom-16 right-2 z-10">
                                                                        <Star size={16} className="fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                                                                    </div>
                                                                )}

                                                                {/* Hover Overlay - Clean Actions Only */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">

                                                                    {/* Top Row: Quick Actions */}
                                                                    <div className="flex justify-between items-start transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                                        {/* Checkbox */}
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedBooks.has(res.id)}
                                                                            onChange={() => toggleSelectBook(res.id)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-5 h-5 rounded border-2 border-white cursor-pointer accent-primary-custom shadow-lg"
                                                                        />

                                                                        {/* Action Buttons */}
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    toggleFavorite(res.id);
                                                                                }}
                                                                                className="p-2 bg-white/10 hover:bg-yellow-500 rounded-lg transition-all backdrop-blur-sm"
                                                                                title="Favorite"
                                                                            >
                                                                                <Star
                                                                                    size={14}
                                                                                    className={res.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}
                                                                                />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDeleteBook(res.id);
                                                                                }}
                                                                                className="p-2 bg-white/10 hover:bg-red-500 rounded-lg transition-all backdrop-blur-sm"
                                                                                title="Delete"
                                                                            >
                                                                                <Trash2 size={14} className="text-white" />
                                                                            </button>
                                                                            <Link
                                                                                href={`/library/${res.id}/manage`}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg transition-all backdrop-blur-sm"
                                                                                title="Manage"
                                                                            >
                                                                                <Edit2 size={14} />
                                                                            </Link>
                                                                        </div>
                                                                    </div>

                                                                    {/* Bottom Info */}
                                                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                                        <div className="mb-2">
                                                                            <span className="text-[9px] font-bold text-white/90 bg-primary-custom px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                                                                {res.type}
                                                                            </span>
                                                                        </div>

                                                                        <h3 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2">{res.title}</h3>
                                                                        <p className="text-[10px] text-gray-400 font-medium mb-3">by {res.author}</p>

                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setPreviewBook(res);
                                                                                }}
                                                                                className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white hover:bg-white/30 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm backdrop-blur-sm"
                                                                            >
                                                                                <ExternalLink size={12} />
                                                                                Preview
                                                                            </button>
                                                                            <Link
                                                                                href={`/library/${res.id}`}
                                                                                className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-primary-custom py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <Book size={12} />
                                                                                Read Now
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    // List View
                                                    <div className="space-y-3">
                                                        {groupedByClass[classLabel].map((res, i) => (
                                                            <div key={i} className="group bg-card-bg rounded-xl p-4 shadow-sm hover:shadow-lg transition-all flex gap-4 items-center border border-border hover:border-primary-custom/50">
                                                                {/* Checkbox */}
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedBooks.has(res.id)}
                                                                    onChange={() => toggleSelectBook(res.id)}
                                                                    className="w-5 h-5 rounded border-2 cursor-pointer accent-primary-custom"
                                                                />

                                                                {/* Thumbnail */}
                                                                <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm">
                                                                    {res.cover ? (
                                                                        <img src={res.cover} alt={res.title} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className={`w-full h-full ${res.color} flex items-center justify-center`}>
                                                                            <Book className={res.iconColor} size={20} />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Info */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start gap-2 mb-1">
                                                                        <h4 className="font-bold text-foreground text-sm truncate">{res.title}</h4>
                                                                        {isNewBook(res.dateAdded) && (
                                                                            <span className="bg-primary-custom/10 text-primary-custom text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-primary-custom/20">
                                                                                <Sparkles size={8} />
                                                                                NEW
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">{res.author}</p>
                                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                                        <span className="bg-muted text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border">{res.subject}</span>
                                                                        {res.tags && res.tags.slice(0, 3).map((tag, idx) => (
                                                                            <span key={idx} className="bg-primary-custom/5 text-primary-custom text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary-custom/10">
                                                                                <Tag size={8} />
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Actions */}
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <button
                                                                        onClick={() => toggleFavorite(res.id)}
                                                                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-yellow-500"
                                                                    >
                                                                        <Star
                                                                            size={18}
                                                                            className={res.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setPreviewBook(res)}
                                                                        className="px-3 py-2 bg-muted hover:bg-border text-foreground rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                                                    >
                                                                        <ExternalLink size={12} />
                                                                        Preview
                                                                    </button>
                                                                    <Link
                                                                        href={`/library/${res.id}`}
                                                                        className="px-3 py-2 bg-primary-custom hover:opacity-90 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Book size={12} />
                                                                        Read
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDeleteBook(res.id)}
                                                                        className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            ) : (
                // COMMUNITY LIBRARY VIEW
                <main className="flex-1 overflow-auto p-8 bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground mb-2">Community Library</h2>
                            <p className="text-muted-foreground">Explore and add books from our public collection</p>
                        </div>

                        {/* Community Books Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {communityBooks.map(book => (
                                <div key={book.id} className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-card-bg ring-1 ring-border hover:ring-2 hover:ring-primary-custom/50">
                                    {/* Full Cover Image Area */}
                                    <div className="absolute inset-0 w-full h-full bg-muted">
                                        {book.cover ? (
                                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={`w-full h-full ${book.color} flex flex-col items-center justify-center p-6 text-center`}>
                                                <Book className={`${book.iconColor} opacity-50 mb-3`} size={40} />
                                                <span className={`text-[10px] font-bold ${book.iconColor} uppercase tracking-wider opacity-60`}>{book.subject}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Public Badge */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <span className="bg-primary-custom text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            Public
                                        </span>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="mb-2">
                                                <span className="text-[9px] font-bold text-white/90 bg-primary-custom px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                                    {book.type}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2">{book.title}</h3>
                                            <p className="text-[10px] text-gray-400 font-medium mb-3">by {book.author}</p>

                                            <div className="flex gap-2">
                                                <button
                                                    disabled
                                                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white/50 cursor-not-allowed py-2 rounded-lg text-xs font-bold transition-colors shadow-sm border border-white/10"
                                                    title="Feature Coming Soon"
                                                >
                                                    <Lock size={12} />
                                                    Soon
                                                </button>
                                                <button
                                                    disabled
                                                    className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white/50 cursor-not-allowed py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                                    title="Coming Soon"
                                                >
                                                    <Lock size={12} />
                                                    Read
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coming Soon Message */}
                        <div className="mt-20 text-center py-16 border-t border-border">
                            <h1 className="text-6xl md:text-8xl font-black text-muted-foreground/10 uppercase tracking-widest select-none">
                                COMING SOON
                            </h1>
                            <p className="mt-4 text-muted-foreground text-lg font-medium">
                                We are building a vast library for the community. Stay tuned! 🚀
                            </p>
                        </div>
                    </div>
                </main>
            )
            }

            {
                isModalOpen && typeof document !== 'undefined' ? (
                    ReactDOM.createPortal(
                        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>

                                {/* Left Side - Cover Image */}
                                <div className="w-full md:w-2/5 bg-muted p-8 flex flex-col justify-center items-center border-r border-border">
                                    <h3 className="text-xl font-bold text-foreground mb-6 w-full text-center">Book Cover</h3>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`w-48 h-64 bg-card-bg border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden shadow-sm relative group ${isDragging
                                            ? 'border-primary-custom bg-primary-custom/5 scale-105'
                                            : 'border-border hover:border-primary-custom hover:bg-primary-custom/5'
                                            }`}
                                    >
                                        {coverPreview ? (
                                            <>
                                                <img src={coverPreview} className="w-full h-full object-cover" alt="Cover preview" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Change</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-muted-foreground p-4">
                                                <div className="bg-muted p-4 rounded-full inline-block mb-3">
                                                    <Upload size={32} className="text-muted-foreground/50" />
                                                </div>
                                                <p className="text-sm font-bold text-foreground mb-1">Click or Drag to Upload</p>
                                                <p className="text-[10px] text-muted-foreground">JPG, PNG supported</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <p className="text-xs text-gray-400 mt-6 text-center max-w-[200px]">
                                        Drag & drop or click to add a cover image.
                                    </p>
                                </div>

                                {/* Right Side - Form */}
                                <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                                    <h3 className="text-2xl font-bold mb-1 text-foreground">Add New Resource</h3>
                                    <p className="text-muted-foreground text-sm mb-8">Enter the details of your book or document.</p>

                                    <form onSubmit={handleAddBook} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Title</label>
                                            <input
                                                required
                                                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-custom/20 font-medium transition-all border border-border"
                                                placeholder="e.g. Advanced Calculus"
                                                value={newBook.title}
                                                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Author</label>
                                            <input
                                                required
                                                className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-custom/20 font-medium transition-all border border-border"
                                                placeholder="e.g. James Stewart"
                                                value={newBook.author}
                                                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
                                                <input
                                                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-custom/20 font-medium transition-all border border-border"
                                                    placeholder="e.g. Mathematics"
                                                    value={newBook.subject}
                                                    onChange={(e) => setNewBook({ ...newBook, subject: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Class/Level</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">Grade</span>
                                                    <input
                                                        className="w-full bg-muted rounded-xl pl-[70px] pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-custom/20 font-medium transition-all border border-border"
                                                        placeholder="10, 11, 12..."
                                                        value={newBook.classLevel}
                                                        onChange={(e) => setNewBook({ ...newBook, classLevel: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-primary-custom text-white rounded-xl py-4 font-bold text-sm hover:opacity-90 transition-all shadow-lg mt-8 transform hover:-translate-y-1"
                                        >
                                            Add to Library
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                ) : null
            }

            {/* Quick Preview Modal */}
            {
                previewBook && typeof document !== 'undefined' ? (
                    ReactDOM.createPortal(
                        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setPreviewBook(null)}>
                            <div className="bg-card-bg rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-border" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setPreviewBook(null)}
                                    className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-border transition-colors z-10"
                                >
                                    <X size={20} className="text-muted-foreground" />
                                </button>

                                <div className="p-8">
                                    {/* Header with Cover & Basic Info */}
                                    <div className="flex gap-6 mb-6">
                                        {/* Mini Cover */}
                                        <div className="w-32 h-48 shrink-0 rounded-xl overflow-hidden shadow-md">
                                            {previewBook.cover ? (
                                                <img src={previewBook.cover} alt={previewBook.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full ${previewBook.color} flex items-center justify-center`}>
                                                    <Book className={previewBook.iconColor} size={48} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2 gap-3">
                                                <div className="flex-1">
                                                    <h2 className="text-2xl font-bold text-foreground mb-1">{previewBook.title}</h2>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <User size={14} />
                                                        {previewBook.author}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(previewBook.id);
                                                    }}
                                                    className="p-2.5 hover:bg-muted rounded-full transition-colors shrink-0"
                                                    title={previewBook.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                                >
                                                    <Star
                                                        size={24}
                                                        className={previewBook.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}
                                                    />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <div className="bg-muted rounded-lg p-3 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Subject</p>
                                                    <p className="text-sm font-bold text-foreground">{previewBook.subject || 'N/A'}</p>
                                                </div>
                                                <div className="bg-muted rounded-lg p-3 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Class</p>
                                                    <p className="text-sm font-bold text-foreground">{previewBook.classLevel || 'N/A'}</p>
                                                </div>
                                                <div className="bg-muted rounded-lg p-3 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                                                    <p className="text-sm font-bold text-foreground">{previewBook.type}</p>
                                                </div>
                                                <div className="bg-muted rounded-lg p-3 border border-border">
                                                    <p className="text-xs text-muted-foreground mb-1">Added</p>
                                                    <p className="text-sm font-bold text-foreground">
                                                        {previewBook.dateAdded ? new Date(previewBook.dateAdded).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags Section */}
                                    <div className="mb-6">
                                        <label className="text-sm font-bold text-muted-foreground mb-2 block flex items-center gap-2">
                                            <Tag size={14} className="text-primary-custom" />
                                            Custom Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {previewBook.tags && previewBook.tags.length > 0 ? (
                                                previewBook.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-primary-custom/10 text-primary-custom text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 group border border-primary-custom/20"
                                                    >
                                                        <Tag size={10} />
                                                        {tag}
                                                        <button
                                                            onClick={() => removeTag(previewBook.id, tag)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={12} className="hover:text-red-600" />
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">No tags yet</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add a tag (e.g., exam, reference)"
                                                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-custom/20 border border-border"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                        addTag(previewBook.id, e.currentTarget.value.trim());
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                    if (input.value.trim()) {
                                                        addTag(previewBook.id, input.value.trim());
                                                        input.value = '';
                                                    }
                                                }}
                                                className="px-4 py-2 bg-primary-custom text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-sm"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/library/${previewBook.id}/manage`}
                                            className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground border border-border py-3 rounded-xl font-bold text-sm hover:bg-border transition-all"
                                        >
                                            <Edit2 size={16} />
                                            Edit Book
                                        </Link>
                                        <Link
                                            href={`/library/${previewBook.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 bg-primary-custom text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md"
                                        >
                                            <Book size={16} />
                                            Read Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )
                ) : null
            }
        </div >
    );
};

export default LibraryView;
