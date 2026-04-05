import React, { useState } from 'react';

const CreateTestWizard = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-12 font-body">
      {/* Wizard Progress */}
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(step - 1) * 33.33}%` }}></div>
        
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
              s <= step ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-white text-slate-300 border-2 border-slate-100'
            }`}>
              {s < step ? <span className="material-symbols-outlined text-xl font-black">check</span> : s}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-4 ${s <= step ? 'text-primary' : 'text-slate-300'}`}>
              {s === 1 ? 'Details' : s === 2 ? 'Questions' : s === 3 ? 'Settings' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-[40px] p-10 lg:p-16 shadow-[0_32px_128px_rgba(25,28,29,0.08)] border border-slate-50">
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-on-surface mb-2">Basic Assessment Details</h2>
              <p className="text-on-surface-variant font-medium">Define the core identity of this new examination module.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Title</label>
                <input type="text" placeholder="e.g. Algorithms Final Examination" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Code</label>
                <input type="text" placeholder="e.g. CS-402" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <select className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20">
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty Level</label>
                <div className="flex bg-slate-50 p-2 rounded-2xl gap-2">
                  {['Low', 'Medium', 'High'].map(d => (
                    <button key={d} className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-white hover:shadow-sm">{d}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step > 1 && (
          <div className="py-20 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">construction</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Step {step}: In Development</h3>
            <p className="text-on-surface-variant font-medium text-sm">We're building this part of the wizard. Check back soon!</p>
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-slate-50 flex items-center justify-between">
          <button 
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 font-black text-sm text-slate-400 hover:text-primary transition-colors disabled:opacity-0"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          
          <button 
            onClick={() => setStep(prev => Math.min(4, prev + 1))}
            className="bg-primary text-white py-4 px-10 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            {step === 4 ? 'Finalize & Publish' : 'Continue to Next Step'}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTestWizard;
