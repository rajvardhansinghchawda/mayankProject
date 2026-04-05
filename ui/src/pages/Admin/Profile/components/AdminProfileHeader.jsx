import React from 'react';

const AdminProfileHeader = () => {
  return (
    <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-12">
      <div className="flex items-center gap-8">
        <div className="w-32 h-32 rounded-[40px] bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group hover:scale-105 transition-all duration-500">
          <span className="material-symbols-outlined text-5xl z-10 transition-transform group-hover:scale-110">shield_person</span>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50"></div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Super Administrator</h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">Level 4 Clearance</span>
          </div>
          <p className="text-on-surface-variant font-medium text-lg">System-wide authority for SARAS Institutional Core.</p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">alternate_email</span>
              admin@saras.edu
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              LDAP Active
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="bg-slate-50 text-slate-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white hover:bg-slate-100 transition-all flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">lock_reset</span>
          Reset Root Key
        </button>
      </div>
    </div>
  );
};

export default AdminProfileHeader;
