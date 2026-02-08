
import React from 'react';
import { LayoutDashboard, GraduationCap, PieChart, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isCollapsed, onToggle }) => {
  const navItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewType.CLASSES, label: 'Classes', icon: GraduationCap },
    { id: ViewType.REPORTS, label: 'Report', icon: PieChart },
    { id: ViewType.ASSIGNMENTS, label: 'Assignments', icon: BookOpen },
  ];

  return (
    <div className={`h-full flex flex-col py-10 transition-all duration-300 bg-transparent ${isCollapsed ? 'px-3' : 'px-6'}`}>
      {/* Logo Section */}
      <div className={`flex items-center gap-3 mb-14 relative ${isCollapsed ? 'justify-center' : 'px-1'}`}>
        <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 20 C 30 20, 20 35, 20 50 C 20 65, 35 80, 50 80 C 65 80, 80 65, 80 50 C 80 35, 70 20, 50 20" fill="none" stroke="#65a30d" strokeWidth="10" strokeLinecap="round" />
            <path d="M40 30 C 30 35, 25 45, 25 50 C 25 55, 30 65, 40 70" fill="none" stroke="#84cc16" strokeWidth="10" strokeLinecap="round" />
            <path d="M60 30 C 70 35, 75 45, 75 50 C 75 55, 70 65, 60 70" fill="none" stroke="#bef264" strokeWidth="10" strokeLinecap="round" />
            <circle cx="50" cy="50" r="12" fill="#d9f99d" />
          </svg>
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap overflow-hidden animate-in fade-in duration-500">
            Learnivo AI
          </span>
        )}
        
        {/* Toggle Button - Repositioned to sit on the edge of the floating card */}
        <button 
          onClick={onToggle}
          className={`absolute ${isCollapsed ? '-right-6' : '-right-8'} top-1/2 -translate-y-1/2 bg-white border border-gray-100 shadow-md p-1.5 rounded-full hover:bg-lime-50 text-gray-400 hover:text-lime-600 transition-all z-20`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center transition-all group relative ${
              isCollapsed ? 'justify-center py-3' : 'gap-3 px-4 py-2.5 rounded-2xl'
            } ${
              activeView === item.id
                ? 'text-lime-700 bg-lime-100/40 font-bold shadow-sm'
                : 'text-gray-500 font-medium hover:text-lime-600 hover:bg-white/50'
            }`}
          >
            <item.icon 
              size={20} 
              className={`flex-shrink-0 transition-colors ${activeView === item.id ? 'text-lime-600' : 'text-gray-400 group-hover:text-lime-500'}`} 
            />
            {!isCollapsed && (
              <span className="text-[13px] whitespace-nowrap overflow-hidden animate-in slide-in-from-left-1 duration-300">
                {item.label}
              </span>
            )}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer / Profile Section */}
      <div className={`mt-auto flex flex-col items-center transition-all ${isCollapsed ? 'gap-3' : ''}`}>
        <div className={`text-center ${isCollapsed ? 'mb-2' : 'mb-6'}`}>
          <div className="relative inline-block">
            <div className={`${isCollapsed ? 'w-10 h-10' : 'w-14 h-14'} transition-all rounded-full border-2 border-white shadow-sm p-0.5 overflow-hidden bg-white`}>
              <img
                src="https://picsum.photos/seed/jane-profile/200/200"
                alt="Jane Cooper"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in duration-500 mt-3">
              <h4 className="text-sm font-bold text-gray-800 leading-tight">Jane Cooper</h4>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">jane.c02@gmail.com</p>
            </div>
          )}
        </div>

        <div className={`flex w-full justify-center transition-all ${isCollapsed ? 'flex-col items-center gap-2' : 'gap-3'}`}>
          <button className={`p-2 bg-white/80 border border-white rounded-xl shadow-sm hover:bg-white hover:text-lime-600 transition-colors group relative text-gray-400`}>
            <Settings size={18} />
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Settings
              </div>
            )}
          </button>
          <button className={`p-2 bg-white/80 border border-white rounded-xl shadow-sm hover:bg-white hover:text-red-500 transition-colors group relative text-gray-400`}>
            <LogOut size={18} />
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
