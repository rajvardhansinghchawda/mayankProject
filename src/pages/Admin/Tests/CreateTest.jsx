import React, { useState } from 'react';
import TestDetailsForm from './components/TestDetailsForm';
import TestProctoringSettings from './components/TestProctoringSettings';

const CreateTest = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-12 font-body">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Assessment Builder</h1>
        <p className="text-on-surface-variant font-medium">Design and deploy high-integrity assessments with integrated AI proctoring.</p>
        
        <div className="flex items-center justify-center gap-4 mt-12">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                step >= s ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-white border-slate-100 text-slate-300'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-primary' : 'bg-slate-100 placeholder:text-slate-200 shadow-sm'}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[48px] p-8 lg:p-16 shadow-sm border border-slate-50 transition-all hover:shadow-xl relative overflow-hidden">
        {step === 1 && (
          <div>
            <h3 className="text-xl font-black text-on-surface mb-10 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">settings</span>
              Step 1: Configuration & Identity
            </h3>
            <TestDetailsForm />
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-black text-on-surface mb-10 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">security</span>
              Step 2: Security & AI Proctoring
            </h3>
            <TestProctoringSettings />
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary/5 text-primary rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/10">
              <span className="material-symbols-outlined text-4xl">schedule</span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-6">Scheduling & Deployment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deployment Date</label>
                <input type="date" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all" />
              </div>
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Duration (Minutes)</label>
                <input type="number" placeholder="60" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
              <span className="material-symbols-outlined text-4xl">verified</span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-4">Assessment Ready</h3>
            <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">Verify all settings. Once deployed, structural changes to the question bank will be restricted.</p>
            <div className="p-8 bg-slate-50 rounded-[36px] border border-white text-left max-w-sm mx-auto shadow-sm">
              <div className="space-y-6">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px]">Identity Verification</span>
                  <span className="text-green-600 uppercase tracking-widest text-[9px]">Enabled</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px]">Anti-Cheat Level</span>
                  <span className="text-primary uppercase tracking-widest text-[9px]">Ultimate (AI)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between gap-6 pt-10 border-t border-slate-50">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
              step === 1 ? 'opacity-0' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            Back
          </button>
          
          <button 
            onClick={() => step < 4 ? setStep(step + 1) : alert('Assessment Deployed')}
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
          >
            {step === 4 ? 'Deploy Assessment' : 'Continue'}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">quiz</span>
          <span className="material-symbols-outlined text-4xl">lock_reset</span>
          <span className="material-symbols-outlined text-4xl">policy</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Proctoring-v4.0 • Academic Integrity Policy Active</p>
      </div>
    </div>
  );
};

export default CreateTest;
