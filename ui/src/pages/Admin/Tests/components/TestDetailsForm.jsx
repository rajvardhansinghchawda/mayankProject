import React from 'react';

const TestDetailsForm = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Assessment Title</label>
        <input 
          type="text" 
          placeholder="e.g. Data Structures Final Exam"
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Course / Subject</label>
          <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
            <option>Computer Science (CS-101)</option>
            <option>Information Technology (IT-201)</option>
            <option>Artificial Intelligence (AI-301)</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Assessment Type</label>
          <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
            <option>Summative Final</option>
            <option>Mid-Term Exam</option>
            <option>Formative Quiz</option>
            <option>Lab Evaluation</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description & Instructions</label>
        <textarea 
          rows="4"
          placeholder="Provide context and rules for this assessment..."
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-[32px] px-8 py-6 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default TestDetailsForm;
