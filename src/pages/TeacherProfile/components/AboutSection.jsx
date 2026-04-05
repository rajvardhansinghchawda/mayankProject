import React from 'react';

const AboutSection = () => {
  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-8 overflow-hidden h-full">
      <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Academic Background</h3>
      <div className="space-y-10">
        <div className="flex gap-6">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-1">Ph.D. in Artificial Intelligence</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Stanford University, 2012</p>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Specialization in Machine Learning and Neural Networks.</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-1">M.S. in Computer Science</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Massachusetts Institute of Technology, 2008</p>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">Focus on Distributed Systems and Data Management.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
