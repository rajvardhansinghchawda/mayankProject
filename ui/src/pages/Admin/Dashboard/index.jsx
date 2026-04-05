import React from 'react';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import InstitutionalStats from './components/InstitutionalStats';
import GlobalTrendChart from './components/GlobalTrendChart';

const AdminDashboard = () => {
  const recentActions = [
    { type: 'USER_ROLE_CHANGE', user: 'Dr. Sarah Mitchell', role: 'Super Admin', time: '14 mins ago', icon: 'shield_person' },
    { type: 'NEW_DEPARTMENT', user: 'Admin System', role: 'Engineering', time: '2 hours ago', icon: 'account_tree' },
    { type: 'BULK_UPLOAD', user: 'Registrar Office', role: '242 Users', time: '5 hours ago', icon: 'group_add' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <AdminDashboardHeader />
      <InstitutionalStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <GlobalTrendChart />
          
          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50">
            <h3 className="text-xl font-black text-on-surface uppercase tracking-widest text-[10px] text-primary mb-10">Active Institutional Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <button className="p-8 rounded-[36px] bg-slate-900 text-white flex flex-col items-center justify-center text-center hover:opacity-90 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">lock_open</span>
                </div>
                <h4 className="text-lg font-black mb-2">Emergency Lock</h4>
                <p className="text-[10px] opacity-60 uppercase tracking-widest">Disable all active tests</p>
              </button>
              <button className="p-8 rounded-[36px] bg-white border-2 border-slate-50 flex flex-col items-center justify-center text-center hover:border-primary/20 transition-all active:scale-[0.98]">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">cloud_sync</span>
                </div>
                <h4 className="text-lg font-black text-on-surface mb-2">Backup Sync</h4>
                <p className="text-[10px] text-slate-400 opacity-60 uppercase tracking-widest">Trigger manual archive</p>
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 h-full">
            <h3 className="text-xl font-black text-on-surface uppercase tracking-widest text-[10px] text-primary mb-10 border-b border-slate-50 pb-6">Audit Stream</h3>
            <div className="space-y-10">
              {recentActions.map((action, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-sm">{action.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{action.user}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mb-1">{action.type}</p>
                    <p className="text-[10px] text-primary/60 font-black">{action.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-16 bg-slate-50 text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-white">
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">dns</span>
          <span className="material-symbols-outlined text-4xl">cloud_done</span>
          <span className="material-symbols-outlined text-4xl">verified_user</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">SARAS Core-v4.8 • Institutional Encryption Active</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
