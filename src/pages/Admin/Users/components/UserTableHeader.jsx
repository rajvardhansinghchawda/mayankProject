import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserTableHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">User Directory</h1>
        <p className="text-on-surface-variant font-medium text-lg">Manage all institutional identities and permissions in one place.</p>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/admin/users/bulk-upload')}
          className="bg-white text-primary border-2 border-primary/10 px-8 py-4 rounded-2xl font-black text-sm hover:bg-primary/5 transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined">group_add</span>
          Bulk Import
        </button>
        <button 
          onClick={() => navigate('/admin/users/add')}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add Individual
        </button>
      </div>
    </div>
  );
};

export default UserTableHeader;
