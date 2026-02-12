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
        <div className="h-screen flex flex-col bg-background font-sans text-foreground">
            {/* 1. Sticky Header - This stays at top */}
            <header className="sticky top-0 z-50 h-16 bg-card-bg/95 backdrop-blur-md border-b border-border px-6 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group px-3 py-1.5 rounded-lg hover:bg-muted"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Back to Library</span>
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground hidden md:block">{book.title}</span>
                </div>
            </header>

            {/* 2. Main Split Layout - Independent Scroll Areas */}
            <main className="flex-1 flex overflow-hidden w-full items-start gap-0">

                {/* Left Panel: Book Details (Independent Scrollable Area) */}
                <aside className="w-full md:w-[320px] lg:w-[360px] shrink-0 h-full bg-card-bg border-r-2 border-border flex flex-col shadow-sm">
                    <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
                        {/* Cover Image - Modern styled */}
                        <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl relative group ring-1 ring-border/20 mx-auto max-w-[280px] shrink-0">
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
                            <h1 className="text-2xl font-bold text-foreground leading-tight">{book.title}</h1>
                            <p className="text-sm text-muted-foreground font-medium">by <span className="text-foreground">{book.author}</span></p>
                        </div>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-3 shrink-0">
                            <div className="bg-muted p-3 rounded-xl text-center border border-border">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Subject</p>
                                <p className="font-bold text-foreground text-sm">{book.subject}</p>
                            </div>
                            <div className="bg-muted p-3 rounded-xl text-center border border-border">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Level</p>
                                <p className="font-bold text-foreground text-sm">{book.classLevel}</p>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Actions - Always at bottom */}
                        <div className="shrink-0">
                            <Link
                                href={`/library/${book.id}/manage`}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-custom text-white font-bold text-sm shadow-lg shadow-primary-custom/20 hover:bg-primary-custom/90 transition-all hover:-translate-y-0.5"
                            >
                                Manage Resource
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Content (Independent Scrollable Area) */}
                <section className="flex-1 h-full overflow-y-auto bg-background p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-10">
                        {/* Overview */}
                        <div className="bg-card-bg p-8 rounded-3xl shadow-sm border border-border">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b border-border pb-3">
                                <FileText className="text-primary-custom" size={20} />
                                Book Overview
                            </h2>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                {book.description ||
                                    "No description available for this resource. This is a comprehensive guide tailored for students and educators. It covers essential topics, theories, and practical applications relevant to the subject matter."}
                            </p>
                        </div>

                        {/* Chapters */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Book className="text-primary-custom" size={20} />
                                    <span>Table of Contents</span>
                                </h2>
                                <span className="bg-primary-custom/10 text-primary-custom text-xs font-bold px-3 py-1 rounded-full border border-primary-custom/20">
                                    {chapters.length} Chapters
                                </span>
                            </div>

                            <div className="space-y-4">
                                {chapters.map((chapter, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/library/${book.id}/chapter/${idx}`}
                                        className="group bg-card-bg p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary-custom transition-all cursor-pointer flex items-center gap-5"
                                    >
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-muted text-muted-foreground font-bold flex items-center justify-center text-sm group-hover:bg-primary-custom group-hover:text-white transition-colors duration-300">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-foreground mb-1 group-hover:text-primary-custom transition-colors">{chapter.title}</h4>
                                            <p className="text-xs text-muted-foreground font-medium">{chapter.pages} pages • PDF</p>
                                        </div>
                                        <div className="bg-muted p-2 rounded-full text-muted-foreground/30 group-hover:text-primary-custom group-hover:bg-primary-custom/10 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                    </Link>
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
