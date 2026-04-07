import React from 'react';

const TeacherStats = ({ stats }) => {
  const displayStats = [
    { label: 'Total Batches', value: stats?.totalBatches || '0', icon: 'groups', color: 'bg-primary/5 text-primary' },
    { label: 'Active Students', value: stats?.activeStudents || '0', icon: 'person', color: 'bg-green-50 text-green-600' },
    { label: 'Total Resources', value: stats?.totalResources || '0', icon: 'folder_open', color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Reviews', value: stats?.pendingReviews || '0', icon: 'pending_actions', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {displayStats.map((stat, i) => (
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
  );
};

export default TeacherStats;

