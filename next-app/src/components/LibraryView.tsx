
'use client';

import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Book, Download, ExternalLink, Search, Plus, X, Image as ImageIcon } from 'lucide-react';

interface Resource {
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
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBook.title || !newBook.author) return;

        const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

        const resource: Resource = {
            ...newBook,
            cover: coverPreview || undefined,
            color: randomTheme.color,
            iconColor: randomTheme.iconColor
        };

        setResources([resource, ...resources]);
        resetForm();
        setIsModalOpen(false);
    };

    const resetForm = () => {
        setNewBook({ title: '', author: '', subject: '', classLevel: '', type: 'PDF' });
        setCoverPreview(null);
    };

    return (
        <div className="p-8 w-full min-h-full relative">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Library</h2>
                    <p className="text-gray-400 text-sm">Your personal collection of academic books and guides.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search library..."
                            className="bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-100 w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-lime-900 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-black transition-all"
                    >
                        <Plus size={18} />
                        <span className="text-sm">Add Book</span>
                    </button>
                </div>
            </header>

            {resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                        <Book size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your library is empty</h3>
                    <p className="text-gray-400 max-w-xs mx-auto mb-8">Start adding your favorite academic books and resources to keep them organized.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-lime-600 font-bold hover:underline flex items-center gap-2 mx-auto"
                    >
                        <Plus size={18} />
                        Add your first book
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 animate-in fade-in duration-500 pb-10">
                    {resources.map((res, i) => (
                        <div key={i} className="group relative aspect-[2/3] perspective-1000 cursor-pointer">
                            <div className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:-translate-y-4">
                                {/* Book Spine Effect - Left Edge Shadow */}
                                <div className="absolute left-0 top-0 bottom-0 w-[4%] bg-gradient-to-r from-black/20 to-transparent z-20 rounded-l-md"></div>

                                {/* Book Cover & Content Container */}
                                <div className="absolute inset-0 bg-white rounded-r-xl rounded-l-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden flex flex-col border border-gray-100">

                                    {/* Cover Image Area */}
                                    <div className="h-[70%] w-full relative overflow-hidden bg-gray-50">
                                        {res.cover ? (
                                            <img src={res.cover} alt={res.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={`w-full h-full ${res.color} flex flex-col items-center justify-center p-4 text-center`}>
                                                <Book className={`${res.iconColor} opacity-50 mb-2`} size={40} />
                                                <span className={`text-[10px] font-bold ${res.iconColor} uppercase tracking-wider opacity-60`}>{res.subject}</span>
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider">
                                            {res.type}
                                        </div>
                                    </div>

                                    {/* Book Details (Bottom part) */}
                                    <div className="h-[30%] p-3 flex flex-col justify-between bg-white relative">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1" title={res.title}>{res.title}</h3>
                                            <p className="text-[10px] text-gray-400 font-medium line-clamp-1">by {res.author}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                                            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase">{res.classLevel}</span>
                                            <div className="flex gap-2">
                                                <button className="text-gray-300 hover:text-lime-600 transition-colors">
                                                    <Download size={14} />
                                                </button>
                                                <button className="text-gray-300 hover:text-lime-600 transition-colors">
                                                    <ExternalLink size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pages Effect (Right Side/Bottom) - Gives thickness */}
                                <div className="absolute right-[2px] top-[2px] bottom-[2px] w-[3px] bg-gray-200 z-0 rounded-r-sm translate-x-[2px] translate-y-[2px]"></div>
                                <div className="absolute bottom-0 left-[2px] right-[2px] h-[3px] bg-gray-200 z-0 rounded-b-sm translate-y-[2px]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
