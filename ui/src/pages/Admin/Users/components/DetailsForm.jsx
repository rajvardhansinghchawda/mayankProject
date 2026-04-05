import React from 'react';

const DetailsForm = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
          <input 
            type="text" 
            placeholder="e.g. John Doe"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institutional Email</label>
          <input 
            type="email" 
            placeholder="j.doe@university.edu"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Department / Unit</label>
          <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
            <option>Computer Science & AI</option>
            <option>Information Technology</option>
            <option>Electronics Engineering</option>
            <option>Mechanical Engineering</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institutional ID</label>
          <input 
            type="text" 
            placeholder="S-20239123"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsForm;
