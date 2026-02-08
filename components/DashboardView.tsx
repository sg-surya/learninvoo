
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Search } from 'lucide-react';
import { PERFORMANCE_DATA, CLASSES_DATA, TOP_STUDENTS } from '../constants';

interface DashboardViewProps {
  onClassClick: (classId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onClassClick }) => {
  return (
    <div className="p-8 w-full">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back, Jane!</h2>
          <p className="text-gray-400 text-sm">Here's what's happening with your students today.</p>
        </div>
        <button className="flex items-center gap-2 bg-lime-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-lime-100 hover:bg-lime-700 transition-colors">
          <Plus size={18} />
          <span>Quick Actions</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Students', value: '450', color: 'bg-lime-400', img: 'https://picsum.photos/seed/kids1/200/200' },
          { label: 'Total Assignments', value: '1,050', color: 'bg-emerald-400', img: 'https://picsum.photos/seed/kids2/200/200' },
          { label: 'Total Classrooms', value: '20', color: 'bg-sky-400', img: 'https://picsum.photos/seed/kids3/200/200' },
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl p-8 h-44 flex flex-col justify-between group cursor-pointer`}>
            {/* Background Gradient Simulation */}
            <div className={`absolute inset-0 ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="relative z-10">
              <span className="text-4xl font-extrabold text-gray-800">{stat.value}</span>
              <p className="text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
            {/* Character Illustration */}
            <div className="absolute right-[-10px] bottom-[-10px] w-32 h-32 opacity-80 group-hover:scale-110 transition-transform">
               <img src={stat.img} alt="Character" className="rounded-full object-cover w-full h-full shadow-lg border-4 border-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800"><span className="text-lime-600">86.45%</span> Average Performance</h3>
            </div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg text-xs font-semibold text-gray-500">
              <button className="px-3 py-1 hover:text-lime-700">Weekly</button>
              <button className="px-3 py-1 hover:text-lime-700">Monthly</button>
              <button className="px-3 py-1 bg-lime-600 text-white shadow-sm rounded-md">Annually</button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                  labelStyle={{fontWeight: 'bold', color: '#374151'}}
                />
                <Area type="monotone" dataKey="value" stroke="#65a30d" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Scoring Students */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Scoring Students</h3>
          <div className="space-y-6">
            {TOP_STUDENTS.map((student, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={student.image} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">{student.name}</h4>
                    <p className="text-xs text-gray-400">{student.class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-800">{student.score}%</span>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-lime-50 text-lime-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Search size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classrooms Table */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-800">Recent Classrooms</h3>
            <button className="text-sm font-semibold text-gray-500 hover:text-lime-600">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 font-semibold border-b border-gray-50">
                <tr>
                  <th className="pb-4">MY CLASS</th>
                  <th className="pb-4">STUDENTS</th>
                  <th className="pb-4">GRADE</th>
                  <th className="pb-4">START DATE</th>
                  <th className="pb-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CLASSES_DATA.map((cls) => (
                  <tr key={cls.id} className="hover:bg-lime-50/50 transition-colors cursor-pointer" onClick={() => onClassClick(cls.id)}>
                    <td className="py-5 font-semibold text-gray-800">{cls.name}</td>
                    <td className="py-5 text-gray-600">{cls.studentsCount}</td>
                    <td className="py-5">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                        cls.grade === 'A' ? 'bg-lime-50 text-lime-600' :
                        cls.grade === 'B' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {cls.grade}
                      </span>
                    </td>
                    <td className="py-5 text-gray-500">{cls.startDate}</td>
                    <td className="py-5 text-center">
                      <button className="p-2 text-gray-400 hover:text-lime-600"><Plus size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
