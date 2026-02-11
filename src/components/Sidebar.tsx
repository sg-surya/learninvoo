'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, PieChart, BookOpen, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
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
        { href: '/classes', label: 'Classes', icon: GraduationCap },
        { href: '/reports', label: 'Report', icon: PieChart },
        { href: '/assignments', label: 'Assignments', icon: BookOpen },
    ];

    const isActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    // Animation variants for text
    const textVariants = {
        hidden: { opacity: 0, x: -10, display: 'none' },
        visible: { opacity: 1, x: 0, display: 'block', transition: { delay: 0.1 } },
        exit: { opacity: 0, x: -10, transition: { duration: 0.1 } }
    };

    return (
        <motion.div
            className={`h-full flex flex-col py-10 transition-all duration-300 bg-transparent ${isCollapsed ? 'px-3' : 'px-6'}`}
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
                            className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap overflow-hidden"
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
                    className={`absolute ${isCollapsed ? '-right-6' : '-right-8'} top-1/2 -translate-y-1/2 bg-white border border-gray-100 shadow-md p-1.5 rounded-full hover:bg-lime-50 text-gray-400 hover:text-lime-600 transition-colors z-20`}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-3">
                {navItems.map((item) => {
                    const active = isActive(item.href);
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
                                        ? 'text-lime-700 font-bold'
                                        : 'text-gray-500 font-medium hover:text-lime-600'
                                    }`}
                            >
                                {/* Active Background Layer */}
                                {active && !isCollapsed && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-lime-100/40 rounded-2xl -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Hover Effect Layer for non-active */}
                                {!active && !isCollapsed && (
                                    <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity -z-10" />
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: active ? 0 : [0, -5, 5, 0] }}
                                    transition={{
                                        scale: { type: "spring", stiffness: 400, damping: 10 },
                                        rotate: { duration: 0.4, ease: "easeInOut" }
                                    }}
                                >
                                    <item.icon
                                        size={20}
                                        className={`flex-shrink-0 transition-colors ${active ? 'text-lime-600' : 'text-gray-400 group-hover:text-lime-500'}`}
                                    />
                                </motion.div>

                                <AnimatePresence mode='wait'>
                                    {!isCollapsed && (
                                        <motion.span
                                            variants={textVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="text-[13px] whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Tooltip for Collapsed State */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </motion.div>
    );
};

export default Sidebar;
