import React from 'react';

const BulkValidationTable = () => {
  const validations = [
    { row: 1, name: 'John Doe', email: 'j.doe@univ.edu', role: 'Student', status: 'Ready' },
    { row: 2, name: 'Alice Smith', email: 'a.smith@univ.edu', role: 'Faculty', status: 'Duplicate Email' },
    { row: 3, name: 'Bob Johnson', id: 'S-7721', role: 'Student', status: 'Row Valid' },
    { row: 4, name: 'Charlie Davis', email: 'c.davis@univ.edu', role: 'Admin', status: 'Identity Assigned' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 transition-all hover:shadow-lg relative overflow-hidden">
      <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Pre-Processing Validation</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Row</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detected Identity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email / ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Flags</th>
            </tr>
          </thead>
          <tbody>
            {validations.map((v, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5 text-sm font-black text-slate-300">#{v.row}</td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{v.name}</span>
                </td>
                <td className="px-6 py-5 text-xs text-slate-500 font-bold">{v.email || v.id}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    v.status === 'Duplicate Email' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right flex justify-end gap-2">
                  <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[14px]">delete</span>
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

export default BulkValidationTable;
