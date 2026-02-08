
import React from 'react';
import { 
  Search, 
  Bell, 
  LayoutDashboard, 
  Library as LibraryIcon, 
  Briefcase, 
  Calendar as CalendarIcon, 
  FileText, 
  Clock, 
  GraduationCap 
} from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewType.LIBRARY, label: 'Library', icon: LibraryIcon },
    { id: ViewType.WORKSPACE, label: 'Workspace', icon: Briefcase },
    { id: ViewType.CALENDAR, label: 'Calendar', icon: CalendarIcon },
    { id: ViewType.NOTES, label: 'Notes', icon: FileText },
    { id: ViewType.SCHEDULE, label: 'MY Schedule', icon: Clock },
    { id: ViewType.CLASSES, label: 'Classes', icon: GraduationCap },
  ];

  return (
    <header className="w-full px-10 py-4 flex items-center justify-between bg-transparent z-50">
      {/* Brand Spacer */}
      <div className="flex-1"></div>

      {/* Compact Floating Pill Navigation with Icons */}
      <div className="flex items-center bg-gray-100/30 backdrop-blur-md p-1 rounded-full border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)] gap-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 ease-in-out group ${
                isActive 
                  ? 'bg-lime-900 text-white shadow-md' 
                  : 'text-[#6c727f] hover:text-lime-700 hover:bg-white/40'
              }`}
            >
              <IconComponent size={16} className={`${isActive ? 'text-white' : 'text-[#6c727f] group-hover:text-lime-600'}`} />
              
              <span className={`text-[13px] font-bold overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${
                isActive ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compact Action Icons Section */}
      <div className="flex-1 flex items-center gap-2.5 justify-end">
        <button className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-gray-100/50 text-[#6c727f] hover:text-lime-600 hover:shadow-sm transition-all">
          <Search size={16} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-gray-100/50 text-[#6c727f] hover:text-lime-600 hover:shadow-sm transition-all relative">
          <Bell size={16} />
          <span className="absolute top-[8px] right-[8px] w-1.5 h-1.5 bg-[#ef4444] rounded-full border border-white"></span>
        </button>
        <div className="ml-1 w-9 h-9 rounded-full border border-white shadow-[0_1px_6px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer hover:scale-105 transition-transform">
          <img 
            src="https://picsum.photos/seed/profile-123/100/100" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
