import React from 'react';

const SubmissionsFilter = () => {
  const filters = ['All Submissions', 'Flagged Only', 'Pending Audit', 'High Score', 'Low Score'];

  return (
    <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
      {filters.map((filter, i) => (
        <button 
          key={i}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] transition-all whitespace-nowrap uppercase tracking-[0.2em] ${
            i === 0 
              ? 'bg-primary text-white shadow-xl shadow-primary/20' 
              : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/30 hover:text-primary shadow-sm'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default SubmissionsFilter;
