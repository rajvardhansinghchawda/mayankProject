import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

const ModerationStats = () => {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/documents/pending/');
        const data = res.data?.results || res.data?.data || res.data || [];
        setStats(prev => ({ ...prev, pending: Array.isArray(data) ? data.length : 0 }));
      } catch (err) {
        console.error('Failed to fetch moderation stats', err);
      }
    };
    fetchStats();
  }, []);

  const displayStats = [
    { label: 'Pending Reviews', value: String(stats.pending), icon: 'pending_actions', color: 'bg-amber-50 text-amber-600' },
    { label: 'Approved Total', value: '—', icon: 'check_circle', color: 'bg-green-50 text-green-600' },
    { label: 'Rejected Total', value: '—', icon: 'cancel', color: 'bg-red-50 text-red-600' },
    { label: 'In Review Today', value: String(stats.pending), icon: 'timer', color: 'bg-primary/5 text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {displayStats.map((stat, i) => (
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
