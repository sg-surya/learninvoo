
import React from 'react';
import { FileText, Folder, MoreVertical, Plus, Search, Star } from 'lucide-react';

const NotesView: React.FC = () => {
  const folders = [
    { name: 'Lecture Materials', count: 24, color: 'text-lime-600' },
    { name: 'Personal Drafts', count: 8, color: 'text-sky-600' },
    { name: 'Research Paper', count: 12, color: 'text-purple-600' },
    { name: 'Student Feedback', count: 45, color: 'text-orange-600' },
  ];

  const recentNotes = [
    { title: 'Algebraic Equations Intro', date: '2 hours ago', category: 'Math' },
    { title: 'Photosynthesis Diagram', date: 'Yesterday', category: 'Biology' },
    { title: 'Staff Meeting Notes', date: 'Oct 12, 2023', category: 'Admin' },
  ];

  return (
    <div className="flex h-full">
      {/* Left Pane - Folders */}
      <div className="w-72 border-r border-gray-50 p-8 flex flex-col h-full bg-gray-50/30">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">My Notes</h2>
          <button className="text-lime-600 hover:bg-lime-50 p-1.5 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
          <input 
            type="text" 
            placeholder="Search folders..." 
            className="w-full bg-white border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-lime-100 shadow-sm"
          />
        </div>

        <nav className="space-y-2 flex-1">
          {folders.map((folder, i) => (
            <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <Folder size={18} className={`${folder.color} opacity-70 group-hover:opacity-100`} />
                <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{folder.name}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 group-hover:bg-lime-50 group-hover:text-lime-600 px-2 py-0.5 rounded-full transition-colors">{folder.count}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Right Pane - Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
              <span>Home</span>
              <span>/</span>
              <span className="text-gray-800">Recent Notes</span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-lime-600"><Star size={20} /></button>
              <button className="p-2 text-gray-400 hover:text-lime-600"><MoreVertical size={20} /></button>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight">Advanced Statistics & Probability Course Outline</h1>
          
          <div className="flex gap-4 mb-10">
            <span className="px-4 py-1.5 bg-lime-50 text-lime-700 rounded-full text-xs font-bold">#Academic</span>
            <span className="px-4 py-1.5 bg-sky-50 text-sky-700 rounded-full text-xs font-bold">#2024Term</span>
          </div>

          <div className="prose prose-lime max-w-none text-gray-600 leading-relaxed space-y-6">
            <p className="text-lg">This note covers the primary learning objectives for the upcoming semester. We will focus on data visualization, normal distribution patterns, and hypothesis testing.</p>
            
            <div className="bg-lime-50/50 border-l-4 border-lime-600 p-6 rounded-r-2xl">
              <h4 className="font-bold text-lime-900 mb-2">Key Reminder:</h4>
              <p className="text-lime-800 text-sm">Ensure all students have access to the graphing calculators before the mid-term assessment scheduled for October 15th.</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Reading Assignments:</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>Chapter 1: The Nature of Data</li>
              <li>Chapter 2: Descriptive Statistics</li>
              <li>Chapter 3: Probability Fundamentals</li>
            </ul>
          </div>

          <div className="mt-20 pt-10 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Recent Notes</h3>
            <div className="grid grid-cols-3 gap-6">
              {recentNotes.map((note, i) => (
                <div key={i} className="p-5 border border-gray-100 rounded-2xl hover:border-lime-300 hover:shadow-lg transition-all cursor-pointer group">
                  <FileText size={24} className="text-lime-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{note.title}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">{note.date} • {note.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesView;
