'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Plus, Upload, FileText, CheckCircle, Book } from 'lucide-react';
import Link from 'next/link';

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
    description?: string;
    chapters?: { id: string; title: string; pages: number }[];
}

const ManageBookPage = () => {
    const params = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Chapter Upload State
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const chapterInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) {
            const resources = JSON.parse(saved);
            const found = resources.find((r: any) => r.id === params.id);
            if (found) {
                // Ensure chapters array exists
                if (!found.chapters) found.chapters = [];
                setBook(found);
            }
        }
        setLoading(false);
    }, [params.id]);

    const handleSave = () => {
        if (!book) return;
        setSaving(true);

        const saved = localStorage.getItem('library_resources');
        if (saved) {
            const resources = JSON.parse(saved);
            const updatedResources = resources.map((r: any) => r.id === book.id ? book : r);
            localStorage.setItem('library_resources', JSON.stringify(updatedResources));
        }

        setTimeout(() => {
            setSaving(false);
            router.push(`/library/${book.id}`); // corrected typo in path
        }, 800);
    };

    const handleDelete = () => {
        if (!book || !confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;

        const saved = localStorage.getItem('library_resources');
        if (saved) {
            const resources = JSON.parse(saved);
            const updatedResources = resources.filter((r: any) => r.id !== book.id);
            localStorage.setItem('library_resources', JSON.stringify(updatedResources));
            router.push('/library');
        }
    };

    const handleAddChapter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!book || !newChapterTitle) return;

        const newChapter = {
            id: Date.now().toString(),
            title: newChapterTitle,
            pages: Math.floor(Math.random() * 50) + 5 // Simulating page count
        };

        setBook({
            ...book,
            chapters: [...(book.chapters || []), newChapter]
        });
        setNewChapterTitle('');
    };

    const removeChapter = (chapterId: string) => {
        if (!book) return;
        setBook({
            ...book,
            chapters: (book.chapters || []).filter(c => c.id !== chapterId)
        });
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!book) return <div className="p-10 text-center">Book not found.</div>;

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
            {/* 1. Fixed Header */}
            <header className="shrink-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between z-50 sticky top-0">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Cancel & Back</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors text-xs uppercase tracking-wider"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-lime-600 text-white font-bold hover:bg-lime-700 transition-all shadow-md shadow-lime-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* 2. Main Split Layout */}
            <main className="flex-1 flex overflow-hidden w-full items-start">

                {/* Left Panel: Book Identity Form (Static) */}
                <aside className="w-full md:w-[320px] lg:w-[360px] shrink-0 h-auto bg-white p-6 flex flex-col gap-6 border-r border-gray-200">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Book Identity</div>

                    {/* Cover Preview */}
                    <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-xl relative group ring-1 ring-gray-900/5 mx-auto max-w-[200px] bg-gray-50 flex items-center justify-center">
                        {book.cover ? (
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <Book className="text-gray-300" size={48} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Change Cover
                            </span>
                        </div>
                        {/* Note: Actual image upload logic would go here, reusing the modal logic or adding a file input */}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Title</label>
                            <input
                                value={book.title}
                                onChange={(e) => setBook({ ...book, title: e.target.value })}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-lime-500 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Author</label>
                            <input
                                value={book.author}
                                onChange={(e) => setBook({ ...book, author: e.target.value })}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-lime-500 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Subject</label>
                                <input
                                    value={book.subject}
                                    onChange={(e) => setBook({ ...book, subject: e.target.value })}
                                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-lime-500 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Level</label>
                                <input
                                    value={book.classLevel}
                                    onChange={(e) => setBook({ ...book, classLevel: e.target.value })}
                                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-lime-500 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-lime-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Description & Content */}
                <section className="flex-1 h-full overflow-y-auto bg-gray-50/50 p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-8">

                        {/* Description */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="text-lime-600" size={20} />
                                Description / Overview
                            </h3>
                            <textarea
                                value={book.description || ''}
                                onChange={(e) => setBook({ ...book, description: e.target.value })}
                                className="w-full h-32 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm text-gray-600 focus:ring-2 focus:ring-lime-500/50 outline-none resize-none"
                                placeholder="Add a brief overview of this book..."
                            />
                        </div>

                        {/* Chapters */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Book className="text-lime-600" size={20} />
                                    Manage Content
                                </h3>
                                <div className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                                    {(book.chapters || []).length} Chapters
                                </div>
                            </div>

                            {/* Add Chapter Input */}
                            <form onSubmit={handleAddChapter} className="bg-gray-50/50 p-2 rounded-2xl border border-dashed border-gray-200 mb-6 flex gap-2 items-center focus-within:border-lime-500/50 focus-within:bg-white transition-all">
                                <div className="flex-1">
                                    <input
                                        ref={chapterInputRef}
                                        value={newChapterTitle}
                                        onChange={(e) => setNewChapterTitle(e.target.value)}
                                        placeholder="Type chapter title and press Enter..."
                                        className="w-full bg-transparent border-none px-4 py-2 text-sm font-medium focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newChapterTitle}
                                    className="bg-black text-white p-2 rounded-xl hover:bg-lime-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </form>

                            {/* Chapter List */}
                            <div className="space-y-3">
                                {(book.chapters && book.chapters.length > 0) ? (
                                    book.chapters.map((chapter, idx) => (
                                        <div key={chapter.id} className="flex items-center justify-between p-3 pl-4 bg-white border border-gray-100 rounded-xl group hover:border-lime-200 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 font-bold flex items-center justify-center text-xs group-hover:bg-lime-100 group-hover:text-lime-700 transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{chapter.title}</h4>
                                                    <p className="text-[10px] text-gray-400 font-medium">{chapter.pages} pages • PDF</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeChapter(chapter.id)}
                                                className="p-2 text-gray-300 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                title="Remove Chapter"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-300 border-2 border-dashed border-gray-50 rounded-2xl">
                                        <div className="mb-2">
                                            <CheckCircle size={32} className="mx-auto opacity-20" />
                                        </div>
                                        <p className="text-xs">No chapters yet. Add one above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ManageBookPage;
