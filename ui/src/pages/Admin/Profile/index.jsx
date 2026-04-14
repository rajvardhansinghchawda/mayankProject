import React from 'react';
import AdminProfileHeader from './components/AdminProfileHeader';
import SecurityClearanceInfo from './components/SecurityClearanceInfo';
import AuditLogs from './components/AuditLogs';

const AdminProfile = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminProfileHeader />
      <SecurityClearanceInfo />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col gap-12">
          <div className="bg-white rounded-[48px] p-8 lg:p-12 shadow-sm border border-slate-50">
            <h3 className="text-xl font-black text-on-surface mb-10 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">System Access Credentials</h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Root Username</label>
                  <p className="bg-slate-50 px-8 py-5 rounded-3xl text-sm font-bold text-on-surface border border-slate-50">super_admin_core</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Permission Scope</label>
                  <p className="bg-slate-50 px-8 py-5 rounded-3xl text-sm font-bold text-primary border border-primary/10">GLOBAL_OPERATOR</p>
                </div>
              </div>
              <button className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-all ml-4">
                <span className="material-symbols-outlined text-sm">vpn_key</span>
                Rotate Authentication Tokens
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-widest text-[10px] opacity-60">Identity Shield Active</h3>
              <p className="text-lg font-medium leading-relaxed opacity-80 mb-10 max-w-xl text-balance">
                Your administrative identity is protected by SARAS Vault-v4. All institutional records you access are watermarked and logged in the immutable audit stream.
              </p>
              <div className="flex gap-6">
                <button
                  onClick={() => window.alert('Security settings editor will be available in the next admin release.')}
                  className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-opacity-90 active:scale-[0.98] transition-all"
                >
                  Security Settings
                </button>
                <button
                  onClick={() => window.alert('Emergency lock request has been queued for institutional review.')}
                  className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Emergency Lock
                </button>
              </div>
            </div>
            <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] text-white/[0.03] rotate-12 select-none pointer-events-none">security</span>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <AuditLogs />
          <div className="mt-12 bg-white rounded-[40px] p-10 border border-slate-50 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h4 className="text-lg font-black text-on-surface mb-2">Login Alert</h4>
            <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">You are currently logged in from an unrecognized device in Mumbai, India.</p>
            <button
              onClick={() => window.alert('Device has been marked as trusted for this account.')}
              className="text-primary font-black text-[10px] uppercase tracking-widest border-b-2 border-primary/10 pb-1 hover:border-primary transition-all"
            >
              Trust This Device
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">fingerprint</span>
          <span className="material-symbols-outlined text-4xl">frame_person</span>
          <span className="material-symbols-outlined text-4xl">encrypted</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Biometric ID-v4.2 • Zero-Trust Perimeter Active • Institutional Encryption State: GREEN</p>
      </div>
    </div>
  );
};

export default AdminProfile;
