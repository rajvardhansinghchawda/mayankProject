import React, { useState } from 'react';
import SMTPConfig from './components/SMTPConfig';
import LDAPConfig from './components/LDAPConfig';
import SecurityPolicyConfig from './components/SecurityPolicyConfig';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { name: 'General', icon: 'settings_suggest' },
    { name: 'Communications (SMTP)', icon: 'mail' },
    { name: 'Identity (LDAP)', icon: 'account_tree' },
    { name: 'Security Policy', icon: 'gpp_good' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-12 font-body animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Institutional Configuration</h1>
        <p className="text-on-surface-variant font-medium text-lg">Central system-level parameters and institutional integration keys.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border-2 ${
              activeTab === tab.name 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20' 
                : 'bg-white text-slate-400 border-slate-50 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[48px] p-8 lg:p-16 shadow-sm border border-slate-50 relative overflow-hidden transition-all hover:shadow-xl">
        {activeTab === 'General' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institution Name</label>
                <input type="text" defaultValue="SARAS University of Excellence" className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deployment Environment</label>
                <div className="bg-primary/5 text-primary px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest border border-primary/10">Production-v4.8.2-Final</div>
              </div>
            </div>
            
            <div className="space-y-3 pt-6 border-t border-slate-50">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Primary Brand Accent</label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab.includes('SMTP') && <SMTPConfig />}
        {activeTab.includes('LDAP') && <LDAPConfig />}
        {activeTab === 'Security Policy' && <SecurityPolicyConfig />}

        <div className="mt-16 flex items-center justify-between gap-6 pt-10 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">Changes require system restart effect</p>
          <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
            Commit System Configuration
            <span className="material-symbols-outlined text-sm">save_as</span>
          </button>
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">cloud_sync</span>
          <span className="material-symbols-outlined text-4xl">history_edu</span>
          <span className="material-symbols-outlined text-4xl">vpn_lock</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Institutional Deployment Engine-v4 • SARAS Config-v2 • Secure-Site-v4</p>
      </div>
    </div>
  );
};

export default SystemSettings;
