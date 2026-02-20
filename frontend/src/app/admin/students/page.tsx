'use client';
import React, { useState } from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { GraduationCap, UserPlus, Search, Filter } from 'lucide-react';

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const students = [
        { name: 'Alice Smith', grade: '10', class: 'A', id: 'S1001', status: 'Active' },
        { name: 'Bob Johnson', grade: '9', class: 'B', id: 'S1002', status: 'Active' },
        { name: 'Charlie Brown', grade: '12', class: 'A', id: 'S1003', status: 'Active' },
        { name: 'Daisy Miller', grade: '11', class: 'C', id: 'S1004', status: 'Suspended' },
        { name: 'Ethan Hunt', grade: '10', class: 'B', id: 'S1005', status: 'Active' },
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminPageWrapper
            title="Student Directory"
            subtitle="View and manage student profiles, performance, and records."
            icon={GraduationCap}
            headerAction={
                <button className="px-6 py-3 bg-foreground text-background rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 flex items-center gap-2 shadow-xl">
                    <UserPlus size={16} /> Enroll Student
                </button>
            }
        >
            <div className="bg-card-bg/60 backdrop-blur-xl rounded-[2rem] border border-border/60 overflow-hidden">
                <div className="p-6 border-b border-border/40 flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                        />
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
                        <Filter size={18} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30 text-xs font-black uppercase tracking-wider text-muted-foreground text-left">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Grade</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, i) => (
                                    <tr key={i} className="group hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-foreground">{student.name}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.grade}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.class}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{student.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${student.status === 'Active' ? 'bg-lime-500/10 text-lime-600' : 'bg-red-500/10 text-red-600'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-blue-500 hover:text-blue-600 mr-4">View</button>
                                            <button className="text-xs font-bold text-rose-500 hover:text-rose-600">Action</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                                        No students found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPageWrapper>
    );
}
