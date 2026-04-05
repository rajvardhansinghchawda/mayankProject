import React from 'react';

const SubmissionsHeader = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Test Submissions</h1>
        <p className="text-on-surface-variant font-medium text-lg">Review and audit student performance and proctoring integrity.</p>
      </div>
      <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
        <span className="material-symbols-outlined">download</span>
        Export All Data
      </button>
    </div>
  );
};

export default SubmissionsHeader;
