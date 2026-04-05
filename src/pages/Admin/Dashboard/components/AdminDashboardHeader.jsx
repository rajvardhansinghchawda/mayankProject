import React from 'react';

const AdminDashboardHeader = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Institutional Command</h1>
        <p className="text-on-surface-variant font-medium text-lg">Central oversight of all academic and administrative operations.</p>
      </div>
      <div className="flex gap-4">
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
          <span className="material-symbols-outlined">analytics</span>
          Global Report
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
