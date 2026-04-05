import React from 'react';

const ProctoringTimeline = () => {
  const flags = [
    { time: '05:12', event: 'Tab Switch', severity: 'Low', icon: 'tab' },
    { time: '12:45', event: 'Face Not Found', severity: 'High', icon: 'face_retouching_off' },
    { time: '22:30', event: 'Multiple People', severity: 'Critical', icon: 'group' },
    { time: '35:10', event: 'Tab Switch', severity: 'Low', icon: 'tab' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-8 relative overflow-hidden">
      <h3 className="text-xl font-black text-on-surface mb-10 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Proctoring Timeline</h3>
      
      <div className="relative pt-10 pb-16">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
        <div className="flex justify-between relative z-10">
          {flags.map((flag, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg mb-4 ${
                flag.severity === 'Critical' ? 'bg-red-500 text-white' : 
                flag.severity === 'High' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-white'
              }`}>
                <span className="material-symbols-outlined text-xl">{flag.icon}</span>
              </div>
              <p className="text-[10px] font-black uppercase text-on-surface mb-1">{flag.event}</p>
              <p className="text-[10px] font-bold text-slate-400">{flag.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProctoringTimeline;
