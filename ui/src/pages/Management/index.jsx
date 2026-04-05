import React from 'react';
import ManagementHeader from './components/ManagementHeader';
import ManagementStats from './components/ManagementStats';
import UserTable from './components/UserTable';

const Management = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <ManagementHeader />
      <ManagementStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Management Area */}
        <div className="lg:col-span-8">
          <UserTable />
        </div>
        
        {/* Quick Config / Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-high rounded-3xl p-6 border border-white/50">
            <h4 className="text-base font-bold text-primary mb-4">Departmental Quick Links</h4>
            <div className="space-y-3">
              {['Engineering', 'Medical Sciences', 'Business Admin', 'Liberal Arts', 'Research & Dev'].map((dept, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 rounded-xl transition-all shadow-sm group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-lg">folder_open</span>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-primary">{dept}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Critical Alert</h4>
              <p className="text-lg font-bold mb-4 leading-tight text-amber-400">System maintenance scheduled for Oct 18, 02:00 AM.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/20">
                Detailed Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
