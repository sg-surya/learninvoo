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
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 animate-in fade-in duration-500">
            {/* Back Navigation */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Library</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
                {/* Left Column: Book Identity */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    {/* Cover Image Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg mb-6 relative group">
                            {book.cover ? (
                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full ${book.color} flex flex-col items-center justify-center p-6 text-center`}>
                                    <Book className={`${book.iconColor} opacity-50 mb-4`} size={64} />
                                    <span className={`text-sm font-bold ${book.iconColor} uppercase tracking-wider opacity-60`}>{book.subject}</span>
                                </div>
                            )}
                        </div>

                        <div className="text-center w-full space-y-2 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                            <p className="text-gray-500 font-medium">by <span className="text-gray-800">{book.author}</span></p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className="bg-gray-50 p-3 rounded-xl text-center">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Subject</p>
                                <p className="font-bold text-gray-800 text-sm">{book.subject}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl text-center">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Level</p>
                                <p className="font-bold text-gray-800 text-sm">{book.classLevel}</p>
                            </div>
                        </div>

                        <Link
                            href={`/library/${book.id}/manage`}
                            className="w-full border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-3"
                        >
                            Manage / Edit
                        </Link>

                        <button className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <Download size={18} />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Right Column: Content & Chapters */}
                <div className="w-full lg:w-2/3 space-y-8">
                    {/* Overview Section */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="text-lime-600" size={24} />
                            Book Overview
                        </h2>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed">
                            <p>
                                {book.description ||
                                    "No description available for this resource. This is a comprehensive guide tailored for students and educators. It covers essential topics, theories, and practical applications relevant to the subject matter. Designed to enhance learning outcomes and provide structured knowledge."}
                            </p>
                        </div>
                    </section>

                    {/* Chapters List */}
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Book className="text-lime-600" size={24} />
                                Table of Contents
                            </h2>
                            <span className="text-sm font-medium text-gray-400">{chapters.length} Chapters</span>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                            {chapters.map((chapter, idx) => (
                                <div
                                    key={idx}
                                    className="p-5 hover:bg-lime-50/50 transition-colors group cursor-pointer flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 font-bold flex items-center justify-center text-sm group-hover:bg-lime-200 group-hover:text-lime-800 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm md:text-base group-hover:text-lime-900 transition-colors">{chapter.title}</h4>
                                            <p className="text-xs text-gray-400">{chapter.pages} pages</p>
                                        </div>
                                    </div>

                                    <button className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-600 group-hover:bg-lime-600 group-hover:text-white group-hover:border-lime-600 transition-all shadow-sm">
                                        Read
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReadBookPage;
