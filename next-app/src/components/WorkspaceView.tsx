'use client';

import React, { useState, useEffect } from 'react';
import {
    Search, Filter, FileText, Image, Sparkles,
    BookOpen, Trash2, ExternalLink, Clock, Loader2,
    FileQuestion, GraduationCap, Globe, ScrollText, FolderOpen
} from 'lucide-react';
import {
    getAllGeneratedContent,
    deleteGeneratedContent,
    GeneratedContent,
    getTypeColor,
    getToolDisplayName
} from '@/lib/storage';
import Link from 'next/link';

const WorkspaceView: React.FC = () => {
    const [resources, setResources] = useState<GeneratedContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [deleting, setDeleting] = useState<string | null>(null);

    // Load resources from IndexedDB
    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        setLoading(true);
        try {
            const content = await getAllGeneratedContent();
            setResources(content);
        } catch (error) {
            console.error('Error loading workspace resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this content?')) return;

        setDeleting(id);
        try {
            await deleteGeneratedContent(id);
            setResources(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('Error deleting content. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    // Get icon for content type
    const getTypeIcon = (type: GeneratedContent['type']) => {
        const icons: Record<string, React.ReactNode> = {
            'lesson-plan': <GraduationCap size={24} />,
            'quiz': <FileQuestion size={24} />,
            'visual': <Image size={24} />,
            'story': <ScrollText size={24} />,
            'hyper-local': <Globe size={24} />,
            'rubric': <FileText size={24} />,
            'simulation': <Sparkles size={24} />,
            'other': <FileText size={24} />,
        };
        return icons[type] || icons['other'];
    };

    // Filter resources
    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (res.description?.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'all' || res.type === filterType;
        return matchesSearch && matchesType;
    });

    // Format date
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (hours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get unique types for filter
    const uniqueTypes = [...new Set(resources.map(r => r.type))];

    return (
        <div className="p-8 w-full min-h-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-lime-200">
                            <FolderOpen size={20} />
                        </div>
                        My Workspace
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        All your generated content, saved and organized.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-200 focus:bg-white w-full md:w-64 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none bg-white border border-gray-100 px-4 py-2.5 pr-10 rounded-xl text-sm font-medium text-gray-600 hover:bg-lime-50 hover:text-lime-700 transition-all cursor-pointer focus:ring-2 focus:ring-lime-200"
                        >
                            <option value="all">All Types</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                                </option>
                            ))}
                        </select>
                        <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </header>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={48} className="text-lime-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading your workspace...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FolderOpen size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {searchQuery || filterType !== 'all' ? 'No matching content found' : 'Your workspace is empty'}
                    </h3>
                    <p className="text-gray-500 max-w-md mb-6">
                        {searchQuery || filterType !== 'all'
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Generate content using our AI tools and save it here for quick access.'}
                    </p>
                    {!searchQuery && filterType === 'all' && (
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-gradient-to-r from-lime-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-lime-200 hover:shadow-xl transition-all"
                        >
                            Explore AI Tools
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Stats Bar */}
                    <div className="flex gap-3 mb-6 flex-wrap">
                        <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600">
                            {filteredResources.length} item{filteredResources.length !== 1 ? 's' : ''}
                        </div>
                        {filterType !== 'all' && (
                            <button
                                onClick={() => setFilterType('all')}
                                className="px-4 py-2 bg-lime-50 border border-lime-200 rounded-xl text-sm font-medium text-lime-700 hover:bg-lime-100 transition-all"
                            >
                                Clear filter ✕
                            </button>
                        )}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((res) => {
                            const colors = getTypeColor(res.type);
                            return (
                                <div
                                    key={res.id}
                                    className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-lime-50 transition-all group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <span className={colors.text}>{getTypeIcon(res.type)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={12} />
                                            {formatDate(res.createdAt)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{res.title}</h3>
                                    <p className="text-sm text-gray-400 mb-2">
                                        {getToolDisplayName(res.toolId)}
                                    </p>
                                    {res.bookTitle && (
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                                            <BookOpen size={12} />
                                            <span className="truncate">{res.bookTitle}</span>
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {res.contentType === 'text' && (
                                        <p className="text-sm text-gray-500 line-clamp-3 mb-4 bg-gray-50 p-3 rounded-xl">
                                            {res.content.substring(0, 150)}...
                                        </p>
                                    )}
                                    {res.contentType === 'image' && res.imageUrl && (
                                        <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 h-32">
                                            <img
                                                src={res.imageUrl}
                                                alt={res.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => handleDelete(res.id)}
                                            disabled={deleting === res.id}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                        >
                                            {deleting === res.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                        <Link
                                            href={`/tools/${res.toolId}`}
                                            className="flex items-center gap-1.5 text-lime-600 text-sm font-bold hover:underline"
                                        >
                                            Open in Tool
                                            <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkspaceView;
