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
    const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
    const chapterInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedPDF(file);
            // Auto-fill chapter name from filename if empty
            if (!newChapterTitle) {
                const fileName = file.name.replace('.pdf', '').replace(/_/g, ' ');
                setNewChapterTitle(fileName);
            }
        } else {
            alert('Please select a valid PDF file');
        }
    };

    const handleAddChapter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!book || !selectedPDF) {
            alert('Please select a PDF file to upload');
            return;
        }

        // Get chapter title (use filename if not provided)
        const chapterTitle = newChapterTitle || selectedPDF.name.replace('.pdf', '');

        const newChapter = {
            id: Date.now().toString(),
            title: chapterTitle,
            pages: Math.floor(Math.random() * 50) + 5, // Simulating page count
            fileName: selectedPDF.name,
            fileSize: (selectedPDF.size / 1024).toFixed(2) + ' KB'
        };

        setBook({
            ...book,
            chapters: [...(book.chapters || []), newChapter]
        });

        // Reset form
        setNewChapterTitle('');
        setSelectedPDF(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
        <div className="h-screen flex flex-col bg-gray-50 font-sans">
            {/* 1. Sticky Header */}
            <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
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

            {/* 2. Main Split Layout - Independent Scroll Areas */}
            <main className="flex-1 flex overflow-hidden w-full items-start gap-0">

                {/* Left Panel: Book Identity Form (Fixed Height, Scrollable Content) */}
                <aside className="w-full md:w-[320px] lg:w-[360px] shrink-0 h-full bg-white border-r-2 border-gray-200 flex flex-col shadow-sm">
                    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
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
                    </div>
                </aside>

                {/* Right Panel: Modern Content Management */}
                <section className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50 custom-scrollbar">
                    <div className="max-w-4xl mx-auto p-8 space-y-6">

                        {/* Overview Section - Enhanced */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                            {/* Section Header */}
                            <div className="bg-gradient-to-r from-lime-50 to-green-50 px-6 py-4 border-b border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-lime-600 flex items-center justify-center shadow-md">
                                            <FileText className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Book Overview</h3>
                                            <p className="text-xs text-gray-500">Describe what this book is about</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <textarea
                                    value={book.description || ''}
                                    onChange={(e) => setBook({ ...book, description: e.target.value })}
                                    className="w-full h-40 bg-gray-50 border-2 border-gray-200 focus:border-lime-500 rounded-2xl px-5 py-4 text-sm text-gray-700 focus:ring-4 focus:ring-lime-500/10 outline-none resize-none transition-all"
                                    placeholder="✍️ Write a compelling description for this book... Explain what students will learn, key topics covered, and why this resource is valuable."
                                />
                            </div>
                        </div>

                        {/* Chapter Management - Completely New Design */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                            {/* Section Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                                            <Book className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Chapter Management</h3>
                                            <p className="text-xs text-gray-500">Organize your book's content structure</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
                                            {(book.chapters || []).length} {(book.chapters || []).length === 1 ? 'Chapter' : 'Chapters'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Add Chapter - PDF Upload Based */}
                                <form onSubmit={handleAddChapter} className="mb-6">
                                    <div className="bg-gradient-to-r from-lime-50 to-green-50 p-5 rounded-2xl border-2 border-dashed border-lime-300 hover:border-lime-500 transition-all space-y-4">

                                        {/* File Upload Area */}
                                        <div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="pdf-upload"
                                            />

                                            {!selectedPDF ? (
                                                <label
                                                    htmlFor="pdf-upload"
                                                    className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer bg-white/80 rounded-xl border-2 border-lime-200 hover:border-lime-400 hover:bg-white transition-all group"
                                                >
                                                    <Upload size={32} className="text-lime-600 mb-3 group-hover:scale-110 transition-transform" />
                                                    <p className="font-bold text-gray-900 mb-1">Click to upload PDF</p>
                                                    <p className="text-xs text-gray-500">or drag and drop your chapter file here</p>
                                                </label>
                                            ) : (
                                                <div className="bg-white rounded-xl p-4 border-2 border-lime-400 shadow-sm">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FileText className="text-red-600" size={24} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 text-sm truncate">{selectedPDF.name}</h4>
                                                            <p className="text-xs text-gray-500">{(selectedPDF.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedPDF(null);
                                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                                            }}
                                                            className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Chapter Name Input (Optional) */}
                                        {selectedPDF && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-700 block">
                                                    Chapter Name <span className="text-gray-400 font-normal">(Optional - auto-filled from PDF)</span>
                                                </label>
                                                <input
                                                    ref={chapterInputRef}
                                                    value={newChapterTitle}
                                                    onChange={(e) => setNewChapterTitle(e.target.value)}
                                                    placeholder="e.g., Chapter 1: Introduction to Algebra"
                                                    className="w-full bg-white border-2 border-lime-200 focus:border-lime-500 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-500/10 transition-all"
                                                />
                                            </div>
                                        )}

                                        {/* Upload Button */}
                                        {selectedPDF && (
                                            <button
                                                type="submit"
                                                className="w-full bg-lime-600 text-white px-5 py-3.5 rounded-xl hover:bg-lime-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-bold text-sm"
                                            >
                                                <Plus size={18} />
                                                Add Chapter to Book
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {/* Chapter List - Modern Cards */}
                                <div className="space-y-3">
                                    {(book.chapters && book.chapters.length > 0) ? (
                                        book.chapters.map((chapter, idx) => (
                                            <div key={chapter.id} className="group relative">
                                                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 rounded-xl border-2 border-gray-200 hover:border-lime-400 hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-4">
                                                        {/* Chapter Number Badge */}
                                                        <div className="flex-shrink-0">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                                                                {idx + 1}
                                                            </div>
                                                        </div>

                                                        {/* Chapter Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{chapter.title}</h4>
                                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <FileText size={12} />
                                                                    {chapter.pages} pages
                                                                </span>
                                                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">PDF</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                className="p-2.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                                                                title="Upload Content"
                                                            >
                                                                <Upload size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => removeChapter(chapter.id)}
                                                                className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                                                                title="Delete Chapter"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 px-6">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Book size={40} className="text-gray-300" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">No chapters added yet</h4>
                                            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                                                Start building your book by adding chapters above. Each chapter can contain multiple pages and resources.
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-lime-600 text-sm font-medium">
                                                ↑ Use the input field above to add your first chapter
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
};

export default ManageBookPage;
