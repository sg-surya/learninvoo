'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    GraduationCap,
    PieChart,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Wand2,
    MessageSquare,
    BrainCircuit,
    FileCheck,
    MapPin,
    Sparkles,
    Image as ImageIcon,
    Zap,
    Cpu,
    MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tools', label: 'Tools', icon: Wand2 },
        { href: '/chat', label: 'AI Chat', icon: MessageSquare },
        { href: '/classes', label: 'Classes', icon: GraduationCap },
        { href: '/reports', label: 'Report', icon: PieChart },
        { href: '/assignments', label: 'Assignments', icon: BookOpen },
    ];

    const quickTools = [
        { href: '/tools/lesson-planner', label: 'Lesson Planner', icon: Wand2 },
        { href: '/tools/quiz-exam-generator', label: 'Quiz Engine', icon: BrainCircuit },
        { href: '/tools/paper-digitizer', label: 'Digitize', icon: FileCheck },
        { href: '/tools/hyper-local-content', label: 'Hyper-Local', icon: MapPin },
        { href: '/tools/visual-generator', label: 'Visuals', icon: ImageIcon },
        { href: '/tools/story-generator', label: 'Stories', icon: Sparkles },
    ];

    const isInTool = pathname.startsWith('/tools/') && pathname !== '/tools';

    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname === href) return true;
        return false;
    };

    const textVariants = {
        hidden: { opacity: 0, x: -10, display: 'none' },
        visible: { opacity: 1, x: 0, display: 'block', transition: { delay: 0.1 } },
        exit: { opacity: 0, x: -10, transition: { duration: 0.1 } }
    };

    return (
        <motion.div
            className={`h-full flex flex-col py-10 transition-all duration-300 bg-transparent relative ${isCollapsed ? 'px-3' : 'px-6'}`}
            initial={false}
        >
            {/* Logo Section */}
            <div className={`flex items-center gap-3 mb-14 relative ${isCollapsed ? 'justify-center' : 'px-1'}`}>
                <motion.div
                    layout
                    className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 20 C 30 20, 20 35, 20 50 C 20 65, 35 80, 50 80 C 65 80, 80 65, 80 50 C 80 35, 70 20, 50 20" fill="none" stroke="#65a30d" strokeWidth="10" strokeLinecap="round" />
                        <path d="M40 30 C 30 35, 25 45, 25 50 C 25 55, 30 65, 40 70" fill="none" stroke="#84cc16" strokeWidth="10" strokeLinecap="round" />
                        <path d="M60 30 C 70 35, 75 45, 75 50 C 75 55, 70 65, 60 70" fill="none" stroke="#bef264" strokeWidth="10" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="12" fill="#d9f99d" />
                    </svg>
                </motion.div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="text-xl font-display font-bold text-foreground tracking-tight whitespace-nowrap overflow-hidden"
                        >
                            Learnivo AI
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <motion.button
                    onClick={onToggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute ${isCollapsed ? '-right-5' : '-right-8'} top-1/2 -translate-y-1/2 bg-card-bg border border-border shadow-md p-1.5 rounded-full hover:bg-primary-custom/10 text-muted-foreground hover:text-primary-custom transition-colors z-20`}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </motion.button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const active = (item.href === '/tools' && isInTool) || isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center group relative outline-none`}
                        >
                            <motion.div
                                layout
                                className={`w-full flex items-center overflow-hidden relative z-10 ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-4 py-2.5 rounded-2xl'
                                    } ${active
                                        ? 'text-primary-custom font-bold'
                                        : 'text-muted-foreground font-medium hover:text-primary-custom'
                                    }`}
                            >
                                {active && !isCollapsed && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary-custom/10 rounded-2xl -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {!active && !isCollapsed && (
                                    <div className="absolute inset-0 bg-primary-custom/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity -z-10" />
                                )}
                                <item.icon
                                    size={18}
                                    className={`flex-shrink-0 transition-colors ${active ? 'text-primary-custom' : 'text-muted-foreground group-hover:text-primary-custom'}`}
                                />
                                {!isCollapsed && (
                                    <motion.span
                                        variants={textVariants}
                                        className="text-[13px] whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </motion.div>

                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-foreground/90 backdrop-blur-sm text-background text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}

                {/* Contextual Tools Section */}
                <AnimatePresence>
                    {isInTool && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`mt-10 pt-8 border-t border-border/40 ${isCollapsed ? 'space-y-4' : 'space-y-2'}`}
                        >
                            {!isCollapsed && (
                                <h3 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] px-4 mb-4 flex items-center gap-2">
                                    <Zap size={10} className="text-primary-custom" />
                                    Quick Switch
                                </h3>
                            )}

                            <div className={`grid ${isCollapsed ? 'grid-cols-1' : 'grid-cols-1'} gap-1.5`}>
                                {quickTools.map((tool) => {
                                    const active = pathname === tool.href;
                                    return (
                                        <Link key={tool.href} href={tool.href} title={tool.label}>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className={`flex items-center rounded-xl transition-all cursor-pointer ${isCollapsed
                                                    ? 'justify-center p-2.5'
                                                    : 'gap-3 px-4 py-2 group'
                                                    } ${active
                                                        ? 'bg-primary-custom/10 text-primary-custom'
                                                        : 'text-muted-foreground/60 hover:text-primary-custom hover:bg-primary-custom/5'
                                                    }`}
                                            >
                                                <tool.icon size={16} strokeWidth={active ? 2.5 : 2} />
                                                {!isCollapsed && (
                                                    <span className={`text-[11px] font-bold tracking-tight truncate ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                                        {tool.label}
                                                    </span>
                                                )}
                                                {isCollapsed && active && (
                                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-primary-custom text-white text-[10px] font-medium rounded-lg z-50 shadow-xl whitespace-nowrap">
                                                        {tool.label} (Current)
                                                    </div>
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto">
                <div className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
                    <small className={`text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] ${isCollapsed ? 'hidden' : 'px-4'}`}>
                        v2.4.0-stable
                    </small>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
