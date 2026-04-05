import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmissionsTable = () => {
  const navigate = useNavigate();
  const submissions = [
    { student: 'John Doe', id: 'S-10293', test: 'Data Structures Final', score: '88%', flags: 0, status: 'Clean' },
    { student: 'Alice Smith', id: 'S-45621', test: 'Algorithm Analysis Midterm', score: '92%', flags: 2, status: 'Flagged' },
    { student: 'Bob Johnson', id: 'S-77210', test: 'Operating Systems Quiz', score: '76%', flags: 1, status: 'Warning' },
    { student: 'Charlie Davis', id: 'S-33441', test: 'Computer Architecture Quiz', score: '81%', flags: 5, status: 'Critical' },
    { student: 'Diana Prince', id: 'S-99120', test: 'Machine Learning Lab', score: '98%', flags: 0, status: 'Clean' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Clean': return 'bg-green-50 text-green-600 border-green-100';
      case 'Flagged': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Critical': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Information</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Name</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Integrity</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-xs font-black">
                      {item.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.student}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-semibold text-slate-500 uppercase tracking-tight">{item.test}</td>
                <td className="px-8 py-6 text-center text-sm font-black text-primary">{item.score}</td>
                <td className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.flags > 0 && <span className="text-[10px] text-red-500 font-bold">{item.flags} incidents</span>}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => navigate(`/admin/submissions/${item.id}`)}
                    className="bg-primary/5 text-primary py-2 px-6 rounded-2xl text-xs font-black hover:bg-primary hover:text-white transition-all shadow-md shadow-primary/5 active:scale-95"
                  >
                    Auditing View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionsTable;
