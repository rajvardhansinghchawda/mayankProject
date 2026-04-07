import React, { useState, useEffect } from 'react';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import InstitutionalStats from './components/InstitutionalStats';
import GlobalTrendChart from './components/GlobalTrendChart';
import api from '../../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, logsRes, pendingRes] = await Promise.allSettled([
          api.get('/admin/stats/'),
          api.get('/admin/audit-log/'),
          api.get('/documents/pending/')
        ]);

        if (statsRes.status === 'fulfilled') {
          const statsData = statsRes.value.data?.data || statsRes.value.data;
          setStats({ ...statsData, pending_docs: 0 });
        }

        if (pendingRes.status === 'fulfilled') {
          const pd = pendingRes.value.data?.results || pendingRes.value.data?.data || pendingRes.value.data || [];
          setStats(prev => ({ ...prev, pending_docs: Array.isArray(pd) ? pd.length : 0 }));
        }

        if (logsRes.status === 'fulfilled') {
          const logsData = logsRes.value.data?.results || logsRes.value.data?.data || logsRes.value.data || [];
          const logs = Array.isArray(logsData) ? logsData : [];
          const mappedLogs = logs.map(log => ({
            type: log.event?.toUpperCase().replace('_', ' ') || 'EVENT',
            user: log.email || log.user || 'Unknown',
            role: log.ip,
            time: new Date(log.time || log.created_at).toLocaleString('en-IN', {
              hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
            }),
            icon: log.event?.includes('success') ? 'check_circle' :
                  log.event?.includes('failure') ? 'warning' : 'person'
          })).slice(0, 6);
          setAuditLogs(mappedLogs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSystemLock = async () => {
    setIsLocking(true);
    try {
      await api.post('/admin/system-lock/');
      alert("Institutional Lockdown successfully initiated. All active assessment sessions have been suspended.");
      setShowLockModal(false);
    } catch (err) {
      console.error("Lockdown failed", err);
      alert("Institutional Lockdown failed to initiate. Please contact system engineering.");
    } finally {
      setIsLocking(false);
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      {/* Confirmation Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-slate-100 scale-in-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-4xl">gpp_maybe</span>
            </div>
            <h3 className="text-2xl font-black text-center mb-2">Emergency Lockdown</h3>
            <p className="text-slate-500 text-center mb-10 font-medium">This action will immediately suspend all active assessment sessions across the entire institution. This action is recorded in the master audit log.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLockModal(false)}
                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-50"
              >
                Abort Action
              </button>
              <button 
                onClick={handleSystemLock}
                disabled={isLocking}
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLocking ? 'Locking...' : 'Initiate Lockdown'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminDashboardHeader />
      <InstitutionalStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <GlobalTrendChart />
          
          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50">
            <h3 className="text-xl font-black text-on-surface uppercase tracking-widest text-[10px] text-primary mb-10">Active Institutional Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <button 
                onClick={() => setShowLockModal(true)}
                className="p-8 rounded-[36px] bg-slate-900 text-white flex flex-col items-center justify-center text-center hover:opacity-90 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
              >
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
              {auditLogs.map((action, i) => (
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
