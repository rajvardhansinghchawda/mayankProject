import React from 'react';

const ProfileStats = () => {
  const stats = [
    { label: 'Active Courses', value: '4', icon: 'school', color: 'bg-primary/5 text-primary' },
    { label: 'Publications', value: '18', icon: 'auto_stories', color: 'bg-green-50 text-green-600' },
    { label: 'Citations', value: '1.2k', icon: 'format_quote', color: 'bg-amber-50 text-amber-600' },
    { label: 'Experience', value: '12y', icon: 'history_edu', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5 transition-transform hover:scale-105 duration-300">
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

export default ProfileStats;
