
import React from 'react';
import { ArrowLeft, Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CLASS_STUDENTS } from '../constants';

interface ClassDetailViewProps {
  onBack: () => void;
}

const PIE_DATA = [
  { name: 'A', value: 39.11, color: '#65a30d' }, // Lime 600
  { name: 'B', value: 28.02, color: '#84cc16' }, // Lime 500
  { name: 'C', value: 23.13, color: '#bef264' }, // Lime 300
  { name: 'D', value: 5.03, color: '#dcfce7' },  // Emerald 100
  { name: 'E', value: 5.03, color: '#ecfccb' },  // Lime 100
];

const ClassDetailView: React.FC<ClassDetailViewProps> = ({ onBack }) => {
  return (
    <div className="p-8 w-full">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-lime-50 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mathematic</h1>
            <p className="text-gray-400 text-sm">Manage your students, gain insight into their performance.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-lime-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-lime-100 hover:bg-lime-700 transition-colors">
          <Plus size={18} />
          <span>Add Assignment</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Stat 1 */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 h-48 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-lime-100 opacity-20"></div>
          <div className="relative z-10">
            <span className="text-gray-500 font-semibold block mb-2">Students</span>
            <span className="text-6xl font-extrabold text-gray-800">50</span>
          </div>
          <img src="https://picsum.photos/seed/studs/200/200" className="absolute right-0 bottom-0 w-32 opacity-40 group-hover:scale-110 transition-transform" alt="Students stat decoration" />
        </div>

        {/* Stat 2 */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-8 h-48 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-100 opacity-20"></div>
          <div className="relative z-10">
            <span className="text-gray-500 font-semibold block mb-2">Class Average</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-gray-800">80.66%</span>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-lime-50 rounded-full flex items-center justify-center text-5xl font-bold text-lime-400 group-hover:rotate-12 transition-transform">%</div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 h-48 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Grade distribution</h3>
          <div className="flex-1 flex">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center text-[10px] gap-1 font-semibold text-gray-400 min-w-[100px]">
              {PIE_DATA.map((entry) => (
                <div key={entry.name} className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: entry.color}}></div>
                     <span>{entry.name}</span>
                   </div>
                   <span className="text-gray-600">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-8 pb-0 flex justify-between items-center">
          <div className="flex gap-4">
            {['Students', 'Assignments', 'Interests', 'Insights'].map((tab, i) => (
              <button 
                key={tab} 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  i === 0 ? 'bg-lime-100 text-lime-700' : 'text-gray-400 hover:bg-lime-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-100"
            />
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">My Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 font-semibold border-b border-gray-50">
                <tr>
                  <th className="pb-4">FIRST NAME</th>
                  <th className="pb-4">LAST NAME</th>
                  <th className="pb-4">AGE</th>
                  <th className="pb-4">INTERESTS</th>
                  <th className="pb-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CLASS_STUDENTS.map((student) => (
                  <tr key={student.id} className="hover:bg-lime-50/50 transition-colors group">
                    <td className="py-5 font-semibold text-gray-800">{student.firstName}</td>
                    <td className="py-5 font-semibold text-gray-800">{student.lastName}</td>
                    <td className="py-5 text-gray-600">{student.age}</td>
                    <td className="py-5">
                      <div className="flex gap-2">
                        {student.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-lime-50 text-lime-600 rounded-full text-[10px] font-bold">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <div className="flex justify-center gap-3">
                        <button className="p-2 text-lime-600 hover:bg-lime-50 rounded-lg"><Edit2 size={16} /></button>
                        <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-10">
            <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-lime-50 hover:text-lime-600">
              <ChevronLeft size={20} />
            </button>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Page 1 of 10</span>
            <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-lime-50 hover:text-lime-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailView;
