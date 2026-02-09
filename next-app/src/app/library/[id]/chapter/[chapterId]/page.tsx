'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, FileText, ZoomIn, ZoomOut, Maximize2, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getPDF, arrayBufferToBlobUrl } from '@/lib/storage';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Chapter {
    id: string;
    title: string;
    pages: number;
    storedInIndexedDB?: boolean;
    pdfUrl?: string;
}

interface Resource {
    id: string;
    title: string;
    author: string;
    chapters?: Chapter[];
}

const ChapterReaderPage = () => {
    const params = useParams();
    const router = useRouter();
    const [book, setBook] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const chapterIndex = parseInt(params.chapterId as string);

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

    // Load PDF from IndexedDB when chapter changes
    useEffect(() => {
        const loadPdfFromStorage = async () => {
            if (!book || !book.chapters || !book.chapters[chapterIndex]) return;

            const chapter = book.chapters[chapterIndex];
            setLoadingPdf(true);
            setPdfError(null);
            setPdfUrl(null);
            setCurrentPage(1);
            setNumPages(null);

            try {
                // Check if PDF is stored in IndexedDB
                if (chapter.storedInIndexedDB) {
                    const storedPdf = await getPDF(chapter.id);
                    if (storedPdf) {
                        const blobUrl = arrayBufferToBlobUrl(storedPdf.data);
                        setPdfUrl(blobUrl);
                    } else {
                        setPdfError('PDF not found in storage. Please re-upload the chapter.');
                    }
                } else if (chapter.pdfUrl) {
                    // Legacy: use the old pdfUrl if available (blob URL - won't work after refresh)
                    setPdfUrl(chapter.pdfUrl);
                } else {
                    // Fallback to sample PDF for demo
                    setPdfUrl('https://pdfobject.com/pdf/sample.pdf');
                }
            } catch (error) {
                console.error('Error loading PDF:', error);
                setPdfError('Error loading PDF. Please try again.');
            } finally {
                setLoadingPdf(false);
            }
        };

        loadPdfFromStorage();

        // Cleanup blob URLs when component unmounts or chapter changes
        return () => {
            if (pdfUrl && pdfUrl.startsWith('blob:')) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [book, chapterIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else if (e.key === 'ArrowRight' && numPages && currentPage < numPages) {
                setCurrentPage(currentPage + 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, numPages]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!book || !book.chapters || !book.chapters[chapterIndex]) {
        return <div className="p-10 text-center">Chapter not found. <Link href="/library" className="text-lime-600 underline">Go to Library</Link></div>;
    }

    const currentChapter = book.chapters[chapterIndex];
    const hasNextChapter = chapterIndex < book.chapters.length - 1;
    const hasPrevChapter = chapterIndex > 0;

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/library"
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group px-3 py-1.5 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Back to Library</span>
                    </Link>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900">{currentChapter.title}</h1>
                        <p className="text-xs text-gray-500">{book.title}</p>
                    </div>
                </div>

                {/* Chapter Navigation */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/library/${book.id}/chapter/${chapterIndex - 1}`)}
                        disabled={!hasPrevChapter}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous Chapter"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                        Chapter {chapterIndex + 1} of {book.chapters.length}
                    </span>
                    <button
                        onClick={() => router.push(`/library/${book.id}/chapter/${chapterIndex + 1}`)}
                        disabled={!hasNextChapter}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next Chapter"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            {/* Main Reader Area */}
            <main className="flex-1 flex overflow-hidden">

                {/* PDF Viewer */}
                <div className="flex-1 flex flex-col bg-gray-100">
                    {/* Sticky Toolbar */}
                    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                        {/* Main Controls */}
                        <div className="h-14 flex items-center justify-between px-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 font-medium">Page</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage <= 1}
                                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Previous Page (←)"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        value={currentPage}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value) || 1;
                                            setCurrentPage(Math.max(1, Math.min(numPages || 999, page)));
                                        }}
                                        min={1}
                                        max={numPages || 999}
                                        className="w-16 bg-gray-50 text-gray-900 text-sm text-center px-2 py-1.5 rounded border border-gray-300 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium"
                                    />
                                    <button
                                        onClick={() => setCurrentPage(Math.min(numPages || 999, currentPage + 1))}
                                        disabled={!numPages || currentPage >= numPages}
                                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Next Page (→)"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">of {numPages || '...'}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <span className="text-sm text-gray-900 font-medium w-12 text-center">{zoom}%</span>
                                <button
                                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={18} />
                                </button>
                                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                                <button
                                    onClick={() => setZoom(100)}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                    title="Reset Zoom"
                                >
                                    Reset
                                </button>
                                <button
                                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                    title="Fullscreen"
                                >
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {numPages && (
                            <div className="h-1 bg-gray-200">
                                <div
                                    className="h-full bg-lime-600 transition-all duration-300"
                                    style={{ width: `${(currentPage / numPages) * 100}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    {/* PDF Canvas */}
                    <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-8 custom-scrollbar">
                        {loadingPdf ? (
                            <div className="flex flex-col items-center justify-center p-12">
                                <Loader2 size={48} className="text-lime-500 animate-spin mb-4" />
                                <p className="text-gray-600 font-medium">Loading PDF from storage...</p>
                            </div>
                        ) : pdfError ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-lg border border-gray-200">
                                <BookOpen size={64} className="text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">PDF Not Available</h3>
                                <p className="text-gray-600 text-sm mb-4">{pdfError}</p>
                                <Link
                                    href={`/library/${book.id}/manage`}
                                    className="px-4 py-2 bg-lime-600 text-white rounded-lg font-medium hover:bg-lime-700 transition-colors"
                                >
                                    Go to Manage Book
                                </Link>
                            </div>
                        ) : pdfUrl ? (
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                loading={
                                    <div className="flex flex-col items-center justify-center p-12">
                                        <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-600 font-medium">Loading PDF...</p>
                                    </div>
                                }
                                error={
                                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-lg border border-gray-200">
                                        <BookOpen size={64} className="text-gray-300 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">PDF Not Available</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Unable to load the PDF file for this chapter.
                                        </p>
                                        <p className="text-gray-500 text-xs max-w-md text-center">
                                            Please make sure the PDF file is uploaded correctly in the Manage Book page.
                                        </p>
                                    </div>
                                }
                                className="flex justify-center"
                            >
                                <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
                                    <Page
                                        pageNumber={currentPage}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        className="shadow-2xl rounded-lg overflow-hidden"
                                    />
                                </div>
                            </Document>
                        ) : null}
                    </div>

                    {/* Quick Navigation Footer */}
                    <div className="h-12 bg-white border-t border-gray-200 px-6 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            First
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 10))}
                            disabled={currentPage <= 10}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            -10
                        </button>
                        <span className="text-xs text-gray-400 mx-2">•</span>
                        <button
                            onClick={() => setCurrentPage(Math.min(numPages || 999, currentPage + 10))}
                            disabled={!numPages || currentPage > numPages - 10}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            +10
                        </button>
                        <button
                            onClick={() => setCurrentPage(numPages || 1)}
                            disabled={!numPages || currentPage === numPages}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Last
                        </button>
                    </div>
                </div>

                {/* Chapter Sidebar */}
                <aside className="w-80 bg-white border-l-2 border-gray-200 overflow-y-auto custom-scrollbar shadow-sm">
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-lime-600" />
                            All Chapters
                        </h3>
                        <div className="space-y-2">
                            {book.chapters.map((chapter, idx) => (
                                <Link
                                    key={idx}
                                    href={`/library/${book.id}/chapter/${idx}`}
                                    className={`block p-3 rounded-lg transition-all ${idx === chapterIndex
                                        ? 'bg-lime-600 text-white shadow-md'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${idx === chapterIndex ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm mb-1 truncate">{chapter.title}</h4>
                                            <p className={`text-xs ${idx === chapterIndex ? 'text-lime-100' : 'text-gray-500'}`}>
                                                {chapter.pages} pages
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ChapterReaderPage;
