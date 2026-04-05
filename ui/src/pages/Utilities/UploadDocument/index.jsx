import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadDocument = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-12 font-body overflow-y-auto custom-scrollbar">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Ingest Digital Asset</h1>
        <p className="text-on-surface-variant font-medium">Standardize and securely upload institutional materials for course distribution.</p>
      </div>

      <div className="bg-white rounded-[48px] p-8 lg:p-16 shadow-sm border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        
        {/* Drag & Drop Area */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`h-64 rounded-[40px] border-4 border-dashed mb-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${
            isDragging ? 'bg-primary border-primary shadow-2xl shadow-primary/20 scale-[0.98]' : 'bg-slate-50 border-slate-100 hover:border-primary/30'
          }`}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all ${
            isDragging ? 'bg-white shadow-xl text-primary' : 'bg-white shadow-inner text-slate-300 group-hover:text-primary group-hover:scale-110'
          }`}>
            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
          </div>
          <p className={`text-sm font-black uppercase tracking-widest transition-colors ${
            isDragging ? 'text-white' : 'text-slate-400'
          }`}>
            Drop document or <span className="text-primary underline underline-offset-4 cursor-pointer">browse</span>
          </p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 opacity-50">Supports PDF, DOCX, ZIP (MAX 100MB)</p>
        </div>

        {/* Metadata Form */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Asset Title</label>
            <input 
              type="text" 
              placeholder="e.g. Data Structures v2.1"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Course Allocation</label>
              <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
                <option>Data Structures (DS-101)</option>
                <option>Operating Systems (OS-201)</option>
                <option>Algorithm Analysis (AA-402)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Visibility Policy</label>
              <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
                <option>Public for Faculty & Students</option>
                <option>Internal Faculty Only</option>
                <option>Individual Student Shared</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-50 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="px-10 py-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 font-black text-xs uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
            Start Processing
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
          </button>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">description</span>
          <span className="material-symbols-outlined text-4xl">cloud_done</span>
          <span className="material-symbols-outlined text-4xl">security</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">AES-256 Encrypted Storage • Malware Scanned • institutional-v2.1</p>
      </div>
    </div>
  );
};

export default UploadDocument;
