import React from 'react';

const LDAPConfig = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">LDAP Server URL</label>
          <input type="text" placeholder="ldap://active-directory.univ.edu:389" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 shadow-sm" />
        </div>
        <div className="md:col-span-4 space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Sync Frequency</label>
          <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
            <option>Every 6 Hours</option>
            <option>Every 12 Hours</option>
            <option>Daily (00:00)</option>
            <option>Manual Only</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Base Distinguished Name (DN)</label>
        <input type="text" placeholder="OU=Users,OU=Academic,DC=univ,DC=edu" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Service Account USER_DN</label>
          <input type="text" placeholder="CN=SARAS_Service,OU=ServiceAccounts,DC=univ,DC=edu" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all" />
        </div>
        <div className="space-y-3 drop-shadow-sm">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Service Password</label>
          <input type="password" value="********" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all shadow-sm" />
        </div>
      </div>
      
      <button className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-all ml-4">
        <span className="material-symbols-outlined text-sm">sync</span>
        Trigger Manual Synchronize
      </button>
    </div>
  );
};

export default LDAPConfig;
