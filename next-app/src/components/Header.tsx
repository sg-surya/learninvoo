
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const Header: React.FC = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/library', label: 'Library', icon: LibraryIcon },
        { href: '/workspace', label: 'Workspace', icon: Briefcase },
        { href: '/calendar', label: 'Calendar', icon: CalendarIcon },
        { href: '/notes', label: 'Notes', icon: FileText },
        { href: '/schedule', label: 'MY Schedule', icon: Clock },
        { href: '/classes', label: 'Classes', icon: GraduationCap },
    ];

    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <header className="w-full px-10 py-4 flex items-center justify-between bg-transparent z-50">
            {/* Brand Spacer */}
            <div className="flex-1"></div>

            {/* Compact Floating Pill Navigation with Icons */}
            <div className="flex items-center bg-gray-100/30 backdrop-blur-md p-1 rounded-full border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)] gap-1">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const IconComponent = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 ease-in-out group ${active
                                    ? 'bg-lime-900 text-white shadow-md'
                                    : 'text-[#6c727f] hover:text-lime-700 hover:bg-white/40'
                                }`}
                        >
                            <IconComponent size={16} className={`${active ? 'text-white' : 'text-[#6c727f] group-hover:text-lime-600'}`} />

                            <span className={`text-[13px] font-bold overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${active ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
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
