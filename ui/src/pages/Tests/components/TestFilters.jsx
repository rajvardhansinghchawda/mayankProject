import React from 'react';

const TestFilters = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search assessments..." 
            className="bg-white border-0 rounded-xl px-4 py-2.5 pl-11 shadow-sm w-64 focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-sm">search</span>
        </div>
        
        <select className="bg-white border-0 rounded-xl px-4 py-2.5 shadow-sm text-sm focus:ring-2 focus:ring-primary/20 cursor-pointer">
          <option>All Subjects</option>
          <option>Data Structures</option>
          <option>Operating Systems</option>
          <option>Web Technologies</option>
        </select>
      </div>
      
      <div className="flex bg-surface-container-low p-1 rounded-xl shadow-inner">
        <button className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-xs font-bold text-primary transition-all">All</button>
        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-primary transition-all">Today</button>
        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-primary transition-all">Upcoming</button>
      </div>
    </div>
  );
};

export default TestFilters;
