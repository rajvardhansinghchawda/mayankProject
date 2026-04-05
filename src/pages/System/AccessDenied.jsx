import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0B0C] flex items-center justify-center p-8 font-body">
      <div className="max-w-xl w-full text-center relative group">
        {/* Animated Background Pulse */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] transition-all duration-1000 group-hover:bg-red-500/20"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-red-600 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-600/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <span className="material-symbols-outlined text-5xl">lock_person</span>
          </div>

          <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight uppercase">
            Protocol Isolation
          </h1>
          <p className="text-red-400 font-bold mb-12 text-lg uppercase tracking-widest text-[10px]">
            Security Tier 4 Access Required
          </p>
          
          <p className="text-slate-500 font-medium mb-12 text-sm leading-relaxed max-w-sm mx-auto">
            Your current identity certificates are insufficient for this operational area. This access attempt has been logged for institutional review.
          </p>

          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-slate-900 py-4 px-10 rounded-2xl font-black text-xs shadow-xl shadow-white/5 hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Abort Mission & Return
            </button>
            <button 
              className="bg-transparent text-red-500 py-4 px-10 rounded-2xl font-black text-xs border border-red-500/20 hover:border-red-500/50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Request Access
            </button>
          </div>

          <div className="mt-20 text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-slate-800"></span>
            End of Authorization Chain
            <span className="w-8 h-px bg-slate-800"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
