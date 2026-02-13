'use client';

import React, { useState, useEffect } from 'react';
import {
    Clock,
    ListTodo,
    MapPin,
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    MoreVertical,
    CheckCircle2,
    Sparkles,
    Video,
    Users,
    Coffee,
    PlayCircle,
    FileText,
    ArrowUpRight,
    Circle,
    CheckCircle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial data structure
const INITIAL_SCHEDULES: Record<number, any[]> = {
    12: [
        { id: 1, time: '08:00 AM', duration: '45m', title: 'Lesson Preparation', location: 'Faculty Lounge', type: 'Prep', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10', completed: false, tasks: ['Review Physics PPT', 'Print worksheet'] },
        { id: 2, time: '09:00 AM', duration: '60m', title: 'Mathematics (Advanced)', location: 'Room 4-B', type: 'Class', icon: Users, color: 'text-primary-custom', bg: 'bg-primary-custom/10', completed: false, tasks: ['Attendance', 'Chapter 4 Quiz', 'Check Homework'] },
        { id: 3, time: '10:15 AM', duration: '60m', title: 'Biology Class', location: 'Science Lab', type: 'Class', icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10', completed: false, tasks: ['Setup Microscopes', 'Safety Briefing'] },
        { id: 4, time: '12:00 PM', duration: '45m', title: 'Lunch Break', location: 'Green Canteen', type: 'Break', icon: Coffee, color: 'text-rose-500', bg: 'bg-rose-500/10', completed: false },
        { id: 5, time: '01:30 PM', duration: '90m', title: 'Parent-Teacher Meeting', location: 'Zoom (Virtual)', type: 'Meeting', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10', completed: false, tasks: ['Discuss Semester Reports'] }
    ],
    13: [
        { id: 6, time: '08:30 AM', duration: '60m', title: 'English Literature', location: 'Room 2-A', type: 'Class', icon: Users, color: 'text-primary-custom', bg: 'bg-primary-custom/10', completed: false, tasks: ['Tale of Two Cities Discussion'] },
        { id: 7, time: '11:00 AM', duration: '45m', title: 'Staff Meeting', location: 'Conference Hall', type: 'Meeting', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10', completed: false },
        { id: 8, time: '02:00 PM', duration: '60m', title: 'Chemistry Lab', location: 'Lab 3', type: 'Class', icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10', completed: false }
    ],
    15: [
        { id: 9, time: '09:30 AM', duration: '60m', title: 'Physics (Advanced)', location: 'Room 4-A', type: 'Class', icon: Users, color: 'text-primary-custom', bg: 'bg-primary-custom/10', completed: false, tasks: ['Review Chapter 5', 'Problem Solving'] },
        { id: 10, time: '11:00 AM', duration: '30m', title: 'Office Hours', location: 'Office 101', type: 'Meeting', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10', completed: false },
        { id: 11, time: '03:00 PM', duration: '60m', title: 'Curriculum Planning', location: 'Faculty Lounge', type: 'Prep', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10', completed: false, tasks: ['Next Semester Topics'] }
    ],
    16: [
        { id: 12, time: '08:00 AM', duration: '45m', title: 'Morning Briefing', location: 'Staff Room', type: 'Meeting', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10', completed: false },
        { id: 13, time: '10:00 AM', duration: '90m', title: 'Art Class', location: 'Art Studio', type: 'Class', icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10', completed: false, tasks: ['Painting Techniques', 'Critique Session'] }
    ]
};

const ScheduleView: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(12);
    const [allSchedules, setAllSchedules] = useState(INITIAL_SCHEDULES);
    const [currentSchedule, setCurrentSchedule] = useState<any[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newEntry, setNewEntry] = useState({
        title: '',
        time: '',
        duration: '',
        location: '',
        type: 'Class'
    });

    useEffect(() => {
        setCurrentSchedule(allSchedules[selectedDate] || []);
        setCompletedTasks(new Set());
    }, [selectedDate, allSchedules]);

    const toggleCompletion = (id: number) => {
        const newSet = new Set(completedTasks);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setCompletedTasks(newSet);
    };

    const handleAddEntry = (e: React.FormEvent) => {
        e.preventDefault();

        const typeConfig: any = {
            'Class': { icon: Users, color: 'text-primary-custom', bg: 'bg-primary-custom/10' },
            'Meeting': { icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            'Prep': { icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            'Break': { icon: Coffee, color: 'text-rose-500', bg: 'bg-rose-500/10' }
        };

        const config = typeConfig[newEntry.type] || typeConfig['Class'];

        const newItem = {
            id: Date.now(),
            ...newEntry,
            ...config,
            completed: false,
            tasks: []
        };

        setAllSchedules(prev => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), newItem].sort((a, b) => a.time.localeCompare(b.time))
        }));

        setIsAddModalOpen(false);
        setNewEntry({ title: '', time: '', duration: '', location: '', type: 'Class' });
    };

    const days = [
        { name: 'Mon', date: 12, hasEvents: true },
        { name: 'Tue', date: 13, hasEvents: true },
        { name: 'Wed', date: 14, hasEvents: false },
        { name: 'Thu', date: 15, hasEvents: true },
        { name: 'Fri', date: 16, hasEvents: true },
        { name: 'Sat', date: 17, hasEvents: false },
        { name: 'Sun', date: 18, hasEvents: false },
    ];

    return (
        <div className="px-10 py-8 w-full bg-transparent relative">
            {/* Add Entry Modal Overlay */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-card-bg border border-border rounded-3xl p-8 z-[110] shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-custom/10 text-primary-custom rounded-xl flex items-center justify-center">
                                        <Plus size={20} />
                                    </div>
                                    <h3 className="text-xl font-black font-display italic uppercase tracking-tight">Create <span className="text-primary-custom">Entry</span></h3>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 hover:bg-muted rounded-xl flex items-center justify-center transition-colors">
                                    <X size={20} className="text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleAddEntry} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Activity Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Physics Workshop"
                                        className="w-full bg-muted border-none p-4 rounded-xl text-sm font-bold placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary-custom/20"
                                        value={newEntry.title}
                                        onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Start Time</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="09:00 AM"
                                            className="w-full bg-muted border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-custom/20"
                                            value={newEntry.time}
                                            onChange={e => setNewEntry({ ...newEntry, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Duration</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="60m"
                                            className="w-full bg-muted border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-custom/20"
                                            value={newEntry.duration}
                                            onChange={e => setNewEntry({ ...newEntry, duration: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Location</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Room 4-A or Zoom link"
                                        className="w-full bg-muted border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-custom/20"
                                        value={newEntry.location}
                                        onChange={e => setNewEntry({ ...newEntry, location: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Category</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['Class', 'Meeting', 'Prep', 'Break'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setNewEntry({ ...newEntry, type: t })}
                                                className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                                                    ${newEntry.type === t ? 'bg-primary-custom border-primary-custom text-white shadow-lg shadow-primary-custom/20' : 'bg-muted border-transparent text-muted-foreground hover:border-primary-custom/30'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-primary-custom text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-primary-custom/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                                    Confirm Entry
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Header / Date Selection */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-card-bg border border-border rounded-2xl flex items-center justify-center shadow-soft">
                        <CalendarIcon size={28} className="text-primary-custom" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-foreground font-display tracking-tight uppercase italic leading-none">
                            Week <span className="text-primary-custom">37</span>
                        </h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">September 2024 • Academic Term 2</p>
                    </div>
                </div>

                {/* Week Selector Grid */}
                <div className="flex items-center gap-2 p-1.5 bg-card-bg/60 backdrop-blur-md rounded-2xl border border-border/50">
                    {days.map((day) => (
                        <button
                            key={day.date}
                            onClick={() => setSelectedDate(day.date)}
                            className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all duration-300
                                ${selectedDate === day.date
                                    ? 'bg-primary-custom text-white shadow-lg shadow-primary-custom/20 scale-105'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                            <span className={`text-[9px] font-black uppercase tracking-widest ${selectedDate === day.date ? 'text-white/70' : ''}`}>{day.name}</span>
                            <span className="text-lg font-black font-display italic mt-0.5">{day.date}</span>
                            {day.hasEvents && !(selectedDate === day.date) && (
                                <div className="w-1 h-1 rounded-full bg-primary-custom mt-1" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
                {/* Timeline - Teacher Command Center */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.4em] italic border-l-4 border-primary-custom pl-4 py-1">
                                Daily Timeline
                            </h3>
                            <span className="px-2 py-0.5 bg-muted rounded-md text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                                {currentSchedule.length} Items
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-custom text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-custom/20 hover:opacity-90 transition-all"
                        >
                            <Plus size={16} /> New Entry
                        </button>
                    </div>

                    <div className="relative pl-14 space-y-10">
                        {/* Vertical Progress Line */}
                        <div className="absolute left-[27px] top-6 bottom-6 w-[1.5px] bg-gradient-to-b from-primary-custom via-border to-transparent" />

                        <AnimatePresence mode="popLayout">
                            {currentSchedule.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative group"
                                >
                                    {/* Connectivity Dot */}
                                    <div className={`absolute left-[-54px] top-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 z-10
                                        ${completedTasks.has(item.id) ? 'bg-emerald-500 border-emerald-500 text-white' : `${item.bg} ${item.color} border-current/20 group-hover:scale-110 shadow-lg shadow-current/5`}`}>
                                        {completedTasks.has(item.id) ? <CheckCircle size={24} /> : <item.icon size={24} strokeWidth={1.5} />}
                                    </div>

                                    <div className={`bg-card-bg/40 backdrop-blur-md border rounded-2xl p-6 transition-all duration-500
                                        ${completedTasks.has(item.id) ? 'border-emerald-500/30 opacity-60' : 'border-border/50 hover:border-primary-custom/30 group-hover:bg-card-bg/80 shadow-soft'}`}>

                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current/20 ${item.color} ${item.bg}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock size={12} /> {item.time} ({item.duration})
                                                    </span>
                                                </div>

                                                <div>
                                                    <h4 className={`text-2xl font-black font-display tracking-tight italic transition-colors ${completedTasks.has(item.id) ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary-custom'}`}>
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1 font-bold">
                                                        <MapPin size={14} className="opacity-50" /> {item.location}
                                                    </div>
                                                </div>

                                                {/* Interactive Action Area */}
                                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                                    {item.type === 'Class' && (
                                                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-custom text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:translate-y-[-2px] transition-all">
                                                            <PlayCircle size={14} /> Launch Class
                                                        </button>
                                                    )}
                                                    {item.type === 'Meeting' && (
                                                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:translate-y-[-2px] transition-all">
                                                            <Video size={14} /> Join Session
                                                        </button>
                                                    )}
                                                    {item.type === 'Prep' && (
                                                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:translate-y-[-2px] transition-all">
                                                            <FileText size={14} /> View Plan
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => toggleCompletion(item.id)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                            ${completedTasks.has(item.id) ? 'bg-muted text-muted-foreground' : 'bg-muted/50 text-foreground hover:bg-emerald-500/10 hover:text-emerald-500'}`}
                                                    >
                                                        {completedTasks.has(item.id) ? <CheckCircle size={14} /> : <Circle size={14} />}
                                                        {completedTasks.has(item.id) ? 'Completed' : 'Mark Done'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub-tasks / Checkpoints */}
                                            {item.tasks && item.tasks.length > 0 && (
                                                <div className="md:w-64 bg-muted/30 rounded-xl p-4 border border-border/40">
                                                    <h5 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-between">
                                                        Checklist <span>{item.tasks.length}</span>
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {item.tasks.map((task: string, tIdx: number) => (
                                                            <div key={tIdx} className="flex items-center gap-2 text-[11px] font-bold text-foreground/80">
                                                                <div className="w-1 h-1 rounded-full bg-primary-custom" />
                                                                {task}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {currentSchedule.length === 0 && (
                            <div className="py-20 text-center bg-card-bg/20 border-2 border-dashed border-border/50 rounded-2xl">
                                <p className="text-muted-foreground font-bold italic">No events scheduled for this day.</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="mt-4 text-primary-custom font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto"
                                >
                                    <Plus size={16} /> Add First Entry
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Teacher Sidebar Tools */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Real-time Status */}
                    <div className="bg-card-bg/60 backdrop-blur-md border border-border/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary-custom/10 text-primary-custom rounded-xl flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Status</h4>
                                <p className="text-sm font-black text-foreground font-display italic">Term 2 Progress</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    <span>Weekly Workload</span>
                                    <span className="text-primary-custom">82%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-custom w-[82%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
                                </div>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                                <div className="text-center flex-1">
                                    <h5 className="text-xl font-black font-display italic leading-none">24</h5>
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Class Hours</p>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div className="text-center flex-1">
                                    <h5 className="text-xl font-black font-display italic leading-none text-sky-500">12</h5>
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Assessments</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Assistant Context Box */}
                    <div className="bg-gradient-to-br from-primary-custom to-emerald-500 rounded-2xl p-6 text-white group relative overflow-hidden shadow-xl shadow-primary-custom/20">
                        <div className="absolute top-[-20%] right-[-20%] opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <Sparkles size={140} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 w-fit border border-white/20">
                                <Sparkles size={14} className="fill-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Aiva Assistant</span>
                            </div>
                            <p className="text-sm font-bold leading-relaxed italic mb-6">
                                "You have back-to-back classes starting in 15 mins. I've pre-loaded the 'Quadratic Equations' simulation for your 9:00 AM class."
                            </p>
                            <button className="w-full py-4 bg-white text-primary-custom rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-white/20 hover:-translate-y-1 transition-all">
                                Open Simulation
                            </button>
                        </div>
                    </div>

                    {/* Urgent Action List */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2 italic">Urgent Tasks</h4>
                        {[
                            { title: 'Submited Attendance', time: 'Due now', color: 'bg-rose-500' },
                            { title: 'Evaluate Group A Quiz', time: 'Next 2h', color: 'bg-amber-500' }
                        ].map((task, i) => (
                            <div key={i} className="bg-card-bg border border-border/50 rounded-2xl p-5 hover:border-primary-custom/30 transition-all cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-1.5 h-1.5 rounded-full ${task.color} animate-pulse`} />
                                    <div>
                                        <h5 className="text-xs font-black uppercase tracking-tight text-foreground group-hover:text-primary-custom transition-colors">{task.title}</h5>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 italic">{task.time}</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary-custom transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleView;
