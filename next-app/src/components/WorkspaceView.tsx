
'use client';

import React from 'react';
import { Book, Download, ExternalLink, Filter, Search } from 'lucide-react';

const WorkspaceView: React.FC = () => {
    // These resources were moved from the Library as requested
    const resources = [
        { title: 'Calculus Fundamentals', author: 'Dr. Sarah Chen', type: 'PDF', color: 'bg-lime-100', iconColor: 'text-lime-600' },
        { title: 'Modern Biology Vol 2', author: 'Mark Stevens', type: 'E-Book', color: 'bg-sky-100', iconColor: 'text-sky-600' },
        { title: 'Quantum Physics Guide', author: 'Prof. Alaric', type: 'Video', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        { title: 'Global Economy 2024', author: 'Economics Dept', type: 'Spreadsheet', color: 'bg-orange-100', iconColor: 'text-orange-600' },
        { title: 'Literature Analysis', author: 'Jane Cooper', type: 'PDF', color: 'bg-purple-100', iconColor: 'text-purple-600' },
        { title: 'Chemical Bonding', author: 'Chemistry Lab', type: 'Interactive', color: 'bg-rose-100', iconColor: 'text-rose-600' },
    ];

    return (
        <div className="p-8 w-full">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Workspace Resources</h2>
                    <p className="text-gray-400 text-sm">Manage and organize your primary teaching assets.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-100 w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-xl text-gray-600 hover:bg-lime-50 hover:text-lime-700 transition-all">
                        <Filter size={18} />
                        <span className="text-sm font-semibold">Filters</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg hover:shadow-lime-50 transition-all group cursor-pointer">
                        <div className={`w-14 h-14 ${res.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                            <Book className={res.iconColor} size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{res.title}</h3>
                        <p className="text-sm text-gray-400 mb-6">by {res.author} • {res.type}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <button className="text-gray-400 hover:text-lime-600 transition-colors">
                                <Download size={18} />
                            </button>
                            <button className="flex items-center gap-1.5 text-lime-600 text-sm font-bold hover:underline">
                                Open Resource
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkspaceView;
