import React from 'react';

const InstitutionalStats = ({ stats }) => {
  const displayStats = [
    { 
      label: 'Total Users', 
      value: stats?.total_users?.toLocaleString() || '0', 
      change: 'All Roles', 
      icon: 'group', 
      color: 'bg-primary/5 text-primary' 
    },
    { 
      label: 'Active Assessments', 
      value: String(stats?.total_tests || stats?.active_tests || '0'), 
      change: 'Live Now', 
      icon: 'quiz', 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      label: 'Departments', 
      value: String(stats?.total_departments || stats?.departments_count || '0'), 
      change: 'Institutional Core', 
      icon: 'account_tree', 
      color: 'bg-amber-50 text-amber-600' 
    },
    { 
      label: 'Pending Review', 
      value: String(stats?.pending_docs ?? '—'), 
      change: 'Awaiting Approval', 
      icon: 'pending_actions', 
      color: 'bg-rose-50 text-rose-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {displayStats.map((stat, i) => (
        <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.change}</div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-3xl font-black text-on-surface tracking-tighter">{stat.value}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
};

export default InstitutionalStats;
