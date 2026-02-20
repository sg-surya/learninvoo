'use client';
import React from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { Calendar, UserCheck, PieChart } from 'lucide-react';

export default function AttendancePage() {
    return (
        <AdminPageWrapper
            title="Attendance Monitoring"
            subtitle="Track daily student and staff attendance."
            icon={Calendar}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card-bg/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/60">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-lime-500/10 text-lime-600 rounded-xl">
                            <UserCheck size={24} />
                        </div>
                        <h3 className="text-xl font-black text-foreground">Student Attendance</h3>
                    </div>
                    <div className="text-4xl font-black text-foreground mb-2">94%</div>
                    <p className="text-sm text-muted-foreground">Average attendance today. 42 students absent.</p>
                </div>

                <div className="bg-card-bg/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/60">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                            <PieChart size={24} />
                        </div>
                        <h3 className="text-xl font-black text-foreground">Staff Attendance</h3>
                    </div>
                    <div className="text-4xl font-black text-foreground mb-2">98%</div>
                    <p className="text-sm text-muted-foreground">3 teachers on leave today.</p>
                </div>
            </div>

            <div className="bg-card-bg/60 backdrop-blur-xl rounded-[2rem] border border-border/60 p-12 text-center">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Detailed attendance reports coming soon.
                </p>
            </div>
        </AdminPageWrapper>
    );
}
