import React from 'react';

const DepartmentGrid = ({ departments = [], onRefresh }) => {
  if (departments.length === 0) {
    return (
      <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 scale-150">domain_disabled</span>
        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Departments Found</h3>
        <p className="text-slate-400 mt-2 font-medium">Get started by creating your first academic department.</p>
      </div>
    );
  }

  // Predefined color palettes for variety
  const colors = [
    'bg-primary/5 text-primary',
    'bg-green-50 text-green-600',
    'bg-purple-50 text-purple-600',
    'bg-amber-50 text-amber-600',
    'bg-cyan-50 text-cyan-600',
    'bg-red-50 text-red-600'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {departments.map((dept, i) => (
        <div key={dept.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 transition-all hover:shadow-xl hover:-translate-y-1 duration-500 group">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${colors[i % colors.length]}`}>
              <span className="material-symbols-outlined text-3xl">domain</span>
            </div>
            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{dept.code}</span>
            {dept.is_active ? (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            ) : (
              <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
            )}
          </div>
          
          <h4 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
            {dept.name}
          </h4>
          <p className="text-xs font-bold text-slate-400 mb-8 line-clamp-2 min-h-[32px]">
            {dept.description || "No description provided for this department."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-3xl border border-white mb-8">
            <div className="text-center border-r border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Academic Code</p>
              <p className="text-sm font-bold text-on-surface">{dept.code}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
              <p className={`text-sm font-bold ${dept.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                {dept.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Manage Sections</button>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-lg">account_tree</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Hierarchy Verified</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentGrid;
