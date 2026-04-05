import React from 'react';
import SubmissionsHeader from './components/SubmissionsHeader';
import SubmissionsFilter from './components/SubmissionsFilter';
import SubmissionsTable from './components/SubmissionsTable';

const TestSubmissions = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <SubmissionsHeader />
      <SubmissionsFilter />
      <SubmissionsTable />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">fingerprint</span>
          <span className="material-symbols-outlined text-4xl">security</span>
          <span className="material-symbols-outlined text-4xl">verified_user</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Biometric Verification Enabled • Blockchain Integrity Logging • SARAS Audit-v4</p>
      </div>
    </div>
  );
};

export default TestSubmissions;
