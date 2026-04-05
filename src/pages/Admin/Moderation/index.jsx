import React from 'react';
import ModerationHeader from './components/ModerationHeader';
import ModerationStats from './components/ModerationStats';
import ModerationQueue from './components/ModerationQueue';

const ContentModeration = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <ModerationHeader />
      <ModerationStats />
      <ModerationQueue />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">rule</span>
          <span className="material-symbols-outlined text-4xl">security</span>
          <span className="material-symbols-outlined text-4xl">policy</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Intelligence Oversight • Content Security-v2.8</p>
      </div>
    </div>
  );
};

export default ContentModeration;
