import React from 'react';
import { useParams } from 'react-router-dom';
import AttemptHeader from './components/AttemptHeader';
import ProctoringTimeline from './components/ProctoringTimeline';
import QuestionAnalysis from './components/QuestionAnalysis';

const AttemptDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <AttemptHeader studentId={id} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ProctoringTimeline />
          <QuestionAnalysis />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 sticky top-24">
            <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Proctoring Snapshots</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-video bg-slate-100 rounded-2xl border-2 border-white shadow-sm overflow-hidden relative group">
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">zoom_in</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase">
                    T + {i * 10}m
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 bg-slate-50 text-slate-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-white">
              Invalidate Attempt
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">visibility</span>
          <span className="material-symbols-outlined text-4xl">verified_user</span>
          <span className="material-symbols-outlined text-4xl">policy</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Audit Trail Encrypted • AI Proctoring Insight-v4.2</p>
      </div>
    </div>
  );
};

export default AttemptDetail;
