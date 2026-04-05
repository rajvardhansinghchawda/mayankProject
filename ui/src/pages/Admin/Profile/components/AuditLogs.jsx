import React from 'react';

const AuditLogs = () => {
  const logs = [
    { event: 'LOGIN_FAILURE', user: 'Unknown IP', time: '14:22:01', detail: 'Invalid credentials attempted from 192.168.1.45', status: 'Blocked' },
    { event: 'CONFIG_CHANGE', user: 'Admin System', time: '12:05:44', detail: 'SMTP settings updated by super-admin', status: 'Success' },
    { event: 'USER_DELETED', user: 'Registrar', time: '10:14:12', detail: 'ID STU-9921 removed from database', status: 'Permitted' },
    { event: 'ROOT_ACCESS', user: 'Root Operator', time: '09:00:00', detail: 'Global institutional unlock triggered', status: 'Flagged' },
    { event: 'BACKUP_SYNC', user: 'Cron Service', time: '03:00:01', detail: 'Nightly cloud archive synchronization', status: 'Success' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 relative overflow-hidden">
      <h3 className="text-xl font-black text-on-surface mb-10 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Global Audit Logs</h3>
      <div className="space-y-10">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-6 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] uppercase shadow-sm border border-white transition-all group-hover:scale-110 ${
              log.status === 'Blocked' ? 'bg-red-50 text-red-500' : 'bg-primary/5 text-primary'
            }`}>
              {log.event.split('_')[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{log.user}</h4>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest">{log.time}</p>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-lg mb-2">{log.detail}</p>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Blocked' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{log.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-16 bg-slate-50 text-slate-400 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-white">
        Download Continuous Feed (.log)
      </button>
    </div>
  );
};

export default AuditLogs;
