'use client';
import React from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { FileCheck, Activity, Plus } from 'lucide-react';

export default function ExamsPage() {
    const exams = [
        { name: 'Semester 1 Finals', grade: 'All', date: 'Dec 15 - Dec 22', status: 'Scheduled' },
        { name: 'Unit 3 Assessment', grade: '10', date: 'Nov 12', status: 'Completed' },
        { name: 'Mock SAT', grade: '12', date: 'Oct 30', status: 'Upcoming' },
    ];

    return (
        <AdminPageWrapper
            title="Examination Control"
            subtitle="Manage exam schedules, paper generation, and result publishing."
            icon={FileCheck}
            headerAction={
                <button className="px-6 py-3 bg-foreground text-background rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 flex items-center gap-2 shadow-xl">
                    <Plus size={16} /> New Assessment
                </button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {exams.map((exam, i) => (
                    <div key={i} className="bg-card-bg/60 backdrop-blur-xl p-6 rounded-[2rem] border border-border/60 hover:border-lime-500/30 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-muted/50 rounded-2xl group-hover:bg-lime-500/10 transition-colors">
                                <Activity size={24} className="text-muted-foreground group-hover:text-lime-600" />
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${exam.status === 'Completed' ? 'bg-muted text-muted-foreground' :
                                    exam.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-lime-500/10 text-lime-600'
                                }`}>
                                {exam.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-1">{exam.name}</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Grade {exam.grade}</p>

                        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-auto">
                            <FileCheck size={12} />
                            {exam.date}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-muted/20 rounded-[2rem] border border-dashed border-border/60 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    No other upcoming exams found
                </p>
            </div>
        </AdminPageWrapper>
    );
}
