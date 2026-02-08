'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { Book, Download, ExternalLink, Search, Plus, X, Image as ImageIcon, Edit2 } from 'lucide-react';

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

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) {
            setResources(JSON.parse(saved));
        }
    }, []);

    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        subject: '',
        classLevel: '',
        type: 'PDF'
    });

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

        const resource: Resource = {
            id: newId,
            ...newBook,
            cover: coverPreview || undefined,
            color: randomTheme.color,
            iconColor: randomTheme.iconColor
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

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden font-sans">
            {/* 1. Fixed Header */}
            <header className="shrink-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 flex justify-between items-center sticky top-0 z-50">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Library</h2>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search library..."
                            className="bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-500/20 w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-lime-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-lime-700 transition-all hover:shadow-lg"
                    >
                        <Plus size={18} />
                        <span>Add Book</span>
                    </button>
                </div>
            </header>

            {/* 2. Main Split Layout */}
            <main className="flex-1 flex overflow-hidden w-full items-start">

                {/* Left Sidebar - Filters (Static) */}
                <aside className="w-64 shrink-0 h-auto min-h-0 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 hidden md:flex">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Collections</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-3 text-sm font-bold text-lime-700 bg-lime-50 px-3 py-2 rounded-lg cursor-pointer">
                                <Book size={16} />
                                All Books
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                                <Download size={16} />
                                Downloads
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                                <ExternalLink size={16} />
                                Recent
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Subjects</h3>
                        <ul className="space-y-2">
                            {['Mathematics', 'Science', 'History', 'Literature', 'Computer Science'].map((subject) => (
                                <li key={subject} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black cursor-pointer group">
                                    <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-lime-500 transition-colors" />
                                    {subject}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Right Content - Scrollable Grid */}
                <section className="flex-1 h-full overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {resources.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <Book size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Your library is empty</h3>
                            <p className="text-gray-400 max-w-xs mx-auto mb-8 text-sm">Start adding your favorite academic books and resources to keep them organized.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-lime-600 font-bold hover:underline flex items-center gap-2 mx-auto text-sm"
                            >
                                <Plus size={16} />
                                Add your first book
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 animate-in fade-in duration-500 pb-20">
                            {resources.map((res, i) => (
                                <div key={i} className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-white ring-1 ring-gray-100 hover:ring-2 hover:ring-lime-500/50">

                                    {/* Full Cover Image Area */}
                                    <div className="absolute inset-0 w-full h-full bg-gray-50">
                                        {res.cover ? (
                                            <img src={res.cover} alt={res.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={`w-full h-full ${res.color} flex flex-col items-center justify-center p-6 text-center`}>
                                                <Book className={`${res.iconColor} opacity-50 mb-3`} size={40} />
                                                <span className={`text-[10px] font-bold ${res.iconColor} uppercase tracking-wider opacity-60`}>{res.subject}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Overlay with Details */}
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 backdrop-blur-sm">

                                        {/* Top Actions */}
                                        <div className="flex justify-end transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Link
                                                href={`/library/${res.id}/manage`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg transition-all"
                                                title="Manage"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                        </div>

                                        {/* Bottom Info */}
                                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="mb-2">
                                                <span className="text-[9px] font-bold text-white/90 bg-lime-600 px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                                    {res.type}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2">{res.title}</h3>
                                            <p className="text-[10px] text-gray-400 font-medium mb-3">by {res.author}</p>

                                            <Link
                                                href={`/library/${res.id}`}
                                                className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-lime-400 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Read Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {isModalOpen && typeof document !== 'undefined' ? (
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
                            <div className="w-full md:w-2/5 bg-gray-50 p-8 flex flex-col justify-center items-center border-r border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 w-full text-center">Book Cover</h3>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-48 h-64 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-lime-500 hover:bg-lime-50/50 transition-all overflow-hidden shadow-sm relative group"
                                >
                                    {coverPreview ? (
                                        <>
                                            <img src={coverPreview} className="w-full h-full object-cover" alt="Cover preview" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Change</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-400 p-4">
                                            <div className="bg-gray-100 p-4 rounded-full inline-block mb-3">
                                                <ImageIcon size={32} className="text-gray-300" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-500 mb-1">Click to Upload</p>
                                            <p className="text-[10px] text-gray-400">JPG, PNG supported</p>
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
                                    A great cover helps you identify your resources quickly.
                                </p>
                            </div>

                            {/* Right Side - Form */}
                            <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                                <h3 className="text-2xl font-bold mb-1 text-gray-800">Add New Resource</h3>
                                <p className="text-gray-400 text-sm mb-8">Enter the details of your book or document.</p>

                                <form onSubmit={handleAddBook} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                                        <input
                                            required
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium transition-all"
                                            placeholder="e.g. Advanced Calculus"
                                            value={newBook.title}
                                            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
                                        <input
                                            required
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium transition-all"
                                            placeholder="e.g. James Stewart"
                                            value={newBook.author}
                                            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                                            <input
                                                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium transition-all"
                                                placeholder="e.g. Mathematics"
                                                value={newBook.subject}
                                                onChange={(e) => setNewBook({ ...newBook, subject: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Class/Level</label>
                                            <input
                                                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium transition-all"
                                                placeholder="e.g. Grade 12"
                                                value={newBook.classLevel}
                                                onChange={(e) => setNewBook({ ...newBook, classLevel: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-lime-900 text-white rounded-xl py-4 font-bold text-sm hover:bg-black transition-all shadow-lg mt-8 transform hover:-translate-y-1"
                                    >
                                        Add to Library
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            ) : null}
        </div>
    );
};

export default LibraryView;
