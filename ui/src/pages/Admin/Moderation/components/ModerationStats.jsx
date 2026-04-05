import React from 'react';

const ModerationStats = () => {
  const stats = [
    { label: 'Pending Reviews', value: '24', icon: 'pending_actions', color: 'bg-amber-50 text-amber-600' },
    { label: 'Approved Today', value: '142', icon: 'check_circle', color: 'bg-green-50 text-green-600' },
    { label: 'Rejected Today', value: '08', icon: 'cancel', color: 'bg-red-50 text-red-600' },
    { label: 'Avg Feedback time', value: '14m', icon: 'timer', color: 'bg-primary/5 text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5 transition-transform hover:scale-105 duration-300">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-on-surface">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModerationStats;
