import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForcePasswordChange = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-8 font-body">
      <div className="max-w-lg w-full bg-white rounded-[48px] p-12 lg:p-16 shadow-[0_32px_128px_rgba(25,28,29,0.08)] border border-slate-50">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-error/10 text-error rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-on-surface tracking-tight">Credential Update</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compulsory Security Protocol</p>
          </div>
        </div>

        <p className="text-sm font-medium text-on-surface-variant leading-relaxed mb-10">
          To maintain institutional integrity, you are required to update your access credentials before continuing to your dashboard.
        </p>

        <div className="space-y-6 mb-12">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
            <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Institutional Password</label>
            <input type="password" placeholder="Initialize New Secret" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input type="password" placeholder="Verify Secret" className="w-full bg-slate-50 border-0 rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          Update Credentials & Logic
          <span className="material-symbols-outlined text-lg">shield_lock</span>
        </button>

        <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-white">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Password Requirements</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <span className="w-1 h-1 bg-primary rounded-full"></span> 12+ Characters Minimum
            </li>
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <span className="w-1 h-1 bg-primary rounded-full"></span> Alphanumeric with symbols
            </li>
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <span className="w-1 h-1 bg-primary rounded-full"></span> Not used in previous 4 cycles
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForcePasswordChange;
