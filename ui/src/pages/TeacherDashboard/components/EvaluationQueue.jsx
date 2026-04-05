import React from 'react';

const EvaluationQueue = () => {
  const queue = [
    { student: 'John Doe', assessment: 'Data Structures Final', id: 'DS-9823', date: '2026-04-05', status: 'Pending Review' },
    { student: 'Alice Smith', assessment: 'Algorithm Analysis Midterm', id: 'AA-4321', date: '2026-04-05', status: 'Pending Review' },
    { student: 'Bob Johnson', assessment: 'Operating Systems Quiz', id: 'OS-1122', date: '2026-04-05', status: 'Pending Review' },
    { student: 'Charlie Davis', assessment: 'Computer Architecture Quiz', id: 'CA-3344', date: '2026-04-05', status: 'In Review' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-on-surface">Evaluation Queue</h3>
        <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assessment</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Submitted</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary text-[10px]">
                      {item.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    {item.student}
                  </div>
                </td>
                <td className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-tight">{item.assessment}</td>
                <td className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-tight">{item.date}</td>
                <td className="px-8 py-4 text-right">
                  <button className="bg-primary/5 text-primary py-2 px-4 rounded-xl text-xs font-bold hover:bg-primary/10 transition-colors">
                    Review Submission
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

export default EvaluationQueue;
