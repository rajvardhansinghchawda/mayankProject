import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 font-body">
      <div className="max-w-sm w-full bg-slate-800 rounded-[48px] p-12 shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-slate-700 text-center relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-inner">
            <span className="material-symbols-outlined text-3xl text-amber-400 animate-pulse">timer_off</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-3">Identity Timed Out</h2>
          <p className="text-slate-400 font-medium mb-10 text-sm leading-relaxed">
            Your active session has expired for security purposes. Please re-authenticate to continue.
          </p>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Re-Authenticate
          </button>
          
          <p className="mt-8 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Institutional Proxy Protocol 5.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
