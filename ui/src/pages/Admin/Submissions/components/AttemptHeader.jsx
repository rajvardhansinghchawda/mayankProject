import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttemptHeader = ({ studentId }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/admin/submissions')}
            className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all border border-white"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Alice Smith</h1>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Flagged Attempt</span>
            </div>
            <p className="text-lg font-medium text-slate-500">Algorithm Analysis Midterm • SID: {studentId || 'S-45621'}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-50 p-6 rounded-[32px] border border-white text-center min-w-[120px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
            <p className="text-2xl font-black text-primary">92%</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[32px] border border-white text-center min-w-[120px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Spent</p>
            <p className="text-2xl font-black text-on-surface">45:12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptHeader;
