import React from 'react';

const BulkUploadHeader = () => {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Mass Provisioning Center</h1>
      <p className="text-on-surface-variant font-medium max-w-xl mx-auto">Upload institutional data in batches to automate user creation and department allocation.</p>
      
      <div className="mt-10 flex justify-center gap-6">
        <button className="bg-slate-50 text-slate-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white hover:bg-slate-100 transition-all flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">download</span>
          Download CSV Template
        </button>
      </div>
    </div>
  );
};

export default BulkUploadHeader;
