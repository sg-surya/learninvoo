'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    if (pathname === '/dashboard') return null;

    return (
        <nav className="flex items-center gap-1.5 px-8 pt-6 pb-4 bg-card-bg sticky top-0 z-20 border-b border-border/50">
            <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary-custom transition-colors group"
            >
                <Home size={12} className="group-hover:scale-110 transition-transform" />
                DASHBOARD
            </Link>

            {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

                // Skip 'dashboard' as it's our root breadcrumb
                if (segment === 'dashboard') return null;

                return (
                    <React.Fragment key={path}>
                        <ChevronRight size={10} className="text-border" />
                        <Link
                            href={path}
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isLast ? 'text-primary-custom' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {segment.replace(/-/g, ' ')}
                        </Link>
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
