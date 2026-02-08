
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Reset scroll on route change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, [pathname]);

    useEffect(() => {
        const saved = localStorage.getItem('learnivo_sidebar_collapsed');
        if (saved) {
            setIsSidebarCollapsed(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('learnivo_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    return (
        <div className="h-screen w-screen relative overflow-hidden bg-[#f9fbf2] flex">
            {/* Muted Background Blobs - Very Subtle */}
            <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-lime-100/30 rounded-full filter blur-[100px] -z-10"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-emerald-50/40 rounded-full filter blur-[100px] -z-10"></div>

            {/* Sidebar */}
            <aside
                className={`h-full flex-shrink-0 transition-all duration-300 ease-in-out bg-transparent z-30 ${isSidebarCollapsed ? 'w-20' : 'w-[13%] min-w-[210px]'
                    }`}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </aside>

            {/* Main View Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header />

                {/* Main Content Card */}
                <main className="flex-1 mx-[10px] mb-[10px] bg-white rounded-[2.5rem] shadow-[16px_16px_40px_-5px_rgba(0,0,0,0.1)] border border-white/40 relative z-10 flex flex-col overflow-hidden">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
