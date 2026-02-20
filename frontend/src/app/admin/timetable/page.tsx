'use client';
import React from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { Calendar, Plus } from 'lucide-react';

export default function TimetablePage() {
    return (
        <AdminPageWrapper
            title="Master Timetable"
            subtitle="View and edit class schedules and teacher assignments."
            icon={Calendar}
            headerAction={
                <button className="px-6 py-3 bg-foreground text-background rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 flex items-center gap-2 shadow-xl">
                    <Plus size={16} /> New Schedule
                </button>
            }
        >
            <div className="bg-card-bg/60 backdrop-blur-xl rounded-[2rem] border border-border/60 p-12 text-center">
                <div className="inline-block p-6 bg-muted/30 rounded-full mb-6 text-muted-foreground">
                    <Calendar size={48} />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Timetable view is under construction</h3>
                <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto">
                    We are building an interactive drag-and-drop scheduler. For now, please use the legacy spreadsheet view.
                </p>
                <button className="mt-8 px-8 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold text-sm transition-colors">
                    Download Current Schedule (PDF)
                </button>
            </div>
        </AdminPageWrapper>
    );
}
