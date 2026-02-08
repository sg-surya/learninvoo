'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Plus, Upload, X, FileText, CheckCircle } from 'lucide-react';

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
        <div className="flex flex-col h-full w-full bg-gray-50/50 relative overflow-hidden">
            {/* Header - Sticky */}
            <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Cancel & Back</span>
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors text-sm"
                    >
                        <Trash2 size={16} />
                        Delete Book
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-600 text-white font-bold hover:bg-lime-700 transition-colors shadow-lg shadow-lime-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
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
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto pb-10">
                    {/* Left Column: Metadata Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-100 pb-2">Book Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Title</label>
                                    <input
                                        value={book.title}
                                        onChange={(e) => setBook({ ...book, title: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Author</label>
                                    <input
                                        value={book.author}
                                        onChange={(e) => setBook({ ...book, author: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subject</label>
                                    <input
                                        value={book.subject}
                                        onChange={(e) => setBook({ ...book, subject: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-lime-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-100 pb-2">Description</h3>
                            <textarea
                                value={book.description || ''}
                                onChange={(e) => setBook({ ...book, description: e.target.value })}
                                className="w-full h-32 bg-gray-50 border-none rounded-xl px-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-lime-500/50 outline-none resize-none"
                                placeholder="Add a brief overview of this book..."
                            />
                        </div>
                    </div>

                    {/* Right Column: Chapter Management */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                    <FileText className="text-lime-600" size={20} />
                                    Manage Chapters
                                </h3>
                                <button
                                    onClick={() => chapterInputRef.current?.focus()}
                                    className="text-xs font-bold text-lime-600 bg-lime-50 px-3 py-1 rounded-lg hover:bg-lime-100 transition-colors"
                                >
                                    + Add Chapter
                                </button>
                            </div>

                            {/* Add Chapter Form */}
                            <form onSubmit={handleAddChapter} className="bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200 mb-6 flex gap-3 items-center">
                                <div className="flex-1">
                                    <input
                                        ref={chapterInputRef}
                                        value={newChapterTitle}
                                        onChange={(e) => setNewChapterTitle(e.target.value)}
                                        placeholder="Enter Chapter Title (e.g. Chapter 4: Thermodynamics)"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newChapterTitle}
                                    className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </form>

                            {/* Chapter List */}
                            <div className="space-y-3">
                                {(book.chapters && book.chapters.length > 0) ? (
                                    book.chapters.map((chapter, idx) => (
                                        <div key={chapter.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group hover:border-lime-200 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 font-bold flex items-center justify-center text-xs">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{chapter.title}</h4>
                                                    <p className="text-[10px] text-gray-400">{chapter.pages} pages • PDF Uploaded</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => removeChapter(chapter.id)}
                                                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <Upload className="mx-auto mb-3 opacity-20" size={48} />
                                        <p>No chapters added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageBookPage;
