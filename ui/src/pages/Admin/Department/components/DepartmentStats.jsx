import React from 'react';

const DepartmentStats = ({ stats }) => {
  const items = [
    { label: 'Total Departments', value: stats?.total_departments || 0, icon: 'account_tree', color: 'text-primary' },
    { label: 'Academic Sections', value: '84', icon: 'grid_view', color: 'text-green-600' },
    { label: 'Active Faculty', value: stats?.total_teachers || 0, icon: 'groups', color: 'text-purple-600' },
    { label: 'Total Students', value: stats?.total_students || 0, icon: 'school', color: 'text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {items.map((stat, i) => (
        <div key={i} className="bg-slate-50 rounded-[32px] p-8 border border-white shadow-sm hover:shadow-lg transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Sync</span>
          </div>
          <h3 className="text-3xl font-black text-on-surface mb-1">{stat.value}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DepartmentStats;
