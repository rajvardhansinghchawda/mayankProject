import React from 'react';

const GlobalTrendChart = () => {
  const trends = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 24 },
    { label: 'Sun', value: 32 },
  ];

  return (
    <div className="bg-white rounded-[48px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-12">
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-xl font-black text-on-surface uppercase tracking-widest text-[10px] text-primary">Global Activity Trends</h3>
        <select className="bg-slate-50 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border border-slate-100 outline-none cursor-pointer">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Custom Range</option>
        </select>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-4 px-6">
        {trends.map((trend, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
            <div 
              className={`w-full max-w-[48px] rounded-2xl transition-all duration-700 bg-primary shadow-xl shadow-primary/20 hover:scale-110 cursor-pointer ${
                i === 3 ? 'bg-primary shadow-2xl scale-105' : 'bg-primary/20 shadow-none'
              }`}
              style={{ height: `${trend.value}%` }}
            ></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalTrendChart;
