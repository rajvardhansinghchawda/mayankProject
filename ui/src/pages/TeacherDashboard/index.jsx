import React from 'react';
import TeacherStats from './components/TeacherStats';
import ActiveAssessments from './components/ActiveAssessments';
import EvaluationQueue from './components/EvaluationQueue';

const TeacherDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 font-body">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Faculty Command Center</h1>
          <p className="text-on-surface-variant font-medium">Monitoring academic performance across your assigned modules.</p>
        </div>
        <div className="flex bg-surface-container-high p-1.5 rounded-2xl shadow-inner">
          <button className="px-6 py-3 rounded-xl bg-primary text-white shadow-md text-xs font-black transition-all">Teacher View</button>
          <button className="px-6 py-3 rounded-xl text-xs font-black text-slate-400 hover:text-primary transition-all">Batch Select</button>
        </div>
      </div>

      <TeacherStats />
      <ActiveAssessments />
      <EvaluationQueue />
      
      <div className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        SARAS Institutional Engine • Batch 2023-27 • Section A
      </div>
    </div>
  );
};

export default TeacherDashboard;
