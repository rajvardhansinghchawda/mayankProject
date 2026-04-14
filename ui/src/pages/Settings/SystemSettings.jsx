import React, { useState, useEffect } from 'react';
import SMTPConfig from './components/SMTPConfig';
import LDAPConfig from './components/LDAPConfig';
import SecurityPolicyConfig from './components/SecurityPolicyConfig';
import api from '../../services/api';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState({
    name: '',
    short_name: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  const tabs = [
    { name: 'General', icon: 'settings_suggest' },
    { name: 'Communications (SMTP)', icon: 'mail' },
    { name: 'Identity (LDAP)', icon: 'account_tree' },
    { name: 'Security Policy', icon: 'gpp_good' },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const resp = await api.get('/admin/settings/');
        setSettings({
          name: resp.data.name || '',
          short_name: resp.data.short_name || '',
          website: resp.data.website || '',
        });
      } catch (err) {
        console.error('Failed to load settings:', err);
        setSaveErr('Failed to load institution settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveErr('');
    try {
      await api.put('/admin/settings/', settings);
      setSaveMsg('Settings saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSaveErr(err.response?.data?.detail || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institution Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={e => setSettings(s => ({ ...s, name: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Short Name / Code</label>
                  <input
                    type="text"
                    value={settings.short_name}
                    onChange={e => setSettings(s => ({ ...s, short_name: e.target.value }))}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institution Website</label>
                  <input
                    type="url"
                    value={settings.website}
                    onChange={e => setSettings(s => ({ ...s, website: e.target.value }))}
                    placeholder="https://institution.edu"
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab.includes('SMTP') && <SMTPConfig />}
        {activeTab.includes('LDAP') && <LDAPConfig />}
        {activeTab === 'Security Policy' && <SecurityPolicyConfig />}

        {/* Feedback messages */}
        {saveMsg && (
          <div className="mt-6 rounded-2xl bg-green-50 border border-green-100 p-4 text-sm font-bold text-green-700">
            {saveMsg}
          </div>
        )}
        {saveErr && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm font-bold text-red-700">
            {saveErr}
          </div>
        )}

        <div className="mt-16 flex items-center justify-between gap-6 pt-10 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">Changes are saved immediately to the database</p>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Commit System Configuration'}
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


