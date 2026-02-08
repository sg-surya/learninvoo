
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ClassDetailView from './components/ClassDetailView';
import LibraryView from './components/LibraryView';
import WorkspaceView from './components/WorkspaceView';
import CalendarView from './components/CalendarView';
import NotesView from './components/NotesView';
import ScheduleView from './components/ScheduleView';
import { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  
  // Persistent sidebar state using localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('learnivo_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Effect to update localStorage whenever sidebar state changes
  useEffect(() => {
    localStorage.setItem('learnivo_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleClassClick = (id: string) => {
    setActiveView(ViewType.CLASS_DETAIL);
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewType.CLASS_DETAIL:
        return <ClassDetailView onBack={() => setActiveView(ViewType.CLASSES)} />;
      case ViewType.LIBRARY:
        return <LibraryView />;
      case ViewType.WORKSPACE:
        return <WorkspaceView />;
      case ViewType.CALENDAR:
        return <CalendarView />;
      case ViewType.NOTES:
        return <NotesView />;
      case ViewType.SCHEDULE:
        return <ScheduleView />;
      case ViewType.CLASSES:
        return <DashboardView onClassClick={handleClassClick} />;
      case ViewType.DASHBOARD:
      default:
        return <DashboardView onClassClick={handleClassClick} />;
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#f9fbf2] flex">
      {/* Muted Background Blobs - Very Subtle */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-lime-100/30 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-emerald-50/40 rounded-full filter blur-[100px] -z-10"></div>
      
      {/* Sidebar - Transparent background to match body, no border */}
      <aside 
        className={`h-full flex-shrink-0 transition-all duration-300 ease-in-out bg-transparent z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-[13%] min-w-[210px]'
        }`}
      >
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </aside>

      {/* Main View Area - Header and Content separated */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Floating Transparent Header */}
        <Header activeView={activeView} onViewChange={setActiveView} />
        
        {/* Main Content Card - Floating white card below header */}
        <main className="flex-1 mx-[10px] mb-[10px] bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white/40 relative z-10 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
