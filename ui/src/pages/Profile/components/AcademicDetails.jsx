import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const AcademicDetails = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') return null;

  return (
    <section className="bg-surface-container-low rounded-xl p-8 border-none mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary-fixed-dim bg-primary p-2 rounded-lg" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span>
        <h2 className="text-xl font-bold text-primary">Academic Registration</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-surface-container-lowest rounded-lg">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Department</label>
          <p className="text-base font-bold text-on-surface">{user.profile?.department || 'General'}</p>
        </div>
        <div className="p-6 bg-surface-container-lowest rounded-lg">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Section</label>
          <p className="text-base font-bold text-on-surface">{user.profile?.section || 'Not Assigned'}</p>
        </div>
        <div className="p-6 bg-surface-container-lowest rounded-lg">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role Status</label>
          <p className="text-base font-bold text-on-surface capitalize">{user.role}</p>
        </div>
      </div>
    </section>
  );
};

export default AcademicDetails;
