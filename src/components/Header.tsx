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
    ChevronDown,
    Users,
    CreditCard,
    Zap,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllGeneratedContent, getTypeColor, GeneratedContent } from '@/lib/storage';

const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const content = await getAllGeneratedContent();
            const formatted = content.slice(0, 5).map(item => ({
                id: item.id,
                title: item.title,
                desc: `New ${item.type.replace('-', ' ')} generated.`,
                time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon: getIconForType(item.type),
                ...getTypeColor(item.type)
            }));
            setNotifications(formatted);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
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

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();

        // 1. Search Nav Items
        const routeMatches = navItems
            .filter(item => item.label.toLowerCase().includes(lowerQuery))
            .map(item => ({
                id: `route-${item.href}`,
                title: item.label,
                type: 'Page',
                href: item.href,
                icon: item.icon
            }));

        // 2. Search Workspace Content
        const content = await getAllGeneratedContent();
        const contentMatches = content
            .filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.type.toLowerCase().includes(lowerQuery)
            )
            .map(item => ({
                id: item.id,
                title: item.title,
                type: item.type.replace('-', ' '),
                href: `/workspace?id=${item.id}`,
                icon: getIconForType(item.type)
            }));

        setSearchResults([...routeMatches, ...contentMatches.slice(0, 5)]);
    };

    const getIconForType = (type: GeneratedContent['type']) => {
        switch (type) {
            case 'lesson-plan': return Wand2;
            case 'quiz': return FileText;
            case 'simulation': return LayoutDashboard;
            case 'visual': return Wand2;
            case 'story': return Wand2;
            default: return Wand2;
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('learnivo_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchNotifications();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('learnivo_current_user');
        router.push('/login');
    };


    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <header className="w-full px-10 py-4 flex items-center justify-between bg-transparent z-50">
            {/* Search Modal Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-slate-950/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white p-2 overflow-hidden"
                            ref={searchRef}
                        >
                            <div className="relative flex items-center p-4">
                                <Search className="absolute left-8 text-slate-400" size={20} />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search tools, books, or workspace..."
                                    className="w-full bg-slate-50 border-none focus:ring-0 rounded-2xl pl-14 pr-6 py-4 text-lg font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                                />
                            </div>
                            <div className="px-6 py-4 pb-8 max-h-[400px] overflow-y-auto">
                                {searchQuery.trim() === '' ? (
                                    <>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Quick Navigation</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {navItems.slice(0, 4).map((item, i) => (
                                                <Link
                                                    key={i}
                                                    href={item.href}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-lime-50 rounded-xl transition-all group"
                                                >
                                                    <item.icon size={16} className="text-slate-400 group-hover:text-lime-600" />
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Search Results</h3>
                                        {searchResults.length > 0 ? (
                                            searchResults.map((result) => (
                                                <Link
                                                    key={result.id}
                                                    href={result.href}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-lime-50 rounded-xl transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-lime-600 group-hover:scale-110 transition-all">
                                                            <result.icon size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 leading-tight">{result.title}</h4>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{result.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Zap size={14} className="text-lime-500" />
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-3">
                                                    <Search size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 mb-1">No results for "{searchQuery}"</p>
                                                <p className="text-xs text-slate-400 font-medium">Try searching for "Dashboard", "Lesson", or "Quiz".</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-gray-100/50 text-[#6c727f] hover:text-lime-600 hover:shadow-sm transition-all"
                >
                    <Search size={16} />
                </button>

                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)] border border-gray-100/50 text-[#6c727f] hover:text-lime-600 hover:shadow-sm transition-all relative ${isNotificationOpen ? 'text-lime-600 bg-lime-50' : ''}`}
                    >
                        <Bell size={16} />
                        {notifications.length > 0 && (
                            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        )}
                    </button>
                    <AnimatePresence>
                        {isNotificationOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.1)] border border-slate-100 p-2 overflow-hidden z-[110]"
                            >
                                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Notifications</h3>
                                    {notifications.length > 0 && (
                                        <span className="px-2 py-0.5 bg-lime-100 text-lime-700 rounded-lg text-[10px] font-black tracking-widest uppercase">{notifications.length} NEW</span>
                                    )}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto py-2">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className="px-3 py-3 hover:bg-slate-50/80 transition-all cursor-pointer rounded-2xl flex gap-3 group">
                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${notif.bg} ${notif.text} group-hover:scale-110 transition-transform`}>
                                                    <notif.icon size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                                                        <span className="text-[9px] font-bold text-slate-400 shrink-0">{notif.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{notif.desc}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-3">
                                                <Bell size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 mb-1">All caught up!</p>
                                            <p className="text-xs text-slate-400 font-medium">No new notifications at the moment.</p>
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={() => setNotifications([])}
                                        className="w-full py-3.5 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 transition-all rounded-b-[1.8rem]"
                                    >
                                        Clear all alerts
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute right-0 mt-4 w-64 bg-white rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 p-1.5 overflow-hidden z-[100]"
                            >
                                {/* User Info Header - Now Clickable Link */}
                                <Link
                                    href="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-3 py-2.5 mb-1 bg-slate-50/50 rounded-[1.2rem] border border-slate-100/50 transition-all hover:bg-lime-50/50 group/card"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-white shrink-0 group-hover/card:scale-105 transition-transform">
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
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[12px] font-black text-slate-950 truncate font-display italic uppercase tracking-tight group-hover/card:text-lime-600 transition-colors leading-tight">{user?.fullName || 'Educator'}</h4>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">@{user?.username || 'user'}</p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Menu Items */}
                                <div className="space-y-0.5">
                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-slate-400 group-hover:text-lime-600 transition-colors" />
                                            <span>Community</span>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={16} className="text-slate-400 group-hover:text-lime-600 transition-colors" />
                                            <span>Subscription</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-fuchsia-100 text-fuchsia-600 rounded-md text-[8px] font-black uppercase italic tracking-tighter">
                                            <Zap size={9} fill="currentColor" />
                                            PRO
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Settings size={16} className="text-slate-400 group-hover:text-lime-600 transition-colors" />
                                            <span>Settings</span>
                                        </div>
                                    </button>

                                    <div className="h-px bg-slate-100 my-1 mx-3"></div>

                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Info size={16} className="text-slate-400 group-hover:text-lime-600 transition-colors" />
                                            <span>Help center</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                                            <span>Sign out</span>
                                        </div>
                                    </button>
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
