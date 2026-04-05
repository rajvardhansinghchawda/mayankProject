import React from 'react';

const AdminResults = () => {
  const classStats = {
    avgScore: 72.4,
    highest: 98,
    lowest: 32,
    totalStudents: 142,
    passRate: "88.2%",
    totalAssessments: 12,
  };

  const studentRankings = [
    { id: 1, name: "Alice Thompson", score: 98, trend: "up", dept: "Comp. Science" },
    { id: 2, name: "Bob Richards", score: 96, trend: "up", dept: "Information Tech." },
    { id: 3, name: "Charlie Davis", score: 94, trend: "down", dept: "Comp. Science" },
    { id: 4, name: "Diana Prince", score: 92, trend: "stable", dept: "Electronics" },
    { id: 5, name: "Edward Norton", score: 91, trend: "up", dept: "Mechanical" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Class Analytics</h1>
          <p className="text-on-surface-variant font-medium">Monitoring academic performance across all departments and sessions.</p>
        </div>
        <select className="bg-white border-slate-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm focus:ring-2 focus:ring-primary/20 outline-none">
          <option>Batch 2023-27 • Semester 4</option>
          <option>Batch 2022-26 • Semester 6</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Class Average', value: classStats.avgScore + '%', icon: 'monitoring', color: 'bg-primary/5 text-primary' },
          { label: 'Pass Rate', value: classStats.passRate, icon: 'check_circle', color: 'bg-green-50 text-green-600' },
          { label: 'Top Score', value: classStats.highest, icon: 'military_tech', color: 'bg-amber-50 text-amber-600' },
          { label: 'Participation', value: '94%', icon: 'groups', color: 'bg-blue-50 text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rankings Table */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-primary uppercase tracking-widest text-xs">Top Performers</h3>
              <button className="text-xs font-bold text-primary hover:underline">View Full Ledger</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dept</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRankings.map((student, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-surface-container-high rounded-full flex items-center justify-center font-bold text-xs uppercase text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-bold text-on-surface">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-xs font-semibold text-slate-500">{student.dept}</td>
                      <td className="px-8 py-4 text-center">
                        <span className="font-black text-on-surface">{student.score}%</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        {student.trend === 'up' ? (
                          <span className="material-symbols-outlined text-green-500">trending_up</span>
                        ) : student.trend === 'down' ? (
                          <span className="material-symbols-outlined text-error">trending_down</span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">trending_flat</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Subject Insights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
            <h4 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-6 font-primary">Class Distribution</h4>
            <div className="flex items-end gap-3 h-32 mb-6">
              {[40, 65, 85, 95, 70, 50, 30].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/30 rounded-t-lg transition-all hover:bg-primary" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="text-xs font-medium text-white/70">Bell curve analysis indicates normal distribution with a slight positive skew toward excellence.</p>
          </div>

          <div className="bg-surface-container-high rounded-[40px] p-8 border border-white">
            <h4 className="text-base font-black text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">insights</span>
              Actionable Intelligence
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                <p className="text-xs text-on-surface-variant font-medium">8 students are consistently scoring below PASS thresholds.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                <p className="text-xs text-on-surface-variant font-medium">Advanced Web Tech module has the highest failure rate this term.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
