
import React from 'react';
// Added Plus icon to imports
import { Clock, ListTodo, MapPin, Plus } from 'lucide-react';

const ScheduleView: React.FC = () => {
  const schedule = [
    { time: '08:00', duration: '45m', title: 'Prep Time', location: 'Office 202', type: 'Work' },
    { time: '09:00', duration: '60m', title: 'Algebra Honors', location: 'Room 4-B', type: 'Class' },
    { time: '10:15', duration: '60m', title: 'Biology Advanced', location: 'Science Lab', type: 'Class' },
    { time: '12:00', duration: '45m', title: 'Lunch Break', location: 'Staff Lounge', type: 'Rest' },
    { time: '13:00', duration: '90m', title: 'Curriculum Meeting', location: 'Conference Room', type: 'Meeting' },
    { time: '15:00', duration: '60m', title: 'Office Hours', location: 'Online / Zoom', type: 'Student Support' },
  ];

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Today's Schedule</h2>
          <p className="text-gray-400 font-semibold mt-1">Monday, September 12 • 6 Items Planned</p>
        </div>
        <div className="w-14 h-14 bg-lime-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-lime-100">
           <Clock size={28} />
        </div>
      </header>

      <div className="relative">
        {/* Timeline Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>

        <div className="space-y-10 relative">
          {schedule.map((item, i) => (
            <div key={i} className="flex gap-10 group">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md z-10 relative flex items-center justify-center ${
                  item.type === 'Class' ? 'bg-lime-600' : 
                  item.type === 'Meeting' ? 'bg-purple-600' : 
                  item.type === 'Rest' ? 'bg-orange-600' : 'bg-sky-600'
                }`}>
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1 bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-lime-700 uppercase tracking-widest bg-lime-50 px-3 py-1 rounded-full">{item.type}</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-3">{item.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-gray-900 leading-none">{item.time}</p>
                    <p className="text-xs font-bold text-gray-400 mt-1 italic">{item.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-gray-400 font-semibold text-sm">
                    <MapPin size={16} className="text-gray-300" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 font-semibold text-sm">
                    <ListTodo size={16} className="text-gray-300" />
                    <span>3 Tasks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="w-full mt-10 py-5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold text-sm hover:bg-lime-50 hover:border-lime-200 hover:text-lime-600 transition-all flex items-center justify-center gap-2">
        <Plus size={18} />
        Add to Timeline
      </button>
    </div>
  );
};

export default ScheduleView;
