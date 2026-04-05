import React from 'react';

const SMTPConfig = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">SMTP Server Host</label>
          <input type="text" placeholder="smtp.institutional.saras.edu" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 shadow-sm" />
        </div>
        <div className="md:col-span-4 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Port</label>
          <input type="number" placeholder="465" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 shadow-sm" />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Encryption Type</label>
        <div className="flex gap-4">
          {['None', 'SSL', 'TLS (Recommended)'].map((opt) => (
            <button key={opt} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              opt.includes('TLS') ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-white border-slate-50 text-slate-400 hover:border-primary/10'
            }`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">System User</label>
          <input type="text" placeholder="sender@saras.edu" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Key / Password</label>
          <input type="password" value="********" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all" />
        </div>
      </div>
      
      <button className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-all ml-4">
        <span className="material-symbols-outlined text-sm">mail</span>
        Send Connectivity Test Email
      </button>
    </div>
  );
};

export default SMTPConfig;
