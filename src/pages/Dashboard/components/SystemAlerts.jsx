import React from 'react';

const AlertItem = ({ title, message, color }) => (
  <div className="flex gap-4">
    <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${color} flex-shrink-0`}></div>
    <div>
      <p className="text-sm font-bold text-on-surface">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{message}</p>
    </div>
  </div>
);

const SystemAlerts = () => {
  return (
    <section className="col-span-12 lg:col-span-4 bg-surface-container-high rounded-[2rem] p-8 shadow-sm">
      <h2 className="text-xl font-extrabold text-primary mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined" id="notifications-icon">notifications_active</span>
        System Alerts
      </h2>
      <div className="space-y-6">
        <AlertItem 
          title="Server maintenance scheduled" 
          message="Portal will be offline tomorrow from 2 AM to 4 AM IST." 
          color="bg-error"
        />
        <AlertItem 
          title="New Grade Released" 
          message='"System Architecture" mid-term results are now live.' 
          color="bg-primary"
        />
      </div>
    </section>
  );
};

export default SystemAlerts;
