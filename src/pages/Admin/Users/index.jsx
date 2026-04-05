import React from 'react';
import UserTableHeader from './components/UserTableHeader';
import UserTableFilter from './components/UserTableFilter';
import UserMasterTable from './components/UserMasterTable';

const UserManagement = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <UserTableHeader />
      <UserTableFilter />
      <UserMasterTable />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">face</span>
          <span className="material-symbols-outlined text-4xl">verified_user</span>
          <span className="material-symbols-outlined text-4xl">security</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Biometric Identity Integrated • Global Audit Trail Active • SARAS ID-v4</p>
      </div>
    </div>
  );
};

export default UserManagement;
