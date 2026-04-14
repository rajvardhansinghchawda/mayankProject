import React from 'react';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile = () => {
  const { user } = useAuth();
  const profile = user?.profile || {};

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">{user?.full_name || 'Faculty Profile'}</h1>
        <p className="text-on-surface-variant font-medium text-lg mb-6">{profile.designation || 'Teacher'} • {profile.department || 'Department not assigned'}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</p>
            <p className="text-sm font-bold text-on-surface break-all">{user?.email || 'N/A'}</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Employee ID</p>
            <p className="text-sm font-bold text-on-surface">{profile.employee_id || 'N/A'}</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Assigned Sections</p>
            <p className="text-sm font-bold text-on-surface">{Array.isArray(profile.assignments) ? profile.assignments.length : 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">verified_user</span>
          <span className="material-symbols-outlined text-4xl">badge</span>
          <span className="material-symbols-outlined text-4xl">workspace_premium</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Institutional Profile • Professional ID: {profile.employee_id || 'UNASSIGNED'}</p>
      </div>
    </div>
  );
};

export default TeacherProfile;
