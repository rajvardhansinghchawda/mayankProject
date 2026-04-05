import React from 'react';

const stats = [
  { label: 'Total Students', value: '1,284', icon: 'groups', color: 'text-primary bg-primary/5' },
  { label: 'Faculty Members', value: '86', icon: 'school', color: 'text-blue-600 bg-blue-50' },
  { label: 'Active Depts', value: '12', icon: 'account_balance', color: 'text-green-600 bg-green-50' },
  { label: 'Pending Apps', value: '45', icon: 'pending_actions', color: 'text-amber-600 bg-amber-50' },
];

const ManagementStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
            <span className="material-symbols-outlined">{stat.icon}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="text-xl font-black text-on-surface">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManagementStats;
