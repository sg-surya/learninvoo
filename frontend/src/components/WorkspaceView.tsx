'use client';

import React, { useState, useEffect } from 'react';
import {
    Search, Filter, FileText, Image, Sparkles,
    BookOpen, Trash2, ExternalLink, Clock, Loader2,
    FileQuestion, GraduationCap, Globe, ScrollText, FolderOpen,
    X, Copy, Download, Maximize2, CheckCircle
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
    const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
    const [copied, setCopied] = useState(false);

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
    const getTypeIcon = (type: string, size: number = 24) => {
        const icons: Record<string, React.ReactNode> = {
            'lesson-plan': <GraduationCap size={size} />,
            'quiz': <FileQuestion size={size} />,
            'visual': <Image size={size} />,
            'story': <ScrollText size={size} />,
            'hyper-local': <Globe size={size} />,
            'rubric': <FileText size={size} />,
            'simulation': <Sparkles size={size} />,
            'other': <FileText size={size} />,
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

    // Copy content to clipboard
    const handleCopy = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Render structured JSON content
    const renderStructuredContent = (data: any) => {
        if (!data || typeof data !== 'object') return <p>{String(data)}</p>;

        return (
            <div className="space-y-8 pb-10">
                {/* Specific Layout for Lesson Plans/Summaries */}
                {data.title && (
                    <div className="border-b-2 border-primary-custom/20 pb-4 mb-6">
                        <h1 className="text-3xl font-black text-foreground tracking-tight">{data.title}</h1>
                        {data.subtitle && <p className="text-lg font-bold text-muted-foreground italic mt-1">{data.subtitle}</p>}
                    </div>
                )}

                <div className="grid gap-8">
                    {Object.entries(data).map(([key, value], i) => {
                        if (['title', 'subtitle'].includes(key)) return null;

                        return (
                            <section key={key} className="relative">
                                <h3 className="text-xs font-black text-primary-custom uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary-custom rounded-full" />
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>

                                <div className="ml-3.5 border-l border-border pl-6">
                                    {Array.isArray(value) ? (
                                        <div className="space-y-3">
                                            {value.map((item, j) => (
                                                <div key={j} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 flex-shrink-0" />
                                                    {typeof item === 'object' ? (
                                                        <div className="flex-1 bg-muted p-4 rounded-2xl border border-border">
                                                            {Object.entries(item).map(([subK, subV]) => (
                                                                <div key={subK} className="mb-2 last:mb-0">
                                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-0.5">{subK}</span>
                                                                    <p className="text-sm text-foreground font-bold">{String(subV)}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{String(item)}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : typeof value === 'object' && value !== null ? (
                                        <div className="grid gap-4">
                                            {Object.entries(value).map(([subK, subV]) => (
                                                <div key={subK} className="bg-muted p-4 rounded-2xl border border-border">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">{subK}</span>
                                                    <p className="text-sm text-foreground font-bold">{String(subV)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-base text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">{String(value)}</p>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render formatted content - cleaner version
    const renderFormattedContent = (content: string) => {
        // Try to parse as JSON first
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
            try {
                const data = JSON.parse(content);
                return renderStructuredContent(data);
            } catch (e) {
                // Not valid JSON, fall back to markdown
            }
        }

        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let tableLines: string[] = [];
        let inTable = false;

        lines.forEach((line: string, i: number) => {
            // Check if this is a table line
            if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                if (!inTable) inTable = true;
                tableLines.push(line);
                return;
            } else if (inTable && tableLines.length > 0) {
                // End of table, render it
                elements.push(
                    <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-xl border border-border">
                        <table className="min-w-full text-sm">
                            <tbody>
                                {tableLines.map((tl, ti) => {
                                    if (tl.includes('---')) return null; // Skip separator row
                                    const cells = tl.split('|').filter(c => c.trim());
                                    return (
                                        <tr key={ti} className={ti === 0 ? 'bg-muted font-bold' : 'border-t border-border'}>
                                            {cells.map((cell, ci) => (
                                                <td key={ci} className="px-4 py-2 text-muted-foreground">{cell.trim()}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
                tableLines = [];
                inTable = false;
            }

            // Skip empty lines or just dashes
            if (line.trim() === '' || line.trim() === '---') {
                elements.push(<div key={i} className="h-2" />);
                return;
            }

            // Headings
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={i} className="text-2xl font-bold text-foreground mb-4 mt-6 pb-2 border-b border-primary-custom/20">
                        {line.replace('# ', '')}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={i} className="text-lg font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
                        <span className="w-1 h-5 bg-primary-custom rounded-full"></span>
                        {line.replace('## ', '')}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={i} className="text-sm font-bold text-primary-custom mt-4 mb-1 uppercase tracking-wider">
                        {line.replace('### ', '')}
                    </h3>
                );
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                elements.push(
                    <div key={i} className="flex items-start gap-2 ml-2 mb-1">
                        <span className="text-primary-custom mt-1.5">•</span>
                        <span className="text-muted-foreground" dangerouslySetInnerHTML={{
                            __html: line.replace(/^[-*] /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    </div>
                );
            } else if (line.match(/^\d+\./)) {
                elements.push(
                    <div key={i} className="flex items-start gap-2 ml-2 mb-1">
                        <span className="text-primary-custom font-bold min-w-[20px]">{line.match(/^\d+/)?.[0]}.</span>
                        <span className="text-muted-foreground" dangerouslySetInnerHTML={{
                            __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    </div>
                );
            } else if (line.startsWith('**') && line.endsWith('**')) {
                elements.push(
                    <p key={i} className="font-bold text-foreground mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
                );
            } else {
                elements.push(
                    <p key={i} className="text-muted-foreground leading-relaxed mb-1" dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }} />
                );
            }
        });

        return elements;
    };

    return (
        <div className="p-8 w-full min-h-full bg-background text-foreground">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-custom rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-custom/20">
                            <FolderOpen size={20} />
                        </div>
                        My Workspace
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        All your generated content, saved and organized.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-custom/20 focus:bg-card-bg w-full md:w-64 transition-all text-foreground"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none bg-card-bg border border-border px-4 py-2.5 pr-10 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer focus:ring-2 focus:ring-primary-custom/20"
                        >
                            <option value="all">All Types</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                                </option>
                            ))}
                        </select>
                        <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </header>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={48} className="text-primary-custom animate-spin mb-4" />
                    <p className="text-muted-foreground font-medium">Loading your workspace...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                        <FolderOpen size={48} className="text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                        {searchQuery || filterType !== 'all' ? 'No matching content found' : 'Your workspace is empty'}
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        {searchQuery || filterType !== 'all'
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Generate content using our AI tools and save it here for quick access.'}
                    </p>
                    {!searchQuery && filterType === 'all' && (
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-primary-custom text-white font-bold rounded-xl shadow-lg shadow-primary-custom/20 hover:opacity-90 transition-all"
                        >
                            Explore AI Tools
                        </Link>
                    )}
                </div>
            ) : (
                <div className="flex gap-6 h-[calc(100vh-200px)]">
                    {/* Left Sidebar - File Tree */}
                    <div className="w-64 flex-shrink-0 bg-card-bg border border-border rounded-2xl p-4 overflow-y-auto shadow-sm h-full">
                        <div className="flex items-center gap-2 px-3 py-2 mb-4">
                            <FolderOpen size={18} className="text-primary-custom" />
                            <span className="text-foreground font-bold text-sm">My Assets</span>
                        </div>

                        {/* All Items */}
                        <button
                            onClick={() => setFilterType('all')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-1 ${filterType === 'all'
                                ? 'bg-primary-custom/10 text-primary-custom font-semibold'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <FolderOpen size={16} className={filterType === 'all' ? 'text-primary-custom' : 'text-muted-foreground'} />
                            <span className="flex-1 text-sm">All Items</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${filterType === 'all' ? 'bg-primary-custom/20 text-primary-custom' : 'bg-muted text-muted-foreground'}`}>{resources.length}</span>
                        </button>

                        <div className="h-px bg-border my-3" />

                        {/* Folder Items by Type */}
                        {[
                            { type: 'lesson-plan', label: 'Lesson Plans', icon: '📚' },
                            { type: 'quiz', label: 'Quizzes', icon: '❓' },
                            { type: 'visual', label: 'Visual Aids', icon: '🎨' },
                            { type: 'story', label: 'Stories', icon: '📖' },
                            { type: 'rubric', label: 'Rubrics', icon: '📋' },
                            { type: 'hyper-local', label: 'Hyper-Local', icon: '🌍' },
                            { type: 'simulation', label: 'Simulations', icon: '🔬' },
                            { type: 'other', label: 'Other', icon: '📄' },
                        ].map(folder => {
                            const count = resources.filter(r => r.type === folder.type).length;
                            if (count === 0) return null;
                            const isActive = filterType === folder.type;
                            return (
                                <button
                                    key={folder.type}
                                    onClick={() => setFilterType(isActive ? 'all' : folder.type)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-1 ${isActive
                                        ? 'bg-primary-custom/10 text-primary-custom font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <span className="text-base">{folder.icon}</span>
                                    <span className="flex-1 text-sm">{folder.label}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-custom/20 text-primary-custom' : 'bg-muted text-muted-foreground'}`}>{count}</span>
                                </button>
                            );
                        })}

                        <div className="h-px bg-border my-3" />

                        {/* Search */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-muted border border-border rounded-xl py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary-custom/20 focus:border-primary-custom/30 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Right - Main Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Current Folder Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">
                                {filterType === 'all' ? '📁' :
                                    filterType === 'lesson-plan' ? '📚' :
                                        filterType === 'quiz' ? '❓' :
                                            filterType === 'visual' ? '🎨' :
                                                filterType === 'story' ? '📖' : '📄'}
                            </span>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">
                                    {filterType === 'all' ? 'All Items' :
                                        filterType === 'lesson-plan' ? 'Lesson Plans' :
                                            filterType === 'quiz' ? 'Quizzes' :
                                                filterType === 'visual' ? 'Visual Aids' :
                                                    filterType === 'story' ? 'Stories' :
                                                        filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                </h3>
                                <p className="text-xs text-muted-foreground">{filteredResources.length} items</p>
                            </div>
                        </div>

                        {filteredResources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FolderOpen size={48} className="text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground">No items in this folder</p>
                            </div>
                        ) : (
                            /* Grid of Cards */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredResources.map((res) => {
                                    const colors = getTypeColor(res.type);
                                    return (
                                        <div
                                            key={res.id}
                                            onClick={() => setSelectedContent(res)}
                                            className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-custom/10 hover:border-primary-custom/30 transition-all duration-300 group relative cursor-pointer flex flex-col h-full"
                                        >
                                            {/* Type Color Bar */}
                                            <div className={`h-1 w-full bg-gradient-to-r ${res.type === 'lesson-plan' ? 'from-lime-400 to-emerald-500' :
                                                res.type === 'quiz' ? 'from-blue-400 to-indigo-500' :
                                                    res.type === 'visual' ? 'from-purple-400 to-pink-500' :
                                                        res.type === 'story' ? 'from-amber-400 to-orange-500' :
                                                            'from-gray-400 to-gray-500'
                                                }`} />

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${res.type === 'lesson-plan' ? 'bg-primary-custom/10 text-primary-custom' :
                                                        res.type === 'quiz' ? 'bg-blue-500/10 text-blue-500' :
                                                            res.type === 'visual' ? 'bg-purple-500/10 text-purple-500' :
                                                                res.type === 'story' ? 'bg-amber-500/10 text-amber-500' :
                                                                    'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {getTypeIcon(res.type, 20)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted px-2 py-1 rounded-full">
                                                        <Clock size={10} />
                                                        {formatDate(res.createdAt)}
                                                    </div>
                                                </div>

                                                <h3 className="text-base font-bold text-foreground line-clamp-1 mb-1 group-hover:text-primary-custom transition-colors">
                                                    {res.title}
                                                </h3>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                                        {getToolDisplayName(res.toolId)}
                                                    </span>
                                                </div>

                                                {res.bookTitle && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 bg-muted p-1.5 rounded-lg truncate border border-border">
                                                        <BookOpen size={12} className="flex-shrink-0" />
                                                        <span className="truncate">{res.bookTitle}</span>
                                                    </div>
                                                )}

                                                {/* Content Preview (Text) */}
                                                {res.contentType === 'text' && (
                                                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-1 font-medium leading-relaxed">
                                                        {(function () {
                                                            if (res.content.trim().startsWith('{')) {
                                                                try {
                                                                    const data = JSON.parse(res.content);
                                                                    return data.overview || data.description || data.subtitle || data.content || res.title;
                                                                } catch (e) {
                                                                    return res.content.substring(0, 100);
                                                                }
                                                            }
                                                            return res.content.replace(/[#*`]/g, '').substring(0, 100);
                                                        })()}...
                                                    </p>
                                                )}

                                                {/* Content Preview (Image) */}
                                                {res.contentType === 'image' && res.imageUrl && (
                                                    <div className="mb-4 rounded-lg overflow-hidden bg-muted h-24 w-full relative group/img flex-1">
                                                        <img
                                                            src={res.imageUrl}
                                                            alt={res.title}
                                                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                )}

                                                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(res.id); }}
                                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        {deleting === res.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                    </button>

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedContent(res); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-primary-custom/10 text-muted-foreground hover:text-primary-custom rounded-lg text-xs font-bold transition-colors border border-border"
                                                    >
                                                        <span>View</span>
                                                        <Maximize2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Preview Modal */}
            {selectedContent && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setSelectedContent(null)}
                >
                    <div
                        className="bg-card-bg rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className={`p-6 border-b border-border flex items-center gap-4 ${selectedContent.type === 'lesson-plan' ? 'bg-primary-custom/5' :
                            selectedContent.type === 'quiz' ? 'bg-blue-500/5' :
                                selectedContent.type === 'visual' ? 'bg-purple-500/5' :
                                    selectedContent.type === 'story' ? 'bg-amber-500/5' :
                                        'bg-muted'
                            }`}>
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${selectedContent.type === 'lesson-plan' ? 'bg-primary-custom text-white' :
                                selectedContent.type === 'quiz' ? 'bg-blue-500 text-white' :
                                    selectedContent.type === 'visual' ? 'bg-purple-500 text-white' :
                                        selectedContent.type === 'story' ? 'bg-amber-500 text-white' :
                                            'bg-muted-foreground text-white'
                                }`}>
                                <span className="text-white">{getTypeIcon(selectedContent.type)}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-foreground truncate">{selectedContent.title}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${selectedContent.type === 'lesson-plan' ? 'bg-primary-custom/10 text-primary-custom' :
                                        selectedContent.type === 'quiz' ? 'bg-blue-500/10 text-blue-500' :
                                            selectedContent.type === 'visual' ? 'bg-purple-500/10 text-purple-500' :
                                                selectedContent.type === 'story' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-muted text-muted-foreground'
                                        }`}>
                                        {getToolDisplayName(selectedContent.toolId)}
                                    </span>
                                    {selectedContent.bookTitle && (
                                        <>
                                            <span className="text-border">•</span>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <BookOpen size={12} />
                                                {selectedContent.bookTitle}
                                            </div>
                                        </>
                                    )}
                                    <span className="text-border">•</span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                                        <Clock size={12} />
                                        {formatDate(selectedContent.createdAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleCopy(selectedContent.content)}
                                    className="flex items-center gap-2 px-3 py-2 bg-card-bg border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-all shadow-sm"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle size={14} className="text-green-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            Copy
                                        </>
                                    )}
                                </button>
                                <Link
                                    href={`/tools/${selectedContent.toolId}`}
                                    className="flex items-center gap-2 px-3 py-2 bg-primary-custom text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-all"
                                >
                                    <ExternalLink size={14} />
                                    Open in Tool
                                </Link>
                                <button
                                    onClick={() => setSelectedContent(null)}
                                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-card-bg">
                            {selectedContent.contentType === 'image' && selectedContent.imageUrl ? (
                                <div className="flex items-center justify-center h-full">
                                    <img
                                        src={selectedContent.imageUrl}
                                        alt={selectedContent.title}
                                        className="max-w-full max-h-[60vh] rounded-2xl shadow-lg border border-border"
                                    />
                                </div>
                            ) : (
                                <div className="max-w-3xl mx-auto">
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        {renderFormattedContent(selectedContent.content)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceView;
