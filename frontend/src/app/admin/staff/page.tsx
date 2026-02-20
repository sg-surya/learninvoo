'use client';
import React, { useState } from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { Users, UserPlus, Search, Filter } from 'lucide-react';

export default function StaffPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const staff = [
        { name: 'Sarah Johnson', role: 'Mathematics Lead', status: 'Active', email: 'sarah.j@learnivo.edu' },
        { name: 'Michael Chen', role: 'Science Dept.', status: 'On Leave', email: 'm.chen@learnivo.edu' },
        { name: 'Dr. Emily Carter', role: 'Principal', status: 'Active', email: 'principal@learnivo.edu' },
        { name: 'David Smith', role: 'History Teacher', status: 'Active', email: 'd.smith@learnivo.edu' },
        { name: 'Lisa Ray', role: 'English Teacher', status: 'Active', email: 'l.ray@learnivo.edu' },
    ];

    const filteredStaff = staff.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminPageWrapper
            title="Teaching Staff"
            subtitle="Manage faculty profiles, roles, and assignments."
            icon={Users}
            headerAction={
                <button className="px-6 py-3 bg-foreground text-background rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 flex items-center gap-2 shadow-xl">
                    <UserPlus size={16} /> Add Teacher
                </button>
            }
        >
            <div className="bg-card-bg/60 backdrop-blur-xl rounded-[2rem] border border-border/60 overflow-hidden">
                <div className="p-6 border-b border-border/40 flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search staff..."
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
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((employee, i) => (
                                    <tr key={i} className="group hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-bold text-foreground">{employee.name}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{employee.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${employee.status === 'Active' ? 'bg-lime-500/10 text-lime-600' : 'bg-amber-500/10 text-amber-600'
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{employee.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-blue-500 hover:text-blue-600">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                                        No staff members found matching "{searchQuery}"
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
