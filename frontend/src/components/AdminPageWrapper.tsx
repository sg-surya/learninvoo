import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AdminPageWrapperProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
    title,
    subtitle,
    icon: Icon,
    headerAction,
    children
}) => {
    return (
        <div className="p-8 pb-20 w-full min-h-screen bg-transparent text-foreground overflow-y-auto no-scrollbar">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-lime-500/10 text-lime-600 rounded-full border border-lime-500/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm shadow-lime-500/5">
                            <Icon size={12} />
                            Admin Console
                        </div>
                    </div>
                    <h1 className="text-4xl font-display font-black text-foreground tracking-tight leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[15px] font-medium text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
                {headerAction && (
                    <div className="flex gap-4">
                        {headerAction}
                    </div>
                )}
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AdminPageWrapper;
