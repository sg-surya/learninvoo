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
    Bot,
    ChevronDown,
    Users,
    CreditCard,
    Zap,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllGeneratedContent, getTypeColor, GeneratedContent } from '@/lib/storage';
import SettingsModal from './SettingsModal';

const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
        { href: '/schedule', label: 'Schedule', icon: CalendarIcon },
        { href: '/notes', label: 'Notes', icon: FileText },
        { href: '/chat', label: 'AI Bot', icon: Bot },
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
                            className="relative w-full max-w-2xl bg-card-bg/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-border p-2 overflow-hidden"
                            ref={searchRef}
                        >
                            <div className="relative flex items-center p-4">
                                <Search className="absolute left-8 text-muted-foreground" size={20} />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search tools, books, or workspace..."
                                    className="w-full bg-muted border-none focus:ring-0 rounded-2xl pl-14 pr-6 py-4 text-lg font-bold text-foreground placeholder:text-muted-foreground placeholder:font-medium"
                                />
                            </div>
                            <div className="px-6 py-4 pb-8 max-h-[400px] overflow-y-auto">
                                {searchQuery.trim() === '' ? (
                                    <>
                                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">Quick Navigation</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {navItems.slice(0, 4).map((item, i) => (
                                                <Link
                                                    key={i}
                                                    href={item.href}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary-custom/10 rounded-xl transition-all group"
                                                >
                                                    <item.icon size={16} className="text-muted-foreground group-hover:text-primary-custom" />
                                                    <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">Search Results</h3>
                                        {searchResults.length > 0 ? (
                                            searchResults.map((result) => (
                                                <Link
                                                    key={result.id}
                                                    href={result.href}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary-custom/10 rounded-xl transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-card-bg shadow-sm border border-border rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary-custom group-hover:scale-110 transition-all">
                                                            <result.icon size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-foreground leading-tight">{result.title}</h4>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{result.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Zap size={14} className="text-primary-custom" />
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground mb-3">
                                                    <Search size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-foreground mb-1">No results for "{searchQuery}"</p>
                                                <p className="text-xs text-muted-foreground font-medium">Try searching for "Dashboard", "Lesson", or "Quiz".</p>
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
            <div className="flex items-center bg-card-bg/60 backdrop-blur-2xl p-1.5 rounded-full border border-border shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] gap-1 relative overflow-hidden group hover:bg-card-bg/80 transition-all duration-500">

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 dark:via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-0" />

                {navItems.map((item, idx) => {
                    const active = isActive(item.href);
                    const IconComponent = item.icon;

                    return (
                        <div key={`${item.href}-${idx}`} className="relative z-10">
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${active
                                    ? 'bg-primary-custom shadow-[0_2px_12px_rgba(var(--primary-rgb),0.3)] text-white scale-105'
                                    : 'text-muted-foreground hover:text-primary-custom hover:bg-card-bg/50'
                                    }`}
                            >
                                <IconComponent size={18} className={`${active ? 'text-white' : 'text-muted-foreground group-hover:text-primary-custom'} transition-colors`} />

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
                    className="w-9 h-9 flex items-center justify-center bg-card-bg rounded-full shadow-sm border border-border text-muted-foreground hover:text-primary-custom hover:shadow-md transition-all"
                >
                    <Search size={16} />
                </button>

                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`w-9 h-9 flex items-center justify-center bg-card-bg rounded-full shadow-sm border border-border text-muted-foreground hover:text-primary-custom hover:shadow-md transition-all relative ${isNotificationOpen ? 'text-primary-custom bg-primary-custom/10' : ''}`}
                    >
                        <Bell size={16} />
                        {notifications.length > 0 && (
                            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-rose-500 rounded-full border border-card-bg"></span>
                        )}
                    </button>
                    <AnimatePresence>
                        {isNotificationOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute right-0 mt-4 w-80 bg-card-bg/95 backdrop-blur-xl rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.1)] border border-border p-2 overflow-hidden z-[110]"
                            >
                                <div className="p-4 flex items-center justify-between border-b border-border/50">
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Notifications</h3>
                                    {notifications.length > 0 && (
                                        <span className="px-2 py-0.5 bg-primary-custom/10 text-primary-custom rounded-lg text-[10px] font-black tracking-widest uppercase">{notifications.length} NEW</span>
                                    )}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto py-2">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className="px-3 py-3 hover:bg-muted/50 transition-all cursor-pointer rounded-2xl flex gap-3 group">
                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${notif.bg} ${notif.text} group-hover:scale-110 transition-transform`}>
                                                    <notif.icon size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h4 className="text-xs font-bold text-foreground truncate">{notif.title}</h4>
                                                        <span className="text-[9px] font-bold text-muted-foreground shrink-0">{notif.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">{notif.desc}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground mb-3">
                                                <Bell size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-foreground mb-1">All caught up!</p>
                                            <p className="text-xs text-muted-foreground font-medium">No new notifications at the moment.</p>
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={() => setNotifications([])}
                                        className="w-full py-3.5 bg-muted text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:bg-rose-500/10 hover:text-rose-500 transition-all rounded-b-[1.8rem]"
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
                        className="ml-1 px-2 py-1 flex items-center gap-2 bg-card-bg rounded-full border border-border shadow-sm cursor-pointer transition-all"
                    >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-border bg-muted">
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
                        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute right-0 mt-4 w-64 bg-card-bg rounded-[1.8rem] shadow-2xl border border-border p-1.5 overflow-hidden z-[100]"
                            >
                                {/* User Info Header - Now Clickable Link */}
                                <Link
                                    href="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-3 py-2.5 mb-1 bg-muted/50 rounded-[1.2rem] border border-border transition-all hover:bg-primary-custom/10 group/card"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl border-2 border-card-bg shadow-sm overflow-hidden bg-card-bg shrink-0 group-hover/card:scale-105 transition-transform">
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
                                            <h4 className="text-[12px] font-display font-bold text-foreground truncate italic uppercase tracking-tight group-hover/card:text-primary-custom transition-colors leading-tight">{user?.fullName || 'Educator'}</h4>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">@{user?.username || 'user'}</p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Menu Items */}
                                <div className="space-y-0.5">
                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-muted-foreground group-hover:text-primary-custom transition-colors" />
                                            <span>Community</span>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={16} className="text-muted-foreground group-hover:text-primary-custom transition-colors" />
                                            <span>Subscription</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-fuchsia-500/10 text-fuchsia-500 rounded-md text-[8px] font-black uppercase italic tracking-tighter">
                                            <Zap size={9} fill="currentColor" />
                                            PRO
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsSettingsOpen(true);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Settings size={16} className="text-muted-foreground group-hover:text-primary-custom transition-colors" />
                                            <span>Settings</span>
                                        </div>
                                    </button>

                                    <div className="h-px bg-border my-1 mx-3"></div>

                                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Info size={16} className="text-muted-foreground group-hover:text-primary-custom transition-colors" />
                                            <span>Help center</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={16} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
                                            <span>Sign out</span>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />
        </header>
    );
};

export default Header;
