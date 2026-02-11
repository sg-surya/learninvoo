
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
    GraduationCap,
    Wand2
} from 'lucide-react';

const Header: React.FC = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tools', label: 'Tools', icon: Wand2 },
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

            {/* Compact Floating Pill Navigation with Icons - Liquid Glass Style */}
            <div className="flex items-center bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-2xl p-1.5 rounded-full border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07),inset_0_0_0_1px_rgba(255,255,255,0.2)] gap-1 relative overflow-hidden group hover:bg-white/40 transition-all duration-500">

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-0" />

                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const IconComponent = item.icon;

                    return (
                        <div key={item.href} className="relative z-10">
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${active
                                    ? 'bg-lime-600 shadow-[0_2px_12px_rgba(101,163,13,0.3)] text-white scale-105'
                                    : 'text-gray-500 hover:text-lime-700 hover:bg-white/50'
                                    }`}
                            >
                                <IconComponent size={18} className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-lime-600'} transition-colors`} />

                                <span className={`text-[13px] font-bold overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${active ? 'max-w-[120px] opacity-100 pl-1' : 'max-w-0 opacity-0'
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        </div>
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
