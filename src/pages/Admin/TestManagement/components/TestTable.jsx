import React from 'react';

const TestTable = () => {
  const tests = [
    { name: 'Introduction to AI', code: 'DS-101', questions: 25, duration: '60m', status: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
    { name: 'Deep Learning Midterm', code: 'AI-402', questions: 40, duration: '120m', status: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
    { name: 'Natural Language Processing', code: 'CS-305', questions: 35, duration: '90m', status: 'Draft', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: 'Operating Systems Quiz', code: 'OS-201', questions: 15, duration: '30m', status: 'Archived', color: 'bg-slate-50 text-slate-400 border-slate-100' },
    { name: 'Machine Learning Lab', code: 'CS-201', questions: 10, duration: '45m', status: 'Active', color: 'bg-green-50 text-green-600 border-green-100' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-on-surface uppercase tracking-[0.2em] text-[10px] text-primary">Live Assessment Inventory</h3>
        <div className="flex gap-2">
          {['Active', 'Draft', 'Archived'].map((status) => (
            <button key={status} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-50 text-slate-400 hover:text-primary transition-all">
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Information</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Questions</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Duration</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{test.name}</h4>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-50">{test.code}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">{test.questions}</td>
                <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">{test.duration}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${test.color}`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">analytics</span>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestTable;
