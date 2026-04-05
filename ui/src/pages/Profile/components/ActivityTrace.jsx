import React from 'react';

const ActivityTrace = () => {
  return (
    <div className="mt-8 bg-white/50 backdrop-blur rounded-xl p-6 border border-outline-variant/10 flex flex-wrap gap-12 items-center">
      <div className="flex items-center gap-3">
        <div className="bg-primary/5 p-3 rounded-full">
          <span className="material-symbols-outlined text-primary text-xl">history</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Login</p>
          <p className="text-sm font-bold">Oct 12, 2023 • 09:42 AM</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="bg-primary/5 p-3 rounded-full">
          <span className="material-symbols-outlined text-primary text-xl">devices</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Device</p>
          <p className="text-sm font-bold">Chrome on macOS (M2)</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="bg-primary/5 p-3 rounded-full">
          <span className="material-symbols-outlined text-primary text-xl">language</span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">IP Address</p>
          <p className="text-sm font-bold">192.168.1.14 (Verified)</p>
        </div>
      </div>
      
      <button className="ml-auto flex items-center gap-2 text-primary font-bold text-xs hover:underline">
        View Activity Log <span className="material-symbols-outlined text-xs">arrow_forward</span>
      </button>
    </div>
  );
};

export default ActivityTrace;
