'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Book, Clock, Download, FileText, Share2, Star, User } from 'lucide-react';

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
    chapters?: { title: string; pages: number }[];
}

const ReadBookPage = () => {
    const params = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('library_resources');
        if (saved) {
            const resources = JSON.parse(saved);
            const found = resources.find((r: any) => r.id === params.id);
            if (found) {
                setBook(found);
            }
        }
        setLoading(false);
    }, [params.id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!book) return <div className="p-10 text-center">Book not found. <Link href="/library" className="text-lime-600 underline">Go back</Link></div>;

    // Dummy chapters if none exist
    const chapters = book.chapters || [
        { title: 'Introduction to the Subject', pages: 12 },
        { title: 'Chapter 1: Basic Concepts', pages: 28 },
        { title: 'Chapter 2: Advanced Theories', pages: 34 },
        { title: 'Chapter 3: Practical Applications', pages: 22 },
        { title: 'Conclusion and References', pages: 8 },
    ];

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans">
            {/* 1. Sticky Header - This stays at top */}
            <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Back to Library</span>
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-400 hidden md:block">{book.title}</span>
                </div>
            </header>

            {/* 2. Main Split Layout - Independent Scroll Areas */}
            <main className="flex-1 flex overflow-hidden w-full items-start gap-0">

                {/* Left Panel: Book Details (Independent Scrollable Area) */}
                <aside className="w-full md:w-[320px] lg:w-[360px] shrink-0 h-full bg-white border-r-2 border-gray-200 flex flex-col shadow-sm">
                    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
                        {/* Cover Image - Modern styled */}
                        <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl relative group ring-1 ring-gray-900/5 mx-auto max-w-[280px] shrink-0">
                            {book.cover ? (
                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full ${book.color} flex flex-col items-center justify-center p-6 text-center`}>
                                    <Book className={`${book.iconColor} opacity-50 mb-4`} size={64} />
                                    <span className={`text-sm font-bold ${book.iconColor} uppercase tracking-wider opacity-60`}>{book.subject}</span>
                                </div>
                            )}
                            {/* Type Badge Overlay */}
                            <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    {book.type}
                                </span>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="text-center space-y-2 shrink-0">
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                            <p className="text-sm text-gray-500 font-medium">by <span className="text-gray-900">{book.author}</span></p>
                        </div>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-3 shrink-0">
                            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Subject</p>
                                <p className="font-bold text-gray-800 text-sm">{book.subject}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Level</p>
                                <p className="font-bold text-gray-800 text-sm">{book.classLevel}</p>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Actions - Always at bottom */}
                        <div className="shrink-0">
                            <Link
                                href={`/library/${book.id}/manage`}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-lime-600 text-white font-bold text-sm shadow-lg shadow-lime-200 hover:bg-lime-700 transition-all hover:-translate-y-0.5"
                            >
                                Manage Resource
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Content (Independent Scrollable Area) */}
                <section className="flex-1 h-full overflow-y-auto bg-gray-50/50 p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-10">
                        {/* Overview */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <FileText className="text-lime-600" size={20} />
                                Book Overview
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {book.description ||
                                    "No description available for this resource. This is a comprehensive guide tailored for students and educators. It covers essential topics, theories, and practical applications relevant to the subject matter."}
                            </p>
                        </div>

                        {/* Chapters */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Book className="text-lime-600" size={20} />
                                    <span>Table of Contents</span>
                                </h2>
                                <span className="bg-lime-100 text-lime-800 text-xs font-bold px-3 py-1 rounded-full">
                                    {chapters.length} Chapters
                                </span>
                            </div>

                            <div className="space-y-4">
                                {chapters.map((chapter, idx) => (
                                    <div
                                        key={idx}
                                        className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lime-200 transition-all cursor-pointer flex items-center gap-5"
                                    >
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-50 text-gray-400 font-bold flex items-center justify-center text-sm group-hover:bg-lime-600 group-hover:text-white transition-colors duration-300">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-lime-700 transition-colors">{chapter.title}</h4>
                                            <p className="text-xs text-gray-400 font-medium">{chapter.pages} pages • PDF</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:text-lime-600 group-hover:bg-lime-50 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReadBookPage;
