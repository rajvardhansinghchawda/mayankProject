import React from 'react';
import DepartmentHeader from './components/DepartmentHeader';
import DepartmentStats from './components/DepartmentStats';
import DepartmentGrid from './components/DepartmentGrid';

const DepartmentManagement = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <DepartmentHeader />
      <DepartmentStats />
      <DepartmentGrid />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">account_tree</span>
          <span className="material-symbols-outlined text-4xl">groups</span>
          <span className="material-symbols-outlined text-4xl">inventory</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Academic Hierarchy • SARAS Management-v2.1</p>
      </div>
    </div>
  );
};

export default DepartmentManagement;
