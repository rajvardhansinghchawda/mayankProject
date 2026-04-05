import React from 'react';

const SecurityClearanceInfo = () => {
  const securityStats = [
    { label: 'Clearance Level', value: '4 (Global)', icon: 'shield_lock', color: 'bg-primary/5 text-primary' },
    { label: 'Role Expiry', value: 'Perpetual', icon: 'history', color: 'bg-amber-50 text-amber-600' },
    { label: 'Encryption', value: 'AES-256-GCM', icon: 'security', color: 'bg-slate-900 text-white' },
    { label: 'Active Sessions', value: '03 Devices', icon: 'devices', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {securityStats.map((stat, i) => (
        <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</div>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-2xl font-black text-on-surface tracking-tighter">{stat.value}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
};

export default SecurityClearanceInfo;
