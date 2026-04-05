import React from 'react';

const SecurityPolicyConfig = () => {
  const policies = [
    { id: 'mfa', label: 'Enforce Multi-Factor (MFA)', desc: 'Require code for all administrative logins.', icon: 'fact_check' },
    { id: 'session', label: 'Session Auto-Expiration', desc: 'Terminate sessions after 30 mins of inactivity.', icon: 'timer' },
    { id: 'geo', label: 'Geo-Fencing Access', desc: 'Restrict admin access to institutional IPs only.', icon: 'location_on' },
    { id: 'brute', label: 'Brute-Force Protection', desc: 'Lock accounts after 5 failed attempts.', icon: 'gpp_maybe' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {policies.map((p) => (
        <div key={p.id} className="p-8 rounded-[40px] bg-slate-50 border-2 border-slate-50 hover:border-primary/20 transition-all group flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">{p.icon}</span>
            </div>
            <div>
              <h4 className="text-lg font-black text-on-surface mb-2">{p.label}</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-xs">{p.desc}</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer mt-2">
            <input type="checkbox" className="sr-only peer" defaultChecked={p.id === 'mfa' || p.id === 'session'} />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecurityPolicyConfig;
