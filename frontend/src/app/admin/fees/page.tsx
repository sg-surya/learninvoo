'use client';
import React, { useState } from 'react';
import AdminPageWrapper from '@/components/AdminPageWrapper';
import { CreditCard, DollarSign, Download, Plus, Search } from 'lucide-react';

export default function FeesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const transactions = [
        { id: 'TXN-001', student: 'Alice Smith', amount: '$500', date: 'Oct 20, 2024', status: 'Paid' },
        { id: 'TXN-002', student: 'Bob Johnson', amount: '$1200', date: 'Oct 21, 2024', status: 'Pending' },
        { id: 'TXN-003', student: 'Charlie Brown', amount: '$500', date: 'Oct 22, 2024', status: 'Paid' },
        { id: 'TXN-004', student: 'David Smith', amount: '$300', date: 'Oct 22, 2024', status: 'Late' },
    ];

    const filteredTxns = transactions.filter(txn =>
        txn.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminPageWrapper
            title="Fee Management"
            subtitle="Track payments, manage invoices, and view financial reports."
            icon={CreditCard}
            headerAction={
                <button className="px-6 py-3 bg-lime-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-lime-400 flex items-center gap-2 shadow-xl shadow-lime-500/20">
                    <Plus size={16} /> Record Payment
                </button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card-bg/60 backdrop-blur-md p-6 rounded-2xl border border-border/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-lg">+4.5%</span>
                    </div>
                    <h3 className="text-3xl font-black text-foreground">$45,200</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Collected (Oct)</p>
                </div>
                <div className="bg-card-bg/60 backdrop-blur-md p-6 rounded-2xl border border-border/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                            <CreditCard size={24} />
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-500/10 px-2 py-1 rounded-lg">High</span>
                    </div>
                    <h3 className="text-3xl font-black text-foreground">$12,450</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending Dues</p>
                </div>
                <div className="bg-card-bg/60 backdrop-blur-md p-6 rounded-2xl border border-border/60">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Download size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-foreground">142</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invoices Generated</p>
                </div>
            </div>

            <div className="bg-card-bg/60 backdrop-blur-xl rounded-[2rem] border border-border/60 overflow-hidden">
                <div className="p-6 border-b border-border/40 flex justify-between items-center gap-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Transactions</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lime-500/20"
                        />
                    </div>
                </div>
                <table className="w-full">
                    <thead className="bg-muted/30 text-xs font-black uppercase tracking-wider text-muted-foreground text-left">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {filteredTxns.length > 0 ? (
                            filteredTxns.map((txn, i) => (
                                <tr key={i} className="group hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-foreground">{txn.id}</td>
                                    <td className="px-6 py-4 font-bold text-foreground">{txn.student}</td>
                                    <td className="px-6 py-4 font-black">{txn.amount}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{txn.date}</td>
                                    <td className="px-6 py-4 leading-none">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide inline-block
                                            ${txn.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' :
                                                txn.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                                                    'bg-rose-500/10 text-rose-600'}`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                                    No transactions found matching "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminPageWrapper>
    );
}
