import React from 'react';
import TestManagementHeader from './components/ManagementHeader';
import TestTable from './components/TestTable';

const TestManagement = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <TestManagementHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/5 text-primary">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-primary/50">Total Tests</p>
            <p className="text-2xl font-black text-on-surface">158</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-50 text-green-600">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-green-600/50">Active Now</p>
            <p className="text-2xl font-black text-on-surface">42</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600">
            <span className="material-symbols-outlined text-2xl">edit_document</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-amber-600/50">Drafts</p>
            <p className="text-2xl font-black text-on-surface">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-50 text-red-600">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-red-600/50">Needs Review</p>
            <p className="text-2xl font-black text-on-surface">05</p>
          </div>
        </div>
      </div>

      <TestTable />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">inventory_2</span>
          <span className="material-symbols-outlined text-4xl">rule</span>
          <span className="material-symbols-outlined text-4xl">backup</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Audit Logging Enabled • Distributed Testing Engine • SARAS Admin-v2</p>
      </div>
    </div>
  );
};

export default TestManagement;
