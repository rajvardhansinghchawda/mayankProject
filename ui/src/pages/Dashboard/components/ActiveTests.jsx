import React from 'react';

const TestItem = ({ title, meta, color, actionLabel = "Start Test", primaryButton = true }) => (
  <div className="p-5 bg-surface-container-low rounded-xl flex items-center justify-between group hover:bg-surface-bright transition-colors">
    <div className="flex gap-4">
      <div className={`w-2 h-12 ${color} rounded-full`}></div>
      <div>
        <h3 className="font-bold text-on-surface">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{meta}</p>
      </div>
    </div>
    <button className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
      primaryButton 
        ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-md hover:opacity-90' 
        : 'bg-surface-container-high text-primary hover:bg-surface-dim'
    }`}>
      {actionLabel}
    </button>
  </div>
);

const ActiveTests = () => {
  return (
    <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" id="timer-icon">timer</span>
          Active Tests
        </h2>
        <a className="text-sm font-bold text-primary-container hover:underline" href="#">View All</a>
      </div>
      <div className="space-y-4">
        <TestItem 
          title="Data Structures & Algorithms" 
          meta="Internal Assessment 2 • 45 mins • Due Today" 
          color="bg-primary"
        />
        <TestItem 
          title="Microprocessor Systems" 
          meta="Unit Quiz • 20 mins • Tomorrow" 
          color="bg-secondary"
          actionLabel="Review Syllabus"
          primaryButton={false}
        />
      </div>
    </section>
  );
};

export default ActiveTests;
