'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    Wand2,
    LogOut,
    Settings,
    User,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('learnivo_current_user');
        router.push('/login');
    };

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

                {/* Profile Section with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="ml-1 px-2 py-1 flex items-center gap-2 bg-white rounded-full border border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.06)] cursor-pointer transition-all"
                    >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-100 bg-white">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-1.5 overflow-hidden"
                            >
                                {/* User Info Header */}
                                <div className="px-3 py-3 mb-1.5 bg-slate-50/50 rounded-xl">
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white shrink-0">
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <h4 className="text-[13px] font-black text-slate-800 truncate">{user?.fullName || 'Educator'}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">{user?.role || 'Teacher'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                                        <p className="text-[9px] font-medium text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-0.5">
                                    <Link href="/profile" className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-lime-600 rounded-lg transition-colors group">
                                        <div className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded-lg group-hover:bg-lime-50 transition-colors shrink-0">
                                            <User size={14} />
                                        </div>
                                        My Hub Profile
                                    </Link>
                                    <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors group">
                                        <div className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded-lg transition-colors shrink-0">
                                            <Settings size={14} />
                                        </div>
                                        Platform Prefs
                                    </button>
                                    <div className="h-px bg-slate-100 my-1.5 mx-1.5"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                                    >
                                        <div className="w-7 h-7 flex items-center justify-center bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors shrink-0">
                                            <LogOut size={14} />
                                        </div>
                                        Sign Out Portal
                                    </button>
                                </div>

                                {/* Bottom Tag */}
                                <div className="mt-1.5 px-2 py-1.5 text-center border-t border-slate-50">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Learnivo Secure Session</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
