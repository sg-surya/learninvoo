
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarView: React.FC = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekDates = [12, 13, 14, 15, 16, 17, 18];

    const events = [
        { time: '09:00 AM', title: 'Mathematics 101', class: 'Class 10-A', color: 'bg-lime-100 text-lime-700' },
        { time: '11:30 AM', title: 'Science Lab', class: 'Class 9-B', color: 'bg-sky-100 text-sky-700' },
        { time: '02:00 PM', title: 'Faculty Meeting', class: 'Main Hall', color: 'bg-purple-100 text-purple-700' },
        { time: '04:30 PM', title: 'Sports Coaching', class: 'Field', color: 'bg-orange-100 text-orange-700' },
    ];

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-50 rounded-2xl flex items-center justify-center text-lime-600">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">September 2024</h2>
                        <p className="text-gray-400 text-sm">Week 37 • School Term 2</p>
                    </div>
                </div>
                <div className="flex items-center bg-gray-50 p-1 rounded-xl">
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-lime-600">
                        <ChevronLeft size={18} />
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-600">This Week</span>
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-lime-600">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            <div className="flex gap-4 mb-8">
                {days.map((day, i) => (
                    <div key={day} className={`flex-1 p-4 rounded-3xl text-center border transition-all cursor-pointer ${i === 2 ? 'bg-lime-900 border-lime-900 shadow-lg text-white' : 'bg-white border-gray-100 text-gray-800 hover:border-lime-200'
                        }`}>
                        <span className={`block text-xs font-bold uppercase tracking-wider mb-2 ${i === 2 ? 'text-lime-100' : 'text-gray-400'}`}>{day}</span>
                        <span className="text-2xl font-extrabold">{weekDates[i]}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-6 px-2">Upcoming Events</h3>
                {events.map((event, i) => (
                    <div key={i} className="flex gap-6 items-center group cursor-pointer">
                        <span className="text-sm font-bold text-gray-400 w-20 text-right">{event.time}</span>
                        <div className={`flex-1 p-6 rounded-[2rem] border border-transparent hover:border-lime-100 transition-all ${event.color} flex justify-between items-center shadow-sm`}>
                            <div>
                                <h4 className="font-bold text-lg">{event.title}</h4>
                                <p className="opacity-70 text-sm font-semibold">{event.class}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;
