import React from 'react';
import { useNavigate } from 'react-router-dom';

const PreTestInstructions = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/assessments/active');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-12">
      <div className="bg-surface-container-lowest rounded-[40px] p-8 lg:p-16 shadow-[0_24px_64px_rgba(25,28,29,0.06)] border border-slate-50">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-4xl">inventory_2</span>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-on-surface tracking-tight">Data Structures Mid-Term</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Assessment Protocol v4.2</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-50 p-6 rounded-3xl border border-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
            <p className="text-lg font-black text-primary">90 Mins</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Questions</p>
            <p className="text-lg font-black text-primary">45 Total</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Marks</p>
            <p className="text-lg font-black text-primary">100 Pts</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passing</p>
            <p className="text-lg font-black text-primary">40% Min</p>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
            <span className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center text-sm">1</span>
            System Requirements
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              Stable Internet Connection
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              Functioning Web Camera
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              Latest Chrome/Safari Browser
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              Full Screen Mode Required
            </li>
          </ul>
        </div>

        <div className="bg-error-container/10 p-8 rounded-[32px] border border-error/5 mb-12">
          <h3 className="text-error font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            Strict Prohibitions
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
            Any attempt to switch tabs, resize the window, or use external devices will trigger an automated proctoring alert. Three alerts will result in immediate disqualification. Ensure your surroundings are quiet and well-lit.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <label className="flex items-center gap-4 cursor-pointer group flex-1">
            <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
            <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
              I have read and understood all the instructions and institutional guidelines.
            </span>
          </label>
          <button 
            onClick={handleStartTest}
            className="w-full md:w-auto bg-primary text-white py-4 px-12 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            I'm Ready to Start
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreTestInstructions;
